// lib.dom saknar Network Information API och Device Memory API, så de
// två fälten läggs till här som valfria.
declare global {
  interface Navigator {
    readonly connection?: { readonly saveData?: boolean };
    readonly deviceMemory?: number;
  }
}

/**
 * Avgör om 3D-visaren ska laddas. Nej om användaren vill spara data,
 * har mindre än 3 GB minne, färre än fyra kärnor eller vill ha minskad
 * rörelse. Fält som webbläsaren inte rapporterar räknas som godkända.
 */
export function shouldLoad3d(
  nav: Pick<Navigator, 'connection' | 'deviceMemory' | 'hardwareConcurrency'> & {
    connection?: { saveData?: boolean };
  },
  reducedMotion: boolean,
): boolean {
  if (reducedMotion) return false;
  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 3) return false;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return false;
  return true;
}
