const UNITS = [
  'zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix', 'onze', 'douze',
  'treize', 'quatorze', 'quinze', 'seize',
];
const TENS = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante'];

function below20(n: number): string {
  return n < 17 ? UNITS[n] : 'dix-' + UNITS[n - 10];
}

/** `final` : le nombre termine l'expression (accord de « quatre-vingts » et de « cents »). */
function below100(n: number, final: boolean): string {
  if (n < 20) return below20(n);
  if (n < 70) {
    const t = Math.floor(n / 10);
    const u = n % 10;
    return TENS[t] + (u === 0 ? '' : u === 1 ? '-et-un' : '-' + UNITS[u]);
  }
  if (n < 80) return 'soixante-' + (n === 71 ? 'et-' : '') + below20(n - 60);
  if (n === 80) return final ? 'quatre-vingts' : 'quatre-vingt';
  return 'quatre-vingt-' + below20(n - 80);
}

function below1000(n: number, final: boolean): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  if (h === 0) return below100(r, final);
  const hundreds = h === 1 ? 'cent' : UNITS[h] + ' cent';
  if (r === 0) return h === 1 ? 'cent' : hundreds + (final ? 's' : '');
  return hundreds + ' ' + below100(r, final);
}

/** 242600 → « deux cent quarante-deux mille six cents » (français). */
export function numberToFrench(value: number): string {
  let n = Math.round(Math.abs(Number(value) || 0));
  if (n === 0) return 'zéro';
  const parts: string[] = [];
  const billions = Math.floor(n / 1_000_000_000);
  n %= 1_000_000_000;
  const millions = Math.floor(n / 1_000_000);
  n %= 1_000_000;
  const thousands = Math.floor(n / 1000);
  const rest = n % 1000;

  if (billions) parts.push(below1000(billions, false) + (billions > 1 ? ' milliards' : ' milliard'));
  if (millions) parts.push(below1000(millions, false) + (millions > 1 ? ' millions' : ' million'));
  if (thousands) parts.push(thousands === 1 ? 'mille' : below1000(thousands, false) + ' mille');
  if (rest) parts.push(below1000(rest, true));
  return parts.join(' ');
}
