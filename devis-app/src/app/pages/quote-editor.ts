import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FcfaPipe } from '../core/fcfa.pipe';
import { Company, Line, Quote, STATUSES, Section, emptyLine, emptySection, statusMeta } from '../core/models';
import { QuoteStore, areaM2, grandTotal, lineTotal, sectionTotal, subTotal, tvaAmount } from '../core/quote.store';
import { Icon } from '../ui/icon';
import { QuoteSheet } from '../ui/quote-sheet';
import { ToastService } from '../ui/toast';
import { Tip } from '../ui/tooltip';
import { Ui } from '../ui/ui.service';

@Component({
  selector: 'app-quote-editor',
  imports: [FormsModule, RouterLink, FcfaPipe, Icon, Tip, QuoteSheet, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './quote-editor.html',
})
export class QuoteEditor {
  private readonly store = inject(QuoteStore);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toast = inject(ToastService);
  private readonly ui = inject(Ui);

  protected quote: Quote;
  protected company: Company = { ...this.store.company() };
  /** Sur petit écran : un seul panneau à la fois. */
  protected view: 'edit' | 'preview' = 'edit';
  protected savedAt = Date.now();

  protected readonly statuses = STATUSES;
  protected readonly meta = statusMeta;
  protected readonly lineTotal = lineTotal;
  protected readonly sectionTotal = sectionTotal;
  protected readonly subTotal = subTotal;
  protected readonly tvaAmount = tvaAmount;
  protected readonly grandTotal = grandTotal;

  constructor() {
    const id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';
    const found = this.store.get(id);
    if (!found) {
      this.router.navigate(['/devis']);
      this.quote = this.store.create();
      return;
    }
    this.quote = structuredClone(found);
  }

  protected get savedLabel(): string {
    return new Date(this.savedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  save() {
    this.store.save(this.quote);
    this.savedAt = Date.now();
  }

  saveCompany() {
    this.store.saveCompany(this.company);
    this.savedAt = Date.now();
  }

  addSection() {
    this.quote.sections.push(emptySection());
    this.save();
  }

  async removeSection(i: number) {
    const s = this.quote.sections[i];
    const ok = await this.ui.confirm({
      title: 'Supprimer cette section ?',
      message: `« ${s.title || 'Section ' + (i + 1)} » et ses ${s.lines.length} ligne(s) seront supprimées.`,
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (!ok) return;
    this.quote.sections.splice(i, 1);
    this.save();
    this.toast.show('Section supprimée', {
      kind: 'info',
      actionLabel: 'Annuler',
      action: () => {
        this.quote.sections.splice(i, 0, s);
        this.save();
        this.cdr.markForCheck();
      },
    });
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
    const [removed] = s.lines.splice(i, 1);
    this.save();
    this.toast.show('Ligne supprimée', {
      kind: 'info',
      actionLabel: 'Annuler',
      action: () => {
        s.lines.splice(i, 0, removed);
        this.save();
        this.cdr.markForCheck();
      },
    });
  }

  dropLine(s: Section, e: CdkDragDrop<Line[]>) {
    moveItemInArray(s.lines, e.previousIndex, e.currentIndex);
    this.save();
  }

  /** Prix unitaire = surface (m²) × prix du m², arrondi à la centaine. */
  priceFromArea(l: Line) {
    const a = areaM2(l.dimensions);
    if (!a) {
      this.toast.error('Saisissez les dimensions au format 106X210 (en cm).');
      return;
    }
    l.pu = Math.round((a * (Number(this.quote.pricePerM2) || 0)) / 100) * 100;
    this.save();
    this.toast.show(`${a.toFixed(2)} m² × ${this.quote.pricePerM2} = ${l.pu} FCFA`, { kind: 'info' });
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

  async share() {
    const action = await this.ui.share(this.quote);
    if (action === 'print') this.print();
    if (action === 'whatsapp') {
      window.open('https://wa.me/?text=' + encodeURIComponent(this.summary()), '_blank', 'noopener');
    }
    if (action === 'copy') {
      try {
        await navigator.clipboard.writeText(this.summary());
        this.toast.success('Récapitulatif copié');
      } catch {
        this.toast.error('Copie impossible sur cet appareil.');
      }
    }
    this.cdr.markForCheck();
  }

  private summary(): string {
    const q = this.quote;
    const money = (n: number) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    const lines = q.sections.map((s) => `• ${s.title || s.heading}: ${money(sectionTotal(s))} FCFA`);
    return [
      `${this.company.name || 'Sky Alu'} — Devis ${q.number}`,
      q.client ? `Client : ${q.client}` : '',
      q.project ? `Projet : ${q.project}` : '',
      '',
      ...lines,
      '',
      `${q.grandTotalLabel}${q.tvaEnabled ? ' TTC' : ''} : ${money(grandTotal(q))} FCFA`,
      '',
      `Contact : ${this.company.contacts}`,
    ]
      .filter((x, i, a) => x !== '' || a[i - 1] !== '')
      .join('\n');
  }

  print() {
    // Laisse le temps à la fenêtre de se fermer avant d'ouvrir l'impression.
    setTimeout(() => window.print(), 150);
  }
}
