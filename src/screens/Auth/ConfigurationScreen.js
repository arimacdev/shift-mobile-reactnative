import React, {Component} from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Platform,
  AppState,
  Image,
  TextInput,
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
import icons from '../../assest/icons/icons';

class ConfigurationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forceUpdate: false,
      details: [],
      dataLoading: false,
      appState: AppState.currentState,
      url: '',
      error: false,
    };
  }

  async initialUserLogin() {
    this.setState({dataLoading: true});
    APIServices.getData()
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false, error: false});
          AsyncStorage.setItem('baseURL', this.state.url);
          NavigationService.navigate('LoginScreen');
        } else {
          this.setState({dataLoading: false, error: true});
        }
      })
      .catch(err => {
        this.setState({dataLoading: false, error: true});
      });
  }

  onUrlChange(text) {
    this.setState({url: text});
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
          <Text style={styles.textTitle}>{strings.config.configMainTitle}</Text>
          <Text style={styles.textSubTitle}>
            {strings.config.configSubTitle}
          </Text>
          <View style={styles.addNewFieldView}>
            <TextInput
              style={styles.textInput}
              placeholder={'Eg. project.arimac.digital'}
              value={this.state.url}
              onChangeText={url => this.onUrlChange()(url)}
              // onSubmitEditing={() =>
              //   this.onNewTasksNameSubmit(this.state.tasksName)
              // }
            />
          </View>
          {this.state.error ? (
            <Text style={styles.textError}>{strings.config.configError}</Text>
          ) : null}
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.textBottomTitle}>
            {strings.config.configBottomText}
          </Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => this.initialUserLogin()}>
            <Text style={styles.textLogin}>{strings.config.configButton}</Text>
          </TouchableOpacity>
          <Text style={styles.copyRights}>{strings.config.copyRights}</Text>
        </View>
        {this.state.dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    // width: '100%',
    // height: '100%',
    alignItems: 'center',
    // justifyContent: 'center',
    flex: 1,
    backgroundColor: colors.white,
  },
  imageContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '40rem',
  },
  textTitle: {
    fontSize: '14rem',
    color: colors.loginBlue,
    textAlign: 'center',
    fontFamily: 'CircularStd-Black',
    marginHorizontal: '30rem',
    marginTop: '20rem',
  },
  textSubTitle: {
    marginTop: '10rem',
    fontSize: '13rem',
    color: colors.gray,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
    marginHorizontal: '30rem',
  },
  textError: {
    marginTop: '5rem',
    fontSize: '13rem',
    color: colors.lightRed,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
    marginHorizontal: '30rem',
  },
  textBottomTitle: {
    fontSize: '13rem',
    color: colors.gray,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
    marginHorizontal: '30rem',
    lineHeight: '17rem',
  },
  userIcon: {
    width: '20rem',
    height: '20rem',
  },
  loginButton: {
    backgroundColor: colors.loginButton,
    borderRadius: '5rem',
    marginTop: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '40rem',
    marginHorizontal: '90rem',
  },
  textLogin: {
    fontSize: '14rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
    // fontWeight: 'bold',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: '5rem',
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
  addNewFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '20rem',
    marginBottom: '10rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '15rem',
    height: '45rem',
    marginHorizontal: '20rem',
  },
  textInput: {
    fontSize: '11rem',
    color: colors.lightgray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd',
    textAlign: 'left',
    marginLeft: '5rem',
    width: '95%',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(ConfigurationScreen);
