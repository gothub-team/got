import { type DataCache } from '../types/dataCache';
import { type RightType, type ExistsCache } from '../types/existCache';
import { s3mapListKeysPaged as _s3mapListKeysPaged } from '@gothub/aws-util';
import {
    BUCKET_EDGES,
    BUCKET_NODES,
    BUCKET_RIGHTS_ADMIN,
    BUCKET_RIGHTS_READ,
    BUCKET_RIGHTS_WRITE,
    PrincipalType,
} from '../config';

// EMPTY / true / {}
const emptyEtags = [
    '"d41d8cd98f00b204e9800998ecf8427e"',
    '"b326b5062b2f0e69046810717534cb09"',
    '"99914b932bd37a50b983c5e7c90ae93b"',
];

const s3mapListKeysPaged = _s3mapListKeysPaged as (
    bucket: string,
    prefix: string,
    fnMap: (key: string, etag: string) => void,
) => Promise<void>;

export const initCaches = async (existCache: ExistsCache, dataCache: DataCache) => {
    console.log('Init Nodes...');
    await s3mapListKeysPaged(BUCKET_NODES, '', (id: string) => {
        if (!id) return; // invalid node key (id)

        existCache.node.addNode(id);
    });

    console.log('Init Edges...');
    await s3mapListKeysPaged(BUCKET_EDGES, '', (edgeKey: string, etag: string) => {
        const [fromId, fromType, toType, toId] = edgeKey.split('/');

        if (!fromId || !fromType || !toType || !toId) {
            console.log('Invalid edge key', edgeKey);
            return; // invalid edge key
        }

        existCache.edge.addEdge(fromId, `${fromType}/${toType}`, toId);
        existCache.edgeReverse.addEdgeReverse(toId, `${fromType}/${toType}`, fromId);

        if (emptyEtags.includes(etag)) {
            dataCache.metadata.setMetadata(fromId, `${fromType}/${toType}`, toId, 'true');
        }
    });

    const initRight = async (bucket: string, rightType: RightType) => {
        await s3mapListKeysPaged(bucket, '', (rightsKey: string) => {
            const [id, principalType, principal] = rightsKey.split('/');

            if (!id || !principalType || !principal) return; // invalid rights key

            if (principalType === PrincipalType.USER) {
                existCache.userRights.addRight(id, principal, rightType);
            } else if (principalType === PrincipalType.ROLE) {
                existCache.roleRights.addRight(id, principal, rightType);
            }
        });
    };

    console.log('Init Read...');
    await initRight(BUCKET_RIGHTS_READ, 'read');
    console.log('Init Write...');
    await initRight(BUCKET_RIGHTS_WRITE, 'write');
    console.log('Init Admin...');
    await initRight(BUCKET_RIGHTS_ADMIN, 'admin');
};
