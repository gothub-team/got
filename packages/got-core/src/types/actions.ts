import { Graph } from './graph';
import { Metadata, Node, RightTypes } from './graphObjects';

export type ACTION_TYPE =
    | 'GOT/MERGE'
    | 'GOT/MERGE_OVERWRITE'
    | 'GOT/MERGE_ERROR'
    | 'GOT/CLEAR'
    | 'GOT/CLEAR_ALL'
    | 'GOT/SET_NODE'
    | 'GOT/ADD'
    | 'GOT/REMOVE'
    | 'GOT/ASSOC'
    | 'GOT/DISSOC'
    | 'GOT/SET_RIGHTS'
    | 'GOT/SET_ROLE_RIGHTS'
    | 'GOT/INHERIT_RIGHTS'
    | 'GOT/SET_FILE'
    | 'GOT/REMOVE_FILE'
    | 'GOT/UPLOAD_PROGRESS'
    | 'GOT/UPLOAD_COMPLETE'
    | 'GOT/UPLOAD_ERROR';

export type GOT_ACTION =
    | GOT_ACTION_MERGE
    | GOT_ACTION_MERGE_OVERWRITE
    | GOT_ACTION_MERGE_ERROR
    | GOT_ACTION_CLEAR
    | GOT_ACTION_CLEAR_ALL
    | GOT_ACTION_SET_NODE
    | GOT_ACTION_ADD
    | GOT_ACTION_REMOVE
    | GOT_ACTION_ASSOC
    | GOT_ACTION_DISSOC
    | GOT_ACTION_SET_RIGHTS
    | GOT_ACTION_SET_ROLE_RIGHTS
    | GOT_ACTION_INHERIT_RIGHTS
    | GOT_ACTION_SET_FILE
    | GOT_ACTION_REMOVE_FILE;

type GOT_ACTION_MERGE = {
    type: 'GOT/MERGE';
    payload: {
        fromGraphName: string;
        toGraphName: string;
    };
};

type GOT_ACTION_MERGE_OVERWRITE = {
    type: 'GOT/MERGE_OVERWRITE';
    payload: {
        fromGraph: Graph;
        toGraphName: string;
    };
};

type GOT_ACTION_MERGE_ERROR = {
    type: 'GOT/MERGE_ERROR';
    payload: {
        fromGraph: Graph;
        toGraphName: string;
    };
};

type GOT_ACTION_CLEAR = {
    type: 'GOT/CLEAR';
    payload: {
        graphName: string;
    };
};

type GOT_ACTION_CLEAR_ALL = {
    type: 'GOT/CLEAR_ALL';
};

type GOT_ACTION_SET_NODE = {
    type: 'GOT/SET_NODE';
    payload: {
        graphName: string;
        nodeId: string;
        node: Node | false;
    };
};

type GOT_ACTION_ADD = {
    type: 'GOT/ADD';
    payload: {
        fromType: string;
        toType: string;
        fromId: string;
        toNode: Node;
        metadata?: Metadata;
    };
};

type GOT_ACTION_REMOVE = {
    type: 'GOT/REMOVE';
    payload: {
        fromType: string;
        toType: string;
        fromId: string;
        toId: string;
    };
};

type GOT_ACTION_ASSOC = {
    type: 'GOT/ASSOC';
    payload: {
        fromType: string;
        toType: string;
        fromId: string;
        toId: string;
        metadata?: Metadata;
    };
};

type GOT_ACTION_DISSOC = {
    type: 'GOT/DISSOC';
    payload: {
        fromType: string;
        toType: string;
        fromId: string;
        toId: string;
    };
};

type GOT_ACTION_SET_RIGHTS = {
    type: 'GOT/SET_RIGHTS';
    payload: {
        graphName: string;
        nodeId: string;
        email: string;
        rights: RightTypes;
    };
};

type GOT_ACTION_SET_ROLE_RIGHTS = {
    type: 'GOT/SET_ROLE_RIGHTS';
    payload: {
        graphName: string;
        nodeId: string;
        role: string;
        rights: RightTypes;
    };
};

type GOT_ACTION_INHERIT_RIGHTS = {
    type: 'GOT/INHERIT_RIGHTS';
    payload: {
        graphName: string;
        nodeId: string;
        fromId: string;
    };
};

type GOT_ACTION_SET_FILE = {
    type: 'GOT/SET_FILE';
    payload: {
        graphName: string;
        nodeId: string;
        prop: string;
        filename: string;
        file: Blob;
    };
};

type GOT_ACTION_REMOVE_FILE = {
    type: 'GOT/REMOVE_FILE';
    payload: {
        graphName: string;
        nodeId: string;
        prop: string;
    };
};
