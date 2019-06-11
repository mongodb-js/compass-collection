import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import toNS from 'mongodb-ns';
import reducer from 'modules';
import { appRegistryActivated } from 'modules/app-registry';
import { dataServiceConnected } from 'modules/data-service';
import { serverVersionChanged } from 'modules/server-version';
import { selectOrCreateTab, createNewTab, clearTabs } from 'modules/tabs';

const store = createStore(reducer, applyMiddleware(thunk));

/**
 * This hook is Compass specific to listen to app registry events.
 *
 * @param {AppRegistry} appRegistry - The app registry.
 */
store.onActivated = (appRegistry) => {
  /**
   * When a collection namespace is selected in the sidebar.
   *
   * @param {String} ns - The namespace.
   */
  appRegistry.on('open-namespace-in-new-tab', (ns, isReadonly, sourceName) => {
    if (ns) {
      const namespace = toNS(ns);
      if (namespace.collection !== '') {
        store.dispatch(createNewTab(ns, isReadonly, sourceName));
      }
    }
  });

  /**
   * When a collection namespace is selected in the sidebar.
   *
   * @param {String} ns - The namespace.
   */
  appRegistry.on('select-namespace', (ns, isReadonly, sourceName) => {
    if (ns) {
      const namespace = toNS(ns);
      if (namespace.collection !== '') {
        store.dispatch(selectOrCreateTab(ns, isReadonly, sourceName));
      }
    }
  });

  /**
   * Clear the tabs when selecting a database.
   */
  appRegistry.on('database-selected', () => {
    store.dispatch(clearTabs());
  });

  /**
   * Remove any open tabs when collection dropped.
   *
   * @param {String} namespace - The namespace.
   */
  appRegistry.on('collection-dropped', () => {
  });

  /**
   * Modify the source pipeline.
   *
   * @param {String} ns - The namespace.
   * @param {String} sourceName - The source name that will be edited.
   * @param {Boolean} isSourceReadonly - If the source is also a view.
   * @param {String} sourceSourceName - If the source is a view, its source name.
   */
  appRegistry.on('modify-source-pipeline', () => {
    // If tabs are open.
    // - If modifying source from sidebar open in new tab.
    //   - Back stays in same tab.
    // - If modifying source from the header select-namespace.
    //   - Back stays in same tab.
  });

  /**
   * Set the data service in the store when connected.
   *
   * @param {Error} error - The error.
   * @param {DataService} dataService - The data service.
   */
  appRegistry.on('data-service-connected', (error, dataService) => {
    store.dispatch(dataServiceConnected(error, dataService));
  });

  /**
   * When the instance is loaded, set our server version.
   *
   * @param {String} version - The version.
   */
  appRegistry.on('server-version-changed', (version) => {
    store.dispatch(serverVersionChanged(version));
  });

  /**
   * Set the app registry to use later.
   */
  store.dispatch(appRegistryActivated(appRegistry));
};

export default store;
