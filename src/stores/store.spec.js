import AppRegistry from 'hadron-app-registry';
import store from 'stores';
import { reset } from 'modules';

describe('Aggregation Store', () => {
  before(() => {
    store.dispatch(reset());
  });

  describe('#onActivated', () => {
    const appRegistry = new AppRegistry();

    beforeEach(() => {
      store.onActivated(appRegistry);
    });

    afterEach(() => {
      store.dispatch(reset());
    });

    it('sets the app registry in the state', () => {
      expect(store.getState().appRegistry).to.deep.equal(appRegistry);
    });

    context('when the data service is connected', () => {
      beforeEach(() => {
        appRegistry.emit('data-service-connected', 'error', 'ds');
      });

      it('sets the data service in the state', () => {
        expect(store.getState().dataService.dataService).to.equal('ds');
      });

      it('sets the error in the state', () => {
        expect(store.getState().dataService.error).to.equal('error');
      });
    });

    context('when the server version changes', () => {
      beforeEach(() => {
        appRegistry.emit('server-version-changed', '4.2.0');
      });

      it('sets the server version in the state', () => {
        expect(store.getState().serverVersion).to.equal('4.2.0');
      });
    });
  });
});
