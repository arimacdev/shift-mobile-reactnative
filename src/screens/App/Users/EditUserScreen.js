import React, {Component} from 'react';
import {View,ScrollView, Text, Dimensions, TextInput,TouchableOpacity,Image} from 'react-native';
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
import APIServices from '../../../services/APIServices';

class EditUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID : '',
      firstName : '',
      lastName : '',
      userName : '',
      email : '',
      password : '',
      confirmPassword : '',
      showAlert : false,
      alertTitle : '',
      alertMsg : '',
      dataLoading : false
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.editUserError !== this.props.editUserError
        && this.props.editUserError && this.props.editUserErrorMessage == '') {
          this.showAlert("","Error While User Update");
    }

    if (prevProps.editUserError !== this.props.editUserError
        && this.props.editUserError && this.props.editUserErrorMessage != '') {
          this.showAlert("",this.props.editUserErrorMessage);
    }


    if (prevProps.editUserSuccess !== this.props.editUserSuccess
        && this.props.editUserSuccess) {
          this.showAlert("","User updated successfully");
    }
}

  componentDidMount() {
    const {navigation: {state: {params}}} = this.props;
    let userItem = params.userItem
    let userID = userItem.userId;
    this.fetchUserData(userID);
  }

  async fetchUserData (userID) {
    this.setState({dataLoading:true});
    userData = await APIServices.getUserData(userID);
    if(userData.message == 'success'){
        this.setState({
            userID : userData.data.userId,
            firstName : userData.data.firstName,
            lastName : userData.data.lastName,
            userName : userData.data.userName,
            email : userData.data.email,
            dataLoading : false,
        });
    }else{
        this.setState({dataLoading:false});
    }
  }

  saveUser() {
    let userID = this.state.userID;
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let userName = this.state.userName;
    let email = this.state.email;
    let password = this.state.password;
    let confirmPassword = this.state.confirmPassword;

    if(this.validateUser(firstName,lastName,userName,email,password,confirmPassword)){
      this.props.editUser(firstName,lastName,userName,email,password,confirmPassword,userID)
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
    let editUserLoading = this.props.editUserLoading;
    let dataLoading = this.state.dataLoading;

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
            editable={false}
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
        <TouchableOpacity onPress={() => this.saveUser()}>
          <View style={styles.button}>
            <Image
              style={[styles.bottomBarIcon, {marginRight: 15, marginLeft: 10}]}
              source={icons.userWhite}
              resizeMode={'center'}
            />
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </View>

            <Image
              style={[styles.addIcon, {marginRight: 10}]}
              source={icons.add}
              resizeMode={'center'}
            />
          </View>
        </TouchableOpacity>
      

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

        {editUserLoading && <Loader/>}
        {dataLoading && <Loader/>}
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
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    borderRadius: 5,
    marginTop: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonText: {
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'Circular Std Medium',
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
});

const mapStateToProps = state => {
  return {
    editUserLoading: state.users.editUserLoading,
    editUserError : state.users.editUserError,
    editUserErrorMessage : state.users.editUserErrorMessage,
    editUserSuccess : state.users.editUserSuccess,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(EditUserScreen);
