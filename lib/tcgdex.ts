import TCGdex from '@tcgdex/sdk';

const g = global as any;

export const tcgdex: TCGdex = g.tcgdex ?? new TCGdex('en');

if (!g.tcgdex) g.tcgdex = tcgdex;
