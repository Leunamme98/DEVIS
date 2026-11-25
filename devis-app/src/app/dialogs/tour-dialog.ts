import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { Icon } from '../ui/icon';

const STEPS = [
  {
    icon: 'sparkles',
    title: 'Bienvenue sur Sky Alu Devis',
    text: 'Créez, suivez et envoyez vos devis en quelques minutes, depuis votre téléphone ou votre ordinateur.',
  },
  {
    icon: 'file-plus',
    title: "Partez d'un modèle",
    text: 'Cabine de douche, fenêtre, porte… Choisissez un modèle : les sections et les prix de base sont déjà remplis.',
  },
  {
    icon: 'edit',
    title: 'Modifiez, tout se calcule',
    text: "Changez les quantités et les prix : les totaux, la TVA et l'aperçu se mettent à jour. Tout est enregistré automatiquement.",
  },
  {
    icon: 'share',
    title: 'Partagez en un clic',
    text: 'Exportez en PDF ou envoyez un récapitulatif par WhatsApp, puis suivez le statut : Brouillon, Envoyé, Accepté, Refusé.',
  },
];

@Component({
  selector: 'app-tour-dialog',
  imports: [Icon],
  template: `
    <div class="dialog-panel overflow-hidden" role="dialog" aria-labelledby="tour-title">
      <div class="bg-ink px-6 py-8 text-center text-surface">
        <span class="mx-auto grid size-14 place-items-center rounded-2xl bg-primary"><app-icon [name]="step().icon" [size]="28" /></span>
      </div>
      <div class="p-6 text-center">
        <h2 id="tour-title" class="text-xl font-bold">{{ step().title }}</h2>
        <p class="mx-auto mt-2 max-w-sm text-sm text-muted">{{ step().text }}</p>
        <div class="mt-5 flex justify-center gap-1.5" aria-hidden="true">
          @for (s of steps; track $index) {
            <span class="h-1.5 rounded-full transition-all" [class]="$index === i() ? 'w-6 bg-primary' : 'w-1.5 bg-line'"></span>
          }
        </div>
        <div class="mt-6 flex items-center justify-between">
          <button class="btn-ghost" (click)="ref.close()">Passer</button>
          <div class="flex gap-2">
            @if (i() > 0) {
              <button class="btn-secondary" (click)="i.set(i() - 1)">Retour</button>
            }
            @if (i() < steps.length - 1) {
              <button class="btn-primary" (click)="i.set(i() + 1)" cdkFocusInitial>
                Suivant<app-icon name="arrow-right" [size]="16" />
              </button>
            } @else {
              <button class="btn-primary" (click)="ref.close()" cdkFocusInitial>C'est parti</button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class TourDialog {
  protected readonly ref = inject(DialogRef);
  protected readonly steps = STEPS;
  protected readonly i = signal(0);
  protected step() {
    return STEPS[this.i()];
  }
}
