import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import * as ReactRedux from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import sinon from 'sinon';
import { parseHotkey } from 'is-hotkey'
import Plain from 'slate-plain-serializer';
import CardEditor from '../src/components/Card/CardEditor';
import CheckListItem from '../src/components/Card/CheckListItem';
import { initialTasks, initialTaskMapping, initialLabelOptions, initialColumns } from '../src/utils';

const mockStore = configureMockStore([thunk]);

describe('<CardEditor />', () => {
  const TaskReducer = {
    taskMapping: initialTaskMapping,
    tasks: initialTasks,
    cardNumber: 1,
    editingId: null,
    isFetchingData: true,
    lastCardMoved: '',
    refreshFlag: false,
  };

  const ColumnReducer = {
    columns: initialColumns,
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
    name: 'Bender Rodriguez',
    isBookMarksVisible: false,
  };

  const storeStateMock = {
    AppSettings,
    TaskReducer,
    ColumnReducer,
    LabelReducer,
  };

  const store = mockStore(storeStateMock);
  const taskID = '123';
  const columnType = 'openissues';
  describe('basic editor', () => {
    it('renders the Editor', () => {
      const wrapper = mount(
        <CardEditor
          id={taskID}
          isEditing
          refToFocus
          columnId={columnType}
          taskId={taskID}
          value={Plain.deserialize('')}
          readOnly={false}
          name="Bender Rodriguez"
          store={store}
        />,
      );
      expect(wrapper.find('Editor')).to.have.length(1);
    });

    // it('focuses on mount', () => {
    //   const wrapper = shallow(
    //     <CardEditor
    //       id={taskID}
    //       isEditing
    //       refToFocus
    //       columnId={columnType}
    //       taskId={taskID}
    //       value={Plain.deserialize("")}
    //       readOnly={false}
    //       name="Bender Rodriguez"
    //       store={store}
    //     />,
    //   ).shallow();
    //   const focusSpy = sinon.spy();
    //   wrapper.instance().editor = {
    //     focus: focusSpy,
    //   };
    //   wrapper.instance().componentDidMount();
    //   expect(focusSpy.called).to.equal(true);
    // });

    const validateNodeRender = (nodeType, resultType) => {
      const nextStub = () => null;
      const editor = {};
      const props = {
        attributes: {},
        children: null,
        node: {
          type: nodeType,
          data: {
            get: () => '',
          },
        },
      };
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <CardEditor
            id={taskID}
            isEditing
            refToFocus
            columnId={columnType}
            taskId={taskID}
            value={Plain.deserialize('')}
            readOnly={false}
            name="Bender Rodriguez"
          />
        </ReactRedux.Provider>,
      );
      const res = wrapper.find('CardEditor').instance().renderNode(props, editor, nextStub);
      expect(res.type).to.equal(resultType);
    };

    it('renders correct node for type', () => {
      validateNodeRender('block-quote', 'blockquote');
      validateNodeRender('bulleted-list', 'ul');
      validateNodeRender('heading-one', 'h1');
      validateNodeRender('heading-two', 'h2');
      validateNodeRender('list-item', 'li');
      validateNodeRender('numbered-list', 'ol');
      // validateNodeRender('check-list', CheckListItem);
      validateNodeRender('link', 'a');
    });

    // it('calls next for invalid type', () => {
    //   const nextStub = sinon.spy();
    //   const editor = {};
    //   const props = {
    //     attributes: {},
    //     children: null,
    //     node: {
    //       type: 'invalid',
    //     },
    //   };
    //   const wrapper = shallow(
    //     <CardEditor
    //       id={taskID}
    //       isEditing
    //       refToFocus
    //       columnId={columnType}
    //       taskId={taskID}
    //       value={Plain.deserialize('')}
    //       readOnly={false}
    //       name="Bender Rodriguez"
    //       store={store}
    //     />,
    //   ).shallow();
    //   wrapper.instance().renderNode(props, editor, nextStub);
    //   expect(nextStub.called).to.equal(true);
    // });

    const validateMark = (nodeType, resultType) => {
      const nextStub = () => null;
      const editor = {};
      const props = {
        attributes: {},
        children: null,
        mark: {
          type: nodeType,
        },
      };
      const res = CardEditor.renderMark(props, editor, nextStub);
      expect(res.type).to.equal(resultType);
    };

    it('renders correct node for type', () => {
      validateMark('bold', 'strong');
      validateMark('code', 'code');
      validateMark('italic', 'em');
      validateMark('underlined', 'u');
    });

    it('calls next for invalid mark', () => {
      const nextStub = sinon.spy();
      const editor = {};
      const props = {
        attributes: {},
        children: null,
        mark: {
          type: 'invalid',
        },
      };
      CardEditor.renderMark(props, editor, nextStub);
      expect(nextStub.called).to.equal(true);
    });
  });

  describe('interactions', () => {
    const validateKeyDown = (hotKeyCode, keyChar, keyName) => {
      const focusEditorSpy = sinon.spy();
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <CardEditor
            id={taskID}
            isEditing
            refToFocus
            columnId={columnType}
            taskId={taskID}
            value={Plain.deserialize('')}
            readOnly={false}
            name="Bender Rodriguez"
            focusEditor={focusEditorSpy}
          />
        </ReactRedux.Provider>,
      );

      const hotkey = parseHotkey(hotKeyCode);
      const event = {
        ...hotkey,
        key: keyChar,
        preventDefault: () => null,
      };

      const toggleSpy = sinon.spy();
      const editor = {
        toggleMark: toggleSpy,
      };
      const nextStub = () => null;
      const instance = wrapper.find('CardEditor').instance();
      instance.onKeyDown(event, editor, nextStub);
      expect(toggleSpy.called).to.equal(true);
      expect(toggleSpy.calledWith(keyName)).to.equal(true);
    };

    it('toggles mark on key down', () => {
      validateKeyDown('mod+s', 'b', 'bold');
      validateKeyDown('mod+i', 'i', 'italic');
      validateKeyDown('mod+u', 'u', 'underlined');
      validateKeyDown('mod+.', '.', 'code');
    });

    const validateNodeKeyDown = (hotKeyCode, keyChar, keyName) => {
      const focusEditorSpy = sinon.spy();
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <CardEditor
            id={taskID}
            isEditing
            refToFocus
            columnId={columnType}
            taskId={taskID}
            value={Plain.deserialize('')}
            readOnly={false}
            name="Bender Rodriguez"
            focusEditor={focusEditorSpy}
          />
        </ReactRedux.Provider>,
      );

      const hotkey = parseHotkey(hotKeyCode);
      const event = {
        ...hotkey,
        key: keyChar,
        preventDefault: () => null,
      };

      const toggleSpy = sinon.spy();
      const editor = {
        toggleMark: toggleSpy,
        setBlocks: () => ({
          wrapBlock: () => {},
        }),
        value: {
          blocks: [],
        },
      };
      const nextStub = () => null;
      const instance = wrapper.find('CardEditor').instance();
      instance.editor = editor;
      instance.onKeyDown(event, editor, nextStub);
      expect(toggleSpy.called).to.equal(true);
      expect(toggleSpy.calledWith(keyName)).to.equal(true);
    };

    it('toggles node on key down', () => {
      validateNodeKeyDown('mod+k', 'k', 'numbered-list');
      validateNodeKeyDown('mod+j', 'j', 'bulleted-list');
      validateNodeKeyDown('mod+/', '/', 'check-list');
      validateNodeKeyDown('mod+shift+1', '1', 'heading-one');
      validateNodeKeyDown('mod+shift+2', '2', 'heading-two');
      validateNodeKeyDown('mod+shift+l', 'l', 'block-quote');
    });

    it('calls next for invalid key down', () => {
      const focusEditorSpy = sinon.spy();
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <CardEditor
            id={taskID}
            isEditing
            refToFocus
            columnId={columnType}
            taskId={taskID}
            value={Plain.deserialize('')}
            readOnly={false}
            name="Bender Rodriguez"
            focusEditor={focusEditorSpy}
          />
        </ReactRedux.Provider>,
      );

      const event = {};
      const editor = {};
      const nextSpy = sinon.spy();

      const instance = wrapper.find('CardEditor').instance();
      instance.onKeyDown(event, editor, nextSpy);
      expect(nextSpy.called).to.equal(true);
    });
  });

  describe('node checks', () => {
    it('has block', () => {
      const focusEditorSpy = sinon.spy();
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <CardEditor
            id={taskID}
            isEditing
            refToFocus
            columnId={columnType}
            taskId={taskID}
            value={Plain.deserialize('')}
            readOnly={false}
            name="Bender Rodriguez"
            focusEditor={focusEditorSpy}
          />
        </ReactRedux.Provider>,
      );
      let hasblock = wrapper.find('CardEditor').instance().hasBlock('line');
      expect(hasblock).to.equal(true);
      hasblock = wrapper.find('CardEditor').instance().hasBlock('text');
      expect(hasblock).to.equal(false);
    });

    it('has mark', () => {
      const focusEditorSpy = sinon.spy();
      const wrapper = mount(
        <ReactRedux.Provider store={store}>
          <CardEditor
            id={taskID}
            isEditing
            refToFocus
            columnId={columnType}
            taskId={taskID}
            value={Plain.deserialize('')}
            readOnly={false}
            name="Bender Rodriguez"
            focusEditor={focusEditorSpy}
          />
        </ReactRedux.Provider>,
      );
      const hasblock = wrapper.find('CardEditor').instance().hasMark('line');
      expect(hasblock).to.equal(false);
    });
  });
});
