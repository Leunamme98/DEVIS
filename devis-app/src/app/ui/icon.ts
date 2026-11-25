import { Component, computed, input } from '@angular/core';
import {
  LucideArrowLeft, LucideArrowRight, LucideBadgeCheck, LucideChevronDown, LucideCircleHelp, LucideClock,
  LucideCopy, LucideDoorOpen, LucideDownload, LucideEllipsis, LucideFilePlus, LucideFileText, LucideFolderOpen,
  LucideGripVertical, LucideHouse, LucideImagePlus, LucideLayoutGrid, LucideCircleCheck, LucideMessageCircle,
  LucidePencil, LucidePlus, LucidePrinter, LucideRuler, LucideSearch, LucideSend, LucideShare2, LucideShowerHead,
  LucideSquareStack, LucideTrash2, LucideTriangleAlert, LucideUpload, LucideWallet, LucideX, LucideSparkles,
  LucideArrowUp, LucideArrowDown, LucideInfo, LucideCircleX, LucideBuilding2, LucideDynamicIcon, type LucideIconData,
} from '@lucide/angular';

const ICONS = {
  'arrow-left': LucideArrowLeft, 'arrow-right': LucideArrowRight, 'arrow-up': LucideArrowUp, 'arrow-down': LucideArrowDown,
  check: LucideCircleCheck, badge: LucideBadgeCheck, chevron: LucideChevronDown, help: LucideCircleHelp, clock: LucideClock,
  copy: LucideCopy, door: LucideDoorOpen, download: LucideDownload, more: LucideEllipsis, 'file-plus': LucideFilePlus,
  file: LucideFileText, folder: LucideFolderOpen, grip: LucideGripVertical, home: LucideHouse, 'image-plus': LucideImagePlus,
  grid: LucideLayoutGrid, whatsapp: LucideMessageCircle, edit: LucidePencil, plus: LucidePlus, print: LucidePrinter,
  ruler: LucideRuler, search: LucideSearch, send: LucideSend, share: LucideShare2, shower: LucideShowerHead,
  window: LucideSquareStack, trash: LucideTrash2, warning: LucideTriangleAlert, upload: LucideUpload, wallet: LucideWallet,
  x: LucideX, sparkles: LucideSparkles, info: LucideInfo, 'x-circle': LucideCircleX, building: LucideBuilding2,
} as const;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'app-icon',
  imports: [LucideDynamicIcon],
  template: `<svg [lucideIcon]="data()" [size]="size()" [strokeWidth]="1.9"></svg>`,
  host: { class: 'inline-flex shrink-0', 'aria-hidden': 'true' },
})
export class Icon {
  readonly name = input.required<string>();
  readonly size = input(18);
  protected readonly data = computed(() => (ICONS as unknown as Record<string, { icon: LucideIconData }>)[this.name()]?.icon ?? ICONS.file.icon);
}
