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
import FadeIn from 'react-native-fade-in-image';
import Loader from '../../../components/Loader';
import {NavigationEvents} from 'react-navigation';
import io from 'socket.io-client';
import APIServices from '../../../services/APIServices';

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      isFetching: false,
      dataLoading: false,
      chatText: '',
      height: 60,

      chatMessage: '',
      chatMessages: [],
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
      });
    }

    if (this.state.isFetching) {
      this.setState({
        isFetching: false,
      });
    }
  }

  componentDidMount() {
    this.socket = io('http://192.168.1.4:3000');
    this.socket.on('chat message', msg => {
      this.setState({chatMessages: [...this.state.chatMessages, msg]});
    });
    this.fetchData();
  }

  async fetchData() {
    // this.setState({dataLoading: true, users: []});
    // await APIServices.getCommentsData()
    //   .then(response => {
    //     if (response.message == 'success') {

    //       this.setState({dataLoading: false});
    //     } else {
    //       this.setState({dataLoading: false});
    //     }
    //   })
    //   .catch(error => {
    //     this.setState({dataLoading: false});
    //     this.showAlert('', error.data.message);
    //   });
    this.setState({users: []}, function() {
      this.props.getAllUsers();
    });
  }

  userImage = function(item) {
    // let userImage = item.taskAssigneeProfileImage;
    let userImage =
      'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg';

    if (userImage) {
      return (
        <FadeIn>
          <Image source={{uri: userImage}} style={styles.userIcon} />
        </FadeIn>
      );
    } else {
      return <Image style={styles.userIcon} source={icons.defultUser} />;
    }
  };

  renderUserListList(item) {
    return (
      <View style={styles.chatView}>
        {this.userImage(item)}
        <View style={{flex: 1}}>
          <View style={styles.timeView}>
            <Text style={styles.textTime}>
              {/* {item.firstName} */}
              an hour ago
            </Text>
          </View>
          <View style={styles.nameView}>
            <Text style={styles.text}>
              {/* {item.firstName} */}
              Indika Wijesooriya
            </Text>
            <Text style={styles.textChat}>
              {/* {item.firstName} */}
              Chameera Aiya i just made the designing
            </Text>
          </View>
        </View>
      </View>
    );
  }

  onRefresh() {
    this.setState({isFetching: true, users: []}, function() {
      this.fetchData();
    });
  }

  onBackPress() {
    this.props.navigation.goBack();
  }

  loadUsers() {
    this.setState({users: []}, function() {
      this.props.getAllUsers();
    });
  }

  onChatTextChange(text) {
    this.setState({chatText: text});
  }

  updateSize = height => {
    if (height <= 100) {
      this.setState({
        height,
      });
    }
  };

  submitChatMessage() {
    this.socket.emit('chat message', this.state.chatText);
    this.setState({chatText: ''});
  }

  render() {
    let users = this.state.users;
    let isFetching = this.state.isFetching;
    let usersLoading = this.props.usersLoading;

    const chatMessages = this.state.chatMessages.map(chatMessage => (
      <Text style={{borderWidth: 2, top: 500}}>{chatMessage}</Text>
    ));

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={payload => this.loadUsers(payload)} />

        {chatMessages}
        <FlatList
          style={styles.flalList}
          data={users}
          renderItem={({item}) => this.renderUserListList()}
          keyExtractor={item => item.projId}
          onRefresh={() => this.onRefresh()}
          refreshing={isFetching}
        />
        <View style={styles.chatFieldView}>
          <View style={{flex: 1}}>
            <TextInput
              style={styles.textInput}
              placeholder={'Add a comment'}
              value={this.state.chatText}
              multiline={true}
              onChangeText={text => this.onChatTextChange(text)}
              // onSubmitEditing={() => this.submitChatMessage()}
              // onContentSizeChange={e =>
              //   this.updateSize(e.nativeEvent.contentSize.height)
              // }
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              this.submitChatMessage();
            }}>
            <Image
              style={styles.chatIcon}
              source={icons.forwordGreen}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
        </View>
        {usersLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  chatView: {
    backgroundColor: colors.white,
    borderColor: colors.lighterGray,
    marginTop: '13rem',
    marginBottom: '13rem',
    flexDirection: 'row',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '12rem',
    color: colors.userListUserNameColor,
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: 'bold',
  },
  textChat: {
    fontSize: '11rem',
    color: colors.userListUserNameColor,
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  timeView: {
    width: '100%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  flalList: {
    marginTop: '20rem',
    marginBottom: '10rem',
  },
  taskStateIcon: {
    width: '25rem',
    height: '25rem',
  },
  editDeleteIcon: {
    width: '25rem',
    height: '25rem',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    marginTop: '17rem',
    marginBottom: '17rem',
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
    marginRight: '10rem',
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
    marginRight: '15rem',
    marginLeft: '10rem',
  },
  userIcon: {
    width: '45rem',
    height: '45rem',
    borderRadius: 90 / 2,
  },
  textTime: {
    fontSize: '9rem',
    color: colors.lightBlue,
    fontFamily: 'CircularStd-Medium',
  },
  nameView: {
    marginTop: '-4rem',
  },
  chatFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginBottom: '15rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Book',
    textAlign: 'left',
  },
  chatIcon: {
    width: '20rem',
    height: '20rem',
    marginRight: '15rem',
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
)(ChatScreen);
