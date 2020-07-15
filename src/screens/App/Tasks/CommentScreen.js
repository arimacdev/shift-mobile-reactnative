import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  Animated,
  Keyboard,
  Alert,
  UIManager,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Linking,
  Platform,
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
import ImagePicker from 'react-native-image-picker';
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
import RichTextEditor from '../../../components/RichTextEditor';
import MessageShowModal from '../../../components/MessageShowModal';
import RichTextEditorPell from '../../../components/RichTextEditorPell';
import EmptyListView from '../../../components/EmptyListView';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import PopupMenuUserList from '../../../components/PopupMenuUserList';
import DOMParser from 'react-native-html-parser';
import DomSelector from 'react-native-dom-parser';

const reactionDetails = [
  {value: '&#128077', text: '👍'},
  {value: '&#128154', text: '💚'},
  {value: '&#128514', text: '😂'},
  {value: '&#128545', text: '😡'},
  {value: '&#128546', text: '😢'},
];

const {State: TextInputState} = TextInput;

class ChatScreen extends Component {
  deleteDetails = {
    icon: icons.alertRed,
    type: 'confirm',
    title: 'Delete Comment',
    description:
      'You are about to permanantly delete this comment,\n If you are not sure, you can cancel this action.',
    buttons: {positive: 'Delete', negative: 'Cancel'},
  };
  selectedUserList = [];
  selectedUsers = [];

