import type { ExistsCache } from '../types/existCache';
import type { DataCache } from '../types/dataCache';
import type { Loader } from '../types/loader';
import type { View } from '@gothub/got-core';
import { pull } from '../handler/pull';
import type { Signer } from '../types/signer';
import { emptyAssembler } from '../util/emptyAssembler';

export const initPull = async (existsCache: ExistsCache, dataCache: DataCache, signer: Signer, loader: Loader) => {
    try {
        const nodeStr = await loader.getNode('init-views').catch(() => {});
        if (!nodeStr) {
            console.log('No views to pull');
            return;
        }

        const node = JSON.parse(nodeStr) as { id: string; views: View[] };
        const views = node.views || [];

        for (let i = 0; i < views.length; i++) {
            console.log(`Pulling view ${i + 1}/${views.length}`);
            try {
                const view = views[i];
                await pull(view, '', true, {
                    existsCache,
                    dataCache,
                    signer,
                    loader,
                    graphAssembler: emptyAssembler(),
                });
            } catch (err) {
                console.log(`Failed to pull view #${i}`, err);
            }
        }
    } catch (error) {
        console.log('Error in initPull', error);
    }
};
