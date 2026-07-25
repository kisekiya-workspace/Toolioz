import { BIODATA_THEMES } from '../biodata-theme';
import { BiodataFlatDocument } from './BiodataFlatDocument';
import type { BiodataForm } from '../types';

export const SlateBannerTemplate = ({ data }: { data: BiodataForm }) => (
  <BiodataFlatDocument data={data} theme={BIODATA_THEMES.slate} />
);
