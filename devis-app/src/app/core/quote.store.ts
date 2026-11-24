import { Injectable, signal } from '@angular/core';
import { Company, DEFAULT_COMPANY, Line, Quote, Section, newId, sampleQuote, today } from './models';

const KEY_QUOTES = 'devis.quotes.v1';
const KEY_COMPANY = 'devis.company.v1';

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* stockage indisponible */
  }
}

@Injectable({ providedIn: 'root' })
export class QuoteStore {
  readonly quotes = signal<Quote[]>(read<Quote[]>(KEY_QUOTES, []));
  readonly company = signal<Company>({ ...DEFAULT_COMPANY, ...read<Partial<Company>>(KEY_COMPANY, {}) });

  get(id: string): Quote | undefined {
    return this.quotes().find((q) => q.id === id);
  }

  save(q: Quote) {
    q.updatedAt = Date.now();
    const list = this.quotes();
    const i = list.findIndex((x) => x.id === q.id);
    const next = i >= 0 ? list.map((x) => (x.id === q.id ? q : x)) : [q, ...list];
    this.quotes.set(next);
    write(KEY_QUOTES, next);
  }

  create(): Quote {
    const q = sampleQuote();
    q.number = this.nextNumber();
    this.save(q);
    return q;
  }

  duplicate(id: string): Quote | undefined {
    const src = this.get(id);
    if (!src) return;
    const copy: Quote = { ...structuredClone(src), id: newId(), number: this.nextNumber(), date: today() };
    this.save(copy);
    return copy;
  }

  remove(id: string) {
    const next = this.quotes().filter((q) => q.id !== id);
    this.quotes.set(next);
    write(KEY_QUOTES, next);
  }

  saveCompany(c: Company) {
    this.company.set({ ...c });
    write(KEY_COMPANY, c);
  }

  private nextNumber(): string {
    const year = new Date().getFullYear();
    const n = this.quotes().filter((q) => q.number.startsWith(`${year}-`)).length + 1;
    return `${year}-${String(n).padStart(3, '0')}`;
  }

  exportJson(): string {
    return JSON.stringify({ company: this.company(), quotes: this.quotes() }, null, 2);
  }

  importJson(text: string) {
    const data = JSON.parse(text);
    if (Array.isArray(data.quotes)) {
      this.quotes.set(data.quotes);
      write(KEY_QUOTES, data.quotes);
    }
    if (data.company) this.saveCompany({ ...DEFAULT_COMPANY, ...data.company });
  }
}

export const lineTotal = (l: Line) => (Number(l.qty) || 0) * (Number(l.pu) || 0);
export const sectionTotal = (s: Section) => s.lines.reduce((a, l) => a + lineTotal(l), 0);
export const subTotal = (q: Quote) => q.sections.reduce((a, s) => a + sectionTotal(s), 0);
export const tvaAmount = (q: Quote) =>
  q.tvaEnabled ? Math.round((subTotal(q) * (Number(q.tvaRate) || 0)) / 100) : 0;
export const grandTotal = (q: Quote) => subTotal(q) + tvaAmount(q);

/** "106X210" ou "106 x 210" (cm) -> surface en m² */
export function areaM2(dimensions: string): number {
  const m = dimensions.replace(',', '.').match(/(\d+(?:\.\d+)?)\s*[xX×]\s*(\d+(?:\.\d+)?)/);
  return m ? (parseFloat(m[1]) * parseFloat(m[2])) / 10000 : 0;
}
