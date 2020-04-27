import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import moment from 'moment';
import FadeIn from 'react-native-fade-in-image';
import {SkypeIndicator} from 'react-native-indicators';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import APIServices from '../../../services/APIServices';
import AwesomeAlert from 'react-native-awesome-alerts';
import Header from '../../../components/Header';
import Accordion from 'react-native-collapsible/Accordion';
import RNFetchBlob from 'rn-fetch-blob';
import fileTypes from '../../../assest/fileTypes/fileTypes';
import * as Animatable from 'react-native-animatable';

const Placeholder = () => (
  <View style={styles.landing}>
    <SkypeIndicator color={colors.primary} />
  </View>
);

let dropData = [
  {
    id: 'Pending',
    value: 'Pending',
  },
  {
    id: 'Implementing',
    value: 'Implementing',
  },
  {
    id: 'QA',
    value: 'QA',
  },
  {
    id: 'Ready to Deploy',
    value: 'Ready to Deploy',
  },
  {
    id: 'Re-Opened',
    value: 'Re-Opened',
  },
  {
    id: 'Deployed',
    value: 'Deployed',
  },
  {
    id: 'Closed',
    value: 'Closed',
  },
];

let taskData = [
  {
    id: 0,
    name: 'Assignee',
    icon: icons.assigneeRoundedBlue,
    renderImage: false,
    disabled: false,
  },
  {
    id: 2,
    name: 'Due Date',
    icon: icons.dueDateRoundedGreen,
    renderImage: false,
    disabled: false,
  },
  {
    id: 3,
    name: 'Remind',
    icon: icons.remindRoundedOrange,
    renderImage: false,
    disabled: false,
  },
  {
    id: 5,
    name: 'Files',
    icon: icons.filesRoundedOrange,
    renderImage: false,
    disabled: true,
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

let development = [
  {value: 'Pending', id: 'pending'},
  {value: 'On hold', id: 'onHold'},
  {value: 'Open', id: 'open'},
  {value: 'Completed', id: 'completed'},
  {value: 'Implementing', id: 'implementing'},
  {value: 'Deployed', id: 'deployed'},
  {value: 'Closed', id: 'closed'},
];
let qa = [
  {value: 'Pending', id: 'pending'},
  {value: 'Testing', id: 'testing'},
  {value: 'Review', id: 'review'},
  {value: 'Closed', id: 'closed'},
];
let design = [
  {value: 'Pending', id: 'pending'},
  {value: 'On hold', id: 'onHold'},
  {value: 'Cancel', id: 'cancel'},
  {value: 'Fixing', id: 'fixing'},
  {value: 'Resolved', id: 'resolved'},
  {value: 'In progress', id: 'inprogress'},
  {value: 'Completed', id: 'completed'},
  {value: 'Under review', id: 'underReview'},
  {value: 'Weiting for approval', id: 'waitingForApproval'},
  {value: 'Review', id: 'review'},
  {value: 'Waiting response', id: 'waitingResponse'},
  {value: 'Rejected', id: 'rejected'},
  {value: 'Closed', id: 'closed'},
];
let bug = [
  {value: 'Pending', id: 'pending'},
  {value: 'On hold', id: 'onHold'},
  {value: 'Open', id: 'open'},
  {value: 'Cancel', id: 'cancel'},
  {value: 'Reopened', id: 'reopened'},
  {value: 'Fixing', id: 'fixing'},
  {value: 'Testing', id: 'testing'},
  {value: 'Resolved', id: 'resolved'},
  {value: 'Under review', id: 'underReview'},
  {value: 'Review', id: 'review'},
  {value: 'Waiting response', id: 'waitingResponse'},
  {value: 'Closed', id: 'closed'},
];
let operational = [
  {value: 'Pending', id: 'pending'},
  {value: 'On hold', id: 'onHold'},
  {value: 'Open', id: 'open'},
  {value: 'Cancel', id: 'cancel'},
  {value: 'Resolved', id: 'resolved'},
  {value: 'In progress', id: 'inprogress'},
  {value: 'Completed', id: 'completed'},
  {value: 'Under review', id: 'underReview'},
  {value: 'Weiting for approval', id: 'waitingForApproval'},
  {value: 'Discussion', id: 'discussion'},
  {value: 'Waiting response', id: 'waitingResponse'},
  {value: 'Ready', id: 'ready'},
  {value: 'Rejected', id: 'rejected'},
  {value: 'Closed', id: 'closed'},
];
let preSales = [
  {value: 'Pending', id: 'pending'},
  {value: 'On hold', id: 'onHold'},
  {value: 'Open', id: 'open'},
  {value: 'Cancel', id: 'cancel'},
  {value: 'Resolved', id: 'resolved'},
  {value: 'In progress', id: 'inprogress'},
  {value: 'Under review', id: 'underReview'},
  {value: 'Weiting for approval', id: 'waitingForApproval'},
  {value: 'Discussion', id: 'discussion'},
  {value: 'Waiting response', id: 'waitingResponse'},
  {value: 'Rejected', id: 'rejected'},
  {value: 'Closed', id: 'closed'},
];
let general = [
  {value: 'Pending', id: 'pending'},
  {value: 'On hold', id: 'onHold'},
  {value: 'Open', id: 'open'},
  {value: 'Cancel', id: 'cancel'},
  {value: 'In progress', id: 'inprogress'},
  {value: 'Completed', id: 'completed'},
  {value: 'Closed', id: 'closed'},
];

let taskDataWhenParentIsBoard = [
  // {
  //   id: 10,
  //   name: 'Task Name',
  //   icon: icons.taskDark,
  //   renderImage: false,
  // },
  // {
  //   id: 0,
  //   name: 'Name',
  //   icon: icons.taskUser,
  //   renderImage: false,
  // },
  {
    id: 1,
    name: 'Sub tasks',
    icon: icons.subTask,
    renderImage: true,
  },
  {
    id: 2,
    name: 'Due on',
    icon: icons.calendarBlue,
    renderImage: false,
  },
  {
    id: 3,
    name: 'Remind on',
    icon: icons.clockOrange,
    renderImage: false,
  },
  {
    id: 4,
    name: 'Notes',
    icon: icons.noteRed,
    renderImage: false,
  },
  {
    id: 5,
    name: 'Files',
    icon: icons.fileOrange,
    renderImage: true,
  },
];

class TasksDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomItemPressColor: colors.darkBlue,
      selectedProjectID: '',
      selectedProjectTaskID: '',
      isActive: this.props.isActive,
      name: '',
      duedate: '',
      duedateValue: '',
      remindDate: '',
      remindDateValue: '',
      showPicker: false,
      showTimePicker: false,
      date: new Date(),
      time: new Date(),
      selectedDateReminder: '',
      selectedTimeReminder: '',
      selectedTime: '',
      dateReminder: new Date(),
      timeReminder: new Date(),
      mode: 'date',
      reminder: false,
      taskName: '',
      taskStatus: 'Pending',
      dataLoading: false,
      reminderTime: '',
      dueTime: '',
      projectTaskInitiator: '',
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      note: '',
      sprints: [],
      isFromBoards: false,
      selectedSprint: '',
      previousSprintID: '',
      subTaskList: [],
      activeSections: [],
      filesData: [],
      progress: 0,
      loading: false,
      secondaryTaskId: '',
      selectedProjectName: '',
      isParent: false,
      issueType: 'Development',
      taskTypeList: development,
      taskType: 'Pending',
      sprintName: 'Default',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.deleteTaskError !== this.props.deleteTaskError &&
      this.props.deleteTaskError &&
      this.props.deleteTaskErrorMessage == ''
    ) {
      this.showAlert('', this.props.deleteTaskErrorMessage);
    }

    if (
      prevProps.deleteTaskError !== this.props.deleteTaskError &&
      this.props.deleteTaskError &&
      this.props.deleteTaskErrorMessage != ''
    ) {
      this.showAlert('', this.props.deleteTaskErrorMessage);
    }

    if (
      prevProps.deleteTaskSuccess !== this.props.deleteTaskSuccess &&
      this.props.deleteTaskSuccess
    ) {
      Alert.alert(
        'Success',
        'Task Deleted',
        [{text: 'OK', onPress: () => this.props.navigation.goBack()}],
        {cancelable: false},
      );
      // const taskID = this.props.taskId.data.taskId;
      // this.uploadFiles(this.state.files, taskID)
    }
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let selectedProjectID = params.selectedProjectID;
    let selectedProjectName = params.selectedProjectName;
    let selectedProjectTaskID = params.taskDetails.taskId;
    let isFromBoards = params.isFromBoards;
    this.setState({
      selectedProjectID: selectedProjectID,
      selectedProjectName: selectedProjectName,
      selectedProjectTaskID: selectedProjectTaskID,
      isFromBoards: params.isFromBoards,
      subTaskList: [params.subTaskDetails],
      parentTaskName: params.parentTaskName,
    });
    this.fetchData(selectedProjectID, selectedProjectTaskID);
    this.fetchFilesData(selectedProjectID, selectedProjectTaskID);
    if (params.isFromBoards == true) {
      let sprintId = params.taskDetails.sprintId;
      this.getAllSprintInProject(selectedProjectID, sprintId);
    }
  }

  async fetchFilesData(projectID, taskID) {
    this.setState({dataLoading: true});
    let filesData = await APIServices.getFilesInTaskData(projectID, taskID);
    if (filesData.message == 'success') {
      this.setState({
        filesData: filesData.data,
        dataLoading: false,
      });
    } else {
      this.setState({dataLoading: false});
    }
  }

  actualDownload = item => {
    this.setState({
      progress: 0,
      loading: true,
    });
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      path: dirs.DownloadDir + '/' + item.projectFileName,
      fileCache: true,
    })
      .fetch('GET', item.taskFileUrl, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      .progress((received, total) => {
        console.log('progress', received / total);
        this.setState({progress: received / total});
      })
      .then(res => {
        this.setState({
          progress: 100,
          loading: false,
        });
        this.showAlert(
          '',
          'Your file has been downloaded to downloads folder!',
        );
      });
  };

  async downloadFile(item) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to download the file ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.actualDownload(item);
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give storage permission to download the file',
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }

  deleteFileAlert(item) {
    Alert.alert(
      'Delete File',
      'You are about to permanantly delete this file,\n If you are not sure, you can cancel this action.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Ok', onPress: () => this.deleteFile(item)},
      ],
      {cancelable: false},
    );
  }

  async deleteFile(item) {
    let projectID = this.state.selectedProjectID;
    let taskID = item.taskId;
    let taskFileId = item.taskFileId;

    this.setState({dataLoading: true});

    await APIServices.deleteFileInTaskData(projectID, taskID, taskFileId)
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false});
          this.fetchFilesData(projectID, taskID);
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        if (error.status == 401) {
          this.setState({dataLoading: false});
          this.showAlert('', error.data.message);
        }
      });
  }

  bytesToSize(bytes) {
    var sizes = ['Bytes', 'Kb', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
  }

  getTypeIcons(fileName) {
    let key = fileName.split('.')[1];
    let imageType = '';
    switch (key) {
      case 'excel':
        imageType = fileTypes.excel;
        break;
      case 'jpg':
        imageType = fileTypes.jpg;
        break;
      case 'mp3':
        imageType = fileTypes.mp3;
        break;
      case 'pdf':
        imageType = fileTypes.pdf;
        break;
      case 'png':
        imageType = fileTypes.png;
        break;
      case 'video':
        imageType = fileTypes.video;
        break;
      case 'word':
        imageType = fileTypes.word;
        break;
      default:
        imageType = fileTypes.default;
        break;
    }
    return imageType;
  }

  // onRefresh() {
  //   this.setState({isFetching: false, filesData: [],allFilesData:[]}, function() {
  //     this.fetchData(this.props.selectedProjectID);
  //   });
  // }

  renderFilesList(item) {
    let details = '';
    let size = this.bytesToSize(item.taskFileSize);
    let date = moment(item.taskFileDate).format('YYYY-MM-DD');
    let name = item.firstName + ' ' + item.lastName;

    details = size + ' | ' + date + ' by ' + name;

    return (
      // <TouchableOpacity
      //   onPress={() =>
      //     this.props.navigation.navigate('FilesView', {filesData: item})
      //   }>
      <View style={styles.filesView}>
        <Image
          source={this.getTypeIcons(item.taskFileName)}
          style={styles.taskStateIcon}
        />
        <View style={{flex: 1}}>
          <Text style={styles.filesText} numberOfLines={1}>
            {item.taskFileName}
          </Text>
          <Text style={styles.filesTextDate} numberOfLines={1}>
            {size}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.filesText} numberOfLines={1}>
            {name}
          </Text>
          <Text style={styles.filesTextDate} numberOfLines={1}>
            {date}
          </Text>
        </View>
        <View style={styles.controlView}>
          <TouchableOpacity
            onPress={() => this.downloadFile(item)}
            style={{marginLeft: EStyleSheet.value('24rem')}}>
            <Image
              style={{width: 30, height: 30}}
              source={icons.downloadIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.deleteFileAlert(item)}
            style={{marginLeft: EStyleSheet.value('10rem')}}>
            <Image
              style={{width: 30, height: 30}}
              source={icons.deleteRoundRed}
            />
          </TouchableOpacity>
        </View>
      </View>
      // </TouchableOpacity>
    );
  }

  async getAllSprintInProject(selectedProjectID, sprintId) {
    this.setState({dataLoading: true});
    let sprintData = await APIServices.getAllSprintInProject(selectedProjectID);
    if (sprintData.message == 'success') {
      this.setSprintDroupDownData(sprintData.data);
      this.setSprintDroupDownSelectedValue(sprintData.data, sprintId);
      this.setState({dataLoading: false});
    } else {
      this.setState({dataLoading: false});
    }
  }

  async fetchData(selectedProjectID, selectedProjectTaskID) {
    this.setState({dataLoading: true});
    try {
      taskResult = await APIServices.getProjecTaskData(
        selectedProjectID,
        selectedProjectTaskID,
      );
      if (taskResult.message == 'success') {
        this.setTaskInitiator(taskResult);
        this.setTaskName(taskResult);
        this.setSecondaryTaskId(taskResult);
        this.setTaskStatus(taskResult);
        this.setTaskUserName(taskResult);
        this.setDueDate(taskResult);
        this.setReminderDate(taskResult);
        this.setTaskNote(taskResult);
        this.setIsParent(taskResult);
        this.setState({dataLoading: false});
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  setSprintDroupDownData(sprintData) {
    let sprintArray = [
      {
        id: 'default',
        value: 'Default',
      },
    ];
    for (let i = 0; i < sprintData.length; i++) {
      sprintArray.push({
        id: sprintData[i].sprintId,
        value: sprintData[i].sprintName,
      });
    }
    this.setState({sprints: sprintArray, sprintName: sprintArray[0].value});
  }

  setSprintDroupDownSelectedValue(sprintData, selectedSprintID) {
    if (selectedSprintID == 'default') {
      this.setState({selectedSprint: 'Default', previousSprintID: 'default'});
    } else {
      let selectedSprint = sprintData.find(
        ({sprintId}) => sprintId == selectedSprintID,
      );
      if (selectedSprint) {
        this.setState({
          selectedSprint: selectedSprint.sprintName,
          previousSprintID: selectedSprint.sprintId,
        });
      }
    }
  }

  setTaskInitiator(taskResult) {
    this.setState({projectTaskInitiator: taskResult.data.taskInitiator});
  }

  setTaskName(taskResult) {
    this.setState({taskName: taskResult.data.taskName});
  }

  setSecondaryTaskId(taskResult) {
    this.setState({secondaryTaskId: taskResult.data.secondaryTaskId});
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

  setTaskStatus(taskResult) {
    let statusValue = '';
    switch (taskResult.data.taskStatus) {
      case 'pending':
        statusValue = 'Pending';
        break;
      case 'implementing':
        statusValue = 'Implementing';
        break;
      case 'qa':
        statusValue = 'QA';
        break;
      case 'readyToDeploy':
        statusValue = 'Ready to Deploy';
        break;
      case 'reOpened':
        statusValue = 'Re-Opened';
        break;
      case 'deployed':
        statusValue = 'Deployed';
        break;
      case 'closed':
        statusValue = 'Closed';
        break;
    }
    this.setState({
      taskStatus: statusValue,
    });
  }

  async setTaskUserName(taskResult) {
    let projectID = this.state.selectedProjectID;
    let userID = taskResult.data.taskAssignee;
    let activeUsers = await APIServices.getAllUsersByProjectId(projectID);
    if (activeUsers.message == 'success' && userID) {
      const result = activeUsers.data.find(({userId}) => userId === userID);
      this.setState({
        name: result.firstName + ' ' + result.lastName,
        //activeUsers : activeUsers.data,
      });
    }
  }

  setDueDate(taskResult) {
    let taskDueDate = moment
      .parseZone(taskResult.data.taskDueDateAt)
      .format('Do MMMM YYYY');

    let taskDueTime = moment
      .parseZone(taskResult.data.taskDueDateAt)
      .format('hh:mmA');

    // console.log(
    //   'ddddddddddddddddddddddddd',
    //   moment(taskResult.data.taskDueDateAt).format('ddd MMM DD YYYY hh:mm:ss')+' GMT+0530 (India Standard Time)',
    // );

    // console.log(
    //   'ddddddddddddddddddddddddd',
    //   moment(taskResult.data.taskDueDateAt).format('ddd MMM DD YYYY hh:mm:ss')+' GMT+0530 (India Standard Time)',
    // );

    if (taskDueDate != 'Invalid date') {
      this.setState({
        duedate: taskDueDate,
        dueTime: taskDueTime,
        // date: moment.parseZone(taskResult.data.taskDueDateAt).format('ddd MMM DD YYYY hh:mm:ss')+' GMT+0530 (India Standard Time)',

        //new Date('Tue May 11 2020 03:14:00 GMT+0530 (India Standard Time)'),
        // time: new Date(taskDueDate),
      });
    }
  }

  setReminderDate(taskResult) {
    let taskReminderDate = moment
      .parseZone(taskResult.data.taskReminderAt)
      .format('Do MMMM YYYY');

    let taskReminderTime = moment
      .parseZone(taskResult.data.taskReminderAt)
      .format('hh:mmA');

    if (taskReminderDate != 'Invalid date') {
      this.setState({
        remindDate: taskReminderDate,
        reminderTime: taskReminderTime,
      });
    }
  }

  setTaskNote(taskResult) {
    this.setState({note: taskResult.data.taskNote});
  }

  setIsParent(taskResult) {
    this.setState({isParent: taskResult.data.isParent});
  }

  dateView = function(item) {
    let date = item.taskDueDateAt;
    let currentTime = moment().format();
    let dateText = '';
    let color = '';

    let taskStatus = item.taskStatus;
    if (taskStatus == 'closed') {
      // task complete
      dateText = moment(date).format('DD/MM/YYYY');
      color = '#36DD5B';
    } else {
      if (moment(date).isAfter(currentTime)) {
        dateText = moment(date).format('DD/MM/YYYY');
        color = '#0C0C5A';
      } else {
        dateText = moment(date).format('DD/MM/YYYY');
        color = '#ff6161';
      }
    }

    return <Text style={[styles.textDate, {color: color}]}>{dateText}</Text>;
  };

  onChangeDate(event, selectedDate) {
    let date = new Date(selectedDate);
    let newDate = '';
    let newDateValue = '';

    if (this.state.reminder) {
      newDate = moment(date).format('MMMM DD, YYYY');
      newDateValue = moment(date).format('DD MM YYYY');
    } else {
      newDate = moment(date).format('MMMM DD, YYYY');
      newDateValue = moment(date).format('DD MM YYYY');
    }

    if (event.type == 'set') {
      if (this.state.reminder) {
        this.setState({
          remindDate: newDate,
          remindDateValue: newDateValue,
          showPicker: false,
          showTimePicker: true,
          dateReminder: new Date(selectedDate),
        });
      } else {
        this.setState({
          duedate: newDate,
          duedateValue: newDateValue,
          showPicker: false,
          showTimePicker: true,
          date: new Date(selectedDate),
        });
      }
    } else {
      this.setState({
        showPicker: false,
        showTimePicker: false,
      });
    }
  }

  onChangeTime(event, selectedTime) {
    let time = new Date(selectedTime);
    let newTime = moment(time).format('hh:mmA');

    if (event.type == 'set') {
      if (this.state.reminder) {
        // reminder time
        this.setState({
          reminderTime: newTime,
          selectedTimeReminder: newTime,
          showPicker: false,
          showTimePicker: false,
          timeReminder: new Date(selectedTime),
        });
        this.changeTaskReminderDate();
      } else {
        // due time
        this.setState({
          dueTime: newTime,
          selectedTime: newTime,
          showPicker: false,
          showTimePicker: false,
          time: new Date(selectedTime),
        });
        this.changeTaskDueDate();
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

  clearDates(id) {
    switch (id) {
      case 2:
        this.setState({duedate: ''});
        break;
      case 3:
        this.setState({remindDate: ''});
        break;
      default:
        break;
    }
  }

  renderImage = function(item) {
    if (item.renderImage) {
      return (
        <FadeIn>
          <Image
            source={icons.forwordGray}
            style={{width: 24, height: 24, borderRadius: 24 / 2}}
          />
        </FadeIn>
      );
    } else {
      if (
        (this.state.duedate != '' && item.id == 2) ||
        (this.state.remindDate != '' && item.id == 3)
      ) {
        return <TouchableOpacity />;
      }
    }
  };

  onSelectUser(name, userID) {
    this.changeTaskAssignee(name, userID);
  }

  onUpdateNote(note) {
    this.changeTaskNote(note);
  }

  onTaskNameChange(text) {
    this.setState({taskName: text});
  }

  onItemPress(item) {
    switch (item.id) {
      case 10:
        break;
      case 0:
        this.props.navigation.navigate('AssigneeScreen', {
          selectedProjectID: this.state.selectedProjectID,
          onSelectUser: (name, id) => this.onSelectUser(name, id),
        });
        break;
      case 1:
        this.props.navigation.navigate('SubTaskScreen', {
          selectedProjectID: this.state.selectedProjectID,
          selectedProjectTaskID: this.state.selectedProjectTaskID,
        });
        break;
      case 2:
        this.setState({showPicker: true, reminder: false});
        break;
      case 3:
        this.setState({showPicker: true, reminder: true});
        break;
      case 4:
        this.props.navigation.navigate('NotesScreen', {
          note: this.state.note,
          onUpdateNote: note => this.onUpdateNote(note),
        });
        break;
      case 5:
        // this.props.navigation.navigate('FilesScreen', {
        //   projectID: this.state.selectedProjectID,
        //   taskID: this.state.selectedProjectTaskID,
        // });
        break;
      case 6:
        this.props.navigation.navigate('ChatScreen');
        break;
      default:
        break;
    }
  }

  renderDetails(item) {
    let value = '';
    switch (item.id) {
      case 10:
        value = this.state.taskName;
        break;
      case 0:
        value = this.state.name;
        break;
      case 2:
        value =
          this.state.duedate !== ''
            ? this.state.duedate + ' : ' + this.state.dueTime
            : '';
        break;
      case 3:
        value =
          this.state.remindDate !== ''
            ? this.state.remindDate + ' : ' + this.state.reminderTime
            : '';
        break;
      default:
        break;
    }

    return value !== '' ? (
      <View style={{flex: 1}}>
        <Text style={[styles.textHeader]}>{item.name}</Text>
        <Text style={[styles.textValue]}>{value}</Text>
      </View>
    ) : (
      <View style={{flex: 1}}>
        <Text style={[styles.text]}>{item.name}</Text>
      </View>
    );
  }

  renderProjectList(item) {
    return (
      <TouchableOpacity
        onPress={() => this.onItemPress(item)}
        disabled={item.disabled}>
        <View style={styles.projectView}>
          <Image
            style={styles.iconStyle}
            source={item.icon}
            resizeMode="contain"
          />
          {this.renderDetails(item)}
          <View style={styles.statusView}>
            {/* {this.dateView(item)} */}
            {this.renderImage(item)}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderBase() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Image style={styles.dropIcon} source={icons.arrowDark} />
      </View>
    );
  }

  onFilterTasksStatus(key) {
    let value = key;
    let searchValue = '';
    switch (value) {
      case 'Pending':
        searchValue = 'pending';
        break;
      case 'Implementing':
        searchValue = 'implementing';
        break;
      case 'QA':
        searchValue = 'qa';
        break;
      case 'Ready to Deploy':
        searchValue = 'readyToDeploy';
        break;
      case 'Re-Opened':
        searchValue = 'reOpened';
        break;
      case 'Deployed':
        searchValue = 'deployed';
        break;
      case 'Closed':
        searchValue = 'closed';
        break;
    }

    this.changeTaskStatus(key, searchValue);
  }

  onFilterSprintData = (value, index, data) => {
    let previousSprintID = this.state.previousSprintID;
    let selectedProjectID = this.state.selectedProjectID;
    let selectedProjectTaskID = this.state.selectedProjectTaskID;
    const selectedId = data[index].id;
    let selectedName = data[index].value;
    //this.setState({selectedSprint: selectedName });
    this.changeSprint(
      selectedName,
      selectedId,
      previousSprintID,
      selectedProjectID,
      selectedProjectTaskID,
    );
  };

  // change Sprint
  async changeSprint(
    selectedName,
    selectedId,
    previousSprintID,
    selectedProjectID,
    selectedProjectTaskID,
  ) {
    this.setState({dataLoading: true});
    try {
      resultObj = await APIServices.changeSprint(
        selectedId,
        previousSprintID,
        selectedProjectID,
        selectedProjectTaskID,
      );
      if (resultObj.message == 'success') {
        this.setState({dataLoading: false, selectedSprint: selectedName});
      } else {
        this.setState({dataLoading: false});
        this.showAlert('', 'Error');
      }
    } catch (e) {
      if (e.status == 401 || e.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', e.data.message);
      }
    }
  }

  async changeTaskNote(note) {
    this.setState({note: note});
  }

  // change note of task API
  async onSubmitTaskNote(note) {
    this.setState({dataLoading: true});
    let projectID = this.state.selectedProjectID;
    let taskID = this.state.selectedProjectTaskID;
    await APIServices.updateTaskNoteData(projectID, taskID, note)
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false, note: note});
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        if (error.status == 401 || e.status == 403) {
          this.setState({dataLoading: false});
          this.showAlert('', error.data.message);
        }
      });
  }

  // change assignee of task API
  async changeTaskAssignee(name, userID) {
    this.setState({dataLoading: true});
    let projectID = this.state.selectedProjectID;
    let taskID = this.state.selectedProjectTaskID;
    resultData = await APIServices.updateTaskAssigneeData(
      projectID,
      taskID,
      userID,
    )
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false, name: name});
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        if (error.status == 401 || e.status == 403) {
          this.setState({dataLoading: false});
          this.showAlert('', error.data.message);
        }
      });
  }

  // change status of task API
  async changeTaskStatus(key, searchValue) {
      this.setState({dataLoading: true});
      let projectID = this.state.selectedProjectID;
      let taskID = this.state.selectedProjectTaskID;
      resultData = await APIServices.updateTaskStatusData(
        projectID,
        taskID,
        searchValue,
      ).then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false, taskStatus: key});
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        if (error.status == 401 || e.status == 403) {
          this.setState({dataLoading: false});
          this.showAlert('', error.data.message);
        }
      });
  }

  // change name of task API
  async onTaskNameChangeSubmit(text) {
      this.setState({dataLoading: true});
      let projectID = this.state.selectedProjectID;
      let taskID = this.state.selectedProjectTaskID;
      resultData = await APIServices.updateTaskNameData(
        projectID,
        taskID,
        text,
      ).then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false});
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        if (error.status == 401 || e.status == 403) {
          this.setState({dataLoading: false});
          this.showAlert('', error.data.message);
        }
      });
  }

  async changeTaskDueDate() {
      let duedateValue = this.state.duedateValue;
      let dueTime = this.state.dueTime;
      let projectID = this.state.selectedProjectID;
      let taskID = this.state.selectedProjectTaskID;

      let IsoDueDate = duedateValue
        ? moment(duedateValue + dueTime, 'DD/MM/YYYY hh:mmA').format(
            'YYYY-MM-DD[T]HH:mm:ss',
          )
        : '';

      resultData = await APIServices.updateTaskDueDateData(
        projectID,
        taskID,
        IsoDueDate,
      ).then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false});
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        if (error.status == 401 || e.status == 403) {
          this.setState({dataLoading: false});
          this.showAlert('', error.data.message);
        }
      });
  }

  async changeTaskReminderDate() {
    try {
      let remindDateValue = this.state.remindDateValue;
      let reminderTime = this.state.reminderTime;
      let projectID = this.state.selectedProjectID;
      let taskID = this.state.selectedProjectTaskID;

      let IsoReminderDate = remindDateValue
        ? moment(remindDateValue + reminderTime, 'DD/MM/YYYY hh:mmA').format(
            'YYYY-MM-DD[T]HH:mm:ss',
          )
        : '';

      resultData = await APIServices.updateTaskReminderDateData(
        projectID,
        taskID,
        IsoReminderDate,
      );
      if (resultData.message == 'success') {
        this.setState({dataLoading: false});
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      if (e.status == 401 || e.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', e.data.message);
      }
    }
  }

  deleteTask() {
    let projectID = this.state.selectedProjectID;
    let taskID = this.state.selectedProjectTaskID;
    let tskInitiator = this.state.projectTaskInitiator;
    let taskName = this.state.taskName;

    Alert.alert(
      'Delete Task',
      "You're about to permanently delete this task, its comments\n and attachments, and all of its data.\nIf you're not sure, you can close this pop up.",
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () =>
            this.props.deleteTask(projectID, taskID, taskName, tskInitiator),
        },
      ],
      {cancelable: false},
    );
  }

  onBackPress() {
    this.props.navigation.goBack();
  }

  _renderHeader() {
    return (
      <View style={styles.subTasksHeader}>
        <View style={{flex: 1}}>
          <Text style={styles.parentTaskText}>Child Tasks</Text>
          <Text style={styles.childTaskText}>
            {this.state.subTaskList.length > 0
              ? this.state.subTaskList[0].length
              : 0}{' '}
            Task(s)
          </Text>
        </View>
        <Image
          style={styles.iconArrow}
          source={
            this.state.activeSections[0] == 0
              ? icons.arrowUpRoundedGreen
              : icons.arrowDownRoundedGreen
          }
        />
      </View>
    );
  }

  _updateSections = activeSections => {
    this.setState({activeSections});
  };

  userImage = function(item) {
    let userImage = item.taskAssigneeProfileImage;

    if (userImage) {
      return (
        <FadeIn>
          <Image
            source={{uri: userImage}}
            style={{width: 24, height: 24, borderRadius: 24 / 2}}
          />
        </FadeIn>
      );
    } else {
      return (
        <Image
          style={{width: 24, height: 24, borderRadius: 24 / 2}}
          source={require('../../../asserts/img/defult_user.png')}
        />
      );
    }
  };

  renderSubtasksList(item, index, userId, projectId) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('WorkloadTasksDetailsScreen', {
            workloadTasksDetails: item,
            userId: userId,
            projectId: projectId,
          })
        }>
        <View style={styles.subTasksListView}>
          <Image
            style={styles.subTasksCompletionIcon}
            source={
              item.taskStatus == 'closed'
                ? icons.rightCircule
                : icons.whiteCircule
            }
          />
          <View style={{flex: 1}}>
            <Text style={styles.subTaskText}>{item.taskName}</Text>
          </View>
          <View style={styles.statusView}>
            {this.dateView(item)}
            {this.userImage(item)}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  _renderContent(item) {
    return (
      <Animatable.View
        animation={'bounceIn'}
        duration={400}
        style={styles.flatListView}>
        <FlatList
          style={styles.flatListStyle}
          data={item}
          renderItem={({item, index}) => this.renderSubtasksList(item)}
          keyExtractor={item => item.taskId}
        />
      </Animatable.View>
    );
  }

  onFilterIssueTypes = (value, index, data) => {
    const selectedIssueTypeId = data[index].id;
    let selectedIssueTypeName = data[index].value;
    let taskTypeList = [];

    switch (selectedIssueTypeId) {
      case 'development':
        taskTypeList = development;
        break;
      case 'qa':
        taskTypeList = qa;
        break;
      case 'design':
        taskTypeList = design;
        break;
      case 'bug':
        taskTypeList = bug;
        break;
      case 'operational':
        taskTypeList = operational;
        break;
      case 'preSales':
        taskTypeList = preSales;
        break;
      case 'general':
        taskTypeList = general;
        break;
      default:
        break;
    }

    this.setState({
      issueType: selectedIssueTypeName,
      taskTypeList: taskTypeList,
      taskType: taskTypeList[0].value,
    });
  };

  onTaskDeketePress(){
    this.deleteTask();
  }

  render() {
    let taskStatus = this.state.taskStatus;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let taskName = this.state.taskName;
    let selectedSprint = this.state.selectedSprint;
    let sprints = this.state.sprints;
    let secondaryTaskId = this.state.secondaryTaskId;
    let isParent = this.state.isParent;

    return (
      <View style={styles.backgroundImage}>
        <Header
          isTaskLog={true}
          isDelete={true}
          navigation={this.props.navigation}
          title={this.state.selectedProjectName}
          // drawStatus={true}
          // taskStatus={taskStatus ? taskStatus : ''}
          onPress={() => this.onTaskDeketePress()}
        />
        <ScrollView style={styles.backgroundImage}>
          <View>
            <View style={styles.headerView}>
              <Text>Task - </Text>
              <Text style={styles.headerText}> #{secondaryTaskId}</Text>
              <View style={styles.projectFilerView}>
                <Text style={styles.statusText}>{taskStatus}</Text>
                {/* <Dropdown
                  // style={{}}
                  label=""
                  labelFontSize={0}
                  data={dropData}
                  fontSize={12}
                  textColor={colors.white}
                  error={''}
                  animationDuration={0.5}
                  containerStyle={{width: '100%', marginLeft: 17, marginTop: 2}}
                  // overlayStyle={{width: '29%',marginLeft:100}}
                  pickerStyle={{width: '26%', marginTop: 53, marginLeft: 115}}
                  dropdownPosition={0}
                  // dropdownMargins={{min: 2, max: 5}}
                  value={taskStatus}
                  itemColor={'black'}
                  selectedItemColor={'black'}
                  dropdownOffset={{top: 10}}
                  baseColor={colors.lightBlue}
                  // renderAccessory={this.renderBase}
                  itemTextStyle={{
                    marginLeft: 15,
                    fontFamily: 'CircularStd-Book',
                  }}
                  itemPadding={10}
                  onChangeText={value => this.onFilterTasksStatus(value)}
                /> */}
              </View>
            </View>
            <View>
              <TextInput
                style={[styles.taskNameStyle]}
                placeholder={'Task name'}
                value={this.state.taskName}
                onChangeText={text => this.onTaskNameChange(text)}
                onSubmitEditing={() =>
                  this.onTaskNameChangeSubmit(this.state.taskName)
                }
              />
              {/* <Text style={styles.taskNameStyle}>{taskName}</Text> */}
            </View>
            <View style={styles.borderStyle} />

            {/* {this.state.isFromBoards ? (
              <View style={styles.projectFilerViewGreen}>
                <Dropdown
                  // style={{}}
                  label=""
                  labelFontSize={0}
                  data={sprints}
                  textColor={colors.white}
                  renderAccessory={() => null}
                  error={''}
                  animationDuration={0.5}
                  containerStyle={{width: '100%'}}
                  overlayStyle={{width: '100%'}}
                  pickerStyle={{width: '89%', marginTop: 70, marginLeft: 15}}
                  dropdownPosition={0}
                  value={selectedSprint}
                  itemColor={'black'}
                  selectedItemColor={'black'}
                  dropdownOffset={{top: 10}}
                  baseColor={colors.lightGreen}
                  itemTextStyle={{
                    marginLeft: 15,
                    fontFamily: 'CircularStd-Book',
                  }}
                  itemPadding={10}
                  onChangeText={this.onFilterSprintData}
                />
              </View>
            ) : null} */}
            <View style={styles.buttonAddTaskView}>
              <TouchableOpacity style={styles.buttonAddParentTask}>
                <Text style={{color: colors.white}}>Add parent task</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonAddChildTask}>
                <Text style={{color: colors.white}}>Add child task</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.parentTaskView}>
              <Image
                style={styles.iconStyle}
                source={icons.subTasksRoundedGreen}
                resizeMode="contain"
              />
              {isParent ? (
                <Accordion
                  underlayColor={colors.white}
                  sections={this.state.subTaskList}
                  // sectionContainerStyle={{height:200}}
                  containerStyle={{flex: 1, marginBottom: 20, marginTop: 0}}
                  activeSections={this.state.activeSections}
                  renderHeader={() => this._renderHeader()}
                  renderContent={item => this._renderContent(item)}
                  onChange={this._updateSections}
                />
              ) : (
                <View style={{flex: 1}}>
                  <Text style={styles.parentTaskText}>Parent Task</Text>
                  <Text style={styles.childTaskText}>
                    {this.state.parentTaskName}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.taskTypeMainView}>
              <View style={styles.taskTypeNameView}>
                <Image
                  style={styles.iconStyle}
                  source={icons.taskRoundedBlue}
                  resizeMode="contain"
                />
                <Text style={styles.parentTaskText}>Task Type</Text>
              </View>
              <View style={styles.taskTypeDropMainView}>
                <View style={[styles.taskTypeDropDownView, {marginRight: 5}]}>
                  <Dropdown
                    // style={{}}
                    label=""
                    labelFontSize={0}
                    data={issueTypeList}
                    textColor={colors.black}
                    fontSize={14}
                    renderAccessory={() => null}
                    error={''}
                    animationDuration={0.5}
                    containerStyle={{width: '100%'}}
                    overlayStyle={{width: '100%'}}
                    pickerStyle={{width: '38%', marginTop: 62, marginLeft: 59}}
                    dropdownPosition={0}
                    value={this.state.issueType}
                    itemColor={'black'}
                    selectedItemColor={'black'}
                    dropdownOffset={{top: 10}}
                    baseColor={colors.projectBgColor}
                    renderAccessory={this.renderBase}
                    itemTextStyle={{
                      marginLeft: 15,
                      fontFamily: 'CircularStd-Book',
                    }}
                    itemPadding={10}
                    onChangeText={this.onFilterIssueTypes}
                  />
                </View>
                <View style={[styles.taskTypeDropDownView, {marginLeft: 5}]}>
                  <Dropdown
                    // style={{}}
                    label=""
                    labelFontSize={0}
                    data={this.state.taskTypeList}
                    textColor={colors.black}
                    fontSize={14}
                    renderAccessory={() => null}
                    error={''}
                    animationDuration={0.5}
                    containerStyle={{width: '100%'}}
                    overlayStyle={{width: '100%'}}
                    pickerStyle={{width: '38%', marginTop: 62, marginLeft: 225}}
                    dropdownPosition={0}
                    value={this.state.taskType}
                    itemColor={'black'}
                    selectedItemColor={'black'}
                    dropdownOffset={{top: 10}}
                    baseColor={colors.projectBgColor}
                    renderAccessory={this.renderBase}
                    itemTextStyle={{
                      marginLeft: 15,
                      fontFamily: 'CircularStd-Book',
                    }}
                    itemPadding={10}
                    onChangeText={this.onFilterSprintData}
                  />
                </View>
              </View>
            </View>

            <View style={styles.taskTypeMainView}>
              <View style={styles.taskTypeNameView}>
                <Image
                  style={styles.iconStyle}
                  source={icons.boardRoundedGreen}
                  resizeMode="contain"
                />
                <Text style={styles.parentTaskText}>Board</Text>
              </View>
              <View style={styles.taskTypeDropMainView}>
                <View style={styles.taskTypeDropDownView}>
                  <Dropdown
                    // style={{}}
                    label=""
                    labelFontSize={0}
                    data={sprints}
                    textColor={colors.black}
                    fontSize={14}
                    renderAccessory={() => null}
                    error={''}
                    animationDuration={0.5}
                    containerStyle={{width: '100%'}}
                    overlayStyle={{width: '100%'}}
                    pickerStyle={{width: '89%', marginTop: 70, marginLeft: 15}}
                    dropdownPosition={0}
                    value={this.state.sprintName}
                    itemColor={'black'}
                    selectedItemColor={'black'}
                    dropdownOffset={{top: 10}}
                    baseColor={colors.projectBgColor}
                    renderAccessory={this.renderBase}
                    itemTextStyle={{
                      marginLeft: 15,
                      fontFamily: 'CircularStd-Book',
                    }}
                    itemPadding={10}
                    onChangeText={this.onFilterSprintData}
                  />
                </View>
              </View>
            </View>

            <View style={styles.notesMainView}>
              <Image
                style={styles.iconStyle}
                source={icons.noteRoundedRed}
                resizeMode="contain"
              />
              <View style={styles.notesView}>
                <Text style={styles.noteText}>Notes</Text>
                <TextInput
                  style={styles.notesTextInput}
                  placeholder={'Notes'}
                  value={this.state.note}
                  multiline={true}
                  // blurOnSubmit={true}
                  onChangeText={text => this.changeTaskNote(text)}
                  // onSubmitEditing={() => this.onSubmitTaskNote(this.state.note)}
                />
                <TouchableOpacity
                  style={styles.updateNotesView}
                  onPress={() => this.onSubmitTaskNote(this.state.note)}>
                  <Text style={styles.updateNotesText}>UPDATE NOTES</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.borderStyle} />
            <FlatList
              data={taskData}
              renderItem={({item}) => this.renderProjectList(item)}
              keyExtractor={item => item.taskId}
            />
            <FlatList
              style={styles.flalList}
              data={this.state.filesData}
              renderItem={({item}) => this.renderFilesList(item)}
              keyExtractor={item => item.projId}
              // onRefresh={() => this.onRefresh()}
              // refreshing={isFetching}
            />
            {/* <TouchableOpacity onPress={() => this.deleteTask()}>
              <View style={styles.buttonDelete}>
                <Image
                  style={[
                    styles.bottomBarIcon,
                    {marginRight: 15, marginLeft: 10},
                  ]}
                  source={icons.taskWhite}
                  resizeMode={'center'}
                />
                <View style={{flex: 1}}>
                  <Text style={styles.buttonText}>Delete Task</Text>
                </View>

                <Image
                  style={[styles.deleteIcon, {marginRight: 10}]}
                  source={icons.deleteWhite}
                  resizeMode={'center'}
                />
              </View>
            </TouchableOpacity> */}
            {this.state.showPicker ? this.renderDatePicker() : null}
            {this.state.showTimePicker ? this.renderTimePicker() : null}
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
        </ScrollView>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  projectFilerView: {
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '30rem',
    width: '100rem',
    marginHorizontal: '20rem',
  },
  projectFilerViewGreen: {
    backgroundColor: colors.lightGreen,
    borderRadius: 5,
    marginTop: '5rem',
    marginBottom: '5rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
  },
  textFilter: {
    fontSize: '14rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
  },
  projectView: {
    // backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    // height: '60rem',
    marginTop: '20rem',
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '11rem',
    color: colors.projectTaskNameColor,
    textAlign: 'center',
    fontWeight: 'bold',
    // lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    // marginLeft: '10rem',
    fontWeight: '400',
  },
  textDate: {
    fontFamily: 'Circular Std Book',
    fontSize: '9rem',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    marginRight: '5rem',
  },
  avatarIcon: {
    width: '20rem',
    height: '20rem',
    marginLeft: 10,
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
    width: '23rem',
    height: '23rem',
    marginHorizontal: '5rem',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    height: 80,
    width: '100%',
    backgroundColor: colors.projectBgColor,
  },
  bottomBarInnerContainer: {
    flexDirection: 'row',
    height: 80,
  },
  bottomItemView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bottomItemTouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  horizontalLine: {
    backgroundColor: colors.gray,
    width: 1,
    height: 40,
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
  },
  landing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDelete: {
    flexDirection: 'row',
    backgroundColor: colors.lightRed,
    borderRadius: 5,
    marginTop: '40rem',
    marginBottom: '30rem',
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
  deleteIcon: {
    width: '28rem',
    height: '28rem',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '20rem',
  },
  headerText: {
    fontSize: '20rem',
    fontWeight: 'bold',
  },
  taskNameStyle: {
    color: colors.gray,
    fontSize: '14rem',
    fontWeight: 'bold',
    marginHorizontal: '20rem',
    marginBottom: '0rem',
  },
  borderStyle: {
    borderWidth: '0.4rem',
    borderColor: colors.lightgray,
    marginBottom: '8rem',
  },
  parentTaskView: {
    flexDirection: 'row',
    marginHorizontal: '20rem',
    marginTop: '10rem',
  },
  parentTaskText: {
    flex: 1,
    fontSize: '10rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.projectTaskNameColor,
  },
  childTaskText: {
    fontSize: '12rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.detailsViewText,
  },
  subTasksListView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    height: '45rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
  },
  flatListStyle: {
    marginBottom: '1rem',
    marginTop: '0rem',
  },
  subTasksHeader: {
    flexDirection: 'row',
  },
  iconArrow: {
    width: '17rem',
    height: '17rem',
  },
  subTasksCompletionIcon: {
    width: '26rem',
    height: '26rem',
  },
  subTaskText: {
    fontSize: '10rem',
    color: colors.projectTaskNameColor,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  iconStyle: {
    width: '30rem',
    height: '30rem',
    marginRight: '10rem',
  },
  taskTypeMainView: {
    marginHorizontal: '20rem',
    marginTop: '15rem',
  },
  taskTypeDropMainView: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: '40rem',
  },
  taskTypeDropDownView: {
    flex: 1,
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginTop: '5rem',
    marginBottom: '5rem',
    paddingHorizontal: '12rem',
    height: '45rem',
  },
  taskTypeNameView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notesNameView: {
    flexDirection: 'row',
  },
  notesMainView: {
    marginHorizontal: '20rem',
    marginTop: '15rem',
    flexDirection: 'row',
  },
  notesView: {
    flex: 1,
    marginBottom: '1rem',
  },
  notesTextInput: {
    fontSize: '11rem',
    color: colors.detailsViewText,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '-3rem',
    width: '100%',
    textAlignVertical: 'top',
  },
  noteText: {
    fontSize: '10rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.projectTaskNameColor,
    marginBottom: '-5rem',
  },
  textHeader: {
    fontSize: '10rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.projectTaskNameColor,
  },
  textValue: {
    fontSize: '12rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.detailsViewText,
  },
  filesView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lighterGray,
    height: '50rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '10rem',
    marginHorizontal: '20rem',
  },
  filesText: {
    fontSize: '11rem',
    color: colors.userListUserNameColor,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
    fontWeight: '400',
  },
  filesTextDate: {
    fontSize: '9rem',
    color: colors.textPlaceHolderColor,
    lineHeight: '13rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
  },
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  flalList: {
    marginTop: '5rem',
    marginBottom: '20rem'
  },
  taskStateIcon: {
    width: '38rem',
    height: '38rem',
  },
  statusText: {
    color: colors.white,
  },
  buttonAddTaskView: {
    flexDirection: 'row',
    marginHorizontal: '20rem',
    marginTop: '5rem',
    marginBottom: '12rem',
  },
  buttonAddParentTask: {
    flex: 1,
    backgroundColor: colors.lightGreen,
    height: '45rem',
    marginRight: '7rem',
    borderRadius: '5rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonAddChildTask: {
    flex: 1,
    backgroundColor: colors.colorsNavyBlue,
    height: '45rem',
    marginLeft: '7rem',
    borderRadius: '5rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateNotesView: {
    backgroundColor: colors.lightBlue,
    height: 30,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
  },
  updateNotesText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

const mapStateToProps = state => {
  return {
    deleteTaskLoading: state.project.deleteTaskLoading,
    deleteTaskSuccess: state.project.deleteTaskSuccess,
    deleteTaskError: state.project.deleteTaskError,
    deleteTaskErrorMessage: state.project.deleteTaskErrorMessage,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(TasksDetailsScreen);
