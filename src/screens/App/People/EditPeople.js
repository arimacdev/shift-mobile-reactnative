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
import _ from 'lodash';
import AwesomeAlert from 'react-native-awesome-alerts';
import APIServices from '../../../services/APIServices';
import MessageShowModal from '../../../components/MessageShowModal';
const {height} = Dimensions.get('window');

let successDetails = {
  icon: icons.userGreen,
  type: 'success',
  title: 'Success',
  description: 'User have been edited successfully',
  buttons: {},
};
class EditPeople extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      role: '',
      isSelected: true,
      dataLoading: false,
      assigneeProjectRole: 0,
      projectID: '',
      userID: '',
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
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
    let peopleData = params.userItem;
    this.setState({
      role: peopleData.projectJobRoleName,
      name: peopleData.assigneeFirstName + ' ' + peopleData.assigneeLastName,
      userID: peopleData.assigneeId,
      projectID: peopleData.projectId,
    });

    if (peopleData.projectRoleId == 1) {
      // project owner
      this.setState({
        isSelected: true,
        assigneeProjectRole: 1,
      });
    } else if (peopleData.projectRoleId == 2) {
      // project admins
      this.setState({
        isSelected: true,
        assigneeProjectRole: 2,
      });
    } else if (peopleData.projectRoleId == 3) {
      // project users
      this.setState({
        isSelected: false,
        assigneeProjectRole: 3,
      });
    }
  }

  onPeopleNameChange(text) {
    this.setState({name: text});
  }

  onRoleChange(text) {
    this.setState({role: text});
  }

  toggleCheckBox(newValue) {
    let assigneeProjectRole = this.state.assigneeProjectRole;
    if (assigneeProjectRole !== 1) {
      this.setState({isSelected: !this.state.isSelected});
      console.log(newValue);
    }
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

  async editUser() {
    let isSelected = this.state.isSelected;
    let role = this.state.role;
    let projectID = this.state.projectID;
    let userID = this.state.userID;
    let userType = 0;

    if (isSelected) {
      userType = 2;
    } else {
      userType = 3;
    }

    if (!role && _.isEmpty(role)) {
      this.showAlert('', 'Please Enter the Role Name');
    } else {
      this.setState({dataLoading: true});
      try {
        let resultObj = await APIServices.updateRolePeopleData(
          isSelected,
          role,
          userType,
          projectID,
          userID,
        );
        if (resultObj.message == 'success') {
          this.setState({dataLoading: false});
          this.setState({showMessageModal: true});
        } else {
          this.setState({dataLoading: false});
          this.showAlert('', 'Error');
        }
      } catch (e) {
        this.setState({dataLoading: false});
        if (e.status == 403) {
          this.showAlert('', e.data.message);
        }
      }
    }
  }

  onPressCancel() {
    this.setState({showMessageModal: false});
    this.props.navigation.goBack();
  }

  cancelUser() {
    this.props.navigation.goBack();
  }

  render() {
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <View style={styles.topContainer}>
            <View style={styles.editableLable}>
              <View style={{flex: 1}}>
                <Text style={styles.boxText}>
                  Update the Role and Admin for
                </Text>
              </View>
              <View style={{flex: 1}}>
                <TextInput
                  style={[styles.boxTextInput, {width: '100%'}]}
                  placeholder={this.state.name}
                  value={this.state.name}
                  editable={false}
                  onChangeText={text => this.onPeopleNameChange(text)}
                />
              </View>
            </View>
            <View style={styles.editableLable}>
              <View style={{flex: 1}}>
                <Text style={styles.boxText}>Role</Text>
              </View>
              <View style={{flex: 1}}>
                <TextInput
                  style={[styles.boxTextInput, {width: '100%'}]}
                  placeholder={this.state.role}
                  value={this.state.role}
                  onChangeText={text => this.onRoleChange(text)}
                />
              </View>
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
        </ScrollView>
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => this.editUser()}>
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
          <TouchableOpacity onPress={() => this.cancelUser()}>
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
        <MessageShowModal
          showMessageModal={this.state.showMessageModal}
          details={successDetails}
          onPress={() => {}}
          onPressCancel={() => this.onPressCancel(this)}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: height - 500,
  },
  topContainer: {
    marginTop: '20rem',
  },
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    // width: '330rem',
    marginTop: '0rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
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
    // width: '95%'
  },
  boxTextInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    bottom: '5rem',
    // width: '95%'
  },
  checkBoxText: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    // width: '95%'
  },
  boxText: {
    fontSize: '12rem',
    color: 'black',
    textAlign: 'center',
    // lineHeight: '10rem',
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    paddingTop: '20rem',
    marginHorizontal: '4rem',
    // width: '95%'
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
  buttonDelete: {
    flexDirection: 'row',
    backgroundColor: colors.lightRed,
    borderRadius: 5,
    marginTop: '10rem',
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
  editableLable: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    // width: '330rem',
    marginTop: '0rem',
    marginBottom: '7rem',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '70rem',
    marginHorizontal: '20rem',
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
)(EditPeople);
