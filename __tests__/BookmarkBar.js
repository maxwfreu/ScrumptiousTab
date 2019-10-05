import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import * as ReactRedux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import BookmarkBar from '../src/components/BookmarkBar';

const mockStore = configureMockStore([thunk]);

describe('<BookmarkBar />', () => {
  let storeStateMock;
  let store;

  const AppSettings = {
    isBookMarksVisible: false,
  };
  beforeEach(() => {
    storeStateMock = {
      AppSettings,
    };
    store = mockStore(storeStateMock);
  });
  it('renders null is bookmarkbar disabled', () => {
    const wrapper = mount(
      <ReactRedux.Provider store={store}>
        <BookmarkBar />
      </ReactRedux.Provider>,
    );
    expect(wrapper.find('.bookmark-wrapper')).to.have.length(0);
  });

  it('renders basic bookmarkbar is enabled', () => {
    storeStateMock = {
      AppSettings: {
        isBookMarksVisible: true,
      },
    };
    store = mockStore(storeStateMock);
    const wrapper = mount(
      <ReactRedux.Provider store={store}>
        <BookmarkBar />
      </ReactRedux.Provider>,
    );
    expect(wrapper.find('.bookmark-wrapper')).to.have.length(1);
  });
});
