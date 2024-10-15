# Rust-like-enum

The Typescript implemention for Rust enums
- Easy use
- Full type support
- Scalable

## Install
```
npm install rl-enum
```

## Usage
### Enum Define
```rust
// Rust
enum ExampleEnum {
  Foo,
  Bar(i32)
}
```
```ts
// Typescript
const ExampleEnum = RlEnum<{
  Foo: null,
  Bar: number,
}>()
```

### Enum use
```rust
// Rust
let foo = ExampleEnum::Foo;
let bar = ExampleEnum::Bar(1);
```

```ts
// Typescript
const foo = ExampleEnum.Foo();
const bar = ExampleEnum.Bar(1);
```

### if let 
```rust
// Rust
if let ExampleEnum::Bar(v) = bar {
    println!("{}", v);
}
```
```ts
// Typescript
// get value. if is bar, return number，otherwise return null.
const v: number | null = bar.Bar();

// or use isBar() to check whether is bar.
if (bar.isBar()) {
  console.log(bar.Bar()!);
}

// check enum type and value. If the value is not 1, also return false.
if (bar.isBar(1)) {
  console.log(bar.Bar()!);
}
```

### match
```Rust
// rust
let bar = ExampleEnum::Bar(1);
match bar { 
    ExampleEnum::Bar(v) => println!("{}", v),
    _ => {}
}
```
```ts
// Typescript
const bar = ExampleEnum.Bar(1);
bar.match({
  Bar: (v) => console.log(v),
  _: () => {},
})
```


### impl methods
```rust
// Rust
impl ExampleEnum {
    fn unwrap(&self) -> i32 {
        if let ExampleEnum::Bar(v) = self {
            *v
        } else {
            panic!()
        }
    }
}

let v = ExampleEnum::Bar(1).unwrap();
```
```ts
// Typescript
ExampleEnum.impl((v) => ({
  unwrap() {
    if (v.isBar()) {
      return v.Bar();
    }
    throw new Error();
  }
}));

const v = ExampleEnum.Bar(1).unwrap();
```

## Prelude Enums
Rust std enums (Result and Option) has been implemented.
### Result
methods:
- `unwrap`
- `unwrap_or`
- `unwrap_or_else`
```ts
const ok = Ok(1);
const v: number = ok.unwrap();

const err = Err(new Error());
const v: number = err.unwrapOr(1);
```
### Option
methods:
- `ok_or`
- `unwrap`
- `unwrap_or`
- `unwrap_or_else`
```ts
const result = Some(1).okOr(new Error());

const v: number = Some(1).unwrap();

const v: number = Some(1).unwrapOr(2);

const v: number = Some(1).unwrapOrElse(() => 2);
```
## Promise
An implementation of converting async promise into sync result.

**before**
```ts
try {
  const res = await new Promise(...);
  console.log(res);
} catch(e) {
  console.error(e);
}
```
The problem is that if any code after await encounters a panic, it will also end up in the catch block.

**after**
```ts
const result = await new Promise(...).result();
if (result.isOk()) {
  console.log(result.Ok())
} else {
  console.error(result.Err())
}
```
