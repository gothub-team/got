import { describe, expect, test } from 'bun:test';
import { createTestStore } from './shared.spec';
import { gotReducer } from '../reducer/reducer';

describe('store:clear-all', () => {
    test('should call `dispatch` with correct parameters', () => {
        /* #region Test Bed Creation */
        const {
            store: { clearAll },
            dispatch,
            onError,
        } = createTestStore();
        /* #endregion */

        /* #region Execution and Validation */
        clearAll();

        expect(dispatch).toBeCalledWith({
            type: 'GOT/CLEAR_ALL',
        });
        expect(onError).not.toBeCalled();
        /* #endregion */
    });
    test('reducer should return empty object', () => {
        /* #region Test Bed Creation */
        const graphName1 = 'graph1';
        const state = {
            [graphName1]: {},
        };
        /* #endregion */

        /* #region Execution and Validation */
        const action = {
            type: 'GOT/CLEAR_ALL',
        };

        const result = gotReducer(state, action);

        expect(result).toEqual({
            main: {
                errors: {},
                files: {},
                graph: {},
            },
        });
        /* #endregion */
    });
    test('should clear store completely', () => {
        /* #region Test Bed Creation */
        const graphName1 = 'graph1';

        const {
            store: { clearAll },
            getState,
            onError,
        } = createTestStore({
            [graphName1]: {},
        });
        /* #endregion */

        /* #region Execution and Validation */
        clearAll();

        expect(onError).not.toBeCalled();
        expect(getState()).toEqual({
            main: {
                errors: {},
                files: {},
                graph: {},
            },
        });
        /* #endregion */
    });
    test('should do nothing if the store is empty', () => {
        /* #region Test Bed Creation */
        const {
            store: { clearAll },
            getState,
            onError,
        } = createTestStore({});
        /* #endregion */

        /* #region Execution and Validation */
        clearAll();

        expect(onError).not.toBeCalled();
        expect(getState()).toEqual({
            main: {
                errors: {},
                files: {},
                graph: {},
            },
        });
        /* #endregion */
    });
});
