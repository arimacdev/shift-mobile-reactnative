import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import APIServices from '../../../services/APIServices';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-community/async-storage';
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import _ from 'lodash';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker from 'react-native-document-picker';
import moment from 'moment';
import Loader from '../../../components/Loader';
import ImagePicker from 'react-native-image-picker';
import MessageShowModal from '../../../components/MessageShowModal';

let dropData = [
  {
    value: 'Pending',
  },
  {
    value: 'Implementing',
  },
  {
    value: 'QA',
  },
  {
    value: 'Ready to Deploy',
  },
  {
    value: 'Reopened',
  },
  {
    value: 'Deployed',
  },
  {
    value: 'Close',
  },
];

let operationalData = [
  {
    value: 'Development',
  },
  {
    value: 'QA',
  },
  {
    value: 'Design',
  },
  {
    value: 'Bug',
  },
  {
    value: 'Operational',
  },
  {
    value: 'Pre-sales',
  },
  {
    value: 'General',
  },
];

let issueTypeList = [
  {value: 'Development', id: 'development'},
  {value: 'QA', id: 'qa'},
  {value: 'Design', id: 'design'},
  {value: 'Bug', id: 'bug'},
  {value: 'Operational', id: 'operational'},
  {value: 'Pre-sales', id: 'preSales'},
  {value: 'General', id: 'general'},
];

let successDetails = {
  icon: icons.taskBlue,
  type: 'success',
  title: 'Success',
  description: 'You have created a task successfully',
  buttons: {},
};

class AddNewTasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: '',
      index: 0,
      bottomItemPressColor: colors.darkBlue,
      showPicker: false,
      showTimePicker: false,
      selectedDate: '',
      date: new Date(),
      selectedTime: '',
      time: new Date(),
      selectedDateReminder: '',
      selectedTimeReminder: '',
      dateReminder: new Date(),
      timeReminder: new Date(),
      mode: 'date',
      reminder: false,
      files: [],
      notes: '',
      dropPeopleData: [],
      dropSprintData: [],
      dropParentData: [],
      selectedAssignee: 'Assignee',
      selectedParentTask: 'No Parent',
      selectedStatus: 'Status',
      selectedOperarionalStatus: 'General',
      initiator: null,
      assigneeId: '',
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      reminderTime: '',
      selectedDateValue: '',
      selectedDateReminderValue: '',
      sprintStatus: 'Sprint',
      isDateNeedLoading: false,
      sprintId: '',
      parentTaskStatus: 'No parent',
      parentTaskId: '',
      selectedOperarionalId: '',
      selectedOperarionalId: 'general',
      viewSprint: true,
      selectSprintName: '',
      showMessageModal: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.addTaskToProjectError !== this.props.addTaskToProjectError &&
      this.props.addTaskToProjectError &&
      this.props.addTaskToProjectErrorMessage == ''
    ) {
      this.showAlert('', 'Error While creating Task');
    }

    if (
      prevProps.addTaskToProjectError !== this.props.addTaskToProjectError &&
      this.props.addTaskToProjectError &&
      this.props.addTaskToProjectErrorMessage != ''
    ) {
      this.showAlert('', this.props.addTaskToProjectErrorMessage);
    }

    if (
      prevProps.addTaskToProjectSuccess !==
        this.props.addTaskToProjectSuccess &&
      this.props.addTaskToProjectSuccess
    ) {
      const taskID = this.props.taskId.data.taskId;

      // Alert.alert(
      //   'Success',
      //   'Task successfully added',
      //   [{text: 'OK', onPress: () => this.onSuccess('sssssssssssssssssssss')}],
      //   {cancelable: false},
      // );

      this.setState({showMessageModal: true});

      let files = this.state.files;
      if (files && files.length > 0) {
        this.uploadFiles(this.state.files, taskID);
      }
      // this.uploadFiles(this.state.files, 'b6ba3dcf-4494-4bb5-80dc-17376c628187')
    }
  }

  onPressCancel() {
    this.setState({showMessageModal: false});
    this.onSuccess('success');
  }

  onSuccess(text) {
    // const {navigation} = this.props;
    this.props.onSuccess(text);
    // navigation.goBack();
  }

  async componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    const activeUsers = await APIServices.getAllUsersByProjectId(
      this.props.selectedProjectID,
    );
    if (activeUsers.message == 'success') {
      let userList = [];
      for (let i = 0; i < activeUsers.data.length; i++) {
        if (activeUsers.data[i].firstName && activeUsers.data[i].lastName) {
          userList.push({
            id: activeUsers.data[i].userId,
            value:
              activeUsers.data[i].firstName +
              ' ' +
              activeUsers.data[i].lastName,
          });
        }
      }
      this.setState({
        dropPeopleData: userList,
        // dataLoading : false
      });
    } else {
      this.setState({dataLoading: false});
    }
    this.getAllSprintInProject(this.props.selectedProjectID);
    this.getAllParentTasks(this.props.selectedProjectID);
  }

  async getAllSprintInProject(selectedProjectID) {
    // let selectedProjectID = this.props.selectedProjectID;
    this.setState({dataLoading: true});
    let sprintData = await APIServices.getAllSprintInProject(selectedProjectID);
    if (sprintData.message == 'success') {
      let sprintsArray = [];
      for (let i = 0; i < sprintData.data.length; i++) {
        let sprintObj = sprintData.data[i];
        let sprintID = sprintObj.sprintId;
        let sprintName = sprintObj.sprintName;
        // let taskArray = [];
        // taskArray =  taskData.filter(function(obj) {
        //     return obj.sprintId == sprintID;
        // });
        // sprintObj.tasks = taskArray;
        sprintsArray.push({
          id: sprintID,
          value: sprintName,
        });
      }
      this.setState({dropSprintData: sprintsArray, dataLoading: false});
      // this.setState({dataLoading:false,sprints:sprintsArray});
    } else {
      this.setState({dataLoading: false});
    }
  }

  async getAllParentTasks(selectedProjectID) {
    let userID = await AsyncStorage.getItem('userID');
    // let selectedProjectID = this.props.selectedProjectID;
    this.setState({dataLoading: true});
    let parentTaskData = await APIServices.getAllTaskInProjectsData(
      userID,
      selectedProjectID,
    );
    if (parentTaskData.message == 'success') {
      let taskModalData = [{id: 0, value: 'No parent'}];
      for (let index = 0; index < parentTaskData.data.length; index++) {
        const element = parentTaskData.data[index];
        if (element.parentTask) {
          taskModalData.push({
            id: element.parentTask.taskId,
            value: element.parentTask.taskName,
          });
        }
      }
      console.log('taskModalData', taskModalData);
      this.setState({dropParentData: taskModalData, dataLoading: false});
    } else {
      this.setState({dataLoading: false});
    }
  }

  onTaskNameChange(text) {
    this.setState({taskName: text});
  }

  renderBase() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Image style={styles.dropIcon} source={icons.arrowDark} />
      </View>
    );
  }

  showDatePicker = () => {
    this.setState({showPicker: true});
  };

  hideDatePicker = () => {
    this.setState({showPicker: false});
  };

  handleDateConfirm = date => {
    this.hideDatePicker();
    this.setState({isDateNeedLoading: true});
    let date1 = new Date(date);
    let newDate = '';
    let newDateValue = '';
    if (this.state.reminder) {
      newDate = moment(date1).format('Do MMMM YYYY');
      newDateValue = moment(date1).format('DD MM YYYY');
    } else {
      newDate = moment(date1).format('Do MMMM YYYY');
      newDateValue = moment(date1).format('DD MM YYYY');
    }
    if (this.state.reminder) {
      this.setState({
        selectedDateReminder: newDate,
        selectedDateReminderValue: newDateValue,
        dateReminder: new Date(date1),
      });
    } else {
      this.setState({
        selectedDate: newDate,
        selectedDateValue: newDateValue,
        date: new Date(date1),
      });
    }
    setTimeout(() => {
      this.setState({
        isDateNeedLoading: false,
        showTimePicker: true,
      });
    }, 500);
  };

  showTimePicker = () => {
    this.setState({showTimePicker: true});
  };

  hideTimePicker = () => {
    this.setState({showTimePicker: false});
  };

  handleTimeConfirm = time1 => {
    console.log(time1, 'time');
    this.hideTimePicker();
    let time = new Date(time1);
    let newTime = moment(time).format('hh:mmA');
    // let newTime = time.getHours() + ':' + time.getMinutes();
    // if (event.type == 'set') {
    if (this.state.reminder) {
      this.setState({
        selectedTimeReminder: newTime,
        showPicker: false,
        showTimePicker: false,
        timeReminder: new Date(time1),
      });
    } else {
      this.setState({
        selectedTime: newTime,
        showPicker: false,
        showTimePicker: false,
        time: new Date(time1),
      });
    }
    this.setState({showPicker: true});
  };

  hideDatePicker = () => {
    this.setState({showPicker: false});
  };

  handleDateConfirm = date => {
    this.hideDatePicker();
    this.setState({isDateNeedLoading: true});
    let date1 = new Date(date);
    let newDate = '';
    let newDateValue = '';
    if (this.state.reminder) {
      newDate = moment(date1).format('Do MMMM YYYY');
      newDateValue = moment(date1).format('DD MM YYYY');
    } else {
      newDate = moment(date1).format('Do MMMM YYYY');
      newDateValue = moment(date1).format('DD MM YYYY');
    }
    if (this.state.reminder) {
      this.setState({
        selectedDateReminder: newDate,
        selectedDateReminderValue: newDateValue,
        dateReminder: new Date(date1),
      });
    } else {
      this.setState({
        selectedDate: newDate,
        selectedDateValue: newDateValue,
        date: new Date(date1),
      });
    }
    setTimeout(() => {
      this.setState({
        isDateNeedLoading: false,
        showTimePicker: true,
      });
    }, 500);
  };

  showTimePicker = () => {
    this.setState({showTimePicker: true});
  };

  hideTimePicker = () => {
    this.setState({showTimePicker: false});
  };

  handleTimeConfirm = time1 => {
    console.log(time1, 'time');
    this.hideTimePicker();
    let time = new Date(time1);
    let newTime = moment(time).format('hh:mmA');
    // let newTime = time.getHours() + ':' + time.getMinutes();
    // if (event.type == 'set') {
    if (this.state.reminder) {
      this.setState({
        selectedTimeReminder: newTime,
        showPicker: false,
        showTimePicker: false,
        timeReminder: new Date(time1),
      });
    } else {
      this.setState({
        selectedTime: newTime,
        showPicker: false,
        showTimePicker: false,
        time: new Date(time1),
      });
    }
    // } else {
    //   this.setState({
    //     showPicker: false,
    //     showTimePicker: false,
    //   });
    // }
  };

  onChangeDate(event, selectedDate) {
    let date = new Date(selectedDate);
    let newDate = '';
    let newDateValue = '';

    if (this.state.reminder) {
      newDate = moment(date).format('Do MMMM YYYY');
      newDateValue = moment(date).format('DD MM YYYY');
    } else {
      newDate = moment(date).format('Do MMMM YYYY');
      newDateValue = moment(date).format('DD MM YYYY');
    }
    if (event.type == 'set') {
      if (this.state.reminder) {
        this.setState({
          selectedDateReminder: newDate,
          selectedDateReminderValue: newDateValue,
          showPicker: false,
          showTimePicker: true,
          dateReminder: new Date(selectedDate),
        });
      } else {
        this.setState({
          selectedDate: newDate,
          selectedDateValue: newDateValue,
          showPicker: false,
          showTimePicker: true,
          date: new Date(selectedDate),
        });
      }
    }
    // event.dismissed
    // event.set
  }

  onChangeTime(event, selectedTime) {
    let time = new Date(selectedTime);
    let newTime = moment(time).format('hh:mmA');
    // let newTime = time.getHours() + ':' + time.getMinutes();

    if (event.type == 'set') {
      if (this.state.reminder) {
        this.setState({
          selectedTimeReminder: newTime,
          showPicker: false,
          showTimePicker: false,
          timeReminder: new Date(selectedTime),
        });
      } else {
        this.setState({
          selectedTime: newTime,
          showPicker: false,
          showTimePicker: false,
          time: new Date(selectedTime),
        });
      }
    } else {
      this.setState({
        showPicker: false,
        showTimePicker: false,
      });
    }
  }

  renderDatePicker() {
    if (Platform.OS == 'ios') {
      return (
        <View>
          <DateTimePickerModal
            isVisible={this.state.showPicker}
            mode="date"
            onConfirm={this.handleDateConfirm}
            onCancel={this.hideDatePicker}
          />
        </View>
      );
    } else {
      return (
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={
            this.state.reminder == true
              ? this.state.dateReminder
              : this.state.date
          }
          mode={this.state.mode}
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) =>
            this.onChangeDate(event, selectedDate)
          }
        />
      );
    }
  }

  renderTimePicker() {
    if (Platform.OS == 'ios') {
      return (
        <View>
          <DateTimePickerModal
            isVisible={this.state.showTimePicker}
            mode="time"
            onConfirm={this.handleTimeConfirm}
            onCancel={this.hideTimePicker}
          />
        </View>
      );
    } else {
      return (
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={
            this.state.reminder == true
              ? this.state.timeReminder
              : this.state.time
          }
          mode={'time'}
          is24Hour={true}
          display="default"
          onChange={(event, selectedTime) =>
            this.onChangeTime(event, selectedTime)
          }
        />
      );
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

  renderDocPickeredView(item) {
    return (
      <View
        style={{
          width: 165,
          height: 50,
          flexDirection: 'row',
          backgroundColor: colors.white,
          borderRadius: 5,
          marginRight: 5,
          marginBottom: 5,
        }}>
        <View style={{justifyContent: 'center', marginLeft: 10}}>
          <Image
            style={styles.gallaryIcon}
            source={icons.gallary}
            resizeMode={'contain'}
          />
        </View>

        <View
          style={{
            flexDirection: 'column',
            marginLeft: 10,
            justifyContent: 'center',
            flex: 1,
          }}>
          <Text style={{marginTop: -2}}>
            {item.name.substring(0, 5)}...{item.name.substr(-7)}
          </Text>
          <Text style={{fontSize: 10, marginTop: -2, color: colors.lightgray}}>
            {item.dateTime}
          </Text>
        </View>

        <View
          style={{
            justifyContent: 'flex-start',
            marginRight: 4,
            marginTop: 4,
            // backgroundColor:'red'
          }}>
          <TouchableOpacity onPress={() => this.onFilesCrossPress(item.uri)}>
            <Image
              style={styles.cross}
              source={icons.cross}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  async iOSFilePicker() {
    Alert.alert(
      'Add Files',
      'Select the file source',
      [
        {text: 'Camera', onPress: () => this.selectCamera()},
        {text: 'Gallery', onPress: () => this.selectGallery()},
        {text: 'Files', onPress: () => this.doumentPicker()},
        {text: 'Cancel', onPress: () => console.log('Back')},
      ],
      {
        cancelable: true,
      },
    );
  }

  async selectCamera() {
    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };
    ImagePicker.launchCamera(options, res => {
      if (res.didCancel) {
      } else if (res.error) {
      } else if (res.customButton) {
      } else {
        this.setImageForFile(res);
      }
    });
  }

  async selectGallery() {
    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };

    ImagePicker.launchImageLibrary(options, res => {
      if (res.didCancel) {
      } else if (res.error) {
      } else if (res.customButton) {
      } else {
        this.setImageForFile(res);
      }
    });
  }

  async setImageForFile(res) {
    this.onFilesCrossPress(res.uri);
    let imgName = res.fileName;
    if (typeof imgName === 'undefined' || imgName == null) {
      var getFilename = res.uri.split('/');
      imgName = getFilename[getFilename.length - 1];
    }
    await this.state.files.push({
      uri: res.uri,
      type: res.type, // mime type
      name: imgName,
      size: res.fileSize,
      dateTime:
        moment().format('YYYY/MM/DD') + ' | ' + moment().format('HH:mm'),
    });
    this.setState({files: this.state.files});
  }

  async doumentPicker() {
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.plainText,
          DocumentPicker.types.pdf,
        ],
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
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size,
        );
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

  onNotesChange(text) {
    this.setState({notes: text});
  }

  selectAssignee = value => {
    this.setState({selectedAssignee: value});
    for (let i = 0; i < this.state.dropPeopleData.length; i++) {
      if (value == this.state.dropPeopleData[i].value) {
        this.setState({assigneeId: this.state.dropPeopleData[i].id});
      }
    }
  };

  selectStatus = value => {
    this.setState({selectedStatus: value});
  };

  selectOperationalStatus = (value, index, data) => {
    let selectedIssueId = data[index].id;
    let selectedIssueName = data[index].value;
    this.setState({
      selectedOperarionalStatus: selectedIssueName,
      selectedOperarionalId: selectedIssueId,
    });
  };

  setParentTask = (value, index, data) => {
    let parentTaskId = data[index].id;
    let parentTaskName = data[index].value;
    if (parentTaskId == 0) {
      this.setState({
        parentTaskStatus: parentTaskName,
        parentTaskId: '',
      });
    } else {
      this.setState({
        parentTaskStatus: parentTaskName,
        parentTaskId: parentTaskId,
      });
    }
   
    if (parentTaskName && parentTaskName == 'No parent') {
      this.setState({viewSprint: true});
    } else {
      this.setState({viewSprint: false, sprintId: ''});
      this.setRelevantSprint(parentTaskId);
    }
  };

  async setRelevantSprint(parentTaskId) {
    let selectedProjectID = this.props.selectedProjectID;
    this.setState({dataLoading: true});
    try {
      let taskResult = await APIServices.getProjecTaskData(
        selectedProjectID,
        parentTaskId,
      );
      if (taskResult.message == 'success') {
        this.setSprintId(taskResult);
        this.setState({dataLoading: false});
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  setSprintId(taskResult) {
    let dropSprintData = this.state.dropSprintData;
    let sprintId = taskResult.data.sprintId;
    this.setState({sprintId: sprintId});
    let result = dropSprintData.find(({id}) => id == sprintId);
    if (result != undefined) {
      this.setState({
        selectSprintName: result.value,
      });
    }
    if (sprintId == 'default') {
      this.setState({
        selectSprintName: 'Default',
      });
    }
  }

  selectSprintStatus = (value, index, data) => {
    let sprintId = data[index].id;
    let sprintName = data[index].value;
    this.setState({sprintStatus: sprintName, sprintId: sprintId});
  };

  async addNewTask() {
    await AsyncStorage.getItem('userID').then(userID => {
      if (userID) {
        this.setState({initiator: userID});
      }
    });
    let taskName = this.state.taskName;
    let initiator = this.state.initiator;
    let assigneeId = this.state.assigneeId;
    let selectedStatus = this.state.selectedStatus;
    let issueType = this.state.selectedOperarionalId;
    let parentTaskId = this.state.parentTaskId;
    let sprintId = this.state.sprintId;
    let selectedStatusEnum = null;
    if (selectedStatus != '') {
      switch (selectedStatus) {
        case 'Open':
          selectedStatusEnum = 'open';
          break;
        case 'Pending':
          selectedStatusEnum = 'pending';
          break;
        case 'Implementing':
          selectedStatusEnum = 'implementing';
          break;
        case 'QA':
          selectedStatusEnum = 'qa';
          break;
        case 'Ready to Deploy':
          selectedStatusEnum = 'readyToDeploy';
          break;
        case 'Reopened':
          selectedStatusEnum = 'reOpened';
          break;
        case 'Deployed':
          selectedStatusEnum = 'deployed';
          break;
        case 'Closed':
          selectedStatusEnum = 'closed';
          break;
      }
    }
    let selectedDateReminder = this.state.selectedDateReminderValue;
    let selectedTimeReminder = this.state.selectedTimeReminder;
    let notes = this.state.notes;
    let dueDate = this.state.selectedDateValue;
    let dueTime = this.state.selectedTime;

    let IsoDueDate = dueDate
      ? moment(dueDate + dueTime, 'DD/MM/YYYY hh:mmA').format(
          'YYYY-MM-DD[T]HH:mm:ss',
        )
      : '';
    let IsoReminderDate = selectedDateReminder
      ? moment(
          selectedDateReminder + selectedTimeReminder,
          'DD/MM/YYYY hh:mmA',
        ).format('YYYY-MM-DD[T]HH:mm:ss')
      : '';
    if (
      this.validateData(taskName, assigneeId, selectedDateReminder, dueDate)
    ) {
      this.props.addTaskToProject(
        taskName,
        initiator,
        assigneeId,
        selectedStatusEnum,
        IsoDueDate,
        IsoReminderDate,
        notes,
        this.props.selectedProjectID,
        issueType,
        parentTaskId,
        sprintId,
      );
    }
  }

  uploadFiles(file, taskId) {
    this.props.addFileToTask(file, taskId, this.props.selectedProjectID);
  }

  validateData(taskName, assigneeId, selectedDateReminder, dueDate) {
    let momentDue = moment(dueDate, 'DD-MM-YYYY').format('YYYY-MM-DD');
    let momentReminder = moment(selectedDateReminder, 'DD-MM-YYYY').format(
      'YYYY-MM-DD',
    );

    if (!taskName && _.isEmpty(taskName)) {
      this.showAlert('', 'Please enter a name for the task');
      return false;
    }
    if (selectedDateReminder && !_.isEmpty(selectedDateReminder)) {
      if (!moment(momentDue).isSameOrAfter(momentReminder, 'day')) {
        this.showAlert('', 'Reminder date must be earlier than Due date');
        return false;
      }
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

  render() {
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let addFileTaskLoading = this.props.addFileTaskLoading;
    let addTaskToProjectLoading = this.props.addTaskToProjectLoading;
    let dropSprintData = this.props.dropSprintData;
    let viewSprint = this.state.viewSprint;
    let selectSprintName = this.state.selectSprintName;

    return (
      <View>
        <ScrollView style={{marginBottom: EStyleSheet.value('90rem')}}>
          <View
            style={[
              styles.taskFieldView,
              {marginTop: EStyleSheet.value('25rem')},
            ]}>
            <TextInput
              style={[styles.textInput, {width: '95%'}]}
              placeholder={'Task name*'}
              value={this.state.taskName}
              onChangeText={text => this.onTaskNameChange(text)}
            />
          </View>
          <View style={styles.taskFieldView}>
            <Dropdown
              style={{paddingLeft: 5}}
              label=""
              labelFontSize={0}
              fontSize={13}
              data={this.state.dropPeopleData}
              textColor={colors.gray}
              error={''}
              animationDuration={0.5}
              containerStyle={{width: '100%'}}
              overlayStyle={{width: '100%'}}
              pickerStyle={styles.dropPickerStyle}
              dropdownPosition={0}
              value={this.state.selectedAssignee}
              itemColor={'black'}
              selectedItemColor={'black'}
              onChangeText={value => this.selectAssignee(value)}
              // onChangeText={(value)=>{this.selectAssignee(item.name, value)}}
              dropdownOffset={{top: 10}}
              baseColor={colors.projectBgColor}
              // renderBase={this.renderBase}
              renderAccessory={this.renderBase}
              itemTextStyle={{marginLeft: 15}}
              itemPadding={10}
            />
          </View>
          <View style={styles.taskFieldView}>
            <Dropdown
              style={{paddingLeft: 5}}
              label="Parent Task"
              labelFontSize={11}
              fontSize={13}
              data={this.state.dropParentData}
              textColor={colors.gray}
              error={''}
              animationDuration={0.5}
              containerStyle={{width: '100%'}}
              overlayStyle={{width: '100%'}}
              pickerStyle={styles.dropPickerStyle}
              dropdownPosition={0}
              value={this.state.parentTaskStatus}
              itemColor={'black'}
              selectedItemColor={'black'}
              onChangeText={this.setParentTask}
              // onChangeText={(value)=>{this.selectAssignee(item.name, value)}}
              dropdownOffset={{top: 10}}
              baseColor={colors.projectBgColor}
              // renderBase={this.renderBase}
              renderAccessory={this.renderBase}
              itemTextStyle={{marginLeft: 15}}
              itemPadding={10}
            />
          </View>
          <View style={styles.subTitleStyle}>
            <Text style={styles.subTitleText}>Task Type</Text>
          </View>
          <View style={styles.taskFieldView}>
            <Dropdown
              style={{paddingLeft: 5}}
              label=""
              labelFontSize={0}
              fontSize={13}
              data={issueTypeList}
              textColor={colors.gray}
              error={''}
              animationDuration={0.5}
              containerStyle={{width: '100%'}}
              overlayStyle={{width: '100%'}}
              pickerStyle={styles.dropPickerStyle}
              dropdownPosition={0}
              value={this.state.selectedOperarionalStatus}
              itemColor={'black'}
              selectedItemColor={'black'}
              dropdownOffset={{top: 10}}
              baseColor={colors.projectBgColor}
              onChangeText={this.selectOperationalStatus}
              // renderBase={this.renderBase}
              renderAccessory={this.renderBase}
              itemTextStyle={{marginLeft: 15}}
              itemPadding={10}
            />
          </View>

          <View style={styles.taskFieldView}>
            <Dropdown
              style={{paddingLeft: 5}}
              label=""
              labelFontSize={0}
              fontSize={13}
              data={dropData}
              textColor={colors.gray}
              error={''}
              animationDuration={0.5}
              containerStyle={{width: '100%'}}
              overlayStyle={{width: '100%'}}
              pickerStyle={styles.dropPickerStyle}
              dropdownPosition={0}
              value={this.state.selectedStatus}
              itemColor={'black'}
              selectedItemColor={'black'}
              dropdownOffset={{top: 10}}
              baseColor={colors.projectBgColor}
              onChangeText={value => this.selectStatus(value)}
              // renderBase={this.renderBase}
              renderAccessory={this.renderBase}
              itemTextStyle={{marginLeft: 15}}
              itemPadding={10}
            />
          </View>

          <View style={styles.subTitleStyle}>
            <Text style={styles.subTitleText}>Board</Text>
          </View>

          <View style={styles.taskFieldView}>
            {viewSprint ? (
              <Dropdown
                style={{paddingLeft: 5}}
                label=""
                labelFontSize={0}
                fontSize={13}
                data={this.state.dropSprintData}
                textColor={colors.gray}
                error={''}
                animationDuration={0.5}
                containerStyle={{width: '100%'}}
                overlayStyle={{width: '100%'}}
                pickerStyle={styles.dropPickerStyle}
                dropdownPosition={0}
                value={this.state.sprintStatus}
                itemColor={'black'}
                selectedItemColor={'black'}
                dropdownOffset={{top: 10}}
                baseColor={colors.projectBgColor}
                // onChangeText={value => this.selectSprintStatus(value)}
                onChangeText={this.selectSprintStatus}
                // renderBase={this.renderBase}
                renderAccessory={this.renderBase}
                itemTextStyle={{marginLeft: 15}}
                itemPadding={10}
              />
            ) : (
              <Text style={styles.sprintText}>{selectSprintName}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() =>
              this.setState({showPicker: true, reminder: false, mode: 'date'})
            }>
            <View style={[styles.taskFieldView, {flexDirection: 'row'}]}>
              <Text style={[styles.textInput, {flex: 1}]}>
                {this.state.selectedDate == ''
                  ? 'Due Date'
                  : this.state.selectedTime + ' ' + this.state.selectedDate}
              </Text>
              <Image
                style={styles.calendarIcon}
                source={icons.calendar}
                resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({showPicker: true, reminder: true, mode: 'date'})
            }>
            <View style={[styles.taskFieldView, {flexDirection: 'row'}]}>
              <Text style={[styles.textInput, {flex: 1}]}>
                {this.state.selectedDateReminder == ''
                  ? 'Reminder'
                  : this.state.selectedTimeReminder +
                    ' ' +
                    this.state.selectedDateReminder}
              </Text>
              <Image
                style={styles.calendarIcon}
                source={icons.calendar}
                resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Platform.OS == 'ios' ? this.iOSFilePicker() : this.doumentPicker()
            }>
            {this.state.files.length > 0 ? (
              <View
                style={[
                  styles.taskFieldDocPickView,
                  {flexDirection: 'row', flexWrap: 'wrap'},
                ]}>
                {this.state.files.map(item => {
                  return this.renderDocPickeredView(item);
                })}
              </View>
            ) : (
              <View style={[styles.taskFieldView, {flexDirection: 'row'}]}>
                <Image
                  style={[styles.calendarIcon, {marginRight: 10}]}
                  source={icons.upload}
                  resizeMode={'contain'}
                />
                <Text style={[styles.textInput, {flex: 1}]}>Add files</Text>
              </View>
            )}
          </TouchableOpacity>
          <View style={[styles.taskFieldView, {height: 160}]}>
            <TextInput
              style={[
                styles.textInput,
                {width: '95%', textAlignVertical: 'top', height: 150},
              ]}
              placeholder={'Notes'}
              value={this.state.notes}
              multiline={true}
              onChangeText={text => this.onNotesChange(text)}
            />
          </View>
          <TouchableOpacity onPress={() => this.addNewTask()}>
            <View style={styles.button}>
              <Image
                style={[
                  styles.bottomBarIcon,
                  {marginRight: 15, marginLeft: 10},
                ]}
                source={icons.taskWhite}
                resizeMode={'contain'}
              />
              <View style={{flex: 1}}>
                <Text style={styles.buttonText}>Add new Task</Text>
              </View>

              <Image
                style={[styles.addIcon, {marginRight: 10}]}
                source={icons.add}
                // resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>
          {this.state.showPicker ? this.renderDatePicker() : null}
          {this.state.showTimePicker ? this.renderTimePicker() : null}
        </ScrollView>
        {this.state.isDateNeedLoading && <Loader />}
        {addTaskToProjectLoading && <Loader />}
        {addFileTaskLoading && <Loader />}
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
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
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
  textFilter: {
    fontSize: '14rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Book',
    textAlign: 'center',
  },
  projectView: {
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
    color: colors.projectText,
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Book',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  textDate: {
    fontSize: '9rem',
    color: colors.projectText,
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Book',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  avatarIcon: {
    width: '20rem',
    height: '20rem',
    marginLeft: '10rem',
  },
  statusView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dropIcon: {
    width: '13rem',
    height: '13rem',
  },
  completionIcon: {
    width: '40rem',
    height: '40rem',
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
    fontFamily: 'CircularStd-Book',
    textAlign: 'left',
  },
  calendarIcon: {
    width: '23rem',
    height: '23rem',
  },
  taskFieldDocPickView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '0rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
    paddingVertical: '6rem',
  },
  gallaryIcon: {
    width: '24rem',
    height: '24rem',
  },
  cross: {
    width: '7rem',
    height: '7rem',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    marginTop: '17rem',
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
    fontFamily: 'CircularStd-Book',
    fontWeight: 'bold',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
  },
  subTitleStyle: {
    marginLeft: '20rem',
    marginBottom: '10rem',
    marginTop: '5rem',
  },
  subTitleText: {
    fontFamily: 'CircularStd-Book',
  },
  dropPickerStyle: {
    width: '89.5%',
    marginTop: '64rem',
    marginLeft: '13rem',
  },
  sprintText: {
    fontSize: '12rem',
    color: colors.gray,
    fontFamily: 'CircularStd-Book',
  },
  alertContainerStyle: {
    bottom: 0,
    width: '100%',
    maxWidth: '100%',
    position: 'absolute',
    borderRadius: 0,
    borderTopStartRadius: '5rem',
    borderTopEndRadius: '5rem',
    zIndex:100
  },
  alertConfirmButtonStyle: {
    width: '100rem',
    backgroundColor: colors.colorBittersweet,
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    addTaskToProjectLoading: state.project.addTaskToProjectLoading,
    addTaskToProjectError: state.project.addTaskToProjectError,
    addTaskToProjectSuccess: state.project.addTaskToProjectSuccess,
    addTaskToProjectErrorMessage: state.project.addTaskToProjectErrorMessage,
    taskId: state.project.taskId,
    addFileTaskLoading: state.project.addFileTaskLoading,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(AddNewTasksScreen);
