/**
 * GST (Goods and Services Tax) Calculation Utilities
 * For Indian tax system
 */

// HSN Code to GST Rate mapping
const HSN_GST_RATES: Record<string, number> = {
  // Electronics (18% GST)
  '8517': 18, // Mobile phones
  '8471': 18, // Laptops and computers
  '8528': 18, // Televisions
  '8519': 18, // Audio equipment
  '8525': 18, // Cameras
  '8527': 18, // Radio receivers
  '9504': 18, // Video game consoles

  // Luxury items (28% GST)
  '8703': 28, // Motor cars
  '9403': 28, // Luxury furniture
  '7113': 3, // Jewelry (3% for precious metals)
  '3304': 28, // Cosmetics (luxury)

  // Basic necessities (5% GST)
  '0901': 5, // Coffee
  '1701': 5, // Sugar
  '1905': 5, // Bread, biscuits
  '6302': 5, // Bed linen

  // Standard rate items (12% GST)
  '6109': 12, // T-shirts
  '6203': 12, // Men's suits
  '6403': 12, // Footwear
  '9404': 12, // Mattress supports, cushions

  // Default rate
  default: 18
};

// Category to typical GST rate mapping
const CATEGORY_GST_RATES: Record<string, number> = {
  electronics: 18,
  smartphones: 18,
  laptops: 18,
  televisions: 18,
  appliances: 18,
  fashion: 12,
  clothing: 12,
  footwear: 12,
  furniture: 12,
  books: 0, // Books are exempt
  groceries: 5,
  'home-decor': 18,
  toys: 12,
  sports: 18,
  beauty: 28,
  jewelry: 3,
  automobiles: 28,
  default: 18
};

export interface GSTBreakdown {
  basePrice: number;
  gstRate: number;
  cgst: number; // Central GST
  sgst: number; // State GST
  igst: number; // Integrated GST
  totalGst: number;
  totalPrice: number;
}

/**
 * Get GST rate for HSN code
 */
export function getGSTRateByHSN(hsnCode: string): number {
  // Normalize HSN code (remove spaces, convert to uppercase)
  const normalized = hsnCode.replace(/\s/g, '').toUpperCase();

  // Try exact match first
  if (HSN_GST_RATES[normalized]) {
    return HSN_GST_RATES[normalized];
  }

  // Try partial match (first 4 digits)
  const partial = normalized.substring(0, 4);
  if (HSN_GST_RATES[partial]) {
    return HSN_GST_RATES[partial];
  }

  // Return default rate
  return HSN_GST_RATES.default;
}

/**
 * Get GST rate for product category
 */
export function getGSTRateByCategory(category: string): number {
  const normalized = category.toLowerCase().replace(/\s/g, '-');
  return CATEGORY_GST_RATES[normalized] || CATEGORY_GST_RATES.default;
}

/**
 * Calculate GST breakdown
 */
export function calculateGST(
  basePrice: number,
  gstRate: number,
  isInterstate: boolean = false
): GSTBreakdown {
  const gstAmount = (basePrice * gstRate) / 100;
  const totalPrice = basePrice + gstAmount;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isInterstate) {
    // For interstate transactions, use IGST
    igst = gstAmount;
  } else {
    // For intrastate transactions, split between CGST and SGST
    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
  }

  return {
    basePrice: Math.round(basePrice * 100) / 100,
    gstRate,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    totalGst: Math.round(gstAmount * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100
  };
}

/**
 * Calculate GST from HSN code
 */
export function calculateGSTFromHSN(
  basePrice: number,
  hsnCode: string,
  isInterstate: boolean = false
): GSTBreakdown {
  const gstRate = getGSTRateByHSN(hsnCode);
  return calculateGST(basePrice, gstRate, isInterstate);
}

/**
 * Calculate GST from category
 */
export function calculateGSTFromCategory(
  basePrice: number,
  category: string,
  isInterstate: boolean = false
): GSTBreakdown {
  const gstRate = getGSTRateByCategory(category);
  return calculateGST(basePrice, gstRate, isInterstate);
}

/**
 * Calculate reverse GST (extract GST from total price)
 */
