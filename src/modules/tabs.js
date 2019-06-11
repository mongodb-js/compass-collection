import { ObjectId } from 'bson';
import createContext from 'modules/context';

/**
 * The prefix.
 */
const PREFIX = 'collection';

/**
 * Namespace selected action name.
 */
export const SELECT_NAMESPACE = `${PREFIX}/tabs/SELECT_NAMESPACE`;

/**
 * Create tab action name.
 */
export const CREATE_TAB = `${PREFIX}/tabs/CREATE_TAB`;

/**
 * Close tab action name.
 */
export const CLOSE_TAB = `${PREFIX}/tabs/CLOSE_TAB`;

/**
 * Select tab action name.
 */
export const SELECT_TAB = `${PREFIX}/tabs/SELECT_TAB`;

/**
 * Move tab action name.
 */
export const MOVE_TAB = `${PREFIX}/tabs/MOVE_TAB`;

/**
 * Prev tab action name.
 */
export const PREV_TAB = `${PREFIX}/tabs/PREV_TAB`;

/**
 * Next tab action name.
 */
export const NEXT_TAB = `${PREFIX}/tabs/NEXT_TAB`;

/**
 * Change active subtab action name.
 */
export const CHANGE_ACTIVE_SUB_TAB = `${PREFIX}/tabs/CHANGE_ACTIVE_SUBTAB`;

/**
 * The initial state.
 */
export const INITIAL_STATE = [];

/**
 * Handles namespace selected actions.
 *
 * @param {Object} state - The state.
 * @param {Object} action - The action.
 *
 * @returns {Object} The new state.
 */
const doSelectNamespace = (state, action) => {
  return state.reduce((newState, tab) => {
    if (tab.isActive) {
      newState.push({
        id: action.id,
        namespace: action.namespace,
        isActive: true,
        activeSubTab: 0,
        isReadonly: action.isReadonly,
        tabs: action.context.tabs,
        views: action.context.views,
        subtab: action.context.subtab,
        queryHistoryIndexes: action.context.queryHistoryIndexes,
        statsPlugin: action.context.statsPlugin,
        statsStore: action.context.statsStore,
        scopedModals: action.context.scopedModals,
        sourceName: action.sourceName,
        localAppRegistry: action.context.localAppRegistry
      });
    } else {
      newState.push({ ...tab });
    }
    return newState;
  }, []);
};

/**
 * Handle create tab actions.
 *
 * @param {Object} state - The state.
 * @param {Object} action - The action.
 *
 * @returns {Object} The new state.
 */
const doCreateTab = (state, action) => {
  const newState = state.map((tab) => {
    return { ...tab, isActive: false };
  });
  newState.push({
    id: action.id,
    namespace: action.namespace,
    isActive: true,
    activeSubTab: 0,
    isReadonly: action.isReadonly,
    tabs: action.context.tabs,
    views: action.context.views,
    subtab: action.context.subtab,
    queryHistoryIndexes: action.context.queryHistoryIndexes,
    statsPlugin: action.context.statsPlugin,
    statsStore: action.context.statsStore,
    scopedModals: action.context.scopedModals,
    sourceName: action.sourceName,
    localAppRegistry: action.context.localAppRegistry
  });
  return newState;
};

/**
 * Handle close tab actions.
 *
 * @param {Object} state - The state.
 * @param {Object} action - The action.
 *
 * @returns {Object} The new state.
 */
const doCloseTab = (state, action) => {
  const closeIndex = action.index;
  const activeIndex = state.findIndex((tab) => {
    return tab.isActive;
  });
  const numTabs = state.length;

  return state.reduce((newState, tab, i) => {
    if (closeIndex !== i) {
      // We follow stnadard browser behaviour with tabs on how we
      // handle which tab gets activated if we close the active tab.
      // If the active tab is the last tab, we activate the one before
      // it, otherwise we activate the next tab.
      if (activeIndex === closeIndex) {
        newState.push({ ...tab, isActive: isTabAfterCloseActive(closeIndex, i, numTabs)});
      } else {
        newState.push({ ...tab });
      }
    }
    return newState;
  }, []);
};

/**
 * Handle move tab actions.
 *
 * @param {Object} state - The state.
 * @param {Object} action - The action.
 *
 * @returns {Object} The new state.
 */
const doMoveTab = (state, action) => {
  if (action.fromIndex === action.toIndex) return state;
  const newState = state.map((tab) => ({ ...tab }));
  newState.splice(action.toIndex, 0, newState.splice(action.fromIndex, 1)[0]);
  return newState;
};

