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
import EmptyListView from '../../../components/EmptyListView';
import MessageShowModal from '../../../components/MessageShowModal';
const initialLayout = {width: entireScreenWidth};

class PeopleScreen extends Component {
  details = {
    icon: icons.alertRed,
    type: 'confirm',
    title: 'Block User',
    description:
      "You're about to block this user from the project.\nIf you're not sure, you can close this pop up.",
    buttons: {positive: 'Block', negative: 'Cancel'},
  };

  constructor(props) {
    super(props);
    this.state = {
      owner: [],
      admins: [],
      users: [],
      blockedUsers: [],
      dataLoading: false,
      showMessageModal: false,
      blockUserId: '',
      blockUserStatus: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      this.tabOpen();
    }
  }

  componentDidMount() {
    this.tabOpen();
  }

  async fetchData(userID) {
    let selectedProjectID = this.props.selectedProjectID;
    try {
      this.setState({dataLoading: true});
      let projectPeopleData = await APIServices.getProjectPeopleData(
        selectedProjectID,
        userID,
      );
      if (projectPeopleData.message == 'success') {
        // this.props.setProjectUsers(projectPeopleData);
        let ownerArray = [];
        let adminsArray = [];
        let usersArray = [];
        let blockedusersArray = [];

        ownerArray = projectPeopleData.data.filter(function(obj) {
          return obj.projectRoleId == 1;
        });
        adminsArray = projectPeopleData.data.filter(function(obj) {
          return obj.projectRoleId == 2 && obj.isUserBlocked == false;
        });
        usersArray = projectPeopleData.data.filter(function(obj) {
          return obj.projectRoleId == 3 && obj.isUserBlocked == false;
        });
        blockedusersArray = projectPeopleData.data.filter(function(obj) {
          return obj.isUserBlocked == true;
        });

        this.setState({
          owner: ownerArray,
          admins: adminsArray,
          users: usersArray,
          blockedUsers: blockedusersArray,
          dataLoading: false,
        });
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
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

  blockPeople(item) {
    this.details = {
      icon: icons.alertRed,
      type: 'confirm',
      title: 'Block User',
      description:
        "You're about to block this user from the project.\nIf you're not sure, you can close this pop up.",
      buttons: {positive: 'Block', negative: 'Cancel'},
    };
    this.setState({
      showMessageModal: true,
      blockUserId: item.assigneeId,
      blockUserStatus: true,
    });
  }

  unblockPeople(item) {
    this.details = {
      icon: icons.alertRed,
      type: 'confirm',
      title: 'Unblock User',
      description:
        "You're about to unblock this user from the project.\nIf you're not sure, you can close this pop up.",
      buttons: {positive: 'Unblock', negative: 'Cancel'},
    };
    this.setState({
      showMessageModal: true,
      blockUserId: item.assigneeId,
      blockUserStatus: false,
    });
  }

  async blockUnblockUser() {
    let selectedProjectID = this.props.selectedProjectID;
    let blockUserId = this.state.blockUserId;
    let blockedStatus = this.state.blockUserStatus;

    try {
      this.setState({dataLoading: true, showMessageModal: false});
      let blockPeopleData = await APIServices.blockUnblockUserData(
        selectedProjectID,
        blockedStatus,
        blockUserId,
      );
      if (blockPeopleData.message == 'success') {
        this.details = {
          icon: icons.userGreen,
          type: 'success',
          title: 'Success',
          description: blockedStatus
            ? 'User have been blocked successfully'
            : 'User have been unblocked successfully',
          buttons: {},
        };
        this.setState({
          dataLoading: false,
          showMessageModal: true,
        });
        this.tabOpen();
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  onPressCancel() {
    this.setState({showMessageModal: false});
  }

  userIcon = function(item) {
    let userImage = item.assigneeProfileImage;
    if (userImage) {
      return (
        <FadeIn>
          <Image source={{uri: userImage}} style={styles.userIconStyle} />
        </FadeIn>
      );
    } else {
      return <Image style={styles.userIconStyle} source={icons.defultUser} />;
    }
  };

  renderPeopleList(item, fromOwner, fromUnblock) {
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
          {!fromOwner ? (
            <View style={styles.controlView}>
              <TouchableOpacity onPress={() => this.goToEditPeople(item)}>
                <Image
                  style={styles.controlIcon}
                  source={icons.editRoundWhite}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  fromUnblock
                    ? this.unblockPeople(item)
                    : this.blockPeople(item)
                }
                style={{marginLeft: EStyleSheet.value('24rem')}}>
                <Image
                  style={styles.controlIcon}
                  source={
                    fromUnblock
                      ? icons.addUserRoundedGreen
                      : icons.deleteRoundRed
                  }
                />
              </TouchableOpacity>
            </View>
          ) : null}
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
    let blockedUsers = this.state.blockedUsers;

    return (
      <View style={{flex: 1}}>
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
          {owner.length > 0 ? (
            <View>
              <Text style={styles.subTitle}>Project Owner</Text>
              <FlatList
                style={styles.flalList}
                data={owner}
                renderItem={({item}) =>
                  this.renderPeopleList(item, true, false)
                }
                keyExtractor={item => item.projId}
                // ListEmptyComponent={<EmptyListView />}
                // onRefresh={() => this.onRefresh()}
                // refreshing={isFetching}
              />
            </View>
          ) : null}

          {admins.length > 0 ? (
            <View>
              <Text style={styles.subTitle}>Admins</Text>
              <FlatList
                style={styles.flalList}
                data={admins}
                renderItem={({item}) =>
                  this.renderPeopleList(item, false, false)
                }
                keyExtractor={item => item.projId}
              />
            </View>
          ) : null}

          {users.length > 0 ? (
            <View>
              <Text style={styles.subTitle}>Other Users</Text>
              <FlatList
                style={styles.flalList}
                data={users}
                renderItem={({item}) =>
                  this.renderPeopleList(item, false, false)
                }
                keyExtractor={item => item.projId}
              />
            </View>
          ) : null}

          {blockedUsers.length > 0 ? (
            <View>
              <Text style={styles.subTitle}>Blocked Users</Text>
              <FlatList
                style={styles.flalList}
                data={blockedUsers}
                renderItem={({item}) =>
                  this.renderPeopleList(item, false, true)
                }
                keyExtractor={item => item.projId}
              />
            </View>
          ) : null}
        </ScrollView>
        {dataLoading && <Loader />}
        <MessageShowModal
          showMessageModal={this.state.showMessageModal}
          details={this.details}
          onPress={() => this.blockUnblockUser(this)}
          onPressCancel={() => this.onPressCancel(this)}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  mainContainer: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginHorizontal: '20rem',
    marginVertical: '5rem',
  },
  subContainer: {
    marginTop: '15rem',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
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
    borderRadius: '5rem',
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
    color: colors.colorSilver,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  subTextName: {
    fontSize: '12rem',
    color: colors.colorMidnightExpress,
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
    marginTop: '15rem',
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
  userIconStyle: {
    width: '42rem',
    height: '42rem',
    borderRadius: 80 / 2,
  },
  controlIcon: {
    width: '28rem',
    height: '28rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(PeopleScreen);