export function calculateReverseGST(
  totalPrice: number,
  gstRate: number,
  isInterstate: boolean = false
): GSTBreakdown {
  const basePrice = (totalPrice * 100) / (100 + gstRate);
  const gstAmount = totalPrice - basePrice;

  let cgst = 0;
  let sgst = 0;
  let igst = 0;

  if (isInterstate) {
    igst = gstAmount;
  } else {
    cgst = gstAmount / 2;
    sgst = gstAmount / 2;
  }

  return {
    basePrice: Math.round(basePrice * 100) / 100,
    gstRate,
    cgst: Math.round(cgst * 100) / 100,
    sgst: Math.round(sgst * 100) / 100,
    igst: Math.round(igst * 100) / 100,
    totalGst: Math.round(gstAmount * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100
  };
}

/**
 * Format GST breakdown as string
 */
export function formatGSTBreakdown(breakdown: GSTBreakdown, isInterstate: boolean = false): string {
  let formatted = `Base Price: ₹${breakdown.basePrice.toLocaleString('en-IN')}\n`;
  formatted += `GST Rate: ${breakdown.gstRate}%\n`;

  if (isInterstate) {
    formatted += `IGST (${breakdown.gstRate}%): ₹${breakdown.igst.toLocaleString('en-IN')}\n`;
  } else {
    formatted += `CGST (${breakdown.gstRate / 2}%): ₹${breakdown.cgst.toLocaleString('en-IN')}\n`;
    formatted += `SGST (${breakdown.gstRate / 2}%): ₹${breakdown.sgst.toLocaleString('en-IN')}\n`;
  }

  formatted += `Total GST: ₹${breakdown.totalGst.toLocaleString('en-IN')}\n`;
  formatted += `Total Price: ₹${breakdown.totalPrice.toLocaleString('en-IN')}`;

  return formatted;
}

/**
 * Get all GST rates
 */
export function getAllGSTRates(): Array<{ rate: number; description: string }> {
  return [
    { rate: 0, description: 'Nil rated (Books, Education)' },
    { rate: 3, description: 'Precious metals (Gold, Silver)' },
    { rate: 5, description: 'Essential items (Sugar, Tea, Edible oils)' },
    { rate: 12, description: 'Standard items (Computers, Processed food)' },
    { rate: 18, description: 'Most goods and services' },
    { rate: 28, description: 'Luxury and sin goods (Cars, Tobacco)' }
  ];
}

/**
 * Validate GST number format
 */
export function validateGSTNumber(gstNumber: string): {
  valid: boolean;
  message: string;
  details?: {
    stateCode: string;
    panNumber: string;
    entityNumber: string;
    checksum: string;
  };
} {
  // GST format: 2 digits (state code) + 10 digits (PAN) + 1 digit (entity number) + 1 letter (Z) + 1 checksum
  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (!gstRegex.test(gstNumber)) {
    return {
      valid: false,
      message: 'Invalid GST number format'
    };
  }

  return {
    valid: true,
    message: 'Valid GST number',
    details: {
      stateCode: gstNumber.substring(0, 2),
      panNumber: gstNumber.substring(2, 12),
      entityNumber: gstNumber.substring(12, 13),
      checksum: gstNumber.substring(14, 15)
    }
  };
}

/**
 * Calculate GST for multiple items (invoice)
 */
export function calculateInvoiceGST(
  items: Array<{
    name: string;
    basePrice: number;
    quantity: number;
    gstRate: number;
  }>,
  isInterstate: boolean = false
): {
  items: Array<{
    name: string;
    basePrice: number;
    quantity: number;
    gstRate: number;
    gst: GSTBreakdown;
    lineTotal: number;
  }>;
  totals: {
    totalBasePrice: number;
    totalGST: number;
    totalCGST: number;
    totalSGST: number;
    totalIGST: number;
    grandTotal: number;
  };
} {
  const calculatedItems = items.map(item => {
    const itemBasePrice = item.basePrice * item.quantity;
    const gst = calculateGST(itemBasePrice, item.gstRate, isInterstate);

    return {
      ...item,
      gst,
      lineTotal: gst.totalPrice
    };
  });

  const totals = calculatedItems.reduce(
    (acc, item) => ({
      totalBasePrice: acc.totalBasePrice + item.gst.basePrice,
      totalGST: acc.totalGST + item.gst.totalGst,
      totalCGST: acc.totalCGST + item.gst.cgst,
      totalSGST: acc.totalSGST + item.gst.sgst,
      totalIGST: acc.totalIGST + item.gst.igst,
      grandTotal: acc.grandTotal + item.lineTotal
    }),
    {
      totalBasePrice: 0,
      totalGST: 0,
      totalCGST: 0,
      totalSGST: 0,
      totalIGST: 0,
      grandTotal: 0
    }
  );

  return {
    items: calculatedItems,
    totals: {
      totalBasePrice: Math.round(totals.totalBasePrice * 100) / 100,
      totalGST: Math.round(totals.totalGST * 100) / 100,
      totalCGST: Math.round(totals.totalCGST * 100) / 100,
      totalSGST: Math.round(totals.totalSGST * 100) / 100,
      totalIGST: Math.round(totals.totalIGST * 100) / 100,
      grandTotal: Math.round(totals.grandTotal * 100) / 100
    }
  };
}

/**
 * Get state code from GST number
 */
export function getStateFromGST(gstNumber: string): string | null {
  const validation = validateGSTNumber(gstNumber);
  if (!validation.valid || !validation.details) {
    return null;
  }

  const stateCode = validation.details.stateCode;
  const stateCodes: Record<string, string> = {
    '01': 'Jammu and Kashmir',
    '02': 'Himachal Pradesh',
    '03': 'Punjab',
    '04': 'Chandigarh',
    '05': 'Uttarakhand',
    '06': 'Haryana',
    '07': 'Delhi',
    '08': 'Rajasthan',
    '09': 'Uttar Pradesh',
    '10': 'Bihar',
    '11': 'Sikkim',
    '12': 'Arunachal Pradesh',
    '13': 'Nagaland',
    '14': 'Manipur',
    '15': 'Mizoram',
    '16': 'Tripura',
    '17': 'Meghalaya',
    '18': 'Assam',
    '19': 'West Bengal',
    '20': 'Jharkhand',
    '21': 'Odisha',
    '22': 'Chhattisgarh',
    '23': 'Madhya Pradesh',
    '24': 'Gujarat',
    '27': 'Maharashtra',
    '29': 'Karnataka',
    '30': 'Goa',
    '32': 'Kerala',
    '33': 'Tamil Nadu',
    '34': 'Puducherry',
    '35': 'Andaman and Nicobar Islands',
    '36': 'Telangana',
    '37': 'Andhra Pradesh'
  };

  return stateCodes[stateCode] || null;
}
