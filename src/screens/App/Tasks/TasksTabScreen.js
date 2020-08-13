import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
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
import AddNewTasksScreen from '../Tasks/AddNewTasksScreen';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import moment from 'moment';
import FadeIn from 'react-native-fade-in-image';
import {SkypeIndicator} from 'react-native-indicators';
import {NavigationEvents} from 'react-navigation';
import PopupMenuAssignee from '../../../components/PopupMenuAssignee';
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modal';
const {height, width} = Dimensions.get('window');
import {Icon} from 'native-base';
import APIServices from '../../../services/APIServices';
import EmptyListView from '../../../components/EmptyListView';
import AwesomeAlert from 'react-native-awesome-alerts';

const Placeholder = () => (
  <View style={styles.landing}>
    <SkypeIndicator color={colors.primary} />
  </View>
);

let dropData = [
  {
    id: 'None',
    value: 'None',
  },
  {
    id: 'Date',
    value: 'Date',
  },
  {
    id: 'Assignee',
    value: 'Assignee',
  },
  {
    id: 'Task type',
    value: 'Task type',
  },
  // {
  //   id: 'Task status',
  //   value: 'Task status',
  // },
];

let dropDataMyTasks = [
  {
    id: 'None',
    value: 'None',
  },
  {
    id: 'Date',
    value: 'Date',
  },
  {
    id: 'Task type',
    value: 'Task type',
  },
  // {
  //   id: 'Task status',
  //   value: 'Task status',
  // },
];

