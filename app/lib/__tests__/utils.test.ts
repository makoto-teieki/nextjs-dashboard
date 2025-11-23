import {
  formatCurrency,
  formatDateToLocal,
  generateYAxis,
  generatePagination,
} from '../utils';

describe('formatCurrency', () => {
  it('should format cents to USD currency', () => {
    expect(formatCurrency(1000)).toBe('$10.00');
  });

  it('should format zero correctly', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('should format large amounts with commas', () => {
    expect(formatCurrency(123456789)).toBe('$1,234,567.89');
  });

  it('should handle decimal cents', () => {
    expect(formatCurrency(1050)).toBe('$10.50');
  });
});

describe('formatDateToLocal', () => {
  it('should format date string to en-US locale by default', () => {
    const result = formatDateToLocal('2024-01-15');
    expect(result).toMatch(/Jan 15, 2024/);
  });

  it('should format date string to specified locale', () => {
    const result = formatDateToLocal('2024-01-15', 'ja-JP');
    // Japanese locale formats dates differently
    expect(result).toBeTruthy();
  });

  it('should handle different date formats', () => {
    const result = formatDateToLocal('2024-12-25T10:30:00Z');
    expect(result).toMatch(/Dec 25, 2024/);
  });
});

describe('generateYAxis', () => {
  it('should generate correct y-axis labels for given revenue', () => {
    const revenue = [
      { month: 'Jan', revenue: 2000 },
      { month: 'Feb', revenue: 1800 },
      { month: 'Mar', revenue: 2200 },
    ];

    const result = generateYAxis(revenue);

    expect(result.topLabel).toBe(3000); // Math.ceil(2200/1000) * 1000
    expect(result.yAxisLabels).toEqual(['$3K', '$2K', '$1K', '$0K']);
  });

  it('should handle single revenue entry', () => {
    const revenue = [{ month: 'Jan', revenue: 5500 }];

    const result = generateYAxis(revenue);

    expect(result.topLabel).toBe(6000);
    expect(result.yAxisLabels).toEqual([
      '$6K',
      '$5K',
      '$4K',
      '$3K',
      '$2K',
      '$1K',
      '$0K',
    ]);
  });

  it('should handle zero revenue', () => {
    const revenue = [{ month: 'Jan', revenue: 0 }];

    const result = generateYAxis(revenue);

    expect(result.topLabel).toBe(0);
    expect(result.yAxisLabels).toEqual(['$0K']);
  });

  it('should round up to nearest 1000', () => {
    const revenue = [{ month: 'Jan', revenue: 1500 }];

    const result = generateYAxis(revenue);

    expect(result.topLabel).toBe(2000);
  });
});

describe('generatePagination', () => {
  describe('when total pages is 7 or less', () => {
    it('should return all page numbers', () => {
      expect(generatePagination(1, 5)).toEqual([1, 2, 3, 4, 5]);
      expect(generatePagination(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
    });
  });

  describe('when current page is among first 3 pages', () => {
    it('should show first 3, ellipsis, and last 2 pages', () => {
      expect(generatePagination(1, 10)).toEqual([1, 2, 3, '...', 9, 10]);
      expect(generatePagination(2, 10)).toEqual([1, 2, 3, '...', 9, 10]);
      expect(generatePagination(3, 10)).toEqual([1, 2, 3, '...', 9, 10]);
    });
  });

  describe('when current page is among last 3 pages', () => {
    it('should show first 2, ellipsis, and last 3 pages', () => {
      expect(generatePagination(8, 10)).toEqual([1, 2, '...', 8, 9, 10]);
      expect(generatePagination(9, 10)).toEqual([1, 2, '...', 8, 9, 10]);
      expect(generatePagination(10, 10)).toEqual([1, 2, '...', 8, 9, 10]);
    });
  });

  describe('when current page is in the middle', () => {
    it('should show first, ellipsis, current with neighbors, ellipsis, and last', () => {
      expect(generatePagination(5, 10)).toEqual([
        1,
        '...',
        4,
        5,
        6,
        '...',
        10,
      ]);
      expect(generatePagination(6, 15)).toEqual([
        1,
        '...',
        5,
        6,
        7,
        '...',
        15,
      ]);
    });
  });

  describe('edge cases', () => {
    it('should handle single page', () => {
      expect(generatePagination(1, 1)).toEqual([1]);
    });

    it('should handle two pages', () => {
      expect(generatePagination(1, 2)).toEqual([1, 2]);
    });
  });
});
