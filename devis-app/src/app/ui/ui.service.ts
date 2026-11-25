import { Dialog } from '@angular/cdk/dialog';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ConfirmData, ConfirmDialog } from '../dialogs/confirm-dialog';
import { NewQuoteDialog, NewQuoteResult } from '../dialogs/new-quote-dialog';
import { SearchDialog } from '../dialogs/search-dialog';
import { ShareAction, ShareDialog } from '../dialogs/share-dialog';
import { TourDialog } from '../dialogs/tour-dialog';
import { Quote } from '../core/models';
import { QuoteStore } from '../core/quote.store';
import { TemplateId } from '../core/templates';
import { ToastService } from './toast';

const TOUR_KEY = 'devis.tour.v1';

/** Point d'entrée unique pour les fenêtres (pop-ups) et les actions communes. */
@Injectable({ providedIn: 'root' })
export class Ui {
  private readonly dialog = inject(Dialog);
  private readonly router = inject(Router);
  private readonly store = inject(QuoteStore);
  private readonly toast = inject(ToastService);

  private readonly base = { hasBackdrop: true, autoFocus: 'first-tabbable' as const, restoreFocus: true };

  async confirm(data: ConfirmData): Promise<boolean> {
    const ref = this.dialog.open<boolean>(ConfirmDialog, { ...this.base, data });
    return !!(await firstValueFrom(ref.closed));
  }

  /** Ouvre l'assistant puis crée le devis et l'affiche. */
  async newQuote(template?: TemplateId) {
    const ref = this.dialog.open<NewQuoteResult | undefined>(NewQuoteDialog, { ...this.base, data: { template } });
    const r = await firstValueFrom(ref.closed);
    if (!r) return;
    const q = this.store.create(r.template, { client: r.client, project: r.project });
    this.toast.success(`Devis ${q.number} créé`);
    this.router.navigate(['/devis', q.id]);
  }

  async share(quote: Quote): Promise<ShareAction | undefined> {
    const ref = this.dialog.open<ShareAction | undefined>(ShareDialog, { ...this.base, data: quote });
    return firstValueFrom(ref.closed);
  }

  search() {
    this.dialog.open(SearchDialog, { ...this.base, panelClass: 'search-panel' });
  }

  tour() {
    this.dialog.open(TourDialog, this.base);
    try {
      localStorage.setItem(TOUR_KEY, '1');
    } catch {
      /* ignore */
    }
  }

  maybeTour() {
    try {
      if (!localStorage.getItem(TOUR_KEY)) setTimeout(() => this.tour(), 600);
    } catch {
      /* ignore */
    }
  }

  /** Supprime après confirmation, avec possibilité d'annuler. */
  async deleteQuote(q: Quote, then?: () => void) {
    const ok = await this.confirm({
      title: 'Supprimer ce devis ?',
      message: `Le devis ${q.number || ''} ${q.client ? '(' + q.client + ')' : ''} sera supprimé. Vous pourrez l'annuler quelques secondes.`,
      confirmLabel: 'Supprimer',
      danger: true,
    });
    if (!ok) return;
    const copy = structuredClone(q);
    this.store.remove(q.id);
    this.toast.show('Devis supprimé', { kind: 'info', actionLabel: 'Annuler', action: () => this.store.restore(copy) });
    then?.();
  }

  duplicate(id: string) {
    const q = this.store.duplicate(id);
    if (q) {
      this.toast.success(`Copie créée : devis ${q.number}`);
      this.router.navigate(['/devis', q.id]);
    }
  }
}
