export type SourceFormat = 'ITR-1' | 'ITR-2' | 'ITR-3' | 'ITR-4' | 'GENERIC-JSON' | 'FORM-16';

export interface AmountLine {
  code: string;
  label: string;
  amount: number;
  sourcePath?: string;
}

export interface TaxComputation {
  schemaVersion: 'toolioz.tax-computation.v1';
  sourceFormat: SourceFormat;
  assessmentYear?: string;
  taxpayer: { name?: string; pan?: string };
  income: AmountLine[];
  deductions: AmountLine[];
  taxes: AmountLine[];
  summary: {
    grossTotalIncome: number | null;
    totalDeductions: number | null;
    totalIncome: number | null;
    totalTaxLiability: number | null;
    totalTaxesPaid: number | null;
    balancePayable: number | null;
    refundDue: number | null;
  };
  warnings: string[];
}

export interface NormalizedForm16 {
  schemaVersion: 'toolioz.form16.v1';
  documentType: 'FORM_16';
  assessmentYear?: string;
  employee: { name?: string; pan?: string };
  employer: { name?: string; pan?: string; tan?: string };
  salary: {
    grossSalary: number | null;
    exemptAllowances: number | null;
    netSalary: number | null;
    standardDeduction: number | null;
    entertainmentAllowance: number | null;
    professionalTax: number | null;
    incomeChargeableUnderSalaries: number | null;
  };
  chapterVIA: Record<string, number | null> & { total: number | null };
  tax: {
    totalIncome: number | null;
    taxOnTotalIncome: number | null;
    rebate87A: number | null;
    surcharge: number | null;
    healthEducationCess: number | null;
    relief89: number | null;
    netTaxPayable: number | null;
    tds: number | null;
  };
  warnings: string[];
}

type JsonObject = Record<string, unknown>;

const isObject = (value: unknown): value is JsonObject => Boolean(value) && typeof value === 'object' && !Array.isArray(value);
const finite = (value: unknown): number | null => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[₹,\s]/g, '').replace(/\(([^)]+)\)/, '-$1');
    if (/^-?\d+(?:\.\d+)?$/.test(cleaned)) return Number(cleaned);
  }
  return null;
};
const get = (object: unknown, path: string): unknown => path.split('.').reduce<unknown>((value, key) => isObject(value) ? value[key] : undefined, object);
const amount = (object: unknown, path: string): number | null => finite(get(object, path));
const firstAmount = (object: unknown, paths: string[]): { value: number | null; path?: string } => {
  for (const path of paths) { const value = amount(object, path); if (value !== null) return { value, path }; }
  return { value: null };
};
const firstText = (object: unknown, paths: string[]): string | undefined => {
  for (const path of paths) { const value = get(object, path); if (typeof value === 'string' && value.trim()) return value.trim(); }
  return undefined;
};
const addLine = (target: AmountLine[], object: unknown, code: string, label: string, paths: string[]) => {
  const found = firstAmount(object, paths);
  if (found.value !== null) target.push({ code, label, amount: found.value, sourcePath: found.path });
};
const sum = (lines: AmountLine[]) => lines.reduce((total, line) => total + line.amount, 0);
const roundRupee = (value: number) => Math.round(value);

function assesseeName(personalInfo: unknown): string | undefined {
  const name = get(personalInfo, 'AssesseeName');
  if (typeof name === 'string') return name;
  if (!isObject(name)) return firstText(personalInfo, ['Name', 'FullName']);
  return [name.FirstName, name.MiddleName, name.SurNameOrOrgName].filter(value => typeof value === 'string' && value.trim()).join(' ') || undefined;
}

function officialItrRoot(input: JsonObject): { format: SourceFormat; root: JsonObject } | null {
  const itr = isObject(input.ITR) ? input.ITR : input;
  for (const form of ['ITR1', 'ITR2', 'ITR3', 'ITR4'] as const) {
    if (isObject(itr[form])) return { format: `ITR-${form.slice(3)}` as SourceFormat, root: itr[form] as JsonObject };
  }
  return null;
}

