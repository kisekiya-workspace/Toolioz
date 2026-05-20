/**
 * Financial formula engine for accurate calculations.
 */

/**
 * Calculates Compound Interest.
 * Formula: A = P(1 + r/n)^(nt)
 * @param principal Initial amount
 * @param rate Annual interest rate (as a decimal, e.g., 0.05 for 5%)
 * @param timesCompounded Number of times interest is compounded per year
 * @param years Number of years
 * @returns Final amount
 */
export const calculateCompoundInterest = (
  principal: number,
  rate: number,
  timesCompounded: number,
  years: number
): number => {
  return principal * Math.pow(1 + rate / timesCompounded, timesCompounded * years);
};

/**
 * Calculates Monthly Mortgage Payment (Amortization).
 * Formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1 ]
 * @param principal Loan amount
 * @param annualRate Annual interest rate (as a decimal)
 * @param years Loan term in years
 * @returns Monthly payment
 */
export const calculateMonthlyPayment = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  const monthlyRate = annualRate / 12;
  const numberOfPayments = years * 12;
  if (monthlyRate === 0) return principal / numberOfPayments;

  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
  );
};

/**
 * Calculates inflation adjusted value.
 * Formula: Future Value = Current Value * (1 + inflationRate)^years
 * @param amount Current value
 * @param inflationRate Annual inflation rate (decimal)
 * @param years Number of years
 * @returns Inflation-adjusted value
 */
export const calculateInflation = (
  amount: number,
  inflationRate: number,
  years: number
): number => {
  return amount * Math.pow(1 + inflationRate, years);
};

/**
 * Calculates Investment ROI.
 * Formula: ROI = ((Final Value - Initial Value) / Initial Value) * 100
 * @param initialValue Initial investment
 * @param finalValue Final value
 * @returns ROI percentage
 */
export const calculateROI = (
  initialValue: number,
  finalValue: number
): number => {
  if (initialValue === 0) return 0;
  return ((finalValue - initialValue) / initialValue) * 100;
};

/**
 * Calculates SIP (Systematic Investment Plan) Maturity Amount.
 * Formula: M = P * [ ((1 + i)^n - 1) / i ] * (1 + i)
 * @param monthlyInvestment Monthly contribution
 * @param annualRate Annual interest rate (decimal)
 * @param years Number of years
 * @returns Maturity amount
 */
export const calculateSIP = (
  monthlyInvestment: number,
  annualRate: number,
  years: number
): number => {
  const i = annualRate / 12;
  const n = years * 12;
  if (i === 0) return monthlyInvestment * n;
  return monthlyInvestment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
};

/**
 * Calculates GST/Tax.
 * @param amount Total or Base amount
 * @param rate Tax rate (percentage)
 * @param isInclusive Whether the amount already includes tax
 * @returns Breakdown of tax and base amounts
 */
export const calculateTax = (
  amount: number,
  rate: number,
  isInclusive: boolean = false
): { taxAmount: number; totalAmount: number; baseAmount: number } => {
  if (isInclusive) {
    const baseAmount = amount / (1 + rate / 100);
    const taxAmount = amount - baseAmount;
    return {
      taxAmount,
      totalAmount: amount,
      baseAmount
    };
  } else {
    const taxAmount = (amount * rate) / 100;
    return {
      taxAmount,
      totalAmount: amount + taxAmount,
      baseAmount: amount
    };
  }
};

/**
 * Calculates Fixed Deposit (FD).
 * Typically compounded quarterly in many regions.
 * @param principal Initial deposit
 * @param annualRate Annual rate (decimal)
 * @param years Tenure in years
 * @returns Maturity amount
 */
export const calculateFD = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  const timesCompounded = 4; // Quarterly
  return calculateCompoundInterest(principal, annualRate, timesCompounded, years);
};

/**
 * Calculates monthly savings required to reach a goal.
 * @param targetAmount Goal amount
 * @param annualRate Expected returns (decimal)
 * @param years Time horizon
 * @returns Required monthly investment
 */
