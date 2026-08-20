import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import PercentageToolPage from '../percentage-tools/PercentageToolPage';
import { PERCENTAGE_TOOL_CONFIGS } from '../percentage-tools/percentage-tool-data';

const config = PERCENTAGE_TOOL_CONFIGS.change;
export const metadata = buildPageMetadata({ title: 'Percentage Increase or Decrease Calculator', description: 'The calculator measures percentage increase or decrease from old to new values and shows the signed rate, absolute change, formula, and steps.', path: config.path, keywords: ['increase percentage calculator', 'percentage increase decrease calculator with steps', 'percentage change from old to new value', 'salary percentage increase calculator', 'percentage decrease calculator'] });
export default function Page() { return <><JSONLD data={[buildCalculatorJsonLd({ name: config.title, description: config.subtitle, path: config.path }), buildHowToJsonLd({ name: `How to use the ${config.title}`, description: config.directAnswer, path: config.path, steps: config.steps.map((text, index) => ({ name: `Step ${index + 1}`, text })) }), buildBreadcrumbJsonLd([{ name: 'Finance calculators', url: '/finance' }, { name: config.title, url: config.path }])]} /><PercentageToolPage kind="change" /></>; }
