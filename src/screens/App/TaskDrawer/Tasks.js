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
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
import AddNewTasksScreen from '../Tasks/AddNewTasksScreen';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import moment from 'moment';
import FadeIn from 'react-native-fade-in-image';
import {SkypeIndicator} from 'react-native-indicators';
import {NavigationEvents} from 'react-navigation';
import APIServices from '../../../services/APIServices';
import Triangle from 'react-native-triangle';
import EmptyListView from '../../../components/EmptyListView';

const Placeholder = () => (
  <View style={styles.landing}>
    <SkypeIndicator color={colors.primary} />
  </View>
);

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
    };
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

  userImageSubTask = function(item) {
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
    let index = this.state.index;
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

  onNewTaskNameChange(text) {
    this.setState({taskName: text});
  }

  async onNewTaskNameSubmit(text) {
    try {
      let taskName = this.state.taskName;
      let selectedTaskGroupId = this.state.selectedTaskGroupId;
      this.setState({dataLoading: true});
      newGroupTaskData = await APIServices.addTaskGroupTaskData(
        taskName,
        selectedTaskGroupId,
      );
      if (newGroupTaskData.message == 'success') {
        this.setState({dataLoading: false, taskName: ''});
        this.getAllTaskInGroup();
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      this.setState({dataLoading: false});
    }
  }

  onNewSubTasksNameChange(text) {
    this.setState({subTasksName: text});
  }

  async onNewSubTasksNameSubmit(text, item, indexMain) {
    try {
      let subTasksName = this.state.textInputs[indexMain];
      let selectedTaskGroupId = this.state.selectedTaskGroupId;
      let taskId = item.parentTask.taskId;
      this.setState({dataLoading: true});
      newTaskData = await APIServices.addSubTaskGroupTaskData(
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
    }
  }

  // render main list without filter
  renderTaskList(item, indexMain) {
    let index = this.state.index;
    let subTasksName = this.state.subTasksName;
    let selectedTaskGroupId = this.props.selectedTaskGroupId;
    let parentTaskName = item.parentTask.taskName;
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('GroupTasksDetailsScreen', {
              taskDetails: item.parentTask,
              selectedGroupTaskID: selectedTaskGroupId,
              selectedGroupTaskName: item.parentTask.taskName,
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
                  this.onNewSubTasksNameSubmit(
                    this.state.subTasksName,
                    item,
                    indexMain,
                  )
                }
              />
            </View>
            <FlatList
              style={{
                marginBottom: EStyleSheet.value('15rem'),
              }}
              data={index == 0 ? item.childTasks : item.childTasks}
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
            taskDetails: item,
            selectedGroupTaskID: selectedTaskGroupId,
            selectedGroupTaskName: item.taskName,
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
            taskDetails: item,
            selectedGroupTaskID: selectedTaskGroupId,
            selectedGroupTaskName: item.taskName,
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
                  color={'#0bafff'}
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
    selectedTypeAllTasks;
    let taskName = this.state.taskName;
    let filter = this.state.filter;

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
              <TextInput
                style={[styles.textInput, {width: '95%'}]}
                placeholder={'Add a task'}
                value={taskName}
                onChangeText={taskName => this.onNewTaskNameChange(taskName)}
                onSubmitEditing={() =>
                  this.onNewTaskNameSubmit(this.state.taskName)
                }
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
    marginBottom: '65rem',
    backgroundColor: colors.white,
    borderRadius: 5,
    marginHorizontal: '05rem',
    marginTop: '7rem',
    marginBottom: '150rem',
  },
  subContainer: {
    marginBottom: '65rem',
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginHorizontal: '0rem',
    marginTop: '7rem',
    marginBottom: '150rem',
  },
  projectFilerView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    // width: '330rem',
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
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
    // fontWeight: 'bold',
  },
  taskView: {
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
  landing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewFieldView: {
    backgroundColor: '#e5e9ef',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e5e9ef',
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
    marginBottom: 5,
  },
  textMain: {
    fontSize: '11rem',
    color: colors.white,
    fontWeight: 'bold',
    // lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    flex: 0.9,
  },
  tasksLabelView: {
    width: '75rem',
    height: '18rem',
    borderRadius: '10rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tasksLabelText: {
    fontSize: '8rem',
    color: colors.white,
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
    color: '#080848',
    fontWeight: 'bold',
    // lineHeight: '17rem',
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
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(Tasks);
