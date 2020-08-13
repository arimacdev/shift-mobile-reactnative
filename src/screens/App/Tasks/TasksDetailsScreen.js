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
  Platform,
  BackHandler,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import APIServices from '../../../services/APIServices';
import AwesomeAlert from 'react-native-awesome-alerts';
import Header from '../../../components/Header';
import Accordion from 'react-native-collapsible/Accordion';
import DocumentPicker from 'react-native-document-picker';
import * as Progress from 'react-native-progress';
import RNFetchBlob from 'rn-fetch-blob';
import fileTypes from '../../../asserts/fileTypes/fileTypes';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import {NavigationEvents} from 'react-navigation';
import ImagePicker from 'react-native-image-picker';
import MessageShowModal from '../../../components/MessageShowModal';
import Utils from '../../../utils/Utils';
import FilePickerModal from '../../../components/FilePickerModal';

const Placeholder = () => (
  <View style={styles.landing}>
    <SkypeIndicator color={colors.primary} />
  </View>
);

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
    id: 6,
    name: 'Comments',
    icon: icons.commentsRoundPurple,
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
  {value: 'Reopened', id: 'reOpened'},
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

let taskStatusData = [
  {value: 'Pending', id: 'pending'},
  {value: 'On hold', id: 'onHold'},
  {value: 'Cancel', id: 'cancel'},
  {value: 'Fixing', id: 'fixing'},
  {value: 'Resolved', id: 'resolved'},
  {value: 'In progress', id: 'inprogress'},
  {value: 'Completed', id: 'completed'},
  {value: 'Under review', id: 'underReview'},
  {value: 'Wating for approval', id: 'waitingForApproval'},
  {value: 'Review', id: 'review'},
  {value: 'Wating response', id: 'waitingResponse'},
  {value: 'Rejected', id: 'rejected'},
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
let MS_PER_MINUTE = 60000;

class TasksDetailsScreen extends Component {
  details = {
    icon: icons.alertRed,
    type: 'confirm',
    title: 'Delete Task',
    description:
      "You're about to permanently delete this task, its comments and attachments, and all of its data.\nIf you're not sure, you can close this pop up.",
    buttons: {positive: 'Delete', negative: 'Cancel'},
  };
  onPressMessageModal = () => {};

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
      issueType: '',
      taskStatusValue: '',
      sprintName: '',
      isDateNeedLoading: false,
      files: [],
      uploading: 0,
      indeterminate: false,
      showTaskModal: false,
      selectedTaskName: '',
      selectedTaskID: '',
      taskModalData: [],
      fromParent: true,
      addParentTaskShow: false,
      addChildTaskShow: false,
      subTaskListLength: 0,
      allDetails: [],
      taskResult: [],
      taskNameEditable: false,
      sprintId: '',
      taskModalDataID: '',
      parentTaskName: '',
      selectdList: development,
      taskItem: {},
      parentTaskStatus: '',
      showMessageModal: false,
      deleteTaskSuccess: false,
      loadDetails: true,
      parentID: '',
      istimeBasedWeight: '',
      estimatedHours: '0',
      estimatedMins: '0',
      actualHours: '0',
      actualMins: '0',
      estimatedPoints: '0',
      actualPoints: '0',
      invalidEstMimutesError: false,
      invalidActMimutesError: false,
      invalidEstPointsError: false,
      invalidActPointsError: false,
      showFilePickerModal: false,
    };
  }

  // componentWillMount() {
  //   this.pageOpen();
  // }

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
        [{text: 'OK', onPress: () => this.onBackPress()}],
        {cancelable: false},
      );
    }

    if (
      prevProps.allTaskByProjectLoading !==
        this.props.allTaskByProjectLoading &&
      this.props.allTaskByProject &&
      this.props.allTaskByProject.length > 0
    ) {
      this.setState({
        allDetails: this.props.allTaskByProject,
      });
    }

    if (
      this.props.navigation.state.params &&
      this.props.navigation.state.params.taskId !==
        prevProps.navigation.state.params.taskId
    ) {
      this.pageOpen();
    }
  }

  pageOpen() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;

    let selectedProjectID = params.id;
    let selectedProjectName = params.name;
    let selectedProjectTaskID = params.taskId;

    this.setState({
      selectedProjectID: selectedProjectID,
      selectedProjectName: selectedProjectName,
      selectedProjectTaskID: selectedProjectTaskID,
      parentTaskName: params.parentTaskName ? params.parentTaskName : '',
    });

    this.fetchData(selectedProjectID, selectedProjectTaskID);

    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });
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

  async gerTaskParentName(parentTaskId) {
    this.setState({dataLoading: true});
    try {
      let taskResult = await APIServices.getProjecTaskData(
        this.state.selectedProjectID,
        parentTaskId,
      );
      if (taskResult.message == 'success') {
        this.setState({
          parentTaskName: taskResult.data.taskName,
          parentTaskStatus: taskResult.data.taskStatus,
        });
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  async getSubTAskDetails() {
    this.setState({dataLoading: true});
    await APIServices.getChildTasksOfParentData(
      this.state.selectedProjectID,
      this.state.selectedProjectTaskID,
    )
      .then(async response => {
        if (response.message == 'success') {
          await this.setState({
            dataLoading: false,
            subTaskList: response.data ? [response.data] : [],
            subTaskListLength: response.data ? response.data.length : 0,
            addParentTaskShow:
              response.data && response.data.length > 0 ? false : true,
            addChildTaskShow: this.state.isParent ? true : false,
          });
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        //if (error.status == 401 || error.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        //}
      });
  }

  getTaskModalData(selectedProjectTaskID, allDetails, fromParent) {
    let taskModalData = [];
    this.setState({taskModalData: []});
    for (let index = 0; index < allDetails.length; index++) {
      const element = allDetails[index];
      if (element.parentTask && fromParent) {
        if (selectedProjectTaskID !== element.parentTask.taskId) {
          taskModalData.push({
            id: element.parentTask.taskId,
            value: element.parentTask.taskName,
          });
        }
      } else {
        if (element.childTasks.length == 0) {
          if (
            selectedProjectTaskID !== element.parentTask.taskId
            // && this.state.taskModalDataID !== element.parentTask.taskId
          ) {
            taskModalData.push({
              id: element.parentTask.taskId,
              value: element.parentTask.taskName,
            });
          }
        }
      }
    }
    if (taskModalData.length > 0) {
      this.setState({taskModalData: taskModalData});
    } else {
      // taskModalData.push({
      //   id: 'noData',
      //   value: 'No data avilable',
      // });
      this.setState({selectedTaskName: 'No data avilable'});
    }
  }

  async getProjectDetails(taskResult, selectedProjectID) {
    try {
      this.setState({dataLoading: true});
      let projectData = await APIServices.getProjectData(selectedProjectID);
      if (projectData.message == 'success') {
        this.setState({
          istimeBasedWeight: projectData.data.weightMeasure,
          dataLoading: false,
        });
        this.setWeightType(taskResult, projectData.data.weightMeasure);
      } else {
        this.setState({dataLoading: false});
      }
    } catch {
      this.setState({dataLoading: false});
    }
  }

  onFilesCrossPress(uri) {
    this.setState({files: []}, () => {
      let filesArray = this.state.files.filter(item => {
        return item.uri !== uri;
      });
      this.setState({files: filesArray});
    });
  }

  onCloseFilePickerModal() {
    this.setState({showFilePickerModal: false});
  }

  async filePicker() {
    this.setState({showFilePickerModal: true});
  }

  async selectCamera() {
    await this.setState({showFilePickerModal: false});

    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };
    setTimeout(() => {
      ImagePicker.launchCamera(options, res => {
        if (res.didCancel) {
        } else if (res.error) {
        } else if (res.customButton) {
        } else {
          this.setImageForFile(res);
        }
      });
    }, 100);
  }

  async selectGallery() {
    await this.setState({showFilePickerModal: false});
    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };

    setTimeout(() => {
      ImagePicker.launchImageLibrary(options, res => {
        if (res.didCancel) {
        } else if (res.error) {
        } else if (res.customButton) {
        } else {
          this.setImageForFile(res);
        }
      });
    }, 100);
  }

  async selectFiles() {
    await this.setState({showFilePickerModal: false});

    setTimeout(() => {
      this.doumentPicker();
    }, 100);
  }

  async setImageForFile(res) {
    let selectedProjectID = this.state.selectedProjectID;
    let selectedProjectTaskID = this.state.selectedProjectTaskID;
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
    // this.setState({ files: this.state.files });

    await this.setState({
      files: this.state.files,
      indeterminate: true,
      Uploading: 0,
      showMessageModal: false,
    });

    await APIServices.addFileToTask(
      this.state.files,
      selectedProjectTaskID,
      selectedProjectID,
    )
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.fileOrange,
            type: 'success',
            title: 'Sucsess',
            description: 'File has been added successfully',
            buttons: {},
          };
          this.setState({
            indeterminate: false,
            files: [],
            uploading: 100,
            showMessageModal: true,
          });
          this.fetchFilesData(selectedProjectID, selectedProjectTaskID);
        } else {
          this.setState({indeterminate: false, files: [], uploading: 0});
        }
      })
      .catch(error => {
        this.setState({indeterminate: false, files: [], uploading: 0});
        if (error.status == 401) {
          this.showAlert('', error.data.message);
        } else if (error.status == 413) {
          this.showAlert(
            '',
            'File size is too large. Maximum file upload size is 10MB',
          );
        } else {
          this.showAlert('', 'File upload error');
        }
      });
  }

  async doumentPicker() {
    let selectedProjectID = this.state.selectedProjectID;
    let selectedProjectTaskID = this.state.selectedProjectTaskID;
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
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
      await this.setState({
        files: this.state.files,
        indeterminate: true,
        uploading: 0,
        showMessageModal: false,
      });

      await APIServices.addFileToTask(
        this.state.files,
        selectedProjectTaskID,
        selectedProjectID,
      )
        .then(response => {
          if (response.message == 'success') {
            this.details = {
              icon: icons.fileOrange,
              type: 'success',
              title: 'Sucsess',
              description: 'File has been added successfully',
              buttons: {},
            };
            this.setState({
              indeterminate: false,
              files: [],
              uploading: 100,
              showMessageModal: true,
            });
            this.fetchFilesData(selectedProjectID, selectedProjectTaskID);
          } else {
            this.setState({indeterminate: false, files: [], uploading: 0});
          }
        })
        .catch(error => {
          this.setState({indeterminate: false, files: [], uploading: 0});
          if (error.status == 401) {
            this.showAlert('', error.data.message);
          } else if (error.status == 413) {
            this.showAlert(
              '',
              'File size is too large. Maximum file upload size is 10MB',
            );
          } else {
            this.showAlert('', 'File upload error');
          }
        });
      // this.props.uploadFile(this.state.files, this.props.selectedProjectID);

      console.log(this.state.files);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('file pick error', err);
      } else {
        throw err;
      }
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
      path: dirs.DownloadDir + '/' + item.taskFileName,
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
    this.details = {
      icon: icons.alertRed,
      type: 'confirm',
      title: 'Delete File',
      description:
        'You are about to permanantly delete this file,\n If you are not sure, you can cancel this action.',
      buttons: {positive: 'Delete', negative: 'Cancel'},
    };
    this.onPressMessageModal = () => this.deleteFile(item);
    this.setState({showMessageModal: true});
  }

  async deleteFile(item) {
    let projectID = this.state.selectedProjectID;
    let taskID = item.taskId;
    let taskFileId = item.taskFileId;

    this.setState({dataLoading: true, showMessageModal: false});

    await APIServices.deleteFileInTaskData(projectID, taskID, taskFileId)
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.fileOrange,
            type: 'success',
            title: 'Sucsess',
            description: 'File has been deleted successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
          this.fetchFilesData(projectID, taskID);
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        //if (error.status == 401) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        //}
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
      case 'xlsx':
        imageType = fileTypes.excel;
        break;
      case 'jpg':
        imageType = fileTypes.jpg;
        break;
      case 'jpeg':
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
      case 'mp4':
        imageType = fileTypes.video;
        break;
      case 'docx':
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

  renderDocPickeredView() {
    return (
      <View style={styles.progressBarView}>
        <Progress.Bar
          progress={0.0}
          indeterminate={this.state.indeterminate}
          indeterminateAnimationDuration={1000}
          width={null}
          animated={true}
          color={colors.lightGreen}
          unfilledColor={colors.lightgray}
          borderWidth={0}
          height={20}
          borderRadius={5}
        />
        <Text style={styles.uploadingText}>
          Uploading {this.state.uploading}%
        </Text>
      </View>
    );
  }

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
            <Image style={styles.controlIcon} source={icons.downloadIcon} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.deleteFileAlert(item)}
            style={{marginLeft: EStyleSheet.value('10rem')}}>
            <Image style={styles.controlIcon} source={icons.deleteRoundRed} />
          </TouchableOpacity>
        </View>
      </View>
      // </TouchableOpacity>
    );
  }

  async getAllSprintInProject(selectedProjectID, sprintId) {
    this.setState({dataLoading: true});
    try {
      let sprintData = await APIServices.getAllSprintInProject(
        selectedProjectID,
      );
      if (sprintData.message == 'success') {
        this.setSprintDroupDownData(sprintData.data);
        this.setSprintDroupDownSelectedValue(sprintData.data, sprintId);
        this.setState({dataLoading: false});
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  async fetchData(selectedProjectID, selectedProjectTaskID) {
    this.setState({dataLoading: true});
    try {
      let taskResult = await APIServices.getProjecTaskData(
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
        this.setIssueType(taskResult);
        this.setSprintId(taskResult);
        this.fetchFilesData(selectedProjectID, selectedProjectTaskID);
        this.getAllTaskInProject(selectedProjectID);
        this.getProjectDetails(taskResult, selectedProjectID);
        this.setState({dataLoading: false, taskResult: taskResult});
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
      if (error.data.status == 404) {
        Utils.showAlert(true, '', 'Could not load the details', this.props);
        this.props.navigation.goBack();
      }
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
    this.setState({sprints: sprintArray});
  }

  setSprintDroupDownSelectedValue(sprintData, selectedSprintID) {
    if (selectedSprintID == 'default') {
      this.setState({
        selectedSprint: 'Default',
        previousSprintID: 'default',
        sprintName: 'Default',
      });
    } else {
      let selectedSprint = sprintData.find(
        ({sprintId}) => sprintId == selectedSprintID,
      );
      if (selectedSprint) {
        this.setState({
          sprintName: selectedSprint.sprintName,
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

  async setSprintId(taskResult) {
    await this.setState({sprintId: taskResult.data.sprintId});
    this.getAllSprintInProject(
      this.state.selectedProjectID,
      this.state.sprintId,
    );
  }

  setWeightType(taskResult, weightMeasure) {
    let estimatedWeight = taskResult.data.estimatedWeight.toString();
    let actualWeight = taskResult.data.actualWeight.toString();

    if (weightMeasure == 'time') {
      let estimatedHours =
        estimatedWeight.split('.')[0] == undefined
          ? '0'
          : estimatedWeight.split('.')[0];
      let estimatedMins =
        estimatedWeight.split('.')[1] == undefined
          ? '0'
          : estimatedWeight.split('.')[1];
      let actualHours =
        actualWeight.split('.')[0] == undefined
          ? '0'
          : actualWeight.split('.')[0];
      let actualMins =
        actualWeight.split('.')[1] == undefined
          ? '0'
          : actualWeight.split('.')[1];

      this.setState({
        estimatedHours: estimatedHours,
        estimatedMins:
          estimatedMins.length > 1 ? estimatedMins : estimatedMins + '0',
        actualHours: actualHours,
        actualMins: actualMins.length > 1 ? actualMins : actualMins + '0',
      });
    } else {
      this.setState({
        estimatedPoints: estimatedWeight,
        actualPoints: actualWeight,
      });
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

  setTaskStatus(taskResult) {
    let statusValue = '';
    switch (taskResult.data.taskStatus) {
      case 'open':
        statusValue = 'Open';
        break;
      case 'pending':
        statusValue = 'Pending';
        break;
      case 'onHold':
        statusValue = 'On Hold';
        break;
      case 'cancel':
        statusValue = 'Cancel';
        break;
      case 'fixing':
        statusValue = 'Fixing';
        break;
      case 'testing':
        statusValue = 'Testing';
        break;
      case 'resolved':
        statusValue = 'Resolved';
        break;
      case 'inprogress':
        statusValue = 'In progress';
        break;
      case 'completed':
        statusValue = 'Completed';
        break;
      case 'implementing':
        statusValue = 'Implementing';
        break;
      case 'underReview':
        statusValue = 'Under Review';
        break;
      case 'waitingForApproval':
        statusValue = 'Waiting For Approval';
        break;
      case 'review':
        statusValue = 'Review';
        break;
      case 'discussion':
        statusValue = 'Discussion';
        break;
      case 'waitingResponse':
        statusValue = 'Waiting Response';
        break;
      case 'ready':
        statusValue = 'Ready';
        break;
      case 'fixed':
        statusValue = 'Fixed';
        break;
      case 'rejected':
        statusValue = 'Rejected';
        break;
      case 'qa':
        statusValue = 'QA';
        break;
      case 'readyToDeploy':
        statusValue = 'Ready To Deploy';
        break;
      case 'reOpened':
        statusValue = 'Reopened';
        break;
      case 'deployed':
        statusValue = 'Deployed';
      case 'closed':
        statusValue = 'Closed';
        break;
    }
    this.setState({
      taskStatusValue: statusValue,
    });
  }

  async setTaskUserName(taskResult) {
    let projectID = this.state.selectedProjectID;
    let userID = taskResult.data.taskAssignee;
    this.setState({dataLoading: true});
    try {
      let activeUsers = await APIServices.getAllUsersByProjectId(projectID);
      if (activeUsers.message == 'success' && userID) {
        const result = activeUsers.data.find(({userId}) => userId === userID);
        this.setState({
          name: result.firstName + ' ' + result.lastName,
          //activeUsers : activeUsers.data,
        });
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  setDueDate(taskResult) {
    let taskDueDate = moment
      .parseZone(taskResult.data.taskDueDateAt)
      .format('MMMM DD, YYYY');

    let taskDueTime = moment
      .parseZone(taskResult.data.taskDueDateAt)
      .format('hh:mmA');

    //To get the milliseconds
    let dateTimeMilliseconds = moment
      .parseZone(taskResult.data.taskDueDateAt)
      .valueOf();

    let dateTime = new Date(
      dateTimeMilliseconds - moment().utcOffset() * MS_PER_MINUTE,
    );

    // let dateTime = moment
    //   .parseZone(taskResult.data.taskDueDateAt)
    //   .format('YYYY-MM-DD hh:mm:ss a');

    if (taskDueDate != 'Invalid date') {
      this.setState({
        duedate: taskDueDate,
        dueTime: taskDueTime,
        date: new Date(dateTime),
        time: new Date(dateTime),
      });
    }
  }

  setReminderDate(taskResult) {
    let taskReminderDate = moment
      .parseZone(taskResult.data.taskReminderAt)
      .format('MMMM DD, YYYY');

    let taskReminderTime = moment
      .parseZone(taskResult.data.taskReminderAt)
      .format('hh:mmA');

    let dateTimeMilliseconds = moment
      .parseZone(taskResult.data.taskReminderAt)
      .valueOf();

    let dateTime = new Date(
      dateTimeMilliseconds - moment().utcOffset() * MS_PER_MINUTE,
    );

    // let dateTime = moment
    //   .parseZone(taskResult.data.taskReminderAt)
    //   .format('YYYY-MM-DD hh:mm:ss a');

    if (taskReminderDate != 'Invalid date') {
      this.setState({
        remindDate: taskReminderDate,
        reminderTime: taskReminderTime,
        dateReminder: new Date(dateTime),
        timeReminder: new Date(dateTime),
      });
    }
  }

  setTaskNote(taskResult) {
    this.setState({note: taskResult.data.taskNote});
  }

  setIsParent(taskResult) {
    let isParent = taskResult.data.isParent;
    let subTaskListLength = this.state.subTaskListLength;
    this.setState({isParent: isParent});

    if (!isParent) {
      this.setState({
        addParentTaskShow: false,
        addChildTaskShow: false,
        parentID: taskResult.data.parentId,
      });
      this.gerTaskParentName(taskResult.data.parentId);
    }

    if (isParent) {
      this.getSubTAskDetails();
    }
  }

  setIssueType(taskResult) {
    let value = taskResult.data.issueType;
    let issueTypeValue = '';
    let taskTypeArray = [];
    switch (value) {
      case 'development':
        issueTypeValue = 'Development';
        taskTypeArray = development;
        break;
      case 'qa':
        issueTypeValue = 'QA';
        taskTypeArray = qa;
        break;
      case 'design':
        issueTypeValue = 'Design';
        taskTypeArray = design;
        break;
      case 'bug':
        issueTypeValue = 'Bug';
        taskTypeArray = bug;
        break;
      case 'operational':
        issueTypeValue = 'Operational';
        taskTypeArray = operational;
        break;
      case 'preSales':
        issueTypeValue = 'Pre-sales';
        taskTypeArray = preSales;
        break;
      case 'general':
        issueTypeValue = 'General';
        taskTypeArray = general;
        break;
    }
    this.setState({
      issueType: issueTypeValue,
      selectdList: taskTypeArray,
    });
  }

  dateView = function(item) {
    let date = item.taskDueDateAt;
    let currentTime = moment().format();
    let dateText = '';
    let color = '';

    let taskStatus = item.taskStatus;
    if (taskStatus == 'closed' && date) {
      // task complete
      dateText = moment.parseZone(date).format('YYYY-MM-DD');
      color = colors.colorForestGreen;
    } else if (taskStatus != 'closed' && date) {
      if (moment.parseZone(date).isAfter(currentTime)) {
        dateText = moment.parseZone(date).format('YYYY-MM-DD');
        color = colors.colorDeepSkyBlue;
      } else {
        dateText = moment.parseZone(date).format('YYYY-MM-DD');
        color = colors.colorBittersweet;
      }
    } else {
      dateText = 'Add Due Date';
      color = colors.black;
    }

    return <Text style={[styles.textDate, {color: color}]}>{dateText}</Text>;
  };

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
      newDate = moment(date1).format('MMMM DD, YYYY');
      newDateValue = moment(date1).format('DD MM YYYY');
    } else {
      newDate = moment(date1).format('MMMM DD, YYYY');
      newDateValue = moment(date1).format('DD MM YYYY');
    }
    if (this.state.reminder) {
      this.setState({
        remindDate: newDate,
        remindDateValue: newDateValue,
        dateReminder: new Date(date1),
      });
    } else {
      this.setState({
        duedate: newDate,
        duedateValue: newDateValue,
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
      this.setState(
        {
          reminderTime: newTime,
          selectedTimeReminder: newTime,
          showPicker: false,
          showTimePicker: false,
          timeReminder: new Date(time1),
        },
        () => this.changeTaskReminderDate(),
      );
    } else {
      this.setState(
        {
          dueTime: newTime,
          selectedTimeReminder: newTime,
          showPicker: false,
          showTimePicker: false,
          time: new Date(time1),
        },
        () => this.changeTaskDueDate(),
      );
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
      if (this.state.reminder) {
        this.setReminderDate(this.state.taskResult);
      } else {
        this.setDueDate(this.state.taskResult);
      }
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
      if (this.state.reminder) {
        this.setReminderDate(this.state.taskResult);
      } else {
        this.setDueDate(this.state.taskResult);
      }
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
          <Image source={icons.forwordGray} style={styles.imageStyle} />
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
        this.setState({loadDetails: false});
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
        this.props.navigation.navigate('CommentScreen', {
          projectId: this.state.selectedProjectID,
          taskId: this.state.selectedProjectTaskID,
        });
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
          this.state.duedate !== '' && this.state.dueTime !== ''
            ? this.state.duedate + ' : ' + this.state.dueTime
            : '';
        break;
      case 3:
        value =
          this.state.remindDate !== '' && this.state.reminderTime !== ''
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
    this.setState({dataLoading: true, showMessageModal: false});
    await APIServices.changeSprint(
      selectedId,
      previousSprintID,
      selectedProjectID,
      selectedProjectTaskID,
    )
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.taskBlue,
            type: 'success',
            title: 'Sucsess',
            description: 'Sprint has been updated successfully',
            buttons: {},
          };
          this.setState({
            dataLoading: false,
            showMessageModal: true,
            sprintName: selectedName,
          });
        } else {
          this.setState({dataLoading: false});
          this.showAlert('', response.message);
        }
      })
      .catch(error => {
        // if (error.status == 401 || error.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        // }
      });
  }

  async changeTaskNote(note) {
    this.setState({note: note});
  }

  async onSubmitTaskNote(note) {
    this.setState({dataLoading: true, showMessageModal: false});
    let projectID = this.state.selectedProjectID;
    let taskID = this.state.selectedProjectTaskID;
    await APIServices.updateTaskNoteData(projectID, taskID, note)
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.noteRed,
            type: 'success',
            title: 'Sucsess',
            description: 'Notes has been updated successfully',
            buttons: {},
          };
          this.setState({
            dataLoading: false,
            showMessageModal: true,
            note: note,
          });
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        //if (error.status == 401 || error.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        //}
      });
  }

  // change issue typ of task API
  async onChangeIssueType(selectedIssueTypeId, selectedIssueTypeName) {
    this.setState({dataLoading: true, showMessageModal: false});
    let projectID = this.state.selectedProjectID;
    let taskID = this.state.selectedProjectTaskID;
    await APIServices.updateTaskIssueTypeData(
      projectID,
      taskID,
      selectedIssueTypeId,
    )
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.taskBlue,
            type: 'success',
            title: 'Sucsess',
            description: 'Task type has been updated successfully',
            buttons: {},
          };
          this.setState({
            dataLoading: false,
            showMessageModal: true,
            issueType: selectedIssueTypeName,
          });
          this.changeTaskStatusDropDown(selectedIssueTypeId);
        } else {
          this.setState({dataLoading: false});
          this.showAlert('', response.message);
        }
      })
      .catch(error => {
        // if (error.status == 401 || error.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        // }
      });
  }

  async changeTaskStatusDropDown(selectedIssueTypeId) {
    let taskTypeArray = [];
    let taskStatusValue = this.state.taskStatusValue;
    switch (selectedIssueTypeId) {
      case 'development':
        taskTypeArray = development;
        break;
      case 'qa':
        taskTypeArray = qa;
        break;
      case 'design':
        taskTypeArray = design;
        break;
      case 'bug':
        taskTypeArray = bug;
        break;
      case 'operational':
        taskTypeArray = operational;
        break;
      case 'preSales':
        taskTypeArray = preSales;
        break;
      case 'general':
        taskTypeArray = general;
        break;
      default:
        break;
    }

    this.setState({
      selectdList: taskTypeArray,
      taskStatusValue: taskTypeArray[0].value,
    });

    this.onChangeTaskStatus(taskTypeArray[0].id, taskTypeArray[0].value);
  }

  // change assignee of task API
  async changeTaskAssignee(name, userID) {
    this.setState({dataLoading: true, showMessageModal: false});
    let projectID = this.state.selectedProjectID;
    let taskID = this.state.selectedProjectTaskID;
    await APIServices.updateTaskAssigneeData(projectID, taskID, userID)
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.taskUser,
            type: 'success',
            title: 'Sucsess',
            description: 'Task assignee has been updated successfully',
            buttons: {},
          };
          this.setState({
            dataLoading: false,
            showMessageModal: true,
            name: name,
          });
        } else {
          this.setState({dataLoading: false});
          this.showAlert('', response.message);
        }
      })
      .catch(error => {
        // if (error.status == 401 || error.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        // }
      });
  }

  // change status of task API
  async onChangeTaskStatus(selectedTaskStatusId, selectedTaskStatusName) {
    this.setState({dataLoading: true, showMessageModal: false});
    let projectID = this.state.selectedProjectID;
    let taskID = this.state.selectedProjectTaskID;
    await APIServices.updateTaskStatusData(
      projectID,
      taskID,
      selectedTaskStatusId,
    )
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.taskBlue,
            type: 'success',
            title: 'Sucsess',
            description: 'Task status has been updated successfully',
            buttons: {},
          };
          this.setState({
            dataLoading: false,
            showMessageModal: true,
            taskStatusValue: selectedTaskStatusName,
          });
        } else {
          this.setState({dataLoading: false});
          this.showAlert('', response.message);
        }
      })
      .catch(error => {
        // if (error.status == 401 || error.status == 403 || error.status == 400) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        // }
      });
  }

  // change name of task API
  async onTaskNameChangeSubmit(text) {
    this.setState({
      dataLoading: true,
      showMessageModal: false,
      taskNameEditable: false,
    });
    let projectID = this.state.selectedProjectID;
    let taskID = this.state.selectedProjectTaskID;
    await APIServices.updateTaskNameData(projectID, taskID, text)
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.taskBlue,
            type: 'success',
            title: 'Sucsess',
            description: 'Task name has been updated successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        //if (error.status == 401 || error.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        //}
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
    this.setState({dataLoading: true, showMessageModal: false});
    await APIServices.updateTaskDueDateData(projectID, taskID, IsoDueDate)
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.calendarBlue,
            type: 'success',
            title: 'Sucsess',
            description: 'Due date has been updated successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
          this.fetchData(projectID, taskID);
        } else {
          this.setState({dataLoading: false});
          this.setDueDate(this.state.taskResult);
        }
      })
      .catch(error => {
        //if (error.status == 401 || error.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        this.setDueDate(this.state.taskResult);
        //}
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
      this.setState({dataLoading: true, showMessageModal: false});
      let resultData = await APIServices.updateTaskReminderDateData(
        projectID,
        taskID,
        IsoReminderDate,
      );
      if (resultData.message == 'success') {
        this.details = {
          icon: icons.clockOrange,
          type: 'success',
          title: 'Sucsess',
          description: 'Remind date has been updated successfully',
          buttons: {},
        };
        this.setState({dataLoading: false, showMessageModal: true});
        this.fetchData(projectID, taskID);
      } else {
        this.setState({dataLoading: false});
        this.setReminderDate(this.state.taskResult);
      }
    } catch (e) {
      if (e.status == 401 || e.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', e.data.message);
        this.setReminderDate(this.state.taskResult);
      }
    }
  }

  deleteTask() {
    let projectID = this.state.selectedProjectID;
    let taskID = this.state.selectedProjectTaskID;
    let tskInitiator = this.state.projectTaskInitiator;
    let taskName = this.state.taskName;

    this.deleteTsakOkPress(projectID, taskID, taskName, tskInitiator);
  }

  deleteTsakOkPress(projectID, taskId, taskName, tskInitiator) {
    this.setState({dataLoading: true, showMessageModal: false});
    APIServices.deleteSingleTask(projectID, taskId, taskName, tskInitiator)
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.taskBlue,
            type: 'success',
            title: 'Sucsess',
            description: this.state.isParent
              ? 'Task deleted successfully'
              : 'Sub task deleted successfully',
            buttons: {},
          };
          this.setState({
            dataLoading: false,
            deleteTaskSuccess: true,
            showMessageModal: true,
          });
          // Alert.alert(
          //   'Success',
          //   'Task Deleted',
          //   [{text: 'OK', onPress: () => this.props.navigation.goBack()}],
          //   {cancelable: false},
          // );
        } else {
          this.setState({dataLoading: false, deleteTaskSuccess: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false, deleteTaskSuccess: false});
        this.showAlert('', error.data.message);
      });
  }

  async onBackPress() {
    await this.props.secondDetailViewOpen(false);
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
          <Image source={{uri: userImage}} style={styles.imageStyle} />
        </FadeIn>
      );
    } else {
      return <Image style={styles.imageStyle} source={icons.defultUser} />;
    }
  };

  async navigateTo(item) {
    let isSecondDetailViewOpen = this.props.isSecondDetailViewOpen;
    this.setState({loadDetails: true});
    if (!isSecondDetailViewOpen) {
      this.props.navigation.navigate('TasksSubDetailsScreen', {
        taskId: item.taskId,
        id: this.state.selectedProjectID,
        name: this.state.selectedProjectName,
      });
      await this.props.secondDetailViewOpen(true);
    }
  }

  async navigateToSubTask() {
    let parentID = this.state.parentID;
    this.setState({dataLoading: false, loadDetails: true});
    try {
      let taskResult = await APIServices.getProjecTaskData(
        this.state.selectedProjectID,
        parentID,
      );
      if (taskResult.message == 'success') {
        this.setState({dataLoading: false});
        this.changeScreen(taskResult.data);
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  async changeScreen(item) {
    let isSecondDetailViewOpen = this.props.isSecondDetailViewOpen;
    if (!isSecondDetailViewOpen) {
      this.props.navigation.navigate('TasksSubDetailsScreen', {
        taskId: item.taskId,
        id: this.state.selectedProjectID,
        name: this.state.selectedProjectName,
      });
      await this.props.secondDetailViewOpen(true);
    }
  }

  renderSubtasksList(item, index, userId, projectId) {
    let isSecondDetailViewOpen = this.props.isSecondDetailViewOpen;
    return (
      <TouchableOpacity
        disabled={isSecondDetailViewOpen}
        onPress={() => this.navigateTo(item)}>
        <View style={styles.subTasksListView}>
          <Image
            style={styles.subTasksCompletionIcon}
            source={
              item.taskStatus == 'closed'
                ? icons.rightCircule
                : icons.whiteCircule
            }
          />
          <View style={styles.subTasksNameStyle}>
            <Text style={styles.subTaskMainText} numberOfLines={1}>
              {item.secondaryTaskId}
            </Text>
            <Text style={styles.subTaskText} numberOfLines={1}>
              {item.taskName}
            </Text>
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

  onFilterTaskTypes = (value, index, data) => {
    const selectedIssueTypeId = data[index].id;
    let selectedIssueTypeName = data[index].value;
    this.onChangeIssueType(selectedIssueTypeId, selectedIssueTypeName);
  };

  onFilterTaskStatusData = (value, index, data) => {
    const selectedTaskStatusId = data[index].id;
    let selectedTaskStatusName = data[index].value;
    this.onChangeTaskStatus(selectedTaskStatusId, selectedTaskStatusName);
  };

  onTaskDeketePress() {
    // this.deleteTask();
    let isParent = this.state.isParent;
    let descriptionTask =
      "You're about to permanently delete this task, its comments and attachments, and all of its data.\nIf you're not sure, you can close this pop up.";
    let descriptionSubTask =
      "You're about to permanently delete this sub task and all of its data.\nIf you're not sure, you can close this pop up.";

    this.details = {
      icon: icons.alertRed,
      type: 'confirm',
      title: isParent ? 'Delete Task' : 'Delete Sub Task',
      description: isParent ? descriptionTask : descriptionSubTask,
      buttons: {positive: 'Delete', negative: 'Cancel'},
    };
    this.onPressMessageModal = () => this.deleteTask(this);
    this.setState({showMessageModal: true});
  }

  onAddTaskPress(fromParent) {
    let selectedProjectTaskID = this.state.selectedProjectTaskID;
    let allDetails = this.state.allDetails;

    this.setState({
      showTaskModal: true,
      fromParent: fromParent,
      selectedTaskName: fromParent ? 'Select parent task' : 'Select child task',
    });

    this.getTaskModalData(selectedProjectTaskID, allDetails, fromParent);
  }

  onCloseTaskModal() {
    this.setState({showTaskModal: false});
  }

  getDisabledStaus() {
    if (
      this.state.selectedTaskName == 'Select parent task' ||
      this.state.selectedTaskName == 'Select child task' ||
      this.state.selectedTaskName == 'No data avilable'
    ) {
      return true;
    } else {
      return false;
    }
  }

  onCanclePress() {
    this.setState({showTaskModal: false});
  }

  onFilterTaskModalData = (value, index, data) => {
    let selectedTaskIdModal = data[index].id;
    let selectedTaskNameModal = data[index].value;

    this.setState({
      selectedTaskName: selectedTaskNameModal,
      selectedTaskID: selectedTaskIdModal,
    });
  };

  async getAllTaskInProject(selectedProjectID) {
    let startIndex = 0;
    let endIndex = 10;
    let allTasks = true;
    this.setState({
      filterType: 'None',
    });
    AsyncStorage.getItem('userID').then(userID => {
      this.props.getAllTaskInProjects(
        userID,
        selectedProjectID,
        startIndex,
        endIndex,
        allTasks,
      );
    });
  }

  async getChildTasksOfParent(selectedProjectID, newParent, selectedTaskID) {
    this.setState({dataLoading: true});
    await APIServices.getChildTasksOfParentData(selectedProjectID, newParent)
      .then(async response => {
        if (response.message == 'success') {
          await this.setState({
            dataLoading: false,
            subTaskList: response.data ? [response.data] : [],
            subTaskListLength: response.data ? response.data.length : 0,
            selectedProjectTaskID: newParent,
          });
          this.fetchData(selectedProjectID, newParent);
          // this.fetchFilesData(selectedProjectID, newParent);
          // this.getAllSprintInProject(selectedProjectID, this.state.sprintId);
          // this.getAllTaskInProject(selectedProjectID);
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
      });
  }

  async onSavePress(fromParent) {
    let selectedProjectID = this.state.selectedProjectID;
    let newParent = fromParent
      ? this.state.selectedTaskID
      : this.state.selectedProjectTaskID;

    let selectedProjectTaskID = fromParent
      ? this.state.selectedProjectTaskID
      : this.state.selectedTaskID;

    let selectedTaskNameModal = this.state.selectedTaskName;
    let parentTaskName = this.state.selectedTaskName;
    let projectTaskInitiator = this.state.projectTaskInitiator;

    this.setState({
      dataLoading: true,
      showMessageModal: false,
      showTaskModal: false,
    });

    await APIServices.updateParentToChild(
      selectedProjectID,
      selectedProjectTaskID,
      newParent,
    )
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.taskBlue,
            type: 'success',
            title: 'Sucsess',
            description: fromParent
              ? 'Parent task have been added successfully'
              : 'Child task have been added successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
          this.fetchData(selectedProjectID, this.state.selectedProjectTaskID);
          // this.fetchFilesData(
          //   selectedProjectID,
          //   this.state.selectedProjectTaskID,
          // );
          // this.getAllTaskInProject(selectedProjectID);
          this.setState({parentTaskName: parentTaskName});
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
      });
  }

  renderTaskModal() {
    let fromParent = this.state.fromParent;
    return (
      <Modal
        isVisible={this.state.showTaskModal}
        style={styles.modalStyle}
        onBackButtonPress={() => this.onCloseTaskModal()}
        onBackdropPress={() => this.onCloseTaskModal()}
        onRequestClose={() => this.onCloseTaskModal()}
        // coverScreen={false}
        backdropTransitionOutTiming={0}>
        <View style={styles.modalMainView}>
          <View style={styles.modalHeaderView}>
            <Image
              style={styles.iconStyle}
              source={icons.subTasksRoundedGreen}
              resizeMode="contain"
            />
            <Text style={styles.modalHeadderText}>
              {fromParent ? 'Add Parent Task' : 'Add Child Task'}
            </Text>
          </View>
          <View style={styles.taskModalDropDownView}>
            <Dropdown
              // style={{}}
              label=""
              labelFontSize={0}
              data={this.state.taskModalData}
              textColor={this.getDisabledStaus() ? colors.gray : colors.black}
              fontSize={14}
              renderAccessory={() => null}
              error={''}
              animationDuration={0.5}
              containerStyle={{width: '100%'}}
              overlayStyle={{width: '100%'}}
              pickerStyle={styles.taskModalDataPicker}
              dropdownPosition={0}
              value={this.state.selectedTaskName}
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
              onChangeText={this.onFilterTaskModalData}
            />
          </View>
          <View style={styles.ButtonViewStyle}>
            <TouchableOpacity
              style={styles.cancelStyle}
              onPress={() => this.onCanclePress()}>
              <Text style={styles.cancelTextStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.okStyle,
                {
                  backgroundColor: this.getDisabledStaus()
                    ? colors.lighterGray
                    : colors.lightGreen,
                },
              ]}
              disabled={this.getDisabledStaus()}
              onPress={() => this.onSavePress(fromParent)}>
              <Text style={styles.saveTextStyle}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  async onTaskNameEditPress() {
    await this.setState({taskNameEditable: true});
    this.taskNameTextInput.focus();
  }

  async backPress() {
    await this.props.secondDetailViewOpen(false);
    this.props.navigation.goBack();
  }

  onPressCancel() {
    if (
      this.props.navigation.state.routeName == 'TasksSubDetailsScreen' &&
      this.state.isParent &&
      this.state.deleteTaskSuccess
    ) {
      this.props.navigation.pop(2);
    } else if (this.state.deleteTaskSuccess) {
      this.props.navigation.goBack();
    }
    this.setState({showMessageModal: false});
  }

  changeTimeWeight(val, type) {
    let removedText = val.replace(/\D+/g, '');
    let removedTextPoints = val
      .replace(',', '.')
      .replace(/[^\d\.]/g, '')
      .replace(/\./, 'x')
      .replace(/\./g, '')
      .replace(/x/, '.');
    let removedTextPointsLength =
      removedTextPoints.split('.')[1] != undefined
        ? removedTextPoints.split('.')[1].length
        : null;

    switch (type) {
      case 'est-hours':
        this.setState({estimatedHours: removedText});
        break;

      case 'est-mins':
        this.setState({estimatedMins: removedText});
        if (parseInt(removedText) > 59 || removedText.length > 2) {
          this.setState({invalidEstMimutesError: true});
        } else {
          this.setState({invalidEstMimutesError: false});
        }
        break;

      case 'act-hours':
        this.setState({actualHours: removedText});
        break;

      case 'act-mins':
        this.setState({actualMins: removedText});
        if (parseInt(removedText) > 59 || removedText.length > 2) {
          this.setState({invalidActMimutesError: true});
        } else {
          this.setState({invalidActMimutesError: false});
        }
        break;

      case 'est_points':
        this.setState({estimatedPoints: removedTextPoints});
        if (removedTextPointsLength > 1) {
          this.setState({invalidEstPointsError: true});
        } else {
          this.setState({invalidEstPointsError: false});
        }
        break;

      case 'act-points':
        this.setState({actualPoints: removedTextPoints});
        if (removedTextPointsLength > 1) {
          this.setState({invalidActPointsError: true});
        } else {
          this.setState({invalidActPointsError: false});
        }
        break;

      default:
    }
  }

  async onSubmitWeight() {
    let selectedProjectID = this.state.selectedProjectID;
    let selectedProjectTaskID = this.state.selectedProjectTaskID;
    let estimatedWeight = '';
    let actualWeight = '';
    let estimatedWeightFlot = 0;
    let actualWeightFlot = 0;

    if (this.state.istimeBasedWeight == 'time') {
      estimatedWeight =
        this.state.estimatedHours + '.' + this.state.estimatedMins;
      actualWeight = this.state.actualHours + '.' + this.state.actualMins;
    } else {
      estimatedWeight = this.state.estimatedPoints;
      actualWeight = this.state.actualPoints;
    }

    estimatedWeightFlot = parseFloat(estimatedWeight);
    actualWeightFlot = parseFloat(actualWeight);

    await APIServices.updateTaskWeightData(
      selectedProjectID,
      selectedProjectTaskID,
      estimatedWeightFlot,
      actualWeightFlot,
    )
      .then(async response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.weightTypeRoundedBlue,
            type: 'success',
            title: 'Sucsess',
            description: 'Weight type has been updated successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        //if (error.status == 401 || error.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        //}
      });
  }

  render() {
    let taskStatusValue = this.state.taskStatusValue;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let taskName = this.state.taskName;
    let selectedSprint = this.state.selectedSprint;
    let sprints = this.state.sprints;
    let secondaryTaskId = this.state.secondaryTaskId;
    let isParent = this.state.isParent;
    let addParentTaskShow = this.state.addParentTaskShow;
    let addChildTaskShow = this.state.addChildTaskShow;
    let isSecondDetailViewOpen = this.props.isSecondDetailViewOpen;
    let invalidEstMimutesError = this.state.invalidEstMimutesError;
    let invalidActMimutesError = this.state.invalidActMimutesError;
    let invalidEstPointsError = this.state.invalidEstPointsError;
    let invalidActPointsError = this.state.invalidActPointsError;

    return (
      <View style={styles.container}>
        {this.state.loadDetails ? (
          <NavigationEvents onWillFocus={payload => this.pageOpen(payload)} />
        ) : null}

        <Header
          isTaskLog={false}
          isDelete={true}
          navigation={this.props.navigation}
          title={this.state.selectedProjectName}
          // drawStatus={true}
          // taskStatus={taskStatus ? taskStatus : ''}
          onPress={() => this.backPress()}
          onPressTaskLog={() =>
            this.props.navigation.navigate('TaskLogScreen', {
              selectedProjectTaskID: this.state.selectedProjectTaskID,
            })
          }
          onPressDelete={() => this.onTaskDeketePress()}
        />
        <ScrollView style={styles.container}>
          <View>
            <View style={styles.headerView}>
              <Text style={styles.headerTaskText}>Task - </Text>
              <Text style={styles.headerText}> #{secondaryTaskId}</Text>
              <View style={styles.projectFilerView}>
                <Text style={styles.statusText}>{taskStatusValue}</Text>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TextInput
                ref={input => {
                  this.taskNameTextInput = input;
                }}
                style={[styles.taskNameStyle]}
                placeholder={'Task name'}
                multiline={true}
                value={this.state.taskName}
                editable={this.state.taskNameEditable}
                onBlur={() => this.onTaskNameChangeSubmit(this.state.taskName)}
                onChangeText={text => this.onTaskNameChange(text)}
                onSubmitEditing={() =>
                  this.onTaskNameChangeSubmit(this.state.taskName)
                }
                maxLength={100}
                multiline={true}
              />
              <TouchableOpacity onPress={() => this.onTaskNameEditPress()}>
                <Image
                  style={styles.iconEdit}
                  source={icons.editRoundedBlue}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.borderStyle} />
            <View style={styles.buttonAddTaskView}>
              {addParentTaskShow ? (
                <TouchableOpacity
                  style={styles.buttonAddParentTask}
                  onPress={() => this.onAddTaskPress(true)}>
                  <Text style={{color: colors.white}}>Add parent task</Text>
                </TouchableOpacity>
              ) : null}
              {addChildTaskShow ? (
                <TouchableOpacity
                  style={[
                    styles.buttonAddChildTask,
                    {marginLeft: addParentTaskShow && addChildTaskShow ? 7 : 0},
                  ]}
                  onPress={() => this.onAddTaskPress(false)}>
                  <Text style={{color: colors.white}}>Add child task</Text>
                </TouchableOpacity>
              ) : null}
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
                <TouchableOpacity
                  disabled={isSecondDetailViewOpen}
                  onPress={() => this.navigateToSubTask()}>
                  <View style={{flex: 1}}>
                    <Text style={styles.parentTaskText}>Parent Task</Text>
                    <View style={({flex: 1}, {flexDirection: 'row'})}>
                      <Image
                        style={styles.parentTasksCompletionIcon}
                        source={
                          this.state.parentTaskStatus == 'closed'
                            ? icons.rightCircule
                            : icons.greyOutlineCircule
                        }
                      />
                      <Text style={styles.childTaskText}>
                        {this.state.parentTaskName}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
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
                <Text
                  style={[
                    styles.parentTaskText,
                    {marginLeft: EStyleSheet.value('15rem')},
                  ]}>
                  Task Status
                </Text>
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
                    pickerStyle={styles.issueTypePicker}
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
                    onChangeText={this.onFilterTaskTypes}
                  />
                </View>
                <View style={[styles.taskTypeDropDownView, {marginLeft: 5}]}>
                  <Dropdown
                    // style={{}}
                    label=""
                    labelFontSize={0}
                    data={this.state.selectdList}
                    textColor={colors.black}
                    fontSize={14}
                    renderAccessory={() => null}
                    error={''}
                    animationDuration={0.5}
                    containerStyle={{width: '100%'}}
                    overlayStyle={{width: '100%'}}
                    pickerStyle={styles.taskStatusDataPicker}
                    dropdownPosition={0}
                    value={this.state.taskStatusValue}
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
                    onChangeText={this.onFilterTaskStatusData}
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
                  {isParent ? (
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
                      pickerStyle={styles.sprintPicker}
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
                      //disabled={isParent ? false : true}
                    />
                  ) : (
                    <View style={styles.sprintNameViewMainView}>
                      <Text style={styles.sprintNameView}>
                        {this.state.sprintName}
                      </Text>
                    </View>
                  )}
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

            <View style={styles.weightMainView}>
              <Image
                style={styles.iconStyle}
                source={icons.weightTypeRoundedBlue}
                resizeMode="contain"
              />
              <View style={styles.weightView}>
                <Text style={styles.weightTitleText}>
                  {this.state.istimeBasedWeight == 'time'
                    ? 'Task Weight - Time'
                    : 'Task Weight - Story Points'}
                </Text>
                {this.state.istimeBasedWeight == 'time' ? (
                  <View>
                    <Text style={styles.weightText}>{'Estimated Time'}</Text>
                    <View style={styles.pointsParentWrap}>
                      <View style={styles.weightInputFlexingLeft}>
                        <Text style={styles.weightsubText}>{'hours'}</Text>
                        <View style={styles.pointsInnerWrapLeft}>
                          <TextInput
                            style={styles.weightTextInput}
                            placeholder={'Enter value'}
                            value={this.state.estimatedHours}
                            keyboardType={'numeric'}
                            multiline={false}
                            onChangeText={text =>
                              this.changeTimeWeight(text, 'est-hours')
                            }
                          />
                        </View>
                      </View>
                      <View style={styles.weightInputFlexingRight}>
                        <Text style={styles.weightsubText}>{'minutes'}</Text>
                        <View style={styles.pointsInnerWrapRight}>
                          <TextInput
                            style={styles.weightTextInput}
                            placeholder={'Enter value'}
                            value={this.state.estimatedMins}
                            keyboardType={'numeric'}
                            multiline={false}
                            onChangeText={text =>
                              this.changeTimeWeight(text, 'est-mins')
                            }
                          />
                        </View>
                        {this.state.invalidEstMimutesError ? (
                          <Text style={styles.minutesErrorText}>
                            {'Invalid minutes'}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    <View style={styles.mainActualTimeView}>
                      <Text style={styles.weightText}>{'Actual Time'}</Text>
                      <View style={styles.pointsParentWrap}>
                        <View style={styles.weightInputFlexingLeft}>
                          <Text style={styles.weightsubText}>{'hours'}</Text>
                          <View style={styles.pointsInnerWrapLeft}>
                            <TextInput
                              style={styles.weightTextInput}
                              placeholder={'Enter value'}
                              value={this.state.actualHours}
                              keyboardType={'numeric'}
                              multiline={false}
                              onChangeText={text =>
                                this.changeTimeWeight(text, 'act-hours')
                              }
                            />
                          </View>
                        </View>
                        <View style={styles.weightInputFlexingRight}>
                          <Text style={styles.weightsubText}>{'minutes'}</Text>
                          <View style={styles.pointsInnerWrapRight}>
                            <TextInput
                              style={styles.weightTextInput}
                              placeholder={'Enter value'}
                              value={this.state.actualMins}
                              keyboardType={'numeric'}
                              multiline={false}
                              onChangeText={text =>
                                this.changeTimeWeight(text, 'act-mins')
                              }
                            />
                          </View>
                          {this.state.invalidActMimutesError ? (
                            <Text style={styles.minutesErrorText}>
                              {'Invalid minutes'}
                            </Text>
                          ) : null}
                        </View>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={styles.pointsParentWrap}>
                    <View style={styles.weightInputFlexingLeft}>
                      <Text style={styles.weightPointText}>{'Estimated'}</Text>
                      <View style={styles.pointsInnerWrap}>
                        <TextInput
                          style={styles.weightTextInput}
                          placeholder={'points'}
                          value={this.state.estimatedPoints}
                          keyboardType={'numeric'}
                          multiline={false}
                          onChangeText={text =>
                            this.changeTimeWeight(text, 'est_points')
                          }
                        />
                      </View>
                      {this.state.invalidEstPointsError ? (
                        <Text style={styles.minutesErrorText}>
                          {'Invalid points'}
                        </Text>
                      ) : null}
                    </View>
                    <View style={styles.weightInputFlexingRight}>
                      <Text style={styles.weightPointText}>{'Actual'}</Text>
                      <View style={styles.pointsInnerWrap}>
                        <TextInput
                          style={styles.weightTextInput}
                          placeholder={'points'}
                          value={this.state.actualPoints}
                          keyboardType={'numeric'}
                          multiline={false}
                          onChangeText={text =>
                            this.changeTimeWeight(text, 'act-points')
                          }
                        />
                      </View>
                      {this.state.invalidActPointsError ? (
                        <Text style={styles.minutesErrorText}>
                          {'Invalid points'}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                )}
                <TouchableOpacity
                  style={[
                    styles.updateWeightView,
                    {
                      backgroundColor:
                        invalidEstMimutesError ||
                        invalidActMimutesError ||
                        invalidEstPointsError ||
                        invalidActPointsError
                          ? colors.lightgray
                          : colors.lightBlue,
                    },
                  ]}
                  disabled={
                    invalidEstMimutesError ||
                    invalidActMimutesError ||
                    invalidEstPointsError ||
                    invalidActPointsError
                  }
                  onPress={() => this.onSubmitWeight()}>
                  <Text style={styles.updateWeightText}>UPDATE WEIGHT</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.borderStyle} />

            <FlatList
              data={taskData}
              renderItem={({item}) => this.renderProjectList(item)}
              keyExtractor={item => item.taskId}
            />
            <TouchableOpacity
              onPress={() => this.filePicker()}
              disabled={this.state.indeterminate}>
              {this.state.files.length > 0 ? (
                <View
                  style={[
                    styles.taskFieldDocPickView,
                    {flexDirection: 'row', flexWrap: 'wrap'},
                  ]}>
                  {this.renderDocPickeredView()}
                </View>
              ) : (
                <View style={[styles.taskFieldView, {flexDirection: 'row'}]}>
                  <Image
                    style={[styles.fileUploadIcon, {marginRight: 10}]}
                    source={icons.upload}
                    resizeMode={'contain'}
                  />
                  <Text style={[styles.addFilesText, {flex: 1}]}>
                    Add files
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <FlatList
              style={styles.flalList}
              data={this.state.filesData}
              renderItem={({item}) => this.renderFilesList(item)}
              keyExtractor={item => item.projId}
              // onRefresh={() => this.onRefresh()}
              // refreshing={isFetching}
            />
            {this.state.showPicker ? this.renderDatePicker() : null}
            {this.state.showTimePicker ? this.renderTimePicker() : null}
            {this.renderTaskModal()}
          </View>
        </ScrollView>
        <FilePickerModal
          showFilePickerModal={this.state.showFilePickerModal}
          onPressCancel={() => this.onCloseFilePickerModal()}
          selectCamera={() => this.selectCamera()}
          selectFiles={() => this.selectFiles()}
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
          details={this.details}
          onPress={this.onPressMessageModal}
          onPressCancel={() => this.onPressCancel(this)}
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
  projectFilerView: {
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '30rem',
    width: '100rem',
    marginHorizontal: '20rem',
  },
  projectView: {
    borderRadius: '5rem',
    marginTop: '20rem',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '11rem',
    color: colors.projectTaskNameColor,
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  textDate: {
    fontSize: '9rem',
    fontWeight: '400',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    marginRight: '5rem',
  },
  statusView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dropIcon: {
    width: '13rem',
    height: '13rem',
  },
  landing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '20rem',
    marginTop: '20rem',
  },
  headerTaskText: {
    color: colors.colorShuttleGrey,
    fontFamily: 'CircularStd-Medium',
  },
  headerText: {
    fontSize: '20rem',
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium',
    color: colors.colorMidnightExpress,
  },
  taskNameStyle: {
    flex: 1,
    color: colors.colorLightSlateGrey,
    fontSize: '14rem',
    fontWeight: 'bold',
    marginLeft: '20rem',
    marginRight: '20rem',
    marginBottom: '0rem',
    fontFamily: 'CircularStd-Medium',
  },
  borderStyle: {
    borderWidth: '0.4rem',
    borderColor: colors.lightgray,
    marginBottom: '8rem',
    top: Platform.OS === 'ios' ? '10rem' : '0rem',
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
    borderRadius: '5rem',
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
  subTasksNameStyle: {
    flex: 1,
    flexDirection: 'row',
    marginRight: '60rem',
  },
  subTaskMainText: {
    fontSize: '11rem',
    color: colors.projectTaskNameColor,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Bold',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  subTaskText: {
    fontSize: '10rem',
    color: colors.projectTaskNameColor,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
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
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    paddingHorizontal: '12rem',
    height: '45rem',
  },
  taskTypeNameView: {
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: Platform.OS == 'ios' ? '0rem' : '-3rem',
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
    borderRadius: '5rem',
    borderWidth: '1rem',
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
    marginTop: '0rem',
    marginBottom: '20rem',
  },
  taskStateIcon: {
    width: '38rem',
    height: '38rem',
  },
  statusText: {
    fontSize: '11rem',
    fontFamily: 'CircularStd-Medium',
    fontWeight: 'bold',
    color: colors.white,
  },
  buttonAddTaskView: {
    flexDirection: 'row',
    marginHorizontal: '20rem',
  },
  buttonAddParentTask: {
    flex: 1,
    backgroundColor: colors.lightGreen,
    height: '45rem',
    marginRight: '7rem',
    borderRadius: '5rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5rem',
    marginBottom: '12rem',
  },
  buttonAddChildTask: {
    flex: 1,
    backgroundColor: colors.colorsNavyBlue,
    height: '45rem',
    marginLeft: '7rem',
    borderRadius: '5rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '5rem',
    marginBottom: '12rem',
  },
  updateNotesView: {
    backgroundColor: colors.lightBlue,
    height: '30rem',
    width: '120rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5rem',
    marginBottom: '20rem',
    top: Platform.OS === 'ios' ? '10rem' : '0rem',
  },
  updateNotesText: {
    color: colors.white,
    fontSize: '11rem',
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium',
  },
  taskFieldDocPickView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '15rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
    paddingVertical: '6rem',
  },
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '15rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '50rem',
    marginHorizontal: '20rem',
  },
  fileUploadIcon: {
    width: '23rem',
    height: '23rem',
  },
  addFilesText: {
    fontSize: '12rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '7rem',
  },
  uploadingText: {
    marginTop: '5rem',
    textAlign: 'center',
    fontSize: '11rem',
    color: colors.darkBlue,
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium',
  },
  ButtonViewStyle: {
    flexDirection: 'row',
    marginTop: '5rem',
    marginBottom: '20rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '20rem',
  },
  cancelStyle: {
    marginRight: '10rem',
    backgroundColor: colors.lightRed,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    flex: 1,
    justifyContent: 'center',
  },
  okStyle: {
    backgroundColor: colors.lightGreen,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    flex: 1,
    justifyContent: 'center',
  },
  cancelTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
  },
  saveTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
  },
  modalStyle: {
    marginBottom: '0rem',
  },
  taskModalDropDownView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '15rem',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
  },
  modalMainView: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
  },
  modalHeaderView: {
    flexDirection: 'row',
    marginHorizontal: '20rem',
    marginVertical: '20rem',
    alignItems: 'center',
  },
  modalHeadderText: {
    fontSize: '16rem',
    fontFamily: 'CircularStd-Medium',
  },
  iconEdit: {
    width: '20rem',
    height: '20rem',
    marginRight: '20rem',
  },
  progressBarView: {
    width: '100%',
    height: '50rem',
    borderRadius: '5rem',
    marginRight: '5rem',
    marginTop: '5rem',
    justifyContent: 'center',
  },
  sprintNameView: {
    marginTop: '5rem',
    fontFamily: 'CircularStd-Medium',
    fontSize: '15rem',
    color: colors.detailsViewText,
    padding: '08rem',
  },
  sprintNameViewMainView: {},
  taskModalDataPicker: {
    width: '79.5%',
    marginTop: '59rem',
    marginLeft: '32rem',
  },
  issueTypePicker: {
    width: '38%',
    marginTop: '58rem',
    marginLeft: '54rem',
  },
  taskStatusDataPicker: {
    width: '38%',
    marginTop: '58rem',
    marginLeft: '208rem',
  },
  sprintPicker: {
    width: '78%',
    marginTop: '58rem',
    marginLeft: '54rem',
  },
  parentTasksCompletionIcon: {
    width: '15rem',
    height: '15rem',
    marginRight: '5rem',
  },
  imageStyle: {
    width: '22rem',
    height: '22rem',
    borderRadius: 50 / 2,
  },
  controlIcon: {
    width: '28rem',
    height: '28rem',
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
  pointsInnerWrap: {
    backgroundColor: colors.projectBgColor,
    marginBottom: '5rem',
    marginTop: '5rem',
    borderRadius: '5rem',
    height: '40rem',
  },
  weightInputFlexingLeft: {
    flex: 1,
    marginRight: '5rem',
  },
  weightInputFlexingRight: {
    flex: 1,
    marginLeft: '5rem',
  },
  pointsParentWrap: {
    flex: 1,
    flexDirection: 'row',
  },
  weightMainView: {
    marginHorizontal: '20rem',
    marginTop: '15rem',
    flexDirection: 'row',
  },
  weightView: {
    flex: 1,
  },
  weightTextInput: {
    fontSize: '11rem',
    color: colors.detailsViewText,
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    width: '100%',
    textAlignVertical: 'top',
    marginLeft: '10rem',
    marginTop: Platform.OS == 'ios' ? '12rem' : '2rem',
  },
  weightTitleText: {
    fontSize: '10rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.projectTaskNameColor,
    marginBottom: '-5rem',
  },
  weightText: {
    fontSize: '10rem',
    fontFamily: 'CircularStd-Medium',
    color: 'gray',
    marginTop: '15rem',
    marginLeft: '2rem',
  },
  weightsubText: {
    fontSize: '9rem',
    fontFamily: 'CircularStd-Medium',
    color: 'gray',
    marginTop: '5rem',
    marginLeft: '2rem',
  },
  weightPointText: {
    fontSize: '10rem',
    fontFamily: 'CircularStd-Medium',
    color: 'gray',
    marginTop: '15rem',
    marginLeft: '2rem',
    marginBottom: '2rem',
  },
  pointsInnerWrapLeft: {
    backgroundColor: colors.projectBgColor,
    marginBottom: '5rem',
    marginTop: '5rem',
    borderRadius: '5rem',
    height: '40rem',
  },
  pointsInnerWrapRight: {
    backgroundColor: colors.projectBgColor,
    marginBottom: '5rem',
    marginTop: '5rem',
    borderRadius: '5rem',
    height: '40rem',
  },
  mainActualTimeView: {
    marginBottom: '0rem',
  },
  updateWeightView: {
    backgroundColor: colors.lightBlue,
    height: '30rem',
    width: '120rem',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5rem',
    marginBottom: '20rem',
    marginTop: '15rem',
    top: Platform.OS === 'ios' ? '10rem' : '0rem',
  },
  updateWeightText: {
    color: colors.white,
    fontSize: '11rem',
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium',
  },
  minutesErrorText: {
    color: colors.colorCoralRed,
    fontSize: '9rem',
    fontFamily: 'CircularStd-Medium',
    marginLeft: '2rem',
  },
});

const mapStateToProps = state => {
  return {
    deleteTaskLoading: state.project.deleteTaskLoading,
    deleteTaskSuccess: state.project.deleteTaskSuccess,
    deleteTaskError: state.project.deleteTaskError,
    deleteTaskErrorMessage: state.project.deleteTaskErrorMessage,
    allTaskByProjectLoading: state.project.allTaskByProjectLoading,
    allTaskByProject: state.project.allTaskByProject,
    isSecondDetailViewOpen: state.project.isSecondDetailViewOpen,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(TasksDetailsScreen);
