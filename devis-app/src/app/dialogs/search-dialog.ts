import { DialogRef } from '@angular/cdk/dialog';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FcfaPipe } from '../core/fcfa.pipe';
import { statusMeta } from '../core/models';
import { QuoteStore, grandTotal } from '../core/quote.store';
import { Icon } from '../ui/icon';

@Component({
  selector: 'app-search-dialog',
  imports: [FormsModule, Icon, FcfaPipe],
  template: `
    <div class="dialog-panel" role="dialog" aria-label="Recherche">
      <div class="flex items-center gap-3 border-b border-line px-5 py-3.5">
        <app-icon name="search" class="text-muted" />
        <input
          class="w-full bg-transparent text-base outline-none placeholder:text-muted/60"
          cdkFocusInitial
          placeholder="Rechercher un devis, un client, un projet…"
          [ngModel]="q()"
          (ngModelChange)="q.set($event)"
          (keydown.enter)="openFirst()"
        />
        <span class="kbd">Échap</span>
      </div>
      <div class="max-h-[50vh] overflow-auto p-2">
        <p class="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted">Actions</p>
        <button class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-primary-soft" (click)="go('/')">
          <app-icon name="home" class="text-primary" />Accueil
        </button>
        <button class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-primary-soft" (click)="go('/devis')">
          <app-icon name="folder" class="text-primary" />Tous mes devis
        </button>

        <p class="px-3 pb-1 pt-3 text-[11px] font-semibold uppercase tracking-wider text-muted">Devis ({{ results().length }})</p>
        @for (d of results(); track d.id) {
          <button class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-primary-soft" (click)="open(d.id)">
            <app-icon name="file" class="text-primary" />
            <span class="min-w-0 flex-1">
              <span class="block truncate font-medium">{{ d.number || 'Sans numéro' }} · {{ d.client || 'Client non renseigné' }}</span>
              <span class="block truncate text-xs text-muted">{{ d.project || 'Sans projet' }}</span>
            </span>
            <span [class]="meta(d.status).badge">{{ meta(d.status).label }}</span>
            <span class="num text-xs font-semibold">{{ total(d) | fcfa }}</span>
          </button>
        } @empty {
          <p class="px-3 py-6 text-center text-sm text-muted">Aucun devis ne correspond à « {{ q() }} ».</p>
        }
      </div>
    </div>
  `,
})
export class SearchDialog {
  private readonly store = inject(QuoteStore);
  private readonly router = inject(Router);
  private readonly ref = inject(DialogRef);
  protected readonly q = signal('');
  protected readonly meta = statusMeta;
  protected readonly total = grandTotal;
  protected readonly results = computed(() => {
    const t = this.q().trim().toLowerCase();
    const all = this.store.quotes();
    const list = t ? all.filter((d) => `${d.number} ${d.client} ${d.project}`.toLowerCase().includes(t)) : all;
    return list.slice(0, 8);
  });

  go(path: string) {
    this.ref.close();
    this.router.navigateByUrl(path);
  }
  open(id: string) {
    this.go('/devis/' + id);
  }
  openFirst() {
    const f = this.results()[0];
    if (f) this.open(f.id);
  }
}
