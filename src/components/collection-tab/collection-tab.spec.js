import React from 'react';
import { mount } from 'enzyme';

import CollectionTab from 'components/collection-tab';
import styles from './collection-tab.less';

describe('CollectionTab [Component]', () => {
  context('when the tab is active', () => {
    let component;
    let closeTabSpy;
    let selectTabSpy;

    beforeEach(() => {
      closeTabSpy = sinon.spy();
      selectTabSpy = sinon.spy();
      component = mount(
        <CollectionTab
          namespace="db.coll"
          subTab="Documents"
          isActive
          index={1}
          closeTab={closeTabSpy}
          selectTab={selectTabSpy} />
      );
    });

    afterEach(() => {
      component = null;
    });

    it('renders the active wrapper div', () => {
      expect(component.find(`.${styles['collection-tab-is-active']}`)).to.be.present();
    });

    it('renders the namespace', () => {
      expect(component.find(`.${styles['collection-tab-info-ns']}`)).to.have.text('db.coll');
    });

    it('renders the subtab', () => {
      expect(component.find(`.${styles['collection-tab-info-subtab']}`)).to.have.text('Documents');
    });

    context('when clicking on close tab', () => {
      it('calls the action', () => {
        component.find(`.${styles['collection-tab-close']}`).simulate('click');
        expect(closeTabSpy.calledWith(1)).to.equal(true);
      });
    });

    context('when clicking on select tab', () => {
      it('calls the action', () => {
        component.find(`.${styles['collection-tab-info']}`).simulate('click');
        expect(selectTabSpy.calledWith(1)).to.equal(true);
      });
    });
  });

  context('when the tab is not active', () => {
    let component;
    let closeTabSpy;
    let selectTabSpy;

    beforeEach(() => {
      closeTabSpy = sinon.spy();
      selectTabSpy = sinon.spy();
      component = mount(
        <CollectionTab
          namespace="db.coll"
          subTab="Documents"
          isActive={false}
          index={1}
          closeTab={closeTabSpy}
          selectTab={selectTabSpy} />
      );
    });

    afterEach(() => {
      component = null;
    });

    it('renders the wrapper div', () => {
      expect(component.find(`.${styles['collection-tab']}`)).to.be.present();
    });

    it('does not render the active div', () => {
      expect(component.find(`.${styles['collection-tab-is-active']}`)).to.not.be.present();
    });

    it('renders the namespace', () => {
      expect(component.find(`.${styles['collection-tab-info-ns']}`)).to.have.text('db.coll');
    });

    it('renders the subtab', () => {
      expect(component.find(`.${styles['collection-tab-info-subtab']}`)).to.have.text('Documents');
    });

    context('when clicking on close tab', () => {
      it('calls the action', () => {
        component.find(`.${styles['collection-tab-close']}`).simulate('click');
        expect(closeTabSpy.calledWith(1)).to.equal(true);
      });
    });

    context('when clicking on select tab', () => {
      it('calls the action', () => {
        component.find(`.${styles['collection-tab-info']}`).simulate('click');
        expect(selectTabSpy.calledWith(1)).to.equal(true);
      });
    });
  });
});
