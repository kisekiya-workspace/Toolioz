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
  | 'slate';

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
};
