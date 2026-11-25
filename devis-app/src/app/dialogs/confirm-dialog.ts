import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { Icon } from '../ui/icon';

export interface ConfirmData {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [Icon],
  template: `
    <div class="dialog-panel p-6" role="alertdialog" aria-labelledby="cd-title">
      <div class="flex items-start gap-4">
        <span
          class="grid size-11 shrink-0 place-items-center rounded-full"
          [class]="data.danger ? 'bg-danger-soft text-danger' : 'bg-primary-soft text-primary'"
        >
          <app-icon [name]="data.danger ? 'trash' : 'info'" [size]="22" />
        </span>
        <div>
          <h2 id="cd-title" class="text-lg font-bold">{{ data.title }}</h2>
          <p class="mt-1 text-sm text-muted">{{ data.message }}</p>
        </div>
      </div>
      <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button class="btn-secondary" (click)="ref.close(false)">Annuler</button>
        <button [class]="data.danger ? 'btn-danger' : 'btn-primary'" (click)="ref.close(true)" cdkFocusInitial>
          {{ data.confirmLabel ?? 'Confirmer' }}
        </button>
      </div>
    </div>
  `,
})
export class ConfirmDialog {
  protected readonly data = inject<ConfirmData>(DIALOG_DATA);
  protected readonly ref = inject<DialogRef<boolean>>(DialogRef);
}
