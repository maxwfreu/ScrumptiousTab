import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as ReactRedux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import WelcomeBanner from '../src/components/WelcomeBanner';
import ScrumptiousConstants from '../src/components/ScrumptiousConstants';
import * as Actions from '../src/components/Actions';

const mockStore = configureMockStore([thunk]);

describe('<WelcomeBanner />', () => {
  const AppSettings = {
    name: 'Bender Rodriguez',
    isMilitaryTime: false,
    shhMode: false,
    isWelcomeBannerHidden: false,
  };

  const storeStateMock = {
    AppSettings,
  };

  let store = mockStore(storeStateMock);
  const milliseconds = 1544335044702 * 1000;
  const DATE_TO_USE = new Date(milliseconds);
  // if (DATE_TO_USE.getHours() !== 20) {
    // milliseconds = 1544335044702 * 1000 + (4 * 60 * 60 * 1000);
  //   DATE_TO_USE = new Date(milliseconds);
  // }

  const _Date = Date;
  global.Date = jest.fn(() => DATE_TO_USE);
  global.Date.UTC = _Date.UTC;
  global.Date.parse = _Date.parse;
  global.Date.now = _Date.now;

  describe('basic banner', () => {
    let clock;

    beforeEach(() => {
      clock = sinon.useFakeTimers({ now: milliseconds });
    });

    afterEach(() => {
      clock.restore();
    });

    it('renders the users name', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <WelcomeBanner
            updateAppMode={() => null}
            defaultMode={0}
            showInfo={() => null}
          />
        </ReactRedux.Provider>,
      );
      expect(wrapper.find('.welcome-banner-wrapper')).to.have.length(1);
      const userName = wrapper.find('.welcome input');
      expect(userName).to.have.length(1);
      expect(userName.props().value).to.equal('Bender Rodriguez');
    });

    if (DATE_TO_USE.getHours() === 20) {
      it('updates time after delta', () => {
        const wrapper = mount(
          <ReactRedux.Provider store={store}>
            <WelcomeBanner
              updateAppMode={() => null}
              defaultMode={0}
              showInfo={() => null}
            />
          </ReactRedux.Provider>,
        );
        const time = wrapper.find('.time');
        expect(time.text()).to.equal('8:51');
        clock.tick(50000);
        wrapper.update();
        expect(time.text()).to.equal('8:52');
      });

      it('renders mini greeting', () => {
        const wrapper = mount(
          <ReactRedux.Provider store={store}>
            <WelcomeBanner
              updateAppMode={() => null}
              defaultMode={0}
              showInfo={() => null}
            />
          </ReactRedux.Provider>,
        );
        const greeting = wrapper.find('.welcome-greeting-mini');
        expect(greeting.text()).to.equal('Hello,\u00a0');
      });

      it('renders mini greeting', () => {
        global.innerWidth = 1280;
        const wrapper = mount(
          <ReactRedux.Provider store={store}>
            <WelcomeBanner
              updateAppMode={() => null}
              defaultMode={0}
              width={1280}
              showInfo={() => null}
            />
          </ReactRedux.Provider>,
        );
        const greeting = wrapper.find('.welcome-greeting');
        expect(greeting.text()).to.equal('Good evening,\u00a0');
        clock.tick(50000000);
        expect(greeting.text()).to.equal('Good morning,\u00a0');
        clock.tick(6000000);
        expect(greeting.text()).to.equal('Good afternoon,\u00a0');
      });
    }
    it('unmounts safelt', () => {
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <WelcomeBanner
            updateAppMode={() => null}
            defaultMode={0}
            showInfo={() => null}
          />
        </ReactRedux.Provider>,
      );
      wrapper.unmount();
      expect(wrapper.find('WelcomeBanner')).to.have.length(0);
    });
  });

  describe('interactions', () => {
    afterEach(() => {
      storeStateMock.name = 'Bender Rodriguez';
    });

    if (DATE_TO_USE.getHours() === 20) {
      it('updates time mode on click', () => {
        const wrapper = mount(
          <ReactRedux.Provider store={store}>
            <WelcomeBanner
              updateAppMode={() => null}
              defaultMode={0}
              showInfo={() => null}
            />
          </ReactRedux.Provider>,
        );
        wrapper.find('.time').simulate('click');
        const expectedActions = [{
          type: ScrumptiousConstants.MILITARY_TIME_TOGGLE,
        }];
        expect(store.getActions()).to.deep.equal(expectedActions);
      });
    }
    it('sets name on blur', () => {
      storeStateMock.AppSettings.name = '';
      store = mockStore(storeStateMock);
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <WelcomeBanner
            updateAppMode={() => null}
            defaultMode={0}
            showInfo={() => null}
          />
        </ReactRedux.Provider>,
      );
      const banner = wrapper.find('WelcomeBanner');
      expect(banner.state('isNameSet')).to.equal(false);
      wrapper.find('input').simulate('blur', {
        target: {
          value: 'Joe Shmo',
        },
      });
      expect(banner.state('isNameSet')).to.equal(true);
    });

    it('name isnt set onchange when null', () => {
      storeStateMock.AppSettings.name = '';
      store = mockStore(storeStateMock);
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <WelcomeBanner
            updateAppMode={() => null}
            defaultMode={0}
            showInfo={() => null}
          />
        </ReactRedux.Provider>,
      );
      wrapper.find('input').simulate('change', {
        target: {
          value: '',
        },
      });
      const banner = wrapper.find('WelcomeBanner');
      expect(banner.state('isNameSet')).to.equal(false);
    });

    it('name isnt set onblur when null', () => {
      storeStateMock.AppSettings.name = '';
      store = mockStore(storeStateMock);
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <WelcomeBanner
            updateAppMode={() => null}
            defaultMode={0}
            showInfo={() => null}
          />
        </ReactRedux.Provider>,
      );
      wrapper.find('input').simulate('blur', {
        target: {
          value: '',
        },
      });
      const banner = wrapper.find('WelcomeBanner');
      expect(banner.state('isNameSet')).to.equal(false);
    });

    it('dispatched name change action', () => {
      storeStateMock.AppSettings.name = '';
      store = mockStore(storeStateMock);
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <WelcomeBanner
            updateAppMode={() => null}
            defaultMode={0}
            showInfo={() => null}
          />
        </ReactRedux.Provider>,
      );
      const name = 'Joe Shmo';
      wrapper.find('input').simulate('change', {
        target: {
          value: name,
        },
      });
      const expectedActions = [{
        type: ScrumptiousConstants.USERNAME_SET,
        name,
      }];
      expect(store.getActions()).to.deep.equal(expectedActions);
    });
  //   it('sets appmode onclick', () => {
  //     storeStateMock.name = '';
  //     store = mockStore(storeStateMock);
  //     const wrapper = mount(
  //       <ReactRedux.Provider store={store}>
  //         <WelcomeBanner
  //           updateAppMode={() => null}
  //           defaultMode={0}
  //         />
  //       </ReactRedux.Provider>,
  //     );
  //     const tick = wrapper.find('.custom-slider-tick').at(1);
  //     tick.simulate('click');
  //     const expectedActions = [{
  //       type: ScrumptiousConstants.APP_MODE_SET,
  //       appMode: 50,
  //     }];
  //     expect(store.getActions()).to.deep.equal(expectedActions);
  //   });
  });
});
