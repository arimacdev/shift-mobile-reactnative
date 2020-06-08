import React, {Component} from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Platform,
  AppState,
  Image,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../redux/actions';
import colors from '../../config/colors';
import strings from '../../config/strings';
import {authorize} from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import NavigationService from '../../services/NavigationService';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import jwtDecode from 'jwt-decode';
import APIServices from '../../services/APIServices';
import ForceUpdateModal from '../../components/ForceUpdateModal';
import DeviceInfo from 'react-native-device-info';
import Loader from '../../components/Loader';
import icons from '../../asserts/icons/icons';
import FadeIn from 'react-native-fade-in-image';

class LoginScreen extends Component {
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
    // if (Platform.OS == 'ios') {
    this.getMobileVersionStatus();
    // }
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
      let workSpace = await AsyncStorage.getItem('workSpace');
      let result = await APIServices.getOrganizationData(workSpace, version);
      if (result.status == 200) {
        let response = result.data;
        this.baseUrl = response.workspaceUrl;
        this.issuer = response.idpEndpoints.issuser;
        this.authorizationEndpoint = response.idpEndpoints.authorization;
        this.tokenEndpoint = response.idpEndpoints.token;

        this.config = {
          issuer: this.issuer,
          serviceConfiguration: {
            authorizationEndpoint: this.authorizationEndpoint,
            tokenEndpoint: this.tokenEndpoint,
          },
          clientId: 'pmtool-frontend',
          redirectUrl: 'com.arimacpmtool:/oauthredirect',
          scopes: ['openid', 'roles', 'profile'],
          dangerouslyAllowInsecureHttpRequests: true,
        };
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
    }
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
      const result = await authorize(this.config);
      AsyncStorage.setItem('baseURL', this.baseUrl);
      AsyncStorage.setItem('issuer', this.issuer);
      AsyncStorage.setItem('authorizationEndpoint', this.authorizationEndpoint);
      AsyncStorage.setItem('tokenEndpoint', this.tokenEndpoint);
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
    let details = this.state.details;
    return (
      <View style={styles.container}>
        {/* <ScrollView style={styles.container}> */}
          <View style={styles.imageContainer}>
            <Image
              style={styles.iconStyle}
              source={icons.appIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.imageContainer}>
            <Text style={styles.textTitle}>{strings.login.loginText}</Text>
            <View style={styles.companyImageContainer}>
              {details.organizationLogo ? (
                <FadeIn>
                  <Image
                    style={styles.compantIconStyle}
                    source={{uri: details.organizationLogo}}
                    resizeMode="contain"
                  />
                </FadeIn>
              ) : (
                <Image
                  style={styles.compantIconStyle}
                  source={icons.defaultOrganization}
                  resizeMode="contain"
                />
              )}
            </View>
            <Text style={styles.companyNameText}>
              {details.organizationName}
            </Text>
            <Text style={styles.companyNameSubText}>{details.company}</Text>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => this.initialUserLogin()}>
              <Text style={styles.textLogin}>{strings.login.loginButton}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity
              style={styles.goBackButton}
              onPress={() => this.props.navigation.goBack()}>
              <Text style={styles.textGoBack}>{strings.login.goBack}</Text>
            </TouchableOpacity>
            {/* <Text style={styles.copyRights}>{strings.login.copyRights}</Text> */}
          </View>
        {/* </ScrollView> */}
        <ForceUpdateModal
          showForceUpdateModal={this.state.forceUpdate}
          details={this.state.update}
          checkUserStatus={() => {}}
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
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '30rem',
  },
  companyImageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.colorSolitude,
    borderWidth: '1rem',
    paddingHorizontal: '25rem',
    paddingVertical: '20rem',
    marginTop: '5rem',
    marginBottom: '10rem',
  },
  textTitle: {
    fontSize: '14rem',
    color: colors.loginBlue,
    textAlign: 'center',
    fontFamily: 'CircularStd-Black',
    marginHorizontal: '30rem',
  },
  userIcon: {
    width: '20rem',
    height: '20rem',
  },
  loginButton: {
    backgroundColor: colors.loginButton,
    borderRadius: '5rem',
    width: '210rem',
    marginTop: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '40rem',
    marginHorizontal: '20rem',
  },
  textLogin: {
    fontSize: '14rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Bold',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginTop: '10rem',
    marginBottom:'25rem'
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
  compantIconStyle: {
    width: '100rem',
    height: '100rem',
  },
  companyNameText: {
    fontSize: '15rem',
    color: colors.colorShuttleGrey,
    textAlign: 'center',
    fontFamily: 'CircularStd-Bold',
    marginHorizontal: '50rem',
    marginBottom: '3rem',
  },
  companyNameSubText: {
    fontSize: '11rem',
    color: colors.gray,
    textAlign: 'center',
    fontFamily: 'CircularStd-Book',
    marginHorizontal: '50rem',
    marginBottom: '10rem',
  },
  goBackButton: {
    marginTop: '20rem',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '30rem',
    marginHorizontal: '130rem',
  },
  textGoBack: {
    fontSize: '14rem',
    color: colors.colorMidnightExpress,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Book',
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(LoginScreen);
