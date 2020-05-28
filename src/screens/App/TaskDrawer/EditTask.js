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

class EditTask extends Component {
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
      this.setState({dataLoading: true});
      try {
        resultObj = await APIServices.updateGroupTaskData(
          selectedTaskGroupId,
          groupName,
        );
        if (resultObj.message == 'success') {
          this.setState({dataLoading: false});
          this.showAlert('', 'Successfully Updated');
        } else {
          this.setState({dataLoading: false});
          this.showAlert('', 'Error');
        }
      } catch (e) {
        if (e.status == 401) {
          this.setState({dataLoading: false});
          this.showAlert('', e.data.message);
        }
      }
    }
  }

  deleteGroupdeleteGroupAlert() {
    Alert.alert(
      'Delete Group',
      'You are about to permanantly delete this group and all of its data.\n If you are not sure, you can cancel this action.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Ok', onPress: () => this.deleteGroupdeleteGroup()},
      ],
      {cancelable: false},
    );
  }

  async deleteGroupdeleteGroup() {
    let selectedTaskGroupId = this.state.selectedTaskGroupId;
    try {
      resultObj = await APIServices.deleteGroupTaskData(selectedTaskGroupId);
      if (resultObj.message == 'success') {
        this.setState({dataLoading: false, isChange: true});
        this.props.navigation.goBack();
      } else {
        this.setState({dataLoading: false});
        this.showAlert('', 'Error');
      }
    } catch (e) {
      if (e.status == 401) {
        this.setState({dataLoading: false});
        this.showAlert('', e.data.message);
      }
    }
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
    this.setState({dataLoading: true, isChange: true});
    dataResult = await APIServices.getSingleGroupTaskData(selectedTaskGroupId);
    if (dataResult.message == 'success') {
      this.setState({
        dataLoading: false,
        groupName: dataResult.data.taskGroupName,
      });
    } else {
      this.setState({dataLoading: false});
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
    borderRadius: 5,
    marginTop: '17rem',
    marginBottom: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonEdit: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
    marginTop: '17rem',
    marginBottom: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
  },
  buttonText: {
    fontSize: '15rem',
    color: colors.white,
    lineHeight: '17rem',
    fontWeight: '400',
    fontFamily: 'CircularStd-Bold',
    textAlign: 'center', // <-- the magic
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
    marginRight: 10,
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
    marginRight: 15,
    marginLeft: 10,
  },
  checkBoxContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTaskTextContainer: {
    flex: 8,
  },
  inputContainer: {
    marginLeft: '10rem',
    marginRight: '5rem',
    marginTop: '20rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  addNewFieldView: {
    backgroundColor: '#e5e9ef',
    borderRadius: 5,
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
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(EditTask);
