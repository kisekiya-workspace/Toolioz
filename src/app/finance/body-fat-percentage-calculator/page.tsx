import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import PercentageToolPage from '../percentage-tools/PercentageToolPage';
import { PERCENTAGE_TOOL_CONFIGS } from '../percentage-tools/percentage-tool-data';
const config = PERCENTAGE_TOOL_CONFIGS.bodyFat;
export const metadata = buildPageMetadata({ title: 'Body Fat Percentage Calculator', description: 'Estimates adult body-fat percentage from height, neck, waist, and hip measurements using the U.S. Navy circumference method.', path: config.path, keywords: ['body fat percentage calculator', 'navy body fat calculator', 'body fat calculator male female', 'body composition calculator'] });
export default function Page() { return <><JSONLD data={[buildCalculatorJsonLd({ name: config.title, description: config.subtitle, path: config.path }), buildHowToJsonLd({ name: `How to use the ${config.title}`, description: config.directAnswer, path: config.path, steps: config.steps.map((text, index) => ({ name: `Step ${index + 1}`, text })) }), buildBreadcrumbJsonLd([{ name: 'Finance calculators', url: '/finance' }, { name: config.title, url: config.path }])]} /><PercentageToolPage kind="bodyFat" /></>; }
