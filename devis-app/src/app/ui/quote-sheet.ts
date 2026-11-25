import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FcfaPipe } from '../core/fcfa.pipe';
import { Company, Quote } from '../core/models';
import { grandTotal, lineTotal, sectionTotal, subTotal, tvaAmount } from '../core/quote.store';

type Row =
  | { kind: 'group'; text: string }
  | { kind: 'section'; text: string }
  | { kind: 'line'; n: string; label: string; dims: string; unit: string; qty: number; pu: number; total: number }
  | { kind: 'subtotal'; label: string; total: number };

/** Feuille de devis (aperçu + impression PDF), aux couleurs de la charte. */
@Component({
  selector: 'app-quote-sheet',
  imports: [FcfaPipe],
  templateUrl: './quote-sheet.html',
  styleUrl: './quote-sheet.css',
  // Le devis est modifié en place par l'éditeur : l'aperçu doit être revérifié à chaque cycle.
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class QuoteSheet {
  readonly quote = input.required<Quote>();
  readonly company = input.required<Company>();

  protected readonly subTotal = subTotal;
  protected readonly tvaAmount = tvaAmount;
  protected readonly grandTotal = grandTotal;

  /** Aplatit les sections en lignes de tableau, avec numérotation continue. */
  protected rows(): Row[] {
    const out: Row[] = [];
    let n = 0;
    for (const s of this.quote().sections) {
      if (s.heading) out.push({ kind: 'group', text: s.heading });
      if (s.title) out.push({ kind: 'section', text: s.title });
      for (const l of s.lines) {
        n++;
        out.push({
          kind: 'line',
          n: String(n).padStart(2, '0'),
          label: l.designation,
          dims: l.dimensions,
          unit: l.unit,
          qty: l.qty,
          pu: l.pu,
          total: lineTotal(l),
        });
      }
      out.push({ kind: 'subtotal', label: s.totalLabel, total: sectionTotal(s) });
    }
    return out;
  }

  /** « DEVIS DE : MENUISERIE… » → « MENUISERIE… » (le mot DEVIS figure déjà dans l'en-tête). */
  protected title(): string {
    return this.quote().title.replace(/^\s*devis\s*(de|d')?\s*:?\s*/i, '').trim() || this.quote().title;
  }

  protected fmtDate(iso: string): string {
    const d = new Date(iso + 'T12:00:00');
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
