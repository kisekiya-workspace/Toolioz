import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import PercentageToolPage from '../percentage-tools/PercentageToolPage';
import { PERCENTAGE_TOOL_CONFIGS } from '../percentage-tools/percentage-tool-data';

const config = PERCENTAGE_TOOL_CONFIGS.percentage;
export const metadata = buildPageMetadata({ title: 'Percentage Calculator With Steps', description: 'The calculator finds P% of a number or what percent X is of Y, with formulas, worked steps, decimal support, and instant private results.', path: config.path, keywords: ['percentage calculator with steps', 'what percent is x of y calculator', 'what is x percent of y', 'percentage of a number calculator'] });
export default function Page() { return <><JSONLD data={[buildCalculatorJsonLd({ name: config.title, description: config.subtitle, path: config.path }), buildHowToJsonLd({ name: `How to use the ${config.title}`, description: config.directAnswer, path: config.path, steps: config.steps.map((text, index) => ({ name: `Step ${index + 1}`, text })) }), buildBreadcrumbJsonLd([{ name: 'Finance calculators', url: '/finance' }, { name: config.title, url: config.path }])]} /><PercentageToolPage kind="percentage" /></>; }
