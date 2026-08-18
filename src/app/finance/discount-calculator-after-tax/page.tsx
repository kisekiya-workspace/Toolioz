import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import PercentageToolPage from '../percentage-tools/PercentageToolPage';
import { PERCENTAGE_TOOL_CONFIGS } from '../percentage-tools/percentage-tool-data';

const config = PERCENTAGE_TOOL_CONFIGS.discount;
export const metadata = buildPageMetadata({ title: 'Discount Calculator After Tax | Final Price', description: 'The calculator finds savings, discounted subtotal, tax amount, and final price after applying a percentage discount and optional tax rate.', path: config.path, keywords: ['discount calculator after tax', 'sale price calculator with tax', 'discount percentage calculator final price', 'price after discount and GST calculator'] });
export default function Page() { return <><JSONLD data={[buildCalculatorJsonLd({ name: config.title, description: config.subtitle, path: config.path }), buildHowToJsonLd({ name: `How to use the ${config.title}`, description: config.directAnswer, path: config.path, steps: config.steps.map((text, index) => ({ name: `Step ${index + 1}`, text })) }), buildBreadcrumbJsonLd([{ name: 'Finance calculators', url: '/finance' }, { name: config.title, url: config.path }])]} /><PercentageToolPage kind="discount" /></>; }