function buildOfficialItr(input: JsonObject, format: SourceFormat, root: JsonObject): TaxComputation {
  const warnings: string[] = [];
  const income: AmountLine[] = [];
  const deductions: AmountLine[] = [];
  const taxes: AmountLine[] = [];
  const isCompact = format === 'ITR-1' || format === 'ITR-4';
  const incomeNode = format === 'ITR-1' ? get(root, 'ITR1_IncomeDeductions') : format === 'ITR-4' ? get(root, 'IncomeDeductions') : get(root, 'PartB-TI');
  const taxNode = format === 'ITR-1' ? get(root, 'ITR1_TaxComputation') : format === 'ITR-4' ? get(root, 'TaxComputation') : get(root, 'PartB_TTI');
  const personal = format === 'ITR-2' || format === 'ITR-3' ? get(root, 'PartA_GEN1.PersonalInfo') ?? get(root, 'PartA_GEN1') : get(root, 'PersonalInfo');

  if (isCompact) {
    addLine(income, incomeNode, 'SALARY', 'Income from salary', ['IncomeFromSal']);
    addLine(income, incomeNode, 'HOUSE_PROPERTY', 'Income from house property', ['TotalIncomeChargeableUnHP']);
    addLine(income, incomeNode, 'BUSINESS', 'Income from business or profession', ['IncomeFromBusinessProf']);
    addLine(income, incomeNode, 'OTHER_SOURCES', 'Income from other sources', ['IncomeOthSrc']);
    addLine(income, incomeNode, 'LTCG_112A', 'Long-term capital gain under section 112A', ['LTCG112A.TotalLTCG112A', 'TotalLTCG112A']);
    const deductionNode = get(incomeNode, 'DeductUndChapVIA');
    for (const [code, label] of [['Section80C', 'Section 80C'], ['Section80CCD1B', 'Section 80CCD(1B)'], ['Section80CCDEmployer', 'Section 80CCD(2)'], ['Section80D', 'Section 80D'], ['Section80E', 'Section 80E'], ['Section80G', 'Section 80G'], ['Section80TTA', 'Section 80TTA'], ['Section80TTB', 'Section 80TTB']] as const) addLine(deductions, deductionNode, code, label, [code]);
  } else {
    addLine(income, incomeNode, 'SALARY', 'Income from salary', ['Salaries']);
    addLine(income, incomeNode, 'HOUSE_PROPERTY', 'Income from house property', ['IncomeFromHP']);
    addLine(income, incomeNode, 'CAPITAL_GAINS', 'Capital gains', ['CapGain.TotalCapGains', 'CapGain.ShortTermLongTermTotal']);
    addLine(income, incomeNode, 'OTHER_SOURCES', 'Income from other sources', ['IncFromOS.TotalIncomeOfOS', 'IncFromOS.TotalOS']);
  }

  const gross = firstAmount(incomeNode, isCompact ? ['GrossTotIncomeIncLTCG112A', 'GrossTotIncome'] : ['GrossTotalIncome']);
  const totalDed = firstAmount(incomeNode, isCompact ? ['DeductUndChapVIA.TotalChapVIADeductions'] : ['DeductionsUnderScheduleVIA']);
  const totalIncome = firstAmount(incomeNode, ['TotalIncome']);
  addLine(taxes, taxNode, 'TAX_BEFORE_REBATE', 'Tax before rebate', ['TotalTaxPayable', 'TaxPayableOnTI']);
  addLine(taxes, taxNode, 'REBATE_87A', 'Rebate under section 87A', ['Rebate87A']);
  addLine(taxes, taxNode, 'CESS', 'Health and education cess', ['EducationCess', 'HealthEduCess']);
  addLine(taxes, taxNode, 'NET_TAX', 'Net tax liability', ['NetTaxLiability', 'NetTaxPayable']);
  addLine(taxes, taxNode, 'INTEREST', 'Interest and fee', ['TotalIntrstPay', 'IntrstPay.TotalIntrstPay']);

  const taxesPaidNode = get(root, 'TaxPaid.TaxesPaid') ?? get(taxNode, 'TaxPaid');
  const taxesPaid = firstAmount(taxesPaidNode, ['TotalTaxesPaid', 'TaxesPaid']);
  const balance = firstAmount(root, ['TaxPaid.BalTaxPayable', 'PartB_TTI.BalTaxPayable']);
  const refund = firstAmount(root, ['Refund.RefundDue', 'PartB_TTI.RefundDue']);
  const liability = firstAmount(taxNode, ['TotTaxPlusIntrstPay', 'NetTaxLiability', 'NetTaxPayable']);

  if (gross.value === null) warnings.push('Gross total income was not found in the expected official ITR summary section.');
  if (totalIncome.value === null) warnings.push('Total income was not found in the expected official ITR summary section.');
  if (!isObject(taxNode)) warnings.push('Tax computation section was not found; tax liability values are unavailable.');

  const formKey = `Form_ITR${format.slice(4)}`;
  return {
    schemaVersion: 'toolioz.tax-computation.v1', sourceFormat: format,
    assessmentYear: firstText(root, [`${formKey}.AssessmentYear`, 'Form_ITR1.AssessmentYear', 'Form_ITR4.AssessmentYear']),
    taxpayer: { name: assesseeName(personal), pan: firstText(personal, ['PAN']) }, income, deductions, taxes,
    summary: { grossTotalIncome: gross.value, totalDeductions: totalDed.value, totalIncome: totalIncome.value, totalTaxLiability: liability.value, totalTaxesPaid: taxesPaid.value, balancePayable: balance.value, refundDue: refund.value },
    warnings,
  };
}

