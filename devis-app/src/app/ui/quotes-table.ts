import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FcfaPipe } from '../core/fcfa.pipe';
import { Quote, statusMeta } from '../core/models';
import { QuoteStore, grandTotal } from '../core/quote.store';
import { Icon } from './icon';
import { Tip } from './tooltip';
import { Ui } from './ui.service';

/** Tableau moderne des devis : tableau sur grand écran, cartes sur téléphone. */
@Component({
  selector: 'app-quotes-table',
  imports: [RouterLink, FcfaPipe, Icon, Tip, CdkMenu, CdkMenuItem, CdkMenuTrigger],
  template: `
    <!-- Grand écran -->
    <div class="table-wrap hidden md:block">
      <table class="data">
        <thead>
          <tr>
            <th>N°</th><th>Client / Projet</th><th>Date</th><th>Statut</th><th class="num">Montant</th><th class="w-12"></th>
          </tr>
        </thead>
        <tbody>
          @for (q of quotes(); track q.id) {
            <tr>
              <td class="font-semibold"><a [routerLink]="['/devis', q.id]" class="text-primary hover:underline">{{ q.number || '—' }}</a></td>
              <td>
                <a [routerLink]="['/devis', q.id]" class="block">
                  <span class="block font-medium">{{ q.client || 'Client non renseigné' }}</span>
                  <span class="block text-xs text-muted">{{ q.project || 'Sans projet' }}</span>
                </a>
              </td>
              <td class="whitespace-nowrap text-muted">{{ fdate(q.date) }}</td>
              <td><span [class]="meta(q.status).badge">{{ meta(q.status).label }}</span></td>
              <td class="num font-semibold">{{ total(q) | fcfa }} <span class="text-xs font-normal text-muted">FCFA</span></td>
              <td>
                <button class="btn-icon" [cdkMenuTriggerFor]="menu" [cdkMenuTriggerData]="{ q: q }" tip="Actions" aria-haspopup="menu">
                  <app-icon name="more" />
                </button>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>

    <!-- Téléphone -->
    <ul class="grid gap-3 md:hidden">
      @for (q of quotes(); track q.id) {
        <li class="card flex items-center gap-3 p-4">
          <a [routerLink]="['/devis', q.id]" class="min-w-0 flex-1">
            <span class="flex items-center justify-between gap-2">
              <span class="text-sm font-bold text-primary">{{ q.number || '—' }}</span>
              <span [class]="meta(q.status).badge">{{ meta(q.status).label }}</span>
            </span>
            <span class="mt-1 block truncate font-medium">{{ q.client || 'Client non renseigné' }}</span>
            <span class="flex items-center justify-between text-xs text-muted">
              <span class="truncate">{{ q.project || 'Sans projet' }} · {{ fdate(q.date) }}</span>
              <span class="num text-sm font-bold text-ink">{{ total(q) | fcfa }}</span>
            </span>
          </a>
          <button class="btn-icon" [cdkMenuTriggerFor]="menu" [cdkMenuTriggerData]="{ q: q }" aria-label="Actions">
            <app-icon name="more" />
          </button>
        </li>
      }
    </ul>

    <ng-template #menu let-q="q">
      <div cdkMenu class="card min-w-48 p-1.5 shadow-(--shadow-pop)">
        <a cdkMenuItem [routerLink]="['/devis', q.id]" class="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-primary-soft">
          <app-icon name="edit" [size]="16" />Ouvrir</a>
        <button cdkMenuItem (click)="ui.duplicate(q.id)" class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-primary-soft">
          <app-icon name="copy" [size]="16" />Dupliquer</button>
        <button cdkMenuItem (click)="ui.deleteQuote(q)" class="flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-danger hover:bg-danger-soft">
          <app-icon name="trash" [size]="16" />Supprimer</button>
      </div>
    </ng-template>
  `,
})
export class QuotesTable {
  readonly quotes = input.required<Quote[]>();
  protected readonly ui = inject(Ui);
  protected readonly store = inject(QuoteStore);
  protected readonly meta = statusMeta;
  protected readonly total = grandTotal;
  protected fdate(iso: string) {
    const [y, m, d] = iso.split('-');
    return d && m && y ? `${d}/${m}/${y}` : iso;
  }
}
