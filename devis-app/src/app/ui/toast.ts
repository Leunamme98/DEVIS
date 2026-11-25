import { Component, Injectable, inject, signal } from '@angular/core';
import { Icon } from './icon';

export interface Toast {
  id: number;
  kind: 'success' | 'info' | 'error';
  message: string;
  actionLabel?: string;
  action?: () => void;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private n = 0;

  show(message: string, opts: Partial<Omit<Toast, 'id' | 'message'>> = {}, ms = 4500) {
    const t: Toast = { id: ++this.n, kind: 'success', message, ...opts };
    this.toasts.update((l) => [...l, t]);
    setTimeout(() => this.dismiss(t.id), opts.action ? 7000 : ms);
  }
  success(m: string) { this.show(m); }
  error(m: string) { this.show(m, { kind: 'error' }); }
  dismiss(id: number) { this.toasts.update((l) => l.filter((t) => t.id !== id)); }
}

@Component({
  selector: 'app-toaster',
  imports: [Icon],
  template: `
    <div class="no-print pointer-events-none fixed inset-x-0 bottom-20 z-[1100] flex flex-col items-center gap-2 px-3 md:bottom-6"
         role="status" aria-live="polite">
      @for (t of svc.toasts(); track t.id) {
        <div class="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl bg-ink px-4 py-3 text-sm text-surface shadow-(--shadow-pop)"
             [class.ring-2]="t.kind === 'error'" [class.ring-danger]="t.kind === 'error'">
          <app-icon [name]="t.kind === 'error' ? 'warning' : t.kind === 'info' ? 'info' : 'check'" [size]="18" />
          <span class="flex-1">{{ t.message }}</span>
          @if (t.action) {
            <button class="rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wide text-accent hover:bg-surface/10"
                    (click)="t.action!(); svc.dismiss(t.id)">{{ t.actionLabel }}</button>
          }
          <button class="text-surface/60 hover:text-surface" (click)="svc.dismiss(t.id)" aria-label="Fermer"><app-icon name="x" [size]="16" /></button>
        </div>
      }
    </div>
  `,
})
export class Toaster {
  protected readonly svc = inject(ToastService);
}
