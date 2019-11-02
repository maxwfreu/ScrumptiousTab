import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import classnames from 'classnames';
import localforage from 'localforage';
import imageCompression from 'browser-image-compression';
import CloudImgDark from '../../images/sidebar/cloud-dark-2x.png';
import CloudImgLight from '../../images/sidebar/cloud-light-2x.png';
const MAX_FILE_SIZE = 3000000; // 3MB

class DragAndDrop extends React.PureComponent {
  static async compressImage(imageFile) {
    const originalFileSize = imageFile.size / 1024 / 1024;
    // dont bother compressing images less than 1MB
    if (originalFileSize < 1) return imageFile;
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };
    try {
      const compressedFile = await imageCompression(imageFile, options);
      const compressedFileSize = compressedFile.size / 1024 / 1024;
      return compressedFile;
    } catch (error) {
      return null;
    }
  }

  constructor(props) {
    super(props);
    this.state = {
      backgroundOne: '',
      backgroundTwo: '',
      animatingOne: false,
      animatingTwo: false,
      rejectOne: false,
      rejectTwo: false,
    };
    this.onDrop = this.onDrop.bind(this);
    this.onDropOne = this.onDropOne.bind(this);
    this.onDropTwo = this.onDropTwo.bind(this);
    this.deleteOne = this.deleteOne.bind(this);
    this.deleteTwo = this.deleteTwo.bind(this);
    this.getCustomBackgrounds = this.getCustomBackgrounds.bind(this);
    this.renderDropzone = this.renderDropzone.bind(this);
  }

  componentDidMount() {
    this.getCustomBackgrounds();
  }

  async onDrop(file, isBGOne) {
    const bucket = isBGOne ? 'photo-1' : 'photo-2';
    const compedFile = await DragAndDrop.compressImage(file);
    const image = await localforage.setItem(bucket, compedFile);
    if (!image) return;
    const blob = new Blob([image]);
    const bgURL = window.URL.createObjectURL(blob);
    if (isBGOne) {
      if (this.state.backgroundOne) return;
      this.setState({
        backgroundOne: bgURL,
        animatingOne: true,
      });
    } else {
      if (this.state.backgroundTwo) return;
      this.setState({
        backgroundTwo: bgURL,
        animatingTwo: true,
      });
    }
    const that = this;
    setTimeout(() => {
      if (isBGOne) {
        that.setState({
          animatingOne: false,
          animatingCloudOne: false,
        });
      } else {
        that.setState({
          animatingTwo: false,
          animatingCloudTwo: false,
        });
      }
    }, 1000);
    this.props.setBackgroundMode(isBGOne ? 9 : 10, true);
    if (process.env.DEMO_BUILD) {
      localforage.removeItem(bucket);
    }
  }

  onDropOne(acceptedFiles, rejectedFiles) {
    if (rejectedFiles && rejectedFiles.length !== 0) {
      this.setState({
        rejectOne: true,
      });
      return;
    }
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const that = this;
    const dropFunc = () => {
      setTimeout(() => {
        that.onDrop(acceptedFiles[0], true);
      }, 2500);
    };
    this.setState(
      {
        animatingCloudOne: true,
        rejectOne: false,
      },
      dropFunc,
    );
  }

  onDropTwo(acceptedFiles, rejectedFiles) {
    if (rejectedFiles && rejectedFiles.length !== 0) {
      this.setState({
        rejectTwo: true,
      });
      return;
    }
    if (!acceptedFiles || acceptedFiles.length === 0) return;
    const that = this;
    const dropFunc = () => {
      setTimeout(() => {
        that.onDrop(acceptedFiles[0], false);
      }, 2500);
    };
    this.setState(
      {
        animatingCloudTwo: true,
        rejectTwo: false,
      },
      dropFunc,
    );
  }

  async getCustomBackgrounds() {
    const imageOne = await localforage.getItem('photo-1');
    const imageTwo = await localforage.getItem('photo-2');

    let backgroundOne = null;
    let backgroundTwo = null;

    if (imageOne) {
      const blobOne = new Blob([imageOne]);
      backgroundOne = window.URL.createObjectURL(blobOne);
    }

    if (imageTwo) {
      const blobTwo = new Blob([imageTwo]);
      backgroundTwo = window.URL.createObjectURL(blobTwo);
    }

    this.setState({
      backgroundOne,
      backgroundTwo,
    });
  }

  async deleteOne(e) {
    e.preventDefault();
    e.stopPropagation();
    const { backgroundMode } = this.props;
    await localforage.removeItem('photo-1');
    if (backgroundMode === 9) {
      this.props.setBackgroundMode(0, false);
    }
    this.setState({
      backgroundOne: null,
    });
  }

  async deleteTwo(e) {
    e.preventDefault();
    e.stopPropagation();
    const { backgroundMode } = this.props;
    await localforage.removeItem('photo-2');
    if (backgroundMode === 10) {
      this.props.setBackgroundMode(0, false);
    }
    this.setState({
      backgroundTwo: null,
    });
  }

  updateBackgroundMode(backgroundMode) {
    this.props.setBackgroundMode(backgroundMode);
  }

  renderDropzone(onDrop, bgURL, bgId, animationState, deleteImage, isActiveBg, isAnimatingCloud, wasRejected, style={}) {
    return (
      <Dropzone
        accept="image/*"
        multiple={false}
        maxSize={MAX_FILE_SIZE}
        onDrop={onDrop}
      >
        {({
          getRootProps,
          getInputProps,
          isDragActive,
          isDragAccept,
          isDragReject,
          open,
        }) => {
          const classes = classnames(
            'user-upload',
            {
              'user-upload-will-accept': isDragAccept,
              'user-upload-active': isDragActive,
              'user-upload-reject': isDragReject,
              'active-bg': isActiveBg,
              'empty-bg': !bgURL,
              uploading: isAnimatingCloud,
            },
          );

          const animationClasses = classnames(
            'upload-bg',
            {
              animating: animationState,
            },
          );

          const cloudClasses = classnames(
            'upload-cloud',
            {
              uploading: isAnimatingCloud,
            },
          );
          let styles = {};
          if (bgURL) {
            styles = {
              backgroundImage: `url(${bgURL})`,
            };
          }
          return (
            <div
              {...getRootProps()}
              className={classes}
              {...getRootProps({
                onClick: (evt) => {
                  if (bgURL) {
                    evt.preventDefault();
                    this.props.setBackgroundMode(bgId, true);
                  }
                  evt.stopPropagation();
                },
              })}
              style={style}
            >
              <div
                className={animationClasses}
                style={styles}
              />
              {bgURL ? (
                <button type="button" aria-label="Delete Label" className="delete-button" onClick={deleteImage} />
              ) : (
                <React.Fragment>
                  <div className={cloudClasses}>
                    {this.props.appMode === 0 ? (
                      <img src={CloudImgLight} />
                    ) : (
                      <img src={CloudImgDark} />
                    )}
                    <div className="cloud-fill" />
                  </div>
                  <input {...getInputProps()} />
                  {wasRejected ? (
                    <div className="upload-desc rejected">
                      Oops! Images should be less than 3MB
                    </div>
                  ) : (
                    <div className="upload-desc">
                      Drag and drop a photo
                      <br />
                      to use as a background
                    </div>
                  )}
                  <button type="button" onClick={(e) => {e.stopPropagation();open()}} className="upload-button">
                    Upload
                  </button>
                  {isDragReject && <div>Unsupported file type...</div>}
                </React.Fragment>
              )}
            </div>
          );
        }}
      </Dropzone>
    );
  }

  render() {
    const {
      animatingOne,
      animatingTwo,
      backgroundOne,
      backgroundTwo,
      animatingCloudOne,
      animatingCloudTwo,
      rejectOne,
      rejectTwo,
    } = this.state;
    const { backgroundMode, appMode } = this.props;
    return (
      <div className={`user-upload-wrapper ${appMode !== 100 ? 'disabled' : ''}`}>
        {appMode !== 100 && (
          <div
            style={{
              position: 'absolute',
              height: '100%',
              width: '100%',
              zIndex: '3',
            }}
          />
        )}
        <div className="user-upload-inner-wrapper">
          {this.renderDropzone(
            this.onDropOne,
            backgroundOne,
            9,
            animatingOne,
            this.deleteOne,
            backgroundMode === 9,
            animatingCloudOne,
            rejectOne,
            {
              marginRight: '22px',
            },
          )}
          {this.renderDropzone(
            this.onDropTwo,
            backgroundTwo,
            10,
            animatingTwo,
            this.deleteTwo,
            backgroundMode === 10,
            animatingCloudTwo,
            rejectTwo,
          )}
        </div>
        Max 3MB per photo.
      </div>
    );
  }
}

DragAndDrop.propTypes = {
  appMode: PropTypes.number.isRequired,
  backgroundMode: PropTypes.number.isRequired,
  setBackgroundMode: PropTypes.func.isRequired,
};

export default DragAndDrop;
