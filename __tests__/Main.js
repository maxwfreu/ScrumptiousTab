import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as ReactRedux from 'react-redux';
import Main from '../src/components/Main';
import { initialTasks, initialTaskMapping, initialLabelOptions } from '../src/utils';

const mockStore = configureMockStore([thunk]);

const columns = [
  { id: 'openissues', title: 'To Do', emptyState: 'todo' },
  { id: 'inprogress', title: 'Doing', emptyState: 'doing' },
  { id: 'done', title: 'Done', emptyState: 'done' },
];
describe('<Main />', () => {
  const TaskReducer = {
    taskMapping: initialTaskMapping,
    tasks: initialTasks,
    cardNumber: 1,
    editingId: null,
    isFetchingData: true,
    lastCardMoved: '',
  };

  const ColumnReducer = {
    columns,
  };

  const LabelReducer = {
    labelOptions: initialLabelOptions,
  };

  const AppSettings = {
    appMode: 100,
    backgroundMode: 0,
    isInfoModalHidden: true,
    isToolbarHidden: false,
    isWobbleDisabled: false,
    isMilitaryTime: false,
    isWelcomeBannerHidden: false,
    shhMode: false,
    name: '',
    isBookMarksVisible: false,
    shouldUpdateToggle: false,
    panelToShow: 0,
    hasSeenArchive: false,
  };

  const storeStateMock = {
    AppSettings,
    TaskReducer,
    ColumnReducer,
    LabelReducer,
  };

  const store = mockStore(storeStateMock);

  it('does nothing', () => {
    expect(1).to.equal(1);
  });

  // it('renders the app wrapper', () => {
  //   const wrapper = mount(
  //     <ReactRedux.Provider store={store}>
  //       <Main store={store} />
  //     </ReactRedux.Provider>,
  //   );
  //   expect(wrapper.find('.App-wrapper')).to.have.length(1);
  // });

  // it('renders default app mode', () => {
  //   const wrapper = mount(
  //     <ReactRedux.Provider store={store}>
  //       <Main store={store} />
  //     </ReactRedux.Provider>,
  //   );
  //   expect(wrapper.find('.image-mode')).to.have.length(2);
  // });

  // it('doesnt hide onclick if not open', () => {
  //   const wrapper = shallow(
  //     <Main store={store} />,
  //   ).shallow();
  //   const labelOption = wrapper.find('.App-wrapper');
  //   expect(labelOption).to.have.length(1);
  //   labelOption.simulate('click');
  // });

  // it('hides onclick if open', () => {
  //   const wrapper = shallow(
  //     <Main store={store} />,
  //   ).shallow();
  //   const labelOption = wrapper.find('.App-wrapper');
  //   const instance = wrapper.instance();
  //   instance.infoRef = {
  //     contains: () => null,
  //   };
  //   sinon.stub(instance.infoRef, 'contains').returns(false);
  //   instance.showInfo();
  //   wrapper.update();
  //   expect(labelOption).to.have.length(1);
  //   labelOption.simulate('click', {
  //     target: '',
  //   });
  //   expect(wrapper.state('showInfoModal')).to.equal(false);
  // });

  // it('sets info ref', () => {
  //   const wrapper = mount(
  //     <ReactRedux.Provider store={store}>
  //       <Main store={store} />
  //     </ReactRedux.Provider>,
  //   );
  //   const instance = wrapper.find('Main').instance();
  //   instance.setInfoRef('test-ref');
  //   expect(instance.infoRef).to.equal('test-ref');
  // });
});
