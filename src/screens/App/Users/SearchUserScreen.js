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
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Loader from '../../../components/Loader';
import FadeIn from 'react-native-fade-in-image';
import EmptyListView from '../../../components/EmptyListView';

class SearchUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      allUsers: [],
      isFetching: false,
      searchText: '',
      selectedProjectID: '',
    };
  }

  componentDidMount() {
    this.fetchData();
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

  fetchData() {
    this.setState({users: [], allUsers: []}, function() {
      this.props.getAllUsers();
    });
  }

  userImage(item) {
    let userImage = item.profileImage;

    if (userImage) {
      return (
        <FadeIn>
          <Image source={{uri: userImage}} style={styles.userIcon} />
        </FadeIn>
      );
    } else {
      return (
        <Image
          style={styles.userIcon}
          source={icons.defultUser}
          resizeMode="contain"
        />
      );
    }
  }

  renderUserListList(item) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('ViewUserScreen', {userItem: item})
        }>
        <View style={styles.userView}>
          {this.userImage(item)}
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
                style={styles.editIconStyle}
                source={icons.editRoundWhite}
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

  onSearchTextChange(text) {
    this.setState({searchText: text});
    let result = this.state.allUsers.filter(
      data =>
        data.firstName.toLowerCase().includes(text.toLowerCase()) ||
        data.lastName.toLowerCase().includes(text.toLowerCase()),
    );
    if (text == '') {
      this.setState({users: this.state.allUsers});
    } else {
      this.setState({users: result});
    }
  }

  render() {
    let users = this.state.users;
    let isFetching = this.state.isFetching;
    let usersLoading = this.props.usersLoading;

    return (
      <View style={styles.container}>
        <View style={styles.projectFilerView}>
          <Image style={styles.searchIcon} source={icons.searchGray} />
          <TextInput
            style={[styles.textInput, {width: '95%'}]}
            placeholder={'Search'}
            value={this.state.searchText}
            onChangeText={text => this.onSearchTextChange(text)}
          />
        </View>
        <FlatList
          style={styles.flalList}
          data={users}
          renderItem={({item}) => this.renderUserListList(item)}
          keyExtractor={item => item.projId}
          onRefresh={() => this.onRefresh()}
          refreshing={isFetching}
          ListEmptyComponent={<EmptyListView />}
        />
        {usersLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  projectFilerView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
    flexDirection: 'row',
  },
  text: {
    fontSize: '12rem',
    color: colors.userListUserNameColor,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  userIcon: {
    width: '45rem',
    height: '45rem',
    borderRadius: 90 / 2,
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Book',
    textAlign: 'left',
    marginLeft: '7rem',
  },
  searchIcon: {
    width: '17rem',
    height: '17rem',
  },
  userView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    height: '60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  flalList: {
    marginTop: '0rem',
    marginBottom: '10rem',
  },
  editIconStyle: {
    width: '26rem',
    height: '26rem',
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
)(SearchUserScreen);
