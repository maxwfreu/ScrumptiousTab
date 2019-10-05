import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../styles/InfoModal.scss';

class BookmarkBar extends React.Component {
  static handleAppsClick(e) {
    e.preventDefault();
    if (!chrome || !chrome.tabs) return;
    chrome.tabs.update({
      url: 'chrome://apps',
    });
  }

  constructor(props) {
    super(props);

    const bookmarkLength = window.localStorage.getItem('scrumptious-bkm-length');
    const bookmarkArr = [];
    for (let i = 0; i < bookmarkLength; i += 1) {
      const bookmark = {
        title: window.localStorage.getItem(`scrumptious-bkm-title-${i + 1}`),
        url: window.localStorage.getItem(`scrumptious-bkm-url-${i + 1}`),
      };
      bookmarkArr.push(bookmark);
    }

    this.state = {
      isOverflowHidden: true,
      bookmarkArr,
    };

    this.attemps = 0;

    this.toggleOverflow = this.toggleOverflow.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.setDropDownRef = this.setDropDownRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  /*
    Attach mouse down click to dismiss panel
  */
  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentDidUpdate() {
    const { isBookMarksVisible } = this.props;
    const { bookmarkArr } = this.state;
    const that = this;
    if ((!bookmarkArr || !bookmarkArr.length) && isBookMarksVisible) {
      const interval = setInterval(() => {
        that.attempts += 1;
        const bookmarkLength = window.localStorage.getItem('scrumptious-bkm-length');
        if (bookmarkLength === 0) return;
        if (that.attempts >= 10) {
          clearInterval(interval);
          return;
        }
        const newBookMarkArr = [];
        for (let i = 0; i < bookmarkLength; i += 1) {
          const bookmark = {
            title: window.localStorage.getItem(`scrumptious-bkm-title-${i + 1}`),
            url: window.localStorage.getItem(`scrumptious-bkm-url-${i + 1}`),
          };
          newBookMarkArr.push(bookmark);
        }
        that.setState({
          bookmarkArr: newBookMarkArr,
        });
        clearInterval(interval);
      }, 150);
    }
  }

  /*
    Remove mousedown
  */
  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  /*
    Set ref for bookmark bar
  */
  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  /*
    Set ref for dropdown
  */
  setDropDownRef(node) {
    this.dropdownRef = node;
  }

  /*
    Handels closing dropdown
  */
  handleClickOutside(e) {
    const { isOverflowHidden } = this.state;
    if (isOverflowHidden) return;
    const containsWrapper = this.wrapperRef.contains(e.target);
    const containsButton = this.dropdownRef.contains(e.target);
    if (containsButton) return;
    if (!containsWrapper) {
      this.setState({
        isOverflowHidden: true,
      });
    }
  }

  toggleOverflow() {
    const { isOverflowHidden } = this.state;
    this.setState({
      isOverflowHidden: !isOverflowHidden,
    });
  }

  render() {
    const { isOverflowHidden, bookmarkArr } = this.state;
    const { isBookMarksVisible } = this.props;
    if (!isBookMarksVisible) return null;

    return (
      <Fragment>
        <div className="bookmark-wrapper" ref={this.setWrapperRef}>
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              position: 'relative',
              overflow: 'hidden',
              marginRight: '42px',
              flexWrap: 'wrap',
              paddingTop: '2px',
            }}
          >
            {bookmarkArr && (
              <Fragment>
                <a id="chromeAppLink" onClick={BookmarkBar.handleAppsClick}>
                  <img src="chrome://favicon/size/16@2x/chrome://apps" alt="Apps" />
                  <span>
                    Apps
                  </span>
                </a>
                {bookmarkArr.map(item => (
                  <a href={item.url} key={item.url}>
                    <img src={`chrome://favicon/size/16@2x/${item.url}`} alt={item.title} />
                    <span>
                      {item.title}
                    </span>
                  </a>
                ))}
              </Fragment>
            )}
          </div>
          <button className="dropdown-btn" onClick={this.toggleOverflow} type="button">
            &laquo;
          </button>
        </div>
        {!isOverflowHidden && (
          <div className="overflow-area" ref={this.setDropDownRef}>
            {bookmarkArr.map(item => (
              <a href={item.url} key={`overflowed-${item.url}`}>
                <img src={`chrome://favicon/size/16@2x/${item.url}`} alt={item.title} />
                <span>
                  {item.title}
                </span>
              </a>
            ))}
          </div>
        )}
      </Fragment>
    );
  }
}

BookmarkBar.propTypes = {
  isBookMarksVisible: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ AppSettings }) => ({
  isBookMarksVisible: AppSettings.isBookMarksVisible,
});

export default connect(mapStateToProps)(BookmarkBar);
