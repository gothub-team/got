/* eslint-disable prefer-template */
import { assocMap3 } from '@gothub/aws-util';
import { type UrlObject, type DataCache } from '../types/dataCache';
import { pathMap2, pathMap3 } from '@gothub/aws-util/src/pathMap';

export const createDataCache: () => DataCache = () => {
    /* #region Nodes */
    const cacheNodes = new Map<string, string>();

    const getNode = (id: string) => {
        return cacheNodes.get(id);
    };

    const setNode = (id: string, value: string) => {
        cacheNodes.set(id, value);
    };

    const removeNode = (id: string) => {
        cacheNodes.delete(id);
    };
    /* #endregion */

    /* #region Node Promises */
    const cacheNodesPromise = new Map<string, Promise<string>>();

    const getNodePromise = (id: string) => {
        return cacheNodesPromise.get(id);
    };

    const setNodePromise = (id: string, value: Promise<string>) => {
        cacheNodesPromise.set(id, value);
    };

    const removeNodePromise = (id: string) => {
        cacheNodesPromise.delete(id);
    };
    /* #endregion */

    /* #region Metadata */
    const cacheMetadata = new Map<string, Map<string, Map<string, string>>>();

    const getMetadata = (from: string, edgeTypes: string, to: string) => {
        return pathMap3<string>(from, edgeTypes, to, cacheMetadata);
    };

    const setMetadata = (from: string, edgeTypes: string, to: string, metadata: string) => {
        assocMap3(from, edgeTypes, to, metadata, cacheMetadata);
    };

    const removeMetadata = (from: string, edgeTypes: string, to: string) => {
        const toMetadata = pathMap2<Map<string, string>>(from, edgeTypes, cacheMetadata);
        if (toMetadata == null) return;

        toMetadata.delete(to);
    };
    /* #endregion */

    /* #region Metadata Promises */
    const cacheMetadataPromise = new Map<string, Map<string, Map<string, Promise<string>>>>();

    const getMetadataPromise = (from: string, edgeTypes: string, to: string) => {
        return pathMap3<Promise<string>>(from, edgeTypes, to, cacheMetadataPromise);
    };

    const setMetadataPromise = (from: string, edgeTypes: string, to: string, metadata: Promise<string>) => {
        assocMap3(from, edgeTypes, to, metadata, cacheMetadataPromise);
    };

    const removeMetadataPromise = (from: string, edgeTypes: string, to: string) => {
        const toMetadata = pathMap2<Map<string, Promise<string>>>(from, edgeTypes, cacheMetadataPromise);
        if (toMetadata == null) return;

        toMetadata.delete(to);
    };
    /* #endregion */

    const cacheUrls = new Map<string, UrlObject>();

    const getUrl = (fileKey: string, etag: string) => {
        return cacheUrls.get(fileKey + '/' + etag);
    };

    const setUrl = (fileKey: string, etag: string, value: UrlObject) => {
        cacheUrls.set(fileKey + '/' + etag, value);
    };

    const removeUrl = (fileKey: string, etag: string) => {
        cacheUrls.delete(fileKey + '/' + etag);
    };

    return {
        nodes: {
            getNode,
            setNode,
            removeNode,
            getNodePromise,
            setNodePromise,
            removeNodePromise,
        },
        metadata: {
            getMetadata,
            setMetadata,
            removeMetadata,
            getMetadataPromise,
            removeMetadataPromise,
            setMetadataPromise,
        },
        urls: {
            getUrl,
            setUrl,
            removeUrl,
        },
    };
};
