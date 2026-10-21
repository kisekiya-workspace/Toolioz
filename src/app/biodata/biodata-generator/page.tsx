import { redirect } from 'next/navigation';

export { metadata } from '@/app/biodata/page';

export default function BiodataGeneratorAliasPage() {
  redirect('/biodata');
}
