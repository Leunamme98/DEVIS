export interface Line {
  designation: string;
  dimensions: string; // ex: "106X210" (cm)
  unit: string;
  qty: number;
  pu: number;
}

export interface Section {
  heading: string; // ex: "Cabine de douche" (optionnel)
  title: string; // ex: "Vitre 10mm claire trempée"
  totalLabel: string; // ex: "TOTAL VITRE" (libre)
  lines: Line[];
}

export interface Company {
  name: string;
  logo: string; // URL ou data URL (vide = pas de logo)
  tagline: string;
  contacts: string;
  email: string;
  city: string;
}

export type QuoteStatus = 'draft' | 'sent' | 'accepted' | 'rejected';

export const STATUSES: { value: QuoteStatus; label: string; badge: string }[] = [
  { value: 'draft', label: 'Brouillon', badge: 'badge-draft' },
  { value: 'sent', label: 'Envoyé', badge: 'badge-sent' },
  { value: 'accepted', label: 'Accepté', badge: 'badge-accepted' },
  { value: 'rejected', label: 'Refusé', badge: 'badge-rejected' },
];

export const statusMeta = (s: QuoteStatus | undefined) => STATUSES.find((x) => x.value === s) ?? STATUSES[0];

export interface Quote {
  id: string;
  status: QuoteStatus;
  number: string;
  date: string; // yyyy-mm-dd
  client: string;
  project: string;
  title: string;
  sections: Section[];
  grandTotalLabel: string;
  tvaEnabled: boolean;
  tvaRate: number;
  pricePerM2: number; // aide au calcul du prix des vitres
  notes: string;
  updatedAt: number;
}

export const emptyLine = (): Line => ({ designation: '', dimensions: '', unit: 'U', qty: 1, pu: 0 });

export const emptySection = (): Section => ({
  heading: '',
  title: 'Nouvelle section',
  totalLabel: 'TOTAL',
  lines: [emptyLine()],
});

export const DEFAULT_COMPANY: Company = {
  name: '',
  logo: 'logo-sky-alu.jpg',
  tagline:
    'TOUS TRAVAUX DE BÂTIMENT : MENUISERIE ALUMINIUM - VITRERIE - CUISINE - BALCON - FERRONNERIE - STORE - BÂCHES ET DIVERS',
  contacts: '(+225) 01 43 11 91 02 / 07 10 08 39 32',
  email: 'yevoudzekoffiigor@gmail.com',
  city: 'Abidjan',
};

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

export function today(): string {
  return new Date().toISOString().slice(0, 10);
}
