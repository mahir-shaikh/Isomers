import { NumberFormattingPipe } from './number-formatting.pipe';

describe('NumberFormattingPipe', () => {
  it('create an instance', () => {
    const pipe = new NumberFormattingPipe();
    expect(pipe).toBeTruthy();

    expect(pipe.transform('1234.5645', '0,0.00')).toBe('1,234.56');

    expect(pipe.transform(null, '0.00')).toBe(null);

    expect(pipe.transform('test', '0,00')).toBe('0');

    expect(pipe.parse('')).toBe('');
    expect(pipe.parse('$1,234.04')).toBe(1234.04);
    expect(pipe.parse('24%')).toBe(0.24);
  });
});
