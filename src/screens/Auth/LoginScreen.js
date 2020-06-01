import React, {Component} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../redux/actions';
import colors from '../../config/colors';
import {authorize} from 'react-native-app-auth';

// base config
const config = {
  issuer: 'http://pmtool.devops.arimac.xyz/auth',
  serviceConfiguration: {
    authorizationEndpoint:
      'http://pmtool.devops.arimac.xyz/auth/realms/pm-tool/protocol/openid-connect/auth',
    tokenEndpoint:
      'http://pmtool.devops.arimac.xyz/auth/realms/pm-tool/protocol/openid-connect/token',
  },
  clientId: 'pmtool-frontend',
  redirectUrl: 'io.identityserver.demo:/oauthredirect',
  scopes: ['openid', 'roles', 'profile'],
};

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      password: '',
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {}

  async initialUserLogin() {
    try {
      const result = await authorize(config);
      console.log(result);
      // result includes accessToken, accessTokenExpirationDate and refreshToken
    } catch (error) {
      alert(error);
    }
  }

  async initialUserLogout() {
    try {
      const result = await authorize(config);
      console.log(result);
      // result includes accessToken, accessTokenExpirationDate and refreshToken
    } catch (error) {
      alert(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.initialUserLogin()}
          title="Login"
          color="#841584"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.pageBackGroundColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(LoginScreen);