  onPressMessageModal = () => {};
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
      commentId: '',
      edit: false,
      currentlyOpenSwipeable: null,
      shift: new Animated.Value(0),
      isDeleteEvent: false,
      listHeghtWithKeyboard: '100%',
      selectedTag: 'body',
      selectedStyles: [],
      files: [],
      Uploading: 0,
      indeterminate: false,
      showMessageModal: false,
      timeTextChange: '',
      chatTextClear: false,
      currentKeyboardHeight: 0,
      isListLoadable: true,
      listStartIndex: 0,
      listEndIndex: 10,
      isEasyLoading: false,
      showEnterUrlModal: false,
      url: '',
      urlTitle: '',
      showUserListModal: false,
      userName: '',
      chatTextAll: '',
      ownCommnter: '',
    };
    this.editor = null;
  }

  componentWillMount() {
    if (Platform.OS == 'android') {
      AndroidKeyboardAdjust.setAdjustResize();
    }

    const {
      navigation: {
        state: {params},
      },
    } = this.props;

    let taskId = params.taskId;

    this.setState({
      taskId: taskId,
    });
    this.fetchData(taskId, this.state.listStartIndex, this.state.listEndIndex);
    this.keyboardDidShowSub = Keyboard.addListener(
      'keyboardDidShow',
      this.handleKeyboardDidShow,
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      'keyboardDidHide',
      this.handleKeyboardDidHide,
    );

    this.getUserId();
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
    if (this.rootSubscribed != null) {
      this.rootSubscribed.unsubscribe();
    }

    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();

    if (Platform.OS == 'android') {
      AndroidKeyboardAdjust.setAdjustPan();
    }
  }

  async getUserId() {
    let userId = await AsyncStorage.getItem('userID');
    this.setState({ownCommnter: userId});
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
            // if (messageDecode.sender != userId) {
            this.fetchData(
              taskId,
              this.state.listStartIndex,
              this.state.listEndIndex,
            );
            // }
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

  async fetchData(taskId, startIndex, endIndex) {
    this.setState({dataLoading: true});
    await APIServices.getCommentsData(taskId, 0, 10)
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false, comments: response.data});
          if (response.data.length == 10) {
            this.setState({isListLoadable: true});
          } else {
            this.setState({isListLoadable: false});
          }
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        // Utils.showAlert(true, '', error.data.message, this.props);
      });
  }

  async LazyFetchData(taskId, startIndex, endIndex) {
    this.setState({dataLoading: true});
    await APIServices.getCommentsData(taskId, startIndex, endIndex)
      .then(response => {
        if (response.message == 'success') {
          this.setState({
            comments: this.state.comments.concat(response.data),
            dataLoading: false,
          });
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        Utils.showAlert(true, '', 'Data loading error', this.props);
      });
  }

  onRefresh() {
    this.setState({isDeleteEvent: true, isEasyLoading: true});
    if (this.state.isListLoadable) {
      let startIndex = this.state.listStartIndex + 1 + 10;
      let endIndex = this.state.listEndIndex + 10;
      this.setState({isFetching: true}, function() {
        this.LazyFetchData(this.state.taskId, startIndex, endIndex);
        this.setState({listStartIndex: startIndex - 1, listEndIndex: endIndex});
      });
    } else {
      // show toast
    }
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
          this.sendMessageToSocket(item.value);
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        Utils.showAlert(true, '', 'Faild to submit the reaction', this.props);
      });
  }

  async onEditCommentPress(commentId, content) {
    await this.setState({
      chatText: content,
      commentId: commentId,
      edit: true,
      isDeleteEvent: true,
    });
    this.state.currentlyOpenSwipeable.recenter();

    // let html = await this.richText.current?.getContentHtml();
    // let src = '';
    // try {
    //   src = html.match(/src="([^"]*)/)[1];
    // } catch (error) {
    //   console.log('no image attached', src);
    // }

    // if (src != '') {
    //   await this.setState({
    //     chatText: this.state.chatText.replace(html,
    //       '<img src=' +
    //         src +
    //         ' class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; min-height: 0px; marginTop: 10px">',
    //     ),
    //   });
    // }
  }

  async updateComment() {
    let html = await this.richText.current?.getContentHtml();
    await this.setState({chatText: html});

    let commentId = this.state.commentId;
    let chatText = this.state.chatText;
    let taskId = this.state.taskId;

    if (chatText != '') {
      await APIServices.updateCommentData(commentId, chatText)
        .then(async response => {
          if (response.message == 'success') {
            this.setContentHTML('');
            this.blurContentEditor();
            this.getTagUsers(commentId, taskId);
            this.setState({dataLoading: false, edit: false});
            this.sendMessageToSocket(chatText);
          } else {
            this.setState({dataLoading: false});
          }
        })
        .catch(error => {
          this.setState({dataLoading: false});
          if (error.status == 401) {
            Utils.showAlert(
              true,
              '',
              'You cannot edit others comments',
              this.props,
            );
          } else {
            Utils.showAlert(true, '', error.data.message, this.props);
          }
        });
    } else {
      Utils.showAlert(true, '', 'Please enter a commant', this.props);
    }
  }

  async onDeleteCommentPress(commentId) {
    this.setState({isDeleteEvent: true});
    this.state.currentlyOpenSwipeable.recenter();
    this.setState({dataLoading: true, showMessageModal: false});
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
        if (error.status == 401) {
          Utils.showAlert(
            true,
            '',
            'You cannot delete others comments',
            this.props,
          );
        } else {
          Utils.showAlert(true, '', error.data.message, this.props);
        }
      });
  }

  onLinkPress(href) {
    Linking.canOpenURL(href).then(supported => {
      if (supported) {
        Linking.openURL(href);
      } else {
        Utils.showAlert(
          true,
          '',
          "Cannot open the link. May be missing 'http://'",
          this.props,
        );
      }
    });
  }

  renderCommentList(item) {
    let commentId = item.commentId;
    let ownComment = false;
    // let result = item.content.replace(/(<p[^>]+?>|<p>|<\/p>)/gi, '');

    if (item.commenter == this.state.ownCommnter) {
      ownComment = true;
    }

    const rightButtons = [
      <TouchableOpacity
        style={styles.leftContentButtonStyle}
        onPress={() => this.onEditCommentPress(item.commentId, item.content)}>
        <Image style={styles.controlIcon} source={icons.editRoundWhite} />
      </TouchableOpacity>,
      <TouchableOpacity
        style={styles.leftContentButtonStyle}
        onPress={() => this.deleteCommentAlert(item.commentId)}>
        <Image style={styles.controlIcon} source={icons.deleteRoundRed} />
      </TouchableOpacity>,
    ];

    return (
      <Swipeable
        style={styles.swipeableView}
        rightButtons={ownComment ? rightButtons : null}
        rightButtonWidth={EStyleSheet.value('50rem')}
        onRef={ref => (this.swipe = ref)}
        onRightButtonsOpenRelease={(event, gestureState, swipe) => {
          if (
            this.state.currentlyOpenSwipeable &&
            this.state.currentlyOpenSwipeable !== swipe
          ) {
            this.state.currentlyOpenSwipeable.recenter();
          }
          this.setState({currentlyOpenSwipeable: swipe});
        }}
        onRightButtonsCloseRelease={() =>
          this.setState({currentlyOpenSwipeable: null})
        }>
        <View style={styles.chatView}>
          {this.userImage(item)}
          <View style={{flex: 1}}>
            <View style={styles.timeView}>
              <Text style={styles.textTime}>
                {moment.parseZone(item.commentedAt).fromNow()}
              </Text>
            </View>
            <View style={styles.nameView}>
              <View style={styles.innerView}>
                <View style={{flex: 1}}>
                  <Text style={styles.text}>
                    {item.commenterFistName} {item.commenterLatName}
                  </Text>
                  {/* <Text style={styles.textChat}>{item.content}</Text> */}
                  <HTML
                    containerStyle={styles.htmlContentStyle}
                    html={item.content}
                    imagesMaxWidth={150}
                    ignoredStyles={['height', 'width']}
                    // imagesInitialDimensions={{width: 150, height: 150}}
                    onLinkPress={(event, href) => this.onLinkPress(href)}
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
    let html = await this.richText.current?.getContentHtml();
    await this.setState({chatText: html});
    let chatText = this.state.chatText;

    if (chatText != '') {
      let taskId = this.state.taskId;
      await APIServices.addCommentData(taskId, chatText)
        .then(async response => {
          if (response.message == 'success') {
            let commentId = response.data.commentId;
            this.setContentHTML('');
            this.blurContentEditor();
            this.getTagUsers(commentId, taskId);
            this.submitChatMessage(chatText);
          } else {
          }
        })
        .catch(error => {
          Utils.showAlert(true, '', error.data.message, this.props);
        });
    } else {
      Utils.showAlert(true, '', 'Please enter a commant', this.props);
    }
  }

  async submitChatMessage(chatText) {
    this.sendMessageToSocket(chatText);
  }

  addEmoji(emoji) {
    this.setState({
      chatText: this.state.chatText.concat(emoji),
      showEmojiPicker: false,
    });
    console.log(emoji);
  }

  onCloseTaskModal() {
    this.setState({showEnterUrlModal: false, url: '', urlTitle: ''});
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
    if (showEmojiPicker) {
      Keyboard.dismiss();
    }
  }

  async iOSFilePicker() {
    Alert.alert(
      'Add Files',
      'Select the file source',
      [
        {text: 'Camera', onPress: () => this.selectCamera()},
        {text: 'Gallery', onPress: () => this.selectGallery()},
        {text: 'Files', onPress: () => this.doumentPicker()},
        {text: 'Cancel', onPress: () => console.log('Back')},
      ],
      {
        cancelable: true,
      },
    );
  }

  async selectCamera() {
    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };
    ImagePicker.launchCamera(options, res => {
      if (res.didCancel) {
      } else if (res.error) {
      } else if (res.customButton) {
      } else {
        this.setImageForFile(res);
      }
    });
  }

  async selectGallery() {
    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };

    ImagePicker.launchImageLibrary(options, res => {
      if (res.didCancel) {
      } else if (res.error) {
      } else if (res.customButton) {
      } else {
        this.setImageForFile(res);
      }
    });
  }

  deleteCommentAlert(commentId) {
    this.deleteDetails = {
      icon: icons.alertRed,
      type: 'confirm',
      title: 'Delete Comment',
      description:
        'You are about to permanantly delete this comment,\n If you are not sure, you can cancel this action.',
      buttons: {positive: 'Delete', negative: 'Cancel'},
    };
    this.onPressMessageModal = () => this.onDeleteCommentPress(commentId);
    this.setState({showMessageModal: true});
    this.state.currentlyOpenSwipeable.recenter();
  }

  onPressCancel() {
    this.setState({showMessageModal: false});
  }

  onFilesCrossPress(uri) {
    this.setState({files: []}, () => {
      let filesArray = this.state.files.filter(item => {
        return item.uri !== uri;
      });
      this.setState({files: filesArray});
    });
  }

  async setImageForFile(res) {
    let taskId = this.state.taskId;
    this.onFilesCrossPress(res.uri);
    await this.state.files.push({
      uri: res.uri,
      type: res.type, // mime type
      // name: 'Img' + new Date().getTime() + '.png',
      name: res.fileName,
      size: res.fileSize,
      dateTime:
        moment().format('YYYY/MM/DD') + ' | ' + moment().format('HH:mm'),
    });
    this.setState({files: this.state.files}, () => {
      this.uploadFilesToComment(this.state.files, taskId);
    });
  }

  async uploadFilesToComment(files, taskId) {
    let html = await this.richText.current?.getContentHtml();
    await this.setState({chatText: html});

    await APIServices.uploadFileToComment(files, taskId)
      .then(response => {
        if (response.message == 'success') {
          // this.richText.current?.insertImage('https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1024px-React-icon.svg.png');
          this.richText.current?.blurContentEditor();
          this.setState({
            files: [],
            chatText: this.state.chatText.concat(
              '<img src=' +
                response.data +
                ' class="e-rte-image e-imginline" width="auto" height="auto" style="min-width: 0px; min-height: 0px; marginTop: 10px">&nbsp;',
            ),
          });
        } else {
          this.setState({files: []});
        }
      })
      .catch(error => {
        this.setState({files: []});
        if (error.status == 401) {
          Utils.showAlert(true, '', error.data.message, this.props);
        } else {
          Utils.showAlert(true, '', 'File upload failed!', this.props);
        }
      });
  }

  async doumentPicker() {
    // Pick multiple files
    let taskId = this.state.taskId;
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
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
      this.uploadFilesToComment(this.state.files, taskId);
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

    this.setState({chatText: '', showUserListModal: false});
    this.selectedUserList = [];
  }

  arrayCompare(a, b) {
    const dateA = a.commentedAt;
    const dateB = b.commentedAt;

    let comparison = 0;
    if (dateA > dateB) {
      comparison = 1;
    } else if (dateA < dateB) {
      comparison = -1;
    }
    return comparison;
  }

  handleKeyboardDidShow = event => {
    if (Platform.OS == 'ios') {
      const {height: windowHeight} = Dimensions.get('window');
      const keyboardHeight = event.endCoordinates.height;
      this.setState({
        currentKeyboardHeight: windowHeight - keyboardHeight - 200,
      });
      const currentlyFocusedField =
        TextInputState.currentlyFocusedField() == null
          ? 0
          : TextInputState.currentlyFocusedField();
      UIManager.measure(
        currentlyFocusedField,
        (originX, originY, width, height, pageX, pageY) => {
          const fieldHeight = height;
          const fieldTop = pageY;
          const gap =
            windowHeight - keyboardHeight - 20 - (fieldTop + fieldHeight);
          this.setState({
            listHeghtWithKeyboard:
              Platform.OS == 'ios'
                ? windowHeight - keyboardHeight - 80
                : windowHeight - 100,
          });
          if (gap >= 0) {
            return;
          }
          if (gap !== null && !isNaN(gap)) {
            Animated.timing(this.state.shift, {
              toValue: gap,
              duration: 100,
              useNativeDriver: true,
            }).start();
          }
        },
      );
    }
  };

  handleKeyboardDidHide = () => {
    if (Platform.OS == 'ios') {
      this.setState({currentKeyboardHeight: 0});
      this.setState({listHeghtWithKeyboard: '100%'});
      Animated.timing(this.state.shift, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  handleListScrollToEnd = () => {
    if (!this.state.isDeleteEvent) {
      this.flatList.scrollToEnd({animated: true});
    }
    this.setState({isDeleteEvent: false});
  };

  async getChatText(html) {
    await this.setState({chatText: html.toString()});
  }

  sendMessage() {
    let edit = this.state.edit;
    edit ? this.updateComment() : this.addComment();
  }

  getRefEditor(refEditor) {
    this.richText = refEditor;
  }

  async blurContentEditor() {
    await this.richText.current?.blurContentEditor();
  }

  async setContentHTML(content) {
    await this.richText.current?.setContentHTML(content);
  }

  onCrossPress() {
    this.setContentHTML('');
    this.blurContentEditor('');
    this.setState({chatText: '', userName: '', showUserListModal: false});
    this.selectedUserList = [];
  }

  onUrlChange(text) {
    this.setState({url: text});
  }

  addUrlPress() {
    let URL = this.state.url;
    let urlTitle = this.state.urlTitle != '' ? this.state.urlTitle : URL;
    this.setState({
      chatText: this.state.chatText.concat(
        '<div><a href=' + URL + '>' + urlTitle + '</a></div>',
      ),
    });
    this.onCloseTaskModal();
  }

  onUrlTitleChange(text) {
    this.setState({urlTitle: text});
  }

  renderEnterUrlModal() {
    return (
      <Modal
        isVisible={this.state.showEnterUrlModal}
        style={styles.modalStyleUrl}
        onBackButtonPress={() => this.onCloseTaskModal()}
        onBackdropPress={() => this.onCloseTaskModal()}
        onRequestClose={() => this.onCloseTaskModal()}
        coverScreen={false}
        backdropTransitionOutTiming={0}>
        <View style={styles.urlModalInnerStyle}>
          <Text style={styles.urlModalTitleStyle}>Insert Link</Text>
          <View style={styles.urlModalInputTextViewStyle}>
            <Text style={styles.urlModalTextStyle}>Web address</Text>
            <View style={styles.urlModalInputTextViewInnerStyle}>
              <TextInput
                style={styles.urlModalInputTextInnerStyle}
                placeholder={'http://example.com'}
                value={this.state.url}
                onChangeText={text => this.onUrlChange(text)}
              />
            </View>
          </View>
          <View style={styles.urlModalInputTextViewStyle}>
            <Text style={styles.urlModalTextStyle}>Display Name</Text>
            <View style={styles.urlModalInputTextViewInnerStyle}>
              <TextInput
                style={styles.urlModalInputTextInnerStyle}
                placeholder={'Enter Text'}
                value={this.state.urlTitle}
                onChangeText={text => this.onUrlTitleChange(text)}
              />
            </View>
          </View>
          <View style={styles.ButtonViewStyle}>
            <TouchableOpacity
              style={[
                styles.positiveStyle,
                {
                  backgroundColor:
                    this.state.url == ''
                      ? colors.lighterGray
                      : colors.lightGreen,
                },
              ]}
              disabled={this.state.url == '' ? true : false}
              onPress={() => this.addUrlPress()}>
              <Text style={styles.positiveTextStyle}>Insert</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelStyle}
              onPress={() => this.onCloseTaskModal()}>
              <Text style={styles.cancelTextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  showEnterUrlModal() {
    this.setState({showEnterUrlModal: true});
  }

  onChangeEditorText(text) {
    console.log('text', text);
    let replaceText = text;
    this.setState({chatTextAll: text});
    let subStringText = replaceText.substring(replaceText.indexOf(' @') + 1);

    if (subStringText.match('@')) {
      let name = subStringText.replace(/(<([^>]+)>)/gi, '');
      let n = name.lastIndexOf('@');
      let result = name.substring(n + 1);
      this.setState({showUserListModal: true, userName: result});
    }

    if (text == '') {
      this.setState({showUserListModal: false, chatText: ''});
      this.selectedUserList = [];
    }
    const rootNode = DomSelector(text);
    let userListData = rootNode.getElementsByTagName('var');
    let usersFromHtml = [];
    

    for (let index = 0; index < userListData.length; index++) {
      const element = userListData[index];
      let replacedName = element.children[0].text.replace('@', '');
      usersFromHtml.push(replacedName);
    }

    for (let i = 0; i < this.selectedUserList.length; i++) {
      const elementFirstArray = this.selectedUserList[i];
      for (let j = 0; j < usersFromHtml.length; j++) {
        const elementSecondArray = usersFromHtml[j];
        if (elementFirstArray.username.match(elementSecondArray)) {
          this.setState({showUserListModal: true, userName: elementSecondArray});
        }
      }
    }
  }

  async onSelectUser(item) {
    // let reg = /@\[([^\]]+?)\]\(id:([^\]]+?)\)/gim;

    this.selectedUserList.push({
      username: item.label,
      userId: item.key,
    });

    await this.setState({chatText: this.state.chatTextAll});

    let name = this.state.chatText;
    if (name.match('@')) {
      name = name.replace(/(<div[^>]+?>|<div>|<\/div>)/gi, '');
    }

    let replasedText = name
      .substring(0, name.lastIndexOf('@'))
      .replace('/' + this.state.userName + '/', '');

    await this.setState({
      showUserListModal: false,
      userName: '',
      chatText: replasedText.concat('<var>@' + item.label + '</var>&nbsp;'),
    });
  }

  async getTagUsers(commentId, taskId) {
    this.selectedUsers = [];
    let usersFromHtml = [];

    const rootNode = DomSelector(this.state.chatText);
    let userListData = rootNode.getElementsByTagName('var');

    for (let index = 0; index < userListData.length; index++) {
      const element = userListData[index];
      let replacedName = element.children[0].text.replace('@', '');
      usersFromHtml.push(replacedName);
    }

    for (let i = 0; i < this.selectedUserList.length; i++) {
      const elementFirstArray = this.selectedUserList[i];
      for (let j = 0; j < usersFromHtml.length; j++) {
        const elementSecondArray = usersFromHtml[j];
        if (elementFirstArray.username == elementSecondArray) {
          this.selectedUsers.push(elementFirstArray.userId);
        }
      }
    }

    if (this.selectedUsers.length > 0) {
      await APIServices.addCommentMentionNotificationData(
        commentId,
        taskId,
        this.selectedUsers,
      )
        .then(async response => {
          if (response.message == 'success') {
            console.log(response);
          } else {
            console.log('Faild');
          }
        })
        .catch(error => {
          Utils.showAlert(true, '', error.data.message, this.props);
        });
    }
  }

  renderUserListModal() {
    return (
      <PopupMenuUserList
        addPeopleModelVisible={this.state.showUserListModal}
        onSelect={item => this.onSelectUser(item)}
        userName={this.state.userName}
      />
    );
  }

  render() {
    let comments = this.state.comments;
    let isFetching = this.state.isFetching;
    let sortedData = comments.sort(this.arrayCompare);
    let edit = this.state.edit;
    const {shift} = this.state;

    return (
      <MenuProvider>
        <View style={styles.container}>
          <View
            style={{
              bottom:
                Platform.OS == 'ios' ? this.state.currentKeyboardHeight : 0,
            }}>
            <FlatList
              style={styles.flalList}
              data={sortedData}
              renderItem={item => this.renderCommentList(item.item)}
              keyExtractor={item => item.projId}
              onRefresh={() => this.onRefresh()}
              refreshing={isFetching}
              ref={ref => (this.flatList = ref)}
              onContentSizeChange={() => this.handleListScrollToEnd()}
              onLayout={() => this.handleListScrollToEnd()}
              ListEmptyComponent={<EmptyListView />}
            />
          </View>
          {/* <View
            style={{
              bottom:
                Platform.OS == 'ios' ? this.state.currentKeyboardHeight : 0,
            }}> */}
          <TouchableOpacity
            style={styles.crossIconStyle}
            onPress={() => this.onCrossPress()}>
            <Image
              style={styles.addFileIcon}
              source={icons.cross}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.sendIconStyle}
            onPress={() => {
              this.sendMessage();
            }}>
            <Image
              style={styles.chatIcon}
              source={icons.forwordGreen}
              resizeMode={'contain'}
            />
          </TouchableOpacity>
          <View style={styles.textEditorStyle}>
            <TouchableOpacity
              style={styles.crossIconStyle}
              onPress={() => this.onCrossPress()}>
              <Image
                style={styles.addFileIcon}
                source={icons.cross}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sendIconStyle}
              onPress={() => {
                this.sendMessage();
              }}>
              <Image
                style={styles.chatIcon}
                source={icons.forwordGreen}
                resizeMode={'contain'}
              />
            </TouchableOpacity>
            <RichTextEditorPell
              chatText={this.state.chatText}
              timeTextChange={this.state.timeTextChange}
              taskId={this.state.taskId}
              getRefEditor={refEditor => this.getRefEditor(refEditor)}
              doumentPicker={() => {
                Platform.OS == 'ios'
                  ? this.iOSFilePicker()
                  : this.doumentPicker();
              }}
              onInsertLink={() => this.showEnterUrlModal()}
              onChangeEditorText={text => this.onChangeEditorText(text)}
            />
          </View>
          {/* </View> */}
          {this.state.status != 'Connected' && <Loader />}
          {this.renderEnterUrlModal()}
          {this.renderUserListModal()}
          <MessageShowModal
            showMessageModal={this.state.showMessageModal}
            details={this.deleteDetails}
            onPress={this.onPressMessageModal}
            onPressCancel={() => this.onPressCancel(this)}
          />
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
    marginBottom: '135rem',
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
    height: '100rem',
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
    width: '23rem',
    height: '23rem',
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
    borderRadius: '5rem',
    backgroundColor: colors.white,
  },
  modalStyleUrl: {
    // justifyContent: 'flex-end',
    // margin: 0,
  },
  addFileIcon: {
    width: '18rem',
    height: '18rem',
    marginTop: '4rem',
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
  textEditorStyle: {
    height: '130rem',
    borderTopColor: colors.colorSilver,
    borderTopWidth: '0.5rem',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  crossIconStyle: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    alignSelf: 'flex-start',
    marginLeft: '15rem',
    alignItems: 'center',
    height: '50rem',
    marginBottom: '2rem',
  },
  sendIconStyle: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    zIndex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
    width: '35rem',
    height: '50rem',
    marginBottom: '2rem',
  },
  urlModalInnerStyle: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
    padding: '20rem',
  },
  urlModalTitleStyle: {
    fontSize: '20rem',
  },
  urlModalInputTextViewStyle: {
    marginTop: '20rem',
  },
  urlModalTextStyle: {
    fontSize: '15rem',
  },
  urlModalInputTextViewInnerStyle: {
    backgroundColor: colors.colorWhisper,
    borderRadius: '5rem',
    marginTop: '5rem',
    height: Platform.OS == 'ios' ? '35rem' : '50rem',
  },
  urlModalInputTextInnerStyle: {
    marginLeft: '10rem',
    marginTop: Platform.OS == 'ios' ? '10rem' : '0rem',
  },
  ButtonViewStyle: {
    flexDirection: 'row',
    marginTop: '20rem',
    marginBottom: '10rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positiveStyle: {
    flex: 1,
    height: '45rem',
    backgroundColor: colors.lightGreen,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
  },
  positiveTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
  },
  cancelStyle: {
    flex: 1,
    height: '45rem',
    marginLeft: '10rem',
    backgroundColor: colors.lightRed,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
  },
  cancelTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
  },
  htmlContentStyle: {
    marginLeft: '11rem',
    marginTop: '0rem',
    marginRight: '10rem',
  },
});

const mapStateToProps = state => {
  return {
    usersLoading: state.users.usersLoading,
    users: state.users.users,
  };
};

export default withStomp(
  connect(
    mapStateToProps,
    actions,
  )(ChatScreen),
);
