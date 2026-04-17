/**
 * Type-level test helpers. No runtime — these files exist only to be
 * type-checked by `tsc`. Failures surface as red squigglies / `tsc` errors.
 */

/**
 * Passes when `T` is `true`. Use as: `type _ = Expect<Equal<A, B>>`.
 */
export type Expect<T extends true> = T;

/**
 * Strict structural equality of two types — distinguishes `any`, `unknown`,
 * `never`, and exact shape. The classic bivariant-function trick.
 */
export type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;

export type NotEqual<X, Y> = Equal<X, Y> extends true ? false : true;

/**
 * Passes when `Sub` is assignable to `Super`.
 */
export type Extends<Sub, Super> = Sub extends Super ? true : false;

/**
 * Passes when `T` has a property at key `K`.
 */
export type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false;
