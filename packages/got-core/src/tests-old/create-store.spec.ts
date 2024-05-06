import { describe, test, expect, mock } from 'bun:test';
import { MISSING_PARAM_ERROR } from '../utils/errors.js';
import { createStore } from './shared.spec.js';

describe('store:createStore', () => {
    test('should call `onWarn` in case of undefined `api`, `dispatch` or `select`', async () => {
        /* #region Test Bed Creation */
        const onWarn = mock();
        createStore({
            onWarn,
        });
        /* #endregion */

        /* #region Execution and Validation */
        expect(onWarn).toBeCalledWith(
            expect.objectContaining({
                name: MISSING_PARAM_ERROR,
                missing: 'api',
            }),
        );
        expect(onWarn).toBeCalledWith(
            expect.objectContaining({
                name: MISSING_PARAM_ERROR,
                missing: 'dispatch',
            }),
        );
        expect(onWarn).toBeCalledWith(
            expect.objectContaining({
                name: MISSING_PARAM_ERROR,
                missing: 'select',
            }),
        );
        /* #endregion */
    });
    test('should call `onError` in case of undefined `api`', async () => {
        /* #region Test Bed Creation */
        const nodeId = 'node1';
        const view = {
            [nodeId]: {
                include: {
                    node: true,
                },
            },
        };

        const onError = mock();
        const onWarn = mock();
        const dispatch = mock();
        const select = mock();
        const { pull } = createStore({
            onError,
            onWarn,
            dispatch,
            select,
        });
        /* #endregion */

        /* #region Execution and Validation */
        await pull(view);

        expect(onError).toBeCalledWith(
            expect.objectContaining({
                name: MISSING_PARAM_ERROR,
                missing: 'api',
            }),
        );
        expect(dispatch).not.toBeCalled();
        expect(select).not.toBeCalled();
        /* #endregion */
    });
    test('should call `onError` in case of undefined `dispatch`', async () => {
        /* #region Test Bed Creation */
        const onError = mock();
        const onWarn = mock();
        const select = mock();

        const { merge } = createStore({
            api: {
                push: mock(),
                pull: mock(),
            },
            onError,
            onWarn,
            select,
        });
        /* #endregion */

        /* #region Execution and Validation */
        await merge('graph1', 'graph2');

        expect(onError).toBeCalledWith(
            expect.objectContaining({
                name: MISSING_PARAM_ERROR,
                missing: 'dispatch',
            }),
        );
        /* #endregion */
    });
    test('should call `onError` in case of undefined `select`', () => {
        /* #region Test Bed Creation */
        const onError = mock();
        const onWarn = mock();
        const dispatch = mock();

        const { getNode } = createStore({
            api: {
                push: mock(),
                pull: mock(),
            },
            dispatch,
            onError,
            onWarn,
        });
        /* #endregion */

        /* #region Execution and Validation */
        getNode('main')('node1');

        expect(onError).toBeCalledWith(
            expect.objectContaining({
                name: MISSING_PARAM_ERROR,
                missing: 'select',
            }),
        );
        expect(dispatch).not.toBeCalled();
        /* #endregion */
    });
});
