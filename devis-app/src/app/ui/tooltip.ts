import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component, Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';

@Component({ selector: 'app-tip-bubble', template: '{{ text }}', host: { class: 'tip-bubble', role: 'tooltip' } })
export class TipBubble {
  text = '';
}

/** Infobulle accessible (souris, clavier). Usage : <button tip="Dupliquer">…</button> */
@Directive({
  selector: '[tip]',
  host: {
    '(mouseenter)': 'show()',
    '(mouseleave)': 'hide()',
    '(focus)': 'show()',
    '(blur)': 'hide()',
    '(click)': 'hide()',
    '[attr.aria-label]': 'label()',
  },
})
export class Tip implements OnDestroy {
  readonly tip = input.required<string>();
  readonly tipPos = input<'above' | 'below'>('above');
  private readonly overlay = inject(Overlay);
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private ref?: OverlayRef;

  protected label() {
    const own = this.el.nativeElement.textContent?.trim();
    return own ? null : this.tip();
  }

  show() {
    if (this.ref || !this.tip()) return;
    const below = this.tipPos() === 'below';
    this.ref = this.overlay.create({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.el)
        .withPositions([
          { originX: 'center', originY: below ? 'bottom' : 'top', overlayX: 'center', overlayY: below ? 'top' : 'bottom', offsetY: below ? 8 : -8 },
          { originX: 'center', originY: below ? 'top' : 'bottom', overlayX: 'center', overlayY: below ? 'bottom' : 'top', offsetY: below ? -8 : 8 },
        ]),
      scrollStrategy: this.overlay.scrollStrategies.close(),
    });
    const c = this.ref.attach(new ComponentPortal(TipBubble));
    c.instance.text = this.tip();
    c.changeDetectorRef.detectChanges();
  }

  hide() {
    this.ref?.dispose();
    this.ref = undefined;
  }

  ngOnDestroy() {
    this.hide();
  }
}
