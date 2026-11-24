import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fcfa' })
export class FcfaPipe implements PipeTransform {
  transform(v: number | null | undefined): string {
    const n = Math.round(Number(v) || 0);
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
