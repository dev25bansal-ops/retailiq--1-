/**
 * GST Utility Functions Tests
 */

import {
  getGSTRateByCategory,
  calculateGST,
  validateGSTNumber,
  getGSTRateByHSN,
  calculateReverseGST,
  calculateInvoiceGST,
  getStateFromGST
} from '../../src/utils/gst';

describe('GST Utility Functions', () => {
  describe('getGSTRateByCategory', () => {
    test('should return 18% for electronics category', () => {
      const rate = getGSTRateByCategory('electronics');
      expect(rate).toBe(18);
    });

    test('should return 18% for smartphones category', () => {
      const rate = getGSTRateByCategory('smartphones');
      expect(rate).toBe(18);
    });

    test('should return 12% for fashion category', () => {
      const rate = getGSTRateByCategory('fashion');
      expect(rate).toBe(12);
    });

    test('should return 0% for books category', () => {
      const rate = getGSTRateByCategory('books');
      expect(rate).toBe(0);
    });

    test('should return 28% for beauty category', () => {
      const rate = getGSTRateByCategory('beauty');
      expect(rate).toBe(28);
    });

    test('should return default rate for unknown category', () => {
      const rate = getGSTRateByCategory('unknown-category');
      expect(rate).toBe(18);
    });

    test('should handle case-insensitive category names', () => {
      const rate = getGSTRateByCategory('ELECTRONICS');
      expect(rate).toBe(18);
    });

    test('should handle category names with spaces', () => {
      const rate = getGSTRateByCategory('home decor');
      expect(rate).toBe(18);
    });
  });

  describe('calculateGST', () => {
    test('should calculate correct CGST/SGST breakdown for intrastate transaction', () => {
      const result = calculateGST(10000, 18, false);

      expect(result.basePrice).toBe(10000);
      expect(result.gstRate).toBe(18);
      expect(result.cgst).toBe(900); // 9% of 10000
      expect(result.sgst).toBe(900); // 9% of 10000
      expect(result.igst).toBe(0);
      expect(result.totalGst).toBe(1800); // 18% of 10000
      expect(result.totalPrice).toBe(11800);
    });

    test('should calculate correct IGST for interstate transaction', () => {
      const result = calculateGST(10000, 18, true);

      expect(result.basePrice).toBe(10000);
      expect(result.gstRate).toBe(18);
      expect(result.cgst).toBe(0);
      expect(result.sgst).toBe(0);
      expect(result.igst).toBe(1800); // 18% of 10000
      expect(result.totalGst).toBe(1800);
      expect(result.totalPrice).toBe(11800);
    });

    test('should handle 12% GST rate', () => {
      const result = calculateGST(5000, 12, false);

      expect(result.basePrice).toBe(5000);
      expect(result.gstRate).toBe(12);
      expect(result.cgst).toBe(300); // 6% of 5000
      expect(result.sgst).toBe(300); // 6% of 5000
      expect(result.totalGst).toBe(600);
      expect(result.totalPrice).toBe(5600);
    });

    test('should handle 0% GST rate (exempt items)', () => {
      const result = calculateGST(1000, 0, false);

      expect(result.basePrice).toBe(1000);
      expect(result.gstRate).toBe(0);
      expect(result.cgst).toBe(0);
      expect(result.sgst).toBe(0);
      expect(result.igst).toBe(0);
      expect(result.totalGst).toBe(0);
      expect(result.totalPrice).toBe(1000);
    });

    test('should round values to 2 decimal places', () => {
      const result = calculateGST(333.33, 18, false);

      expect(result.basePrice).toBe(333.33);
      expect(result.cgst).toBe(30);
      expect(result.sgst).toBe(30);
      expect(result.totalGst).toBe(60);
      expect(result.totalPrice).toBe(393.33);
    });
  });

  describe('validateGSTNumber', () => {
    test('should validate correct GST number', () => {
      const result = validateGSTNumber('27AABCU9603R1ZM');

      expect(result.valid).toBe(true);
      expect(result.message).toBe('Valid GST number');
      expect(result.details).toBeDefined();
      expect(result.details?.stateCode).toBe('27');
      expect(result.details?.panNumber).toBe('AABCU9603R');
      expect(result.details?.entityNumber).toBe('1');
      expect(result.details?.checksum).toBe('M');
    });

    test('should validate another correct GST number', () => {
      const result = validateGSTNumber('29ABCDE1234F1Z5');

      expect(result.valid).toBe(true);
      expect(result.message).toBe('Valid GST number');
      expect(result.details).toBeDefined();
      expect(result.details?.stateCode).toBe('29');
      expect(result.details?.panNumber).toBe('ABCDE1234F');
    });

    test('should reject GST number with invalid format', () => {
      const result = validateGSTNumber('27AABCU9603');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid GST number format');
      expect(result.details).toBeUndefined();
    });

    test('should reject GST number with lowercase letters', () => {
      const result = validateGSTNumber('27aabcu9603r1zm');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid GST number format');
    });

    test('should reject GST number with invalid state code', () => {
      const result = validateGSTNumber('AAAABCU9603R1ZM');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid GST number format');
    });

    test('should reject empty GST number', () => {
      const result = validateGSTNumber('');

      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid GST number format');
    });
  });

  describe('getGSTRateByHSN', () => {
    test('should return correct rate for mobile phones HSN code', () => {
      const rate = getGSTRateByHSN('8517');
      expect(rate).toBe(18);
    });

    test('should return correct rate for motor cars HSN code', () => {
      const rate = getGSTRateByHSN('8703');
      expect(rate).toBe(28);
    });

    test('should return correct rate for jewelry HSN code', () => {
      const rate = getGSTRateByHSN('7113');
      expect(rate).toBe(3);
    });

    test('should handle HSN codes with spaces', () => {
      const rate = getGSTRateByHSN('85 17');
      expect(rate).toBe(18);
    });

    test('should return default rate for unknown HSN code', () => {
      const rate = getGSTRateByHSN('9999');
      expect(rate).toBe(18);
    });
  });

  describe('calculateReverseGST', () => {
    test('should extract GST from total price', () => {
      const result = calculateReverseGST(11800, 18, false);

      expect(result.basePrice).toBe(10000);
      expect(result.gstRate).toBe(18);
      expect(result.totalGst).toBe(1800);
      expect(result.cgst).toBe(900);
      expect(result.sgst).toBe(900);
      expect(result.totalPrice).toBe(11800);
    });

    test('should handle interstate reverse GST calculation', () => {
      const result = calculateReverseGST(11800, 18, true);

      expect(result.basePrice).toBe(10000);
      expect(result.igst).toBe(1800);
      expect(result.cgst).toBe(0);
      expect(result.sgst).toBe(0);
    });
  });

  describe('calculateInvoiceGST', () => {
    test('should calculate GST for multiple items', () => {
      const items = [
        { name: 'Laptop', basePrice: 50000, quantity: 1, gstRate: 18 },
        { name: 'Mouse', basePrice: 500, quantity: 2, gstRate: 18 },
        { name: 'T-shirt', basePrice: 1000, quantity: 3, gstRate: 12 }
      ];

      const result = calculateInvoiceGST(items, false);

      expect(result.items).toHaveLength(3);
      expect(result.totals.totalBasePrice).toBe(54000);
      expect(result.totals.grandTotal).toBeGreaterThan(54000);
      expect(result.totals.totalCGST).toBeGreaterThan(0);
      expect(result.totals.totalSGST).toBeGreaterThan(0);
      expect(result.totals.totalIGST).toBe(0);
    });

    test('should calculate interstate invoice GST', () => {
      const items = [
        { name: 'Product 1', basePrice: 1000, quantity: 1, gstRate: 18 }
      ];

      const result = calculateInvoiceGST(items, true);

      expect(result.totals.totalIGST).toBeGreaterThan(0);
      expect(result.totals.totalCGST).toBe(0);
      expect(result.totals.totalSGST).toBe(0);
    });
  });

  describe('getStateFromGST', () => {
    test('should return correct state for Maharashtra GST number', () => {
      const state = getStateFromGST('27AABCU9603R1ZM');
      expect(state).toBe('Maharashtra');
    });

    test('should return correct state for Karnataka GST number', () => {
      const state = getStateFromGST('29ABCDE1234F1Z5');
      expect(state).toBe('Karnataka');
    });

    test('should return correct state for Delhi GST number', () => {
      const state = getStateFromGST('07ABCDE1234F1Z5');
      expect(state).toBe('Delhi');
    });

    test('should return null for invalid GST number', () => {
      const state = getStateFromGST('INVALID');
      expect(state).toBeNull();
    });

    test('should return null for unknown state code', () => {
      const state = getStateFromGST('99ABCDE1234F1Z5');
      expect(state).toBeNull();
    });
  });
});
