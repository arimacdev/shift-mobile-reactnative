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
import * as actions from '../../../../redux/actions';
import colors from '../../../../config/colors';
import icons from '../../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../../components/Loader';
import moment from 'moment';
import FadeIn from 'react-native-fade-in-image';
import {SkypeIndicator} from 'react-native-indicators';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import APIServices from '../../../../services/APIServices';
import AwesomeAlert from 'react-native-awesome-alerts';
import Header from '../../../../components/Header';
import Accordion from 'react-native-collapsible/Accordion';
import DocumentPicker from 'react-native-document-picker';
import * as Progress from 'react-native-progress';
import RNFetchBlob from 'rn-fetch-blob';
import fileTypes from '../../../../asserts/fileTypes/fileTypes';
import * as Animatable from 'react-native-animatable';
import Modal from 'react-native-modal';
import ImagePicker from 'react-native-image-picker';
import MessageShowModal from '../../../../components/MessageShowModal';

const Placeholder = () => (
  <View style={styles.landing}>
    <SkypeIndicator color={colors.primary} />
  </View>
);

let taskData = [
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

let dropData = [
  {
    id: 'open',
    value: 'Open',
  },
  {
    id: 'closed',
    value: 'Closed',
  },
];
let MS_PER_MINUTE = 60000;
class MyTasksDetailsScreen extends Component {
  details = {
    icon: icons.alertRed,
    type: 'confirm',
    title: 'Delete My Task',
    description:
      "You're about to permanently delete this task, its comments and attachments, and all of its data.\nIf you're not sure, you can close this pop up.",
    buttons: {positive: 'Delete', negative: 'Cancel'},
  };
  onPressMessageModal = () => {};

  constructor(props) {
    super(props);
    this.state = {
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
      selectedTimeReminder: '',
      selectedTime: '',
      dateReminder: new Date(),
      timeReminder: new Date(),
      mode: 'date',
      reminder: false,
      taskName: '',
      taskStatus: '',
      dataLoading: false,
      reminderTime: '',
      dueTime: '',
      projectTaskInitiator: '',
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      note: '',
      filesData: [],
      progress: 0,
      loading: false,
      taskType: '',
      isDateNeedLoading: false,
      files: [],
      uploading: 0,
      indeterminate: false,
      selectedTaskID: '',
      taskNameEditable: false,
      taskResult: [],
      showMessageModal: false,
      deleteTaskSuccess: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.deleteSingleTaskInMyError !==
        this.props.deleteSingleTaskInMyError &&
      this.props.deleteSingleTaskInMyError &&
      this.props.deleteSingleTaskInMyErrorMessage == ''
    ) {
      this.setState({deleteTaskSuccess: false});
      this.showAlert('', 'Error');
    }

    if (
      prevProps.deleteSingleTaskInMyError !==
        this.props.deleteSingleTaskInMyError &&
      this.props.deleteSingleTaskInMyError &&
      this.props.deleteSingleTaskInMyErrorMessage != ''
    ) {
      this.setState({deleteTaskSuccess: false});
      this.showAlert('', this.props.deleteSingleTaskInMyErrorMessage);
    }

    if (
      prevProps.deleteSingleTaskInMyLoading !==
        this.props.deleteSingleTaskInMyLoading &&
      this.props.deleteSingleTaskInMyLoading
    ) {
      this.setState({showMessageModal: false});
    }

    if (
      prevProps.deleteSingleTaskInMySuccess !==
        this.props.deleteSingleTaskInMySuccess &&
      this.props.deleteSingleTaskInMySuccess
    ) {
      this.details = {
        icon: icons.taskBlue,
        type: 'success',
        title: 'Sucsess',
        description: 'Task deleted successfully',
        buttons: {},
      };
      this.setState({deleteTaskSuccess: true, showMessageModal: true});

      // Alert.alert(
      //   'Success',
      //   'Task Deleted',
      //   [{text: 'OK', onPress: () => this.props.navigation.goBack()}],
      //   {cancelable: false},
      // );
    }
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let selectedTaskID = params.taskId;
    this.setState({
      selectedTaskID: selectedTaskID,
    });

    this.fetchData(selectedTaskID);
  }

  async fetchData(selectedTaskID) {
    this.setState({dataLoading: true});
    let taskResult = await APIServices.getMySingleTaskData(selectedTaskID);
    if (taskResult.message == 'success') {
      this.setTaskName(taskResult);
      this.setTaskStatus(taskResult);
      this.setDueDate(taskResult);
      this.setReminderDate(taskResult);
      this.setTaskNote(taskResult);
      this.setFiles();
      this.setState({dataLoading: false, taskResult: taskResult});
    } else {
      this.setState({dataLoading: false});
    }
  }

  setTaskName(taskResult) {
    this.setState({taskName: taskResult.data.taskName});
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
      taskStatus: statusValue,
    });
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

  async setFiles() {
    let selectedTaskID = this.state.selectedTaskID;
    this.setState({dataLoading: true});
    let resultData = await APIServices.getFilesInMyTaskData(selectedTaskID);
    if (resultData.message == 'success') {
      this.setState({filesData: resultData.data, dataLoading: false});
    } else {
      this.setState({dataLoading: false});
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
    await this.state.files.push({
      uri: res.uri,
      type: res.type, // mime type
      name: 'Img ' + new Date().getTime(),
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

    await APIServices.addFileToMyTaskData(
      this.state.files,
      this.state.selectedTaskID,
    )
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.fileOrange,
            type: 'success',
            title: 'Sucsess',
            description: 'File have been added successfully',
            buttons: {},
          };
          this.setState({
            indeterminate: false,
            files: [],
            uploading: 100,
            showMessageModal: true,
          });
          this.setFiles();
        } else {
          this.setState({indeterminate: false, files: [], uploading: 0});
        }
      })
      .catch(error => {
        if (error.status == 401) {
          this.setState({indeterminate: false, files: [], uploading: 0});
          this.showAlert('', error.data.message);
        }
      });
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
      await this.setState({
        files: this.state.files,
        indeterminate: true,
        uploading: 0,
        showMessageModal: false,
      });

      await APIServices.addFileToMyTaskData(
        this.state.files,
        this.state.selectedTaskID,
      )
        .then(response => {
          if (response.message == 'success') {
            this.details = {
              icon: icons.fileOrange,
              type: 'success',
              title: 'Sucsess',
              description: 'File have been added successfully',
              buttons: {},
            };
            this.setState({
              indeterminate: false,
              files: [],
              uploading: 100,
              showMessageModal: true,
            });
            this.setFiles();
          } else {
            this.setState({indeterminate: false, files: [], uploading: 0});
          }
        })
        .catch(error => {
          this.setState({indeterminate: false, files: [], uploading: 0});
          if (error.status == 401) {
            this.showAlert('', error.data.message);
          } else {
            this.showAlert('', error);
          }
        });
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
    let selectedTaskID = this.state.selectedTaskID;
    let taskFileId = item.taskFileId;

    this.setState({dataLoading: true, showMessageModal: false});
    try {
      let resultObj = await APIServices.deleteFileInMyTaskData(
        selectedTaskID,
        taskFileId,
      );
      if (resultObj.message == 'success') {
        this.details = {
          icon: icons.fileOrange,
          type: 'success',
          title: 'Sucsess',
          description: 'File has been deleted successfully',
          buttons: {},
        };
        this.setState({dataLoading: false, showMessageModal: true});
        this.setFiles();
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      this.setState({dataLoading: false});
      if (e.status == 401) {
        this.showAlert('', e.data.message);
      } else {
        this.showAlert('', e);
      }
    }
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
      <View
        style={{
          width: '100%',
          height: 50,
          borderRadius: 5,
          marginRight: 5,
          marginTop: 5,
          justifyContent: 'center',
        }}>
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
    let name = item.taskFileName;

    details = size + ' | ' + date + ' by ' + name;

    return (
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
    );
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

  dateView = function(item) {
    let date = item.taskDueDateAt;
    let currentTime = moment().format();
    let dateText = '';
    let color = '';

    let taskStatus = item.taskStatus;
    if (taskStatus == 'closed') {
      // task complete
      dateText = moment.parseZone(date).format('DD/MM/YYYY');
      color = colors.colorForestGreen;
    } else {
      if (moment.parseZone(date).isAfter(currentTime)) {
        dateText = moment.parseZone(date).format('DD/MM/YYYY');
        color = colors.colorMidnightBlue;
      } else {
        dateText = moment.parseZone(date).format('DD/MM/YYYY');
        color = colors.colorBittersweet;
      }
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
        remindDate: 'Remind on ' + newDate,
        remindDateValue: newDateValue,
        dateReminder: new Date(date1),
      });
    } else {
      this.setState({
        duedate: 'Due On ' + newDate,
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

  onItemPress(item) {
    switch (item.id) {
      case 10:
        break;
      case 0:
        break;
      case 1:
        break;
      case 2:
        this.setState({showPicker: true, reminder: false});
        break;
      case 3:
        this.setState({showPicker: true, reminder: true});
        break;
      case 4:
        break;
      case 5:
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

  onBackPress() {
    this.props.navigation.goBack();
  }

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

  // change task status
  onFilterTaskStatus = (value, index, data) => {
    let selectedTaskStatusID = data[index].id;
    let selectedTaskStatusName = data[index].value;
    this.changeTaskStatus(selectedTaskStatusID, selectedTaskStatusName);
  };

  //API change task status
  async changeTaskStatus(selectedTaskStatusID, selectedTaskStatusName) {
    this.setState({dataLoading: true, showMessageModal: false});
    let selectedTaskID = this.state.selectedTaskID;
    let resultData = await APIServices.myTaskUpdateTaskStatusData(
      selectedTaskID,
      selectedTaskStatusID,
    );
    if (resultData.message == 'success') {
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
        taskStatus: selectedTaskStatusName,
      });
    } else {
      this.setState({dataLoading: false});
    }
  }

  // change name of task
  onTaskNameChange(text) {
    this.setState({taskName: text});
  }

  //API change name of task API
  async onTaskNameChangeSubmit(text) {
    this.setState({
      dataLoading: true,
      showMessageModal: false,
      taskNameEditable: false,
    });
    let selectedTaskID = this.state.selectedTaskID;
    let resultData = await APIServices.myTaskUpdateTaskNameData(
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
  }

  // change note of task
  changeTaskNote(note) {
    this.setState({note: note});
  }

  // change note of task API
  async onSubmitTaskNote(note) {
    this.setState({dataLoading: true, showMessageModal: false});
    let selectedTaskID = this.state.selectedTaskID;
    let resultData = await APIServices.myTaskUpdateTaskNoteData(
      selectedTaskID,
      note,
    );
    if (resultData.message == 'success') {
      this.details = {
        icon: icons.noteRed,
        type: 'success',
        title: 'Sucsess',
        description: 'Notes has been updated successfully',
        buttons: {},
      };
      this.setState({dataLoading: false, showMessageModal: false, note: note});
    } else {
      this.setState({dataLoading: false});
    }
  }

  // change due date of task API DONE
  async changeTaskDueDate() {
    let duedateValue = this.state.duedateValue;
    let dueTime = this.state.dueTime;
    let selectedTaskID = this.state.selectedTaskID;

    let IsoDueDate = duedateValue
      ? moment(duedateValue + dueTime, 'DD/MM/YYYY hh:mmA').format(
          'YYYY-MM-DD[T]HH:mm:ss',
        )
      : '';
    this.setState({dataLoading: true, showMessageModal: false});
    await APIServices.myTaskUpdateDueDateData(selectedTaskID, IsoDueDate)
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
          this.fetchData(selectedTaskID);
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

  // change reminder date of task API DONE
  async changeTaskReminderDate() {
    let remindDateValue = this.state.remindDateValue;
    let reminderTime = this.state.reminderTime;
    let selectedTaskID = this.state.selectedTaskID;

    let IsoReminderDate = remindDateValue
      ? moment(remindDateValue + reminderTime, 'DD/MM/YYYY hh:mmA').format(
          'YYYY-MM-DD[T]HH:mm:ss',
        )
      : '';
    this.setState({dataLoading: true, showMessageModal: false});
    await APIServices.myTaskUpdateReminderDateData(
      selectedTaskID,
      IsoReminderDate,
    )
      .then(response => {
        if (response.message == 'success') {
          this.details = {
            icon: icons.clockOrange,
            type: 'success',
            title: 'Sucsess',
            description: 'Remind date has been updated successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
          this.fetchData(selectedTaskID);
        } else {
          this.setState({dataLoading: false});
          this.setReminderDate(this.state.taskResult);
        }
      })
      .catch(error => {
        //if (error.status == 401 || error.status == 403) {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
        this.setReminderDate(this.state.taskResult);
        //}
      });
  }

  deleteMyTask() {
    let taskID = this.state.selectedTaskID;
    this.props.deleteTaskInMyTasks(taskID);
  }

  onTaskDeketePress() {
    this.details = {
      icon: icons.alertRed,
      type: 'confirm',
      title: 'Delete My Task',
      description:
        "You're about to permanently delete this task, its comments and attachments, and all of its data.\nIf you're not sure, you can close this pop up.",
      buttons: {positive: 'Delete', negative: 'Cancel'},
    };
    this.onPressMessageModal = () => this.deleteMyTask(this);
    this.setState({showMessageModal: true});

    // Alert.alert(
    //   'Delete Task',
    //   "You're about to permanently delete this task, its comments\n and attachments, and all of its data.\nIf you're not sure, you can close this pop up.",
    //   [
    //     {
    //       text: 'Cancel',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //     {text: 'Delete', onPress: () => this.props.deleteTaskInMyTasks(taskID)},
    //   ],
    //   {cancelable: false},
    // );
  }

  onPressCancel() {
    if (this.state.deleteTaskSuccess) {
      this.props.navigation.goBack();
    }
    this.setState({showMessageModal: false});
  }

  async onTaskNameEditPress() {
    await this.setState({taskNameEditable: true});
    this.taskNameTextInput.focus();
  }

  render() {
    let taskStatus = this.state.taskStatus;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let taskName = this.state.taskName;

    return (
      <View style={styles.container}>
        <Header
          isDelete={true}
          navigation={this.props.navigation}
          title={'My personal tasks'}
          onPress={() => this.props.navigation.goBack()}
          onPressDelete={() => this.onTaskDeketePress()}
        />
        <ScrollView style={styles.container}>
          <View>
            <View style={styles.headerView}>
              <View style={styles.projectFilerView}>
                <Text style={styles.statusText}>{taskStatus}</Text>
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
                editable={this.state.taskNameEditable}
                value={this.state.taskName}
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
            <View style={styles.taskTypeMainView}>
              <View style={styles.taskTypeNameView}>
                <Image
                  style={styles.iconStyle}
                  source={icons.taskRoundedBlue}
                  resizeMode="contain"
                />
                <Text style={styles.parentTaskText}>Task Status</Text>
              </View>
              <View style={styles.taskTypeDropMainView}>
                <View style={[styles.taskTypeDropDownView]}>
                  <Dropdown
                    // style={{}}
                    label=""
                    labelFontSize={0}
                    data={dropData}
                    textColor={colors.black}
                    fontSize={14}
                    renderAccessory={() => null}
                    error={''}
                    animationDuration={0.5}
                    containerStyle={{width: '100%'}}
                    overlayStyle={{width: '100%'}}
                    pickerStyle={styles.myTasksStatusPicker}
                    dropdownPosition={0}
                    value={taskStatus}
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
                    onChangeText={this.onFilterTaskStatus}
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
              onPress={() =>
                Platform.OS == 'ios'
                  ? this.iOSFilePicker()
                  : this.doumentPicker()
              }
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
            />
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
            overlayStyle={{backgroundColor: colors.alertOverlayColor}}
            contentContainerStyle={styles.alertContainerStyle}
            confirmButtonStyle={styles.alertConfirmButtonStyle}
          />
        </ScrollView>
        <MessageShowModal
          showMessageModal={this.state.showMessageModal}
          details={this.details}
          onPress={this.onPressMessageModal}
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
  projectFilerView: {
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '30rem',
    width: '100rem',
  },
  projectView: {
    borderRadius: 5,
    marginTop: '20rem',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '11rem',
    color: colors.projectTaskNameColor,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    fontWeight: '400',
  },
  textDate: {
    fontFamily: 'CircularStd-Book',
    fontSize: '9rem',
    fontWeight: '400',
    textAlign: 'center',
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
  completionIcon: {
    width: '23rem',
    height: '23rem',
    marginHorizontal: '5rem',
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
  parentTaskText: {
    flex: 1,
    fontSize: '10rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.projectTaskNameColor,
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
    marginTop: '0rem',
    marginBottom: '20rem',
  },
  taskStateIcon: {
    width: '38rem',
    height: '38rem',
  },
  statusText: {
    color: colors.white,
  },
  updateNotesView: {
    backgroundColor: colors.lightBlue,
    height: 30,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 20,
    top: Platform.OS === 'ios' ? '10rem' : '0rem',
  },
  updateNotesText: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  taskFieldDocPickView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
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
    borderRadius: 5,
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
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '7rem',
  },
  uploadingText: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 11,
    color: colors.darkBlue,
    fontWeight: 'bold',
  },
  myTasksStatusPicker: {
    width: '78%',
    marginTop: '58rem',
    marginLeft: '54rem',
  },
  iconEdit: {
    width: '20rem',
    height: '20rem',
    marginRight: '20rem',
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
});

const mapStateToProps = state => {
  return {
    deleteSingleTaskInMyLoading: state.tasks.deleteSingleTaskInMyLoading,
    deleteSingleTaskInMySuccess: state.tasks.deleteSingleTaskInMySuccess,
    deleteSingleTaskInMyError: state.tasks.deleteSingleTaskInMyError,
    deleteSingleTaskInMyErrorMessage:
      state.tasks.deleteSingleTaskInMyErrorMessage,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(MyTasksDetailsScreen);
