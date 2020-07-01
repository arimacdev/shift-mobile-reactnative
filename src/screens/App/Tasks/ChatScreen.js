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
import PopupMenuEmojiReaction from '../../../components/PopupMenuEmojiReaction';
import {MenuProvider} from 'react-native-popup-menu';
import DocumentPicker from 'react-native-document-picker';
import AsyncStorage from '@react-native-community/async-storage';
import Swipeable from 'react-native-swipeable';

const reactionDetails = [
  {value: '&#128077', text: '👍'},
  {value: '&#128154', text: '💚'},
  {value: '&#128514', text: '😂'},
  {value: '&#128545', text: '😡'},
  {value: '&#128546', text: '😢'},
];

class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      isFetching: false,
      dataLoading: false,
      chatText: '',
      height: 60,

      chatMessage: '',
      chatMessages: [],
      status: 'Not Connected',
      showEmojiPicker: false,
      reactionIcon: '',
      taskId: '',
    };
  }

  componentWillMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;

    let taskId = params.taskId;

    this.setState({
      taskId: taskId,
    });
    this.fetchData(taskId);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.commentsLoading !== this.props.commentsLoading &&
      this.props.comments &&
      this.props.comments.length > 0
    ) {
      this.setState({
        comments: this.props.comments,
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
    this.props.stompContext.removeStompClient();
    this.rootSubscribed.unsubscribe();
  }

  componentDidMount() {
    let taskId = this.state.taskId;
    let userId = AsyncStorage.getItem('userID');

    this.props.stompContext.addStompEventListener(
      StompEventTypes.Connect,
      () => {
        this.setState({status: 'Connected'});
        this.rootSubscribed = this.props.stompContext
          .getStompClient()
          .subscribe('/topic/messages/' + taskId, message => {
            let messageDecode = JSON.parse(message.body);
            console.log('messageDecode', messageDecode);
            if (messageDecode.sender !== userId) {
              this.fetchData(taskId);
            }
          });
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

  async fetchData(taskId) {
    this.setState({dataLoading: true});
    await APIServices.getCommentsData(taskId)
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false, comments: response.data});
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        // Utils.showAlert(true, '', error.data.message, this.props);
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
        <HTML
          // containerStyle={{marginLeft: 11, marginTop: -15}}
          html={item.reactionId}
          imagesMaxWidth={entireScreenWidth}
        />
        {/* <Text>{item.reactionIcon}</Text> */}
        <Text style={styles.textCount}>
          {item.respondants ? item.respondants.length : ''}
        </Text>
      </View>
    );
  }

  async onMenuItemChange(item, commentId) {
    this.setState({dataLoading: true});
    await APIServices.addUpdateCommentReactionData(commentId, item.value)
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false});
          this.sendMessageToSocket(item.value)
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        // Utils.showAlert(true, '', error.data.message, this.props);
      });
  }

  async onDeleteCommentPress(commentId) {
    this.setState({dataLoading: true});
    await APIServices.deleteCommentData(commentId)
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false});
          this.sendMessageToSocket('');
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        // Utils.showAlert(true, '', error.data.message, this.props);
      });
  }

  renderUserListList(item) {
    let commentId = item.commentId;

    const rightButtons = [
      <TouchableOpacity
        style={styles.leftContentButtonStyle}
        onPress={() => this.OnEditCommentPress(item.commentId)}>
        <Image style={styles.controlIcon} source={icons.editRoundWhite} />
      </TouchableOpacity>,
      <TouchableOpacity
        style={styles.leftContentButtonStyle}
        onPress={() => this.onDeleteCommentPress(item.commentId)}>
        <Image style={styles.controlIcon} source={icons.deleteRoundRed} />
      </TouchableOpacity>,
    ];

    return (
      <Swipeable
        style={styles.swipeableView}
        rightButtons={rightButtons}
        rightButtonWidth={EStyleSheet.value('50rem')}>
        <View style={styles.chatView}>
          {this.userImage(item)}
          <View style={{flex: 1}}>
            <View style={styles.timeView}>
              <Text style={styles.textTime}>
                {moment.parseZone(item.commentedAt).format('hh:mm A')}
              </Text>
            </View>
            <View style={styles.nameView}>
              <View style={styles.innerView}>
                <View style={{flex: 1}}>
                  <Text style={styles.text}>
                    {item.commenterFistName} {item.commenterFistName}
                  </Text>
                  {/* <Text style={styles.textChat}>{item.content}</Text> */}
                  <HTML
                    containerStyle={{marginLeft: 11, marginTop: -15}}
                    html={item.content}
                    imagesMaxWidth={entireScreenWidth}
                  />
                </View>

                <View style={styles.emojiIconView}>
                  <PopupMenuEmojiReaction
                    data={reactionDetails}
                    onChange={item => this.onMenuItemChange(item, commentId)}
                  />
                </View>
              </View>
              {item.reactions && item.reactions.length > 0 ? (
                <FlatList
                  style={styles.flalListReactions}
                  data={item.reactions}
                  horizontal={true}
                  renderItem={item => this.renderReactionDetailsList(item.item)}
                  keyExtractor={item => item.reactionId}
                />
              ) : null}
            </View>
          </View>
        </View>
      </Swipeable>
    );
  }

  onRefresh() {
    this.setState({isFetching: true, comments: []}, function() {
      this.fetchData(this.state.taskId);
    });
  }

  onBackPress() {
    this.props.navigation.goBack();
  }

  loadUsers() {
    this.setState({comments: []}, function() {
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

  async addComment() {
    let chatText = this.state.chatText;
    let taskId = this.state.taskId;
    let chatTextConvert = '<p>' + chatText + '</p>';

    this.setState({dataLoading: true});
    await APIServices.addCommentData(taskId, chatTextConvert)
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false});
          let data = response.data;
          // let comment = {
          //   commentId: data.commentId,
          //   commentedAt: data.commentedAt,
          //   commenter: data.commenter,
          //   commenterFistName: data.commenterFistName,
          //   commenterLatName: data.commenterLatName,
          //   commenterProfileImage: data.commenterProfileImage,
          //   content: data.content,
          //   reactions: data.reactions,
          // };
          // this.setState({comments: this.state.comments.concat(comment)});
          this.submitChatMessage(chatText);
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        Utils.showAlert(true, '', error.data.message, this.props);
      });
  }

  async submitChatMessage(chatText) {
    if (chatText != '') {
      this.sendMessageToSocket(chatText);
      this.setState({chatText: ''});
    }
  }

  addEmoji(emoji) {
    this.setState({
      chatText: this.state.chatText.concat(emoji),
      showEmojiPicker: false,
    });
    console.log(emoji);
  }

  onCloseTaskModal() {
    this.setState({showEmojiPicker: false});
  }

  renderEmojiPicker() {
    return (
      // <Modal
      //   isVisible={this.state.showEmojiPicker}
      //   style={styles.modalStyle}
      //   onBackButtonPress={() => this.onCloseTaskModal()}
      //   onBackdropPress={() => this.onCloseTaskModal()}
      //   onRequestClose={() => this.onCloseTaskModal()}
      //   coverScreen={false}
      //   backdropTransitionOutTiming={0}>
      <EmojiSelector
        style={{
          height: 250,
        }}
        onEmojiSelected={emoji => this.addEmoji(emoji)}
        showSectionTitles={false}
        showHistory={true}
        columns={10}
      />
      // </Modal>
    );
  }

  onEmojiPickerPress(showEmojiPicker) {
    this.setState({showEmojiPicker: !showEmojiPicker});
  }

  async doumentPicker() {
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.plainText,
          DocumentPicker.types.pdf,
        ],
      });
      for (const res of results) {
        this.onFilesCrossPress(res.uri);

        await this.state.files.push({
          uri: res.uri,
          type: res.type, // mime type
          name: res.name,
          size: res.size,
          dateTime:
            moment().format('YYYY/MM/DD') + ' | ' + moment().format('HH:mm'),
        });
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size,
        );
      }
      await this.setState({
        files: this.state.files,
        indeterminate: true,
        uploading: 0,
        showMessageModal: false,
      });

      await APIServices.addFileToTask(this.state.files)
        .then(response => {
          if (response.message == 'success') {
            this.details = {
              icon: icons.fileOrange,
              type: 'success',
              title: 'Sucsess',
              description: 'File has been added successfully',
              buttons: {},
            };
            this.setState({
              indeterminate: false,
              files: [],
              uploading: 100,
              showMessageModal: true,
            });
            // this.fetchFilesData(selectedProjectID, selectedProjectTaskID);
          } else {
            this.setState({indeterminate: false, files: [], uploading: 0});
          }
        })
        .catch(error => {
          this.setState({indeterminate: false, files: [], uploading: 0});
          if (error.status == 401) {
            this.showAlert('', error.data.message);
          } else {
            this.showAlert('', error);
          }
        });
      console.log(this.state.files);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('file pick error', err);
      } else {
        throw err;
      }
    }
  }

  async sendMessageToSocket(message) {
    let taskId = this.state.taskId;
    let userId = await AsyncStorage.getItem('userID');

    this.props.stompContext.getStompClient().publish({
      destination: '/app/chat/' + taskId,
      headers: {priority: 9},
      body: JSON.stringify({
        sender: userId,
        message: message,
        actionType: 'comment',
      }),
    });
  }

  render() {
    let comments = this.state.comments;
    let isFetching = this.state.isFetching;
    let usersLoading = this.props.usersLoading;
    let showEmojiPicker = this.state.showEmojiPicker;

    return (
      <MenuProvider>
        <View style={styles.container}>
          <NavigationEvents onWillFocus={payload => this.loadUsers(payload)} />
          <FlatList
            style={styles.flalList}
            data={comments}
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
            <TouchableOpacity
              onPress={() => {
                this.doumentPicker();
              }}>
              <Image
                style={styles.addFileIcon}
                source={icons.addRoundedBlue}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
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
                this.onEmojiPickerPress(showEmojiPicker);
              }}>
              <Image
                style={styles.emojiChatIconStyle}
                source={
                  showEmojiPicker ? icons.keyboardIcon : icons.emojiChatIcon
                }
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.addComment();
              }}>
              <Image
                style={styles.chatIcon}
                source={icons.forwordGreen}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
          </View>
          {showEmojiPicker && this.renderEmojiPicker()}
          {usersLoading && <Loader />}
          {/* {this.state.status != 'Connected' && <Loader />} */}
        </View>
      </MenuProvider>
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
    // marginTop: '13rem',
    // marginBottom: '13rem',
    flexDirection: 'row',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  swipeableView: {
    marginTop: '10rem',
    marginBottom: '10rem',
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
    marginBottom: '10rem',
  },
  flalListReactions: {
    marginBottom: '5rem',
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
  emojiChatIconStyle: {
    width: '23rem',
    height: '23rem',
    marginRight: '15rem',
  },
  innerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emojiIconView: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-start',
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
    // marginTop: '5rem',
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
  addFileIcon: {
    width: '23rem',
    height: '23rem',
    marginRight: '10rem',
  },
  controlIcon: {
    width: '28rem',
    height: '28rem',
  },
  leftContentButtonStyle: {
    width: '30rem',
    height: '42rem',
    justifyContent: 'flex-end',
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