function buildGeneric(input: JsonObject): TaxComputation {
  const income: AmountLine[] = [], deductions: AmountLine[] = [], taxes: AmountLine[] = [], warnings: string[] = [];
  const aliases = {
    salary: ['salary', 'income.salary', 'grossSalary'], house: ['housePropertyIncome', 'rentalIncome', 'income.houseProperty'], business: ['businessIncome', 'professionalIncome', 'income.business'], capital: ['capitalGains', 'income.capitalGains'], other: ['otherIncome', 'interestIncome', 'income.otherSources'],
  };
  addLine(income, input, 'SALARY', 'Salary income', aliases.salary); addLine(income, input, 'HOUSE_PROPERTY', 'House property income', aliases.house); addLine(income, input, 'BUSINESS', 'Business or professional income', aliases.business); addLine(income, input, 'CAPITAL_GAINS', 'Capital gains', aliases.capital); addLine(income, input, 'OTHER_SOURCES', 'Other-source income', aliases.other);
  addLine(deductions, input, '80C', 'Section 80C', ['deductions80C', 'deductions.section80C']); addLine(deductions, input, '80CCD1B', 'Section 80CCD(1B)', ['deductions80CCD1B', 'deductions.section80CCD1B']); addLine(deductions, input, '80D', 'Section 80D', ['deductions80D', 'deductions.section80D']); addLine(deductions, input, 'OTHER', 'Other deductions', ['otherDeductions', 'deductions.other']);
  addLine(taxes, input, 'TDS', 'Tax deducted at source', ['tds', 'taxes.tds']); addLine(taxes, input, 'ADVANCE_TAX', 'Advance tax', ['advanceTax', 'taxes.advanceTax']); addLine(taxes, input, 'SELF_ASSESSMENT', 'Self-assessment tax', ['selfAssessmentTax', 'taxes.selfAssessmentTax']);
  const reportedGross = firstAmount(input, ['grossTotalIncome', 'summary.grossTotalIncome']); const reportedDed = firstAmount(input, ['totalDeductions', 'summary.totalDeductions']); const reportedTotal = firstAmount(input, ['totalIncome', 'taxableIncome', 'summary.totalIncome']);
  const gross = reportedGross.value ?? (income.length ? roundRupee(sum(income)) : null); const totalDed = reportedDed.value ?? (deductions.length ? roundRupee(sum(deductions)) : 0); const totalIncome = reportedTotal.value ?? (gross !== null ? Math.max(0, roundRupee(gross - totalDed)) : null);
  if (!income.length && reportedGross.value === null) warnings.push('No supported income fields were found. Use the example schema or an official ITR JSON.');
  warnings.push('Generic JSON totals are arithmetic summaries only; no slab, regime, loss set-off, special-rate, surcharge, rebate, or marginal-relief calculation is applied.');
  return { schemaVersion: 'toolioz.tax-computation.v1', sourceFormat: 'GENERIC-JSON', assessmentYear: firstText(input, ['assessmentYear', 'meta.assessmentYear']), taxpayer: { name: firstText(input, ['name', 'taxpayer.name']), pan: firstText(input, ['pan', 'taxpayer.pan']) }, income, deductions, taxes, summary: { grossTotalIncome: gross, totalDeductions: totalDed, totalIncome, totalTaxLiability: firstAmount(input, ['totalTaxLiability', 'summary.totalTaxLiability']).value, totalTaxesPaid: taxes.length ? sum(taxes) : null, balancePayable: firstAmount(input, ['balancePayable']).value, refundDue: firstAmount(input, ['refundDue']).value }, warnings };
}

