import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FcfaPipe } from '../core/fcfa.pipe';
import { Company, Quote } from '../core/models';
import { grandTotal, lineTotal, sectionTotal, subTotal, tvaAmount } from '../core/quote.store';

/** Feuille de devis (aperçu + impression). Utilise le thème « document » (--doc-*). */
@Component({
  selector: 'app-quote-sheet',
  imports: [FcfaPipe],
  templateUrl: './quote-sheet.html',
  // Le devis est modifié en place par l'éditeur : l'aperçu doit être revérifié à chaque cycle.
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './quote-sheet.css',
})
export class QuoteSheet {
  readonly quote = input.required<Quote>();
  readonly company = input.required<Company>();

  protected readonly lineTotal = lineTotal;
  protected readonly sectionTotal = sectionTotal;
  protected readonly subTotal = subTotal;
  protected readonly tvaAmount = tvaAmount;
  protected readonly grandTotal = grandTotal;

  protected fmtDate(iso: string): string {
    const d = new Date(iso + 'T12:00:00');
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
