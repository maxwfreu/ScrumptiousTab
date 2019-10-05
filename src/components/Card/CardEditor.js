import React from 'react';
import PropTypes from 'prop-types';
import { Editor, getEventTransfer } from 'slate-react';
import { Value } from 'slate';
import { isKeyHotkey } from 'is-hotkey';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Plain from 'slate-plain-serializer';
import isUrl from 'is-url';
import ReactDOM from 'react-dom';

import CardExpander from './CardExpander';
import CheckListItem from './CheckListItem';
import { updateRichText } from '../Actions/TaskActions';
import { hideToolbar, showToolbar } from '../Actions/ToolbarActions';
import { logException, logEvent } from '../../utils';

const DEFAULT_NODE = 'paragraph';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+.');
const isResetHotkey = isKeyHotkey('shift+enter');
const isNumberListHotKey = isKeyHotkey('mod+k');
const isBulletListHotKey = isKeyHotkey('mod+j');
const isCheckListHotKey = isKeyHotkey('mod+/');
const isH1HotKey = isKeyHotkey('mod+shift+1');
const isH2HotKey = isKeyHotkey('mod+shift+2');
const isBlockQuoteHotKey = isKeyHotkey('mod+shift+l');

const SAVE_DELTA = 500;

// Hey! This is the CardEditor! Welcome to Hell :)
class CardEditor extends React.PureComponent {
  static wrapLink(editor, href) {
    editor.wrapInline({
      type: 'link',
      data: { href },
    });

    editor.moveToEnd();
  }

  static unwrapLink(editor) {
    editor.unwrapInline('link');
  }

  static renderMark(props, editor, next) {
    const { children, mark, attributes } = props;

    switch (mark.type) {
      case 'bold':
        return <strong {...attributes}>{children}</strong>;
      case 'code':
        return <code {...attributes}>{children}</code>;
      case 'italic':
        return <em {...attributes}>{children}</em>;
      case 'underlined':
        return <u {...attributes}>{children}</u>;
      default:
        return next();
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      value: props.value,
    };

    this.clickedToolbarBtn = false;

    this.ref = this.ref.bind(this);

    this.onChange = this.onChange.bind(this);
    this.onClickBlock = this.onClickBlock.bind(this);
    this.onClickMark = this.onClickMark.bind(this);
    this.onPaste = this.onPaste.bind(this);

    this.hasBlock = this.hasBlock.bind(this);
    this.hasMark = this.hasMark.bind(this);

    this.renderNode = this.renderNode.bind(this);
    this.renderMarkButton = this.renderMarkButton.bind(this);
    this.renderBlockButton = this.renderBlockButton.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);