export function parseIncomeJson(input: unknown): TaxComputation {
  if (!isObject(input)) throw new Error('The top level must be a JSON object.');
  const official = officialItrRoot(input);
  return official ? buildOfficialItr(input, official.format, official.root) : buildGeneric(input);
}

const findText = (text: string, patterns: RegExp[]): string | undefined => {
  for (const pattern of patterns) { const match = text.match(pattern); if (match?.[1]?.trim()) return match[1].trim(); }
  return undefined;
};
const findMoney = (text: string, labels: string[]): number | null => {
  for (const label of labels) {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = text.match(new RegExp(`${escaped}[^₹\\d-]{0,80}(?:Rs\\.?|₹)?\\s*([\\d,]+(?:\\.\\d{1,2})?)`, 'i'));
    if (match) return finite(match[1]);
  }
  return null;
};

export function parseForm16Text(text: string): NormalizedForm16 {
  const clean = text.replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').trim();
  if (clean.length < 20) throw new Error('Not enough Form 16 text was found. Paste the text or load a searchable PDF.');
  const panMatches = [...clean.matchAll(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/g)].map(match => match[0]);
  const totalDeductions = findMoney(clean, ['Aggregate of deductible amount under Chapter VI-A', 'Total amount deductible under Chapter VI-A', 'Total deductions under Chapter VI-A']);
  const result: NormalizedForm16 = {
    schemaVersion: 'toolioz.form16.v1', documentType: 'FORM_16', assessmentYear: findText(clean, [/Assessment Year\s*[:\-]?\s*(20\d{2}(?:-\d{2})?)/i]),
    employee: { name: findText(clean, [/(?:Name of the Employee|Employee Name)\s*[:\-]?\s*([^\n|]{2,100})/i]), pan: panMatches[1] ?? panMatches[0] },
    employer: { name: findText(clean, [/(?:Name and address of the Employer|Employer Name)\s*[:\-]?\s*([^\n|]{2,120})/i]), pan: panMatches.length > 1 ? panMatches[0] : undefined, tan: findText(clean, [/(?:TAN of the Deductor|TAN)\s*[:\-]?\s*([A-Z]{4}[0-9]{5}[A-Z])/i]) },
    salary: { grossSalary: findMoney(clean, ['Gross salary', 'Gross Salary']), exemptAllowances: findMoney(clean, ['Total amount of any exemption claimed under section 10', 'Allowances to the extent exempt under section 10']), netSalary: findMoney(clean, ['Total amount of salary received from current employer', 'Balance']), standardDeduction: findMoney(clean, ['Standard deduction under section 16(ia)', 'Standard Deduction']), entertainmentAllowance: findMoney(clean, ['Entertainment allowance under section 16(ii)']), professionalTax: findMoney(clean, ['Tax on employment under section 16(iii)', 'Professional Tax']), incomeChargeableUnderSalaries: findMoney(clean, ['Income chargeable under the head Salaries', 'Income chargeable under the head salary']) },
    chapterVIA: { section80C: findMoney(clean, ['Deduction in respect of life insurance premia, contributions to provident fund etc. under section 80C', 'Section 80C']), section80CCD1B: findMoney(clean, ['Section 80CCD(1B)']), section80D: findMoney(clean, ['Deduction in respect of health insurance premia under section 80D', 'Section 80D']), section80E: findMoney(clean, ['Section 80E']), section80G: findMoney(clean, ['Section 80G']), total: totalDeductions },
    tax: { totalIncome: findMoney(clean, ['Total taxable income', 'Total Income']), taxOnTotalIncome: findMoney(clean, ['Tax on total income']), rebate87A: findMoney(clean, ['Rebate under section 87A']), surcharge: findMoney(clean, ['Surcharge']), healthEducationCess: findMoney(clean, ['Health and education cess', 'Education cess']), relief89: findMoney(clean, ['Relief under section 89']), netTaxPayable: findMoney(clean, ['Net tax payable', 'Tax payable']), tds: findMoney(clean, ['Total tax deducted', 'Tax deducted at source', 'TDS Deducted']) },
    warnings: [],
  };
  if (!result.assessmentYear) result.warnings.push('Assessment year was not detected.');
  if (!result.salary.grossSalary && !result.salary.incomeChargeableUnderSalaries) result.warnings.push('Salary totals were not detected. The PDF may be scanned or its text order may not be extractable.');
  if (!result.employee.pan) result.warnings.push('Employee PAN was not detected.');
  result.warnings.push('Form 16 layouts vary by employer and TRACES version. Verify every extracted value against the signed certificate.');
  return result;
}

