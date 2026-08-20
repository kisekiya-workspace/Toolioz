import { JSONLD } from '@/components/ui/JSONLD';
import { buildBreadcrumbJsonLd, buildCalculatorJsonLd, buildHowToJsonLd, buildPageMetadata } from '@/lib/seo';
import PercentageToolPage from '../percentage-tools/PercentageToolPage';
import { PERCENTAGE_TOOL_CONFIGS } from '../percentage-tools/percentage-tool-data';
const config = PERCENTAGE_TOOL_CONFIGS.win;
export const metadata = buildPageMetadata({ title: 'Win Percentage Calculator', description: 'Calculates winning percentage from wins, losses, and ties with total games, record, formula, and worked examples.', path: config.path, keywords: ['win percentage calculator', 'winning percentage calculator', 'calculate win rate', 'wins losses percentage'] });
export default function Page() { return <><JSONLD data={[buildCalculatorJsonLd({ name: config.title, description: config.subtitle, path: config.path }), buildHowToJsonLd({ name: `How to use the ${config.title}`, description: config.directAnswer, path: config.path, steps: config.steps.map((text, index) => ({ name: `Step ${index + 1}`, text })) }), buildBreadcrumbJsonLd([{ name: 'Finance calculators', url: '/finance' }, { name: config.title, url: config.path }])]} /><PercentageToolPage kind="win" /></>; }
