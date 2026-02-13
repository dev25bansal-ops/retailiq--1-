/**
 * Seasonality Detection and Festival Impact Analysis
 * Specialized for Indian retail market with festival calendar
 */

export interface Festival {
  id: string;
  name: string;
  date: Date;
  categories: string[]; // Categories affected
  typicalDiscount: number; // Average discount percentage
  demandMultiplier: number; // Demand spike factor
  prePeriodDays: number; // Days before festival when deals start
  postPeriodDays: number; // Days after festival when deals end
}

export interface SeasonalPattern {
  month: number;
  averageDiscount: number;
  priceMultiplier: number;
  festivals: string[];
  confidence: number;
}

export interface FestivalImpact {
  festival: string;
  expectedDiscount: number;
  confidence: number;
  daysUntil: number;
  bestBuyWindow: {
    startDate: Date;
    endDate: Date;
  };
}

/**
 * Indian Festival Calendar (2024-2026 patterns)
 * Dates are approximate and repeat annually with variations
 */
export function getIndianFestivalCalendar(year: number): Festival[] {
  const festivals: Festival[] = [
    {
      id: 'makar-sankranti',
      name: 'Makar Sankranti',
      date: new Date(year, 0, 14), // January 14
      categories: ['electronics', 'home', 'clothing'],
      typicalDiscount: 15,
      demandMultiplier: 1.3,
      prePeriodDays: 7,
      postPeriodDays: 3
    },
    {
      id: 'republic-day',
      name: 'Republic Day',
      date: new Date(year, 0, 26), // January 26
      categories: ['electronics', 'appliances', 'fashion'],
      typicalDiscount: 30,
      demandMultiplier: 1.8,
      prePeriodDays: 10,
      postPeriodDays: 5
    },
    {
      id: 'holi',
      name: 'Holi',
      date: new Date(year, 2, 8), // March (varies)
      categories: ['clothing', 'cosmetics', 'home'],
      typicalDiscount: 20,
      demandMultiplier: 1.4,
      prePeriodDays: 7,
      postPeriodDays: 2
    },
    {
      id: 'ugadi',
      name: 'Ugadi/Gudi Padwa',
      date: new Date(year, 3, 9), // April (varies)
      categories: ['gold', 'electronics', 'clothing'],
      typicalDiscount: 15,
      demandMultiplier: 1.5,
      prePeriodDays: 5,
      postPeriodDays: 3
    },
    {
      id: 'eid',
      name: 'Eid-ul-Fitr',
      date: new Date(year, 3, 10), // Varies by lunar calendar
      categories: ['clothing', 'food', 'gifts'],
      typicalDiscount: 25,
      demandMultiplier: 1.6,
      prePeriodDays: 7,
      postPeriodDays: 3
    },
    {
      id: 'independence-day',
      name: 'Independence Day',
      date: new Date(year, 7, 15), // August 15
      categories: ['electronics', 'fashion', 'home'],
      typicalDiscount: 35,
      demandMultiplier: 2.0,
      prePeriodDays: 10,
      postPeriodDays: 5
    },
    {
      id: 'raksha-bandhan',
      name: 'Raksha Bandhan',
      date: new Date(year, 7, 19), // August (varies)
      categories: ['gifts', 'jewelry', 'clothing'],
      typicalDiscount: 20,
      demandMultiplier: 1.4,
      prePeriodDays: 5,
      postPeriodDays: 2
    },
    {
      id: 'ganesh-chaturthi',
      name: 'Ganesh Chaturthi',
      date: new Date(year, 8, 7), // September (varies)
      categories: ['home', 'electronics', 'gifts'],
      typicalDiscount: 18,
      demandMultiplier: 1.3,
      prePeriodDays: 5,
      postPeriodDays: 3
    },
    {
      id: 'navratri',
      name: 'Navratri',
      date: new Date(year, 9, 3), // October (varies)
      categories: ['clothing', 'jewelry', 'fashion'],
      typicalDiscount: 25,
      demandMultiplier: 1.7,
      prePeriodDays: 10,
      postPeriodDays: 5
    },
    {
      id: 'dussehra',
      name: 'Dussehra',
      date: new Date(year, 9, 12), // October (varies)
      categories: ['electronics', 'vehicles', 'gold'],
      typicalDiscount: 30,
      demandMultiplier: 2.0,
      prePeriodDays: 15,
      postPeriodDays: 5
    },
    {
      id: 'diwali',
      name: 'Diwali',
      date: new Date(year, 10, 1), // October-November (varies)
      categories: ['electronics', 'gold', 'clothing', 'home', 'appliances'],
      typicalDiscount: 40,
      demandMultiplier: 2.5,
      prePeriodDays: 20,
      postPeriodDays: 7
    },
    {
      id: 'black-friday',
      name: 'Black Friday',
      date: new Date(year, 10, 24), // Last Friday of November
      categories: ['electronics', 'fashion', 'appliances'],
      typicalDiscount: 50,
      demandMultiplier: 3.0,
      prePeriodDays: 3,
      postPeriodDays: 3
    },
    {
      id: 'cyber-monday',
      name: 'Cyber Monday',
      date: new Date(year, 10, 27), // Monday after Black Friday
      categories: ['electronics', 'gadgets', 'software'],
      typicalDiscount: 45,
      demandMultiplier: 2.8,
      prePeriodDays: 1,
      postPeriodDays: 2
    },
    {
      id: 'christmas',
      name: 'Christmas',
      date: new Date(year, 11, 25), // December 25
      categories: ['electronics', 'gifts', 'toys', 'fashion'],
      typicalDiscount: 35,
      demandMultiplier: 2.2,
      prePeriodDays: 15,
      postPeriodDays: 7
    },
    {
      id: 'new-year',
      name: 'New Year',
      date: new Date(year, 11, 31), // December 31
      categories: ['electronics', 'fashion', 'travel'],
      typicalDiscount: 30,
      demandMultiplier: 1.9,
      prePeriodDays: 10,
      postPeriodDays: 5
    }
  ];

  return festivals;
}

