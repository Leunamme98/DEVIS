import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TEMPLATES, TemplateId } from '../core/templates';
import { Icon } from '../ui/icon';

export interface NewQuoteResult {
  template: TemplateId;
  client: string;
  project: string;
}

@Component({
  selector: 'app-new-quote-dialog',
  imports: [FormsModule, Icon],
  template: `
    <div class="dialog-panel" role="dialog" aria-labelledby="nq-title">
      <div class="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 id="nq-title" class="text-lg font-bold">Nouveau devis</h2>
        <button class="btn-icon" (click)="ref.close()" aria-label="Fermer"><app-icon name="x" /></button>
      </div>
      <div class="grid gap-5 p-6">
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">1 · Choisissez un modèle</p>
          <div class="grid gap-2 sm:grid-cols-2">
            @for (t of templates; track t.id) {
              <button
                type="button"
                (click)="template = t.id"
                class="flex items-start gap-3 rounded-xl border p-3 text-left transition"
                [class]="template === t.id ? 'border-primary bg-primary-soft ring-3 ring-primary/15' : 'border-line hover:border-primary/40'"
              >
                <span class="grid size-9 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary"
                  ><app-icon [name]="t.icon"
                /></span>
                <span>
                  <span class="block text-sm font-semibold">{{ t.name }}</span>
                  <span class="block text-xs text-muted">{{ t.description }}</span>
                </span>
              </button>
            }
          </div>
        </div>
        <div>
          <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">2 · Pour qui ? (modifiable plus tard)</p>
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="field">Client <input class="input" [(ngModel)]="client" placeholder="Ex. M. Kouassi" /></label>
            <label class="field">Projet <input class="input" [(ngModel)]="project" placeholder="Ex. Bingerville" /></label>
          </div>
        </div>
      </div>
      <div class="flex flex-col-reverse gap-2 border-t border-line px-6 py-4 sm:flex-row sm:justify-end">
        <button class="btn-secondary" (click)="ref.close()">Annuler</button>
        <button class="btn-primary" (click)="ok()" cdkFocusInitial><app-icon name="plus" [size]="16" />Créer le devis</button>
      </div>
    </div>
  `,
})
export class NewQuoteDialog {
  protected readonly ref = inject<DialogRef<NewQuoteResult>>(DialogRef);
  private readonly data = inject<{ template?: TemplateId } | null>(DIALOG_DATA, { optional: true });
  protected readonly templates = TEMPLATES;
  protected template: TemplateId = this.data?.template ?? 'cabine';
  protected client = '';
  protected project = '';

  ok() {
    this.ref.close({ template: this.template, client: this.client.trim(), project: this.project.trim() });
  }
}
