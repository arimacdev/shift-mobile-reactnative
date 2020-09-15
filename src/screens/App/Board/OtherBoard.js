import React, {Component} from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import APIServices from '../../../services/APIServices';
import EStyleSheet from 'react-native-extended-stylesheet';
import FadeIn from 'react-native-fade-in-image';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {NavigationEvents} from 'react-navigation';
import Loader from '../../../components/Loader';
import moment from 'moment';
import PopupMenuNormal from '../../../components/PopupMenuNormal';
import Triangle from 'react-native-triangle';
import EmptyListView from '../../../components/EmptyListView';
import Toast from 'react-native-simple-toast';

const menuItems = [
  {value: 0, text: 'Edit Board Names'},
  // {value: 1, text: 'Delete Board'}, comment according to the #390 issue
];

class OtherBoard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoading: false,
      sprints: [],
      listStartIndex: 0,
      listEndIndex: 10,
      cachecdData: [],
      cachecdMyListData: [],
      listScrolled: false,
      dalaLength: 0,
    };
    this.lazyFetchData = this.lazyFetchData.bind(this);
    this.onMyListScroll = this.onMyListScroll.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  async componentDidMount() {
    this.getAllTaskDataInProject();
  }

  async getAllTaskDataInProject() {
    let startIndex = 0;
    let endIndex = 10;
    let allTasks = false;
    this.getAllTaskInDefaultBoardDataDirectly(startIndex, endIndex, allTasks);
  }

  getAllTaskInDefaultBoardDataDirectly = async (
    startIndex,
    endIndex,
    allTasks,
  ) => {
    let selectedProjectID = this.props.selectedProjectID;
    try {
      this.setState({dataLoading: true});
      let taskData = await APIServices.getAllTaskInDefaultBoardData(
        selectedProjectID,
        startIndex,
        endIndex,
        allTasks,
      );
      if (taskData.message == 'success') {
        let dataArray = [];
        let cachedDataArray = [];
        for (let i = 0; i < taskData.data.length; i++) {
          let parentTask = taskData.data[i].parentTask;
          let childTasks = taskData.data[i].childTasks;
          dataArray.push(parentTask);
          cachedDataArray.push(parentTask);
          for (let j = 0; j < childTasks.length; j++) {
            let childTasksItem = childTasks[j];
            dataArray.push(childTasksItem);
          }
        }
        this.getAllSprintInProject(dataArray);
        this.setState({
          tasks: this.state.tasks.concat(dataArray),
          cachecdMyListData: cachedDataArray,
          dataLoading: false,
          dalaLength: taskData.data.length,
        });
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  };

  onMyListScroll(event) {
    this.setState({listScrolled: true});
  }

  async lazyFetchData() {
    if (this.state.dalaLength == 10 && this.state.listScrolled == true) {
      let listStartIndex = this.state.listStartIndex + 10;
      let listEndIndex = this.state.listEndIndex + 10;
      let allTasks = false;
      await this.getAllTaskInDefaultBoardDataDirectly(
        listStartIndex,
        listEndIndex,
        allTasks,
      );
      this.setState({
        listStartIndex: listStartIndex,
        listEndIndex: listEndIndex,
      });
    } else {
      Toast.show('All comments are loadded', Toast.SHORT, [
        'RCTModalHostViewController',
        'UIAlertController',
      ]);
    }
  }

  async getAllSprintInProject(taskData) {
    let selectedProjectID = this.props.selectedProjectID;
    try {
      this.setState({dataLoading: true});
      let sprintData = await APIServices.getAllSprintInProject(
        selectedProjectID,
      );
      if (sprintData.message == 'success') {
        let sprintsArray = [];
        for (let i = 0; i < sprintData.data.length; i++) {
          let sprintObj = sprintData.data[i];
          let sprintID = sprintObj.sprintId;
          let taskArray = [];
          taskArray = taskData.filter(function(obj) {
            return obj.sprintId == sprintID;
          });
          sprintObj.tasks = taskArray;
          sprintsArray.push(sprintObj);
        }
        this.setState({dataLoading: false, sprints: sprintsArray});
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  deleteBoard() {
    //code hear
  }

  onMenuItemChange(item, data) {
    switch (item.value) {
      case 0:
        this.goToEditSprint(data);
        break;
      case 1:
        this.deleteBoard(data);
        break;
      default:
        break;
    }
  }

  renderItemMainTile(data) {
    return (
      <View style={{flex: 1}}>
        <View style={styles.item}>
          <View style={styles.title_container}>
            <View style={styles.title_sub_container}>
              <Text style={styles.title}>{data.item.sprintName}</Text>
              <Text style={styles.sub_txt}>{data.item.sprintDescription}</Text>
            </View>
            <View style={{alignSelf: 'flex-start'}}>
              <PopupMenuNormal
                data={menuItems}
                onChange={item => this.onMenuItemChange(item, data)}
              />
            </View>
          </View>

          <View style={styles.sub_scrollView}>
            <FlatList
              data={data.item.tasks}
              renderItem={this.renderItemSubTile.bind(this)}
              keyExtractor={item => item.id}
              ListEmptyComponent={<EmptyListView />}
            />
          </View>
        </View>
      </View>
    );
  }

  renderItemSubTile(data) {
    let selectedProjectID = this.props.selectedProjectID;
    let selectedProjectName = this.props.selectedProjectName;
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('TasksDetailsScreen', {
              taskId: data.item.taskId,
              id: selectedProjectID,
              name: selectedProjectName,
            })
          }>
          <View style={styles.sub_item}>
            <View style={{flex: 1, marginRight: EStyleSheet.value('5rem')}}>
              {this.userIcon(data.item)}
            </View>
            <View style={{flex: 6}}>
              <View style={{flex: 1}}>
                <Text numberOfLines={1} style={styles.text}>
                  {data.item.taskName}
                </Text>
                {this.dateView(data)}
              </View>
            </View>
            <View style={{flex: 1}}>{this.userImage(data.item)}</View>
            {data.item.isParent && (
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
        </TouchableOpacity>
      </View>
    );
  }

  dateView = function(item) {
    let date = item.item.taskDueDateAt;
    let currentTime = moment().format();
    let dateText = '';
    let color = '';

    let taskStatus = item.item.taskStatus;
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
    return <Text style={[styles.subText, {color: color}]}>{dateText}</Text>;
  };

  userImage = function(item) {
    let userImage = item.taskAssigneeProfileImage;
    if (userImage) {
      return (
        <FadeIn>
          <Image source={{uri: userImage}} style={styles.userImageStyle} />
        </FadeIn>
      );
    } else {
      return <Image style={styles.userImageStyle} source={icons.defultUser} />;
    }
  };

  userIcon = function(item) {
    if (item.taskStatus == 'closed') {
      return <Image source={icons.rightCircule} style={styles.userIconStyle} />;
    } else {
      return <Image source={icons.circuleGray} style={styles.userIconStyle} />;
    }
  };

  goToAddSprint() {
    let selectedProjectID = this.props.selectedProjectID;
    this.props.navigation.navigate('AddEditSprint', {
      item: {},
      projectID: selectedProjectID,
      screenType: 'add',
    });
  }

  goToEditSprint(item) {
    let selectedProjectID = this.props.selectedProjectID;
    this.props.navigation.navigate('AddEditSprint', {
      item: item.item,
      projectID: selectedProjectID,
      screenType: 'edit',
    });
  }

  loadBords() {
    this.getAllTaskDataInProject();
  }

  render() {
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={payload => this.loadBords(payload)} />
        <TouchableOpacity onPress={() => this.goToAddSprint()}>
          <View style={styles.button}>
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>New Sprint</Text>
            </View>

            <Image
              style={[styles.addIcon, {marginRight: 10}]}
              source={icons.addGreen}
              resizeMode={'contain'}
            />
          </View>
        </TouchableOpacity>
        {this.state.sprints.length > 0 ? (
          <FlatList
            data={this.state.sprints}
            horizontal={true}
            renderItem={this.renderItemMainTile.bind(this)}
            keyExtractor={item => item.id}
          />
        ) : (
          <EmptyListView />
        )}
        {this.state.dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    borderRadius: '5rem',
    marginTop: '17rem',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '12rem',
    marginRight: '30rem',
  },
  buttonText: {
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    fontWeight: 'bold',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
  },
  userIcon: {
    width: '45rem',
    height: '45rem',
  },
  text: {
    fontSize: '12rem',
    color: colors.userListUserNameColor,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '600',
  },
  subText: {
    fontSize: '10rem',
    color: colors.colorSilver,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  item: {
    width: '340rem',
    marginHorizontal: '5rem',
    alignItems: 'center',
    marginLeft: '10rem',
    marginTop: '20rem',
  },
  sub_item: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.white,
    height: '85rem',
    marginVertical: '7rem',
    padding: '5rem',
    marginLeft: '10rem',
    marginRight: '10rem',
    borderRadius: '5rem',
  },
  title: {
    marginTop: '10rem',
    fontFamily: 'CircularStd-Medium',
    fontWeight: '400',
    color: colors.white,
  },
  sub_txt: {
    fontFamily: 'CircularStd-Medium',
    fontWeight: '400',
    marginBottom: '10rem',
    color: colors.white,
  },
  title_container: {
    backgroundColor: colors.colorDeepSkyBlue,
    width: '100%',
    alignItems: 'center',
    borderTopLeftRadius: '5rem',
    borderTopRightRadius: '5rem',
    flexDirection: 'row',
  },
  title_sub_container: {
    flex: 1,
    alignItems: 'center',
  },
  sub_scrollView: {
    height: Platform.OS == 'ios' ? '70%' : '80%',
    width: '100%',
    marginBottom: '15rem',
    backgroundColor: colors.projectBgColor,
  },
  triangleShape: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  userImageStyle: {
    width: '22rem',
    height: '24rem',
    borderRadius: 50 / 2,
    top: '50rem',
    left: '4rem',
  },
  userIconStyle: {
    width: '40rem',
    height: '40rem',
    borderRadius: 80 / 2,
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(OtherBoard);
