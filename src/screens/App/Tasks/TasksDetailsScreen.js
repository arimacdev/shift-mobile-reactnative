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
import APIServices from '../../../services/APIServices';

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

class TasksDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomItemPressColor: colors.darkBlue,
      selectedProjectID: '',
      selectedProjectTaskID : '',
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
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  componentDidMount() {
    const {navigation: {state: {params}}} = this.props;
    let selectedProjectID = params.selectedProjectID;
    let selectedProjectTaskID = params.taskDetails.taskId;
    this.setState({
      selectedProjectID: selectedProjectID,
      selectedProjectTaskID : selectedProjectTaskID,
    });

    this.fetchData(selectedProjectID,selectedProjectTaskID);
  }

  async fetchData(selectedProjectID,selectedProjectTaskID) {
    this.setState({dataLoading:true});
    taskResult = await APIServices.getProjecTaskData(selectedProjectID,selectedProjectTaskID);
    if(taskResult.message == 'success'){
        this.setTaskName(taskResult);
        this.setTaskStatus(taskResult);
        this.setDueDate(taskResult);
        this.setReminderDate(taskResult);
        this.setState({dataLoading:false}); 
    }else{
        this.setState({dataLoading:false});
    }
  }

  setTaskName (taskResult){
    this.setState({taskName : taskResult.data.taskName});
  }

  setTaskStatus (taskResult){
    let statusValue = '';
    switch (taskResult.data.taskStatus) {
        case 'pending':
              statusValue = 'Pending'
              break;
        case 'implementing':
              statusValue = 'Implementing'
              break;
        case 'qa':
              statusValue = 'QA'
              break;
        case 'readyToDeploy':
              statusValue = 'Ready to Deploy'
              break;      
        case 'reOpened':  
              statusValue = 'Re-Opened'
              break;
        case 'deployed':
              statusValue = 'Deployed'
              break;
        case 'closed':
              statusValue = 'Closed'
              break;
      }
      this.setState({
        taskStatus : statusValue
      })
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
          remindDate: 'Due on ' + newDate,
          remindDateValue : newDateValue,
          showPicker: false,
          showTimePicker: true,
          dateReminder: new Date(selectedDate),
        });
      } else {
        this.setState({
          duedate: 'Remind On ' + newDate,
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

  onSelectUser(name) {
    this.setState({name: name});
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
          userName: '',
          onSelectUser: name => this.onSelectUser(name),
        });
        break;
      case 1:
        this.props.navigation.navigate('SubTaskScreen');
        break;
      case 2:
        this.setState({showPicker: true, reminder: false});
        break;
      case 3:
        this.setState({showPicker: true, reminder: true});
        break;
      case 4:
        this.props.navigation.navigate('NotesScreen');
        break;
      case 5:
        this.props.navigation.navigate('FilesScreen');
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
    
    this.changeTaskStatus(key,searchValue);
  }

  // change status of task API
  async changeTaskStatus(key,searchValue){
      this.setState({dataLoading:true});
      let projectID = this.state.selectedProjectID;
      let taskID = this.state.selectedProjectTaskID;
      resultData = await APIServices.updateTaskStatusData(projectID,taskID,searchValue);
      if(resultData.message == 'success'){
        this.setState({dataLoading:false,taskStatus : key});
      }else{
        this.setState({dataLoading:false});
      }
  }

  // change name of task API
  async onTaskNameChangeSubmit(text){
    this.setState({dataLoading:true});
    let projectID = this.state.selectedProjectID;
    let taskID = this.state.selectedProjectTaskID;
    resultData = await APIServices.updateTaskNameData(projectID,taskID,text);
    if(resultData.message == 'success'){
      this.setState({dataLoading:false});
    }else{
      this.setState({dataLoading:false});
    }
  }

  async changeTaskDueDate(){
      let duedateValue = this.state.duedateValue;
      let dueTime = this.state.dueTime;
      let projectID = this.state.selectedProjectID;
      let taskID = this.state.selectedProjectTaskID;

      let IsoDueDate = duedateValue ?
      moment(duedateValue + dueTime,'DD/MM/YYYY hh:mmA').format('YYYY-MM-DD[T]HH:mm:ss') : '';

      resultData = await APIServices.updateTaskDueDateData(projectID,taskID,IsoDueDate);
      if(resultData.message == 'success'){
        this.setState({dataLoading:false});
      }else{
        this.setState({dataLoading:false});
      }
  };

  async changeTaskReminderDate(){
      let remindDateValue = this.state.remindDateValue;
      let reminderTime = this.state.reminderTime;
      let projectID = this.state.selectedProjectID;
      let taskID = this.state.selectedProjectTaskID;

      let IsoReminderDate = remindDateValue ?
      moment(remindDateValue + reminderTime,'DD/MM/YYYY hh:mmA').format('YYYY-MM-DD[T]HH:mm:ss') : '';

      resultData = await APIServices.updateTaskReminderDateData(projectID,taskID,IsoReminderDate);
      if(resultData.message == 'success'){
        this.setState({dataLoading:false});
      }else{
        this.setState({dataLoading:false});
      }
  };

  render() {
    let taskStatus = this.state.taskStatus;
    let dataLoading = this.state.dataLoading;

    return (
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
      </ScrollView>
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
)(TasksDetailsScreen);
