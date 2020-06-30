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

const reactionDetails = [
  {value: ':+1:', text: '👍'},
  {value: ':simple_smile:', text: '🙂'},
  {value: ':grinning:', text: '😃'},
  {value: ':joy:', text: '😂'},
  {value: ':green_heart:', text: '💚'},
  {value: ':rage:', text: '😡'},
  {value: ':cry:', text: '😢'},
];

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

  onMenuItemChange(item, commentId) {
    console.log('dsddddddddddddddddd', item);
  }

  renderUserListList(item) {
    return (
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
              {/* <TouchableOpacity
                style={styles.emojiIconView}
                onPress={() => this.onReactionIconPress()}>
                <Image style={styles.emojiIcon} source={icons.addEmoji} />
              </TouchableOpacity> */}
              <View style={styles.emojiIconView}>
                <PopupMenuEmojiReaction
                  data={reactionDetails}
                  onChange={item => this.onMenuItemChange(item, item.commentId)}
                />
              </View>
            </View>
            {item.reactions && item.reactions.length > 0 ? (
              <FlatList
                style={styles.flalList}
                data={item.reactions}
                horizontal={true}
                renderItem={item => this.renderReactionDetailsList(item.item)}
                keyExtractor={item => item.reactionId}
              />
            ) : null}
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
        reactions: [],
      };
      this.setState({users: this.state.users.concat(comment)});
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

      await APIServices.addFileToTask(
        this.state.files,
      )
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

  render() {
    let users = this.state.users;
    let isFetching = this.state.isFetching;
    let usersLoading = this.props.usersLoading;
    let showEmojiPicker = this.state.showEmojiPicker;

    return (
      <MenuProvider>
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
                this.submitChatMessage();
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
  addFileIcon:{
    width: '23rem',
    height: '23rem',
    marginRight: '10rem',
  }
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
