// Unit tests
describe('Spectra', function() {
  var color;

  beforeEach(function() {
    color = Spectra({r: 255, g: 25, b: 75, a: 0.6});

    this.addMatchers({
      toEqualColor: function(expected) {
        var actual = this.actual;
        var notText = this.isNot ? ' not' : '';

        this.message = function() {
          return 'Expected ' + actual.rgbaString() + notText + ' to be equal to color ' + expected.rgbaString();
        };

        return actual.equals(expected);
      }
    });
  });

  describe('Wrapper tests', function() {
    it('RGB wrapper', function() {
      expect(color.red()).toBe(255);
      expect(color.green()).toBe(25);
      expect(color.blue()).toBe(75);
      expect(color.hex()).toBe('#ff194b');
      expect(color.alpha()).toBe(0.6);
      color = Spectra({r: 255, g: 25, b: 75});
      expect(color.alpha()).toBe(1);
      color = Spectra({r: 0, g: 0, b: 0});
      expect(color.hue()).toBe(0);
    });

    it('HSV wrapper', function() {
      color = Spectra({h: 347, s: 0.9020, v: 1.000, a: 0.6});
      expect(color).toEqualColor(Spectra({r: 255, g: 25, b: 75, a: 0.6}));
    });

    it('HSL wrapper', function() {
      color = Spectra({h: 347, s: 1.000, l: 0.549, a: 0.6});
      expect(color).toEqualColor(Spectra({r: 255, g: 25, b: 75, a: 0.6}));
    });

    it('shorthand CSS wrapper', function() {
      color = Spectra('#4Af');
      expect(color.red()).toBe(68);
      expect(color.green()).toBe(170);
      expect(color.blue()).toBe(255);
      expect(color.hue()).toBe(207);
      expect(color.saturationv()).toBeCloseTo(0.73, 1);
      expect(color.value()).toBeCloseTo(1.000, 1);
      expect(color.hex()).toBe('#44aaff');
      expect(color.rgbaString()).toBe('rgba(68,170,255,1)');
      expect(color.hslString()).toBe('hsl(207,1,0.63)');
      expect(color.hslaString()).toBe('hsla(207,1,0.63,1)');
      expect(color.rgbNumber()).toBe(0x44aaff);
    });

    it('longhand CSS wrapper', function() {
      color = Spectra('#FF194b');
      expect(color).toEqualColor(Spectra({r: 255, g: 25, b: 75}));
    });

    it('rgb CSS wrapper', function() {
      color = Spectra('rgb(255,25, 75)');
      expect(color).toEqualColor(Spectra({r: 255, g: 25, b: 75}));
    });

    it('rgba CSS wrapper', function() {
      color = Spectra('rgba(255,25, 75, 0.6)');
      expect(color).toEqualColor(Spectra({r: 255, g: 25, b: 75, a: 0.6}));
      color = Spectra('rgba(255,25, 75, .6)');
      expect(color).toEqualColor(Spectra({r: 255, g: 25, b: 75, a: 0.6}));
    });

    it('predefined colors wrapper', function () {
      color = Spectra('white');
      expect(color).toEqualColor(Spectra({r: 255, g: 255, b: 255}));
      color = Spectra('teal');
      expect(color).toEqualColor(Spectra("#008080"));
    });
  });

  describe('Invalid inputs', function() {
    it('Invalid CSS', function() {
      expect(function() {Spectra('not a real color');}).toThrow();
      expect(function() {Spectra('#deadbeef');}).toThrow();
      expect(function() {Spectra(null);}).toThrow();
      expect(function() {Spectra(undefined);}).toThrow();
      expect(function() {Spectra(true);}).toThrow();
    });
  });

  describe('Get and set', function() {
    it('RGB get and set', function() {
      color = Spectra({r: 123, g: 192, b: 70, a: 0.6});
      color.red(255);
      color.green(25);
      color.blue(75);
      expect(color).toEqualColor(Spectra({r: 255, g: 25, b: 75, a: 0.6}));
    });

    it('HSV get and set', function() {
      color = Spectra({r: 123, g: 192, b: 72, a: 0.6});
      color.hue(347);
      color.saturationv(0.9020);
      color.value(1.000);
      expect(color).toEqualColor(Spectra({r: 255, g: 25, b: 75, a: 0.6}));
    });
  });

  describe('Color operations', function() {
    it('Color operations', function() {
      expect(color.complement().hex()).toBe('#19ffcd');
      expect(color.negate().hex()).toBe('#00e6b4');
      expect(color.lighten(10).hex()).toBe('#ff4c73');
      expect(color.darken(10).hex()).toBe('#e50032');
      expect(color.saturate(10).hex()).toBe('#ff194b');
      expect(color.desaturate(10).hex()).toBe('#f42552');
      expect(color.fadeIn(7).alpha()).toBeCloseTo(0.67, 1);
      expect(color.fadeOut(5).alpha()).toBeCloseTo(0.55, 1);
      expect(color.luma()).toBeCloseTo(77.5, 1);
      expect(color.grayscale().hex()).toBe('#8c8c8c');
      expect(color.isDark()).toBe(true);
      expect(color.isLight()).toBe(false);
      expect(Spectra('#000').isDark()).toBe(true);
    });

    it('Mix', function() {
      var color1 = Spectra('#0f7');
      var color2 = Spectra('#f87');
      var mixed1 = color1.mix(color2, 0);
      expect(mixed1.hex()).toBe('#00ff77');
      var mixed2 = color1.mix(color2, 20);
      expect(mixed2.hex()).toBe('#33e777');
    });

    it('Gradient', function() {
      var color1 = Spectra('#000000');
      var color2 = Spectra('#505050');
      var grad1 = color1.gradient(color2, 6);
      expect(grad1.length).toBe(6);
      expect(grad1[0].hex()).toEqual('#000000');
      expect(grad1[1].hex()).toEqual('#101010');
      expect(grad1[2].hex()).toEqual('#202020');
      expect(grad1[3].hex()).toEqual('#303030');
      expect(grad1[4].hex()).toEqual('#404040');
      expect(grad1[5].hex()).toEqual('#505050');
    });

    it('Harmony', function() {
      var harmonies;

      // Default (should produce the same results as .complement())
      harmonies = color.harmony(null, null);
      expect(harmonies.length).toBe(2);
      expect(harmonies[0].hex()).toEqual('#ff194b');
      expect(harmonies[1].hex()).toEqual('#19ffcd');

      // Analogous at index 1
      harmonies = color.harmony('analogous', 1);
      expect(harmonies.length).toBe(3);
      expect(harmonies[0].hex()).toEqual('#ff19be');
      expect(harmonies[1].hex()).toEqual('#ff194b');
      expect(harmonies[2].hex()).toEqual('#ff5a19');

      // Triad at index 0
      harmonies = color.harmony('triad', null);
      expect(harmonies.length).toBe(3);
      expect(harmonies[0].hex()).toEqual('#ff194b');
      expect(harmonies[1].hex()).toEqual('#4bff19');
      expect(harmonies[2].hex()).toEqual('#194bff');

      // Split-complementary at index 2 (abs(-5) mod 3 test)
      harmonies = color.harmony('triad', -5);
      expect(harmonies.length).toBe(3);
      expect(harmonies[0].hex()).toEqual('#4bff19');
      expect(harmonies[1].hex()).toEqual('#194bff');
      expect(harmonies[2].hex()).toEqual('#ff194b');

      // Rectangle at index 0
      harmonies = color.harmony('rectangle');
      expect(harmonies.length).toBe(4);
      expect(harmonies[0].hex()).toEqual('#ff194b');
      expect(harmonies[1].hex()).toEqual('#ffcd19');
      expect(harmonies[2].hex()).toEqual('#19ffcd');
      expect(harmonies[3].hex()).toEqual('#194bff');

      // Square at index 0
      harmonies = color.harmony('square');
      expect(harmonies.length).toBe(4);
      expect(harmonies[0].hex()).toEqual('#ff194b');
      expect(harmonies[1].hex()).toEqual('#beff19');
      expect(harmonies[2].hex()).toEqual('#19ffcd');
      expect(harmonies[3].hex()).toEqual('#5a19ff');

      // Invalid inputs (should default to the same results as .complement())
      harmonies = color.harmony('foo', 'bar');
      expect(harmonies.length).toBe(2);
      expect(harmonies[0].hex()).toEqual('#ff194b');
      expect(harmonies[1].hex()).toEqual('#19ffcd');
    });

    it('Multiply', function() {
      var multiplied;
      var color1 = Spectra('#0f7');
      var color2 = Spectra('#f87');

      // General case
      multiplied = color1.multiply(color2);
      expect(multiplied.hex()).toEqual('#008838');

      // Multiplying with Spectra-compatible inputs
      multiplied = color1.multiply('#f87');
      expect(multiplied.hex()).toEqual('#008838');

      // Invalid inputs
      expect(function() {color1.multiply(null)}).toThrow();
    });

    it('Invert', function() {
      var inverted = color.invert();
      expect(inverted.hex()).toEqual('#00e6b4');
    });

    it('Screen', function() {
      var screened;
      var color1 = Spectra('#0f7');
      var color2 = Spectra('#f87');

      // General case
      screened = color1.screen(color2);
      expect(screened.hex()).toEqual('#ffffb6');

      // Multiplying with Spectra-compatible inputs
      screened = color1.screen('#f87');
      expect(screened.hex()).toEqual('#ffffb6');

      // Invalid inputs
      expect(function() {color1.screen(null)}).toThrow();
    });
  });

  describe('Utility functions', function() {
    it('noConflict', function() {
      var s = Spectra.noConflict();
      expect(Spectra).toBe(undefined);
      expect(s('#ff194b').red()).toBe(255);
    });
  });
});
