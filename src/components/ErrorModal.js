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
import AwesomeAlert from 'react-native-awesome-alerts';

class ErrorModal extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  hideAlert() {
    let title = '';
    let msg = '';
    let config = {showAlert: false, alertTitle: title, alertMsg: msg};
    this.props.showMessagePopup(config);
  }

  render() {
    let errorModal = this.props.showMessageConfig.showAlert;
    let alertTitle = this.props.showMessageConfig.alertTitle;
    let alertMsg = this.props.showMessageConfig.alertMsg;
    return (
      <AwesomeAlert
        show={errorModal}
        showProgress={false}
        title={alertTitle}
        message={alertMsg}
        closeOnTouchOutside={false}
        closeOnHardwareBackPress={false}
        showCancelButton={false}
        showConfirmButton={true}
        cancelText=""
        confirmText="OK"
        confirmButtonColor={colors.primary}
        onConfirmPressed={() => {
          this.hideAlert();
        }}
        overlayStyle={{backgroundColor: colors.alertOverlayColor}}
        contentContainerStyle={styles.alertContainerStyle}
        confirmButtonStyle={styles.alertConfirmButtonStyle}
      />
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContainerStyle: {
    bottom: 0,
    width: '100%',
    maxWidth: '100%',
    position: 'absolute',
    borderRadius: 0,
    borderTopStartRadius: '5rem',
    borderTopEndRadius: '5rem',
  },
  alertConfirmButtonStyle: {
    width: '100rem',
    backgroundColor: colors.colorBittersweet,
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    showMessageConfig: state.showMessage.showMessageConfig,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(ErrorModal);
