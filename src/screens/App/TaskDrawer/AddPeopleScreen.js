import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import APIServices from '../../../services/APIServices';
import AwesomeAlert from 'react-native-awesome-alerts';
import _ from 'lodash';
const {height} = Dimensions.get('window');
import {MenuProvider} from 'react-native-popup-menu';
import PopupMenu from '../../../components/PopupMenu';
import FadeIn from 'react-native-fade-in-image';
import MessageShowModal from '../../../components/MessageShowModal';

let successDetails = {
  icon: icons.userGreen,
  type: 'success',
  title: 'Success',
  description: 'User have been added successfully',
  buttons: {},
};
class AddPeopleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      role: '',
      isSelected: false,
      visiblePeopleModal: false,
      activeUsers: [],
      allActiveUsers: [],
      userName: '',
      userID: '',
      dataLoading: false,
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      taskItemID: '',
      popupMenuOpen: false,
      showMessageModal: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let taskItemID = params.taskItem;
    this.setState({taskItemID: taskItemID});
    this.getActiveUsers();
  }

  async getActiveUsers() {
    this.setState({dataLoading: true});
    let activeUsers = await APIServices.getActiveUsers();
    if (activeUsers.message == 'success') {
      let userList = [];
      for (let i = 0; i < activeUsers.data.length; i++) {
        if (activeUsers.data[i].firstName && activeUsers.data[i].lastName) {
          userList.push({
            key: activeUsers.data[i].userId,
            label:
              activeUsers.data[i].firstName +
              ' ' +
              activeUsers.data[i].lastName,
            userImage: activeUsers.data[i].profileImage,
          });
        }
      }
      this.setState({
        activeUsers: userList,
        allActiveUsers: userList,
        dataLoading: false,
      });
    } else {
      console.log('error');
      this.setState({dataLoading: false});
    }
  }

  onPeopleNameChange(text) {
    this.setState({name: text});
  }

  onRoleChange(text) {
    this.setState({role: text});
  }

  toggleCheckBox(newValue) {
    this.setState({isSelected: !this.state.isSelected});
    console.log(newValue);
  }

  cancelUserSave() {
    this.props.navigation.goBack();
  }

  onSelectUser = async item => {
    this.setState({
      visiblePeopleModal: false,
      userName: item.label,
      userID: item.key,
      popupMenuOpen: false,
    });
    await this.props.addPeopleModal(false);
  };

  onCancelUser = () => {
    this.setState({
      visiblePeopleModal: false,
    });
  };

  itemNameClick = () => {
    this.setState({
      visiblePeopleModal: true,
    });
  };

  saveUser() {
    let userID = this.state.userID;
    let taskItemID = this.state.taskItemID;
    if (this.validateUser(userID)) {
      this.addUser(userID, taskItemID);
      //this.props.addUserToGroupTask(userID,taskItemID);
    }
  }

  async addUser(userID, taskItemID) {
    this.setState({dataLoading: true});
    try {
      resultObj = await APIServices.addUserToGroupTask(userID, taskItemID);
      if (resultObj.message == 'success') {
        this.setState({dataLoading: false, showMessageModal: true});
        // this.showAlert('', 'Successfully completed');
        this.setState({
          name: '',
          role: '',
          userName: '',
          userID: '',
        });
      } else {
        this.setState({dataLoading: false});
        this.showAlert('', 'Error');
      }
    } catch (e) {
      if (e.status == 400 || e.status == 401 || e.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', e.data.message);
      }
    }
  }

  onPressCancel() {
    this.setState({showMessageModal: false});
  }

  validateUser(userID) {
    if (!userID && _.isEmpty(userID)) {
      this.showAlert('', 'Please select a user');
      return false;
    }

    return true;
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

  async onSearchTextChange(text) {
    await this.props.addPeopleModal(true);
    this.setState({userName: text, popupMenuOpen: true});
    let result = this.state.allActiveUsers.filter(data =>
      data.label.toLowerCase().includes(text.toLowerCase()),
    );
    if (text == '') {
      this.setState({activeUsers: this.state.allActiveUsers});
    } else {
      this.setState({activeUsers: result});
    }
  }

  renderMenuTrugger() {
    return (
      <View style={[styles.taskFieldView, {marginTop: 30}]}>
        <TextInput
          style={[styles.textInput, {width: '95%'}]}
          placeholder={'Type a name to add'}
          value={this.state.userName}
          placeholderTextColor={colors.placeholder}
          onChangeText={text => this.onSearchTextChange(text)}
        />
      </View>
    );
  }

  userImage = function(item) {
    let userImage = item.userImage;

    if (userImage) {
      return (
        <FadeIn>
          <Image source={{uri: userImage}} style={styles.userIcon} />
        </FadeIn>
      );
    } else {
      return (
        <Image
          style={styles.userIcon}
          source={icons.defultUser}
          resizeMode="contain"
        />
      );
    }
  };

  renderUserList(item) {
    const {navigation} = this.props;
    return (
      // <TouchableOpacity
      //   onPress={() =>
      //     this.onSelectUser(item.firstName + ' ' + item.lastName, item.userId)
      //   }>
      <View
        style={[
          styles.projectView,
          {
            backgroundColor:
              item.label == navigation.state.params.userName
                ? colors.projectBgColor
                : '',
          },
        ]}>
        {this.userImage(item)}
        <View style={{flex: 1}}>
          <Text style={styles.text}>{item.label}</Text>
        </View>
        {/* {this.colorCode(item)} */}
      </View>
      // </TouchableOpacity>
    );
  }

  render() {
    let activeUsers = this.state.activeUsers;
    let userID = this.state.userID;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;

    return (
      <MenuProvider>
        <View style={{flex: 1}}>
          <ScrollView style={styles.container}>
            <PopupMenu
              userID={userID}
              menuTrigger={this.renderMenuTrugger()}
              menuOptions={item => this.renderUserList(item)}
              data={activeUsers}
              onSelect={item => this.onSelectUser(item)}
              open={this.state.popupMenuOpen}
            />
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
                  <Text style={styles.buttonText}>Save</Text>
                </View>

                <Image
                  style={[styles.addIcon, {marginRight: 10}]}
                  source={icons.addGreen}
                  resizeMode={'contain'}
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.cancelUserSave()}>
              <View style={styles.buttonDelete}>
                <Image
                  style={[
                    styles.bottomBarIcon,
                    {marginRight: 15, marginLeft: 10},
                  ]}
                  source={icons.userWhite}
                  resizeMode={'contain'}
                />
                <View style={{flex: 1}}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </View>

                <Image
                  style={[styles.addIcon, {marginRight: 10}]}
                  source={icons.delete}
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
        </View>
      </MenuProvider>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: height - 500,
  },
  taskFieldView: {
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
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  checkBoxText: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    borderRadius: 5,
    marginTop: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonDelete: {
    flexDirection: 'row',
    backgroundColor: colors.lightRed,
    borderRadius: 5,
    marginTop: '10rem',
    marginBottom: '5rem',
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
  addIcon: {
    width: '28rem',
    height: '28rem',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: 15,
  },
  checkBoxContainer: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: '20rem',
  },
  CheckBoxLableContainer: {
    flex: 4,
    right: '40rem',
  },
  modelCancel: {
    backgroundColor: colors.primary,
    borderRadius: 3,
    height: 36,
    width: 136,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelCancelText: {
    color: colors.white,
    fontFamily: 'CircularStd-Medium',
    fontWeight: '400',
  },
  titleTextStyle: {
    marginTop: '20rem',
    color: colors.white,
    fontFamily: 'CircularStd-Medium',
    marginBottom: '10rem',
    fontSize: '16rem',
  },
  inputsText: {
    fontFamily: Platform.OS == 'ios' ? 'CircularStd-Medium' : 'Product Sans',
    height: 45,
    flex: 1,
    marginTop: '28rem',
    color: colors.gray,
    textAlign: 'left',
  },
  inputsTextDefualt: {
    fontFamily: 'CircularStd-Medium',
    height: 45,
    flex: 1,
    marginTop: '28rem',
    color: colors.textPlaceHolderColor,
    textAlign: 'left',
  },
  userIcon: {
    width: '45rem',
    height: '45rem',
    borderRadius: 90 / 2,
  },
  projectView: {
    height: '70rem',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '20rem',
    borderBottomWidth: 1,
    borderBottomColor: colors.lighterGray,
  },
  text: {
    fontSize: '12rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
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
)(AddPeopleScreen);