/**
 * Get all festivals within date range
 */
export function getFestivalsInRange(startDate: Date, endDate: Date): Festival[] {
  const year = startDate.getFullYear();
  const festivals = getIndianFestivalCalendar(year);

  // Also include next year if range spans multiple years
  if (endDate.getFullYear() > year) {
    festivals.push(...getIndianFestivalCalendar(year + 1));
  }

  return festivals.filter(festival => {
    const festivalDate = festival.date;
    return festivalDate >= startDate && festivalDate <= endDate;
  });
}

/**
 * Detect seasonal patterns from price history
 */
export function detectSeasonalPattern(
  priceHistory: { date: string; price: number; category?: string }[],
  category?: string
): SeasonalPattern[] {
  if (priceHistory.length === 0) return [];

  const sortedHistory = [...priceHistory].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Group prices by month
  const monthlyData: Map<number, { prices: number[]; dates: Date[] }> = new Map();

  for (const point of sortedHistory) {
    const date = new Date(point.date);
    const month = date.getMonth();

    if (!monthlyData.has(month)) {
      monthlyData.set(month, { prices: [], dates: [] });
    }

    monthlyData.get(month)!.prices.push(point.price);
    monthlyData.get(month)!.dates.push(date);
  }

  // Calculate average price across all data
  const allPrices = sortedHistory.map(p => p.price);
  const overallAverage = allPrices.reduce((sum, p) => sum + p, 0) / allPrices.length;

  // Build patterns for each month
  const patterns: SeasonalPattern[] = [];

  for (let month = 0; month < 12; month++) {
    const data = monthlyData.get(month);

    if (!data || data.prices.length < 2) {
      // No data for this month, use neutral pattern
      patterns.push({
        month,
        averageDiscount: 0,
        priceMultiplier: 1.0,
        festivals: [],
        confidence: 0
      });
      continue;
    }

    const monthlyAverage = data.prices.reduce((sum, p) => sum + p, 0) / data.prices.length;
    const priceMultiplier = monthlyAverage / overallAverage;
    const averageDiscount = ((overallAverage - monthlyAverage) / overallAverage) * 100;

    // Find festivals in this month
    const currentYear = new Date().getFullYear();
    const festivals = getIndianFestivalCalendar(currentYear)
      .filter(f => f.date.getMonth() === month)
      .filter(f => !category || f.categories.includes(category))
      .map(f => f.name);

    // Confidence based on data points
    const confidence = Math.min(data.prices.length / 10, 1);

    patterns.push({
      month,
      averageDiscount: Math.round(averageDiscount * 100) / 100,
      priceMultiplier: Math.round(priceMultiplier * 1000) / 1000,
      festivals,
      confidence: Math.round(confidence * 100) / 100
    });
  }

  return patterns;
}

