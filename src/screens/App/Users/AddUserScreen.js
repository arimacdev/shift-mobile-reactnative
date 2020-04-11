import React, {Component} from 'react';
import {View,ScrollView, Text, Dimensions, TextInput,Button} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import FadeIn from 'react-native-fade-in-image';
import Loader from '../../../components/Loader';
import Header from '../../../components/Header';
import _ from 'lodash';
import AwesomeAlert from 'react-native-awesome-alerts';

class AddUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName : '',
      lastName : '',
      userName : '',
      email : '',
      password : '',
      confirmPassword : '',
      showAlert : false,
      alertTitle : '',
      alertMsg : '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.addUserError !== this.props.addUserError
        && this.props.addUserError && this.props.addUserErrorMessage == '') {
          this.showAlert("","Error While User Creation");
    }

    if (prevProps.addUserError !== this.props.addUserError
        && this.props.addUserError && this.props.addUserErrorMessage != '') {
          this.showAlert("",this.props.addUserErrorMessage);
    }


    if (prevProps.addUserSuccess !== this.props.addUserSuccess
        && this.props.addUserSuccess) {
          this.showAlert("","User Created");
          this.resetState();
    }
}

  componentDidMount() {
  }

  resetState() {
    this.setState({
      firstName : '',
      lastName : '',
      userName : '',
      email : '',
      password : '',
      confirmPassword : '',
    })
  }

  saveUser() {
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let userName = this.state.userName;
    let email = this.state.email;
    let password = this.state.password;
    let confirmPassword = this.state.confirmPassword;

    if(this.validateUser(firstName,lastName,userName,email,password,confirmPassword)){
      this.props.addUser(firstName,lastName,userName,email,password,confirmPassword)
    }
  }

  validateUser(firstName,lastName,userName,email,password,confirmPassword) {
    if (!firstName && _.isEmpty(firstName)) {
      this.showAlert("","Please Enter the First Name");
      return false;
    }
    if (!lastName && _.isEmpty(lastName)) {
      this.showAlert("","Please Enter the Last Name");
        return false;
    }
    if (!userName && _.isEmpty(userName)) {
      this.showAlert("","Please Enter the User Name");
      return false;
  }  
    if (!email && _.isEmpty(email)) {
      this.showAlert("","Please Enter the Email");
      return false;
    } else {
      const validMail = this.validateEmail(email);
      if (!validMail) {
        this.showAlert("","Please a valid Email");
        return false;
      }
    }
    if (!password && _.isEmpty(password)) {
        this.showAlert("","Please Enter the Password");
        return false;
    }else {
      const validPassword = this.validatePassword(password);
      if (!validPassword) {
        this.showAlert("","Please Enter a valid Password");
        return false;
      }
    } 
    if (!confirmPassword && _.isEmpty(confirmPassword)) {
      this.showAlert("","Please Re-Enter the Password");
      return false;
    }else {
      if (password !== confirmPassword) {
        this.showAlert("","Please match the Confirm Password");
        return false;
      }
    } 
    return true;
  }

  validatePassword(employeePassword) {
    if(employeePassword.length > 1){
      return true
    }
    return false;
  }

  validateEmail(email) {
    let re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+[^<>()\.,;:\s@\"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  }

  hideAlert (){
    this.setState({
      showAlert : false,
      alertTitle : '',
      alertMsg : '',
    })
  }

  showAlert(title,msg){
    this.setState({
      showAlert : true,
      alertTitle : title,
      alertMsg : msg,
    })
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

    return (
      <ScrollView style={{marginBottom: 5}}>
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
        <Button
          onPress={() => this.saveUser()}
          title="Save"
          color="#841584"
        />

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
        />

      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
     backgroundColor: colors.pageBackGroundColor,
  },
  userFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
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
    fontFamily: 'Circular Std Medium',
    textAlign: 'left',
    width : '100%'
  },
});

const mapStateToProps = state => {
  return {
    addUserLoading: state.users.addUserLoading,
    addUserError : state.users.addUserError,
    addUserErrorMessage : state.users.addUserErrorMessage,
    addUserSuccess : state.users.addUserSuccess,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(AddUserScreen);
