import React, {Component} from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
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
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  async componentDidMount() {
    this.getAllTaskDataInProject();
  }

  async getAllTaskDataInProject() {
    let selectedProjectID = this.props.selectedProjectID;
    this.setState({dataLoading: true});
    let taskData = await APIServices.getAllTaskInDefaultBoardData(
      selectedProjectID,
    );
    if (taskData.message == 'success') {
      this.setState({dataLoading: false});
      let dataArray = [];
      for (let i = 0; i < taskData.data.length; i++) {
        let parentTask = taskData.data[i].parentTask;
        let childTasks = taskData.data[i].childTasks;
        dataArray.push(parentTask);
        for (let j = 0; j < childTasks.length; j++) {
          let childTasksItem = childTasks[j];
          dataArray.push(childTasksItem);
        }
      }
      this.getAllSprintInProject(dataArray);
    } else {
      this.setState({dataLoading: false});
    }
  }

  async getAllSprintInProject(taskData) {
    let selectedProjectID = this.props.selectedProjectID;
    this.setState({dataLoading: true});
    let sprintData = await APIServices.getAllSprintInProject(selectedProjectID);
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
                // customStyle={styles.menuItems}
                data={menuItems}
                onChange={item => this.onMenuItemChange(item, data)}
              />
            </View>
          </View>

          <ScrollView style={styles.sub_scrollView}>
            <FlatList
              data={data.item.tasks}
              renderItem={this.renderItemSubTile.bind(this)}
              keyExtractor={item => item.id}
              // ListEmptyComponent={<EmptyListView />}
            />
          </ScrollView>
        </View>
      </View>
    );
  }

  renderItemSubTile(data) {
    return (
      <View style={{flex: 1}}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate('TasksDetailsScreen', {
              taskDetails: data.item,
              selectedProjectID: this.props.selectedProjectID,
              isFromBoards: true,
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
                  color={'#0bafff'}
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
          <Image
            source={{uri: userImage}}
            style={{
              width: 24,
              height: 24,
              borderRadius: 24 / 2,
              top: EStyleSheet.value('50rem'),
              left: 4,
            }}
          />
        </FadeIn>
      );
    } else {
      return (
        <Image
          style={{
            width: 24,
            height: 24,
            borderRadius: 24 / 2,
            top: EStyleSheet.value('50rem'),
            left: 4,
          }}
          source={require('../../../asserts/img/defult_user.png')}
        />
      );
    }
  };

  userIcon = function(item) {
    if (item.taskStatus == 'closed') {
      return (
        <FadeIn>
          <Image
            source={require('../../../assest/icons/task_complete.png')}
            style={{width: 40, height: 40, borderRadius: 40 / 2}}
          />
        </FadeIn>
      );
    } else {
      return (
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 40 / 2,
            backgroundColor: '#edf0f5',
          }}
        />
      );
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
      <View>
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

        <FlatList
          data={this.state.sprints}
          horizontal={true}
          renderItem={this.renderItemMainTile.bind(this)}
          keyExtractor={item => item.id}
          style={{
            marginBottom:
              Platform.OS == 'ios'
                ? EStyleSheet.value('25rem')
                : EStyleSheet.value('260rem'),
          }}
          // ListEmptyComponent={<EmptyListView />}
        />
        {this.state.dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightGreen,
    borderRadius: 5,
    marginTop: '17rem',
    flexDirection: 'row',
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
  subContainer: {
    marginBottom: '65rem',
  },
  flalList: {
    marginTop: '30rem',
    marginBottom: '10rem',
  },
  mainContainer: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginHorizontal: '20rem',
    marginVertical: '7rem',
  },
  userView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    height: '60rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
  },
  userIcon: {
    width: '45rem',
    height: '45rem',
  },
  text: {
    fontSize: '12rem',
    color: colors.userListUserNameColor,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '600',
  },
  subText: {
    fontSize: '10rem',
    color: '#b9b9b9',
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  item: {
    width: '340rem',
    marginHorizontal: 5,
    alignItems: 'center',
    marginLeft: '10rem',
    marginTop: '20rem',
  },
  sub_item: {
    width: '280rem',
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    height: '85rem',
    marginVertical: 7,
    padding: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  title: {
    marginTop: '10rem',
    fontFamily: 'CircularStd-Medium',
    fontWeight: '400',
    color: '#ffffff',
  },
  sub_txt: {
    fontFamily: 'CircularStd-Medium',
    fontWeight: '400',
    marginBottom: '10rem',
    color: '#ffffff',
  },
  title_container: {
    backgroundColor: '#0bafff',
    width: '100%',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    flexDirection: 'row',
  },
  title_sub_container: {
    flex: 1,
    // width: '100%',
    alignItems: 'center',
  },
  moreIcon: {
    width: '20rem',
    height: '20rem',
  },
  sub_scrollView: {
    height: '70%',
    backgroundColor: '#edf0f5',
  },
  userView: {
    backgroundColor: 'white',
    borderRadius: 5,
    height: '80rem',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
  },
  text: {
    fontSize: '12rem',
    color: colors.userListUserNameColor,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '600',
  },
  subText: {
    fontSize: '10rem',
    color: '#b9b9b9',
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  triangleShape: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(OtherBoard);
