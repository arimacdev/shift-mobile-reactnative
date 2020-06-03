import React, {Component} from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../redux/actions';
import colors from '../config/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Modal from 'react-native-modal';
import icons from '../assest/icons/icons';

class ForceUpdateModal extends Component {
  constructor(props) {
    super(props);
    this.state = {showForceUpdateModal: false};
  }

  componentDidMount() {
    if (this.props.showForceUpdateModal) {
      this.setState({showForceUpdateModal: true});
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.showForceUpdateModal !== this.props.showForceUpdateModal &&
      this.props.showForceUpdateModal
    ) {
      this.setState({showForceUpdateModal: true});
    }
  }

  onCloseTaskModal() {
    this.setState({showForceUpdateModal: false});
  }

  onUpdatePress() {
    let link = '';
    if (Platform.OS == 'android') {
      link = 'market://details?id=com.arimacpmtool';
    } else {
      link =
        'itms-apps://itunes.apple.com/us/app/apple-store/arimacpmtool?mt=8';
    }
    Linking.canOpenURL(link).then(
      supported => {
        supported && Linking.openURL(link);
      },
      err => console.log(err),
    );
    // this.onCloseTaskModal();
  }

  onCanclePress() {
    this.props.checkUserStatus();
    this.onCloseTaskModal();
  }

  render() {
    return (
      <Modal
        isVisible={this.state.showForceUpdateModal}
        style={styles.modalStyle}>
        <View style={styles.modalMainView}>
          <View style={styles.modalHeaderView}>
            <View style={styles.iconBorderStyle}>
              <Image
                style={styles.iconStyle}
                source={icons.appIcon}
                resizeMode="contain"
              />
            </View>
            <View>
              <Text style={styles.modalHeadderText}>
                {this.props.details.isForceUpdate == 1
                  ? 'Force Update'
                  : 'Update'}{' '}
                - Arimac PM tool
              </Text>
              <Text style={styles.currentVersion}>
                Current version : {this.props.details.currentVersion}
              </Text>
              <Text style={styles.latestVersion}>
                Latest version : {this.props.details.latestVersion}
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.textDescription}>
              Your app needs to update. Please press the update button and use
              the google play to update the app
            </Text>
          </View>
          <View style={styles.ButtonViewStyle}>
            <TouchableOpacity
              style={[styles.updateStyle]}
              onPress={() => this.onUpdatePress()}>
              <Text style={styles.updateTextStyle}>Update</Text>
            </TouchableOpacity>
            {this.props.details.isForceUpdate == 0 && (
              <TouchableOpacity
                style={styles.cancelStyle}
                onPress={() => this.onCanclePress()}>
                <Text style={styles.cancelTextStyle}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
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
  modalMainView: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
  },
  modalHeaderView: {
    flexDirection: 'row',
    marginHorizontal: '20rem',
    marginVertical: '20rem',
    // alignItems: 'center',
  },
  modalHeadderText: {
    fontSize: '16rem',
    fontFamily: 'CircularStd-Medium',
    marginHorizontal: '20rem',
    fontWeight: 'bold',
  },
  currentVersion: {
    marginTop: '10rem',
    fontSize: '12rem',
    fontFamily: 'CircularStd-Medium',
    marginLeft: '20rem',
    color: colors.gray,
  },
  latestVersion: {
    fontSize: '12rem',
    fontFamily: 'CircularStd-Medium',
    marginLeft: '20rem',
    color: colors.gray,
  },
  textDescription: {
    marginTop: '10rem',
    marginBottom: '20rem',
    fontSize: '12rem',
    fontFamily: 'CircularStd-Medium',
    marginHorizontal: '20rem',
    color: colors.black,
  },
  ButtonViewStyle: {
    flexDirection: 'row',
    marginTop: '5rem',
    marginBottom: '20rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '20rem',
  },
  updateStyle: {
    flex: 1,
    height: '45rem',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
  },
  updateTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
  },
  cancelStyle: {
    flex: 1,
    height: '45rem',
    marginLeft: '10rem',
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
  iconBorderStyle: {
    borderRadius: '10rem',
    borderColor: colors.gray,
    borderWidth: '0.5rem',
  },
  iconStyle: {
    width: '60rem',
    height: '60rem',
    borderRadius: '10rem',
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(ForceUpdateModal);
