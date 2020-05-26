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
import AndroidOpenSettings from 'react-native-android-open-settings'

class NoInternetModal extends Component {
  constructor(props) {
    super(props);
    this.state = {showModal: false};
  }

  componentDidMount() {
    if (this.props.showModal) {
      this.setState({showModal: true});
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.showModal !== this.props.showModal &&
      this.props.showModal
    ) {
      this.setState({showModal: true});
    }
  }

  onCloseTaskModal() {
    this.setState({showModal: false});
  }

  onSettingsPress() {
    if (Platform.OS == 'android') {
        AndroidOpenSettings.generalSettings()
      } else {
        Linking.openURL('app-settings:');
      }  
  }

  render() {
    return (
      <Modal
        isVisible={this.state.showModal}
        style={styles.modalStyle}>
        <View style={styles.modalMainView}>
          <View style={styles.modalHeaderView}>
            <Image
              style={styles.iconStyle}
              source={icons.appIcon}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.modalHeadderText}>No Internet</Text>
            </View>
          </View>
          <View>
            <Text style={styles.textDescription}>
            Please turn on the internet connection
            </Text>
          </View>
          <View style={styles.ButtonViewStyle}>
            <TouchableOpacity
              style={[styles.updateStyle]}
              onPress={() => this.onSettingsPress()}>
              <Text style={styles.updateTextStyle}>Settings</Text>
            </TouchableOpacity>
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
    fontSize: '20rem',
    fontFamily: 'CircularStd-Medium',
    marginLeft: '20rem',
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
    fontSize: '16rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.black,
    textAlign: 'center', 
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
)(NoInternetModal);
