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
  Alert
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
import Loader from '../../../components/Loader';
import moment from 'moment';
import FadeIn from 'react-native-fade-in-image';
import {SkypeIndicator} from 'react-native-indicators';
import DateTimePicker from '@react-native-community/datetimepicker';
import APIServices from '../../../services/APIServices';
import AwesomeAlert from 'react-native-awesome-alerts';
import Header from '../../../components/Header';

const Placeholder = () => (
  <View style={styles.landing}>
    <SkypeIndicator color={colors.primary} />
  </View>
);

let dropData = [
  {
    id: 'Open',
    value: 'Open',
  },
  {
    id: 'Closed',
    value: 'Closed',
  },
];

let taskData = [
  {
    id: 10,
    name: 'Task Name',
    icon: icons.taskDark,
    renderImage: false,
  },
  {
    id: 0,
    name: 'Name',
    icon: icons.taskUser,
    renderImage: false,
  },
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

class GroupTasksDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomItemPressColor: colors.darkBlue,
      selectedTaskGroupId: '',
      selectedTaskID : '',
      isActive: this.props.isActive,
      name: '',
      duedate: '',
      duedateValue: '',
      remindDate: '',
      remindDateValue: '',
      showPicker: false,
      showTimePicker: false,
      date: new Date(),
      selectedDateReminder: '',
      selectedTimeReminder: '',
      dateReminder: new Date(),
      timeReminder: new Date(),
      mode: 'date',
      reminder: false,
      taskName: '',
      taskStatus : 'Pending',
      dataLoading : false,
      reminderTime : '',
      dueTime : '',
      projectTaskInitiator: '',
      showAlert : false,
      alertTitle : '',
      alertMsg : '',
      note : '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  componentDidMount() {
    const {navigation: {state: {params}}} = this.props;
    let selectedTaskGroupId = params.selectedTaskGroupId;
    let selectedTaskID = params.taskDetails.taskId;
    this.setState({
        selectedTaskGroupId: selectedTaskGroupId,
        selectedTaskID : selectedTaskID,
    });

    this.fetchData(selectedTaskGroupId,selectedTaskID);
  }

  async fetchData(selectedTaskGroupId,selectedTaskID) {
    this.setState({dataLoading:true});
    taskResult = await APIServices.getGroupTaskData(selectedTaskGroupId,selectedTaskID);
    if(taskResult.message == 'success'){
        this.setTaskInitiator(taskResult);
        this.setTaskName(taskResult);
        this.setTaskStatus(taskResult);
        this.setTaskUserName(taskResult);
        this.setDueDate(taskResult);
        this.setReminderDate(taskResult);
        this.setTaskNote(taskResult);
        this.setState({dataLoading:false}); 
    }else{
        this.setState({dataLoading:false});
    }
  }

  setTaskInitiator (taskResult){
    this.setState({projectTaskInitiator : taskResult.data.taskInitiator});
  }

  setTaskName (taskResult){
    this.setState({taskName : taskResult.data.taskName});
  }

  hideAlert (){
    this.setState({
      showAlert : false,
      alertTitle : '',
      alertMsg : '',
    })
}

