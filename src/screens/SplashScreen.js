import React, {Component} from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Platform,
  AppState,
  Image
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
import icons from '../assest/icons/icons';

const config = {
  issuer: 'https://pmtool.devops.arimac.xyz/auth',
  serviceConfiguration: {
    authorizationEndpoint:
      'https://pmtool.devops.arimac.xyz/auth/realms/pm-tool/protocol/openid-connect/auth',
    tokenEndpoint:
      'https://pmtool.devops.arimac.xyz/auth/realms/pm-tool/protocol/openid-connect/token',
  },
  clientId: 'pmtool-frontend',
  redirectUrl: 'io.identityserver.demo:/oauthredirect',
  scopes: ['openid', 'roles', 'profile'],
  dangerouslyAllowInsecureHttpRequests: true,
};

const configLive = {
  issuer: 'https://project.arimaclanka.com/auth/realms/pm-tool',
  serviceConfiguration: {
    authorizationEndpoint:
      'https://project.arimaclanka.com/auth/realms/pm-tool/protocol/openid-connect/auth',
    tokenEndpoint:
      'https://project.arimaclanka.com/auth/realms/pm-tool/protocol/openid-connect/token',
  },
  clientId: 'pmtool-frontend',
  redirectUrl: 'com.arimacpmtool:/oauthredirect',
  scopes: ['openid', 'roles', 'profile'],
  dangerouslyAllowInsecureHttpRequests: true,
};

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forceUpdate: false,
      details: [],
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

  _handleAppStateChange = nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) ||
      nextAppState === 'active'
    ) {
      this.getMobileVersionStatus();
    }
    this.setState({appState: nextAppState});
  };

  async getMobileVersionStatus() {
    let platform = Platform.OS;
    let version = DeviceInfo.getBuildNumber();
    this.setState({dataLoading: true});
    try {
      let result = await APIServices.getMobileVersionStatusData(
        platform,
        version,
      );
      if (result.message == 'success') {
        let response = result.data;
        if (response.latest_version > response.current_version) {
          this.setState({
            forceUpdate: true,
            details: response,
            dataLoading: false,
          });
        } else {
          this.setState({dataLoading: false, forceUpdate: false});
          this.checkUserStatus();
        }
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
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
      });
  }

  async initialUserLogin() {
    try {
      const result = await authorize(configLive);
      AsyncStorage.setItem('accessToken', result.accessToken);
      AsyncStorage.setItem('refreshToken', result.refreshToken);
      let decoded = jwtDecode(result.accessToken);
      let accessTokenExpirationDate = decoded.exp.toString();
      AsyncStorage.setItem(
        'accessTokenExpirationDate',
        accessTokenExpirationDate,
      );
      AsyncStorage.setItem('userID', decoded.userId);
      AsyncStorage.setItem('userLoggedIn', 'true');
      let userType = decoded.realm_access.roles[0]
        ? decoded.realm_access.roles[0]
        : '';
      AsyncStorage.setItem('userType', userType);
      this.fetchDataUserData(decoded.userId, userType);
      //NavigationService.navigate('App');
    } catch (error) {}
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
            <Image
                style={styles.iconStyle}
                source={icons.appIcon}
                resizeMode="contain"
              />
               <Text style={styles.textTitle}>{strings.login.loginMainTitle}</Text>
        </View>
        <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => this.initialUserLogin()}>
              <Text style={styles.textLogin}>{strings.login.loginButton}</Text>
            </TouchableOpacity>
            <Text style={styles.copyRights}>{strings.login.copyRights}</Text>
        </View>
        <ForceUpdateModal
          showForceUpdateModal={this.state.forceUpdate}
          details={this.state.details}
          checkUserStatus={() => this.checkUserStatus(this)}
        />
        {this.state.dataLoading && <Loader />}
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
    flex : 1,
    backgroundColor: colors.white,
  },
  imageContainer:{
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textTitle: {
    fontSize: '14rem',
    color: colors.loginBlue,
    textAlign: 'center',
    fontFamily: 'CircularStd-Black',
    marginLeft : '30rem',
    marginRight : '30rem'
  },
  userIcon: {
    width: '20rem',
    height: '20rem',
  },
  loginButton: {
    backgroundColor: colors.loginButton,
    borderRadius: 5,
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
    marginBottom: 15,
  },
  iconStyle: {
    width: '175rem',
    height: '175rem',
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