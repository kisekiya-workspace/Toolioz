import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import PercentageToolPage from '../percentage-tools/PercentageToolPage';
import { PERCENTAGE_TOOL_CONFIGS } from '../percentage-tools/percentage-tool-data';

const config = PERCENTAGE_TOOL_CONFIGS.percentage;
export const metadata = buildPageMetadata({ title: 'Percentage Calculator With Steps', description: 'Finds P% of a number as (P ÷ 100) × N, or what percent X is of Y as (X ÷ Y) × 100.', path: config.path, keywords: ['percentage calculator', 'how to do percentage on calculator', 'how to calculate percentage in calculator', 'how to use percentage on a calculator', 'what percent is x of y calculator'] });
export default function Page() { return <><JSONLD data={[buildCalculatorJsonLd({ name: config.title, description: config.subtitle, path: config.path }), buildHowToJsonLd({ name: `How to use the ${config.title}`, description: config.directAnswer, path: config.path, steps: config.steps.map((text, index) => ({ name: `Step ${index + 1}`, text })) }), buildBreadcrumbJsonLd([{ name: 'Finance calculators', url: '/finance' }, { name: config.title, url: config.path }])]} /><PercentageToolPage kind="percentage" /></>; }
