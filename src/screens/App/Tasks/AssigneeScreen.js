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
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import FadeIn from 'react-native-fade-in-image';

class AssigneeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      allUsers: [],
      isFetching: false,
      searchText: '',
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

  onSelectUser(userName) {
    const {navigation} = this.props;
    navigation.state.params.onSelectUser(userName);
    navigation.goBack();
  }

  userImage = function(item) {
    // let userImage =
    //   'https://i.pinimg.com/236x/5e/48/1b/5e481b8fa99c5f0ebc319b93f3c6e076--tiaras-singer.jpg';
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
          source={require('../../../asserts/img/defult_user.png')}
          resizeMode="contain"
        />
      );
    }
  };

  renderProjectList(item) {
    const {navigation} = this.props;
    return (
      <TouchableOpacity
        onPress={() => this.onSelectUser(item.firstName + ' ' + item.lastName)}>
        <View
          style={[
            styles.projectView,
            {
              backgroundColor:
                item.firstName + ' ' + item.lastName ==
                navigation.state.params.userName
                  ? colors.projectBgColor
                  : '',
            },
          ]}>
          {this.userImage(item)}
          <View style={{flex: 1}}>
            <Text style={styles.text}>
              {item.firstName + ' ' + item.lastName}
            </Text>
          </View>
          {/* {this.colorCode(item)} */}
        </View>
      </TouchableOpacity>
    );
  }

  onRefresh() {
    this.setState({isFetching: true, users: [], allUsers: []}, function() {
      this.fetchData();
    });
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
      <View style={styles.backgroundImage}>
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
          data={users}
          renderItem={({item}) => this.renderProjectList(item)}
          keyExtractor={item => item.projId}
          onRefresh={() => this.onRefresh()}
          refreshing={isFetching}
        />
        {usersLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  projectFilerView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
    flexDirection: 'row',
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
    height: '70rem',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '20rem',
    borderBottomWidth: 1,
    borderBottomColor: colors.lighterGray,
  },
  text: {
    fontSize: '12rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  userIcon: {
    width: '50rem',
    height: '50rem',
    borderRadius: 120 / 2,
  },
  statusView: {
    backgroundColor: colors.gray,
    width: '5rem',
    height: '60rem',
    alignItems: 'flex-end',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  dropIcon: {
    width: '13rem',
    height: '13rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
    marginLeft: '7rem',
  },
  searchIcon: {
    width: '17rem',
    height: '17rem',
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
)(AssigneeScreen);