export const calculateSavingsGoal = (
  targetAmount: number,
  annualRate: number,
  years: number
): number => {
  const i = annualRate / 12;
  const n = years * 12;
  if (i === 0) return targetAmount / n;
  return (targetAmount * i) / ( (Math.pow(1 + i, n) - 1) * (1 + i) );
};

/**
 * Calculates a lump sum investment projection.
 * Uses monthly compounding for a smoother long-term estimate.
 */
export const calculateLumpsum = (
  principal: number,
  annualRate: number,
  years: number
): number => {
  return calculateCompoundInterest(principal, annualRate, 12, years);
};

export interface RetirementCorpusResult {
  futureMonthlyExpense: number;
  annualExpenseAtRetirement: number;
  corpusNeeded: number;
  futureValueOfCurrentSavings: number;
  shortfall: number;
  monthlySavingsNeeded: number;
}

/**
 * Estimates the retirement corpus required based on inflation and a withdrawal horizon.
 */
export const calculateRetirementCorpus = (
  currentMonthlyExpense: number,
  yearsToRetirement: number,
  yearsInRetirement: number,
  inflationRate: number,
  preRetirementReturn: number,
  postRetirementReturn: number,
  currentSavings: number = 0
): RetirementCorpusResult => {
  const inflatedExpense = currentMonthlyExpense * Math.pow(1 + inflationRate, yearsToRetirement);
  const annualExpense = inflatedExpense * 12;

  const corpusNeeded =
    postRetirementReturn === 0
      ? annualExpense * yearsInRetirement
      : annualExpense * ((1 - Math.pow(1 + postRetirementReturn, -yearsInRetirement)) / postRetirementReturn);

  const futureValueOfCurrentSavings = calculateCompoundInterest(
    currentSavings,
    preRetirementReturn,
    12,
    yearsToRetirement
  );

  const shortfall = Math.max(corpusNeeded - futureValueOfCurrentSavings, 0);
  const monthlySavingsNeeded =
    yearsToRetirement <= 0 ? shortfall : calculateSavingsGoal(shortfall, preRetirementReturn, yearsToRetirement);

  return {
    futureMonthlyExpense: inflatedExpense,
    annualExpenseAtRetirement: annualExpense,
    corpusNeeded,
    futureValueOfCurrentSavings,
    shortfall,
    monthlySavingsNeeded,
  };
};

export interface LoanPrepaymentResult {
  baseEmi: number;
  totalInterestWithoutPrepayment: number;
  totalInterestWithPrepayment: number;
  interestSaved: number;
  monthsToClose: number;
  monthsSaved: number;
  totalPaidWithPrepayment: number;
}

/**
 * Simulates how extra payments reduce loan interest and the loan tenure.
 */