/**
 * Activate the next tab.
 *
 * @param {Object} state - The state.
 *
 * @returns {Object} The new state.
 */
const doNextTab = (state) => {
  const activeIndex = state.findIndex(tab => tab.isActive);
  return state.map((tab, i) => {
    return { ...tab, isActive: isTabAfterNextActive(activeIndex, i, state.length) };
  });
};

/**
 * Activate the prev tab.
 *
 * @param {Object} state - The state.
 *
 * @returns {Object} The new state.
 */
const doPrevTab = (state) => {
  const activeIndex = state.findIndex(tab => tab.isActive);
  return state.map((tab, i) => {
    return { ...tab, isActive: isTabAfterPrevActive(activeIndex, i, state.length) };
  });
};

/**
 * Handle select tab actions.
 *
 * @param {Object} state - The state.
 * @param {Object} action - The action.
 *
 * @returns {Object} The new state.
 */
const doSelectTab = (state, action) => {
  return state.map((tab, i) => {
    return { ...tab, isActive: (action.index === i) ? true : false };
  });
};

/**
 * Handle the changing of the active subtab for a collection tab.
 *
 * @param {Object} state - The state.
 * @param {Object} action - The action.
 *
 * @returns {Array} The new state.
 */
const doChangeActiveSubTab = (state, action) => {
  return state.map((tab) => {
    return { ...tab, activeSubTab: (action.id === tab.id) ? action.activeSubTab : tab.activeSubTab };
  });
};

/**
 * The action to state modifier mappings.
 */
const MAPPINGS = {
  [SELECT_NAMESPACE]: doSelectNamespace,
  [CREATE_TAB]: doCreateTab,
  [CLOSE_TAB]: doCloseTab,
  [MOVE_TAB]: doMoveTab,
  [NEXT_TAB]: doNextTab,
  [PREV_TAB]: doPrevTab,
  [SELECT_TAB]: doSelectTab,
  [CHANGE_ACTIVE_SUB_TAB]: doChangeActiveSubTab
};

/**
 * Reducer function for handle state changes to the tabs.
 *
 * @param {String} state - The tabs state.
 * @param {Object} action - The action.
 *
 * @returns {String} The new state.
 */
export default function reducer(state = INITIAL_STATE, action) {
  const fn = MAPPINGS[action.type];
  return fn ? fn(state, action) : state;
}

/**
 * Action creator for create tab.
 *
 * @param {String} namespace - The namespace.
 * @param {Boolean} isReadonly - Is the collection readonly?
 * @param {String} sourceName - The source namespace.
 * @param {Object} context - The tab context.
 *
 * @returns {Object} The create tab action.
 */
export const createTab = (id, namespace, isReadonly, sourceName, context) => ({
  type: CREATE_TAB,
  id: id,
  namespace: namespace,
  isReadonly: isReadonly || false,
  sourceName: sourceName,
  context: context
});

/**
 * Action creator for namespace selected.
 *
 * @param {String} namespace - The namespace.
 * @param {Boolean} isReadonly - Is the collection readonly?
 * @param {String} sourceName - The source namespace.
 * @param {Object} context - The tab context.
 *
 * @returns {Object} The namespace selected action.
 */
export const selectNamespace = (namespace, isReadonly, sourceName, context) => ({
  type: SELECT_NAMESPACE,
  namespace: namespace,
  isReadonly: ((isReadonly === undefined) ? false : isReadonly),
  sourceName: sourceName,
  context: context
});

/**
 * Action creator for close tab.
 *
 * @param {Number} index - The tab index.
 *
 * @returns {Object} The close tab action.
 */
export const closeTab = (index) => ({
  type: CLOSE_TAB,
  index: index
});

/**
 * Action creator for move tab.
 *
 * @param {Number} fromIndex - The from tab index.
 * @param {Number} toIndex - The to tab index.
 *
 * @returns {Object} The move tab action.
 */
export const moveTab = (fromIndex, toIndex) => ({
  type: MOVE_TAB,
  fromIndex: fromIndex,
  toIndex: toIndex
});

/**
 * Action creator for next tab.
 *
 * @returns {Object} The next tab action.
 */
export const nextTab = () => ({
  type: NEXT_TAB
});

/**
 * Action creator for prev tab.
 *
 * @returns {Object} The prev tab action.
 */
