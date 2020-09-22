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
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
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

let taskStatusData = [
  {value: 'Open', id: 'open'},
  {value: 'Closed', id: 'closed'},
];
let MS_PER_MINUTE = 60000;
class GroupTasksDetailsScreen extends Component {
  details = {
    icon: icons.alertRed,
    type: 'confirm',
    title: 'Delete Group Task',
    description:
      "You're about to permanently delete this group task, its comments and attachments, and all of its data.\nIf you're not sure, you can close this pop up.",
    buttons: {positive: 'Delete', negative: 'Cancel'},
  };
  onPressMessageModal = () => {};

  constructor(props) {
    super(props);
    this.state = {
      bottomItemPressColor: colors.darkBlue,
      selectedGroupTaskID: '',
      selectedTaskID: '',
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
      selectedGroupTaskName: '',
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
      selectedTaskIDFromModal: '',
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
      showMessageModal: false,
      deleteTaskSuccess: false,
      loadDetails: true,
      showFilePickerModal: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.deleteSingleTaskInGroupError !==
        this.props.deleteSingleTaskInGroupError &&
      this.props.deleteSingleTaskInGroupError &&
      this.props.deleteSingleTaskInGroupErrorMessage == ''
    ) {
      this.showAlert('', 'Error');
    }

    if (
      prevProps.deleteSingleTaskInGroupError !==
        this.props.deleteSingleTaskInGroupError &&
      this.props.deleteSingleTaskInGroupError &&
      this.props.deleteSingleTaskInGroupErrorMessage != ''
    ) {
      this.showAlert('', this.props.deleteTaskErrorMessage);
    }

    if (
      prevProps.deleteSingleTaskInGroupSuccess !==
        this.props.deleteSingleTaskInGroupSuccess &&
      this.props.deleteSingleTaskInGroupSuccess
    ) {
      Alert.alert(
        'Success',
        'Task Deleted',
        [{text: 'OK', onPress: () => this.props.navigation.goBack()}],
        {cancelable: false},
      );
    }

    if (
      prevProps.allTaskByGroupLoading !== this.props.allTaskByGroupLoading &&
      this.props.allTaskByGroup &&
      this.props.allTaskByGroup.length > 0
    ) {
      this.setState({
        allDetails: this.props.allTaskByGroup,
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

    let selectedTaskID = params.taskId;
    let selectedGroupTaskID = params.id;
    let selectedGroupTaskName = params.name;
    let parentTaskName = params.parentTaskName ? params.parentTaskName : '';

    this.setState({
      selectedGroupTaskID: selectedGroupTaskID,
      selectedGroupTaskName: selectedGroupTaskName,
      selectedTaskID: selectedTaskID,
      parentTaskName: parentTaskName,
    });

    this.fetchData(selectedGroupTaskID, selectedTaskID);
    // this.fetchFilesData(selectedGroupTaskID, selectedTaskID);
    // this.getAllTaskByGroup(selectedGroupTaskID);
  }

  async fetchFilesData(selectedGroupTaskID, selectedTaskID) {
    this.setState({dataLoading: true});
    let filesData = await APIServices.getFilesInGroupTaskData(
      selectedGroupTaskID,
      selectedTaskID,
    );
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
      let taskResult = await APIServices.getGroupSingleTaskData(
        this.state.selectedGroupTaskID,
        parentTaskId,
      );
      if (taskResult.message == 'success') {
        this.setState({parentTaskName: taskResult.data.taskName});
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  async getSubTAskDetails() {
    this.setState({dataLoading: true});
    await APIServices.getChildTasksOfTaskGroupData(
      this.state.selectedGroupTaskID,
      this.state.selectedTaskID,
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
          if (selectedProjectTaskID !== element.parentTask.taskId) {
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
      this.setState({selectedTaskName: 'No data avilable'});
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
          console.log('User cancelled image picker');
        } else if (res.error) {
          Utils.showAlert(true, '', 'ImagePicker Error', this.props);
        } else if (res.customButton) {
          console.log('User tapped custom button');
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
          console.log('User cancelled image picker');
        } else if (res.error) {
          Utils.showAlert(true, '', 'ImagePicker Error', this.props);
        } else if (res.customButton) {
          console.log('User tapped custom button');
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
    let selectedGroupTaskID = this.state.selectedGroupTaskID;
    let selectedTaskID = this.state.selectedTaskID;

    this.onFilesCrossPress(res.uri);
    let imgName = res.fileName;
    let fileSize = res.fileSize / 1000000;

    if (typeof imgName === 'undefined' || imgName == null) {
      var getFilename = res.uri.split('/');
      imgName = getFilename[getFilename.length - 1];
    }

    if (fileSize <= 10) {
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
      this.uploadFile(this.state.files, selectedGroupTaskID, selectedTaskID);
    } else {
      Utils.showAlert(
        true,
        '',
        'File size is too large. Maximum file upload size is 10MB',
        this.props,
      );
    }
  }

  async doumentPicker() {
    let selectedGroupTaskID = this.state.selectedGroupTaskID;
    let selectedTaskID = this.state.selectedTaskID;
    let fileSize = '';
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      for (const res of results) {
        fileSize = res.size / 1000000;
        this.onFilesCrossPress(res.uri);

        if (fileSize <= 10) {
          await this.state.files.push({
            uri: res.uri,
            type: res.type, // mime type
            name: res.name,
            size: res.size,
            dateTime:
              moment().format('YYYY/MM/DD') + ' | ' + moment().format('HH:mm'),
          });
        }
      }
      if (fileSize <= 10) {
        await this.setState({
          files: this.state.files,
          indeterminate: true,
          uploading: 0,
          showMessageModal: false,
        });
        this.uploadFile(this.state.files, selectedGroupTaskID, selectedTaskID);
      } else {
        Utils.showAlert(
          true,
          '',
          'File size is too large. Maximum file upload size is 10MB',
          this.props,
        );
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('file pick error', err);
      } else {
        throw err;
      }
    }
  }

  async uploadFile(files, selectedGroupTaskID, selectedTaskID) {
    await APIServices.addFileToGroupTask(
      files,
      selectedGroupTaskID,
      selectedTaskID,
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
          this.fetchFilesData(selectedGroupTaskID, selectedTaskID);
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
    // Alert.alert(
    //   'Delete File',
    //   'You are about to permanantly delete this file,\n If you are not sure, you can cancel this action.',
    //   [
    //     {
    //       text: 'Cancel',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     {text: 'Ok', onPress: () => this.deleteFile(item)},
    //   ],
    //   {cancelable: false},
    // );
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
    let selectedGroupTaskID = this.state.selectedGroupTaskID;
    let taskID = item.taskId;
    let taskFileId = item.taskFileId;

    this.setState({dataLoading: true, showMessageModal: false});

    await APIServices.deleteFileInGroupTaskData(
      selectedGroupTaskID,
      taskID,
      taskFileId,
    )
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
          this.fetchFilesData(selectedGroupTaskID, taskID);
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

  async getAllSprintInProject(selectedGroupTaskID, sprintId) {
    this.setState({dataLoading: true});
    let sprintData = await APIServices.getAllSprintInProject(
      selectedGroupTaskID,
    );
    if (sprintData.message == 'success') {
      this.setSprintDroupDownData(sprintData.data);
      this.setSprintDroupDownSelectedValue(sprintData.data, sprintId);
      this.setState({dataLoading: false});
    } else {
      this.setState({dataLoading: false});
    }
  }

  async fetchData(selectedGroupTaskID, selectedTaskID) {
    this.setState({dataLoading: true});
    try {
      let taskResult = await APIServices.getGroupSingleTaskData(
        selectedGroupTaskID,
        selectedTaskID,
      );
      if (taskResult.message == 'success') {
        this.setTaskName(taskResult);
        this.setTaskStatus(taskResult);
        this.setTaskNote(taskResult);
        this.setDueDate(taskResult);
        this.setReminderDate(taskResult);
        this.setTaskUserName(taskResult);
        this.setSecondaryTaskId(taskResult);
        this.setIsParent(taskResult);
        this.fetchFilesData(selectedGroupTaskID, selectedTaskID);
        this.getAllTaskByGroup(selectedGroupTaskID);
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

  setTaskName(taskResult) {
    this.setState({taskName: taskResult.data.taskName});
  }

  setSecondaryTaskId(taskResult) {
    this.setState({secondaryTaskId: taskResult.data.secondaryTaskId});
  }

  setSprintId(taskResult) {
    this.setState({sprintId: taskResult.data.sprintId});
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
      case 'closed':
        statusValue = 'Closed';
        break;
    }
    this.setState({
      taskStatusValue: statusValue,
    });
  }

  async setTaskUserName(taskResult) {
    let selectedGroupTaskID = this.state.selectedGroupTaskID;
    let userID = taskResult.data.taskAssignee;
    this.setState({dataLoading: true});
    try {
      let activeUsers = await APIServices.getTaskPeopleData(
        selectedGroupTaskID,
      );
      if (activeUsers.message == 'success' && userID) {
        const result = activeUsers.data.find(
          ({assigneeId}) => assigneeId === userID,
        );
        this.setState({
          name: result.assigneeFirstName + ' ' + result.assigneeLastName,
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
    this.setState({isParent: isParent});

    if (!isParent) {
      this.setState({
        addParentTaskShow: false,
        addChildTaskShow: false,
      });
      this.gerTaskParentName(taskResult.data.parentId);
    }

    if (isParent) {
      this.getSubTAskDetails();
    }
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

    newDate = moment(date1).format('MMMM DD, YYYY');
    newDateValue = moment(date1).format('DD MM YYYY');

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

    newDate = moment(date).format('MMMM DD, YYYY');
    newDateValue = moment(date).format('DD MM YYYY');

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
        this.props.navigation.navigate('AssigneeScreenGroupTask', {
          selectedGroupTaskID: this.state.selectedGroupTaskID,
          onSelectUser: (name, id) => this.onSelectUser(name, id),
        });
        break;
      case 2:
        this.setState({showPicker: true, reminder: false});
        break;
      case 3:
        this.setState({showPicker: true, reminder: true});
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

  async changeTaskNote(note) {
    this.setState({note: note});
  }

  async onSubmitTaskNote(note) {
    this.setState({dataLoading: true, showMessageModal: false});
    let selectedGroupTaskID = this.state.selectedGroupTaskID;
    let selectedTaskID = this.state.selectedTaskID;
    await APIServices.groupTaskUpdateTaskNoteData(
      selectedGroupTaskID,
      selectedTaskID,
      note,
    )
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

  // change assignee of task API
  async changeTaskAssignee(name, userID) {
    this.setState({dataLoading: true, showMessageModal: false});
    let selectedGroupTaskID = this.state.selectedGroupTaskID;
    let selectedTaskID = this.state.selectedTaskID;
    await APIServices.groupTaskUpdateTaskAssigneeData(
      selectedGroupTaskID,
      selectedTaskID,
      userID,
    )
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
        }
      })
      .catch(error => {
        //if (error.status == 401 || error.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        //}
      });
  }

  // change status of task API
  async onChangeTaskStatus(selectedTaskStatusId, selectedTaskStatusName) {
    this.setState({dataLoading: true, showMessageModal: false});
    let selectedGroupTaskID = this.state.selectedGroupTaskID;
    let selectedTaskID = this.state.selectedTaskID;
    await APIServices.groupTaskUpdateTaskStatusData(
      selectedGroupTaskID,
      selectedTaskID,
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
        }
      })
      .catch(error => {
        //if (error.status == 401 || error.status == 403 || error.status == 400) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        //}
      });
  }

  // change name of task API DONE
  async onTaskNameChangeSubmit(text) {
    try {
      this.setState({dataLoading: true, showMessageModal: false});
      let selectedGroupTaskID = this.state.selectedGroupTaskID;
      let selectedTaskID = this.state.selectedTaskID;
      let resultData = await APIServices.groupTaskUpdateTaskNameData(
        selectedGroupTaskID,
        selectedTaskID,
        text,
      );
      if (resultData.message == 'success') {
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
    } catch (e) {
      if (e.status == 401 || e.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', e.data.message);
      }
    }
  }

  async changeTaskDueDate() {
    let duedateValue = this.state.duedateValue;
    let dueTime = this.state.dueTime;
    let selectedGroupTaskID = this.state.selectedGroupTaskID;
    let selectedTaskID = this.state.selectedTaskID;

    let IsoDueDate = duedateValue
      ? moment(duedateValue + dueTime, 'DD/MM/YYYY hh:mmA').format(
          'YYYY-MM-DD[T]HH:mm:ss',
        )
      : '';
    this.setState({dataLoading: true, showMessageModal: false});
    await APIServices.groupTaskUpdateDueDateData(
      selectedGroupTaskID,
      selectedTaskID,
      IsoDueDate,
    )
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
          this.fetchData(selectedGroupTaskID, selectedTaskID);
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
      let selectedGroupTaskID = this.state.selectedGroupTaskID;
      let selectedTaskID = this.state.selectedTaskID;

      let IsoReminderDate = remindDateValue
        ? moment(remindDateValue + reminderTime, 'DD/MM/YYYY hh:mmA').format(
            'YYYY-MM-DD[T]HH:mm:ss',
          )
        : '';
      this.setState({dataLoading: true, showMessageModal: false});
      let resultData = await APIServices.groupTaskUpdateReminderDateData(
        selectedGroupTaskID,
        selectedTaskID,
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
        this.fetchData(selectedGroupTaskID, selectedTaskID);
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
    let selectedGroupTaskID = this.state.selectedGroupTaskID;
    let selectedTaskID = this.state.selectedTaskID;

    this.onGroupSubTaskDeletePress(selectedGroupTaskID, selectedTaskID);

    // Alert.alert(
    //   'Delete Task',
    //   "You're about to permanently delete this task, its comments\n and attachments, and all of its data.\nIf you're not sure, you can close this pop up.",
    //   [
    //     {
    //       text: 'Cancel',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     {
    //       text: 'Delete',
    //       onPress: () =>
    //         this.onGroupSubTaskDeletePress(selectedGroupTaskID, selectedTaskID),
    //     },
    //   ],
    //   {cancelable: false},
    // );
  }

  onGroupSubTaskDeletePress(selectedGroupTaskID, selectedTaskID) {
    this.setState({dataLoading: true, showMessageModal: false});
    APIServices.deleteSingleInGroupTaskData(selectedGroupTaskID, selectedTaskID)
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

  onBackPress() {
    this.props.navigation.goBack();
  }

  onPressCancel() {
    if (this.state.deleteTaskSuccess) {
      this.props.navigation.goBack();
    }
    this.setState({showMessageModal: false});
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

  navigateTo(item) {
    this.setState({loadDetails: true});
    this.props.navigation.navigate('GroupSubTasksDetailsScreen', {
      taskId: item.taskId,
      id: this.state.selectedGroupTaskID,
      name: item.taskName,
    });
  }

  renderSubtasksList(item, index, userId, projectId) {
    return (
      <TouchableOpacity onPress={() => this.navigateTo(item)}>
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

  onFilterTaskStatusData = (value, index, data) => {
    const selectedTaskStatusId = data[index].id;
    let selectedTaskStatusName = data[index].value;
    this.onChangeTaskStatus(selectedTaskStatusId, selectedTaskStatusName);
  };

  onTaskDeketePress() {
    // this.deleteTask();
    let isParent = this.state.isParent;
    let descriptionTask =
      "You're about to permanently delete this group task, its comments and attachments, and all of its data.\nIf you're not sure, you can close this pop up.";
    let descriptionSubTask =
      "You're about to permanently delete this group sub task and all of its data.\nIf you're not sure, you can close this pop up.";

    this.details = {
      icon: icons.alertRed,
      type: 'confirm',
      title: isParent ? 'Delete Group Task' : 'Delete Group Sub Task',
      description: isParent ? descriptionTask : descriptionSubTask,
      buttons: {positive: 'Delete', negative: 'Cancel'},
    };
    this.onPressMessageModal = () => this.deleteTask(this);
    this.setState({showMessageModal: true});
  }

  onAddTaskPress(fromParent) {
    let selectedProjectTaskID = this.state.selectedTaskID;
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
      selectedTaskIDFromModal: selectedTaskIdModal,
    });
  };

  async getAllTaskByGroup(selectedGroupTaskID) {
    this.props.getAllTaskByGroup(selectedGroupTaskID);
  }

  async onSavePress(fromParent) {
    let selectedGroupTaskID = this.state.selectedGroupTaskID;
    let newParent = fromParent
      ? this.state.selectedTaskIDFromModal
      : this.state.selectedTaskID;

    let selectedProjectTaskID = fromParent
      ? this.state.selectedTaskID
      : this.state.selectedTaskIDFromModal;

    let parentTaskName = this.state.selectedTaskName;

    this.setState({
      dataLoading: true,
      showMessageModal: false,
      showTaskModal: false,
    });

    await APIServices.updateParentToChildInGroup(
      selectedGroupTaskID,
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
          // if (fromParent) {
          this.fetchData(selectedGroupTaskID, this.state.selectedTaskID);
          // this.fetchFilesData(selectedGroupTaskID, this.state.selectedTaskID);
          // this.getAllTaskByGroup(this.state.selectedGroupTaskID);
          this.setState({parentTaskName: parentTaskName});
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

  render() {
    let taskStatusValue = this.state.taskStatusValue;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let taskName = this.state.taskName;
    let secondaryTaskId = this.state.secondaryTaskId;
    let isParent = this.state.isParent;
    let addParentTaskShow = this.state.addParentTaskShow;
    let addChildTaskShow = this.state.addChildTaskShow;

    return (
      <View style={styles.container}>
        {this.state.loadDetails ? (
          <NavigationEvents onWillFocus={payload => this.pageOpen(payload)} />
        ) : null}
        <Header
          isDelete={true}
          navigation={this.props.navigation}
          title={taskName}
          // drawStatus={true}
          // taskStatus={taskStatus ? taskStatus : ''}
          onPress={() => this.props.navigation.goBack()}
          onPressTaskLog={() =>
            this.props.navigation.navigate('TaskLogScreen', {
              selectedProjectTaskID: this.state.selectedTaskID,
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
                  containerStyle={styles.accordionStyle}
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
                <View style={[styles.taskTypeDropDownView]}>
                  <Dropdown
                    // style={{}}
                    label=""
                    labelFontSize={0}
                    data={taskStatusData}
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
  taskModalDataPicker: {
    width: '79.5%',
    marginTop: '59rem',
    marginLeft: '32rem',
  },
  taskStatusDataPicker: {
    width: '78%',
    marginTop: '58rem',
    marginLeft: '54rem',
  },
  imageStyle: {
    width: '22rem',
    height: '22rem',
    borderRadius: 80 / 2,
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
  accordionStyle: {
    flex: 1,
    marginBottom: '20rem',
    marginTop: '0rem',
  },
});

const mapStateToProps = state => {
  return {
    deleteSingleTaskInGroupLoading: state.tasks.deleteSingleTaskInGroupLoading,
    deleteSingleTaskInGroupSuccess: state.tasks.deleteSingleTaskInGroupSuccess,
    deleteSingleTaskInGroupError: state.tasks.deleteSingleTaskInGroupError,
    deleteSingleTaskInGroupErrorMessage:
      state.tasks.deleteSingleTaskInGroupErrorMessage,
    allTaskByGroupLoading: state.tasks.allTaskByGroupLoading,
    allTaskByGroup: state.tasks.allTaskByGroup,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(GroupTasksDetailsScreen);
