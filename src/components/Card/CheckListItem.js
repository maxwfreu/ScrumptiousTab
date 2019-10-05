import React from 'react';
import { clearSelection } from '../../utils';
import '../../styles/CheckListItem.scss';


/**
 * Check list item.
 *
 * @type {Component}
 */

class CheckListItem extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }
  /**
   * On change, set the new checked value on the block.
   *
   * @param {Event} event
   */

  onChange(event) {
    const { checked } = event.target;
    const { editor, node, isEditing } = this.props;
    clearSelection();
    if (!isEditing) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    editor.setNodeByKey(node.key, { data: { checked } });
  }

  /**
   * Render a check list item, using `contenteditable="false"` to embed the
   * checkbox right next to the block's text.
   *
   * @return {Element}
   */

  render() {
    const {
      attributes,
      children,
      node,
      readOnly,
    } = this.props;
    let checked = false;
    if (node.data) {
      checked = node.data.get('checked');
    }
    if (checked === null) {
      checked = false;
    }
    return (
      <div className="check-list-item-wrapper" {...attributes}>
        <span className="check-box-item-wrapper" contentEditable={false}>
          <input type="checkbox" checked={checked} onChange={this.onChange} />
        </span>
        <span
          className="check-list-content-wrapper"
          checked={checked}
          contentEditable={!readOnly}
          suppressContentEditableWarning
        >
          {children}
        </span>
      </div>
    );
  }
}

export default CheckListItem;