showAlert(title,msg){
    this.setState({
      showAlert : true,
      alertTitle : title,
      alertMsg : msg,
    })
}

  setTaskStatus (taskResult){
    let statusValue = '';
    switch (taskResult.data.taskStatus) {
        case 'open':
              statusValue = 'Open'
              break;
        case 'closed':
              statusValue = 'Closed'
              break;
      }
      this.setState({
        taskStatus : statusValue
      })
  }

  async setTaskUserName (taskResult){
    let selectedTaskGroupId = this.state.selectedTaskGroupId;
    let userID = taskResult.data.taskAssignee;
    let activeUsers = await APIServices.getAllUsersByProjectId(selectedTaskGroupId);
    if (activeUsers.message == 'success' && userID) {
      const result = activeUsers.data.find( ({ userId }) => userId === userID );
      this.setState({
        name: result.firstName + ' '  + result.lastName,
        //activeUsers : activeUsers.data,
      });
    }
  }

  setDueDate(taskResult){
    let taskDueDate = moment.parseZone(taskResult.data.taskDueDateAt).format('Do MMMM YYYY');
    if(taskDueDate != 'Invalid date'){
      this.setState({
        duedate : 'Due on ' + taskDueDate
      })
    }
  }

  setReminderDate (taskResult){
    let taskReminderDate = moment.parseZone(taskResult.data.taskReminderAt).format('Do MMMM YYYY');
    if(taskReminderDate != 'Invalid date'){
      this.setState({
        remindDate : 'Remind on ' + taskReminderDate,
      })
    }
  }

  setTaskNote (taskResult){
    this.setState({note : taskResult.data.taskNote});
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
      newDate = moment(date).format('Do MMMM YYYY');
      newDateValue = moment(date).format('DD MM YYYY');
    } else {
      newDate = moment(date).format('Do MMMM YYYY');
      newDateValue = moment(date).format('DD MM YYYY');
    }

    if (event.type == 'set') {
      if (this.state.reminder) {
        this.setState({
          remindDate: 'Remind on ' + newDate,
          remindDateValue : newDateValue,
          showPicker: false,
          showTimePicker: true,
          dateReminder: new Date(selectedDate),
        });
      } else {
        this.setState({
          duedate: 'Due On ' + newDate,
          duedateValue : newDateValue,
          showPicker: false,
          showTimePicker: true,
          date: new Date(selectedDate),
        });
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
          reminderTime : newTime,
          selectedTimeReminder: newTime,
          showPicker: false,
          showTimePicker: false,
          timeReminder: new Date(selectedTime),
        });
        this.changeTaskReminderDate();
      }else {
        // due time
        this.setState({
          dueTime : newTime,
          selectedTimeReminder: newTime,
          showPicker: false,
          showTimePicker: false,
          timeReminder: new Date(selectedTime),
        });
        this.changeTaskDueDate();
      }
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
        value={this.state.timeReminder}
        mode={'time'}
        is24Hour={true}
        display="default"
        onChange={(event, selectedTime) =>
          this.onChangeTime(event, selectedTime)
        }
      />
    );
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
        return (
          <TouchableOpacity >
          </TouchableOpacity>
        );
      }
    }
  };

  onSelectUser(name,userID) {
    this.changeTaskAssignee(name,userID);
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
            selectedTaskGroupId: this.state.selectedTaskGroupId,
          onSelectUser: (name,id) => this.onSelectUser(name,id),
        });
        break;
      case 1:
        this.props.navigation.navigate('SubTaskScreen', {
          selectedTaskGroupId: this.state.selectedTaskGroupId,
          selectedTaskID: this.state.selectedTaskID,
        });
        break;
      case 2:
        this.setState({showPicker: true, reminder: false});
        break;
      case 3:
        this.setState({showPicker: true, reminder: true});
        break;
      case 4:
        this.props.navigation.navigate('NotesScreen',{
          note: this.state.note,
          onUpdateNote: (note) => this.onUpdateNote(note),
        });
        break;
      case 5:
        this.props.navigation.navigate('FilesScreen', {
          selectedTaskGroupId: this.state.selectedTaskGroupId,
          selectedTaskID: this.state.selectedTaskID,
        });
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
        value = this.state.duedate;
        break;
      case 3:
        value = this.state.remindDate;
        break;
      default:
        break;
    }

    return (
      <View style={{flex: 1}}>
        {item.id == 10 ? (
          <TextInput
            style={[
              styles.text,
              {
                flex: 1,
                marginLeft: 5,
                color:
                  value !== '' ? colors.darkBlue : colors.darkBlue,
              },
            ]}
            placeholder={item.name}
            value={this.state.taskName}
            onChangeText={text => this.onTaskNameChange(text)}
            onSubmitEditing={() => this.onTaskNameChangeSubmit(this.state.taskName)}
          />
        ) : (
          <Text
            style={[
              styles.text,
              {
                color:
                  value !== '' ? colors.darkBlue : colors.projectTaskNameColor,
              },
            ]}>
            {value !== '' ? value : item.name}
          </Text>
        )}
      </View>
    );
  }

  renderProjectList(item) {
    return (
      <TouchableOpacity onPress={() => this.onItemPress(item)}>
        <View style={styles.projectView}>
          <Image
            style={styles.completionIcon}
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
        <Image style={styles.dropIcon} source={icons.arrow} />
      </View>
    );
  }

  onFilterTasksStatus(key) {
    let value = key;
    let searchValue = '';
    switch (value) {
      case 'Open':
        searchValue = 'open';
        break;
      case 'Closed':
        searchValue = 'closed';
        break;
    }
    
    this.changeTaskStatus(key,searchValue);
  }

  
  // change note of task API
  async changeTaskNote(note){
    this.setState({dataLoading:true});
    let selectedTaskGroupId = this.state.selectedTaskGroupId;
    let selectedTaskID = this.state.selectedTaskID;
    resultData = await APIServices.updateTaskNoteData(selectedTaskGroupId,selectedTaskID,note);
    if(resultData.message == 'success'){
      this.setState({dataLoading:false,note: note});
    }else{
      this.setState({dataLoading:false});
    }
}

  // change assignee of task API
  async changeTaskAssignee(name,userID){
      this.setState({dataLoading:true});
      let selectedTaskGroupId = this.state.selectedTaskGroupId;
      let selectedTaskID = this.state.selectedTaskID;
      resultData = await APIServices.updateTaskAssigneeData(selectedTaskGroupId,selectedTaskID,userID);
      if(resultData.message == 'success'){
        this.setState({dataLoading:false,name: name});
      }else{
        this.setState({dataLoading:false});
      }
  }

  // change status of task API
  async changeTaskStatus(key,searchValue){
      this.setState({dataLoading:true});
      let selectedTaskGroupId = this.state.selectedTaskGroupId;
      let selectedTaskID = this.state.selectedTaskID;
      resultData = await APIServices.updateTaskStatusData(selectedTaskGroupId,selectedTaskID,searchValue);
      if(resultData.message == 'success'){
        this.setState({dataLoading:false,taskStatus : key});
      }else{
        this.setState({dataLoading:false});
      }
  }

  // change name of task API
  async onTaskNameChangeSubmit(text){
    this.setState({dataLoading:true});
    let selectedTaskGroupId = this.state.selectedTaskGroupId;
    let selectedTaskID = this.state.selectedTaskID;
    resultData = await APIServices.updateTaskNameData(selectedTaskGroupId,selectedTaskID,text);
    if(resultData.message == 'success'){
      this.setState({dataLoading:false});
    }else{
      this.setState({dataLoading:false});
    }
  }

  async changeTaskDueDate(){
      let duedateValue = this.state.duedateValue;
      let dueTime = this.state.dueTime;
      let selectedTaskGroupId = this.state.selectedTaskGroupId;
      let selectedTaskID = this.state.selectedTaskID;

      let IsoDueDate = duedateValue ?
      moment(duedateValue + dueTime,'DD/MM/YYYY hh:mmA').format('YYYY-MM-DD[T]HH:mm:ss') : '';

      resultData = await APIServices.updateTaskDueDateData(selectedTaskGroupId,selectedTaskID,IsoDueDate);
      if(resultData.message == 'success'){
        this.setState({dataLoading:false});
      }else{
        this.setState({dataLoading:false});
      }
  };

  async changeTaskReminderDate(){
      let remindDateValue = this.state.remindDateValue;
      let reminderTime = this.state.reminderTime;
      let selectedTaskGroupId = this.state.selectedTaskGroupId;
      let selectedTaskID = this.state.selectedTaskID;

      let IsoReminderDate = remindDateValue ?
      moment(remindDateValue + reminderTime,'DD/MM/YYYY hh:mmA').format('YYYY-MM-DD[T]HH:mm:ss') : '';

      resultData = await APIServices.updateTaskReminderDateData(selectedTaskGroupId,selectedTaskID,IsoReminderDate);
      if(resultData.message == 'success'){
        this.setState({dataLoading:false});
      }else{
        this.setState({dataLoading:false});
      }
  };

  deleteTask() {
    // let selectedTaskGroupId = this.state.selectedTaskGroupId;
    // let taskID = this.state.selectedTaskID;
    // let tskInitiator = this.state.projectTaskInitiator;
    // let taskName = this.state.taskName;

    // Alert.alert(
    //   "Delete Task",
    //   "You're about to permanently delete this task, its comments\n and attachments, and all of its data.\nIf you're not sure, you can close this pop up.",
    //   [
    //     {
    //       text: "Cancel",
    //       onPress: () => console.log("Cancel Pressed"),
    //       style: "cancel"
    //     },
    //     { text: "Delete", onPress: () => this.props.deleteTask(projectID, taskID, taskName, tskInitiator) }
    //   ],
    //   { cancelable: false }
    // );
  }

  onBackPress() {
    this.props.navigation.goBack();
  }

  render() {
    let taskStatus = this.state.taskStatus;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let taskName = this.state.taskName;

    return (
      <View style={styles.backgroundImage}>
        <Header
            title={taskName ? taskName : ''}
            drawStatus = {true}
            taskStatus={taskStatus ? taskStatus : ''}
            onPress={() => this.onBackPress()}
        />
        <ScrollView style={styles.backgroundImage}>
            <View>
              <View style={styles.projectFilerView}>
              <Dropdown
                    // style={{}}
                    label=""
                    labelFontSize={0}
                    data={dropData}
                    textColor={colors.white}
                    error={''}
                    animationDuration={0.5}
                    containerStyle={{width: '100%'}}
                    overlayStyle={{width: '100%'}}
                    pickerStyle={{width: '89%', marginTop: 70, marginLeft: 15}}
                    dropdownPosition={0}
                    value={taskStatus}
                    itemColor={'black'}
                    selectedItemColor={'black'}
                    dropdownOffset={{top: 10}}
                    baseColor={colors.lightBlue}
                    renderAccessory={this.renderBase}
                    itemTextStyle={{
                      marginLeft: 15,
                      fontFamily: 'CircularStd-Book',
                    }}
                    itemPadding={10}
                    onChangeText={value => this.onFilterTasksStatus(value)}
                  />
              </View>
              <FlatList
                data={taskData}
                renderItem={({item}) => this.renderProjectList(item)}
                keyExtractor={item => item.taskId}
              />
              <TouchableOpacity onPress={() => this.deleteTask()}>
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
              </TouchableOpacity>
              {this.state.showPicker ? this.renderDatePicker() : null}
              {this.state.showTimePicker ? this.renderTimePicker() : null}
            </View>
        {dataLoading && <Loader/>}
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
    fontSize: '11rem',
    color: colors.projectTaskNameColor,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
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
    fontFamily: 'HelveticaNeuel',
    fontWeight: 'bold',
  },
  deleteIcon: {
    width: '28rem',
    height: '28rem',
  },
});

const mapStateToProps = state => {
  return {
  };
};
export default connect(
  mapStateToProps,
  actions,
)(GroupTasksDetailsScreen);
