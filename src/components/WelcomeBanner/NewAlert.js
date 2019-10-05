import React from 'react';
import PropTypes from 'prop-types';
import localforage from 'localforage';

/*
  Creating a new alert?

  Steps:
  1. Update render method to display new alert
  2. Increment localforage key (alert-{num})
  3. Uncomment componentDidMount
*/

const ALERT_KEY = 'alert-2-test';

class NewAlert extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      alertExists: false,
      showAlert: false,
    };

    this.toggleAlert = this.toggleAlert.bind(this);
    this.showInfoPane = this.showInfoPane.bind(this);
    this.fetchAlert = this.fetchAlert.bind(this);
  }

  // Uncomment to fetch alert
  // componentDidMount() {
  //   if (process.env.NODE_ENV !== 'test') {
  //     this.fetchAlert();
  //   }
  // }

  toggleAlert() {
    const { showAlert } = this.state;
    this.setState({
      showAlert: !showAlert,
    });
    localforage.setItem(ALERT_KEY, true);
  }

  showInfoPane(e) {
    const { showInfo } = this.props;
    e.stopPropagation();
    e.preventDefault();
    showInfo(3);
    this.setState({
      showAlert: false,
      alertExists: false,
    });
  }

  async fetchAlert() {
    const seenAlert = await localforage.getItem(ALERT_KEY);
    if (!seenAlert) {
      this.setState({
        alertExists: true,
      });
    }
  }

  render() {
    const { showAlert, alertExists } = this.state;
    if (!alertExists) return null;
    return (
      <React.Fragment>
        <button className={`new-alert ${showAlert ? 'open' : ''}`} onClick={this.toggleAlert} type="button" />
        {showAlert && (
          <div className="new-alert-details">
            <b>NEW</b>
            Sync your kanban board across computers!
            <button onClick={this.showInfoPane} type="button">Try it</button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

NewAlert.propTypes = {
  showInfo: PropTypes.func.isRequired,
};

export default NewAlert;
