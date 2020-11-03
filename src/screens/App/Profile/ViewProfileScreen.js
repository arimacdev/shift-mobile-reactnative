import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  FlatList,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Loader from '../../../components/Loader';
import APIServices from '../../../services/APIServices';
import {authorize} from 'react-native-app-auth';
import strings from '../../../config/strings';
import _ from 'lodash';
import AwesomeAlert from 'react-native-awesome-alerts';
import DocumentPicker from 'react-native-document-picker';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import MessageShowModal from '../../../components/MessageShowModal';
import Utils from '../../../utils/Utils';
import FilePickerModal from '../../../components/FilePickerModal';

const config = strings.slack;

class ViewProfileScreen extends Component {
  successDetails = {
    icon: icons.userGreen,
    type: 'success',
    title: 'Success',
    description: 'Profile details updated successfully',
    buttons: {},
  };
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
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      files: [],
      userID: '',
      showMessageModal: false,
      userMetricsData: [],
      showFilePickerModal: false,
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
    this.setState({userID: userID});
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
      this.getUserSkillMap(userID);
    } else {
      this.setState({dataLoading: false});
    }
  }

  async getUserSkillMap(userID) {
    this.setState({dataLoading: true});
    try {
      let response = await APIServices.getUserSkillMapData(userID);
      if (response.message == 'success') {
        // let sortedData = response.data.sort(this.arrayCompare);
        this.setState({dataLoading: false, userMetricsData: response.data});
      } else {
        this.setState({dataLoading: false, userMetricsData: []});
      }
    } catch (error) {
      this.setState({dataLoading: false, userMetricsData: []});
    }
  }

  arrayCompare(a, b) {
    // Use toUpperCase() to ignore character casing
    const categoryNameA = a.categoryName.toUpperCase();
    const categoryNameB = b.categoryName.toUpperCase();

    let comparison = 0;
    if (categoryNameA > categoryNameB) {
      comparison = 1;
    } else if (categoryNameA < categoryNameB) {
      comparison = -1;
    }
    return comparison;
  }

  async updateSlackNotificationStatus(email, value) {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let profile = params.profile;
    let userID = profile.userId;

    try {
      this.setState({dataLoading: true, showMessageModal: false});
      let notoficationStatus = await APIServices.updateSlackNotificationStatus(
        userID,
        email,
        value,
      );
      if (notoficationStatus.message == 'success') {
        this.successDetails = {
          icon: icons.notificationPurple,
          type: 'success',
          title: 'Success',
          description: value
            ? 'Slack notifications enabled successfully'
            : 'Slack notifications disabled successfully',
          buttons: {},
        };
        this.setState({
          notification: value,
          dataLoading: false,
          showMessageModal: true,
        });
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
      this.showAlert('', error.data.message);
    }
  }

  userIcon(userImage) {
    if (userImage) {
      return <Image source={{uri: userImage}} style={styles.avatar} />;
    } else {
      return <Image style={styles.avatar} source={icons.defultUser} />;
    }
  }

  async onEditPress() {
    this.setState({editEnabled: true});
  }

  onCloseFilePickerModal() {
    this.setState({showFilePickerModal: false});
  }

  async setImage() {
    this.setState({showFilePickerModal: true});
  }

  async selectCamera() {
    await this.setState({showFilePickerModal: false});

    const options = {
      title: 'Select a profile picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };
    setTimeout(() => {
      ImagePicker.launchCamera(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          Utils.showAlert(true, '', 'ImagePicker Error', this.props);
        } else if (response.customButton) {
          console.log('User tapped custom button');
        } else {
          this.setImageForFile(response);
        }
      });
    }, 100);
  }

  async selectGallery() {
    await this.setState({showFilePickerModal: false});
    const options = {
      title: 'Select a profile picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };

    setTimeout(() => {
      ImagePicker.launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          Utils.showAlert(true, '', 'ImagePicker Error', this.props);
        } else if (response.customButton) {
          console.log('User tapped custom button');
        } else {
          this.setImageForFile(response);
        }
      });
    }, 100);
  }

  async setImageForFile(res) {
    let imgName = res.fileName;
    let fileSize = res.fileSize / 1000000;

    if (typeof imgName === 'undefined' || imgName == null) {
      var getFilename = res.uri.split('/');
      imgName = getFilename[getFilename.length - 1];
    }

    if (fileSize <= 10) {
      this.uploadFiles(res.uri, imgName, res.type);
    } else {
      Utils.showAlert(
        true,
        '',
        'File size is too large. Maximum file upload size is 10MB',
        this.props,
      );
    }
  }

  async onProfileImageClick() {
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      for (const res of results) {
        this.onFilesCrossPress(res.uri);

        await this.state.files.push({
          uri: res.uri,
          type: res.type, // mime type
          name: res.name,
          size: res.size,
          dateTime:
            moment().format('YYYY/MM/DD') + ' | ' + moment().format('HH:mm'),
        });

        //this.uploadFiles(this.state.files)
      }
      this.setState({files: this.state.files});
      console.log(this.state.files);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('file pick error', err);
      } else {
        throw err;
      }
    }
  }

  onFilesCrossPress(uri) {
    this.setState(
      {
        files: [],
      },
      () => {
        let filesArray = this.state.files.filter(item => {
          return item.uri !== uri;
        });
        this.setState({files: filesArray});
      },
    );
  }

  async uploadFiles(fileUri, filename, fileType) {
    try {
      let userID = this.state.userID;
      this.setState({dataLoading: true, showMessageModal: false});
      let userData = await APIServices.uplaodProfilePhoto(
        fileUri,
        filename,
        fileType,
      );
      if (userData.message == 'success') {
        this.successDetails = {
          icon: icons.userGreen,
          type: 'success',
          title: 'Success',
          description: 'Profile image updated successfully',
          buttons: {},
        };
        this.setState({dataLoading: false, showMessageModal: true});
        this.fetchUserData(userID);
        this.fetchDataUserData(userID);
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      this.setState({dataLoading: false});
      this.showAlert('', 'Profile image upload failed');
    }
  }

  async fetchDataUserData(userID) {
    this.setState({dataLoading: true});
    await APIServices.getUserData(userID)
      .then(responseUser => {
        this.setState({dataLoading: false});
        this.props.UserInfoSuccess(responseUser);
      })
      .catch(error => {
        this.setState({dataLoading: false});
        let message = error.data ? error.data.message : 'Data loading error';
        Utils.showAlert(true, '', message, this.props);
      });
  }

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

  async onSlackButtonPress() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let profile = params.profile;
    let userID = profile.userId;

    try {
      const result = await authorize(config);
      var obj = result.tokenAdditionalParameters.authed_user;
      const authedUser = JSON.parse(obj);
      this.setState({dataLoading: true, showMessageModal: false});
      await APIServices.addSlackID(userID, authedUser.id)
        .then(response => {
          if (response.message == 'success') {
            this.successDetails = {
              icon: icons.slackIcon,
              type: 'success',
              title: 'Success',
              description: 'Slack connected successfully',
              buttons: {},
            };
            this.setState({dataLoading: false, showMessageModal: true});
          } else {
            this.setState({dataLoading: false});
          }
        })
        .catch(() => {
          this.setState({dataLoading: false});
        });
    } catch (error) {
      this.setState({dataLoading: false});
      this.showAlert('', 'Error connected to the slack');
    }
  }

  async saveUser() {
    let userFirstName = this.state.userFirstName;
    let userLastName = this.state.userLastName;
    let userEmail = this.state.userEmail;
    let userNewPassword = this.state.userNewPassword;
    let userConfirmPassword = this.state.userConfirmPassword;
    if (
      this.validateUser(
        userFirstName,
        userLastName,
        userEmail,
        userNewPassword,
        userConfirmPassword,
      )
    ) {
      try {
        this.setState({dataLoading: true, showMessageModal: false});
        let userData = await APIServices.updateMyDetails(
          userFirstName,
          userLastName,
          userEmail,
          userNewPassword,
        );
        if (userData.message == 'success') {
          this.successDetails = {
            icon: icons.userGreen,
            type: 'success',
            title: 'Success',
            description: 'Profile details updated successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
        } else {
          this.setState({dataLoading: false});
        }
      } catch (error) {
        this.setState({dataLoading: false});
        let message = error.data
          ? error.data.message
          : 'Error occurred while saving the user';
        Utils.showAlert(true, '', message, this.props);
      }
    }
  }

  validateUser(firstName, lastName, email, password, confirmPassword) {
    if (!firstName && _.isEmpty(firstName)) {
      this.showAlert('', 'Please Enter the First Name');
      return false;
    }
    if (!lastName && _.isEmpty(lastName)) {
      this.showAlert('', 'Please Enter the Last Name');
      return false;
    }
    if (!email && _.isEmpty(email)) {
      this.showAlert('', 'Please Enter the Email');
      return false;
    } else {
      const validMail = this.validateEmail(email);
      if (!validMail) {
        this.showAlert('', 'Please a valid Email');
        return false;
      }
    }
    if (password && !_.isEmpty(password)) {
      const validPassword = this.validatePassword(password);
      if (!validPassword) {
        this.showAlert('', 'Please Enter a valid Password');
        return false;
      }
    }
    if (
      password &&
      !_.isEmpty(password) &&
      !confirmPassword &&
      _.isEmpty(confirmPassword)
    ) {
      this.showAlert('', 'Please confirm the password');
      return false;
    } else {
      if (password !== confirmPassword) {
        this.showAlert('', 'Please match the Confirm Password');
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

  onPressCancel() {
    this.setState({showMessageModal: false});
  }

  renderSkillList(item) {
    return (
      <View style={styles.skillListView}>
        <Text style={styles.skillListText}>{item.skillName}</Text>
      </View>
    );
  }

  renderUserMetricsList(item) {
    return (
      <View>
        <View
          style={[
            styles.metricsListVew,
            {backgroundColor: item.categoryColorCode},
          ]}>
          <Text style={styles.metricsListText}>{item.categoryName}</Text>
        </View>
        <View>
          <FlatList
            style={styles.flatListStyle}
            data={item.skillSet}
            renderItem={({item, index}) => this.renderSkillList(item)}
            keyExtractor={item => item.skillId}
          />
        </View>
      </View>
    );
  }

  render() {
    let {
      userFirstName,
      userLastName,
      userEmail,
      userNewPassword,
      userConfirmPassword,
      userSlackId,
      notification,
      userLastImage,
      dataLoading,
      editEnabled,
      showAlert,
      alertTitle,
      alertMsg,
      userMetricsData,
    } = this.state;

    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <View style={styles.header} />
          <View style={styles.avatarView}>
            <TouchableOpacity
              onPress={() => this.setImage()}
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
            <View>
              {userMetricsData.length > 0 ? (
                <FlatList
                  style={styles.mainFlatListStyle}
                  data={userMetricsData}
                  renderItem={({item, index}) =>
                    this.renderUserMetricsList(item)
                  }
                  keyExtractor={item => item.categoryId}
                />
              ) : null}
            </View>
            <TouchableOpacity onPress={() => this.onSlackButtonPress()}>
              <View
                style={[
                  styles.taskFieldView,
                  {backgroundColor: colors.slackBgColor},
                ]}>
                <Image
                  style={styles.slackLogo}
                  source={icons.slackLogo}
                  resizeMode={'contain'}
                />
                <Text style={[styles.textBottom, {color: colors.white}]}>
                  Add to Slack
                </Text>
              </View>
            </TouchableOpacity>
            <View
              style={[
                styles.slackView,
                {
                  backgroundColor: colors.white,
                  borderColor: colors.lighterGray,
                  borderWidth: 1,
                },
              ]}>
              <Image
                style={styles.slackIcon}
                source={icons.slackIcon}
                resizeMode={'contain'}
              />
              <Text style={styles.textBottom}>Enable Slack Notifications</Text>
              <Switch
                onValueChange={value =>
                  this.updateSlackNotificationStatus(userEmail, value)
                }
                value={notification}
                disabled={userSlackId == ''}
                trackColor={colors.switchOnBgColor}
                thumbColor={notification ? colors.switchColor : colors.gray}
              />
            </View>
            <TouchableOpacity
              disabled={!editEnabled}
              onPress={() => this.saveUser()}>
              <View style={styles.button}>
                <Image
                  style={styles.bottomBarIcon}
                  source={icons.userWhite}
                  resizeMode={'contain'}
                />
                <View style={{flex: 1}}>
                  <Text style={styles.buttonText}>Save Changes</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <FilePickerModal
          showFilePickerModal={this.state.showFilePickerModal}
          onPressCancel={() => this.onCloseFilePickerModal()}
          selectCamera={() => this.selectCamera()}
          selectFiles={() => this.selectGallery()}
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
          overlayStyle={{backgroundColor: colors.alertOverlayColor}}
          contentContainerStyle={styles.alertContainerStyle}
          confirmButtonStyle={styles.alertConfirmButtonStyle}
        />
        <MessageShowModal
          showMessageModal={this.state.showMessageModal}
          details={this.successDetails}
          onPress={() => {}}
          onPressCancel={() => this.onPressCancel(this)}
        />
        {dataLoading && <Loader />}
      </View>
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
    textAlign: 'center',
    lineHeight: '30rem',
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
  slackView: {
    backgroundColor: colors.white,
    borderColor: colors.lighterGray,
    borderWidth: '1rem',
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
  slackLogo: {
    width: '90rem',
    height: '60rem',
    marginRight: '15rem',
  },
  slackIcon: {
    width: '21rem',
    height: '21rem',
    marginRight: '15rem',
  },
  editView: {
    position: 'absolute',
    alignSelf: 'flex-end',
    bottom: 0,
    paddingRight: '10rem',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    marginTop: '17rem',
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
    marginRight: '15rem',
    marginLeft: '10rem',
  },
  mainFlatListStyle: {
    marginHorizontal: '20rem',
    marginBottom: '10rem',
  },
  flatListStyle: {
    marginBottom: '7rem',
    backgroundColor: colors.projectBgColor,
    borderBottomStartRadius: '5rem',
    borderBottomEndRadius: '5rem',
    paddingVertical: '5rem',
  },
  metricsListVew: {
    borderTopStartRadius: '5rem',
    borderTopEndRadius: '5rem',
    paddingHorizontal: '20rem',
    height: '35rem',
    justifyContent: 'center',
  },
  metricsListText: {
    fontSize: '12rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.white,
  },
  skillListView: {
    paddingHorizontal: '20rem',
    marginVertical: '10rem',
  },
  skillListText: {
    fontSize: '12rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.colorShuttleGrey,
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

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(ViewProfileScreen);
