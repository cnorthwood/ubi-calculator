export const POPULATION_OF_UK = 52_487_600;
export const LIVING_WAGE = 348.75;
export const NUM_UK_TAXPAYERS = 31_200_000;

export const SPENDING = {
  NHS: 158_700_000_000,
  Education: 44_600_000_000,
  Defence: 50_300_000_000,
  Police: 17_900_000_000,
  Transport: 25_100_000_000,
  Administration: 11_500_000_000,
  Other: 74_300_000_000,
  Capital: 51_000_000_000,
  Welfare: 71_400_000_000,
};

export const TAXES = {
  Corporation: 58_200_000_000,
  "Capital Gains": 14_400_000_000,
  VAT: 186_300_000_000,
  Customs: 49_800_000_000,
  Sins: 21_700_000_000,
  Transport: 34_900_000_000,
};

export const NI_PRIMARY_THRESHOLD = 183;
export const NI_PRIMARY_RATE = 0.12;
export const NI_UPPER_EARNINGS_LIMIT = 962;
export const NI_ABOVE_UPPER_RATE = 0.02;
export const NI_SECONDARY_THRESHOLD = 169;
export const NI_SECONDARY_RATE = 0.138;

export interface TaxBand {
  rate: number;
  bandStart: number;
  bandEnd?: number;
}

export const CURRENT_TAX_BANDS: TaxBand[] = [
  { bandStart: 12_500, bandEnd: 50_000, rate: 0.2 },
  { bandStart: 50_000, bandEnd: 150_000, rate: 0.4 },
  { bandStart: 150_000, rate: 0.45 },
];

export const PERCENTILES = [
  11200,
  11500,
  11700,
  11900,
  12200,
  12400,
  12600,
  12800,
  13100,
  13300,
  13500,
  13700,
  13900,
  14200,
  14400,
  14600,
  15100,
  15300,
  15500,
  15800,
  16000,
  16200,
  16400,
  16700,
  16900,
  17100,
  17400,
  17600,
  17800,
  18100,
  18300,
  18600,
  18800,
  19100,
  19300,
  19600,
  19900,
  20200,
  20500,
  20800,
  21100,
  21400,
  21700,
  22000,
  22300,
  22600,
  22900,
  23300,
  23600,
  23900,
  24300,
  24700,
  25000,
  25400,
  25900,
  26300,
  26700,
  27100,
  27500,
  27900,
  28400,
  28800,
  29300,
  29800,
  30300,
  30900,
  31500,
  32000,
  32600,
  33200,
  33900,
  34500,
  35200,
  36000,
  36700,
  37500,
  38300,
  39200,
  40000,
  41000,
  42000,
  42900,
  43700,
  44900,
  46200,
  47800,
  49600,
  51400,
  53600,
  56300,
  59500,
  63500,
  68600,
  75300,
  83700,
  96400,
  116000,
  166000,
];
