import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as ReactRedux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import EmptyState from '../src/components/EmptyState';

const mockStore = configureMockStore([thunk]);
const AppSettings = {
  appMode: 0,
};

const storeStateMock = {
  AppSettings,
};
let store;
describe('<EmptyState />', () => {
  describe('columns', () => {
    const assertColumn = (stateType, Component) => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <EmptyState
            stateType={stateType}
          />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find(Component)).to.have.length(1);
    };
    it('renders light mode', () => {
      store = mockStore(storeStateMock);
      assertColumn('todo', 'ToDoLightSVG');
      assertColumn('doing', 'DoingLightSVG');
      assertColumn('done', 'DoneLightSVG');
      assertColumn('', 'DefaultSVG');
    });

    it('renders dark mode', () => {
      storeStateMock.AppSettings.appMode = 50;
      store = mockStore(storeStateMock);
      assertColumn('todo', 'ToDoDarkSVG');
      assertColumn('doing', 'DoingDarkSVG');
      assertColumn('done', 'DoneDarkSVG');
      assertColumn('', 'DefaultDarkSVG');
    });

    it('renders image mode', () => {
      storeStateMock.AppSettings.appMode = 100;
      store = mockStore(storeStateMock);
      assertColumn('todo', 'ToDoImageSVG');
      assertColumn('doing', 'DoingImageSVG');
      assertColumn('done', 'DoneImageSVG');
      assertColumn('', 'DefaultDarkSVG');
    });
  });

  describe('columns', () => {
    const assertArchive = (Component) => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <EmptyState isArchive />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find(Component)).to.have.length(1);
    };

    it('renders light mode', () => {
      storeStateMock.AppSettings.appMode = 0;
      store = mockStore(storeStateMock);
      assertArchive('ArchiveLightMode');
    });

    it('renders dark mode', () => {
      storeStateMock.AppSettings.appMode = 50;
      store = mockStore(storeStateMock);
      assertArchive('ArchiveDarkMode');
    });

    // Same as dark mode
    it('renders Image mode', () => {
      storeStateMock.AppSettings.appMode = 100;
      store = mockStore(storeStateMock);
      assertArchive('ArchiveDarkMode');
    });
  });
});
