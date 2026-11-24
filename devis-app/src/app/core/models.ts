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

export interface Quote {
  id: string;
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

export function sampleQuote(): Quote {
  return {
    id: newId(),
    number: '',
    date: today(),
    client: '',
    project: 'Bingerville',
    title: 'DEVIS DE : MENUISERIE ALUMINIUM',
    sections: [
      {
        heading: 'Cabine de douche',
        title: 'Vitre 10mm claire trempée',
        totalLabel: 'TOTAL VITRE',
        lines: [
          { designation: '', dimensions: '106X210', unit: 'U', qty: 1, pu: 77200 },
          { designation: '', dimensions: '123X210', unit: 'U', qty: 1, pu: 88400 },
        ],
      },
      {
        heading: '',
        title: 'Accessoires',
        totalLabel: 'TOTAL ACCESSOIRES',
        lines: [
          { designation: 'Kit coulissant', dimensions: '', unit: 'U', qty: 1, pu: 40000 },
          { designation: 'Rail', dimensions: '', unit: 'U', qty: 1, pu: 10000 },
          { designation: 'Pinces', dimensions: '', unit: 'U', qty: 6, pu: 3000 },
          { designation: 'Baguette F', dimensions: '', unit: 'U', qty: 1, pu: 3000 },
          { designation: 'Baguette O', dimensions: '', unit: 'U', qty: 1, pu: 3000 },
          { designation: 'Silicone', dimensions: '', unit: 'U', qty: 2, pu: 1500 },
        ],
      },
    ],
    grandTotalLabel: 'TOTAL GENERAL',
    tvaEnabled: false,
    tvaRate: 18,
    pricePerM2: 34500,
    notes: '',
    updatedAt: Date.now(),
  };
}
