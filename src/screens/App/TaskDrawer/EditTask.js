import React, {Component} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import colors from '../../../config/colors';
import _ from 'lodash';
import AwesomeAlert from 'react-native-awesome-alerts';
import APIServices from '../../../services/APIServices';
import {NavigationEvents} from 'react-navigation';
import Loader from '../../../components/Loader';
import icons from '../../../asserts/icons/icons';
import MessageShowModal from '../../../components/MessageShowModal';

class EditTask extends Component {
  details = {
    icon: icons.alertRed,
    type: 'confirm',
    title: 'Delete Group',
    description:
      "You're about to permanently delete this group, its comments and attachments, and all of its data.\nIf you're not sure, you can close this pop up.",
    buttons: {positive: 'Delete', negative: 'Cancel'},
  };
  constructor(props) {
    super(props);
    this.state = {
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      dataLoading: false,
      groupName: '',
      selectedTaskGroupId: '',
      isChange: true,
      showMessageModal: false,
      deleteTaskSuccess: false,
    };
  }

  componentDidMount() {
    let selectedTaskGroupId = this.props.selectedTaskGroupId;
    this.setState(
      {
        selectedTaskGroupId: selectedTaskGroupId,
      },
      () => {
        this.getGroupDetails();
      },
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      let selectedTaskGroupId = this.props.selectedTaskGroupId;
      this.setState(
        {
          selectedTaskGroupId: selectedTaskGroupId,
        },
        () => {
          this.getGroupDetails();
        },
      );
    }
  }

  async renameGroup() {
    let selectedTaskGroupId = this.state.selectedTaskGroupId;
    let groupName = this.state.groupName;
    if (!groupName && _.isEmpty(groupName)) {
      this.showAlert('', 'Please Enter the Sub Task Name');
    } else {
      this.setState({dataLoading: true, showMessageModal: false});
      try {
        let resultObj = await APIServices.updateGroupTaskData(
          selectedTaskGroupId,
          groupName,
        );
        if (resultObj.message == 'success') {
          this.details = {
            icon: icons.taskBlue,
            type: 'success',
            title: 'Sucsess',
            description: 'Group have been renamed successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
          // this.showAlert('', 'Successfully Updated');
        } else {
          this.setState({dataLoading: false});
          this.showAlert('', 'Error');
        }
      } catch (e) {
        this.setState({dataLoading: false});
        if (e.status == 401) {
          this.showAlert('', e.data.message);
        }
      }
    }
  }

  deleteGroupdeleteGroupAlert() {
    // Alert.alert(
    //   'Delete Group',
    //   'You are about to permanantly delete this group and all of its data.\n If you are not sure, you can cancel this action.',
    //   [
    //     {
    //       text: 'Cancel',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     {text: 'Ok', onPress: () => this.deleteGroupdeleteGroup()},
    //   ],
    //   {cancelable: false},
    // );
    this.details = {
      icon: icons.alertRed,
      type: 'confirm',
      title: 'Delete Group',
      description:
        "You're about to permanently delete this group, its comments and attachments, and all of its data.\nIf you're not sure, you can close this pop up.",
      buttons: {positive: 'Delete', negative: 'Cancel'},
    };
    this.setState({showMessageModal: true});
  }

  async deleteGroupdeleteGroup() {
    let selectedTaskGroupId = this.state.selectedTaskGroupId;
    try {
      this.setState({dataLoading: true, showMessageModal: false});
      let resultObj = await APIServices.deleteGroupTaskData(
        selectedTaskGroupId,
      );
      if (resultObj.message == 'success') {
        this.details = {
          icon: icons.taskBlue,
          type: 'success',
          title: 'Sucsess',
          description: 'Group have been deleted successfully',
          buttons: {},
        };
        this.setState({
          dataLoading: false,
          isChange: true,
          deleteTaskSuccess: true,
          showMessageModal: true,
        });
      } else {
        this.setState({dataLoading: false, deleteTaskSuccess: false});
        this.showAlert('', 'Error');
      }
    } catch (e) {
      this.setState({dataLoading: false, deleteTaskSuccess: false});
      if (e.status == 401) {
        this.showAlert('', e.data.message);
      }
    }
  }

  onPressCancel() {
    if (this.state.deleteTaskSuccess) {
      this.props.navigation.goBack();
    }
    this.setState({showMessageModal: false});
  }

  onChangeTextName(text) {
    this.setState({groupName: text, isChange: false});
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

  async getGroupDetails() {
    let selectedTaskGroupId = this.state.selectedTaskGroupId;
    try {
      this.setState({dataLoading: true, isChange: true});
      let dataResult = await APIServices.getSingleGroupTaskData(
        selectedTaskGroupId,
      );
      if (dataResult.message == 'success') {
        this.setState({
          dataLoading: false,
          groupName: dataResult.data.taskGroupName,
        });
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
      this.showAlert('', 'Data loading error');
    }
  }

  async tabOpen() {
    let selectedTaskGroupId = this.props.selectedTaskGroupId;
    this.setState(
      {
        selectedTaskGroupId: selectedTaskGroupId,
      },
      () => {
        this.getGroupDetails();
      },
    );
  }

  render() {
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let groupName = this.state.groupName;
    let isChange = this.state.isChange;

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={payload => this.tabOpen(payload)} />
        <View style={styles.inputContainer}>
          <View style={[styles.addNewFieldView, {flexDirection: 'row'}]}>
            <TextInput
              style={[{width: '95%'}]}
              placeholder={'Add a group name'}
              value={groupName}
              onChangeText={groupName => this.onChangeTextName(groupName)}
            />
          </View>
          <TouchableOpacity
            style={{marginTop: 10}}
            disabled={isChange}
            onPress={() => this.renameGroup()}>
            <View style={styles.buttonEdit}>
              <View style={{flex: 1}}>
                <Text style={styles.buttonText}>{'Rename'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomView}>
          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => this.deleteGroupdeleteGroupAlert()}>
            <View style={styles.button}>
              <View style={{flex: 1}}>
                <Text style={styles.buttonText}>{'Delete list'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        {dataLoading && <Loader />}
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
          details={this.details}
          onPress={() => this.deleteGroupdeleteGroup(this)}
          onPressCancel={() => this.onPressCancel(this)}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightRed,
    borderRadius: '5rem',
    marginTop: '17rem',
    marginBottom: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonEdit: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    marginTop: '17rem',
    marginBottom: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
  },
  buttonText: {
    fontSize: '15rem',
    color: colors.white,
    lineHeight: '17rem',
    fontWeight: '400',
    fontFamily: 'CircularStd-Bold',
    textAlign: 'center',
  },
  inputContainer: {
    marginLeft: '10rem',
    marginRight: '5rem',
    marginTop: '20rem',
  },
  addNewFieldView: {
    backgroundColor: '#e5e9ef',
    borderRadius: '5rem',
    borderWidth: 2,
    borderColor: '#e5e9ef',
    marginTop: '10rem',
    marginBottom: '0rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '57rem',
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(EditTask);