export const calculateLoanPrepayment = (
  principal: number,
  annualRate: number,
  yearsRemaining: number,
  extraMonthlyPayment: number = 0
): LoanPrepaymentResult => {
  if (principal <= 0 || yearsRemaining <= 0) {
    return {
      baseEmi: 0,
      totalInterestWithoutPrepayment: 0,
      totalInterestWithPrepayment: 0,
      interestSaved: 0,
      monthsToClose: 0,
      monthsSaved: 0,
      totalPaidWithPrepayment: 0,
    };
  }

  const totalMonths = Math.max(Math.round(yearsRemaining * 12), 1);
  const monthlyRate = annualRate / 12;
  const safeExtraPayment = Math.max(extraMonthlyPayment, 0);
  const baseEmi = calculateMonthlyPayment(principal, annualRate, yearsRemaining);
  const totalInterestWithoutPrepayment = Math.max(baseEmi * totalMonths - principal, 0);
  const monthlyPayment = baseEmi + safeExtraPayment;

  if (principal <= 0) {
    return {
      baseEmi: 0,
      totalInterestWithoutPrepayment: 0,
      totalInterestWithPrepayment: 0,
      interestSaved: 0,
      monthsToClose: 0,
      monthsSaved: 0,
      totalPaidWithPrepayment: 0,
    };
  }

  if (monthlyRate === 0) {
    const monthsToClose = Math.ceil(principal / Math.max(monthlyPayment, 1));
    return {
      baseEmi,
      totalInterestWithoutPrepayment,
      totalInterestWithPrepayment: 0,
      interestSaved: totalInterestWithoutPrepayment,
      monthsToClose,
      monthsSaved: Math.max(totalMonths - monthsToClose, 0),
      totalPaidWithPrepayment: principal,
    };
  }

  let balance = principal;
  let monthsToClose = 0;
  let totalInterestWithPrepayment = 0;
  const safetyLimit = totalMonths * 3 + 120;

  while (balance > 0.01 && monthsToClose < safetyLimit) {
    const interestForMonth = balance * monthlyRate;
    const actualPayment = Math.min(monthlyPayment, balance + interestForMonth);
    const principalReduction = actualPayment - interestForMonth;

    if (principalReduction <= 0) {
      break;
    }

    balance = Math.max(0, balance + interestForMonth - actualPayment);
    totalInterestWithPrepayment += interestForMonth;
    monthsToClose += 1;
  }

  const interestSaved = Math.max(totalInterestWithoutPrepayment - totalInterestWithPrepayment, 0);

  return {
    baseEmi,
    totalInterestWithoutPrepayment,
    totalInterestWithPrepayment,
    interestSaved,
    monthsToClose,
    monthsSaved: Math.max(totalMonths - monthsToClose, 0),
    totalPaidWithPrepayment: principal + totalInterestWithPrepayment,
  };
};

/**
 * Global Income Tax Calculation Logic
 */

export type Country = 'IN' | 'US' | 'UK';
export type FilingStatus = 'single' | 'married' | 'senior';

export interface TaxResult {
  taxableIncome: number;
  taxAmount: number;
  socialSecurity?: number; // NI for UK, FICA for US
  cess?: number;
  takeHome: number;
  effectiveRate: number;
}

/**
 * Calculates Income Tax based on country and specific parameters.
 */
export const calculateIncomeTax = (
  income: number,
  deductions: number,
  country: Country,
  status: FilingStatus = 'single',
  regime: 'old' | 'new' = 'new',
  year: number = 2025
): TaxResult => {
  if (country === 'IN') {
    return calculateIndiaTax(income - deductions, status, regime, year);
  } else if (country === 'US') {
    return calculateUSATax(income - deductions, status, year);
  } else if (country === 'UK') {
    return calculateUKTax(income - deductions);
  }
  return { taxableIncome: 0, taxAmount: 0, takeHome: 0, effectiveRate: 0 };
};

const calculateIndiaTax = (taxableIncome: number, status: FilingStatus, regime: 'old' | 'new', year: number): TaxResult => {
  let tax = 0;
  if (regime === 'new') {
    // New regime slabs (uniform across age groups since FY 2023-24)
    if (year >= 2025) {
      if (taxableIncome > 400000) tax += (Math.min(taxableIncome, 800000) - 400000) * 0.05;
      if (taxableIncome > 800000) tax += (Math.min(taxableIncome, 1200000) - 800000) * 0.10;
      if (taxableIncome > 1200000) tax += (Math.min(taxableIncome, 1600000) - 1200000) * 0.15;
      if (taxableIncome > 1600000) tax += (Math.min(taxableIncome, 2000000) - 1600000) * 0.20;
      if (taxableIncome > 2000000) tax += (Math.min(taxableIncome, 2400000) - 2000000) * 0.25;
      if (taxableIncome > 2400000) tax += (taxableIncome - 2400000) * 0.30;
      
      const rebateLimit = year === 2026 ? 1200000 : 700000;
      if (taxableIncome <= rebateLimit) tax = 0;
    } else {
      if (taxableIncome > 300000) tax += (Math.min(taxableIncome, 600000) - 300000) * 0.05;
      if (taxableIncome > 600000) tax += (Math.min(taxableIncome, 900000) - 600000) * 0.10;
      if (taxableIncome > 900000) tax += (Math.min(taxableIncome, 1200000) - 900000) * 0.15;
      if (taxableIncome > 1200000) tax += (Math.min(taxableIncome, 1500000) - 1200000) * 0.20;
      if (taxableIncome > 1500000) tax += (taxableIncome - 1500000) * 0.30;
      if (taxableIncome <= 700000) tax = 0;
    }
  } else {
    // Old Regime - Age based exemption
    const exemption = status === 'senior' ? 300000 : 250000;
    if (taxableIncome > exemption) tax += (Math.min(taxableIncome, 500000) - exemption) * 0.05;
    if (taxableIncome > 500000) tax += (Math.min(taxableIncome, 1000000) - 500000) * 0.20;
    if (taxableIncome > 1000000) tax += (taxableIncome - 1000000) * 0.30;
    if (taxableIncome <= 500000) tax = 0;
  }

  const cess = tax * 0.04;
  const totalTax = tax + cess;
  return { 
    taxableIncome, 
    taxAmount: totalTax, 
    takeHome: taxableIncome - totalTax,
    effectiveRate: (totalTax / (taxableIncome || 1)) * 100 
  };
};

