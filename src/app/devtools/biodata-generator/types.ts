export type TemplateId =
  | 'hindu'
  | 'ivory_gold'
  | 'maroon_gold'
  | 'rose_gold'
  | 'navy_gold'
  | 'islamic'
  | 'sikh'
  | 'classic'
  | 'floral'
  | 'minimalist'
  | 'modern'
  | 'slate'
  | 'gujarat_bandhani'
  | 'gujarat_patola'
  | 'gujarat_kutch'
  | 'gujarat_jain';

export type BiodataForm = {
  photo: string | null;
  fullName: string;
  dateOfBirth: string;
  birthTime: string;
  birthPlace: string;
  height: string;
  religion: string;
  caste: string;
  manglik: string;
  education: string;
  occupation: string;
  annualIncome: string;
  about: string;
  hobbies: string;
  languages: string;
  partnerPreferences: string;
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  siblings: string;
  phone: string;
  email: string;
  address: string;
  gender?: string;
  maritalStatus?: string;
  motherTongue?: string;
  gotra?: string;
  rashi?: string;
  nakshatra?: string;
  diet?: string;
  bloodGroup?: string;
  weight?: string;
  college?: string;
  company?: string;
  workLocation?: string;
  nativePlace?: string;
  familyType?: string;
  familyStatus?: string;
  kuldevi?: string;
  mosal?: string;
  mamaName?: string;
  sampraday?: string;
  customFields?: Array<{ id: string; label: string; value: string }>;
};
