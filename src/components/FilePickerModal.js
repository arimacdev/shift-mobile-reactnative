import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableOpacity, Image} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../redux/actions';
import colors from '../config/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Modal from 'react-native-modal';
import icons from '../asserts/icons/icons';

class FilePickerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {showFilePickerModal: false};
  }

  componentDidMount() {
    if (this.props.showFilePickerModal) {
      this.setState({showFilePickerModal: true});
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.showFilePickerModal !== this.props.showFilePickerModal &&
      this.props.showFilePickerModal
    ) {
      this.setState({showFilePickerModal: true});
    }
  }

  onCloseFilePickerModal() {
    this.setState({showFilePickerModal: false});
  }

  onCanclePress() {
    this.props.onPressCancel();
    this.onCloseFilePickerModal();
  }

  selectCamera() {
    this.props.selectCamera();
    this.onCloseFilePickerModal();
  }

  selectFiles() {
    this.props.selectFiles();
    this.onCloseFilePickerModal();
  }

  render() {
    return (
      <Modal
        // isVisible={true}
        isVisible={this.state.showFilePickerModal}
        style={styles.modalStyleFilePicker}
        onBackButtonPress={() => this.onCanclePress()}
        onBackdropPress={() => this.onCanclePress()}
        onRequestClose={() => this.onCanclePress()}
        coverScreen={false}
        backdropTransitionOutTiming={0}>
        <View style={styles.filePickerModalInnerStyle}>
          <Text style={styles.filePickerModalTitleStyle}>Add Files</Text>
          <Text style={styles.filePickerModalTextStyle}>
            Select the file source
          </Text>
          <View style={styles.filePickerButtonViewStyle}>
            <TouchableOpacity
              style={styles.cameraButtonStyle}
              onPress={() => this.selectCamera()}>
              <Text style={styles.positiveTextStyle}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.galleryButtonStyle}
              onPress={() => this.selectFiles()}>
              <Text style={styles.positiveTextStyle}>Files</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButtonStyle}
              onPress={() => this.onCanclePress()}>
              <Text style={styles.cancelTextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  modalStyleFilePicker: {
    bottom: Platform.OS == 'ios' ? '15%' : '0%',
    // justifyContent: 'flex-end',
    // margin: 0,
  },
  filePickerButtonViewStyle: {
    marginTop: '20rem',
    marginBottom: '10rem',
  },
  filePickerModalInnerStyle: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
    padding: '20rem',
  },
  filePickerModalTitleStyle: {
    fontSize: '20rem',
    marginBottom: '5rem',
  },
  filePickerModalTextStyle: {
    fontSize: '15rem',
  },
  cameraButtonStyle: {
    height: '45rem',
    backgroundColor: colors.lightGreen,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
    marginBottom: '10rem',
  },
  galleryButtonStyle: {
    height: '45rem',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
    marginBottom: '10rem',
  },
  cancelButtonStyle: {
    height: '45rem',
    backgroundColor: colors.colorCoralRed,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
  },
  ButtonViewStyle: {
    flexDirection: 'row',
    marginTop: '20rem',
    marginBottom: '10rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positiveStyle: {
    flex: 1,
    height: '45rem',
    marginLeft: '10rem',
    backgroundColor: colors.lightGreen,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
  },
  positiveTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
  },
  cancelStyle: {
    flex: 1,
    height: '45rem',
    backgroundColor: colors.lightRed,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
  },
  cancelTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(FilePickerModal);
