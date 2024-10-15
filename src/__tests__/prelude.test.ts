import { describe, expect, test } from "vitest";
import { Option, Result } from "../prelude";

describe('prelude', () => {
  test('Result', () => {
    const result = Result<null>().Ok();
    expect(result.isOk()).toBe(true);
    expect(result.Ok()).toBe(null);
    expect(result.isErr()).toBe(false);

    const result2 = Result().Err(new Error());
    expect(result2.isErr()).toBe(true);
    expect(result2.Err()).toBeInstanceOf(Error);

    const result3 = Result<number>().Ok(1);
    expect(result3.isOk()).toBe(true);
    expect(result3.Ok()).toBe(1);

  });

  test('Result unwrap', () => {
    const result = Result<null>().Ok();
    expect(result.unwrap()).toBe(null);

    const result2 = Result().Err(new Error());
    expect(result2.unwrap).toThrowError();
  });

  test('Result unwrapOr', () => {
    const result = Result<number>().Ok(1);
    expect(result.unwrapOr(2)).toBe(1);  

    const result2 = Result().Err(new Error());
    expect(result2.unwrapOr(2)).toBe(2);
  });

  test('Result unwrapOrElse', () => {
    const result = Result<number>().Ok(1);
    expect(result.unwrapOrElse(() => 2)).toBe(1);  

    const result2 = Result().Err(new Error());
    expect(result2.unwrapOrElse(() => 2)).toBe(2);
  });

  test('Option', () => {
    const option = Option<number>();

    // @ts-expect-error
    option.Some();
    // @ts-expect-error
    option.Some('1');

    const some = option.Some(1);

    expect(some.isSome()).toBe(true);
    expect(some.isSome(1)).toBe(true);
    expect(some.Some()).toBe(1);
    expect(some.isNone()).toBe(false);
  });

  test('Option unwrap', () => {
    const option = Option<number>();

    expect(option.Some(1).unwrap()).toBe(1);
    expect(option.None().unwrap).toThrowError();
  });

  test('Option unwrapOr', () => {
    const option = Option<number>();

    expect(option.Some(1).unwrapOr(2)).toBe(1);
    expect(option.None().unwrapOr(2)).toBe(2);
  });

  test('Option unwrapOrElse', () => {
    const option = Option<number>();

    expect(option.Some(1).unwrapOrElse(() => 2)).toBe(1);
    expect(option.None().unwrapOrElse(() => 2)).toBe(2);  
  });

  test('Option okOr', () => {
    const option = Option<number>();

    expect(option.Some(1).okOr(new Error()).Ok()).toBe(1);
    expect(option.None().okOr(new Error()).Err()).toBeInstanceOf(Error);
  });

  test('promise', async () => {
    const p = await Promise.resolve(1).result();
    expect(p.isOk()).toBe(true);
    expect(p.Ok()).toBe(1);

    const p2 = await Promise.reject(new Error()).result();
    expect(p2.isErr()).toBe(true);
    expect(p2.Err()).toBeInstanceOf(Error);
  })
  
});