let bottomData = [
  {
    value: 'All tasks',
    bottomBarColor: colors.darkBlue,
    bottomBarIcon: icons.taskDark,
  },
  {
    value: 'My tasks',
    bottomBarColor: colors.lightGreen,
    bottomBarIcon: icons.taskGreen,
  },
  {
    value: 'Add new tasks',
    bottomBarColor: colors.lightBlue,
    bottomBarIcon: icons.taskBlue,
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

class TasksTabScreen extends Component {
  constructor(props) {
    super(props);
    this.lazyGetAllTaskInProject = this.lazyGetAllTaskInProject.bind(this);
    this.lazyGetMyTaskInProject = this.lazyGetMyTaskInProject.bind(this);
    this.getAllTaskInProjectDirectly = this.getAllTaskInProjectDirectly.bind(
      this,
    );
    this.state = {
      filterdDataAllTaks: [],
      filterdAndMyTasksData: [],
      index: 0,
      bottomItemPressColor: colors.darkBlue,
      selectedProjectID: 0,
      selectedProjectName: '',
      isActive: this.props.isActive,
      filterType: 'None',
      tasksName: '',
      subTasksName: '',
      filter: false,
      showPicker: false,
      from: 'all',
      to: 'all',
      mode: 'date',
      selectedStartDate: null,
      selectedEndDate: null,
      filterTaskType: '',
      textInputs: [],
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      listStartIndex: 0,
      listEndIndex: 10,
      myListStartIndex: 0,
      myListEndIndex: 10,
      cachecdData: [],
      cachecdMyListData: [],
      listScrolled: false,
    };

    this.onDateChange = this.onDateChange.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      let selectedProjectID = this.props.selectedProjectID;
      let selectedProjectName = this.props.projDetails.projectName;

      this.setState(
        {
          selectedProjectID: selectedProjectID,
          selectedProjectName: selectedProjectName,
          filterType: 'None',
          filter: false,
          index: 0,
        },
        () => {
          this.getAllTaskInProject();
        },
      );
    }

    if (
      prevProps.allTaskByProjectLoading !==
        this.props.allTaskByProjectLoading &&
      this.props.allTaskByProject &&
      (this.props.allTaskByProject.length > 0 ||
        this.props.allTaskByProject.length == 0)
    ) {
      this.setState({
        filterdDataAllTaks: this.props.allTaskByProject,
        cachecdData: this.props.allTaskByProject,
      });
    }

    if (
      prevProps.myTaskByProjectLoading !== this.props.myTaskByProjectLoading &&
      this.props.myTaskByProject &&
      (this.props.myTaskByProject.length > 0 ||
        this.props.myTaskByProject.length == 0)
    ) {
      this.setState({
        filterdAndMyTasksData: this.props.myTaskByProject,
        cachecdMyListData: this.props.myTaskByProject,
      });
    }
  }

  componentDidMount() {
    // let selectedProjectID = this.props.selectedProjectID;
    // this.setState(
    //   {
    //     selectedProjectID: selectedProjectID,
    //   },
    //   () => {
    //     this.getAllTaskInProject();
    //   },
    // );
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    if (this.state.showPicker) {
      this.onCloseModel();
    } else {
      this.props.navigation.goBack(null);
    }
    return true;
  }

  onDateChange(date, type) {
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
  }

  async getAllTaskInProject() {
    let startIndex = 0;
    let endIndex = 10;
    let allTasks = true;
    this.setState({
      filterType: 'None',
    });
    let selectedProjectID = this.state.selectedProjectID;
    AsyncStorage.getItem('userID').then(userID => {
      this.props.getAllTaskInProjects(
        userID,
        selectedProjectID,
        startIndex,
        endIndex,
        allTasks
      );
    });
  }

  lazyGetAllTaskInProject = async () => {
    let selectedProjectID = this.state.selectedProjectID;
    this.setState({
      filterType: 'None',
    });
    if (
      this.state.cachecdData.length == 10 &&
      this.state.listScrolled == true
    ) {
      let listStartIndex = this.state.listStartIndex + 1 + 10;
      let listEndIndex = this.state.listEndIndex + 10;
      let allTasks = false;
      AsyncStorage.getItem('userID').then(userID => {
        this.getAllTaskInProjectDirectly(
          userID,
          selectedProjectID,
          listStartIndex,
          listEndIndex,
          allTasks
        );
      });
      this.setState({
        listStartIndex: listStartIndex - 1,
        listEndIndex: listEndIndex,
      });
    } else {
      // TODO: Add toast
    }
  };

  getAllTaskInProjectDirectly = async (
    userID,
    selectedProjectID,
    listStartIndex,
    listEndIndex,
    allTasks
  ) => {
    this.setState({dataLoading: true, cachecdData: []});
    await APIServices.getAllTaskInProjectsData(
      userID,
      selectedProjectID,
      listStartIndex,
      listEndIndex,
      allTasks
    )
      .then(response => {
        if (response.message == 'success') {
          this.setState(
            {
              filterdDataAllTaks: this.state.filterdDataAllTaks.concat(
                response.data,
              ),
              cachecdData: response.data,
              dataLoading: false,
            },
            () => {},
          );
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        // Utils.showAlert(true, '', error.data.message, this.props);
      });
  };

  async getMyTaskInProject() {
    let myListStartIndex = 0;
    let myListEndIndex = 10;
    this.setState({
      filterType: 'None',
    });
    let selectedProjectID = this.state.selectedProjectID;
    AsyncStorage.getItem('userID').then(userID => {
      this.props.getMyTaskInProjects(
        userID,
        selectedProjectID,
        myListStartIndex,
        myListEndIndex,
      );
    });
  }

  lazyGetMyTaskInProject = async () => {
    let selectedProjectID = this.state.selectedProjectID;
    this.setState({
      filterType: 'None',
    });
    if (
      this.state.cachecdMyListData.length == 10 &&
      this.state.listScrolled == true
    ) {
      let myListStartIndex = this.state.myListStartIndex + 1 + 10;
      let myListEndIndex = this.state.myListEndIndex + 10;
      AsyncStorage.getItem('userID').then(userID => {
        this.getAllMyTaskInProjectDirectly(
          userID,
          selectedProjectID,
          myListStartIndex,
          myListEndIndex,
        );
      });
      this.setState({
        myListStartIndex: myListStartIndex - 1,
        myListEndIndex: myListEndIndex,
      });
    } else {
      // TODO: Add toast
    }
    // let selectedProjectID = this.state.selectedProjectID;
    // AsyncStorage.getItem('userID').then(userID => {
    //   this.props.getMyTaskInProjects(userID, selectedProjectID, myListStartIndex, myListEndIndex);
    // });
  };

  getAllMyTaskInProjectDirectly = async (
    userID,
    selectedProjectID,
    listStartIndex,
    listEndIndex,
  ) => {
    this.setState({dataLoading: true, cachecdMyListData: []});
    await APIServices.getMyTaskInProjectsData(
      userID,
      selectedProjectID,
      listStartIndex,
      listEndIndex,
    )
      .then(response => {
        if (response.message == 'success') {
          this.setState(
            {
              filterdAndMyTasksData: this.state.filterdAndMyTasksData.concat(
                response.data,
              ),
              cachecdMyListData: response.data,
              dataLoading: false,
            },
            () => {},
          );
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        // Utils.showAlert(true, '', error.data.message, this.props);
      });
  };

  onMyListScroll(event) {
    this.setState({listScrolled: true});
  }

  dateViewMyAndFilter = function(item) {
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
      color = item.isParent ? colors.white : colors.black;
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
      color = item.isParent ? colors.white : colors.black;
    }

    return <Text style={[styles.textDate, {color: color}]}>{dateText}</Text>;
  };

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
      color = item.parentTask.isParent ? colors.white : colors.black;
    }

    return <Text style={[styles.textDate, {color: color}]}>{dateText}</Text>;
  };

  issueTypeColor(issueType) {
    let color = '';
    switch (issueType) {
      case 'development':
        color = colors.colorOrange;
        break;
      case 'qa':
        color = colors.colorTangerine;
        break;
      case 'design':
        color = colors.colorApple;
        break;
      case 'bug':
        color = colors.colorCoralRed;
        break;
      case 'operational':
        color = colors.colorHeliotrope;
        break;
      case 'preSales':
        color = colors.colorCaribbeanGreen;
        break;
      case 'general':
        color = colors.colorsNavyBlue;
        break;
      default:
        break;
    }

    return color;
  }

  userImage = function(item) {
    let userImage = item.parentTask.taskAssigneeProfileImage;

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

  userImageSubTask = function(item) {
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

  async subTaskClick(item, parentTaskName) {
    let selectedProjectID = this.state.selectedProjectID;
    let selectedProjectName = this.state.selectedProjectName;
    await this.props.secondDetailViewOpen(false);
    this.props.navigation.navigate('TasksDetailsScreen', {
      taskId: item.taskId,
      id: selectedProjectID,
      name: selectedProjectName,
      parentTaskName: parentTaskName,
    });
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

  renderSubTasksList(item, parentTaskName) {
    let selectedProjectID = this.state.selectedProjectID;
    let selectedProjectName = this.state.selectedProjectName;
    return (
      <TouchableOpacity onPress={() => this.subTaskClick(item, parentTaskName)}>
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
              <Text style={styles.subTextMain}>{item.secondaryTaskId}</Text>
              <Text style={styles.subText} numberOfLines={1}>
                {item.taskName}
              </Text>

              {/* <Text style={styles.subTextMain}>{item.taskName}</Text> */}
            </View>
            <View
              style={[
                styles.subTasksLabelView,
                {
                  backgroundColor: this.issueTypeColor(item.issueType),
                },
              ]}>
              <Text style={styles.subTasksLabelText}>{item.issueType}</Text>
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

  async MainTaskClick(
    item,
    selectedProjectID,
    selectedProjectName,
    parentTaskName,
  ) {
    await this.props.secondDetailViewOpen(false);
    this.props.navigation.navigate('TasksDetailsScreen', {
      taskId: item.parentTask.taskId,
      id: selectedProjectID,
      name: selectedProjectName,
      parentTaskName: parentTaskName,
    });
  }

  renderTaskList(item, indexMain) {
    let index = this.state.index;
    let selectedProjectID = this.state.selectedProjectID;
    let subTasksName = this.state.subTasksName;
    let selectedProjectName = this.state.selectedProjectName;
    let parentTaskName = item.parentTask.taskName;
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.MainTaskClick(
              item,
              selectedProjectID,
              selectedProjectName,
              parentTaskName,
            )
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
                item.parentTask.taskStatus == 'closed'
                  ? icons.rightCircule
                  : icons.whiteCircule
              }
            />
            <View style={styles.tasksMainView}>
              <View style={styles.tasksHeaderView}>
                <Text style={styles.textMain}>
                  {item.parentTask.secondaryTaskId}
                </Text>
                <Text style={styles.text} numberOfLines={1}>
                  {item.parentTask.taskName}
                </Text>

                {/* <Text style={styles.textMain}>{item.parentTask.taskName}</Text> */}
              </View>
              <View
                style={[
                  styles.tasksLabelView,
                  {
                    backgroundColor: this.issueTypeColor(
                      item.parentTask.issueType,
                    ),
                  },
                ]}>
                <Text style={styles.tasksLabelText}>
                  {item.parentTask.issueType}
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
                maxLength={100}
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

  async filterTaskClick(item) {
    let selectedProjectID = this.state.selectedProjectID;
    let selectedProjectName = this.state.selectedProjectName;
    let parentTaskName = '';
    await this.props.secondDetailViewOpen(false);
    this.props.navigation.navigate('TasksDetailsScreen', {
      taskId: item.taskId,
      id: selectedProjectID,
      name: selectedProjectName,
      parentTaskName: parentTaskName,
    });
  }

  renderMyTasksAndFilterTaskList(item, indexMain) {
    let selectedProjectID = this.state.selectedProjectID;
    let selectedProjectName = this.state.selectedProjectName;
    let parentTaskName = '';

    return (
      <TouchableOpacity onPress={() => this.filterTaskClick(item)}>
        <View
          style={item.isParent ? styles.parentTaskView : styles.childTasksView}>
          <Image
            style={styles.completionIcon}
            source={
              item.taskStatus == 'closed'
                ? icons.rightCircule
                : icons.circuleWhite
            }
          />
          <View style={styles.subTasksMainView}>
            <View style={styles.subTasksTextView}>
              {/* <Text style={styles.subTextMain}>
                {this.state.selectedProjectName}
              </Text>
              <Text style={styles.subText}>{item.taskName}</Text> */}

              <Text
                style={
                  item.isParent ? styles.parentTextMain : styles.subTextMain
                }>
                {item.secondaryTaskId}
              </Text>
              <Text
                style={item.isParent ? styles.parentTextSub : styles.subText}
                numberOfLines={1}>
                {item.taskName}
              </Text>
            </View>
            <View
              style={[
                styles.subTasksLabelView,
                {
                  backgroundColor: this.issueTypeColor(item.issueType),
                },
              ]}>
              <Text style={styles.subTasksLabelText}>{item.issueType}</Text>
            </View>
          </View>
          <View style={styles.statusView}>
            {this.dateViewMyAndFilter(item)}
            {this.userImageSubTask(item)}
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

  async onBottomItemPress(index) {
    // let color;
    this.setState({index: index});
    switch (index) {
      case 0:
        // All tasks
        await this.resetValues();
        this.getAllTaskInProject();
        break;
      case 1:
        // my tasks
        await this.resetValues();
        this.getMyTaskInProject();
        break;
    }
  }

  renderBottomBar() {
    return (
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBarInnerContainer}>
          {bottomData.map((item, index) => {
            return (
              <View style={styles.bottomItemView}>
                <TouchableOpacity
                  style={[
                    styles.bottomItemTouch,
                    {
                      backgroundColor:
                        index == this.state.index
                          ? item.bottomBarColor
                          : colors.projectBgColor,
                    },
                  ]}
                  onPress={() => this.onBottomItemPress(index)}>
                  <Image
                    style={styles.bottomBarIcon}
                    source={
                      index == this.state.index
                        ? icons.taskWhite
                        : item.bottomBarIcon
                    }
                  />
                  <Text
                    style={[
                      styles.bottomBarText,
                      {
                        color:
                          index == this.state.index
                            ? colors.white
                            : item.bottomBarColor,
                      },
                    ]}>
                    {item.value}
                  </Text>
                </TouchableOpacity>
                {index !== bottomData.length - 1 ? (
                  <View style={styles.horizontalLine} />
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  onFilter(key) {
    let value = key;
    let searchValue = '';
    let index = this.state.index;
    switch (value) {
      case 'None':
        searchValue = '';
        break;
      case 'Date':
        searchValue = 'Date';
        break;
      case 'Assignee':
        searchValue = 'Assignee';
        break;
      case 'Task type':
        searchValue = 'Task type';
        this.setState({filterTaskType: 'Development'});
        this.fetchInitialDataWithTaskType();
        break;
      case 'Task status':
        searchValue = 'Task status';
        break;
      default:
        break;
    }

    if (searchValue != '') {
      this.setState({filter: true});
    } else {
      if (index == 0) {
        this.setState({filter: false});
        this.getAllTaskInProject();
      } else {
        this.setState({filter: false});
        this.getMyTaskInProject();
      }
    }
    // reset Values
    this.resetFilterValues(key);
  }

  resetFilterValues(key) {
    this.setState({
      filterType: key,
      selectedStartDate: null,
      selectedEndDate: null,
    });
  }

  resetValues(key) {
    this.setState({
      filterType: 'None',
      filterdAndMyTasksData: [],
      filterdDataAllTaks: [],
      selectedStartDate: null,
      selectedEndDate: null,
      filter: false,
    });
  }

  async componentDidMount() {}

  async tabOpenTaskTab() {
    let selectedProjectID = this.props.selectedProjectID;
    let selectedProjectName = this.props.projDetails.projectName;
    this.setState(
      {
        selectedProjectID: selectedProjectID,
        selectedProjectName: selectedProjectName,
        filterType: 'None',
        filter: false,
        index: 0,
      },
      () => {
        this.getAllTaskInProject();
      },
    );
  }

  onSuccess(text) {
    this.setState({index: 0});
    this.getAllTaskInProject();
  }

  onNewSubTasksNameChange(text) {
    this.setState({subTasksName: text});
  }

  async onNewSubTasksNameSubmit(text, item, indexMain) {
    try {
      let subTasksName = this.state.textInputs[indexMain];
      let selectedProjectID = this.state.selectedProjectID;
      let taskId = item.parentTask.taskId;
      this.setState({dataLoading: true});
      newTaskData = await APIServices.addSubTaskToProjectData(
        subTasksName,
        selectedProjectID,
        taskId,
      );
      if (newTaskData.message == 'success') {
        this.setState({dataLoading: false, textInputs: []});
        this.getAllTaskInProject();
      } else {
        this.setState({dataLoading: false, textInputs: []});
      }
    } catch (e) {
      this.showAlert('', 'New sub task added fail');
      this.setState({dataLoading: false, textInputs: []});
    }
  }

  onNewTasksNameChange(text) {
    this.setState({tasksName: text});
  }

  async onNewTasksNameSubmit(text) {
    try {
      let tasksName = this.state.tasksName;
      let selectedProjectID = this.state.selectedProjectID;
      this.setState({dataLoading: true});
      newTaskData = await APIServices.addMainTaskToProjectData(
        tasksName,
        selectedProjectID,
      );
      if (newTaskData.message == 'success') {
        this.setState({dataLoading: false, tasksName: ''});
        this.getAllTaskInProject();
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      this.showAlert('', 'New main task added fail');
      this.setState({dataLoading: false});
    }
  }

  async fetchInitialDataWithTaskType() {
    try {
      let selectedProjectID = this.state.selectedProjectID;
      let index = this.state.index;
      this.setState({dataLoading: true});
      filtedData = await APIServices.filterTaskByTaskTypeData(
        selectedProjectID,
        'development',
      );
      if (filtedData.message == 'success') {
        if (index == 0) {
          // filter tasks when myTasks selected
          this.setState({
            dataLoading: false,
            filterdAndMyTasksData: filtedData.data,
          });
        } else {
          let myTasksFiltedData = [];
          let userID = await AsyncStorage.getItem('userID');
          myTasksFiltedData = filtedData.data.filter(function(data) {
            return data.taskAssignee == userID;
          });
          this.setState({
            dataLoading: false,
            filterdAndMyTasksData: myTasksFiltedData,
          });
        }
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      console.log(e);
      this.setState({dataLoading: false});
    }
  }

  async fetchDataWithTaskType(issueTypeID) {
    try {
      let selectedProjectID = this.state.selectedProjectID;
      let index = this.state.index;
      this.setState({dataLoading: true});
      filtedData = await APIServices.filterTaskByTaskTypeData(
        selectedProjectID,
        issueTypeID,
      );
      if (filtedData.message == 'success') {
        if (index == 0) {
          // filter tasks when myTasks selected
          this.setState({
            dataLoading: false,
            filterdAndMyTasksData: filtedData.data,
          });
        } else {
          let myTasksFiltedData = [];
          let userID = await AsyncStorage.getItem('userID');
          myTasksFiltedData = filtedData.data.filter(function(data) {
            return data.taskAssignee == userID;
          });
          this.setState({
            dataLoading: false,
            filterdAndMyTasksData: myTasksFiltedData,
          });
        }
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      console.log(e);
      this.setState({dataLoading: false});
    }
  }

  onFilterTaskTypeData = (value, index, data) => {
    let issueTypeID = data[index].id;
    let issueTypeName = data[index].value;
    this.setState({filterTaskType: issueTypeName});
    this.fetchDataWithTaskType(issueTypeID);
  };

  onSelectUser = async item => {
    let assignee = item.key;
    this.setState({
      // visiblePeopleModal: false,
      userName: item.label,
      userID: item.key,
      // popupMenuOpen:false
    });
    await this.props.addPeopleModal(false);
    try {
      let selectedProjectID = this.state.selectedProjectID;
      this.setState({dataLoading: true});
      filtedData = await APIServices.filterTaskByUser(
        selectedProjectID,
        assignee,
      );
      if (filtedData.message == 'success') {
        this.setState({
          dataLoading: false,
          filterdAndMyTasksData: filtedData.data,
        });
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      this.setState({dataLoading: false});
    }
  };

  renderFilterType() {
    const {selectedStartDate, selectedEndDate} = this.state;
    let key = this.state.filterType;
    let from = selectedStartDate
      ? moment(this.state.selectedStartDate).format('YYYY/MM/DD')
      : 'From';
    let to = selectedEndDate
      ? moment(this.state.selectedEndDate).format('YYYY/MM/DD')
      : 'To';

    switch (key) {
      case 'Date':
        return (
          <View style={styles.filterTextView}>
            <TouchableOpacity onPress={() => this.onCalendarPress()}>
              <Text style={styles.filterText}>
                {from} to {to}
              </Text>
            </TouchableOpacity>
          </View>
        );
      case 'Assignee':
        return (
          <View style={styles.filterTextView}>
            <PopupMenuAssignee
              projectID={this.state.selectedProjectID}
              onSelect={item => this.onSelectUser(item)}
            />
          </View>
        );
      case 'Task type':
        return (
          <View style={styles.filterTextView}>
            {this.renderFilterTaskType()}
          </View>
        );
      default:
        return <View style={styles.filterTextView} />;
    }
  }

  renderFilterTaskType() {
    let filterTaskType = this.state.filterTaskType;
    return (
      <Dropdown
        label=""
        labelFontSize={0}
        data={issueTypeList}
        textColor={colors.darkBlue}
        error={''}
        animationDuration={0.5}
        containerStyle={{width: '100%'}}
        overlayStyle={{width: '100%'}}
        pickerStyle={styles.filterTaskTypePicker}
        dropdownPosition={0}
        value={filterTaskType}
        itemColor={'black'}
        selectedItemColor={'black'}
        dropdownOffset={{top: 10}}
        baseColor={colors.projectBgColor}
        itemTextStyle={{
          marginLeft: 15,
          fontFamily: 'CircularStd-Book',
        }}
        itemPadding={10}
        onChangeText={this.onFilterTaskTypeData}
      />
    );
  }

  onCalendarPress() {
    this.setState({showPicker: true});
  }

  onCloseModel() {
    this.setState({showPicker: false});
  }

  async onDateSet() {
    let selectedStartDate = moment(this.state.selectedStartDate).format(
      'YYYY-MM-DD',
    );
    let selectedEndDate = moment(this.state.selectedEndDate).format(
      'YYYY-MM-DD',
    );

    this.setState({
      from: selectedStartDate == '' ? 'all' : selectedStartDate,
      to: selectedEndDate == '' ? 'all' : selectedEndDate,
      showPicker: false,
      date: new Date(),
    });

    try {
      let selectedProjectID = this.state.selectedProjectID;
      let index = this.state.index;
      this.setState({dataLoading: true});
      filtedData = await APIServices.filterTaskByDate(
        selectedProjectID,
        selectedStartDate,
        selectedEndDate,
      );
      if (filtedData.message == 'success') {
        if (index == 0) {
          // filter tasks when myTasks selected
          this.setState({
            dataLoading: false,
            filterdAndMyTasksData: filtedData.data,
          });
        } else {
          let myTasksFiltedData = [];
          let userID = await AsyncStorage.getItem('userID');
          myTasksFiltedData = filtedData.data.filter(function(data) {
            return data.taskAssignee == userID;
          });
          this.setState({
            dataLoading: false,
            filterdAndMyTasksData: myTasksFiltedData,
          });
        }
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      this.setState({dataLoading: false});
    }
  }

  getButtonDisabledStaus() {
    if (
      this.state.selectedStartDate == null ||
      this.state.selectedStartDate == '' ||
      this.state.selectedEndDate == null ||
      this.state.selectedEndDate == ''
    ) {
      return true;
    } else {
      return false;
    }
  }

  onCanclePress() {
    this.setState({
      selectedStartDate: this.state.from !== 'all' ? this.state.from : '',
      selectedEndDate: this.state.to !== 'all' ? this.state.to : '',
    });
    this.onCloseModel();
  }

  renderCalender() {
    const {selectedStartDate, selectedEndDate} = this.state;
    const minDate = new Date(); // Today
    const maxDate = new Date(2500, 1, 1);
    const startDate = selectedStartDate
      ? moment(this.state.selectedStartDate).format('Do MMMM YYYY')
      : 'From';
    const endDate = selectedEndDate
      ? moment(this.state.selectedEndDate).format('Do MMMM YYYY')
      : 'To';
    return (
      <Modal
        isVisible={this.state.showPicker}
        style={styles.modalStyle}
        onBackButtonPress={() => this.onCloseModel()}
        onBackdropPress={() => this.onCloseModel()}
        onRequestClose={() => this.onCloseModel()}
        coverScreen={false}
        backdropTransitionOutTiming={0}>
        <View style={styles.modalView}>
          <View>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              // minDate={minDate}
              // maxDate={maxDate}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              width={width - 60}
              previousTitle={
                <Icon name={'arrow-dropleft'} style={styles.iconCalendar} />
              }
              nextTitle={
                <Icon name={'arrow-dropright'} style={styles.iconCalendar} />
              }
              todayBackgroundColor={colors.lightBlue}
              selectedDayColor={colors.selectedRange}
              selectedDayTextColor={colors.white}
              weekdays={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
              textStyle={styles.dateTextStyle}
              dayLabelsWrapper={{
                borderBottomWidth: 0,
                borderTopWidth: 0,
              }}
              dayShape={'square'}
              onDateChange={this.onDateChange}
            />
          </View>
          <View style={styles.selectedDates}>
            <Text>{startDate}</Text>
            <Text style={styles.dashText}> - </Text>
            <Text>{endDate}</Text>
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
                  backgroundColor: this.getButtonDisabledStaus()
                    ? colors.lighterGray
                    : colors.lightGreen,
                },
              ]}
              disabled={this.getButtonDisabledStaus()}
              onPress={() => this.onDateSet()}>
              <Text style={styles.saveTextStyle}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    let index = this.state.index;
    let filterdDataAllTaks = this.state.filterdDataAllTaks;
    let filterdAndMyTasksData = this.state.filterdAndMyTasksData;
    let allTaskByProjectLoading = this.props.allTaskByProjectLoading;
    let myTaskByProjectLoading = this.props.myTaskByProjectLoading;
    let filterType = this.state.filterType;
    let tasksName = this.state.tasksName;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => this.tabOpenTaskTab(payload)}
        />
        {this.state.index !== 2 ? (
          <View>
            <View style={styles.tasksFilterMainView}>
              <Text style={styles.filterByText}>Filter By : </Text>
              <View style={styles.tasksFilerView}>
                <Dropdown
                  // style={{}}
                  label=""
                  labelFontSize={0}
                  data={index == 0 ? dropData : dropDataMyTasks}
                  textColor={colors.darkBlue}
                  error={''}
                  animationDuration={0.5}
                  containerStyle={{width: '100%'}}
                  overlayStyle={{width: '100%'}}
                  pickerStyle={styles.filterMainPicker}
                  dropdownPosition={0}
                  value={filterType}
                  itemColor={'black'}
                  selectedItemColor={'black'}
                  dropdownOffset={{top: 10}}
                  baseColor={colors.lightgray}
                  // renderBase={this.renderBase}
                  // renderAccessory={this.renderBase}
                  itemTextStyle={{
                    marginLeft: 15,
                    fontFamily: 'CircularStd-Book',
                  }}
                  itemPadding={10}
                  onChangeText={value => this.onFilter(value)}
                />
              </View>
            </View>
            {this.state.filter ? (
              <View style={styles.filterMainView}>
                {this.renderFilterType()}
                {/* <View style={styles.filterIconView}>
                    <Image style={styles.filterIcon} source={icons.filterIcon} />
                  </View> */}
              </View>
            ) : this.state.index == 0 ? (
              <View style={[styles.addNewFieldView, {flexDirection: 'row'}]}>
                <Image
                  style={styles.addNewIcon}
                  source={icons.blueAdd}
                  resizeMode={'contain'}
                />
                <TextInput
                  style={[styles.textInput, {width: '95%'}]}
                  placeholder={'Add a main task...'}
                  value={tasksName}
                  maxLength={100}
                  onChangeText={tasksName =>
                    this.onNewTasksNameChange(tasksName)
                  }
                  onSubmitEditing={() =>
                    this.onNewTasksNameSubmit(this.state.tasksName)
                  }
                />
              </View>
            ) : null}

            {/* render all tasks without filters */}
            {index == 0 && !this.state.filter && (
              <FlatList
                style={styles.tasksFlatList}
                data={filterdDataAllTaks}
                renderItem={({item, index}) => this.renderTaskList(item, index)}
                keyExtractor={item => item.parentTask.taskId}
                ListEmptyComponent={<EmptyListView />}
                onEndReached={this.lazyGetAllTaskInProject}
                onEndReachedThreshold={0.7}
                onScroll={this.onMyListScroll.bind(this)}
              />
            )}

            {/* render my tasks and task list when filter*/}
            {(index == 1 || this.state.filter) && (
              <FlatList
                style={[
                  styles.myTasksFlatList,
                  {
                    marginBottom: this.state.filter
                      ? EStyleSheet.value('210rem')
                      : EStyleSheet.value('160rem'),
                  },
                ]}
                data={filterdAndMyTasksData}
                onEndReached={this.lazyGetMyTaskInProject}
                onEndReachedThreshold={0.7}
                onScroll={this.onMyListScroll.bind(this)}
                renderItem={({item, index}) =>
                  this.renderMyTasksAndFilterTaskList(item, index)
                }
                keyExtractor={item => item.taskId}
                ListEmptyComponent={<EmptyListView />}
              />
            )}
          </View>
        ) : (
          <View>
            <AddNewTasksScreen
              navigation={this.props.navigation}
              selectedProjectID={this.state.selectedProjectID}
              onSuccess={text => this.onSuccess(text)}
            />
          </View>
        )}

        {this.renderBottomBar()}
        {this.renderCalender()}
        {allTaskByProjectLoading && <Loader />}
        {myTaskByProjectLoading && <Loader />}
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
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  filterByText: {
    fontSize: '15rem',
    color: colors.gray,
    fontWeight: 'bold',
  },
  tasksFilterMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '20rem',
  },
  tasksFilerView: {
    backgroundColor: colors.lightgray,
    borderRadius: '5rem',
    width: '264rem',
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '10rem',
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
  textMain: {
    fontSize: '11rem',
    color: colors.white,
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  text: {
    fontSize: '9rem',
    color: colors.white,
    lineHeight: '15rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    flex: 0.9,
  },
  subTextMain: {
    fontSize: '11rem',
    color: colors.colorMidnightExpress,
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  parentTextMain: {
    fontSize: '11rem',
    color: colors.colorMidnightExpress,
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    color: colors.white,
  },
  parentTextSub: {
    fontSize: '9rem',
    color: colors.white,
    lineHeight: '15rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
    flex: 0.9,
  },
  subText: {
    fontSize: '9rem',
    color: colors.gray,
    lineHeight: '15rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
    flex: 0.9,
  },
  textDate: {
    fontFamily: 'CircularStd-Book',
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
    width: '35rem',
    height: '35rem',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    height: '80rem',
    width: '100%',
    backgroundColor: colors.projectBgColor,
  },
  bottomBarInnerContainer: {
    flexDirection: 'row',
    height: '80rem',
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
  bottomBarText: {
    marginTop: '10rem',
    fontSize: '11rem',
  },
  horizontalLine: {
    backgroundColor: colors.gray,
    width: 1,
    height: '40rem',
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
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '10rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '15rem',
    height: '57rem',
    marginHorizontal: '20rem',
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
  tasksMainView: {
    flex: 1,
    marginLeft: '10rem',
  },
  tasksHeaderView: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: '5rem',
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
  addSubTaskIcon: {
    width: '20rem',
    height: '20rem',
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
  subTaskTextInput: {
    fontSize: '10rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
  },
  subTasksLabelView: {
    width: '75rem',
    height: '18rem',
    borderRadius: '10rem',
    backgroundColor: colors.lightRed,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subTasksLabelText: {
    fontSize: '8rem',
    color: colors.white,
  },
  tasksFlatList: {
    marginBottom: '230rem',
    marginTop: '0rem',
  },
  myTasksFlatList: {
    marginBottom: '210rem',
    marginTop: '0rem',
  },
  filterMainView: {
    flexDirection: 'row',
    marginHorizontal: '20rem',
    marginBottom: '10rem',
  },
  filterTextView: {
    backgroundColor: colors.projectBgColor,
    flex: 1,
    height: '45rem',
    borderRadius: '5rem',
    justifyContent: 'center',
    paddingLeft: '20rem',
  },
  filterText: {
    color: colors.darkBlue,
  },
  filterIconView: {
    width: '45rem',
    height: '45rem',
    padding: '10rem',
    backgroundColor: colors.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '5rem',
    marginLeft: '10rem',
  },
  filterIcon: {
    width: '20rem',
    height: '20rem',
  },
  dateTextStyle: {
    color: colors.black,
    fontWeight: 'bold',
  },
  selectedDates: {
    flexDirection: 'row',
    marginTop: '0rem',
    height: '45rem',
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '15rem',
  },
  dashText: {
    fontSize: '29rem',
    color: colors.gray,
    marginBottom: '5rem',
  },
  ButtonViewStyle: {
    flexDirection: 'row',
    marginTop: '10rem',
    marginBottom: '15rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '15rem',
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
  },
  saveTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
  },
  modalStyle: {
    // backgroundColor: colors.white,
    // marginVertical: '45rem',
    // borderRadius: '5rem',
  },
  modalView: {
    margin: '10rem',
    backgroundColor: colors.white,
    borderRadius: '5rem',
  },
  parentTaskView: {
    backgroundColor: colors.darkBlue,
    borderRadius: '5rem',
    height: '65rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  childTasksView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    height: '65rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  filterMainPicker: {
    width: '69%',
    marginTop: '58rem',
    marginLeft: '89rem',
  },
  filterTaskTypePicker: {
    width: '89.5%',
    marginTop: '58rem',
    marginLeft: '13rem',
  },
  imageStyle: {
    width: '22rem',
    height: '22rem',
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
});

const mapStateToProps = state => {
  return {
    allTaskByProjectLoading: state.project.allTaskByProjectLoading,
    allTaskByProject: state.project.allTaskByProject,
    myTaskByProjectLoading: state.project.myTaskByProjectLoading,
    myTaskByProject: state.project.myTaskByProject,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(TasksTabScreen);
