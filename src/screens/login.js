import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import colors from '../config/colors';
import icons from '../assest/icons/icons';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
    };
  }

  navigateToHome() {
    this.props.navigation.navigate('aaa');
  }

  onUsernameChange(text){
    this.setState({userName:text});
  }

  onPasswordChange(text){
    if(text==''){
      
    }
    this.setState({password:text});
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.textTitle}>Welcome to Arimac PM tool</Text>
          <Text style={styles.textSubTitle}>
            Enter your email address and password to get access your account
          </Text>
        </View>
        <View>
          <View style={styles.textInputView}>
            <Image style={styles.userIcon} source={icons.user} />
            <TextInput
              style={styles.textInput}
              placeholder={'Username'}
              value={this.state.userName}
              onChangeText={text=>this.onUsernameChange(text)}
            />
          </View>
          <View style={styles.textInputView}>
            <Image style={styles.userIcon} source={icons.password} />
            <TextInput
              style={styles.textInput}
              placeholder={'Password'}
              value={this.state.password}
              onChangeText={text=>this.onPasswordChange(text)}
            />
          </View>
          <View>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => this.navigateToHome()}>
              <Text style={styles.textLogin}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    color: colors.darkBlue,
    textAlign: 'center',
    // lineHeight: '15rem',
    // marginTop: '16rem',
    fontWeight: 'bold',
    fontFamily: 'HelveticaNeuelight',
  },
  textSubTitle: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    marginTop: '10rem',
    fontFamily: 'HelveticaNeuelight',
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
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
  },
  userIcon: {
    width: '20rem',
    height: '20rem',
  },
  loginButton: {
    backgroundColor: colors.lightBlue,
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
    fontSize: '12rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
// const mapStateToProps = state => {
//     return {
//         user: state.profile.user,
//     };
// };
// export default connect(mapStateToProps, actions)(Login);
