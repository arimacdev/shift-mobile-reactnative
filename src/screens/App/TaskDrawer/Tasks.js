import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
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
import {NavigationEvents} from 'react-navigation';
import APIServices from '../../../services/APIServices';
import Triangle from 'react-native-triangle';
import EmptyListView from '../../../components/EmptyListView';
import AwesomeAlert from 'react-native-awesome-alerts';
import PopupMenuUserList from '../../../components/PopupMenuUserList';

let dropData = [
  {
    id: 'All',
    value: 'All',
  },
  {
    id: 'Open',
    value: 'Open',
  },
  {
    id: 'Closed',
    value: 'Closed',
  },
];

class Tasks extends Component {
  selectedUserList = [];
  subTaskTextInputs = [];

  constructor(props) {
    super(props);
    this.state = {
      filterdDataAllTaks: [],
      allDataAllTaks: [],
      index: 0,
      selectedTaskGroupId: '',
      isActive: this.props.isActive,
      selectedTypeAllTasks: 'All',
      dataLoading: false,
      taskName: '',
      filter: false,
      subTasksName: '',
      textInputs: [],
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      duedate: '',
      mainTaskTextChange: true,
      userName: '',
      subtaskTextInputIndex: 0,
      showUserListModal: false,
      showDatePicker: false,
      activeUsers: [],
      dataLength: 0,
    };
  }

  componentWillMount() {
    let selectedTaskGroupId = this.props.selectedTaskGroupId;
    this.getActiveUserList(selectedTaskGroupId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      let selectedTaskGroupId = this.props.selectedTaskGroupId;
      this.setState(
        {
          selectedTaskGroupId: selectedTaskGroupId,
        },
        () => {
          this.getAllTaskInGroup();
          this.getActiveUserList(selectedTaskGroupId);
        },
      );
    }
  }

  async componentDidMount() {
    // let selectedTaskGroupId = this.props.selectedTaskGroupId;
    //   this.setState(
    //     {
    //       selectedTaskGroupId: selectedTaskGroupId,
    //     },
    //     () => {
    //       this.getAllTaskInGroup();
    //     },
    //   );
  }

  async getAllTaskInGroup() {
    this.setState({
      selectedTypeAllTasks: 'All',
    });
    let selectedTaskGroupId = this.state.selectedTaskGroupId;
    this.setState({dataLoading: true});
    let allTaskData = await APIServices.getAllTaskByGroup(selectedTaskGroupId);
    console.log(allTaskData);
    if (allTaskData.message == 'success') {
      this.setState({
        dataLoading: false,
        allDataAllTaks: allTaskData.data,
        filterdDataAllTaks: allTaskData.data,
        filter: false,
      });
    } else {
      this.setState({dataLoading: false});
    }
  }

  async tabOpenTaskTab() {
    let selectedTaskGroupId = this.props.selectedTaskGroupId;
    this.setState(
      {
        selectedTaskGroupId: selectedTaskGroupId,
      },
      () => {
        this.getAllTaskInGroup();
      },
    );
  }

  dateViewMain = function(item) {
    let date = item.parentTask.taskDueDateAt;
    let currentTime = moment().format();
    let dateText = '';
    let color = '';

    let taskStatus = item.parentTask.taskStatus;
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
      color = colors.white;
    }

