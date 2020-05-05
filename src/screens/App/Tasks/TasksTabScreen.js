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

const Placeholder = () => (
  <View style={styles.landing}>
    <SkypeIndicator color={colors.primary} />
  </View>
);

let dropData = [
  {
    id: 'none',
    value: 'None',
  },
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
    id: 'Reopened',
    value: 'Reopened',
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

let dropDataMyTasks = [
  {
    id: 'All',
    value: 'All',
  },
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
    id: 'Reopened',
    value: 'Reopened',
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

let allTasks = {
  "message": "success",
  "data": [
      {
          "parentTask": {
              "taskId": "27193436-39d3-4328-9eef-c2fe87e10019",
              "taskName": "Paten Task 2",
              "projectId": "ba77bb8f-22a7-4b43-85ab-5f55c3d7324d",
              "taskAssignee": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
              "taskInitiator": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
              "taskNote": "dummy",
              "taskStatus": "pending",
              "taskCreatedAt": "2020-05-04T09:39:02.000+0000",
              "taskDueDateAt": "2020-04-02T11:00:00.000+0000",
              "taskReminderAt": "2020-04-04T19:30:00.000+0000",
              "taskAssigneeProfileImage": "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
              "sprintId": "53d6dccf-2f86-4ce5-a583-fa32816a252c",
              "issueType": "development",
              "parentId": "961f6f2a-ebca-4493-b5cf-c29be7abac1f",
              "isParent": true,
              "deleted": false
          },
          "childTasks": []
      },
      {
          "parentTask": {
              "taskId": "65dfd159-cb7b-4add-8f35-51c758994985",
              "taskName": "Time test task 1213",
              "projectId": "ba77bb8f-22a7-4b43-85ab-5f55c3d7324d",
              "taskAssignee": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
              "taskInitiator": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
              "taskNote": "",
              "taskStatus": "closed",
              "taskCreatedAt": "2020-05-04T10:32:00.000+0000",
              "taskDueDateAt": "2020-04-02T22:00:00.000+0000",
              "taskReminderAt": "2024-03-28T12:25:00.000+0000",
              "taskAssigneeProfileImage": "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
              "sprintId": "default",
              "issueType": "development",
              "parentId": null,
              "isParent": true,
              "deleted": false
          },
          "childTasks": [
              {
                  "taskId": "da2d353f-76fa-42d7-a4fd-74734f17fa38",
                  "taskName": "Child 1",
                  "projectId": "ba77bb8f-22a7-4b43-85ab-5f55c3d7324d",
                  "taskAssignee": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                  "taskInitiator": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                  "taskNote": null,
                  "taskStatus": "pending",
                  "taskCreatedAt": "2020-04-30T07:32:53.000+0000",
                  "taskDueDateAt": null,
                  "taskReminderAt": null,
                  "taskAssigneeProfileImage": "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                  "sprintId": "53d6dccf-2f86-4ce5-a583-fa32816a252c",
                  "issueType": "development",
                  "parentId": "65dfd159-cb7b-4add-8f35-51c758994985",
                  "isParent": false,
                  "deleted": false
              }
          ]
      },
      {
          "parentTask": {
              "taskId": "f67c9c7d-5a6d-4e8b-99af-99976b44d610",
              "taskName": "updated 123",
              "projectId": "ba77bb8f-22a7-4b43-85ab-5f55c3d7324d",
              "taskAssignee": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
              "taskInitiator": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
              "taskNote": null,
              "taskStatus": "pending",
              "taskCreatedAt": "2020-05-04T09:45:52.000+0000",
              "taskDueDateAt": "1970-01-01T05:30:00.000+0000",
              "taskReminderAt": "2020-04-30T12:49:00.000+0000",
              "taskAssigneeProfileImage": "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
              "sprintId": "53d6dccf-2f86-4ce5-a583-fa32816a252c",
              "issueType": "qa",
              "parentId": "",
              "isParent": true,
              "deleted": false
          },
          "childTasks": [
              {
                  "taskId": "d918638c-52aa-4e5d-a230-8b7aef9d5f71",
                  "taskName": "Child 2",
                  "projectId": "ba77bb8f-22a7-4b43-85ab-5f55c3d7324d",
                  "taskAssignee": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                  "taskInitiator": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                  "taskNote": null,
                  "taskStatus": "pending",
                  "taskCreatedAt": "2020-05-04T09:38:48.000+0000",
                  "taskDueDateAt": "2020-04-17T13:22:00.000+0000",
                  "taskReminderAt": "2020-04-27T16:45:26.000+0000",
                  "taskAssigneeProfileImage": "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                  "sprintId": "53d6dccf-2f86-4ce5-a583-fa32816a252c",
                  "issueType": "development",
                  "parentId": "f67c9c7d-5a6d-4e8b-99af-99976b44d610",
                  "isParent": false,
                  "deleted": false
              },
              {
                  "taskId": "f76b766a-f57e-46ec-8a4f-3beec1138cea",
                  "taskName": "Child 3",
                  "projectId": "ba77bb8f-22a7-4b43-85ab-5f55c3d7324d",
                  "taskAssignee": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                  "taskInitiator": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                  "taskNote": null,
                  "taskStatus": "pending",
                  "taskCreatedAt": "2020-05-04T06:15:23.000+0000",
                  "taskDueDateAt": null,
                  "taskReminderAt": null,
                  "taskAssigneeProfileImage": "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                  "sprintId": "53d6dccf-2f86-4ce5-a583-fa32816a252c",
                  "issueType": "development",
                  "parentId": "f67c9c7d-5a6d-4e8b-99af-99976b44d610",
                  "isParent": false,
                  "deleted": false
              }
          ]
      },
      {
          "parentTask": {
              "taskId": "hg",
              "taskName": "test",
              "projectId": "ba77bb8f-22a7-4b43-85ab-5f55c3d7324d",
              "taskAssignee": "fbf2e299-ff38-409f-98f3-ca0c70234d36",
              "taskInitiator": "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
              "taskNote": null,
              "taskStatus": "pending",
              "taskCreatedAt": "2020-05-04T10:54:55.000+0000",
              "taskDueDateAt": "2020-04-24T07:49:00.000+0000",
              "taskReminderAt": "2020-04-15T16:45:00.000+0000",
              "taskAssigneeProfileImage": "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1587381571910_Buddhika Priyabhashana.png",
              "sprintId": "default",
              "issueType": "development",
              "parentId": null,
              "isParent": true,
              "deleted": false
          },
          "childTasks": []
      }
  ],
  "status": "OK",
  "timestamp": "Mon May 04 16:26:52 IST 2020"
}

class TasksTabScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterdDataAllTaks: [],
      allDataAllTaks: [],
      filterdDataMyTasks: [],
      allDataMyTasks: [],
      index: 0,
      bottomItemPressColor: colors.darkBlue,
      selectedProjectID: 0,
      isActive: this.props.isActive,
      selectedTypeAllTasks: 'None',
      selectedTypeMyTasks: 'All',
      tasksName: '',
      filter: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      let selectedProjectID = this.props.selectedProjectID;
      this.setState(
        {
          selectedProjectID: selectedProjectID,
        },
        () => {
          this.getAllTaskInProject();
        },
      );
    }

    // all tasks
    if (
      prevProps.allTaskByProjectLoading !==
        this.props.allTaskByProjectLoading &&
      this.props.allTaskByProject &&
      this.props.allTaskByProject.length > 0
    ) {
      let searchValueAllTask = '';
      let filteredDataAllTask = this.props.allTaskByProject.filter(function(
        item,
      ) {
        return item.taskStatus.includes(searchValueAllTask);
      });

      this.setState({
        filterdDataAllTaks: allTasks.data,
        allDataAllTaks: this.props.allTaskByProject,
      });
    }

    if (
      prevProps.allTaskByProjectLoading !==
        this.props.allTaskByProjectLoading &&
      this.props.allTaskByProject &&
      this.props.allTaskByProject.length == 0
    ) {
      this.setState({
        filterdDataAllTaks: allTasks.data,
        allDataAllTaks: this.props.allTaskByProject,
      });
    }

    // my task
    if (
      prevProps.myTaskByProjectLoading !== this.props.myTaskByProjectLoading &&
      this.props.myTaskByProject &&
      this.props.myTaskByProject.length > 0
    ) {
      let searchValueMyTask = '';
      let filteredDataMyTask = this.props.myTaskByProject.filter(function(
        item,
      ) {
        return item.taskStatus.includes(searchValueMyTask);
      });

      this.setState({
        filterdDataMyTasks: filteredDataMyTask,
        allDataMyTasks: this.props.myTaskByProject,
      });
    }

    if (
      prevProps.myTaskByProjectLoading !== this.props.myTaskByProjectLoading &&
      this.props.myTaskByProject &&
      this.props.myTaskByProject.length == 0
    ) {
      this.setState({
        filterdDataMyTasks: this.props.myTaskByProject,
        allDataMyTasks: this.props.myTaskByProject,
      });
    }
  }

  // componentWillReceiveProps(nextProps) {
  //   let selectedProjectID = this.props.selectedProjectID;
  //   if (this.props.isActive !== nextProps.isActive) {
  //     this.setState(
  //       {
  //         selectedProjectID: selectedProjectID,
  //       },
  //       () => {
  //         this.getAllTaskInProject();
  //       },
  //     );
  //   }
  // }

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

  async getAllTaskInProject() {
    this.setState({
      selectedTypeAllTasks: 'None',
    });
    let selectedProjectID = this.state.selectedProjectID;
    AsyncStorage.getItem('userID').then(userID => {
      this.props.getAllTaskInProjects(userID, selectedProjectID);
    });
  }

  async getMyTaskInProject() {
    this.setState({
      selectedTypeMyTasks: 'All',
    });
    let selectedProjectID = this.state.selectedProjectID;
    AsyncStorage.getItem('userID').then(userID => {
      this.props.getMyTaskInProjects(userID, selectedProjectID);
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
      dateText = moment(date).format('YYYY-MM-DD');
      color = '#36DD5B';
    } else if (taskStatus != 'closed' && date) {
      if (moment(date).isAfter(currentTime)) {
        dateText = moment(date).format('YYYY-MM-DD');
        color = '#0C0C5A';
      } else {
        dateText = moment(date).format('YYYY-MM-DD');
        color = '#ff6161';
      }
    } else {
      dateText = 'Add Due Date';
      color = '#000000';
    }

    return <Text style={[styles.textDate, {color: color}]}>{dateText}</Text>;
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

  renderSubTasksList(item) {
    let selectedProjectID = this.state.selectedProjectID;
    console.log("dddddddddddddddddddddd",item);
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('TasksDetailsScreen', {
            taskDetails: item,
            selectedProjectID: selectedProjectID,
            isFromBoards: false,
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
              <Text style={styles.subTextMain}>MRI - #1</Text>
              <Text style={styles.subText}>{item.taskName}</Text>
            </View>
            <View style={styles.subTasksLabelView}>
              <Text style={styles.subTasksLabelText}>Oprational</Text>
            </View>
          </View>
          <View style={styles.statusView}>
            {this.dateView(item)}
            {this.userImage(item)}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderTaskList(item, indexMain) {
    let index = this.state.index;
    let filterdDataAllTaks = this.state.filterdDataAllTaks;
    let filterdDataMyTasks = this.state.filterdDataMyTasks;
    let selectedProjectID = this.state.selectedProjectID;
    let tasksName = this.state.tasksName;
    console.log("vvvvvvvvvvvvv",item)
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('TasksDetailsScreen', {
              taskDetails: item,
              selectedProjectID: selectedProjectID,
              isFromBoards: false,
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
                <Text style={styles.textMain}>{item.parentTask.taskName}</Text>
                <Text style={styles.text}>{item.parentTask.taskName}</Text>
              </View>
              <View style={styles.tasksLabelView}>
                <Text style={styles.tasksLabelText}>{item.parentTask.issueType}</Text>
              </View>
            </View>
            <View style={styles.statusView}>
              {this.dateView(item)}
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
                resizeMode={'center'}
              />
              <TextInput
                style={[styles.subTaskTextInput, {width: '95%'}]}
                placeholder={'Add a subtask...'}
                placeholderTextColor={colors.white}
                value={tasksName}
                onChangeText={tasksName => this.onNewTasksNameChange(tasksName)}
                onSubmitEditing={() =>
                  this.onNewTasksNameSubmit(this.state.tasksName)
                }
              />
            </View>
            <FlatList
              style={{
                marginBottom: EStyleSheet.value('15rem'),
              }}
              data={index == 0 ? item.childTasks : filterdDataMyTasks}
              renderItem={({item}) => this.renderSubTasksList(item)}
              keyExtractor={item => item.taskId}
            />
          </View>
        ) : null}
      </View>
    );
  }

  renderBase() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Image style={styles.dropIcon} source={icons.arrowDark} />
      </View>
    );
  }

  onBottomItemPress(index) {
    // let color;
    this.setState({index: index});
    switch (index) {
      case 0:
        // All tasks
        this.getAllTaskInProject();
        break;
      case 1:
        // my tasks
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
                    style={{
                      marginTop: 10,
                      fontSize: 12,
                      color:
                        index == this.state.index
                          ? colors.white
                          : item.bottomBarColor,
                    }}>
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

  onFilterAllTasks(key) {
    let value = key;
    let searchValue = '';
    let index = this.state.index;
    switch (value) {
      case 'None':
        searchValue = '';
        break;
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
      case 'Reopened':
        searchValue = 'reOpened';
        break;
      case 'Deployed':
        searchValue = 'deployed';
        break;
      case 'Closed':
        searchValue = 'closed';
        break;
      case 'Open':
        searchValue = 'open';
        break;
    }

    if (searchValue != '') {
      this.setState({filter: true});
    } else {
      this.setState({filter: false});
    }

    let filteredData = this.state.allDataAllTaks.filter(function(item) {
      return item.taskStatus.includes(searchValue);
    });
    this.setState({
      filterdDataAllTaks: filteredData,
      selectedTypeAllTasks: key,
    });
  }

  onFilterMyTasks(key) {
    let value = key;
    let searchValue = '';
    let index = this.state.index;
    switch (value) {
      case 'All':
        searchValue = '';
        break;
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
      case 'Reopened':
        searchValue = 'reOpened';
        break;
      case 'Deployed':
        searchValue = 'deployed';
        break;
      case 'Closed':
        searchValue = 'closed';
        break;
      case 'Open':
        searchValue = 'open';
        break;
    }
    let filteredData = this.state.allDataMyTasks.filter(function(item) {
      return item.taskStatus.includes(searchValue);
    });
    this.setState({
      filterdDataMyTasks: filteredData,
      selectedTypeMyTasks: key,
    });
  }

  async tabOpenTaskTab() {
    let selectedProjectID = this.props.selectedProjectID;
    this.setState(
      {
        selectedProjectID: selectedProjectID,
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

  onNewTasksNameChange(text) {
    this.setState({tasksName: text});
  }

  async onNewTasksNameSubmit(text) {
    try {
      let tasksName = this.state.tasksName;
      this.setState({dataLoading: true});
      newTaskData = await APIServices.addTaskData(tasksName);
      if (newTaskData.message == 'success') {
        this.setState({dataLoading: false, tasksName: ''});
        this.fetchData();
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      this.setState({dataLoading: false});
    }
  }

  render() {
    let index = this.state.index;
    let filterdDataAllTaks = this.state.filterdDataAllTaks;
    let filterdDataMyTasks = this.state.filterdDataMyTasks;
    let allTaskByProjectLoading = this.props.allTaskByProjectLoading;
    let myTaskByProjectLoading = this.props.myTaskByProjectLoading;
    let selectedTypeAllTasks = this.state.selectedTypeAllTasks;
    let selectedTypeMyTasks = this.state.selectedTypeMyTasks;
    let tasksName = this.state.tasksName;

    return (
      <View style={styles.backgroundImage}>
        <NavigationEvents
          onWillFocus={payload => this.tabOpenTaskTab(payload)}
        />
        {this.state.index !== 2 ? (
          <View>
            {index == 0 ? (
              <View style={styles.tasksFilterMainView}>
                <Text style={styles.filterByText}>Filter By : </Text>
                <View style={styles.tasksFilerView}>
                  <Dropdown
                    // style={{}}
                    label=""
                    labelFontSize={0}
                    data={dropData}
                    textColor={colors.darkBlue}
                    error={''}
                    animationDuration={0.5}
                    containerStyle={{width: '100%'}}
                    overlayStyle={{width: '100%'}}
                    pickerStyle={{
                      width: '69%',
                      marginTop: 65,
                      marginLeft: 97,
                    }}
                    dropdownPosition={0}
                    value={selectedTypeAllTasks}
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
                    onChangeText={value => this.onFilterAllTasks(value)}
                  />
                </View>
              </View>
            ) : null}

            {index == 1 ? (
              <View style={styles.projectFilerView}>
                <Dropdown
                  // style={{}}
                  label=""
                  labelFontSize={0}
                  data={dropDataMyTasks}
                  textColor={colors.dropDownText}
                  error={''}
                  animationDuration={0.5}
                  containerStyle={{width: '100%'}}
                  overlayStyle={{width: '100%'}}
                  pickerStyle={{width: '89%', marginTop: 70, marginLeft: 15}}
                  dropdownPosition={0}
                  value={selectedTypeMyTasks}
                  itemColor={'black'}
                  selectedItemColor={'black'}
                  dropdownOffset={{top: 10}}
                  baseColor={colors.projectBgColor}
                  // renderBase={this.renderBase}
                  renderAccessory={this.renderBase}
                  itemTextStyle={{
                    marginLeft: 15,
                    fontFamily: 'CircularStd-Book',
                  }}
                  itemPadding={10}
                  onChangeText={value => this.onFilterMyTasks(value)}
                />
              </View>
            ) : null}
            {this.state.filter ? (
              <View style={styles.filterMainView}>
                <View style={styles.filterTextView}>
                  <Text style={styles.filterText}>aaaa</Text>
                </View>
                <View
                  style={styles.filterIconView}>
                  <Image
                    style={styles.filterIcon}
                    source={icons.filterIcon}
                  />
                </View>
              </View>
            ) : (
              <View style={[styles.addNewFieldView, {flexDirection: 'row'}]}>
                <Image
                  style={styles.addNewIcon}
                  source={icons.blueAdd}
                  resizeMode={'center'}
                />
                <TextInput
                  style={[styles.textInput, {width: '95%'}]}
                  placeholder={'Add a main task...'}
                  value={tasksName}
                  onChangeText={tasksName =>
                    this.onNewTasksNameChange(tasksName)
                  }
                  onSubmitEditing={() =>
                    this.onNewTasksNameSubmit(this.state.tasksName)
                  }
                />
              </View>
            )}
            <FlatList
              style={styles.tasksFlatList}
              data={index == 0 ? filterdDataAllTaks : filterdDataMyTasks}
              renderItem={({item, index}) => this.renderTaskList(item, index)}
              keyExtractor={item => item.parentTask.taskId}
            />
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
        {allTaskByProjectLoading && <Loader />}
        {myTaskByProjectLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
    // backgroundColor: colors.pageBackGroundColor,
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
  filterByText: {
    fontSize: 16,
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
    borderRadius: 5,
    width: '264rem',
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '10rem',
  },
  textFilter: {
    fontSize: '14rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
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
    // lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  text: {
    fontSize: '9rem',
    color: colors.white,
    // lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  subTextMain: {
    fontSize: '11rem',
    color: colors.black,
    fontWeight: 'bold',
    // lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  subText: {
    fontSize: '9rem',
    color: colors.gray,
    // lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
  },
  textDate: {
    fontFamily: 'Circular Std Book',
    fontSize: '9rem',
    fontWeight: '400',
    // textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    marginRight: '5rem',
  },
  avatarIcon: {
    width: '20rem',
    height: '20rem',
    marginLeft: '10rem',
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
    width: '35rem',
    height: '35rem',
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
    fontFamily: 'Circular Std Medium',
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
    marginBottom: 5,
  },
  tasksLabelView: {
    width: '75rem',
    height: '18rem',
    borderRadius: '10rem',
    backgroundColor: colors.lightRed,
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
    fontFamily: 'Circular Std Medium',
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
    marginBottom: '220rem',
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
  filterIconView:{
    width: '45rem',
    height: '45rem',
    padding: '10rem',
    backgroundColor: colors.darkBlue,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '5rem',
    marginLeft: '10rem',
  },
  filterIcon:{
    width: '20rem',
    height: '20rem',
  }
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
