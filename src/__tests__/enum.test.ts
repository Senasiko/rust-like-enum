import { describe, expect, test } from 'vitest'
import { RlEnum } from '..';

describe('RlEnum', () => {
  test('constructor', () => {
    const TestEnum = RlEnum<{
      A: number,
      B: string,
      C: null,
    }>()

    // @ts-expect-error
    TestEnum.A();
    // @ts-expect-error
    TestEnum.A('a');
    // @ts-expect-error
    TestEnum.A(1, 2);

    TestEnum.A(1);
    TestEnum.B('a');
    TestEnum.C();

    // @ts-expect-error
    TestEnum.D();
  });

  test('enum if', () => {
    const TestEnum = RlEnum<{
      A: number,
      B: null,
    }>();

    let a = TestEnum.A(1);
    expect(a.isA()).toBe(true);
    expect(a.isA(1)).toBe(true);
    expect(a.isA(2)).toBe(false);
    expect(a.isB()).toBe(false);

    // @ts-expect-error
    a.isA('a');

    expect(a.isNotB()).toBe(true);
    expect(a.isNotA(2)).toBe(true);

    let b = TestEnum.B();
    
    // @ts-expect-error
    b.isB(null);
    // @ts-expect-error
    b.isNotB(null);

    expect(b.isB()).toBe(true);
    expect(b.isNotA()).toBe(true);
  });

  test('enum match', () => {
    const TestEnum = RlEnum<{
      A: number,
      B: string,
    }>();

    const a = TestEnum.A(1);

    // @ts-expect-error
    a.match({});

    // @ts-expect-error
    a.match({
      A: () => {},
    });

    let result1 = 0;
    a.match({
      A: (value) => {
        result1 = value;
      },
      B: () => {
      },
    });
    expect(result1).toBe(1);

    let result2 = 0;
    a.match({
      A: (value) => {
        result2 = value;
      },
      _: () => {
      },
    });
    expect(result2).toBe(1);

    let result3 = 0;
    a.match({
      B: () => {
      },
      _: () => {
        result3 = 1;
      },
    });
    expect(result3).toBe(1);
  });

  test('enum value', () => {
    const TestEnum = RlEnum<{
      A: number,
      B: null,
    }>();

    const a = TestEnum.A(1);
    expect(a.A()).toBe(1);
    expect(a.B()).toBe(null);

    const b = TestEnum.B();
    expect(b.A()).toBe(null);
    expect(b.B()).toBe(null);
  })
})
