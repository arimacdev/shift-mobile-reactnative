import React, {Component} from 'react';
import {Dimensions, View, Text, TouchableOpacity, Platform} from 'react-native';
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

class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forceUpdate: false,
      details: [],
      dataLoading: false,
    };
  }

  componentDidMount() {
    this.getMobileVersionStatus();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  getMobileVersionStatus() {
    let platform = Platform.OS;
    let version = DeviceInfo.getBuildNumber();
    this.setState({dataLoading: true});
    APIServices.getMobileVersionStatusData(platform, version)
      .then(response => {
        if (
          !response.force_update &&
          response.latest_version == response.current_version
        ) {
          this.setState({
            forceUpdate: true,
            details: response.data,
            dataLoading: false,
          });
        } else {
          this.checkUserStatus();
          this.setState({dataLoading: false});
        }
      })
      .catch(err => {
        this.setState({dataLoading: false});
      });
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
      const result = await authorize(config);
      console.log('result.accessToken', result.accessToken);
      AsyncStorage.setItem('accessToken', result.accessToken);
      AsyncStorage.setItem('refreshToken', result.refreshToken);
      AsyncStorage.setItem(
        'accessTokenExpirationDate',
        result.accessTokenExpirationDate,
      );
      let decoded = jwtDecode(result.accessToken);
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
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>{strings.login.loginMainTitle}</Text>
          <Text style={styles.textSubTitle}>
            {strings.login.loginSubMainTitle}
          </Text>
        </View>
        <View>
          <View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => this.initialUserLogin()}>
              <Text style={styles.textLogin}>{strings.login.loginButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ForceUpdateModal
          showForceUpdateModal={this.state.forceUpdate}
          details={this.state.details}
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
  },
  logoContainer: {
    width: '276rem',
    height: '135rem',
    borderRadius: '13rem',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '163rem',
  },
  logo: {
    width: '98.2rem',
    height: '57.8rem',
  },
  textTitle: {
    fontSize: '14rem',
    color: colors.loginBlue,
    textAlign: 'center',
    fontFamily: 'CircularStd-Black',
  },
  textSubTitle: {
    fontSize: '14rem',
    color: colors.loginGray,
    textAlign: 'center',
    lineHeight: '17rem',
    marginTop: '10rem',
    fontFamily: 'CircularStd-Black',
    marginHorizontal: '50rem',
    marginBottom: '10rem',
  },
  textInputView: {
    backgroundColor: colors.lighterGray,
    borderRadius: 5,
    width: '330rem',
    marginTop: '16rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Book',
    textAlign: 'left',
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
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(SplashScreen);
