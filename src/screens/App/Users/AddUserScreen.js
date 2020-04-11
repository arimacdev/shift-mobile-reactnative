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

class AddUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName : '',
      lastName : '',
      userName : '',
      email : '',
      password : '',
      confirmPassword : ''
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    
  }

  componentDidMount() {
  }

  saveUser() {
    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let userName = this.state.userName;
    let email = this.state.email;
    let password = this.state.password;
    let confirmPassword = this.state.confirmPassword;

    if(this.validateUser(firstName,lastName,userName,email,password,confirmPassword)){
      //this.props.addUser(firstName,lastName,userName,email,password,confirmPassword)
    }
  }

  validateUser(firstName,lastName,userName,email,password,confirmPassword) {
    if (!firstName && _.isEmpty(firstName)) {
      return false;
    }
    if (!lastName && _.isEmpty(lastName)) {
        return false;
    }
    if (!userName && _.isEmpty(userName)) {
      return false;
  }  
    if (!email && _.isEmpty(email)) {
      return false;
    } else {
      const validMail = this.validateEmail(email);
      if (!validMail) {
        return false;
      }
    }
    if (!password && _.isEmpty(password)) {
        return false;
    }else {
      const validPassword = this.validatePassword(password);
      if (!validPassword) {
        return false;
      }
    } 
    if (!confirmPassword && _.isEmpty(confirmPassword)) {
      return false;
    }else {
      if (password !== confirmPassword) {
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

  render() { 

    let firstName = this.state.firstName;
    let lastName = this.state.lastName;
    let userName = this.state.userName;
    let email = this.state.email;
    let password = this.state.password;
    let confirmPassword = this.state.confirmPassword;

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
            onChangeText={userName => this.setState({userName})}
          />
        </View>
        <View style={[styles.userFieldView, {marginTop: 5}]}>
          <TextInput
            style={styles.textInput}
            placeholder={'Email'}
            value={email}
            onChangeText={email => this.setState({email})}
          />
        </View>
        <View style={[styles.userFieldView, {marginTop: 5}]}>
          <TextInput
            style={styles.textInput}
            placeholder={'Password'}
            value={password}
            onChangeText={password => this.setState({password})}
          />
        </View>
        <View style={[styles.userFieldView, {marginTop: 5}]}>
          <TextInput
            style={styles.textInput}
            placeholder={'Confirm Password'}
            value={confirmPassword}
            onChangeText={confirmPassword => this.setState({confirmPassword})}
          />
        </View>
        <Button
          onPress={() => this.saveUser()}
          title="Save"
          color="#841584"
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
  },
});

const mapStateToProps = state => {
  return {
   
  };
};
export default connect(
  mapStateToProps,
  actions,
)(AddUserScreen);
