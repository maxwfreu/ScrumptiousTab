import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';
import * as ReactRedux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import InfoModal from '../src/components/InfoModal';

const mockStore = configureMockStore([thunk]);

describe('<InfoModal />', () => {
  let storeStateMock;
  let store;

  const AppSettings = {
    appMode: 0,
    isToolbarHidden: true,
    isWobbleDisabled: false,
  };
  beforeEach(() => {
    storeStateMock = {
      AppSettings,
    };
    store = mockStore(storeStateMock);
  });

  it ('does nothing', () => {
    console.log('not implemented');
  });

  // it('renders the basic info modal', () => {
  //   const wrapper = mount(
  //     <ReactRedux.Provider store={store}>
  //       <InfoModal
  //         showInfo={() => null}
  //         showInfoModal
  //         showBookMark={false}
  //         toggleBookMark={() => null}
  //       />
  //     </ReactRedux.Provider>,
  //   );
  //   expect(wrapper.find('.info-popup.show')).to.have.length(1);
  // });

  // it('renders the basic info modal hidden', () => {
  //   const wrapper = mount(
  //     <ReactRedux.Provider store={store}>
  //       <InfoModal
  //         showInfo={() => null}
  //         showInfoModal={false}
  //         showBookMark={false}
  //         toggleBookMark={() => null}
  //       />
  //     </ReactRedux.Provider>,
  //   );
  //   expect(wrapper.find('.info-popup.hide')).to.have.length(1);
  // });

  // it('calls show info on click', () => {
  //   const showSpy = sinon.spy();
  //   const wrapper = mount(
  //     <ReactRedux.Provider store={store}>
  //       <InfoModal
  //         showInfo={showSpy}
  //         showInfoModal
  //         showBookMark={false}
  //         toggleBookMark={() => null}
  //       />
  //     </ReactRedux.Provider>,
  //   );
  //   const btn = wrapper.find('.info-button');
  //   btn.simulate('click');
  //   expect(showSpy.called).to.equal(true);
  // });

  // it('triggers onchange on click', () => {
  //   const toggleSpy = sinon.spy();
  //   const wrapper = mount(
  //     <ReactRedux.Provider store={store}>
  //       <InfoModal
  //         showInfo={() => null}
  //         showInfoModal
  //         showBookMark
  //         toggleBookMark={toggleSpy}
  //       />
  //     </ReactRedux.Provider>,
  //   );
  //   wrapper.setState({ activeTab: 2 });
  //   wrapper.update();
  //   console.log(wrapper.debug())
  //   const checkbox = wrapper.find('input');
  //   expect(checkbox).to.have.length(1);
  //   checkbox.simulate('change');
  //   expect(toggleSpy.called).to.equal(true);
  // });
});
