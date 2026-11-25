import { Line, Quote, Section, newId, today } from './models';

export type TemplateId = 'cabine' | 'fenetre' | 'porte' | 'vierge';

export interface QuoteTemplate {
  id: TemplateId;
  name: string;
  description: string;
  icon: string; // nom d'icône (voir core/icons.ts)
  title: string;
  sections: Section[];
}

const L = (designation: string, qty: number, pu: number, dimensions = '', unit = 'U'): Line => ({
  designation,
  dimensions,
  unit,
  qty,
  pu,
});

export const TEMPLATES: QuoteTemplate[] = [
  {
    id: 'cabine',
    name: 'Cabine de douche',
    description: 'Vitre trempée 10 mm + kit coulissant et accessoires.',
    icon: 'shower',
    title: 'DEVIS DE : MENUISERIE ALUMINIUM',
    sections: [
      {
        heading: 'Cabine de douche',
        title: 'Vitre 10mm claire trempée',
        totalLabel: 'TOTAL VITRE',
        lines: [L('', 1, 77200, '106X210'), L('', 1, 88400, '123X210')],
      },
      {
        heading: '',
        title: 'Accessoires',
        totalLabel: 'TOTAL ACCESSOIRES',
        lines: [
          L('Kit coulissant', 1, 40000),
          L('Rail', 1, 10000),
          L('Pinces', 6, 3000),
          L('Baguette F', 1, 3000),
          L('Baguette O', 1, 3000),
          L('Silicone', 2, 1500),
        ],
      },
    ],
  },
  {
    id: 'fenetre',
    name: 'Fenêtre aluminium',
    description: 'Fenêtre coulissante ou battante : profilé, vitrage, quincaillerie.',
    icon: 'window',
    title: 'DEVIS DE : MENUISERIE ALUMINIUM',
    sections: [
      {
        heading: 'Fenêtre aluminium',
        title: 'Fourniture et pose',
        totalLabel: 'TOTAL FENÊTRES',
        lines: [L('Fenêtre coulissante 2 vantaux', 1, 0, '120X120')],
      },
      {
        heading: '',
        title: 'Accessoires',
        totalLabel: 'TOTAL ACCESSOIRES',
        lines: [L('Quincaillerie', 1, 0), L('Silicone', 1, 1500)],
      },
    ],
  },
  {
    id: 'porte',
    name: 'Porte aluminium',
    description: 'Porte pleine ou vitrée avec serrure et finitions.',
    icon: 'door',
    title: 'DEVIS DE : MENUISERIE ALUMINIUM',
    sections: [
      {
        heading: 'Porte aluminium',
        title: 'Fourniture et pose',
        totalLabel: 'TOTAL PORTES',
        lines: [L('Porte battante', 1, 0, '90X210')],
      },
      {
        heading: '',
        title: 'Accessoires',
        totalLabel: 'TOTAL ACCESSOIRES',
        lines: [L('Serrure', 1, 0), L('Charnières', 3, 0)],
      },
    ],
  },
  {
    id: 'vierge',
    name: 'Devis vierge',
    description: 'Partez de zéro et construisez vos sections librement.',
    icon: 'file',
    title: 'DEVIS',
    sections: [
      { heading: '', title: 'Ouvrages', totalLabel: 'TOTAL', lines: [L('', 1, 0)] },
    ],
  },
];

export function buildQuote(
  templateId: TemplateId,
  extra: Partial<Pick<Quote, 'client' | 'project' | 'number'>> = {},
): Quote {
  const t = TEMPLATES.find((x) => x.id === templateId) ?? TEMPLATES[0];
  return {
    id: newId(),
    status: 'draft',
    number: extra.number ?? '',
    date: today(),
    client: extra.client ?? '',
    project: extra.project ?? '',
    title: t.title,
    sections: structuredClone(t.sections),
    grandTotalLabel: 'TOTAL GENERAL',
    tvaEnabled: false,
    tvaRate: 18,
    pricePerM2: 34500,
    notes: '',
    updatedAt: Date.now(),
  };
}