const calculateUSATax = (taxableIncome: number, status: FilingStatus, year: number): TaxResult => {
  let tax = 0;
  // Brackets for Single vs Married
  const singleBrackets = year === 2026 
    ? [12400, 50400, 105700, 201775, 256225, 640600]
    : [11925, 48475, 103350, 197300, 250525, 626350];
  
  const marriedBrackets = singleBrackets.map(b => b * 2);
  const brackets = status === 'married' ? marriedBrackets : singleBrackets;
  const rates = [0.10, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37];

  let previousLimit = 0;
  for (let i = 0; i < brackets.length; i++) {
    if (taxableIncome > brackets[i]) {
      tax += (brackets[i] - previousLimit) * rates[i];
      previousLimit = brackets[i];
    } else {
      tax += (taxableIncome - previousLimit) * rates[i];
      previousLimit = taxableIncome;
      break;
    }
  }
  if (taxableIncome > previousLimit) {
    tax += (taxableIncome - previousLimit) * rates[rates.length - 1];
  }

  // FICA: Social Security (6.2% up to wage base) + Medicare (1.45% on all income)
  const ssWageBase = year === 2026 ? 177500 : 176100;
  const socialSecurity = Math.min(taxableIncome, ssWageBase) * 0.062;
  const medicare = taxableIncome * 0.0145;
  const fica = socialSecurity + medicare;
  const totalBurden = tax + fica;

  return { 
    taxableIncome, 
    taxAmount: tax, 
    socialSecurity: fica,
    takeHome: taxableIncome - totalBurden,
    effectiveRate: (totalBurden / (taxableIncome || 1)) * 100 
  };
};

const calculateUKTax = (taxableIncome: number): TaxResult => {
  const personalAllowance = 12570;
  const incomeAboveAllowance = Math.max(0, taxableIncome - personalAllowance);
  
  let tax = 0;
  if (incomeAboveAllowance > 0) {
    tax += Math.min(incomeAboveAllowance, 37700) * 0.20;
    if (incomeAboveAllowance > 37700) tax += (Math.min(incomeAboveAllowance, 125140) - 37700) * 0.40;
    if (incomeAboveAllowance > 125140) tax += (incomeAboveAllowance - 125140) * 0.45;
  }

  if (taxableIncome > 100000) {
    const reduction = Math.min(personalAllowance, (taxableIncome - 100000) / 2);
    tax += reduction * 0.40; 
  }

  // National Insurance (NI) - Class 1 employees ~8% (simplified)
  const niThreshold = 12570;
  const ni = Math.max(0, (taxableIncome - niThreshold) * 0.08);

  return { 
    taxableIncome, 
    taxAmount: tax, 
    socialSecurity: ni,
    takeHome: taxableIncome - tax - ni,
    effectiveRate: ((tax + ni) / (taxableIncome || 1)) * 100 
  };
};
