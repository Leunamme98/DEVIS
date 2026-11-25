import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';
import { FcfaPipe } from '../core/fcfa.pipe';
import { Quote } from '../core/models';
import { grandTotal } from '../core/quote.store';
import { Icon } from '../ui/icon';
import { Tip } from '../ui/tooltip';

export type ShareAction = 'print' | 'whatsapp' | 'copy';

@Component({
  selector: 'app-share-dialog',
  imports: [Icon, FcfaPipe, Tip],
  template: `
    <div class="dialog-panel" role="dialog" aria-labelledby="sd-title">
      <div class="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 id="sd-title" class="text-lg font-bold">Partager le devis</h2>
        <button class="btn-icon" (click)="ref.close()" aria-label="Fermer"><app-icon name="x" /></button>
      </div>
      <div class="grid gap-3 p-6">
        <div class="rounded-xl bg-bg p-4 text-sm">
          <p class="font-semibold">Devis {{ quote.number || '—' }} · {{ quote.client || 'Client non renseigné' }}</p>
          <p class="text-muted">{{ quote.project || 'Sans projet' }}</p>
          <p class="mt-1 text-lg font-bold text-primary">{{ total | fcfa }} FCFA</p>
        </div>

        <button class="btn-secondary !justify-start !py-3" (click)="ref.close('print')" cdkFocusInitial>
          <span class="grid size-9 place-items-center rounded-lg bg-primary-soft text-primary"><app-icon name="download" /></span>
          <span class="text-left"
            ><span class="block">Télécharger en PDF</span>
            <span class="block text-xs font-normal text-muted">Choisissez « Enregistrer au format PDF »</span></span
          >
        </button>
        <button class="btn-secondary !justify-start !py-3" (click)="ref.close('whatsapp')">
          <span class="grid size-9 place-items-center rounded-lg bg-success-soft text-success"><app-icon name="whatsapp" /></span>
          <span class="text-left"
            ><span class="block">Envoyer par WhatsApp</span>
            <span class="block text-xs font-normal text-muted">Un message récapitulatif est prêt à envoyer</span></span
          >
        </button>
        <button class="btn-secondary !justify-start !py-3" (click)="ref.close('copy')">
          <span class="grid size-9 place-items-center rounded-lg bg-accent-soft text-primary"><app-icon name="copy" /></span>
          <span class="text-left"
            ><span class="block">Copier le récapitulatif</span>
            <span class="block text-xs font-normal text-muted">Pour le coller dans un SMS ou un e-mail</span></span
          >
        </button>
        <p class="flex items-center gap-1.5 text-xs text-muted">
          <app-icon name="info" [size]="14" />
          <span tip="Après l'envoi, passez le statut du devis sur « Envoyé » pour suivre vos relances."
            >Astuce : mettez à jour le statut après l'envoi.</span
          >
        </p>
      </div>
    </div>
  `,
})
export class ShareDialog {
  protected readonly quote = inject<Quote>(DIALOG_DATA);
  protected readonly ref = inject<DialogRef<ShareAction>>(DialogRef);
  protected readonly total = grandTotal(this.quote);
}
