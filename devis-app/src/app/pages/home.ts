import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FcfaPipe } from '../core/fcfa.pipe';
import { grandTotal, QuoteStore } from '../core/quote.store';
import { TEMPLATES } from '../core/templates';
import { Icon } from '../ui/icon';
import { QuotesTable } from '../ui/quotes-table';
import { Tip } from '../ui/tooltip';
import { Ui } from '../ui/ui.service';

@Component({
  selector: 'app-home',
  imports: [RouterLink, FcfaPipe, Icon, QuotesTable, Tip],
  templateUrl: './home.html',
})
export class Home {
  protected readonly ui = inject(Ui);
  private readonly store = inject(QuoteStore);
  protected readonly templates = TEMPLATES;
  protected readonly all = this.store.quotes;
  protected readonly recent = computed(() => [...this.all()].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5));

  protected readonly greeting = (() => {
    const h = new Date().getHours();
    return h < 5 || h >= 18 ? 'Bonsoir' : 'Bonjour';
  })();

  protected readonly kpis = computed(() => {
    const now = new Date();
    const ym = now.toISOString().slice(0, 7);
    const list = this.all();
    const month = list.filter((q) => q.date.startsWith(ym));
    const sum = (l: typeof list) => l.reduce((a, q) => a + grandTotal(q), 0);
    const sent = list.filter((q) => q.status === 'sent');
    const accepted = list.filter((q) => q.status === 'accepted');
    return [
      { label: 'Devis ce mois-ci', value: String(month.length), sub: 'créés depuis le 1er', icon: 'file', tip: 'Nombre de devis dont la date est dans le mois en cours.' },
      { label: 'Montant du mois', value: sum(month), unit: 'FCFA', sub: 'tous statuts confondus', icon: 'wallet', tip: 'Somme des totaux (TVA incluse) des devis du mois.' },
      { label: 'En attente de réponse', value: String(sent.length), sub: sum(sent) + ' FCFA', money: sum(sent), icon: 'clock', tip: 'Devis au statut « Envoyé » : à relancer.' },
      { label: 'Devis acceptés', value: String(accepted.length), sub: 'montant', money: sum(accepted), icon: 'badge', tip: 'Devis acceptés par vos clients.' },
    ];
  });
}
