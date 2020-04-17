import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import APIServices from '../../../services/APIServices';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-community/async-storage';
EStyleSheet.build({ $rem: entireScreenWidth / 380 });
import { Dropdown } from 'react-native-material-dropdown';
import AwesomeAlert from 'react-native-awesome-alerts';
import _ from 'lodash';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import moment from 'moment';

let dropData = [
  {
    value: 'Open',
  },
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
    value: 'Reopen',
  },
  {
    value: 'Deployed',
  },
  {
    value: 'Close',
  },
];
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
      selectedAssignee: 'Assignee',
      selectedStatus: 'Status',
      initiator: null,
      assigneeId: '',
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      reminderTime: '',
      selectedDateValue: '',
      selectedDateReminderValue: ''
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.addTaskToProjectError !== this.props.addTaskToProjectError
      && this.props.addTaskToProjectError && this.props.addTaskToProjectErrorMessage == '') {
      this.showAlert("", "Error While creating Task");
    }

    if (prevProps.addTaskToProjectError !== this.props.addTaskToProjectError
      && this.props.addTaskToProjectError && this.props.addTaskToProjectErrorMessage != '') {
      this.showAlert("", this.props.addTaskToProjectErrorMessage);
    }

    if (prevProps.addTaskToProjectSuccess !== this.props.addTaskToProjectSuccess
      && this.props.addTaskToProjectSuccess) {
      const taskID = this.props.taskId.data.taskId;

      Alert.alert(
        "Success",
        "Task Added",
        [
          { text: "OK", onPress: () => this.props.navigation.goBack() }
        ],
        { cancelable: false }
      );
      //this.uploadFiles(this.state.files, taskID)
      // this.uploadFiles(this.state.files, 'b6ba3dcf-4494-4bb5-80dc-17376c628187')
    }
  }

  async componentDidMount() {
    const { navigation: { state: { params } } } = this.props;
    const activeUsers = await APIServices.getAllUsersByProjectId(this.props.selectedProjectID);
    if (activeUsers.message == 'success') {
      let userList = [];
      for (let i = 0; i < activeUsers.data.length; i++) {
        if (activeUsers.data[i].firstName && activeUsers.data[i].lastName) {
          userList.push({
            id: activeUsers.data[i].userId,
            value: activeUsers.data[i].firstName + ' ' + activeUsers.data[i].lastName,
          });
        }
      }
      this.setState({
        dropPeopleData: userList,
        // dataLoading : false
      })
    } else {
      this.setState({ dataLoading: false });
    }
  }

  onTaskNameChange(text) {
    this.setState({ taskName: text });
  }

  renderBase() {
    return (
      <View style={{ justifyContent: 'center', flex: 1 }}>
        <Image style={styles.dropIcon} source={icons.arrowDark} />
      </View>
    );
  }

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

  renderTimePicker() {
    return (
      <DateTimePicker
        testID="dateTimePicker"
        timeZoneOffsetInMinutes={0}
        value={this.state.reminder == true
          ? this.state.timeReminder : this.state.time}
        mode={'time'}
        is24Hour={true}
        display="default"
        onChange={(event, selectedTime) =>
          this.onChangeTime(event, selectedTime)
        }
      />
    );
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
        this.setState({ files: filesArray });
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
        <View style={{ justifyContent: 'center', marginLeft: 10 }}>
          <Image
            style={styles.gallaryIcon}
            source={icons.gallary}
            resizeMode={'center'}
          />
        </View>

        <View
          style={{
            flexDirection: 'column',
            marginLeft: 10,
            justifyContent: 'center',
            flex: 1,
          }}>
          <Text style={{ marginTop: -2 }}>
            {item.name.substring(0, 5)}...{item.name.substr(-7)}
          </Text>
          <Text style={{ fontSize: 10, marginTop: -2, color: colors.lightgray }}>
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
              resizeMode={'center'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  async doumentPicker() {
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
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
      this.setState({ files: this.state.files });
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
    this.setState({ notes: text });
  }

  selectAssignee = (value) => {
    this.setState({ selectedAssignee: value })
    for (let i = 0; i < this.state.dropPeopleData.length; i++) {
      if (value == this.state.dropPeopleData[i].value) {
        this.setState({ assigneeId: this.state.dropPeopleData[i].id })
      }
    }
  }

  selectStatus = (value) => {
    this.setState({ selectedStatus: value })
  }

  async addNewTask() {
    await AsyncStorage.getItem('userID').then(userID => {
      if (userID) {
        this.setState({ initiator: userID })
      }
    });
    let taskName = this.state.taskName;
    let initiator = this.state.initiator;
    let assigneeId = this.state.assigneeId;
    let selectedStatus = this.state.selectedStatus;
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
        case 'Re-Opened':
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

    let IsoDueDate = dueDate ?
      moment(dueDate + dueTime, 'DD/MM/YYYY hh:mmA').format('YYYY-MM-DD[T]HH:mm:ss') : '';
    let IsoReminderDate = selectedDateReminder ?
      moment(selectedDateReminder + selectedTimeReminder, 'DD/MM/YYYY hh:mmA').format('YYYY-MM-DD[T]HH:mm:ss') : '';
    if (this.validateData(taskName, assigneeId)) {
      this.props.addTaskToProject(taskName, initiator, assigneeId, selectedStatusEnum, IsoDueDate, IsoReminderDate, notes, this.props.selectedProjectID);
    }
  }

  uploadFiles(file, taskId) {
    console.log(file, taskId, 'fileeeeeeeeeeee')
    this.props.addFileToTask(file, taskId, this.props.selectedProjectID);
  }

  validateData(taskName, assigneeId) {
    if (!taskName && _.isEmpty(taskName)) {
      this.showAlert("", "Please enter a name for the task");
      return false;
    }
    // if (!assigneeId && _.isEmpty(assigneeId)) {
    //   this.showAlert("", "Please select a assignee");
    //   return false;
    // }
    return true;
  }

  hideAlert() {
    this.setState({
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
    })
  }

  showAlert(title, msg) {
    this.setState({
      showAlert: true,
      alertTitle: title,
      alertMsg: msg,
    })
  }

  render() {
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    return (
      <ScrollView style={{ marginBottom: 90 }}>
        <View style={[styles.taskFieldView, { marginTop: 30 }]}>
          <TextInput
            style={[styles.textInput, { width: '95%' }]}
            placeholder={'Task name'}
            value={this.state.taskName}
            onChangeText={text => this.onTaskNameChange(text)}
          />
        </View>
        <View style={styles.taskFieldView}>
          <Dropdown
            style={{ paddingLeft: 5 }}
            label=""
            labelFontSize={0}
            fontSize={13}
            data={this.state.dropPeopleData}
            textColor={colors.gray}
            error={''}
            animationDuration={0.5}
            containerStyle={{ width: '100%' }}
            overlayStyle={{ width: '100%' }}
            pickerStyle={{ width: '89%', marginTop: 70, marginLeft: 15 }}
            dropdownPosition={0}
            value={this.state.selectedAssignee}
            itemColor={'black'}
            selectedItemColor={'black'}
            onChangeText={(value) => this.selectAssignee(value)}
            // onChangeText={(value)=>{this.selectAssignee(item.name, value)}}
            dropdownOffset={{ top: 10 }}
            baseColor={colors.projectBgColor}
            // renderBase={this.renderBase}
            renderAccessory={this.renderBase}
            itemTextStyle={{ marginLeft: 15 }}
            itemPadding={10}
          />
        </View>
        <View style={styles.taskFieldView}>
          <Dropdown
            style={{ paddingLeft: 5 }}
            label=""
            labelFontSize={0}
            fontSize={13}
            data={dropData}
            textColor={colors.gray}
            error={''}
            animationDuration={0.5}
            containerStyle={{ width: '100%' }}
            overlayStyle={{ width: '100%' }}
            pickerStyle={{ width: '89%', marginTop: 70, marginLeft: 15 }}
            dropdownPosition={0}
            value={this.state.selectedStatus}
            itemColor={'black'}
            selectedItemColor={'black'}
            dropdownOffset={{ top: 10 }}
            baseColor={colors.projectBgColor}
            onChangeText={value => this.selectStatus(value)}
            // renderBase={this.renderBase}
            renderAccessory={this.renderBase}
            itemTextStyle={{ marginLeft: 15 }}
            itemPadding={10}
          />
        </View>
        <TouchableOpacity
          onPress={() =>
            this.setState({ showPicker: true, reminder: false, mode: 'date' })
          }>
          <View style={[styles.taskFieldView, { flexDirection: 'row' }]}>
            <Text style={[styles.textInput, { flex: 1 }]}>
              {this.state.selectedDate == ''
                ? 'Due Date'
                : this.state.selectedTime + " " + this.state.selectedDate}
            </Text>
            <Image
              style={styles.calendarIcon}
              source={icons.calendar}
              resizeMode={'center'}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            this.setState({ showPicker: true, reminder: true, mode: 'date' })
          }>
          <View style={[styles.taskFieldView, { flexDirection: 'row' }]}>
            <Text style={[styles.textInput, { flex: 1 }]}>
              {this.state.selectedDateReminder == ''
                ? 'Reminder'
                : this.state.selectedTimeReminder +
                ' ' +
                this.state.selectedDateReminder}
            </Text>
            <Image
              style={styles.calendarIcon}
              source={icons.calendar}
              resizeMode={'center'}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.doumentPicker()}>
          {this.state.files.length > 0 ? (
            <View
              style={[
                styles.taskFieldDocPickView,
                { flexDirection: 'row', flexWrap: 'wrap' },
              ]}>
              {this.state.files.map(item => {
                return this.renderDocPickeredView(item);
              })}
            </View>
          ) : (
              <View style={[styles.taskFieldView, { flexDirection: 'row' }]}>
                <Image
                  style={[styles.calendarIcon, { marginRight: 10 }]}
                  source={icons.upload}
                  resizeMode={'center'}
                />
                <Text style={[styles.textInput, { flex: 1 }]}>Add files</Text>
              </View>
            )}
        </TouchableOpacity>
        <View style={[styles.taskFieldView, { height: 160 }]}>
          <TextInput
            style={[
              styles.textInput,
              { width: '95%', textAlignVertical: 'top', height: 150 },
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
              style={[styles.bottomBarIcon, { marginRight: 15, marginLeft: 10 }]}
              source={icons.taskWhite}
              resizeMode={'center'}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.buttonText}>Add new Task</Text>
            </View>

            <Image
              style={[styles.addIcon, { marginRight: 10 }]}
              source={icons.add}
              resizeMode={'center'}
            />
          </View>
        </TouchableOpacity>
        {this.state.showPicker ? this.renderDatePicker() : null}
        {this.state.showTimePicker ? this.renderTimePicker() : null}
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
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
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
  textFilter: {
    fontSize: '14rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'center',
    // fontWeight: 'bold',
  },
  projectView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
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
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  textDate: {
    fontSize: '9rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  avatarIcon: {
    width: '20rem',
    height: '20rem',
    marginLeft: 10,
  },
  statusView: {
    // backgroundColor: colors.gray,
    // width:'5rem',
    // height:'60rem',
    alignItems: 'center',
    flexDirection: 'row',
    // borderTopRightRadius: 5,
    // borderBottomRightRadius: 5,
  },
  dropIcon: {
    width: '13rem',
    height: '13rem',
  },
  completionIcon: {
    width: '40rem',
    height: '40rem',
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
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
    // width: '95%'
  },
  calendarIcon: {
    width: '23rem',
    height: '23rem',
  },
  taskFieldDocPickView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
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
    borderRadius: 5,
    marginTop: '17rem',
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
    fontFamily: 'HelveticaNeuel',
    fontWeight: 'bold',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
  },
});

const mapStateToProps = state => {
  return {
    addTaskToProjectLoading: state.project.addTaskToProjectLoading,
    addTaskToProjectError: state.project.addTaskToProjectError,
    addTaskToProjectSuccess: state.project.addTaskToProjectSuccess,
    addTaskToProjectErrorMessage: state.project.addTaskToProjectErrorMessage,
    taskId: state.project.taskId,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(AddNewTasksScreen);
