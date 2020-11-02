import React, {Component} from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import APIServices from '../../../services/APIServices';
import EStyleSheet from 'react-native-extended-stylesheet';
import FadeIn from 'react-native-fade-in-image';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Loader from '../../../components/Loader';
import moment from 'moment';
import {NavigationEvents} from 'react-navigation';
import Triangle from 'react-native-triangle';
import EmptyListView from '../../../components/EmptyListView';
import icons from '../../../asserts/icons/icons';
import Utils from '../../../utils/Utils';

class DefaultBoard extends Component {
  constructor(props) {
    super(props);
    this.lazyFetchData = this.lazyFetchData.bind(this);
    this.onMyListScroll = this.onMyListScroll.bind(this);
    this.state = {
      tasks: [],
      dataLoading: false,
      selectedProjectID: 0,
      listStartIndex: 0,
      listEndIndex: 10,
      cachecdData: [],
      cachecdMyListData: [],
      listScrolled: false,
      dalaLength: 0,
    };
  }

  async componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      this.fetchData();
    }
  }

  async fetchData() {
    let startIndex = 0;
    let endIndex = 10;
    let allTasks = true;
    await this.getAllTaskInDefaultBoardDataDirectly(
      startIndex,
      endIndex,
      allTasks,
    );
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
    }
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
          if (parentTask.sprintId == 'default') {
            dataArray.push(parentTask);
            cachedDataArray.push(parentTask);
          }
          for (let j = 0; j < childTasks.length; j++) {
            let childTasksItem = childTasks[j];
            if (childTasksItem.sprintId == 'default') {
              dataArray.push(childTasksItem);
            }
          }
        }
        this.setState(
          {
            tasks: this.state.tasks.concat(dataArray),
            cachecdMyListData: cachedDataArray,
            dalaLength: taskData.data.length,
            dataLoading: false,
          },
          () => {},
        );
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
      Utils.showAlert(true, '', error.data.message, this.props);
    }
  };

  onMyListScroll(event) {
    this.setState({listScrolled: true});
  }

  renderTaskList(item) {
    let selectedProjectID = this.props.selectedProjectID;
    let selectedProjectName = this.props.selectedProjectName;
    return (
      <TouchableOpacity
        style={styles.mainContainer}
        onPress={() =>
          this.props.navigation.navigate('TasksDetailsScreen', {
            taskId: item.taskId,
            id: selectedProjectID,
            name: selectedProjectName,
          })
        }>
        <View style={styles.userView}>
          {this.userIcon(item)}
          <View style={{flex: 1, bottom: 15}}>
            <Text numberOfLines={1} style={styles.text}>
              {item.taskName}
            </Text>
            {this.dateView(item)}
          </View>
          {this.userImage(item)}
          {item.isParent && (
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
    );
  }

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

    return <Text style={[styles.subText, {color: color}]}>{dateText}</Text>;
  };

  loadDefulatBords() {
    this.fetchData();
  }

  render() {
    let dataLoading = this.state.dataLoading;
    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={payload => this.loadDefulatBords(payload)}
        />
        {this.state.tasks.length > 0 ? (
          <View style={styles.subContainer}>
            <FlatList
              style={styles.flalList}
              data={this.state.tasks}
              renderItem={({item}) => this.renderTaskList(item)}
              keyExtractor={item => item.projId}
              onEndReached={this.lazyFetchData}
              onEndReachedThreshold={0.7}
              onScroll={this.onMyListScroll}
            />
          </View>
        ) : (
          <EmptyListView />
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
  subContainer: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginHorizontal: '20rem',
    marginTop: '5rem',
    marginBottom: '10rem',
  },
  flalList: {
    marginTop: '10rem',
    marginBottom: '5rem',
  },
  mainContainer: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginHorizontal: '8rem',
    marginBottom: '8rem',
  },
  userView: {
    backgroundColor: 'white',
    borderRadius: '5rem',
    height: '80rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
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
    color: colors.textPlaceHolderColor,
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
  userImageStyle: {
    width: '22rem',
    height: '22rem',
    borderRadius: 60 / 2,
    top: '20rem',
  },
  userIconStyle: {
    width: '40rem',
    height: '40rem',
    borderRadius: 80 / 2,
    bottom: '15rem',
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(DefaultBoard);
