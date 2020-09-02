import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../../redux/actions';
import colors from '../../../../config/colors';
import icons from '../../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Loader from '../../../../components/Loader';
import APIServices from '../../../../services/APIServices';
import {NavigationEvents} from 'react-navigation';
import AwesomeAlert from 'react-native-awesome-alerts';

class MyTaskSubTaskScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTaskID: '',
      userID: '',
      subTasks: [],
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.myTaskAddEditSubTask !== this.props.myTaskAddEditSubTask &&
      this.props.myTaskAddEditSubTask
    ) {
      let userID = this.state.userID;
      this.fetchData(userID);
      this.props.addEditSubTaskSuccess(false);
    }
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let selectedTaskID = params.selectedTaskID;
    this.setState(
      {
        selectedTaskID: selectedTaskID,
      },
      function() {
        this.fetchData();
      },
    );
  }

  async fetchData() {
    let selectedTaskID = this.state.selectedTaskID;
    this.setState({dataLoading: true});
    let subTaskData = await APIServices.getMyTaskSubTaskData(selectedTaskID);
    if (subTaskData.message == 'success') {
      this.setState({
        subTasks: subTaskData.data,
        dataLoading: false,
      });
    } else {
      this.setState({dataLoading: false});
    }
  }

  async deleteSubTask(item) {
    let selectedTaskID = this.state.selectedTaskID;
    this.setState({dataLoading: true});
    try {
      let resultObj = await APIServices.myTaskdeleteSubTask(
        selectedTaskID,
        item.subtaskId,
      );
      if (resultObj.message == 'success') {
        this.setState({dataLoading: false});
        this.fetchData();
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      if (e.status == 401) {
        this.setState({dataLoading: false});
        this.showAlert('', e.data.message);
      }
    }
  }

  deleteSubTaskAlert(item) {
    Alert.alert(
      'Delete Sub task',
      'You are about to permanently delete this sub task and all of its data. \nIf you are not sure, you can close this pop up.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Ok', onPress: () => this.deleteSubTask(item)},
      ],
      {cancelable: false},
    );
  }

  editSubTask(item) {
    let selectedTaskID = this.state.selectedTaskID;
    this.props.navigation.navigate('MyTaskAddEditSubTaskScreen', {
      item: item,
      taskID: selectedTaskID,
      screenType: 'edit',
    });
  }

  addSubTask() {
    let selectedTaskID = this.state.selectedTaskID;
    this.props.navigation.navigate('MyTaskAddEditSubTaskScreen', {
      item: {},
      taskID: selectedTaskID,
      screenType: 'add',
    });
  }

  loadSubtasks() {}

  renderSubTaskListList(item) {
    return (
      <View style={styles.subTaskView}>
        <NavigationEvents onWillFocus={payload => this.loadSubtasks(payload)} />
        <Image
          source={item.subtaskStatus ? icons.rightCircule : icons.whiteCircule}
          style={styles.taskStateIcon}
        />
        <View style={{flex: 1}}>
          <Text style={styles.text}>{item.subtaskName}</Text>
        </View>
        <View style={styles.controlView}>
          <TouchableOpacity onPress={() => this.editSubTask(item)}>
            <Image style={styles.editIconStyle} source={icons.editRoundWhite} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.deleteSubTaskAlert(item)}
            style={{marginLeft: EStyleSheet.value('20rem')}}>
            <Image
              style={styles.editDeleteIcon}
              source={icons.deleteRoundRed}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  onBackPress() {
    this.props.navigation.goBack();
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
    let subTasks = this.state.subTasks;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flalList}
          data={subTasks}
          renderItem={({item}) => this.renderSubTaskListList(item)}
          keyExtractor={item => item.subtaskId}
        />
        <TouchableOpacity onPress={() => this.addSubTask()}>
          <View style={styles.button}>
            <Image
              style={styles.bottomBarIcon}
              source={icons.taskWhite}
              resizeMode={'contain'}
            />
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>Add new Sub Task</Text>
            </View>

            <Image
              style={styles.addIcon}
              source={icons.add}
              resizeMode={'contain'}
            />
          </View>
        </TouchableOpacity>
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
        {dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  subTaskView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    height: '60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '12rem',
    color: colors.userListUserNameColor,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  flalList: {
    marginTop: '20rem',
    marginBottom: '0rem',
  },
  taskStateIcon: {
    width: '30rem',
    height: '30rem',
  },
  editDeleteIcon: {
    width: '23rem',
    height: '23rem',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    marginTop: '17rem',
    marginBottom: '17rem',
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
    marginRight: '10rem',
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
    marginRight: '15rem',
    marginLeft: '10rem',
  },
  editIconStyle: {
    width: '26rem',
    height: '26rem',
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
    myTaskAddEditSubTask: state.tasks.myTaskAddEditSubTask,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(MyTaskSubTaskScreen);
