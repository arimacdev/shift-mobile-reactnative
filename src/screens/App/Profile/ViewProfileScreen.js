import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import FadeIn from 'react-native-fade-in-image';
import Loader from '../../../components/Loader';
import APIServices from '../../../services/APIServices';
import {TextInput} from 'react-native-gesture-handler';
import { authorize } from 'react-native-app-auth';
import strings from '../../../config/strings';

const config = {
  clientId: strings.slack.clientId, // found under App Credentials
  clientSecret: strings.slack.clientSecret, // found under App Credentials
  scopes: ['incoming-webhook,chat:write'], // choose any of the scopes set up in step 1
  redirectUrl: 'http://io.identityserver.demo:/oauthSlackredirect', // set up in step 2
  serviceConfiguration: {
    authorizationEndpoint: 'https://slack.com/oauth/v2/authorize',
    tokenEndpoint: 'https://slack.com/api/oauth.v2.access',
  },
  dangerouslyAllowInsecureHttpRequests: true
};

class ViewProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userFirstName: '',
      userLastName: '',
      userNameId: '',
      userEmail: '',
      userLastImage: '',
      userNewPassword: '',
      userConfirmPassword: '',
      userSlackId: '',
      notification: false,
      dataLoading: false,
      editEnabled: false,
      // switchValue: false,
    };
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let profile = params.profile;
    let userID = profile.userId;
    this.fetchUserData(userID);
  }

  async fetchUserData(userID) {
    this.setState({dataLoading: true});
    let userData = await APIServices.getUserData(userID);
    if (userData.message == 'success') {
      this.setState({
        userFirstName: userData.data.firstName,
        userLastName: userData.data.lastName,
        userNameId: userData.data.userName,
        userEmail: userData.data.email,
        userSlackId: userData.data.userSlackId,
        notification: userData.data.notification,
        userLastImage: userData.data.profileImage,
        dataLoading: false,
      });
    } else {
      this.setState({dataLoading: false});
    }
  }
  async updateSlackNotificationStatus(email, value) {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let profile = params.profile;
    let userID = profile.userId;

    this.setState({dataLoading: true});
    let notoficationStatus = await APIServices.updateSlackNotificationStatus(
      userID,
      email,
      value,
    );
    if (notoficationStatus.message == 'success') {
      this.setState({
        notification: value,
        dataLoading: false,
      });
    } else {
      this.setState({dataLoading: false});
    }
  }

  userIcon(userImage) {
    if (userImage) {
      return <Image source={{uri: userImage}} style={styles.avatar} />;
    } else {
      return (
        <Image
          style={styles.avatar}
          source={require('../../../asserts/img/defult_user.png')}
        />
      );
    }
  }

  async onEditPress() {
    this.setState({editEnabled: true});
    const result = await authorize(config);
    console.log("sssssssssssssssssss",result);
  }

  onProfileImageClick() {}

  onFirstNameChange(text) {
    this.setState({userFirstName: text});
  }

  onLastNameChange(text) {
    this.setState({userLastName: text});
  }

  onUserNameChange(text) {
    this.setState({userNameId: text});
  }

  onEmailChange(text) {
    this.setState({userEmail: text});
  }

  onNewPasswordChange(text) {
    this.setState({userNewPassword: text});
  }

  onConfirmPasswordChange(text) {
    this.setState({userConfirmPassword: text});
  }

  // toggleSwitch = value => {
  //   this.updateSlackNotificationStatus()
  // };

  render() {
    let {
      userFirstName,
      userLastName,
      userNameId,
      userEmail,
      userNewPassword,
      userConfirmPassword,
      userSlackId,
      notification,
      userLastImage,
      dataLoading,
      editEnabled,
    } = this.state;

    return (
      <ScrollView style={styles.container}>
        <View style={styles.header} />
        <View style={styles.avatarView}>
          <TouchableOpacity
            onPress={() => this.onProfileImageClick()}
            disabled={!editEnabled}>
            {this.userIcon(userLastImage)}
          </TouchableOpacity>
          <View style={styles.editView}>
            <TouchableOpacity onPress={() => this.onEditPress()}>
              <Image style={styles.editIcon} source={icons.editRoundedBlue} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>
              {userFirstName + ' ' + userLastName}
            </Text>
          </View>
          <View style={styles.taskFieldView}>
            <TextInput
              style={styles.textBottom}
              placeholder={'First Name'}
              value={userFirstName}
              editable={editEnabled}
              onChangeText={text => this.onFirstNameChange(text)}
            />
          </View>
          <View style={[styles.taskFieldView]}>
            <TextInput
              style={styles.textBottom}
              placeholder={'Last Name'}
              value={userLastName}
              editable={editEnabled}
              onChangeText={text => this.onLastNameChange(text)}
            />
          </View>
          <View style={[styles.taskFieldView]}>
            <TextInput
              style={styles.textBottom}
              placeholder={'User Name'}
              value={userNameId}
              editable={false}
              onChangeText={text => this.onUserNameChange(text)}
            />
          </View>
          <View style={[styles.taskFieldView]}>
            <TextInput
              style={styles.textBottom}
              placeholder={'Email'}
              value={userEmail}
              editable={editEnabled}
              onChangeText={text => this.onEmailChange(text)}
            />
          </View>
          <View style={[styles.taskFieldView]}>
            <TextInput
              style={styles.textBottom}
              placeholder={'New Password'}
              secureTextEntry={true}
              value={userNewPassword}
              editable={editEnabled}
              onChangeText={text => this.onNewPasswordChange(text)}
            />
          </View>
          <View style={[styles.taskFieldView]}>
            <TextInput
              style={styles.textBottom}
              placeholder={'Confirm Password'}
              secureTextEntry={true}
              value={userConfirmPassword}
              editable={editEnabled}
              onChangeText={text => this.onConfirmPasswordChange(text)}
            />
          </View>
          <View style={[styles.taskFieldView]}>
            <Text style={styles.textBottom}>Enable Slack Notifications</Text>
            <Switch
              // style={{marginTop: 30}}
              onValueChange={(value)=>this.updateSlackNotificationStatus(userEmail,value)}
              value={notification}
              disabled={userSlackId == ''}
              trackColor={colors.switchOnBgColor}
              thumbColor={notification ? colors.switchColor : colors.gray}
            />
          </View>
        </View>
        {dataLoading && <Loader />}
      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  header: {
    backgroundColor: colors.userViewHeader,
    height: '124rem',
  },
  avatar: {
    width: '130rem',
    height: '130rem',
    borderRadius: '75rem',
    borderWidth: '3rem',
    borderColor: colors.white,
  },
  avatarView: {
    alignSelf: 'center',
    position: 'absolute',
    marginTop: '35rem',
  },
  name: {
    fontFamily: 'CircularStd-Bold',
    fontSize: '24rem',
    fontWeight: '400',
    color: colors.userViewHeader,
    marginTop: '14rem',
  },
  body: {
    marginTop: '25rem',
    marginBottom: '10rem',
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: '22rem',
  },
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '0rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '56rem',
    marginHorizontal: '20rem',
  },
  textBottom: {
    flex: 1,
    fontFamily: 'CircularStd-Medium',
    fontSize: '12rem',
    fontWeight: '400',
    color: colors.userViewData,
  },
  editIcon: {
    width: '30rem',
    height: '30rem',
  },
  editView: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,
    paddingRight: 10,
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(ViewProfileScreen);
