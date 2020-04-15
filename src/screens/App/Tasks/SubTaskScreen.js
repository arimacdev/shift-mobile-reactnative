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
import FadeIn from 'react-native-fade-in-image';
import Loader from '../../../components/Loader';
import Header from '../../../components/Header';
import {NavigationEvents} from 'react-navigation';

class SubTasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      allUsers: [],
      isFetching: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.usersLoading !== this.props.usersLoading &&
      this.props.users &&
      this.props.users.length > 0
    ) {
      this.setState({
        users: this.props.users,
        allUsers: this.props.users,
      });
    }

    if (this.state.isFetching) {
      this.setState({
        isFetching: false,
      });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    this.setState({users: [], allUsers: []}, function() {
      this.props.getAllUsers();
    });
  }

  renderUserListList(item) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('ViewUserScreen', {userItem: item})
        }>
        <View style={styles.userView}>
          <Image
            source={item.taskComplete ? icons.rightCircule : icons.whiteCircule}
            style={styles.taskStateIcon}
          />
          <View style={{flex: 1}}>
            <Text style={styles.text}>
              {item.firstName + ' ' + item.lastName}
            </Text>
          </View>
          <View style={styles.controlView}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('EditUserScreen', {
                  userItem: item,
                })
              }>
              <Image
                style={styles.editDeleteIcon}
                source={icons.editRoundWhite}
              />
            </TouchableOpacity>

            <TouchableOpacity style={{marginLeft: EStyleSheet.value('20rem')}}>
              <Image
                style={styles.editDeleteIcon}
                source={icons.deleteRoundRed}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  onRefresh() {
    this.setState({isFetching: true, users: [], allUsers: []}, function() {
      this.fetchData();
    });
  }

  onBackPress() {
    this.props.navigation.goBack();
  }

  loadUsers() {
    this.setState({users: [], allUsers: []}, function() {
      this.props.getAllUsers();
    });
  }

  render() {
    let users = this.state.users;
    let isFetching = this.state.isFetching;
    let usersLoading = this.props.usersLoading;

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={payload => this.loadUsers(payload)} />
        <FlatList
          style={styles.flalList}
          data={users}
          renderItem={({item}) => this.renderUserListList(item)}
          keyExtractor={item => item.projId}
          onRefresh={() => this.onRefresh()}
          refreshing={isFetching}
        />
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.button}>
            <Image
              style={styles.bottomBarIcon}
              source={icons.taskWhite}
              resizeMode={'center'}
            />
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>Add new Task</Text>
            </View>

            <Image
              style={styles.addIcon}
              source={icons.add}
              resizeMode={'center'}
            />
          </View>
        </TouchableOpacity>
        {usersLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  userView: {
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
    fontSize: '12rem',
    color: colors.userListUserNameColor,
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
    marginTop: '20rem',
    marginBottom: '0rem',
  },
  taskStateIcon: {
    width: 45,
    height: 45,
  },
  editDeleteIcon: {
    width: 25,
    height: 25,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
    marginTop: '17rem',
    marginBottom: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonText: {
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    fontWeight: 'bold',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
    marginRight: 10,
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
    marginRight: 15,
    marginLeft: 10,
  },
});

const mapStateToProps = state => {
  return {
    usersLoading: state.users.usersLoading,
    users: state.users.users,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(SubTasksScreen);
