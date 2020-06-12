import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import NavigationService from '../../../services/NavigationService';
import APIServices from '../../../services/APIServices';
import EStyleSheet from 'react-native-extended-stylesheet';
import FadeIn from 'react-native-fade-in-image';
import * as Progress from 'react-native-progress';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import {NavigationEvents} from 'react-navigation';
const initialLayout = {width: entireScreenWidth};

class PeopleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: [],
      users: [],
      dataLoading: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      this.fetchData();
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    let selectedTaskGroupId = this.props.selectedTaskGroupId;
    this.setState({dataLoading: true});
    taskPeopleData = await APIServices.getTaskPeopleData(selectedTaskGroupId);
    if (taskPeopleData.message == 'success') {
      let ownerArray = [];
      let usersArray = [];
      ownerArray = taskPeopleData.data.filter(function(obj) {
        return obj.taskGroupRole == 1;
      });
      usersArray = taskPeopleData.data.filter(function(obj) {
        return obj.taskGroupRole == 2;
      });

      this.setState({
        owner: ownerArray,
        users: usersArray,
        dataLoading: false,
      });
    } else {
      this.setState({dataLoading: false});
    }
  }

  async tabOpen() {
    this.fetchData();
  }

  goToAddPeople = () => {
    NavigationService.navigate('AddPeopleGroupTaskScreen', {
      taskItem: this.props.selectedTaskGroupId,
    });
  };

  userIcon = function(item) {
    let userImage = item.assigneeProfileImage;
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

  renderPeopleList(item) {
    let progress = 0;
    if (item.totalTasks > 0) {
      progress = item.tasksCompleted / item.totalTasks;
    }
    return (
      <TouchableOpacity style={styles.mainContainer}>
        <View style={styles.userView}>
          {this.userIcon(item)}
          <View style={{flex: 1}}>
            <Text style={styles.subTextName}>
              {item.assigneeFirstName + ' ' + item.assigneeLastName}
            </Text>
          </View>
          {/*do not remove. this for further implementation*/}
          {/* <View style={styles.controlView}>
            <TouchableOpacity style={{marginLeft: EStyleSheet.value('24rem')}}>
              <Image style={styles.deleteIcon} source={icons.deleteRoundRed} />
            </TouchableOpacity>
          </View> */}
        </View>
        <Text style={styles.subText}>
          {item.tasksCompleted + ' / ' + item.totalTasks + ' Tasks Completed'}
        </Text>
        <View style={styles.progressBarContainer}>
          <Progress.Bar
            progress={progress}
            width={null}
            animated={true}
            color={colors.lightGreen}
            unfilledColor={colors.lightRed}
            borderWidth={0}
            height={14}
            borderRadius={10}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    let dataLoading = this.state.dataLoading;
    let owner = this.state.owner;
    let users = this.state.users;
    return (
      <View>
        <NavigationEvents onWillFocus={payload => this.tabOpen(payload)} />
        <TouchableOpacity onPress={() => this.goToAddPeople()}>
          <View style={styles.button}>
            <Image
              style={[styles.bottomBarIcon, {marginRight: 15, marginLeft: 10}]}
              source={icons.userWhite}
              resizeMode={'contain'}
            />
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>Add new</Text>
            </View>

            <Image
              style={[styles.addIcon, {marginRight: 10}]}
              source={icons.add}
              resizeMode={'contain'}
            />
          </View>
        </TouchableOpacity>

        <ScrollView style={styles.subContainer}>
          <Text style={styles.subTitle}>Group owner</Text>
          <FlatList
            style={styles.flalList}
            data={this.state.owner}
            renderItem={({item}) => this.renderPeopleList(item)}
            keyExtractor={item => item.projId}
            // onRefresh={() => this.onRefresh()}
            // refreshing={isFetching}
          />
          <Text style={styles.subTitle}>Group members</Text>
          <FlatList
            style={styles.flalList}
            data={this.state.users}
            renderItem={({item}) => this.renderPeopleList(item)}
            keyExtractor={item => item.projId}
            // onRefresh={() => this.onRefresh()}
            // refreshing={isFetching}
          />
        </ScrollView>
        {dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  mainContainer: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginHorizontal: '20rem',
    marginVertical: '7rem',
  },
  subContainer: {
    marginBottom: '65rem',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
    marginTop: '17rem',
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
    fontFamily: 'CircularStd-Medium',
    fontWeight: 'bold',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
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
  subTextName: {
    fontSize: '12rem',
    color: '#080848',
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  flalList: {
    marginTop: '30rem',
    marginBottom: '10rem',
  },
  subTitle: {
    marginHorizontal: '20rem',
    fontSize: '16rem',
    color: colors.projDetailsProjectName,
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    top: '12rem',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginHorizontal: '10rem',
    marginVertical: '7rem',
  },
  iconStyle: {
    width: '43rem',
    height: '43rem',
    borderRadius: 90 / 2,
  },
  deleteIcon: {
    width: '26rem',
    height: '26rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(PeopleScreen);
