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
import RoundCheckbox from 'rn-round-checkbox';
import APIServices from '../../../services/APIServices';
import AwesomeAlert from 'react-native-awesome-alerts';
import _ from 'lodash';
import AsyncStorage from '@react-native-community/async-storage';
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
      projectID: '',
      popupMenuOpen: false,
      showMessageModal: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.addPeopleProjectError !== this.props.addPeopleProjectError &&
      this.props.addPeopleProjectError &&
      this.props.addPeopleProjectErrorMessage == ''
    ) {
      this.showAlert('', 'Error While adding User');
    }

    if (
      prevProps.addPeopleProjectError !== this.props.addPeopleProjectError &&
      this.props.addPeopleProjectError &&
      this.props.addPeopleProjectErrorMessage != ''
    ) {
      this.showAlert('', this.props.addPeopleProjectErrorMessage);
    }

    if (
      prevProps.addPeopleProjectSuccess !==
        this.props.addPeopleProjectSuccess &&
      this.props.addPeopleProjectSuccess
    ) {
      this.setState({showMessageModal: true});
      this.setState({
        name: '',
        role: '',
        userName: '',
        userID: '',
      });
    }
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let projectID = params.projectItem;
    this.setState({projectID: projectID});
    this.getActiveUsers();
  }

  onPressCancel() {
    this.setState({showMessageModal: false});
  }

  async getActiveUsers() {
    try {
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
    } catch (error) {
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
    let role = this.state.role;
    let isSelected = this.state.isSelected;
    let assigneeProjectRole = 0;
    let projectID = this.state.projectID;

    if (isSelected) {
      assigneeProjectRole = 2;
    } else {
      assigneeProjectRole = 3;
    }

    if (this.validateUser(userID, role)) {
      AsyncStorage.getItem('userID').then(assignerId => {
        if (assignerId) {
          this.props.addUserToProject(
            assignerId,
            userID,
            role,
            assigneeProjectRole,
            projectID,
          );
        }
      });
    }
  }

  validateUser(userID, role) {
    if (!userID && _.isEmpty(userID)) {
      this.showAlert('', 'Please select a user');
      return false;
    }

    if (!role && _.isEmpty(role)) {
      this.showAlert('', 'Please enter the role of the project');
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
      </View>
    );
  }

  cancelUserSave() {
    this.props.navigation.goBack();
  }

  render() {
    let activeUsers = this.state.activeUsers;
    let userID = this.state.userID;
    let role = this.state.role;
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
            <View style={[styles.taskFieldView]}>
              <TextInput
                style={[styles.textInput, {width: '95%'}]}
                placeholder={'Role'}
                value={role}
                placeholderTextColor={colors.placeholder}
                onChangeText={role => this.setState({role})}
              />
            </View>
            <View style={styles.checkBoxContainer}>
              <View style={{flex: 1}}>
                <RoundCheckbox
                  size={18}
                  checked={this.state.isSelected}
                  backgroundColor={colors.lightGreen}
                  onValueChange={newValue => this.toggleCheckBox(newValue)}
                  borderColor={'gray'}
                />
              </View>
              <View style={styles.CheckBoxLableContainer}>
                <Text style={styles.checkBoxText}>Add as an Admin</Text>
              </View>
            </View>
          </ScrollView>
          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={() => this.saveUser()}>
              <View style={styles.button}>
                <Image
                  style={styles.bottomBarIcon}
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
                  style={styles.bottomBarIcon}
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
    borderRadius: '5rem',
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
    marginRight: '15rem',
    marginLeft: '10rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  checkBoxText: {
    fontSize: '12rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    borderRadius: '5rem',
    marginTop: '17rem',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonDelete: {
    flexDirection: 'row',
    backgroundColor: colors.lightRed,
    borderRadius: '5rem',
    marginTop: '10rem',
    marginBottom: '5rem',
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
    marginBottom: '15rem',
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

const mapStateToProps = state => {
  return {
    addPeopleProjectLoading: state.project.addPeopleProjectLoading,
    addPeopleProjectError: state.project.addPeopleProjectError,
    addPeopleProjectSuccess: state.project.addPeopleProjectSuccess,
    addPeopleProjectErrorMessage: state.project.addPeopleProjectErrorMessage,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(AddPeopleScreen);
