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
import icons from '../../../assest/icons/icons';
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
import EmptyListView from '../../../components/EmptyListView';
const initialLayout = {width: entireScreenWidth};

class PeopleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: [],
      admins: [],
      users: [],
      dataLoading: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      AsyncStorage.getItem('userID').then(userID => {
        if (userID) {
          this.fetchData(userID);
        }
      });
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('userID').then(userID => {
      if (userID) {
        this.fetchData(userID);
      }
    });
  }

  async fetchData(userID) {
    let selectedProjectID = this.props.selectedProjectID;
    this.setState({dataLoading: true});
    let projectPeopleData = await APIServices.getProjectPeopleData(
      selectedProjectID,
      userID,
    );
    if (projectPeopleData.message == 'success') {
      let ownerArray = [];
      let adminsArray = [];
      let usersArray = [];
      ownerArray = projectPeopleData.data.filter(function(obj) {
        return obj.projectRoleId == 1;
      });
      adminsArray = projectPeopleData.data.filter(function(obj) {
        return obj.projectRoleId == 2;
      });
      usersArray = projectPeopleData.data.filter(function(obj) {
        return obj.projectRoleId == 3;
      });

      this.setState({
        owner: ownerArray,
        admins: adminsArray,
        users: usersArray,
        dataLoading: false,
      });
    } else {
      this.setState({dataLoading: false});
    }
  }

  async tabOpen() {
    AsyncStorage.getItem('userID').then(userID => {
      if (userID) {
        this.fetchData(userID);
      }
    });
  }

  goToAddPeople = () => {
    NavigationService.navigate('AddPeopleScreen', {
      projectItem: this.props.selectedProjectID,
    });
  };

  goToEditPeople = item => {
    NavigationService.navigate('EditPeople', {
      userItem: item,
    });
  };

  userIcon = function(item) {
    let userImage = item.assigneeProfileImage;
    if (userImage) {
      return (
        <FadeIn>
          <Image
            source={{uri: userImage}}
            style={{width: 45, height: 45, borderRadius: 45 / 2}}
          />
        </FadeIn>
      );
    } else {
      return (
        <Image
          style={{width: 45, height: 45, borderRadius: 45 / 2}}
          source={require('../../../asserts/img/defult_user.png')}
        />
      );
    }
  };

  renderPeopleList(item) {
    let progress = 0;
    if (item.totalTasks > 0) {
      progress = item.tasksCompleted / item.totalTasks;
    }
    return (
      <TouchableOpacity style={styles.mainContainer}>
        <NavigationEvents onWillFocus={payload => this.tabOpen(payload)} />
        <View style={styles.userView}>
          {this.userIcon(item)}
          <View style={{flex: 1}}>
            <Text style={styles.text}>{item.projectJobRoleName}</Text>
            <Text style={styles.subTextName}>
              {item.assigneeFirstName + ' ' + item.assigneeLastName}
            </Text>
          </View>
          <View style={styles.controlView}>
            <TouchableOpacity onPress={() => this.goToEditPeople(item)}>
              <Image
                style={{width: 28, height: 28, borderRadius: 28 / 2}}
                source={require('../../../asserts/img/edit_user.png')}
              />
            </TouchableOpacity>

            <TouchableOpacity style={{marginLeft: EStyleSheet.value('24rem')}}>
              <Image
                style={{width: 28, height: 28, borderRadius: 28 / 2}}
                source={require('../../../asserts/img/bin.png')}
              />
            </TouchableOpacity>
          </View>
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
    let admins = this.state.admins;
    let users = this.state.users;
    return (
      <View>
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
          <Text style={styles.subTitle}>Project Owner</Text>
          <FlatList
            style={styles.flalList}
            data={this.state.owner}
            renderItem={({item}) => this.renderPeopleList(item)}
            keyExtractor={item => item.projId}
            ListEmptyComponent={<EmptyListView />}
            // onRefresh={() => this.onRefresh()}
            // refreshing={isFetching}
          />
          <Text style={styles.subTitle}>Admins</Text>
          <FlatList
            style={styles.flalList}
            data={this.state.admins}
            renderItem={({item}) => this.renderPeopleList(item)}
            keyExtractor={item => item.projId}
            ListEmptyComponent={<EmptyListView />}
            // onRefresh={() => this.onRefresh()}
            // refreshing={isFetching}
          />
          <Text style={styles.subTitle}>Other Users</Text>
          <FlatList
            style={styles.flalList}
            data={this.state.users}
            renderItem={({item}) => this.renderPeopleList(item)}
            keyExtractor={item => item.projId}
            ListEmptyComponent={<EmptyListView />}
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
    fontFamily: 'CircularStd-Book',
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
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(PeopleScreen);
