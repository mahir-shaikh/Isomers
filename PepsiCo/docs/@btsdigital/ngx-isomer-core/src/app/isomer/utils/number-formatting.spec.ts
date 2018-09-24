// import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { NumberFormatting } from './number-formatting';

// let numberFormatting: NumberFormatting;

describe('NumberFormatting', () => {
  beforeEach(() => {
    // numberFormatting = new NumberFormatting();
  });

  it('should return formatted values', () => {
    expect(NumberFormatting.format(0, 'Date')).toBe('12/31/1899');
    expect(NumberFormatting.format(-245.643, 'AbbreviatedDollars')).toBe('($245.64)');
    // add 7 days to 01-Jan
    expect(NumberFormatting.format(7, 'ExpectedLaunchDays')).toBe('08-Jan');
    expect(NumberFormatting.format(0.6733, 'Percent')).toBe('67.3%');
    expect(NumberFormatting.format(4157330334, 'Millions')).toBe('4,157.3');
    expect(NumberFormatting.format(4157330334, 'MillionsNoDecimal')).toBe('4,157');
    expect(NumberFormatting.format('Hello 123!', 'string')).toBe('Hello 123!');
    // expect(NumberFormatting.format(0.6733, 'Percent')).toBe('67.3%');
  });

  it('should return un-formatted values', () => {
    expect(NumberFormatting.unformat('24.33%')).toBe(0.2433);
    expect(NumberFormatting.unformat('($1,452.33)')).toBe(-1452.33);
  });

  it('should return the same value if format string is not passed', () => {
    // fix bug where format function would error out if format string not passed
    expect(NumberFormatting.format('256', undefined)).toBe('256');
  });
});