export const prevTab = () => ({
  type: PREV_TAB
});

/**
 * Action creator for selecting tabs.
 *
 * @param {Number} index - The tab index.
 *
 * @returns {Object} The action.
 */
export const selectTab = (index) => ({
  type: SELECT_TAB,
  index: index
});

/**
 * Action creator for changing subtabs.
 *
 * @param {Number} activeSubTab - The active subtab index.
 * @param {Number} id - The tab id.
 *
 * @returns {Object} The action.
 */
export const changeActiveSubTab = (activeSubTab, id) => ({
  type: CHANGE_ACTIVE_SUB_TAB,
  activeSubTab: activeSubTab,
  id: id
});

/**
 * Checks if we need to select a namespace or actually create a new
 * tab, then dispatches the correct events.
 *
 * @param {String} namespace - The namespace to select.
 * @param {Boolean} isReadonly - If the ns is readonly.
 * @param {String} sourceName - The ns of the resonly view source.
 */
export const selectOrCreateTab = (namespace, isReadonly, sourceName) => {
  return (dispatch, getState) => {
    const state = getState();
    if (state.length === 0) {
      dispatch(createNewTab(namespace, isReadonly, sourceName));
    } else {
      // If the namespace is equal to the active tab's namespace, then
      // there is no need to do anything.
      const activeIndex = state.findIndex(tab => tab.isActive);
      const activeNamespace = state[activeIndex].namespace;
      if (namespace !== activeNamespace) {
        dispatch(replaceTabContent(namespace, isReadonly, sourceName));
      }
    }
  };
};

/**
 * Handles all the setup of tab creation by creating the stores for each
 * of the roles in the global app registry.
 *
 * @param {String} namespace - The namespace.
 * @param {Boolean} isReadonly - If the namespace is readonly.
 * @param {String} sourceName - The view source namespace.
 */
export const createNewTab = (namespace, isReadonly, sourceName) => {
  return (dispatch, getState) => {
    const state = getState();
    const context = createContext(state, namespace, isReadonly, sourceName);
    dispatch(
      createTab(
        new ObjectId().toHexString(),
        namespace,
        isReadonly,
        sourceName,
        context,
      )
    );
  };
};

/**
 * Handles all the setup of replacing tab content by creating the stores for each
 * of the roles in the global app registry.
 *
 * @param {String} namespace - The namespace.
 * @param {Boolean} isReadonly - If the namespace is readonly.
 * @param {String} sourceName - The view source namespace.
 */
export const replaceTabContent = (namespace, isReadonly, sourceName) => {
  return (dispatch, getState) => {
    const state = getState();
    const context = createContext(state, namespace, isReadonly, sourceName);
    dispatch(
      selectNamespace(
        new ObjectId().toHexString(),
        namespace,
        isReadonly,
        sourceName,
        context
      )
    );
  };
};

/**
 * Determine if a tab is active after the prev action.
 *
 * @param {Number} activeIndex - The current active tab index.
 * @param {Number} currentIndex - The currently iterated tab index.
 * @param {Number} numTabs - The total number of tabs.
 *
 * @returns {Boolean} If the tab is active.
 */
const isTabAfterPrevActive = (activeIndex, currentIndex, numTabs) => {
  return (activeIndex === 0)
    ? (currentIndex === numTabs - 1)
    : (currentIndex === activeIndex - 1);
};

/**
 * Determine if a tab becomes active after an active tab
 * is closed.
 *
 * @param {Number} closeIndex - The index of the tab being closed.
 * @param {Number} currentIndex - The current tab index.
 * @param {Number} numTabs - The number of tabs.
 *
 * @returns {Boolean} If the tab must be active.
 */
const isTabAfterCloseActive = (closeIndex, currentIndex, numTabs) => {
  return (closeIndex === numTabs - 1)
    ? (currentIndex === numTabs - 2)
    : (currentIndex === closeIndex + 1);
};

/**
 * Determine if a tab is active after the next action.
 *
 * @param {Number} activeIndex - The current active tab index.
 * @param {Number} currentIndex - The currently iterated tab index.
 * @param {Number} numTabs - The total number of tabs.
 *
 * @returns {Boolean} If the tab is active.
 */
const isTabAfterNextActive = (activeIndex, currentIndex, numTabs) => {
  return (activeIndex === numTabs - 1)
    ? (currentIndex === 0)
    : (currentIndex === activeIndex + 1);
};
