import React from 'react';


class ArchiveButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false,
    };

    this.archiveTask = this.archiveTask.bind(this);
  }

  componentDidUpdate() {
    if (this.state.clicked) {
      this.props.archiveTask();
    }
  }

  archiveTask(e) {
    e.stopPropagation();
    this.setState({
      clicked: true,
    });
  }

  render() {
    return (
      <button
        type="button"
        className="card-archive-button"
        onClick={this.archiveTask}
        disabled={this.state.clicked}
      />
    );
  }
}

export default ArchiveButton;
