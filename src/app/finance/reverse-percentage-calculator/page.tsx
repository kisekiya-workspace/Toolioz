import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import PercentageToolPage from '../percentage-tools/PercentageToolPage';
import { PERCENTAGE_TOOL_CONFIGS } from '../percentage-tools/percentage-tool-data';

const config = PERCENTAGE_TOOL_CONFIGS.reverse;
export const metadata = buildPageMetadata({ title: 'Reverse Percentage Calculator Original Value', description: 'The calculator finds an original amount before a percentage increase or decrease and shows the inverse formula, multiplier, and forward check.', path: config.path, keywords: ['reverse percentage calculator original value', 'find original price after discount calculator', 'work backwards percentage calculator', 'original amount before percentage increase'] });
export default function Page() { return <><JSONLD data={[buildCalculatorJsonLd({ name: config.title, description: config.subtitle, path: config.path }), buildHowToJsonLd({ name: `How to use the ${config.title}`, description: config.directAnswer, path: config.path, steps: config.steps.map((text, index) => ({ name: `Step ${index + 1}`, text })) }), buildBreadcrumbJsonLd([{ name: 'Finance calculators', url: '/finance' }, { name: config.title, url: config.path }])]} /><PercentageToolPage kind="reverse" /></>; }
