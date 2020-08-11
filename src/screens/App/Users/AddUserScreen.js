import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Loader from '../../../components/Loader';
import _ from 'lodash';
import AwesomeAlert from 'react-native-awesome-alerts';
import MessageShowModal from '../../../components/MessageShowModal';
const {height} = Dimensions.get('window');

let successDetails = {
  icon: icons.userGreen,
  type: 'success',
  title: 'Success',
  description: 'A new user has been created successfully',
  buttons: {},
};
class AddUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      showMessageModal: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.addUserError !== this.props.addUserError &&
      this.props.addUserError &&
      this.props.addUserErrorMessage == ''
    ) {
      this.showAlert('', 'Error While User Creation');
    }

    if (
      prevProps.addUserError !== this.props.addUserError &&
      this.props.addUserError &&
      this.props.addUserErrorMessage != ''
    ) {
      this.showAlert('', this.props.addUserErrorMessage);
    }

    if (
      prevProps.addUserSuccess !== this.props.addUserSuccess &&
      this.props.addUserSuccess
    ) {
      // this.showAlert('', 'User created successfully');
      this.setState({showMessageModal: true});
      this.resetState();
    }
  }

  componentDidMount() {}

  resetState() {
    this.setState({
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
  }

  onPressCancel() {
    this.setState({showMessageModal: false});
  }

  saveUser() {
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let userName = this.state.userName;
    let email = this.state.email;
    let password = this.state.password;
    let confirmPassword = this.state.confirmPassword;

    if (
      this.validateUser(
        firstName,
        lastName,
        userName,
        email,
        password,
        confirmPassword,
      )
    ) {
      this.props.addUser(
        firstName,
        lastName,
        userName,
        email,
        password,
        confirmPassword,
      );
    }
  }

  validateUser(
    firstName,
    lastName,
    userName,
    email,
    password,
    confirmPassword,
  ) {
    if (!firstName && _.isEmpty(firstName)) {
      this.showAlert('', 'Please enter the first name');
      return false;
    }
    if (!lastName && _.isEmpty(lastName)) {
      this.showAlert('', 'Please enter the last name');
      return false;
    }
    if (!userName && _.isEmpty(userName)) {
      this.showAlert('', 'Please enter the user name');
      return false;
    }
    if (!email && _.isEmpty(email)) {
      this.showAlert('', 'Please enter the email');
      return false;
    } else {
      const validMail = this.validateEmail(email);
      if (!validMail) {
        this.showAlert('', 'Email address format should be validated');
        return false;
      }
    }
    if (!password && _.isEmpty(password)) {
      this.showAlert('', 'Please enter the password');
      return false;
    } else {
      const validPassword = this.validatePassword(password);
      if (!validPassword) {
        this.showAlert('', 'Please Enter a valid Password');
        return false;
      }
    }
    if (!confirmPassword && _.isEmpty(confirmPassword)) {
      this.showAlert('', 'Please confirm the password');
      return false;
    } else {
      if (password !== confirmPassword) {
        this.showAlert('', 'Entered passwords dosent match');
        return false;
      }
    }
    return true;
  }

  validatePassword(employeePassword) {
    if (employeePassword.length > 1) {
      return true;
    }
    return false;
  }

  validateEmail(email) {
    let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }

  hideAlert() {
    this.setState({
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
    });
  }

  showAlert(title, msg) {
    this.setState({
      showAlert: true,
      alertTitle: title,
      alertMsg: msg,
    });
  }

  render() {
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let userName = this.state.userName;
    let email = this.state.email;
    let password = this.state.password;
    let confirmPassword = this.state.confirmPassword;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let addUserLoading = this.props.addUserLoading;

    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <View style={[styles.userFieldView, {marginTop: 30}]}>
            <TextInput
              style={styles.textInput}
              placeholder={'First Name'}
              value={firstName}
              onChangeText={firstName => this.setState({firstName})}
            />
          </View>
          <View style={[styles.userFieldView, {marginTop: 5}]}>
            <TextInput
              style={styles.textInput}
              placeholder={'Last Name'}
              value={lastName}
              onChangeText={lastName => this.setState({lastName})}
            />
          </View>
          <View style={[styles.userFieldView, {marginTop: 5}]}>
            <TextInput
              style={styles.textInput}
              placeholder={'User Name'}
              value={userName}
              autoCapitalize="none"
              onChangeText={userName => this.setState({userName})}
            />
          </View>
          <View style={[styles.userFieldView, {marginTop: 5}]}>
            <TextInput
              style={styles.textInput}
              placeholder={'Email'}
              value={email}
              autoCapitalize="none"
              onChangeText={email => this.setState({email})}
            />
          </View>
          <View style={[styles.userFieldView, {marginTop: 5}]}>
            <TextInput
              style={styles.textInput}
              placeholder={'Password'}
              value={password}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={password => this.setState({password})}
            />
          </View>
          <View style={[styles.userFieldView, {marginTop: 5}]}>
            <TextInput
              style={styles.textInput}
              placeholder={'Confirm Password'}
              value={confirmPassword}
              autoCapitalize="none"
              secureTextEntry={true}
              onChangeText={confirmPassword => this.setState({confirmPassword})}
            />
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => this.saveUser()}>
            <View style={styles.button}>
              <Image
                style={[
                  styles.bottomBarIcon,
                  {marginRight: 15, marginLeft: 10},
                ]}
                source={icons.userWhite}
                resizeMode={'contain'}
              />
              <View style={{flex: 1}}>
                <Text style={styles.buttonText}>Add new User</Text>
              </View>

              <Image
                style={[styles.addIcon, {marginRight: 10}]}
                source={icons.add}
                resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>
        </View>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={alertTitle}
          message={alertMsg}
          closeOnTouchOutside={true}
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
        <MessageShowModal
          showMessageModal={this.state.showMessageModal}
          details={successDetails}
          onPress={() => {}}
          onPressCancel={() => this.onPressCancel(this)}
        />
        {addUserLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: height - 600,
    backgroundColor: colors.white,
  },
  userFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '0rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '60rem',
    marginHorizontal: '20rem',
  },
  textInput: {
    fontSize: '12rem',
    fontWeight: '400',
    color: colors.userAddText,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    marginTop: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonText: {
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    fontWeight: 'bold',
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: '15rem',
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
    addUserLoading: state.users.addUserLoading,
    addUserError: state.users.addUserError,
    addUserErrorMessage: state.users.addUserErrorMessage,
    addUserSuccess: state.users.addUserSuccess,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(AddUserScreen);