/**
 * Get seasonal factor for a specific date
 */
export function getSeasonalFactor(
  date: Date,
  patterns: SeasonalPattern[]
): number {
  const month = date.getMonth();
  const pattern = patterns.find(p => p.month === month);

  if (!pattern || pattern.confidence < 0.3) {
    return 1.0; // Neutral factor if no pattern or low confidence
  }

  return pattern.priceMultiplier;
}

/**
 * Check if date is within festival window
 */
export function isInFestivalWindow(date: Date, festival: Festival): boolean {
  const festivalDate = festival.date;
  const windowStart = new Date(festivalDate);
  windowStart.setDate(windowStart.getDate() - festival.prePeriodDays);

  const windowEnd = new Date(festivalDate);
  windowEnd.setDate(windowEnd.getDate() + festival.postPeriodDays);

  return date >= windowStart && date <= windowEnd;
}

/**
 * Get upcoming festival impact for a product category
 */
export function getUpcomingFestivalImpact(
  productCategory: string,
  currentDate: Date = new Date()
): FestivalImpact | null {
  const lookAheadDays = 60;
  const endDate = new Date(currentDate);
  endDate.setDate(endDate.getDate() + lookAheadDays);

  const upcomingFestivals = getFestivalsInRange(currentDate, endDate)
    .filter(f => f.categories.includes(productCategory) || f.categories.includes('electronics'))
    .filter(f => f.date > currentDate);

  if (upcomingFestivals.length === 0) {
    return null;
  }

  // Get the next major festival (highest discount)
  const nextFestival = upcomingFestivals.sort(
    (a, b) => b.typicalDiscount - a.typicalDiscount
  )[0];

  const daysUntil = Math.floor(
    (nextFestival.date.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate confidence based on historical accuracy
  const confidence = Math.max(0.6, 1 - daysUntil / lookAheadDays);

  // Best buy window is typically during pre-period
  const windowStart = new Date(nextFestival.date);
  windowStart.setDate(windowStart.getDate() - nextFestival.prePeriodDays);

  const windowEnd = new Date(nextFestival.date);
  windowEnd.setDate(windowEnd.getDate() + 2); // Peak deals last 2 days after

  return {
    festival: nextFestival.name,
    expectedDiscount: nextFestival.typicalDiscount,
    confidence: Math.round(confidence * 100) / 100,
    daysUntil,
    bestBuyWindow: {
      startDate: windowStart,
      endDate: windowEnd
    }
  };
}

/**
 * Calculate festival-adjusted price
 */
export function getFestivalAdjustedPrice(
  basePrice: number,
  date: Date,
  category: string
): { adjustedPrice: number; discount: number; festival: string | null } {
  const currentYear = date.getFullYear();
  const festivals = getIndianFestivalCalendar(currentYear);

  for (const festival of festivals) {
    if (
      isInFestivalWindow(date, festival) &&
      (festival.categories.includes(category) || festival.categories.includes('electronics'))
    ) {
      const discount = festival.typicalDiscount;
      const adjustedPrice = basePrice * (1 - discount / 100);

      return {
        adjustedPrice: Math.round(adjustedPrice * 100) / 100,
        discount,
        festival: festival.name
      };
    }
  }

  return {
    adjustedPrice: basePrice,
    discount: 0,
    festival: null
  };
}
