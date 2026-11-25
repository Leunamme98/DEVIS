import { Component, HostListener, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Icon } from './ui/icon';
import { Toaster } from './ui/toast';
import { Tip } from './ui/tooltip';
import { Ui } from './ui/ui.service';

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, Tip, Toaster],
  selector: 'app-root',
  template: `
    @if (!inEditor()) {
      <header class="no-print sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur">
        <div class="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4">
          <a routerLink="/" class="flex items-center gap-2.5" aria-label="Accueil Sky Alu Devis">
            <img src="logo-mark.png" alt="" class="h-10 w-auto" />
            <span class="hidden leading-tight sm:block">
              <span class="block text-sm font-extrabold">Sky Alu</span>
              <span class="block text-xs font-medium text-muted">Gestion des devis</span>
            </span>
          </a>

          <nav class="ml-4 hidden items-center gap-1 md:flex" aria-label="Navigation principale">
            <a routerLink="/" routerLinkActive="!bg-primary-soft !text-primary" [routerLinkActiveOptions]="{ exact: true }" class="btn-ghost">
              <app-icon name="home" [size]="16" />Accueil</a>
            <a routerLink="/devis" routerLinkActive="!bg-primary-soft !text-primary" class="btn-ghost">
              <app-icon name="folder" [size]="16" />Mes devis</a>
          </nav>

          <span class="flex-1"></span>

          <button class="btn-secondary hidden w-64 !justify-start !font-normal !text-muted lg:inline-flex" (click)="ui.search()">
            <app-icon name="search" [size]="16" />Rechercher…<span class="kbd ml-auto">Ctrl K</span>
          </button>
          <button class="btn-icon lg:!hidden" (click)="ui.search()" tip="Rechercher (Ctrl K)" tipPos="below"><app-icon name="search" /></button>
          <button class="btn-icon" (click)="ui.tour()" tip="Aide et visite guidée" tipPos="below"><app-icon name="help" /></button>
          <button class="btn-primary hidden md:inline-flex" (click)="ui.newQuote()"><app-icon name="plus" [size]="16" />Nouveau devis</button>
        </div>
      </header>
    }

    <main [class]="inEditor() ? '' : 'mx-auto max-w-6xl px-4 pb-28 pt-6 md:pb-10'">
      <router-outlet />
    </main>

    @if (!inEditor()) {
      <nav class="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface md:hidden" aria-label="Navigation mobile">
        <div class="mx-auto grid max-w-md grid-cols-4 items-end px-2 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5">
          <a routerLink="/" routerLinkActive="text-primary" [routerLinkActiveOptions]="{ exact: true }" class="flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-muted">
            <app-icon name="home" [size]="22" />Accueil</a>
          <a routerLink="/devis" routerLinkActive="text-primary" class="flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-muted">
            <app-icon name="folder" [size]="22" />Devis</a>
          <button class="-mt-6 mx-auto grid size-14 place-items-center rounded-full bg-primary text-surface shadow-(--shadow-pop) active:scale-95"
                  (click)="ui.newQuote()" aria-label="Nouveau devis"><app-icon name="plus" [size]="26" /></button>
          <button class="flex flex-col items-center gap-0.5 py-1 text-[11px] font-medium text-muted" (click)="ui.search()">
            <app-icon name="search" [size]="22" />Chercher</button>
        </div>
      </nav>
    }
    <app-toaster />
  `,
})
export class App {
  protected readonly ui = inject(Ui);
  private readonly router = inject(Router);
  protected readonly inEditor = signal(this.router.url.startsWith('/devis/'));

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.inEditor.set(e.urlAfterRedirects.startsWith('/devis/')));
    this.ui.maybeTour();
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.ui.search();
    }
  }
}
