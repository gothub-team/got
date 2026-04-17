/* eslint-disable @typescript-eslint/no-unused-vars */
import { includeNode, includeMetadata } from '../types/view.js';
import type { View } from '../types/view';
import type { ViewResult } from '../types/ViewResult';
import type { Node, Metadata, NodeRightsView } from '../types/graphObjects';
import type { NodeFilesView } from '../types/graph';
import type { NodeFileView } from '../types/graphObjects';
import type { Equal, Expect, HasKey, NotEqual } from './_utils';

type Contract = { contractNumber: string; startDate: string };
type Position = { amount: number; label: string };
type Ordering = { order: number };

// ── nodeId is always present, node body only with include ──────────────────
{
    const view = {
        root: {} as const,
    } as const;
    type R = ViewResult<typeof view>;

    type _HasId = Expect<Equal<R['root']['nodeId'], string>>;
    type _NoNode = Expect<Equal<HasKey<R['root'], 'node'>, false>>;
    type _NoMeta = Expect<Equal<HasKey<R['root'], 'metadata'>, false>>;
    type _NoRights = Expect<Equal<HasKey<R['root'], 'rights'>, false>>;
    type _NoFiles = Expect<Equal<HasKey<R['root'], 'files'>, false>>;
}

// ── include.node → plain Node when unbranded ───────────────────────────────
{
    const view = {
        root: { include: { node: true } },
    } as const;
    type R = ViewResult<typeof view>;

    type _IsNode = Expect<Equal<R['root']['node'], Node>>;
}

// ── includeNode<T>() brands the node body ──────────────────────────────────
{
    const view = {
        contract: { include: { node: includeNode<Contract>() } },
    } as const;
    type R = ViewResult<typeof view>;

    type _IsBranded = Expect<Equal<R['contract']['node'], Node<Contract>>>;
    type _HasContractField = Expect<Equal<R['contract']['node']['contractNumber'], string>>;
    type _HasIdField = Expect<Equal<R['contract']['node']['id'], string>>;
    // Different brand ≠ same brand
    type _Distinct = Expect<NotEqual<R['contract']['node'], Node<Position>>>;
}

// ── includeMetadata<T>() brands edge metadata ──────────────────────────────
{
    const view = {
        contract: {
            edges: {
                'contract/positions': {
                    include: { metadata: includeMetadata<Ordering>() },
                },
            },
        },
    } as const;
    type R = ViewResult<typeof view>;
    type PosBag = R['contract']['contract/positions'][string];

    type _IsMetadata = Expect<Equal<PosBag['metadata'], Metadata<Ordering>>>;
    // Metadata<T> = T | boolean
    type _MetadataAllowsShape = Expect<Equal<Extract<PosBag['metadata'], Ordering>, Ordering>>;
}

// ── Nested edges — brand each level independently ──────────────────────────
{
    const view = {
        contract: {
            include: { node: includeNode<Contract>() },
            edges: {
                'contract/positions': {
                    include: {
                        node: includeNode<Position>(),
                        metadata: includeMetadata<Ordering>(),
                    },
                },
            },
        },
    } as const;
    type R = ViewResult<typeof view>;

    type _RootBrand = Expect<Equal<R['contract']['node'], Node<Contract>>>;

    type PosBag = R['contract']['contract/positions'][string];
    type _PosBrand = Expect<Equal<PosBag['node'], Node<Position>>>;
    type _PosMeta = Expect<Equal<PosBag['metadata'], Metadata<Ordering>>>;
}

// ── `as` alias rewrites the key in the result ──────────────────────────────
{
    const view = {
        contract: {
            as: 'activeContract',
            edges: {
                'contract/positions': { as: 'positions' },
            },
        },
    } as const;
    type R = ViewResult<typeof view>;

    type _AliasedRoot = Expect<Equal<HasKey<R, 'activeContract'>, true>>;
    type _OriginalGone = Expect<Equal<HasKey<R, 'contract'>, false>>;

    type _EdgeAlias = Expect<Equal<HasKey<R['activeContract'], 'positions'>, true>>;
    type _EdgeOriginalGone = Expect<Equal<HasKey<R['activeContract'], 'contract/positions'>, false>>;
}

// ── include.rights and include.files produce fixed types ───────────────────
{
    const view = {
        root: { include: { rights: true, files: true } },
    } as const;
    type R = ViewResult<typeof view>;

    type _Rights = Expect<Equal<R['root']['rights'], NodeRightsView>>;
    type _Files = Expect<Equal<R['root']['files'], NodeFilesView<NodeFileView>>>;
}

// ── metadata flag is only honored inside an EdgeView ───────────────────────
// (NodeInclude explicitly bans `metadata` via `metadata?: never`)
{
    // @ts-expect-error - `metadata` is `never` on NodeInclude
    const bad: View = { root: { include: { metadata: true } } };
    void bad;
}

// ── Legacy plain boolean WITHOUT `as const` widens and drops node field ────
// (documents the existing sharp edge — motivates migrating to includeNode)
{
    const view = {
        root: { include: { node: true } },
    }; // NOTE: no `as const`
    type R = ViewResult<typeof view>;

    type _NodeDropped = Expect<Equal<HasKey<R['root'], 'node'>, false>>;
}
