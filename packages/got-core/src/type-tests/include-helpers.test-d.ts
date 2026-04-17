/* eslint-disable @typescript-eslint/no-unused-vars */
import type { includeNode, includeMetadata, nodeTypeBrand } from '../types/view';
import type { Equal, Expect, Extends } from './_utils';

type Contract = { contractNumber: string; startDate: string };
type Position = { amount: number; label: string };
type Ordering = { order: number };

// ── includeNode ────────────────────────────────────────────────────────────
// Return type is `true` intersected with the phantom brand.
type IncludeNodeRet = ReturnType<typeof includeNode<Contract>>;

// Still assignable to plain `true` (and therefore to `boolean`).
type _Assignable = Expect<Extends<IncludeNodeRet, true>>;
type _AssignableBool = Expect<Extends<IncludeNodeRet, boolean>>;

// Carries the brand with `TNode`.
type _CarriesBrand = Expect<Equal<IncludeNodeRet[typeof nodeTypeBrand], Contract | undefined>>;

// Generic argument is constrained to `Record<string, unknown>`.
// @ts-expect-error - primitives don't extend Record<string, unknown>
type _Reject = ReturnType<typeof includeNode<string>>;

// ── includeMetadata ────────────────────────────────────────────────────────
type IncludeMetaRet = ReturnType<typeof includeMetadata<Ordering>>;

type _MetaAssignable = Expect<Extends<IncludeMetaRet, true>>;
type _MetaCarriesBrand = Expect<Equal<IncludeMetaRet[typeof nodeTypeBrand], Ordering | undefined>>;

// ── Different T's produce non-equal types ──────────────────────────────────
type _BrandsAreDistinct = Expect<
    Equal<Equal<ReturnType<typeof includeNode<Contract>>, ReturnType<typeof includeNode<Position>>>, false>
>;
