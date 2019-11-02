import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import posed from 'react-pose';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import loadable from '@loadable/component';
import {
  toggleInfoModal as toggleInfoModalAction,
} from '../Actions';

const ShortcutPanel = loadable(() => import('./ShortcutPanel'));
const AppModePanel = loadable(() => import('./AppModePanel'));
const SettingsPanel = loadable(() => import('./SettingsPanel'));
const SuggestionsPanel = loadable(() => import('./SuggestionsPanel'));
const ArchivePanel = loadable(() => import('./ArchivePanel'));

import '../../styles/InfoModal.scss';

const Panel = posed.div({
  show: {
    x: '0',
    transition: {
      ease: 'easeIn',
    },
  },
  hide: {
    x: '-510px',
    transition: {
      ease: 'easeOut',
      duration: 400,
    },
  },
  initialPose: 'hide',
});

const MenuPanel = posed.div({
  show: {
    delayChildren: 300,
    staggerChildren: 50,
  },
  hide: { delay: 300 },
  initialPose: 'hide',
});

const MenuButton = posed.button({
  show: { x: '0%', opacity: 1 },
  hide: { x: '-100%', opacity: 0 },
});

class InfoModal extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0,
    };

    this.openShortcutPanel = this.openShortcutPanel.bind(this);
    this.openAppModePanel = this.openAppModePanel.bind(this);
    this.openSettingsPanel = this.openSettingsPanel.bind(this);
    this.openSuggestionsPanel = this.openSuggestionsPanel.bind(this);
    this.openArchivePanel = this.openArchivePanel.bind(this);
    this.showInfo = this.showInfo.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { activeTab } = this.state;
    const { panelToShow, showInfoModal } = this.props;
    const visibilityChanged = prevProps.showInfoModal !== showInfoModal;
    const panelToShowChanged = panelToShow !== prevProps.panelToShow;
    if (visibilityChanged && panelToShowChanged) {
      this.setState({
        activeTab: panelToShow,
      });
    }
  }

  /*
    Open the InfoModal component
  */
  showInfo() {
    const { toggleInfoModal } = this.props;
    toggleInfoModal(false);
  }

  openAppModePanel() {
    this.setState({ activeTab: 0 });
  }

  openArchivePanel() {
    this.setState({ activeTab: 1 });
  }

  openShortcutPanel() {
    this.setState({ activeTab: 2 });
  }

  openSettingsPanel() {
    this.setState({ activeTab: 3 });
  }

  openSuggestionsPanel() {
    this.setState({ activeTab: 4 });
  }


  render() {
    const { showInfoModal } = this.props;
    const { activeTab } = this.state;

    return (
      <Fragment>
        <button type="button" className="info-button" onClick={this.showInfo} />
        <Panel
          className="info-popup"
          pose={showInfoModal ? 'show' : 'hide'}
        >
          <MenuPanel
            className="info-popup-menu-wrapper"
            pose={showInfoModal ? 'show' : 'hide'}
          >
            <MenuButton
              className={`menu-btn appmode-menu-btn ${activeTab === 0 ? 'active' : ''}`}
              onClick={this.openAppModePanel}
              type="button"
              pose={showInfoModal ? 'show' : 'hide'}
            />
            <MenuButton
              className={`menu-btn archive-menu-btn ${activeTab === 1 ? 'active' : ''}`}
              onClick={this.openArchivePanel}
              type="button"
              pose={showInfoModal ? 'show' : 'hide'}
            />
            <MenuButton
              className={`menu-btn shortcut-menu-btn ${activeTab === 2 ? 'active' : ''}`}
              onClick={this.openShortcutPanel}
              type="button"
              pose={showInfoModal ? 'show' : 'hide'}
            />
            <MenuButton
              className={`menu-btn settings-menu-btn ${activeTab === 3 ? 'active' : ''}`}
              onClick={this.openSettingsPanel}
              type="button"
              pose={showInfoModal ? 'show' : 'hide'}
            />
            <MenuButton
              className={`menu-btn contact-menu-btn ${activeTab === 4 ? 'active' : ''}`}
              onClick={this.openSuggestionsPanel}
              type="button"
              pose={showInfoModal ? 'show' : 'hide'}
            />
          </MenuPanel>
          <div className="info-popup-content-wrapper">
            {activeTab === 0 && (
              <AppModePanel />
            )}
            {activeTab === 1 && (
              <ArchivePanel />
            )}
            {activeTab === 2 && (
              <ShortcutPanel />
            )}
            {activeTab === 3 && (
              <SettingsPanel />
            )}
            {activeTab === 4 && (
              <SuggestionsPanel />
            )}
          </div>
        </Panel>
      </Fragment>
    );
  }
}

InfoModal.propTypes = {
  toggleInfoModal: PropTypes.func.isRequired,
  showInfoModal: PropTypes.bool.isRequired,
  panelToShow: PropTypes.number.isRequired,
};

const mapStateToProps = ({ AppSettings }) => ({
  isInfoModalHidden: AppSettings.isInfoModalHidden,
  panelToShow: AppSettings.panelToShow,
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    toggleInfoModal: toggleInfoModalAction,
  }, dispatch)
);
export default connect(mapStateToProps, mapDispatchToProps)(InfoModal);
