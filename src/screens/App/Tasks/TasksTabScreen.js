import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
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
      selectedTypeAllTasks: 'All',
      selectedTypeMyTasks: 'All',
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
        filterdDataAllTaks: filteredDataAllTask,
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
        filterdDataAllTaks: this.props.allTaskByProject,
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
      selectedTypeAllTasks: 'All',
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

  renderProjectList(item) {
    let selectedProjectID = this.state.selectedProjectID;
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('TasksDetailsScreen', {
            taskDetails: item,
            selectedProjectID: selectedProjectID,
            isFromBoards: false
          })
        }>
        <View style={styles.projectView}>
          <Image
            style={styles.completionIcon}
            source={
              item.taskStatus == 'closed'
                ? icons.rightCircule
                : icons.whiteCircule
            }
          />
          <View style={{flex: 1}}>
            <Text style={styles.text}>{item.taskName}</Text>
          </View>
          <View style={styles.statusView}>
            {this.dateView(item)}
            {this.userImage(item)}
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
      case 'Open' : 
          searchValue = 'open';  
        break;
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
      case 'Open' : 
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

  onSuccess(text){
    this.setState({index: 0});
    this.getAllTaskInProject();
  }

  render() {
    let index = this.state.index;
    let filterdDataAllTaks = this.state.filterdDataAllTaks;
    let filterdDataMyTasks = this.state.filterdDataMyTasks;
    let allTaskByProjectLoading = this.props.allTaskByProjectLoading;
    let myTaskByProjectLoading = this.props.myTaskByProjectLoading;
    let selectedTypeAllTasks = this.state.selectedTypeAllTasks;
    let selectedTypeMyTasks = this.state.selectedTypeMyTasks;

    return (
      <View style={styles.backgroundImage}>
        <NavigationEvents
          onWillFocus={payload => this.tabOpenTaskTab(payload)}
        />
        {this.state.index !== 2 ? (
          <View>
            <View style={styles.projectFilerView}>
              {index == 0 ? (
                <Dropdown
                  // style={{}}
                  label=""
                  labelFontSize={0}
                  data={dropData}
                  textColor={colors.dropDownText}
                  error={''}
                  animationDuration={0.5}
                  containerStyle={{width: '100%'}}
                  overlayStyle={{width: '100%'}}
                  pickerStyle={{width: '89%', marginTop: 70, marginLeft: 15}}
                  dropdownPosition={0}
                  value={selectedTypeAllTasks}
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
                  onChangeText={value => this.onFilterAllTasks(value)}
                />
              ) : (
                <Dropdown
                  // style={{}}
                  label=""
                  labelFontSize={0}
                  data={dropData}
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
              )}
            </View>
            <FlatList
              style={{marginBottom: EStyleSheet.value('160rem')}}
              data={index == 0 ? filterdDataAllTaks : filterdDataMyTasks}
              renderItem={({item}) => this.renderProjectList(item)}
              keyExtractor={item => item.taskId}
            />
          </View>
        ) : (
          <View>
            <AddNewTasksScreen
              navigation={this.props.navigation}
              selectedProjectID={this.state.selectedProjectID}
              onSuccess={(text)=>this.onSuccess(text)}
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
  textFilter: {
    fontSize: '14rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
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
