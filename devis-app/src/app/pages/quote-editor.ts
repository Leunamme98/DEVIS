import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FcfaPipe } from '../core/fcfa.pipe';
import { Company, Line, Quote, Section, emptyLine, emptySection } from '../core/models';
import {
  QuoteStore,
  areaM2,
  grandTotal,
  lineTotal,
  sectionTotal,
  subTotal,
  tvaAmount,
} from '../core/quote.store';

@Component({
  selector: 'app-quote-editor',
  imports: [FormsModule, RouterLink, FcfaPipe],
  templateUrl: './quote-editor.html',
  styleUrl: './quote-editor.css',
})
export class QuoteEditor {
  private readonly store = inject(QuoteStore);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  protected quote: Quote;
  protected company: Company = { ...this.store.company() };
  /** Sur petit écran : un seul panneau à la fois. */
  protected view: 'edit' | 'preview' = 'edit';

  protected readonly lineTotal = lineTotal;
  protected readonly sectionTotal = sectionTotal;
  protected readonly subTotal = subTotal;
  protected readonly tvaAmount = tvaAmount;
  protected readonly grandTotal = grandTotal;

  constructor() {
    const id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
    const found = this.store.get(id);
    if (!found) {
      this.router.navigate(['/']);
      this.quote = this.store.create();
      return;
    }
    this.quote = structuredClone(found);
  }

  save() {
    this.store.save(this.quote);
  }

  saveCompany() {
    this.store.saveCompany(this.company);
  }

  addSection() {
    this.quote.sections.push(emptySection());
    this.save();
  }

  removeSection(i: number) {
    if (confirm('Supprimer cette section ?')) {
      this.quote.sections.splice(i, 1);
      this.save();
    }
  }

  moveSection(i: number, d: -1 | 1) {
    const s = this.quote.sections;
    const j = i + d;
    if (j < 0 || j >= s.length) return;
    [s[i], s[j]] = [s[j], s[i]];
    this.save();
  }

  addLine(s: Section) {
    s.lines.push(emptyLine());
    this.save();
  }

  removeLine(s: Section, i: number) {
    s.lines.splice(i, 1);
    this.save();
  }

  /** Prix unitaire = surface (m²) × prix du m², arrondi à la centaine. */
  priceFromArea(l: Line) {
    const a = areaM2(l.dimensions);
    if (!a) {
      alert('Saisissez les dimensions au format 106X210 (cm).');
      return;
    }
    l.pu = Math.round((a * (Number(this.quote.pricePerM2) || 0)) / 100) * 100;
    this.save();
  }

  protected fmtDate(iso: string): string {
    const d = new Date(iso + 'T12:00:00');
    return isNaN(d.getTime()) ? iso : d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  async onLogo(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.company.logo = await new Promise<string>((res) => {
      const r = new FileReader();
      r.onload = () => res(String(r.result));
      r.readAsDataURL(file);
    });
    this.saveCompany();
    this.cdr.markForCheck(); // code asynchrone : on demande le rafraîchissement
    input.value = '';
  }

  removeLogo() {
    this.company.logo = '';
    this.saveCompany();
  }

  print() {
    window.print();
  }
}
