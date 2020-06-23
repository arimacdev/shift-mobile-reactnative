import React, {Component} from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Platform,
  AppState,
  Image,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../redux/actions';
import colors from '../config/colors';
import strings from '../config/strings';
import {authorize} from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from '../services/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import jwtDecode from 'jwt-decode';
import APIServices from '../services/APIServices';
import ForceUpdateModal from '../components/ForceUpdateModal';
import DeviceInfo from 'react-native-device-info';
import Loader from '../components/Loader';
import icons from '../asserts/icons/icons';
import Utils from '../utils/Utils';

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forceUpdate: false,
      details: [],
      update: [],
      dataLoading: false,
      appState: AppState.currentState,
    };
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    if (Platform.OS == 'ios') {
      this.getMobileVersionStatus();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) ||
      nextAppState === 'active'
    ) {
      try {
        let baseURL = await AsyncStorage.getItem('baseURL');
        if (baseURL == null) {
          NavigationService.navigate('Auth');
        } else {
          this.getMobileVersionStatus();
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.setState({appState: nextAppState});
  };

  async getMobileVersionStatus() {
    let platform = Platform.OS;
    let version = DeviceInfo.getBuildNumber();
    this.setState({dataLoading: true});
    try {
      let workSpace = await AsyncStorage.getItem('workSpace');
      let result = await APIServices.getOrganizationData(workSpace, version);
      if (result.status == 200) {
        let response = result.data;
        this.baseUrl = result.workspaceUrl;
        if (
          platform == 'android' &&
          response.android &&
          response.android.latestVersion > response.android.currentVersion
        ) {
          this.setState({forceUpdate: true, update: response.android});
        } else if (
          platform == 'ios' &&
          response.ios &&
          response.ios.latestVersion > response.ios.currentVersion
        ) {
          this.setState({forceUpdate: true, update: response.ios});
        } else {
          this.setState({forceUpdate: false});
          this.checkUserStatus();
        }
        this.setState({
          dataLoading: false,
          details: response,
        });
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
      Utils.showAlert(true, '', 'Data loading error', this.props);
    }
  }

  async checkUserStatus() {
    AsyncStorage.getItem('userID').then(userID => {
      if (userID) {
        AsyncStorage.getItem('userType').then(userType => {
          if (userType) {
            this.fetchDataUserData(userID, userType);
            //NavigationService.navigate('App');
          }
        });
      }
    });
  }

  fetchDataUserData(userID, userType) {
    this.setState({dataLoading: true});
    APIServices.getUserData(userID)
      .then(responseUser => {
        this.setState({dataLoading: false});
        this.props.UserInfoSuccess(responseUser);
        this.props.UserType(userType);
        NavigationService.navigate('App');
      })
      .catch(err => {
        this.setState({dataLoading: false});
        Utils.showAlert(true, '', 'Data loading error', this.props);
        // NavigationService.navigate('LoginScreen');
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden />
        <View style={styles.imageContainer}>
          <Image
            style={styles.iconStyle}
            source={icons.appIcon}
            resizeMode="contain"
          />
        </View>
        <ForceUpdateModal
          showForceUpdateModal={this.state.forceUpdate}
          details={this.state.update}
          checkUserStatus={() => this.checkUserStatus(this)}
        />
        {/* {this.state.dataLoading && <Loader />} */}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: '14rem',
    color: colors.loginBlue,
    textAlign: 'center',
    fontFamily: 'CircularStd-Black',
    marginLeft: '30rem',
    marginRight: '30rem',
  },
  userIcon: {
    width: '20rem',
    height: '20rem',
  },
  loginButton: {
    backgroundColor: colors.loginButton,
    borderRadius: '5rem',
    width: '330rem',
    marginTop: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '50rem',
    marginHorizontal: '20rem',
  },
  textLogin: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: '15rem',
  },
  iconStyle: {
    width: '250rem',
    height: '250rem',
  },
  copyRights: {
    fontSize: '14rem',
    color: colors.loginGray,
    textAlign: 'center',
    lineHeight: '17rem',
    marginTop: '10rem',
    fontFamily: 'CircularStd-Black',
    marginHorizontal: '50rem',
    marginBottom: '10rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(SplashScreen);
