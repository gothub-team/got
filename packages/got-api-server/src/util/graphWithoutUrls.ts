import type { Graph } from '@gothub/got-core';

export const graphWithoutUrls = (graph: Graph) => {
    const files = graph.files || {};
    const filesObjs = Object.values(files);
    filesObjs.forEach((filesObj) => {
        const fileObjs = Object.values(filesObj);
        fileObjs.forEach((fileObj) => {
            if ('url' in fileObj) {
                fileObj.url = '';
            }
        });
    });
};