export function form16ToComputation(form: NormalizedForm16): TaxComputation {
  const income: AmountLine[] = [], deductions: AmountLine[] = [], taxes: AmountLine[] = [];
  if (form.salary.incomeChargeableUnderSalaries !== null) income.push({ code: 'SALARY', label: 'Income chargeable under salaries', amount: form.salary.incomeChargeableUnderSalaries });
  else if (form.salary.grossSalary !== null) income.push({ code: 'GROSS_SALARY', label: 'Gross salary', amount: form.salary.grossSalary });
  Object.entries(form.chapterVIA).forEach(([code, value]) => { if (code !== 'total' && typeof value === 'number') deductions.push({ code, label: code.replace(/^section/i, 'Section '), amount: value }); });
  if (form.tax.tds !== null) taxes.push({ code: 'TDS', label: 'Tax deducted at source', amount: form.tax.tds });
  const gross = form.salary.incomeChargeableUnderSalaries ?? form.salary.grossSalary;
  return { schemaVersion: 'toolioz.tax-computation.v1', sourceFormat: 'FORM-16', assessmentYear: form.assessmentYear, taxpayer: form.employee, income, deductions, taxes, summary: { grossTotalIncome: gross, totalDeductions: form.chapterVIA.total, totalIncome: form.tax.totalIncome, totalTaxLiability: form.tax.netTaxPayable ?? form.tax.taxOnTotalIncome, totalTaxesPaid: form.tax.tds, balancePayable: null, refundDue: null }, warnings: form.warnings };
}
