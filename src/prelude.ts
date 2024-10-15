import { RlEnum, RlEnumInstance } from "./enum";

// Result
export function Result<T, E = Error>() {
  return RlEnum<{
    Ok: T,
    Err: E
  }>().impl((v) => ({
    unwrap: () => {
      if (v.isOk()) {
        return v.Ok();
      } else {
        throw v.Err();
      }
    },
    unwrapOr: (nv: T) => {
      if (v.isOk()) {
        return v.Ok();
      } else {
        return nv;
      }
    },
    unwrapOrElse: (nv: () => T) => {
      if (v.isOk()) {
        return v.Ok();
      } else {
        return nv();
      }
    }
  }));
}

export function Ok<T, E = Error>(v?: T) {
  return Result<T, E>().Ok(v!);
}

export function Err<E>(e: E) {
  return Result<null, E>().Err(e);
}

// Option
export function Option<T>() {
  return RlEnum<{
    Some: T,
    None: null
  }>().impl((v) => ({
    okOr: <E>(err: E) => {
      if (v.isSome()) {
        return Result<T, E>().Ok(v.Some()!);
      } else {
        return Result<T, E>().Err(err);
      }
    },
    unwrap: () => {
      if (v.isSome()) {
        return v.Some();
      } else {
        throw v.None();
      }
    },
    unwrapOr: (nv: T) => {
      if (v.isSome()) {
        return v.Some();
      } else {
        return nv;
      }
    },
    unwrapOrElse: (nv: () => T) => {
      if (v.isSome()) {
        return v.Some();
      } else {
        return nv();
      }
    },
  }));
}


export function Some<T>(v: T) {
  return Option<T>().Some(v);
}

export function None() {
  return Option<null>().None();
}

// Promise
declare global {
  interface Promise<T> {
    result(): Promise<RlEnumInstance<ReturnType<typeof Result<T>>>>
  }
}

Promise.prototype.result = function () {
  return this.then((v) => Result().Ok(v), (e) => Result().Err(e));
}
