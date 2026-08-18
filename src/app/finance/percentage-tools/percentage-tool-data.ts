export type PercentageToolKind = 'percentage' | 'change' | 'reverse' | 'discount';

export interface PercentageToolConfig {
  kind: PercentageToolKind;
  path: string;
  toolId: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  directAnswer: string;
  formula: string;
  explanationTitle: string;
  explanation: string;
  steps: string[];
  exampleTitle: string;
  examples: Array<{ scenario: string; working: string; result: string }>;
  mistakes: Array<{ title: string; text: string }>;
  faqs: Array<{ question: string; answer: string }>;
  source?: { label: string; href: string };
}

export const PERCENTAGE_TOOL_CONFIGS: Record<PercentageToolKind, PercentageToolConfig> = {
  percentage: {
    kind: 'percentage', path: '/finance/percentage-calculator', toolId: 'percentage-calculator', eyebrow: 'Everyday percentage math',
    title: 'Percentage Calculator With Steps',
    subtitle: 'Find a percentage of any number or calculate what percent one number is of another.',
    directAnswer: 'A percentage describes a value out of 100. To find P% of a number, multiply the number by P ÷ 100. To find what percent X is of Y, divide X by Y and multiply by 100.',
    formula: 'P% of N = (P ÷ 100) × N   •   X is what % of Y = (X ÷ Y) × 100',
    explanationTitle: 'How does the percentage calculator work?',
    explanation: 'The calculator separates two questions that are often confused. “What is 15% of 240?” asks for a portion of a known whole. “36 is what percent of 240?” asks how large one value is relative to another. Selecting the question first keeps the numerator and denominator in the correct order, while the worked line makes the arithmetic easy to audit.',
    steps: ['Choose whether to find a percentage of a number or compare two numbers.', 'Enter the percentage and whole, or enter the part and whole.', 'Read the result, substituted formula, and rounded value instantly.'],
    exampleTitle: 'Percentage calculator examples for everyday questions',
    examples: [
      { scenario: 'What is 18% of 250?', working: '(18 ÷ 100) × 250', result: '45' },
      { scenario: '45 is what percent of 60?', working: '(45 ÷ 60) × 100', result: '75%' },
      { scenario: 'What is 7.5% of 1,200?', working: '(7.5 ÷ 100) × 1,200', result: '90' },
    ],
    mistakes: [
      { title: 'Swapping the part and whole', text: 'In “X is what percent of Y,” Y is the comparison base and belongs in the denominator.' },
      { title: 'Forgetting to divide by 100', text: 'Fifteen percent is 0.15, not 15. Convert the rate before multiplying.' },
      { title: 'Rounding too early', text: 'Keep the unrounded intermediate value and round only the displayed answer.' },
    ],
    faqs: [
      { question: 'How is a percentage of a number calculated?', answer: 'Divide the percentage by 100 and multiply that decimal by the number. For example, 20% of 80 is 0.20 × 80, which equals 16.' },
      { question: 'How can one number be expressed as a percentage of another?', answer: 'Divide the part by the whole and multiply the result by 100. The whole cannot be zero because division by zero is undefined.' },
      { question: 'Can the percentage calculator use decimals and negative numbers?', answer: 'Yes. Decimal rates and values are supported. Negative inputs are mathematically valid, although the practical meaning depends on the context.' },
    ],
    source: { label: 'ONS guidance on percentages and percentage points', href: 'https://service-manual.ons.gov.uk/content/numbers/percentages' },
  },
  change: {
    kind: 'change', path: '/finance/percentage-change-calculator', toolId: 'percentage-change-calculator', eyebrow: 'Growth and decline analysis',
    title: 'Percentage Increase or Decrease Calculator',
    subtitle: 'Measure the percentage change from an original value to a new value with the full calculation shown.',
    directAnswer: 'Percentage change measures the difference relative to the original value. Subtract the original from the new value, divide by the absolute original value, and multiply by 100. Positive results are increases; negative results are decreases.',
    formula: 'Percentage change = ((New − Original) ÷ |Original|) × 100',
    explanationTitle: 'How is percentage increase or decrease calculated?',
    explanation: 'The original value is the reference point, so it must remain in the denominator. This is why a move from 80 to 100 is a 25% increase, while a move from 100 back to 80 is a 20% decrease. The changes are not symmetric because each direction uses a different starting value. The calculator also reports the absolute change so the percentage retains real-world context.',
    steps: ['Enter the original value before the change occurred.', 'Enter the new value after the increase or decrease.', 'Review the signed percentage, direction, absolute difference, and working.'],
    exampleTitle: 'Percentage change examples with correct base values',
    examples: [
      { scenario: 'Price rises from 80 to 100', working: '((100 − 80) ÷ 80) × 100', result: '25% increase' },
      { scenario: 'Traffic falls from 500 to 425', working: '((425 − 500) ÷ 500) × 100', result: '15% decrease' },
      { scenario: 'Salary rises from 45,000 to 49,500', working: '((49,500 − 45,000) ÷ 45,000) × 100', result: '10% increase' },
    ],
    mistakes: [
      { title: 'Using the new value as the base', text: 'Percentage change is normally measured against the original value, not the final value.' },
      { title: 'Calling percentage points “percent”', text: 'A rate moving from 20% to 25% rises by 5 percentage points but increases by 25% relative to 20%.' },
      { title: 'Dividing by an original value of zero', text: 'Relative percentage change from zero is undefined; report the absolute change instead.' },
    ],
    faqs: [
      { question: 'What is the formula for percentage increase?', answer: 'Subtract the original value from the new value, divide by the original value, then multiply by 100. A positive answer indicates an increase.' },
      { question: 'What is the formula for percentage decrease?', answer: 'Use the same percentage-change formula. When the new value is lower than the original value, the answer is negative and the calculator labels its magnitude as a decrease.' },
      { question: 'Why is a 50% decrease followed by a 50% increase not equal?', answer: 'The decrease and increase use different base values. A fall from 100 to 50 is 50%, but returning from 50 to 100 requires a 100% increase.' },
      { question: 'Can percentage change be calculated from zero?', answer: 'No finite relative percentage exists when the original value is zero. The raw difference can still be stated, but division by the zero baseline is undefined.' },
    ],
    source: { label: 'U.S. Bureau of Labor Statistics percent-change method', href: 'https://www.bls.gov/cpi/factsheets/calculating-percent-changes.htm' },
  },
  reverse: {
    kind: 'reverse', path: '/finance/reverse-percentage-calculator', toolId: 'reverse-percentage-calculator', eyebrow: 'Work backward from a result',
    title: 'Reverse Percentage Calculator',
    subtitle: 'Find the original amount before a percentage increase or decrease, with the inverse formula explained.',
    directAnswer: 'A reverse percentage finds the starting value from a known final value and rate. Divide the final value by 1 plus the increase rate, or by 1 minus the decrease rate, after converting the percentage to a decimal.',
    formula: 'Original after increase = Final ÷ (1 + r)   •   Original after decrease = Final ÷ (1 − r)',
    explanationTitle: 'How does a reverse percentage find the original amount?',
    explanation: 'Forward percentage calculations multiply an original value by a percentage multiplier. Reverse calculations undo that operation by dividing by the same multiplier. A 20% discount leaves 80% of the original price, so a final price of 80 must be divided by 0.80—not increased by 20%. This distinction prevents the most common reverse-percentage error.',
    steps: ['Enter the known final amount after the percentage was applied.', 'Enter the percentage rate and choose increase or decrease.', 'Read the recovered original value, multiplier, and forward check.'],
    exampleTitle: 'Reverse percentage examples for prices and growth',
    examples: [
      { scenario: '80 after a 20% discount', working: '80 ÷ (1 − 0.20)', result: 'Original = 100' },
      { scenario: '120 after a 20% increase', working: '120 ÷ (1 + 0.20)', result: 'Original = 100' },
      { scenario: '425 after a 15% decrease', working: '425 ÷ (1 − 0.15)', result: 'Original = 500' },
    ],
    mistakes: [
      { title: 'Adding the percentage back', text: 'Increasing a discounted final price by the same rate does not reverse the discount because the base has changed.' },
      { title: 'Using the rate instead of the multiplier', text: 'For a 25% decrease, divide by 0.75, the proportion that remains—not by 0.25.' },
      { title: 'Allowing a 100% decrease', text: 'A 100% decrease produces zero from any original amount, so a unique original cannot be recovered.' },
    ],
    faqs: [
      { question: 'How is an original price found after a discount?', answer: 'Convert the discount to a decimal, subtract it from 1, and divide the sale price by that remaining multiplier. A sale price of 75 after 25% off gives 75 ÷ 0.75 = 100.' },
      { question: 'Why is adding the same percentage not a valid reversal?', answer: 'The percentage is applied to a different base. After 20% off 100, the result is 80; adding 20% of 80 returns only 96.' },
      { question: 'Can the calculator reverse both increases and decreases?', answer: 'Yes. It divides by 1 plus the decimal rate for an increase and by 1 minus the decimal rate for a decrease.' },
    ],
  },
  discount: {
    kind: 'discount', path: '/finance/discount-calculator-after-tax', toolId: 'discount-calculator-after-tax', eyebrow: 'Sale price and tax breakdown',
    title: 'Discount Calculator After Tax',
    subtitle: 'Calculate discount savings, tax on the reduced price, and the final amount payable in one clear breakdown.',
    directAnswer: 'To calculate a discounted price after tax, subtract the discount from the listed price first, then apply the tax rate to the reduced subtotal. This calculator shows discount savings, taxable subtotal, tax amount, and final price separately.',
    formula: 'Final price = Price × (1 − Discount ÷ 100) × (1 + Tax ÷ 100)',
    explanationTitle: 'How is a discount calculated before tax?',
    explanation: 'A percentage discount reduces the listed price. When tax applies to the discounted selling price, the calculator first creates the reduced subtotal and then adds tax to that subtotal. Showing each stage matters: multiplying the price by one combined, improvised rate often hides whether tax was applied before or after the discount. Local rules can differ, so the tool keeps tax optional and user-controlled.',
    steps: ['Enter the original listed price and discount percentage.', 'Enter the applicable tax rate, or leave it at zero when tax is not needed.', 'Review savings, discounted subtotal, tax amount, and final price.'],
    exampleTitle: 'Discount and tax calculator examples',
    examples: [
      { scenario: '1,000 price, 20% off, 5% tax', working: '1,000 × 0.80 × 1.05', result: 'Final = 840' },
      { scenario: '250 price, 15% off, no tax', working: '250 × 0.85', result: 'Final = 212.50' },
      { scenario: '80 price, 25% off, 8% tax', working: '80 × 0.75 × 1.08', result: 'Final = 64.80' },
    ],
    mistakes: [
      { title: 'Adding discount and tax rates together', text: 'The rates apply at different stages, so subtracting one net percentage can produce the wrong total.' },
      { title: 'Calculating tax on the list price', text: 'Where tax applies to the reduced selling price, tax must be calculated after the discount.' },
      { title: 'Ignoring local tax rules', text: 'Taxable amounts and rounding rules vary by jurisdiction; confirm the correct rate and tax base.' },
    ],
    faqs: [
      { question: 'Is tax calculated before or after a discount?', answer: 'In many ordinary retail calculations, tax is applied to the discounted selling price. Jurisdiction-specific rules may differ, so the applicable local rule should be confirmed.' },
      { question: 'How is the discount amount calculated?', answer: 'Multiply the original price by the discount rate divided by 100. Subtract that savings amount from the original price to get the discounted subtotal.' },
      { question: 'Can the discount calculator be used without tax?', answer: 'Yes. Set the tax rate to zero. The final price will then equal the original price minus the calculated discount savings.' },
      { question: 'Does the calculator support GST or VAT rates?', answer: 'Yes. Any percentage can be entered as the tax rate, but the user remains responsible for choosing the correct GST, VAT, or sales-tax rate and taxable base.' },
    ],
  },
};
