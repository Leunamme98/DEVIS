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
    <!-- Barre de progression du défilement -->
    <div class="no-print pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]" aria-hidden="true">
      <div class="h-full origin-left rounded-r-full bg-gradient-to-r from-primary to-accent transition-[width] duration-100"
           [style.width.%]="progress()"></div>
    </div>

    @if (!inEditor()) {
      <header class="no-print sticky top-0 z-40 border-b bg-surface/90 backdrop-blur transition-shadow duration-200"
              [class]="scrolled() ? 'border-line shadow-(--shadow-card)' : 'border-transparent'">
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
      <nav class="no-print fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur md:hidden" aria-label="Navigation mobile">
        <div class="mx-auto grid max-w-md grid-cols-4 items-end px-3 pb-[max(8px,env(safe-area-inset-bottom))] pt-1.5">
          <a routerLink="/" routerLinkActive="active text-primary" [routerLinkActiveOptions]="{ exact: true }"
             class="group flex flex-col items-center gap-0.5 py-1 text-[11px] font-semibold text-muted transition-colors">
            <span class="grid h-8 w-14 place-items-center rounded-full transition-colors group-[.active]:bg-primary-soft"><app-icon name="home" [size]="22" /></span>Accueil</a>
          <a routerLink="/devis" routerLinkActive="active text-primary"
             class="group flex flex-col items-center gap-0.5 py-1 text-[11px] font-semibold text-muted transition-colors">
            <span class="grid h-8 w-14 place-items-center rounded-full transition-colors group-[.active]:bg-primary-soft"><app-icon name="folder" [size]="22" /></span>Devis</a>
          <button class="mx-auto -mt-7 grid size-14 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-surface shadow-(--shadow-pop) ring-4 ring-surface transition active:scale-90"
                  (click)="ui.newQuote()" aria-label="Nouveau devis"><app-icon name="plus" [size]="26" /></button>
          <button class="group flex flex-col items-center gap-0.5 py-1 text-[11px] font-semibold text-muted" (click)="ui.search()">
            <span class="grid h-8 w-14 place-items-center rounded-full transition-colors group-active:bg-primary-soft"><app-icon name="search" [size]="22" /></span>Chercher</button>
        </div>
      </nav>
    }
    @if (scrolled()) {
      <button class="no-print fixed bottom-24 right-3 z-40 grid size-10 place-items-center rounded-full border border-line bg-surface text-primary shadow-(--shadow-pop) transition hover:bg-primary hover:text-surface active:scale-90 md:bottom-6 md:right-6"
              (click)="toTop()" tip="Haut de page"><app-icon name="arrow-up" [size]="20" /></button>
    }
    <app-toaster />
  `,
})
export class App {
  protected readonly ui = inject(Ui);
  private readonly router = inject(Router);
  protected readonly inEditor = signal(this.router.url.startsWith('/devis/'));
  protected readonly progress = signal(0);
  protected readonly scrolled = signal(false);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => this.inEditor.set(e.urlAfterRedirects.startsWith('/devis/')));
    this.ui.maybeTour();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onScroll() {
    const el = document.documentElement;
    const max = el.scrollHeight - el.clientHeight;
    this.progress.set(max > 0 ? Math.min(100, (el.scrollTop / max) * 100) : 0);
    this.scrolled.set(el.scrollTop > 24);
  }

  toTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.ui.search();
    }
  }
}
