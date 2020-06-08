import React, {Component} from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  Text,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../../redux/actions';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import colors from '../../../../config/colors';
import icons from '../../../../asserts/icons/icons';
import RoundCheckbox from 'rn-round-checkbox';
import _ from 'lodash';
import AwesomeAlert from 'react-native-awesome-alerts';
import APIServices from '../../../../services/APIServices';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../../components/Loader';

class MyTaskAddEditSubTaskScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      screenType: '',
      subTask: {},
      subTaskName: '',
      isSelected: false,
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      dataLoading: false,
      taskID: '',
      subTaskID: '',
    };
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let screenType = params.screenType;
    let taskID = params.taskID;
    if (screenType == 'add') {
      this.setState({
        screenType: 'add',
        taskID: taskID,
      });
    } else {
      let item = params.item;
      this.setState({
        screenType: 'edit',
        subTask: item,
        subTaskName: item.subtaskName,
        isSelected: item.subtaskStatus,
        taskID: taskID,
        subTaskID: item.subtaskId,
      });
    }
  }

  toggleCheckBox(newValue) {
    this.setState({isSelected: !this.state.isSelected});
    console.log(newValue);
  }

  addEditSubTask() {
    let screenType = this.state.screenType;
    if (screenType == 'add') {
      AsyncStorage.getItem('userID').then(userID => {
        if (userID) {
          this.addSubTask(userID);
        }
      });
    } else {
      AsyncStorage.getItem('userID').then(userID => {
        if (userID) {
          this.editSubTask(userID);
        }
      });
    }
  }

  async editSubTask(userID) {
    let isSelected = this.state.isSelected;
    let subTaskName = this.state.subTaskName;
    let taskID = this.state.taskID;
    let subTaskID = this.state.subTaskID;

    if (!subTaskName && _.isEmpty(subTaskName)) {
      this.showAlert('', 'Please Enter the Sub Task Name');
    } else {
      this.setState({dataLoading: true});
      try {
        resultObj = await APIServices.myTaskUpdateSubTask(
          userID,
          taskID,
          subTaskID,
          subTaskName,
          isSelected,
        );
        if (resultObj.message == 'success') {
          this.setState({dataLoading: false});
          this.props.addEditSubTaskSuccess(true);
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
  }

  async addSubTask(userID) {
    let isSelected = this.state.isSelected;
    let subTaskName = this.state.subTaskName;
    let taskID = this.state.taskID;

    if (!subTaskName && _.isEmpty(subTaskName)) {
      this.showAlert('', 'Please Enter the Sub Task Name');
    } else {
      this.setState({dataLoading: true});
      try {
        resultObj = await APIServices.myTaskAddSubTask(
          userID,
          taskID,
          subTaskName,
        );
        if (resultObj.message == 'success') {
          this.setState({dataLoading: false});
          this.props.addEditSubTaskSuccess(true);
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

  render() {
    let dataLoading = this.state.dataLoading;
    let screenType = this.state.screenType;
    let isSelected = this.state.isSelected;
    let subTaskName = this.state.subTaskName;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <View style={styles.checkBoxContainer}>
            <RoundCheckbox
              size={24}
              checked={isSelected}
              backgroundColor={colors.lightGreen}
              onValueChange={newValue => this.toggleCheckBox(newValue)}
              borderColor={'gray'}
            />
          </View>
          <View style={styles.subTaskTextContainer}>
            <TextInput
              style={[styles.textInput, {width: '95%'}]}
              placeholder={'Sub Task Name'}
              value={subTaskName}
              placeholderTextColor={colors.placeholder}
              onChangeText={subTaskName => this.setState({subTaskName})}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.bottomContainer}
          onPress={() => this.addEditSubTask()}>
          <View style={styles.button}>
            <Image
              style={styles.bottomBarIcon}
              source={icons.taskWhite}
              resizeMode={'contain'}
            />
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>
                {screenType == 'add' ? 'Add Sub Task' : 'Edit Sub Task'}
              </Text>
            </View>

            <Image
              style={styles.addIcon}
              source={icons.add}
              resizeMode={'contain'}
            />
          </View>
        </TouchableOpacity>
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
    backgroundColor: colors.lightBlue,
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
    flexDirection: 'row',
    marginLeft: '10rem',
    marginRight: '10rem',
    marginTop: '40rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: 15,
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MyTaskAddEditSubTaskScreen);