    return <Text style={[styles.textDate, {color: color}]}>{dateText}</Text>;
  };

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
        color = colors.colorMidnightBlue;
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

  userImage = function(item) {
    let userImage = item.parentTask.taskAssigneeProfileImage;

    if (userImage) {
      return (
        <FadeIn>
          <Image source={{uri: userImage}} style={styles.iconStyle} />
        </FadeIn>
      );
    } else {
      return <Image style={styles.iconStyle} source={icons.defultUser} />;
    }
  };

  userImageSubTask = function(item) {
    let userImage = item.taskAssigneeProfileImage;

    if (userImage) {
      return (
        <FadeIn>
          <Image source={{uri: userImage}} style={styles.iconStyle} />
        </FadeIn>
      );
    } else {
      return <Image style={styles.iconStyle} source={icons.defultUser} />;
    }
  };

  renderBase() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Image style={styles.dropIcon} source={icons.arrowDark} />
      </View>
    );
  }

  onFilterAllTasks(key) {
    let value = key;
    let searchValue = '';
    switch (value) {
      case 'All':
        searchValue = '';
        break;
      case 'Closed':
        searchValue = 'closed';
        break;
      case 'Open':
        searchValue = 'open';
        break;
    }

    if (searchValue != '') {
      //to do list all task individually
      let dataArray = [];
      let list = this.state.allDataAllTaks;
      for (let i = 0; i < list.length; i++) {
        let parentTask = list[i].parentTask;
        let childTasks = list[i].childTasks;
        if (parentTask.taskStatus == searchValue) {
          dataArray.push(parentTask);
        }
        for (let j = 0; j < childTasks.length; j++) {
          let childTasksItem = childTasks[j];
          if (childTasksItem.taskStatus == searchValue) {
            dataArray.push(childTasksItem);
          }
        }
      }
      this.setState({
        filterdDataAllTaks: dataArray,
        selectedTypeAllTasks: key,
        filter: true,
      });
    } else {
      let filteredData = this.state.allDataAllTaks;
      this.setState({
        filterdDataAllTaks: filteredData,
        selectedTypeAllTasks: key,
        filter: false,
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

  onFocusMainTextInput() {
    if (this.state.taskName == '') {
      this.setState({
        showUserListModal: false,
        textInputs: [],
        duedate: '',
      });
      this.selectedUserList = [];
    }
  }

  onNewTaskNameChange(text) {
    this.setState({taskName: text, textInputs: [], mainTaskTextChange: true});

    //showAssignee
    let lengthOfAt = text.split('@').length - 1;
    let nAt = text.lastIndexOf('@');
    let resultAt = text.substring(nAt + 1);
    if (text.match('@') && resultAt == '' && lengthOfAt == 1) {
      this.setState({showUserListModal: true, userName: ''});
      this.mainTaskTextInput.blur();
    } else {
      this.setState({showUserListModal: false});
    }

    //showDatePicker
    let lengthOfHash = text.split('#').length - 1;
    let n = text.lastIndexOf('#');
    let result = text.substring(n + 1);
    if (text.match('#') && result == '' && lengthOfHash == 1) {
      this.setState({showDatePicker: true});
    } else {
      this.setState({showDatePicker: false});
    }
  }

  async onNewTaskNameSubmit() {
    let duedate = this.state.duedate != '' ? this.state.duedate : '';
    try {
      let taskName =
        this.state.taskName.split('@')[0] == undefined
          ? this.state.taskName
          : this.state.taskName.split('@')[0].trim();

      let tasksNameFilter =
        taskName.split('#')[0] == undefined
          ? taskName
          : taskName.split('#')[0].trim();

      let taskAssignee =
        this.selectedUserList.length > 0 ? this.selectedUserList[0].userId : '';

      let taskDueDate =
        duedate != ''
          ? moment(
              moment(duedate).format('DD MM YYYY'),
              'DD/MM/YYYY hh:mmA',
            ).format('YYYY-MM-DD[T]HH:mm:ss')
          : '';

      let selectedTaskGroupId = this.state.selectedTaskGroupId;

      this.setState({dataLoading: true});
      let newGroupTaskData = await APIServices.addTaskGroupTaskData(
        tasksNameFilter,
        selectedTaskGroupId,
        taskAssignee,
        taskDueDate,
      );
      if (newGroupTaskData.message == 'success') {
        this.setState({dataLoading: false, taskName: ''});
        this.getAllTaskInGroup();
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      this.setState({dataLoading: false});
      this.showAlert('', 'New task added fail');
    }
  }

  onNewSubTasksNameChange(text) {
    this.setState({subTasksName: text});
  }

  async onNewSubTasksNameSubmit(item, indexMain) {
    try {
      let subTasksName = this.state.textInputs[indexMain];
      let selectedTaskGroupId = this.state.selectedTaskGroupId;
      let taskId = item.parentTask.taskId;
      this.setState({dataLoading: true});
      let newTaskData = await APIServices.addSubTaskGroupTaskData(
        subTasksName,
        selectedTaskGroupId,
        taskId,
      );
      if (newTaskData.message == 'success') {
        this.setState({dataLoading: false, textInputs: []});
        this.getAllTaskInGroup();
      } else {
        this.setState({dataLoading: false, textInputs: []});
      }
    } catch (e) {
      this.setState({dataLoading: false, textInputs: []});
      this.showAlert('', 'New sub task added fail');
    }
  }

  async onTaskSelectUser(item) {
    let {textInputs} = this.state;
    let mainTaskTextChange = this.state.mainTaskTextChange;
    let taskName = this.state.taskName;
    let subtaskTextInputIndex = this.state.subtaskTextInputIndex;
    let userName = this.state.userName;

    this.selectedUserList = [];
    this.selectedUserList.push({
      username: item.label,
      userId: item.key,
    });

    let name = mainTaskTextChange
      ? taskName
      : textInputs[subtaskTextInputIndex];

    let replasedText = name
      .substring(0, name.lastIndexOf('@'))
      .replace('/' + userName + '/', '');

    await this.setState({
      showUserListModal: false,
    });

    if (mainTaskTextChange) {
      this.setState({
        taskName: replasedText.concat('@' + item.label + ' '),
      });
      this.mainTaskTextInput.focus();
    } else {
      textInputs[subtaskTextInputIndex] = replasedText.concat(
        '@' + item.label + ' ',
      );
      this.setState({textInputs});
      this.subTaskTextInputs[subtaskTextInputIndex].focus();
    }
  }

  async getActiveUserList(selectedTaskGroupId) {
    this.setState({dataLoading: true});
    let activeUsers = await APIServices.getTaskPeopleData(selectedTaskGroupId);
    if (activeUsers.message == 'success') {
      let userList = [];
      activeUsers.data.sort(this.arrayCompare);
      for (let i = 0; i < activeUsers.data.length; i++) {
        if (
          activeUsers.data[i].assigneeFirstName &&
          activeUsers.data[i].assigneeLastName
        ) {
          userList.push({
            key: activeUsers.data[i].assigneeId,
            label:
              activeUsers.data[i].assigneeFirstName +
              ' ' +
              activeUsers.data[i].assigneeLastName,
            userImage: activeUsers.data[i].assigneeProfileImage,
          });
        }
      }
      await this.setState({
        activeUsers: userList,
        dataLength: userList.length,
        dataLoading: false,
      });
    } else {
      console.log('error');
      this.setState({dataLoading: false});
    }
  }

  arrayCompare(a, b) {
    const firstNameA = a.assigneeFirstName.toUpperCase();
    const firstNameB = b.assigneeFirstName.toUpperCase();

    let comparison = 0;
    if (firstNameA > firstNameB) {
      comparison = 1;
    } else if (firstNameA < firstNameB) {
      comparison = -1;
    }
    return comparison;
  }

  renderUserListModal() {
    let activeUsers = this.state.activeUsers;
    let dataLength = this.state.dataLength;

    return (
      <PopupMenuUserList
        addPeopleModelVisible={this.state.showUserListModal}
        onSelect={item => this.onTaskSelectUser(item)}
        userName={this.state.userName}
        activeUsersData={true}
        activeUsers={activeUsers}
        dataLength={dataLength}
        keyboardValue={0}
        customScrollStyle={styles.customScrollStyle}
        hasBackdrop={true}
        coverScreen={true}
        customModalStyle={styles.popupMenuModalStyle}
      />
    );
  }

  // render main list without filter
  renderTaskList(item, indexMain) {
    let index = this.state.index;
    let selectedTaskGroupId = this.props.selectedTaskGroupId;
    let parentTaskName = item.parentTask.taskName;
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('GroupTasksDetailsScreen', {
              taskId: item.parentTask.taskId,
              id: selectedTaskGroupId,
              name: item.parentTask.taskName,
            })
          }>
          <View
            style={[
              styles.projectView,
              {
                marginTop:
                  indexMain == 0
                    ? 0
                    : this.state.filter
                    ? EStyleSheet.value('8rem')
                    : EStyleSheet.value('20rem'),
                borderBottomStartRadius: this.state.filter
                  ? EStyleSheet.value('5rem')
                  : EStyleSheet.value('0rem'),
                borderBottomEndRadius: this.state.filter
                  ? EStyleSheet.value('5rem')
                  : EStyleSheet.value('0rem'),
              },
            ]}>
            <Image
              style={styles.completionIcon}
              source={
                item.taskStatus == 'closed'
                  ? icons.rightCircule
                  : icons.whiteCircule
              }
            />
            <View style={styles.tasksMainView}>
              <View style={styles.tasksHeaderView}>
                {/* <Text style={styles.textMain}>
                  {this.state.selectedProjectName}
                </Text>
                <Text style={styles.text}>{item.parentTask.taskName}</Text> */}

                <Text style={styles.textMain} numberOfLines={1}>
                  {item.parentTask.taskName}
                </Text>
              </View>
            </View>
            <View style={styles.statusView}>
              {this.dateViewMain(item)}
              {this.userImage(item)}
            </View>
          </View>
        </TouchableOpacity>
        {!this.state.filter ? (
          <View style={styles.tasksInnerView}>
            <View style={[styles.addNewSubTaskView, {flexDirection: 'row'}]}>
              <Image
                style={styles.addSubTaskIcon}
                source={icons.add}
                resizeMode={'contain'}
              />
              <TextInput
                style={[styles.subTaskTextInput, {width: '95%'}]}
                placeholder={'Add a sub task...'}
                placeholderTextColor={colors.white}
                onChangeText={subTasksName => {
                  let {textInputs} = this.state;
                  textInputs[indexMain] = subTasksName;
                  this.setState({
                    textInputs,
                  });
                }}
                value={this.state.textInputs[indexMain]}
                onSubmitEditing={() =>
                  this.onNewSubTasksNameSubmit(item, indexMain)
                }
              />
            </View>
            <FlatList
              style={{
                marginBottom: EStyleSheet.value('15rem'),
              }}
              data={item.childTasks}
              renderItem={({item}) =>
                this.renderSubTasksList(item, parentTaskName)
              }
              keyExtractor={item => item.taskId}
            />
          </View>
        ) : null}
      </View>
    );
  }

  // render sub list without filter
  renderSubTasksList(item, parentTaskName) {
    let selectedTaskGroupId = this.state.selectedTaskGroupId;
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('GroupTasksDetailsScreen', {
            taskId: item.taskId,
            id: selectedTaskGroupId,
            name: item.taskName,
            parentTaskName: parentTaskName,
          })
        }>
        <View style={styles.subTasksView}>
          <Image
            style={styles.completionIcon}
            source={
              item.taskStatus == 'closed'
                ? icons.rightCircule
                : icons.circuleGray
            }
          />
          <View style={styles.subTasksMainView}>
            <View style={styles.subTasksTextView}>
              <Text style={styles.subTextMain} numberOfLines={1}>
                {item.taskName}
              </Text>
            </View>
          </View>
          <View style={styles.statusView}>
            {this.dateView(item)}
            {this.userImageSubTask(item)}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  // render all task list with a filter
  renderTaskListFilter(item) {
    let selectedTaskGroupId = this.state.selectedTaskGroupId;
    let parentTaskName = '';

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('GroupTasksDetailsScreen', {
            taskId: item.taskId,
            id: selectedTaskGroupId,
            name: item.taskName,
            parentTaskName: parentTaskName,
          })
        }>
        <View style={styles.subTasksView}>
          <Image
            style={styles.completionIcon}
            source={
              item.taskStatus == 'closed'
                ? icons.rightCircule
                : icons.circuleGray
            }
          />
          <View style={styles.subTasksMainView}>
            <View style={styles.subTasksTextView}>
              <Text style={styles.subTextMain} numberOfLines={1}>
                {item.taskName}
              </Text>
            </View>
          </View>
          <View style={styles.statusView}>
            {this.dateView(item)}
            {this.userImageSubTask(item)}
            {item.parent && (
              <View style={styles.triangleShape}>
                <Triangle
                  width={30}
                  height={30}
                  color={colors.colorDeepSkyBlue}
                  style={{borderTopEndRadius: EStyleSheet.value('5rem')}}
                  direction={'up-right'}
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    let filterdDataAllTaks = this.state.filterdDataAllTaks;
    let selectedTypeAllTasks = this.state.selectedTypeAllTasks;
    let dataLoading = this.state.dataLoading;
    let taskName = this.state.taskName;
    let filter = this.state.filter;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => this.tabOpenTaskTab(payload)}
        />
        <View>
          <View style={styles.projectFilerView}>
            <Dropdown
              label=""
              labelFontSize={0}
              data={dropData}
              textColor={colors.dropDownText}
              error={''}
              animationDuration={0.5}
              containerStyle={{width: '100%'}}
              overlayStyle={{width: '100%'}}
              pickerStyle={styles.tasksStatusPicker}
              dropdownPosition={0}
              value={selectedTypeAllTasks}
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
              onChangeText={value => this.onFilterAllTasks(value)}
            />
          </View>
          {!filter && (
            <View style={[styles.addNewFieldView, {flexDirection: 'row'}]}>
              <Image
                style={styles.addNewIcon}
                source={icons.blueAdd}
                resizeMode={'contain'}
              />
              <TextInput
                ref={ref => (this.mainTaskTextInput = ref)}
                style={[styles.textInput, {width: '95%'}]}
                placeholder={'Add a task... (opt: @Assignee #Due Date)'}
                value={taskName}
                maxLength={100}
                onChangeText={taskName => this.onNewTaskNameChange(taskName)}
                onSubmitEditing={() => this.onNewTaskNameSubmit()}
                onFocus={() => this.onFocusMainTextInput()}
              />
            </View>
          )}
        </View>
        {/* view task list with child parent view */}
        {!filter && filterdDataAllTaks.length > 0 && (
          <View style={styles.subContainerWhite}>
            <FlatList
              style={{
                marginBottom: EStyleSheet.value('10rem'),
                marginTop: EStyleSheet.value('10rem'),
              }}
              data={filterdDataAllTaks}
              renderItem={({item, index}) => this.renderTaskList(item, index)}
              keyExtractor={item => item.parentTask.taskId}
              ListEmptyComponent={<EmptyListView />}
            />
          </View>
        )}
        {/* view task list one by one */}
        {filter && filterdDataAllTaks.length > 0 && (
          <View style={styles.subContainer}>
            <FlatList
              style={{
                marginBottom: EStyleSheet.value('10rem'),
                marginTop: EStyleSheet.value('10rem'),
              }}
              data={filterdDataAllTaks}
              renderItem={({item}) => this.renderTaskListFilter(item)}
              keyExtractor={item => item.taskId}
              ListEmptyComponent={<EmptyListView />}
            />
          </View>
        )}
        {this.renderUserListModal()}
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
  subContainerWhite: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
    marginTop: '7rem',
    marginBottom: '150rem',
  },
  subContainer: {
    marginBottom: '80rem',
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginHorizontal: '20rem',
    marginTop: '5rem',
  },
  projectFilerView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '11rem',
    color: colors.projectTaskNameColor,
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
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
  completionIcon: {
    width: '40rem',
    height: '40rem',
  },
  addNewFieldView: {
    backgroundColor: colors.colorSolitude,
    borderRadius: '5rem',
    borderWidth: 2,
    borderColor: colors.colorSolitude,
    marginTop: '10rem',
    marginBottom: '0rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '57rem',
    marginHorizontal: '20rem',
  },
  projectView: {
    backgroundColor: colors.darkBlue,
    borderTopStartRadius: '5rem',
    borderTopEndRadius: '5rem',
    height: '75rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  tasksMainView: {
    flex: 1,
    marginLeft: '10rem',
  },
  tasksHeaderView: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: '5rem',
  },
  textMain: {
    fontSize: '11rem',
    color: colors.white,
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    flex: 0.9,
  },
  tasksInnerView: {
    backgroundColor: colors.projectBgColor,
    marginHorizontal: '20rem',
    borderBottomStartRadius: '5rem',
    borderBottomEndRadius: '5rem',
  },
  addSubTaskIcon: {
    width: '20rem',
    height: '20rem',
  },
  subTaskTextInput: {
    fontSize: '10rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
  },
  subTasksView: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
    height: '65rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '10rem',
  },
  subTasksMainView: {
    flex: 1,
    marginLeft: '10rem',
  },
  subTasksTextView: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: '5rem',
  },
  subTextMain: {
    fontSize: '11rem',
    color: colors.colorMidnightExpress,
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    flex: 0.9,
  },
  addNewSubTaskView: {
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    marginTop: '8rem',
    marginBottom: '0rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '10rem',
    height: '40rem',
    marginHorizontal: '10rem',
  },
  triangleShape: {
    position: 'absolute',
    right: -12,
    top: -22,
  },
  tasksStatusPicker: {
    width: '89.5%',
    marginTop: '60rem',
    marginLeft: '13rem',
  },
  iconStyle: {
    width: '24rem',
    height: '24rem',
    borderRadius: 50 / 2,
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
  addNewIcon: {
    width: '25rem',
    height: '25rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
  },
  popupMenuModalStyle: {
    marginBottom: 0,
    justifyContent: 'center',
  },
  customScrollStyle: {
    maxHeight: '300rem',
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(Tasks);