    this.saveTimeout = null;
    this.saveData = this.saveData.bind(this);
    this.toggleToolbar = this.toggleToolbar.bind(this);
  }

  // for focus w/o title
  componentDidMount() {
    const { isEditing } = this.props;
    if (this.editor && isEditing) {
      ReactDOM.findDOMNode(this.editor).focus();
    }
  }

  // Save to redux on editing task change
  componentDidUpdate(prevProps) {
    const {
      columnId,
      taskId,
      editingId,
      value,
      isEditing,
      refreshFlag,
    } = this.props;
    if (prevProps.refreshFlag !== refreshFlag) {
      const changed = JSON.stringify(value) !== JSON.stringify(prevProps.value);
      if (changed) {
        this.setState({
          value,
        });
        return;
      }
    }
    const { value: stateVal } = this.state;
    const isValue = Value.isValue(stateVal);
    const editingIdChanged = prevProps.editingId !== editingId;
    if (!isValue || !editingIdChanged) return;
    if (value.document !== stateVal.document && (prevProps.isEditing || isEditing)) {
      const content = JSON.stringify(stateVal.toJSON());
      this.props.updateRichText(columnId, taskId, content);
    }
    if (isEditing && this.editor) {
      ReactDOM.findDOMNode(this.editor).focus();
    }
  }

  onChange({ value }) {
    const isValue = Value.isValue(value);
    if (!isValue) return;
    this.setState({ value });
  }

  onClickMark(event, type) {
    event.preventDefault();
    this.editor.toggleMark(type);
    logEvent('Task Editor', 'Toolbar Click');
  }

  onClickBlock(event, type) {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    logEvent('Task Editor', 'Toolbar Click');

    // Handle everything but list buttons.
    if (type !== 'bulleted-list' && type !== 'numbered-list') {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock('list-item');

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock('list-item');
      const isType = value.blocks.some(block => (
        !!document.getClosest(block.key, parent => parent.type === type)
      ));

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock('bulleted-list')
          .unwrapBlock('numbered-list');
      } else if (isList) {
        editor
          .unwrapBlock(
            type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list',
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks('list-item').wrapBlock(type);
      }
    }
  }

  onKeyDown(event, editor, next) {
    let mark;
    const { value } = editor;
    if (isResetHotkey(event)) {
      const curtype = value.startBlock.type;
      if (curtype === 'paragraph' || curtype === 'line') {
        this.props.endEditing();
        event.preventDefault();
        event.stopPropagation();
        return next();
      }
      editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock('list-item')
        .unwrapBlock('bulleted-list')
        .unwrapBlock('numbered-list')
        .unwrapBlock('check-list');
      return;
    }
    if (event.key === 'Enter' && value.startBlock.type === 'check-list') {
      editor.splitBlock().setBlocks({ data: { checked: false } });
      return;
    }

    if (
      event.key === 'Backspace'
      && value.isCollapsed
      && value.startBlock.type === 'check-list'
      && value.selection.startOffset === 0
    ) {
      editor
        .setBlocks(DEFAULT_NODE)
        .unwrapBlock('list-item');
      return;
    }
    if (isBoldHotkey(event)) {
      mark = 'bold';
    } else if (isItalicHotkey(event)) {
      mark = 'italic';
    } else if (isUnderlinedHotkey(event)) {
      mark = 'underlined';
    } else if (isCodeHotkey(event)) {
      mark = 'code';
    } else if (isNumberListHotKey(event)) {
      mark = 'numbered-list';
      this.onClickBlock(event, mark);
      // editor.setBlocks('list-item').wrapBlock(mark);
    } else if (isBulletListHotKey(event)) {
      mark = 'bulleted-list';
      this.onClickBlock(event, mark);
    } else if (isCheckListHotKey(event)) {
      mark = 'check-list';
      this.onClickBlock(event, mark);
    } else if (isH1HotKey(event)) {
      mark = 'heading-one';
      this.onClickBlock(event, mark);
    } else if (isH2HotKey(event)) {
      mark = 'heading-two';
      this.onClickBlock(event, mark);
    } else if (isBlockQuoteHotKey(event)) {
      mark = 'block-quote';
      this.onClickBlock(event, mark);
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  }

  onPaste(event, editor, next) {
    const transfer = getEventTransfer(event);
    const { type, text } = transfer;
    if (!isUrl(text)) return next();

    if (this.hasMark('link')) {
      editor.command(CardEditor.unwrapLink);
    }

    const { selection } = editor.value;
    const { isCollapsed, start } = selection;

    if (isCollapsed) {
      next();
      editor
        .moveAnchorTo(start.offset)
        .moveFocusTo(start.offset + text.length);
    }

    editor.command(CardEditor.wrapLink, text);
  }

  saveData() {
    const {
      columnId,
      taskId,
      editingId,
      value,
    } = this.props;

    const { value: stateVal } = this.state;
    const isValue = Value.isValue(stateVal);
    if (!isValue) return;

    if (editingId === taskId && value.document !== stateVal.document) {
      const content = JSON.stringify(stateVal.toJSON());
      this.props.updateRichText(columnId, taskId, content);
    }
  }

  componentDidCatch(error) {
    const { value } = this.props;
    this.setState({
      value,
    });
    logException('Card Editor Crashed');
  }

  ref(editor) {
    this.editor = editor;
  }

  hasBlock(type) {
    const { value } = this.state;
    return value.blocks.some(node => node.type === type);
  }


  hasMark(type) {
    const { value } = this.state;
    return value.activeMarks.some(mark => mark.type === type);
  }

  toggleToolbar() {
    const { isToolbarHidden } = this.props;
    this.clickedToolbarBtn = true;
    if (isToolbarHidden) {
      logEvent('Task Editor', 'Toolbar Show');
      this.props.showToolbar();
    } else {
      logEvent('Task Editor', 'Toolbar Hide');
      this.props.hideToolbar();
    }
  }

  renderNode(props, editor, next) {
    const { isEditing } = this.props;
    const { attributes, children, node } = props;
    switch (node.type) {
      case 'block-quote':
        return <blockquote {...attributes}>{children}</blockquote>;
      case 'bulleted-list':
        return <ul {...attributes}>{children}</ul>;
      case 'heading-one':
        return <h1 {...attributes}>{children}</h1>;
      case 'heading-two':
        return <h2 {...attributes}>{children}</h2>;
      case 'list-item':
        return <li {...attributes}>{children}</li>;
      case 'numbered-list':
        return <ol {...attributes}>{children}</ol>;
      case 'check-list':
        return <CheckListItem {...props} isEditing={isEditing} />;
      case 'link': {
        const { data } = node;
        const href = data.get('href');
        return (
          <a {...attributes} href={href} onClick={(e) => e.stopPropagation()} target="_blank">
            {children}
          </a>
        );
      }
      default:
        return next();
    }
  }

  renderMarkButton(type) {
    const isActive = this.hasMark(type);

    return (
      <button
        type="button"
        onMouseDown={event => this.onClickMark(event, type)}
        className={`toolbar-icon ${type} ${isActive ? 'active' : ''}`}
      />
    );
  }

  renderBlockButton(type) {
    let isActive = this.hasBlock(type);

    if (['numbered-list', 'bulleted-list'].includes(type)) {
      const { value: { document, blocks } } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock('list-item') && parent && parent.type === type;
      }
    }

    return (
      <button
        type="button"
        onMouseDown={event => this.onClickBlock(event, type)}
        className={`toolbar-icon ${type} ${isActive ? 'active' : ''}`}
      />
    );
  }

  render() {
    const { value } = this.state;
    const {
      isEditing,
      name,
      readOnly,
      isToolbarHidden,
    } = this.props;
    const serializedVal = Plain.serialize(value);
    const isEmpty = !serializedVal || serializedVal === '';
    if (!isEditing && isEmpty && !readOnly) return null;
    const placeholderQuestion = 'What do you have to do';
    const placeholder = (name && name !== '')
      ? `${placeholderQuestion}, ${name}?` : `${placeholderQuestion}?`;
    const showToolbarText = isToolbarHidden ? 'Show' : 'Hide';
    let toolbarHiddenClass = isToolbarHidden ? 'hidden-toolbar' : '';
    const showToolbarBtnClass = 'show-toolbar-btn';
    if (this.clickedToolbarBtn) {
      if (isToolbarHidden) {
        toolbarHiddenClass = `${toolbarHiddenClass} hidden-toolbar-animation hidden-toolbar-animation-hide`;
        // showToolbarBtnClass = `${showToolbarBtnClass} show-toolbar-btn-show-animation-hide`;
      } else {
        toolbarHiddenClass = `${toolbarHiddenClass} hidden-toolbar-animation hidden-toolbar-animation-show`;
        // showToolbarBtnClass = `${showToolbarBtnClass} show-toolbar-btn-show-animation-show`;
      }
      this.clickedToolbarBtn = false;
    }
    return (
      <CardExpander isEmpty={isEmpty} isEditing={isEditing}>
        <Editor
          spellCheck
          placeholder={placeholder}
          ref={this.ref}
          value={value}
          onChange={this.onChange}
          onPaste={this.onPaste}
          onKeyDown={this.onKeyDown}
          renderNode={this.renderNode}
          renderMark={CardEditor.renderMark}
          readOnly={!isEditing || readOnly}
        />
        {isEditing && (
          <div className="icon-row-wrapper">
            <div className={`icon-row ${toolbarHiddenClass}`}>
              {this.renderMarkButton('bold')}
              {this.renderMarkButton('italic')}
              {this.renderMarkButton('underlined')}
              {this.renderBlockButton('numbered-list')}
              {this.renderBlockButton('bulleted-list')}
              {this.renderBlockButton('check-list')}
              {this.renderBlockButton('heading-one')}
              {this.renderBlockButton('heading-two')}
              {this.renderMarkButton('code')}
              {this.renderBlockButton('block-quote')}
            </div>
            <button className={showToolbarBtnClass} onClick={this.toggleToolbar}>
              {showToolbarText}
            </button>
          </div>
        )}
      </CardExpander>
    );
  }
}

CardEditor.defaultProps = {
  name: '',
  isToolbarHidden: false,
};

CardEditor.propTypes = {
  name: PropTypes.string,
  isToolbarHidden: PropTypes.bool,
};

const mapStateToProps = ({ AppSettings, TaskReducer }) => ({
  isToolbarHidden: AppSettings.isToolbarHidden,
  refreshFlag: TaskReducer.refreshFlag,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateRichText,
    hideToolbar,
    showToolbar,
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(CardEditor);
