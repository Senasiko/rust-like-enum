
type RlEnumHandler<V, T, P> = V extends null ? T : P;

type EnumInstanceOrigin<T> = {
  [x in keyof T]: () => null | T[x]
}

type Key<T> = Extract<T, string>;

type MatchPattern<T> = {
  [x in keyof T]: RlEnumHandler<T[x], () => void, (value: T[x]) => void>
}

type MatchOptionalPattern<T> = {
  [x in keyof T]?: RlEnumHandler<T[x], () => void, (value: T[x]) => void>
} & {
  _: () => void
}

export type RlEnumInstanceInner<T, Ex> = EnumInstanceOrigin<T> & Ex & {
  [x in keyof T as `is${Key<x>}`]: RlEnumHandler<T[x], () => boolean, (value?: T[x]) => boolean>
} & {
  [x in keyof T as `isNot${Key<x>}`]: RlEnumHandler<T[x], () => boolean, (value?: T[x]) => boolean>
} & {
  match: ((pattern: MatchPattern<T> | MatchOptionalPattern<T>) => void),
}

export type RlEnumConstructor<T, Ex> = {
  [x in keyof T]: RlEnumHandler<T[x], () => RlEnumInstanceInner<T, Ex>, (v: T[x]) => RlEnumInstanceInner<T, Ex>>;
} & {
  impl: <P>(cb: (value: RlEnumInstanceInner<T, Ex>) => P) => RlEnumConstructor<T, Ex & P>
}

export type RlEnumInstance<T> = T extends RlEnumConstructor<infer U, infer E> ? RlEnumInstanceInner<U, E> : never;

export type RlEnumValue<T> = T extends RlEnumConstructor<infer U, any> ? U[keyof U] : never;

export type RlEnumKeys<T> = T extends RlEnumConstructor<infer U, any> ? keyof U : never;

export type RlEnumImpl<T, Ex> = (v: RlEnumInstanceInner<T, Ex>) => RlEnumInstanceInner<T, Ex>

function resolveKeyword(str: string, key: string) {
  if (str.startsWith(key)) {
    return str.slice(key.length);
  }
}

function createEnumInstance<T, P extends keyof T, Ex>(prop: P, value: T[P], implFn?: RlEnumImpl<T, Ex>, ): RlEnumInstanceInner<T, Ex> {
  const keywords = ['then'];

  let impl: RlEnumInstanceInner<T, Ex> | undefined;

  const proxy = new Proxy({}, {
    get(target, getProp) {
      if (impl && Reflect.has(impl, getProp)) {
        return Reflect.get(impl, getProp);
      }

      let targetProp = resolveKeyword(getProp as string, 'isNot')
      if (targetProp) {
        return (targetValue?: T[P]) => prop !== targetProp || (targetValue === undefined ? false : value !== targetValue);
      }

      targetProp = resolveKeyword(getProp as string, 'is')
      if (targetProp) {
        return (targetValue?: T[P]) => prop === targetProp && (targetValue === undefined || value === targetValue)
      }

      if (getProp === 'match') {
        return (pattern: any) => {
          if (Reflect.has(pattern, prop)) {
            pattern[prop](value)
          } else if (Reflect.has(pattern, '_')) {
            pattern['_']()
          } else {
            console.error('not implemented match', prop);
          }
        }
      }

      if (!keywords.includes(getProp as string)) {
        return () => prop === getProp ? (value ?? null) : null;
      }

      console.error('not implemented', prop);
      return Reflect.get(target, prop)
    },
  }) as RlEnumInstanceInner<T, Ex>;

  impl = implFn?.(proxy);

  return proxy;
}

export function RlEnum<T>(): RlEnumConstructor<T, {}> {
  let implFn: (value: T[keyof T]) => any;

  const proxy = new Proxy({}, {
    get(_, prop: string) {

      if (prop === 'impl') {
        return (cb: typeof implFn) => {
          implFn = cb;
          return proxy;
        }
      }

      return (value: T[keyof T]) => {
        return createEnumInstance(prop as keyof T, value, implFn);
      }
    }
  }) as RlEnumConstructor<T, unknown>;
  return proxy;
}
