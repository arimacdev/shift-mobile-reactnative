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
const entireScreenHeight = Dimensions.get('window').height;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import FadeIn from 'react-native-fade-in-image';
import Loader from '../../../components/Loader';
import {NavigationEvents} from 'react-navigation';
// import io from 'socket.io-client';
import APIServices from '../../../services/APIServices';
import moment from 'moment';
import {StompEventTypes, withStomp, Client} from 'react-stompjs';
import EmojiSelector from 'react-native-emoji-selector';
import Modal from 'react-native-modal';
import Utils from '../../../utils/Utils';
import HTML from 'react-native-render-html';

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
      status: 'Not Connected',
      showEmojiPicker: false,
      reactionIcon: '',
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

  componentWillUnmount() {
    this.props.stompContext.removeStompEventListener(
      StompEventTypes.WebSocketClose,
      () => {
        this.setState({status: 'Disconnected (not graceful)'});
      },
    );
    // this.props.stompContext.removeStompClient();
    // this.rootSubscribed.unsubscribe();
  }

  componentDidMount() {
    this.fetchData();
    this.props.stompContext.addStompEventListener(
      StompEventTypes.Connect,
      () => {
        this.setState({status: 'Connected'});
        this.rootSubscribed = this.props.stompContext
          .getStompClient()
          .subscribe(
            '/topic/messages/' + '8ad68987-cb6f-4bbf-ae39-4b84afb4c7d7',
            message => {
              let messageDecode = JSON.parse(message.body);
            },
          );
      },
    );
    this.props.stompContext.addStompEventListener(
      StompEventTypes.Disconnect,
      () => {
        this.setState({status: 'Disconnected'});
      },
    );
    this.props.stompContext.addStompEventListener(
      StompEventTypes.WebSocketClose,
      () => {
        this.setState({status: 'Disconnected (not graceful)'});
      },
    );
    this.props.stompContext.newStompClient(
      'https://pmtool.devops.arimac.xyz/api/pm-service/chat',
      '',
      '',
      '/',
    );
  }

  async fetchData() {
    this.setState({dataLoading: true, users: []});
    await APIServices.getCommentsData('8ad68987-cb6f-4bbf-ae39-4b84afb4c7d7')
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false, users: response.data});
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        Utils.showAlert(true, '', error.data.message, this.props);
      });
  }

  userImage = function(item) {
    let userImage = item.commenterProfileImage;
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

  onReactionIconPress() {
    this.setState({showEmojiPicker: true});
  }

  renderReactionDetailsList(item) {
    return (
      <View style={styles.reactionView}>
        <Text>{item.reactionIcon}</Text>
        <Text style={styles.textCount}>{item.reactionCount}</Text>
      </View>
    );
  }

  renderUserListList(item) {
    return (
      <View style={styles.chatView}>
        {this.userImage(item)}
        <View style={{flex: 1}}>
          <View style={styles.timeView}>
            <Text style={styles.textTime}>{moment(item.commentedAt).format('hh:mm A')}</Text>
          </View>
          <View style={styles.nameView}>
            <View style={styles.innerView}>
              <View style={{flex: 1}}>
                <Text style={styles.text}>
                  {item.commenterFistName} {item.commenterFistName}
                </Text>
                {/* <Text style={styles.textChat}>{item.content}</Text> */}
                <HTML html={item.content} imagesMaxWidth={entireScreenWidth} />
              </View>
              <TouchableOpacity
                style={styles.emojiIconView}
                onPress={() => this.onReactionIconPress()}>
                <Image style={styles.emojiIcon} source={icons.addEmoji} />
              </TouchableOpacity>
            </View>
            {item.image ? (
              <FadeIn>
                <Image
                  source={{
                    uri:
                      'https://static.toiimg.com/thumb/72975551.cms?width=680&height=512&imgsize=881753',
                  }}
                  style={styles.uploadImage}
                  resizeMode={'contain'}
                />
              </FadeIn>
            ) : null}
            <FlatList
              style={styles.flalList}
              data={item.reactionDetails}
              horizontal={true}
              renderItem={item => this.renderReactionDetailsList(item.item)}
              keyExtractor={item => item.reactionId}
            />
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
      // this.props.getAllUsers();
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
    let chatText = this.state.chatText;
    if (chatText != '') {
      // this.socket.emit('chat message', this.state.chatText);
      this.props.stompContext.getStompClient().publish({
        destination: '/app/chat/' + '8ad68987-cb6f-4bbf-ae39-4b84afb4c7d7',
        headers: {priority: 9},
        body: JSON.stringify({
          fromLogin: 'from',
          message: chatText,
          actionType: 'comment',
        }),
      });
      let comment = {
        commentId: '202d83f9-ac1b-4f56-8f70-53f436f6dce8',
        commentedAt: '2020-06-29T10:54:28.000+0000',
        commenter: '138bbb3d-02ed-4d72-9a03-7e8cdfe89eff',
        commenterFistName: 'Naveen',
        commenterLatName: 'Perera',
        commenterProfileImage:
          'https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1591184736784_image_4.jpg',
        content: '<p>gfgf</p>',
        msg: chatText,
        dateTime: moment().format('hh:mm A'),
        reactionDetails: [
          {id: '1', reactionIcon: '😃', reactionCount: 2},
          {id: '2', reactionIcon: '👍', reactionCount: 1},
        ],
        // dateTime: moment(new Date()).fromNow()
      };
      this.setState({users: this.state.users.concat(comment)});
      this.setState({chatText: ''});
    }
  }

  addEmoji(emoji) {
    this.setState({reactionIcon: emoji, showEmojiPicker: false});
    console.log(emoji);
  }

  onCloseTaskModal() {
    this.setState({showEmojiPicker: false});
  }

  renderEmojiPicker() {
    return (
      <Modal
        isVisible={this.state.showEmojiPicker}
        style={styles.modalStyle}
        onBackButtonPress={() => this.onCloseTaskModal()}
        onBackdropPress={() => this.onCloseTaskModal()}
        onRequestClose={() => this.onCloseTaskModal()}
        coverScreen={false}
        backdropTransitionOutTiming={0}>
        <EmojiSelector
          style={{
            position: 'absolute',
            marginHorizontal: 10,
            marginTop: 10,
            height: entireScreenHeight - 180,
            width: '95%',
            backgroundColor: colors.white,
          }}
          onEmojiSelected={emoji => this.addEmoji(emoji)}
          showSectionTitles={false}
          showHistory={true}
          columns={10}
        />
      </Modal>
    );
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
          renderItem={item => this.renderUserListList(item.item)}
          keyExtractor={item => item.projId}
          onRefresh={() => this.onRefresh()}
          refreshing={isFetching}
          ref={ref => (this.flatList = ref)}
          onContentSizeChange={() =>
            this.flatList.scrollToEnd({animated: true})
          }
          onLayout={() => this.flatList.scrollToEnd({animated: true})}
        />
        <View style={styles.chatFieldView}>
          <View style={{flex: 1}}>
            <TextInput
              style={styles.textInput}
              placeholder={'Add a comment'}
              value={this.state.chatText}
              multiline={true}
              editable={this.state.status == 'Connected' ? true : false}
              onChangeText={text => this.onChatTextChange(text)}
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
        {this.renderEmojiPicker()}
        {usersLoading && <Loader />}
        {/* {this.state.status != 'Connected' && <Loader />} */}
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
    // marginTop: '20rem',
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
  innerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiIconView: {
    justifyContent: 'flex-end',
    marginTop: '10rem',
  },
  emojiIcon: {
    width: '18rem',
    height: '18rem',
  },
  uploadImage: {
    width: '100rem',
    height: '100rem',
    marginLeft: '10rem',
  },
  reactionView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.colorPaleCornflowerBlue,
    marginLeft: '10rem',
    marginTop: '5rem',
    width: '50rem',
    paddingHorizontal: '5rem',
    paddingVertical: '2rem',
    borderRadius: '15rem',
    borderColor: colors.colorDeepSkyBlue,
    borderWidth: '1rem',
  },
  reactionIcon: {
    width: '20rem',
    height: '20rem',
  },
  textCount: {
    fontSize: '12rem',
    color: colors.colorMidnightBlue,
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '3rem',
    fontWeight: 'bold',
  },
  modalStyle: {
    borderRadius: 5,
    backgroundColor: colors.white,
  },
});

const mapStateToProps = state => {
  return {
    usersLoading: state.users.usersLoading,
    users: state.users.users,
  };
};
// export default connect(
//   mapStateToProps,
//   actions,
// )(ChatScreen);

export default withStomp(ChatScreen);
