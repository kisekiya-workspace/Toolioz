import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import PercentageToolPage from '../percentage-tools/PercentageToolPage';
import { PERCENTAGE_TOOL_CONFIGS } from '../percentage-tools/percentage-tool-data';
const config = PERCENTAGE_TOOL_CONFIGS.grade;
export const metadata = buildPageMetadata({ title: 'Grade Percentage Calculator', description: 'Calculates grade percentage from earned and total points, showing the formula, worked result, and an indicative letter grade.', path: config.path, keywords: ['grade percentage calculator', 'marks percentage calculator', 'test grade calculator', 'points to percentage calculator'] });
export default function Page() { return <><JSONLD data={[buildCalculatorJsonLd({ name: config.title, description: config.subtitle, path: config.path }), buildHowToJsonLd({ name: `How to use the ${config.title}`, description: config.directAnswer, path: config.path, steps: config.steps.map((text, index) => ({ name: `Step ${index + 1}`, text })) }), buildBreadcrumbJsonLd([{ name: 'Finance calculators', url: '/finance' }, { name: config.title, url: config.path }])]} /><PercentageToolPage kind="grade" /></>; }
