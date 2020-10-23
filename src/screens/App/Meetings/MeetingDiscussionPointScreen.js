import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  Switch,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import APIServices from '../../../services/APIServices';
import Utils from '../../../utils/Utils';
import _ from 'lodash';
import ImagePicker from 'react-native-image-picker';
import RichTextEditorPell from '../../../components/RichTextEditorPell';
import FilePickerModal from '../../../components/FilePickerModal';
import Modal from 'react-native-modal';
import PopupMenu from '../../../components/PopupMenu';
import icons from '../../../asserts/icons/icons';
import FadeIn from 'react-native-fade-in-image';
import Loader from '../../../components/Loader';
import MessageShowModal from '../../../components/MessageShowModal';

class MeetingDiscussionPointScreen extends Component {
  details = {
    icon: icons.discussionPointRed,
    type: 'success',
    title: 'Sucsess',
    description: 'Discussion point has been added successfully',
    buttons: {},
  };
  textInputValuesArray = [];
  constructor(props) {
    super(props);
    this.state = {
      discusstionPointsArray: [
        {
          id: 1,
          name: 'Discussion point',
          placeHolder: 'Enter discussion point for the meeting',
        },
        {
          id: 2,
          name: 'Action By',
          placeHolder: 'Enter action by for discussion point',
        },
        {
          id: 3,
          name: 'Task Name',
          placeHolder: 'Enter task name',
        },
        {
          id: 4,
          name: 'Target Date',
          placeHolder: 'Set target date for discussion point',
        },
        {
          id: 5,
          name: 'Remarks',
          placeHolder: 'Enter Remarks for discussion point',
        },
        {
          id: 6,
          name: 'Description',
          placeHolder: 'Enter description for discussion point',
        },
      ],
      showPicker: false,
      date: new Date(),
      targetDate: '',
      targetDateValue: '',
      count: 1,
      textInputs: ['1'],
      indexMain: 1,
      description: '',
      files: [],
      showImagePickerModal: false,
      showEnterUrlModal: false,
      url: '',
      urlTitle: '',
      users: [],
      allUsers: [],
      popupMenuOpen: false,
      userName: '',
      userID: '',
      showMessageModal: false,
      actionByGuest: false,
      guestName: '',
      TaskName: '',
      convertToTask: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    this.getActiveUsers();
    let count = this.props.count;
    this.setState({
      count: count,
      textInputs: [count.toString()],
    });
  }

  hideDateTimePicker = () => {
    this.setState({showPicker: false});
  };

  handleDateTimeConfirm = selectedDateTime => {
    this.hideDateTimePicker();
    let dateTime = new Date(selectedDateTime);
    let newDateTime = '';
    let newDateTimeValue = '';

    newDateTime = moment(dateTime).format('MMMM DD, YYYY');
    newDateTimeValue = moment(dateTime).format('DD MM YYYY');

    this.setState({
      targetDate: newDateTime,
      targetDateValue: newDateTimeValue,
      date: new Date(dateTime),
    });
  };

  renderDateTimePicker() {
    let date = this.state.date;

    return (
      <View>
        <DateTimePickerModal
          isVisible={this.state.showPicker}
          date={date}
          mode={'date'}
          minimumDate={new Date()}
          onConfirm={this.handleDateTimeConfirm}
          onCancel={this.hideDateTimePicker}
        />
      </View>
    );
  }

  onFocusTextInput(index) {
    this.flatList.scrollToIndex({animated: true, index: index});
  }

  // getRefEditor(refEditor) {
  //   this.richText = refEditor;
  // }

  async filePicker() {
    this.setState({showImagePickerModal: true});
  }

  onCloseFilePickerModal() {
    this.setState({showImagePickerModal: false});
  }

  async selectCamera() {
    await this.setState({showImagePickerModal: false});

    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };

    setTimeout(() => {
      ImagePicker.launchCamera(options, res => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          Utils.showAlert(true, '', 'ImagePicker Error', this.props);
        } else if (res.customButton) {
          console.log('User tapped custom button');
        } else {
          this.setImageForFile(res);
        }
      });
    }, 100);
  }

  async selectGallery() {
    await this.setState({showImagePickerModal: false});

    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };

    setTimeout(() => {
      ImagePicker.launchImageLibrary(options, res => {
        if (res.didCancel) {
          console.log('User cancelled image picker');
        } else if (res.error) {
          Utils.showAlert(true, '', 'ImagePicker Error', this.props);
        } else if (res.customButton) {
          console.log('User tapped custom button');
        } else {
          this.setImageForFile(res);
        }
      });
    }, 100);
  }

  async setImageForFile(res) {
    let taskId = this.state.taskId;
    this.onFilesCrossPress(res.uri);
    let imgName = res.fileName;
    let fileSize = res.fileSize / 1000000;

    if (typeof imgName === 'undefined' || imgName == null) {
      var getFilename = res.uri.split('/');
      imgName = getFilename[getFilename.length - 1];
    }

    if (fileSize <= 10) {
      await this.state.files.push({
        uri: res.uri,
        type: res.type, // mime type
        name: imgName,
        size: res.fileSize,
        dateTime:
          moment().format('YYYY/MM/DD') + ' | ' + moment().format('HH:mm'),
      });
      this.setState({files: this.state.files}, () => {
        this.uploadFilesToComment(this.state.files, taskId);
      });
    } else {
      Utils.showAlert(
        true,
        '',
        'File size is too large. Maximum file upload size is 10MB',
        this.props,
      );
    }
  }

  onFilesCrossPress(uri) {
    this.setState({files: []}, () => {
      let filesArray = this.state.files.filter(item => {
        return item.uri !== uri;
      });
      this.setState({files: filesArray});
    });
  }

  async uploadFilesToComment(files, taskId) {
    let html = await this.richText.current?.getContentHtml();
    await this.setState({description: html});

    await APIServices.uploadFileToComment(files, taskId)
      .then(response => {
        if (response.message == 'success') {
          this.richText.current?.blurContentEditor();
          this.setState({
            files: [],
            description: this.state.description.concat(
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
        } else if (error.status == 413) {
          Utils.showAlert(
            true,
            '',
            'File size is too large. Maximum file upload size is 10MB',
            this.props,
          );
        } else {
          Utils.showAlert(true, '', 'File upload failed', this.props);
        }
      });
  }

  async onChangeText(text, index) {
    let removedText = '';
    if (index == 0) {
      removedText = text.replace(/\D+/g, '');
    } else {
      removedText = text;
    }

    let {textInputs} = this.state;
    textInputs[index] = removedText;
    await this.setState({textInputs});
  }

  onChangeDescriptionText(text) {
    this.setState({description: text});
  }

  async setContentHTML(content) {
    await this.richText.current?.setContentHTML(content);
  }

  async blurContentEditor() {
    await this.richText.current?.blurContentEditor();
  }

  async resetValues() {
    let count = this.state.count + 1;
    this.setState({
      date: new Date(),
      targetDate: '',
      targetDateValue: '',
      count: count,
      textInputs: [count.toString()],
      description: '',
      userID: '',
      userName: '',
      guestName: '',
      taskName: '',
      actionByGuest: false,
      convertToTask: false,
      popupMenuOpen: false,
    });
    this.props.addPeopleModal(false);
    // this.setContentHTML('');
  }

  async convertToTask(discussionId) {
    let textInputs = this.state.textInputs;
    let meetingId = this.props.meetingId;
    let projectId = this.props.selectedProjectID;
    let taskName = textInputs[2];
    let actionBy = this.state.userID;

    this.setState({dataLoading: true});
    await APIServices.convertToTaskData(
      meetingId,
      discussionId,
      projectId,
      taskName,
      actionBy,
    )
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false});
        } else {
          this.setState({dataLoading: false});
          Utils.showAlert(true, '', response.message, this.props);
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        Utils.showAlert(true, '', error.data.message, this.props);
      });
  }

  async addPoint() {
    let meetingDetails = this.props.meetingDetails;
    let targetDate = this.state.targetDate;
    let targetDateValue = this.state.targetDateValue;
    let textInputs = this.state.textInputs;
    let projectId = this.props.selectedProjectID;
    let meetingId = this.props.meetingId;
    let discussionPoint = textInputs[0];
    let actionByGuest = this.state.actionByGuest;
    let actionBy = actionByGuest ? this.state.guestName : this.state.userID;
    let remarks = textInputs[4];
    let convertToTask = this.state.convertToTask;

    // let html = await this.richText.current?.getContentHtml();
    // await this.setState({
    //   description: html,
    // });
    let description = '<html>' + this.state.description + '</html>';

    if (
      this.validateFields(
        targetDate,
        textInputs,
        actionBy,
        convertToTask,
        description,
        meetingDetails,
      )
    ) {
      let targetDateFormatted = targetDateValue
        ? moment(targetDateValue, 'DD/MM/YYYY hh:mmA').format(
            'YYYY-MM-DD[T]HH:mm:ss',
          )
        : '';
      this.setState({dataLoading: true, showMessageModal: false});
      await APIServices.addDiscussionPointData(
        meetingId,
        projectId,
        description,
        discussionPoint,
        remarks,
        actionBy,
        actionByGuest,
        targetDateFormatted,
      )
        .then(response => {
          if (response.message == 'success') {
            this.setState({dataLoading: false, showMessageModal: true});
            if (!actionByGuest && convertToTask) {
              this.convertToTask(response.data.minuteId);
            }
            this.resetValues();
          } else {
            this.setState({dataLoading: false});
            Utils.showAlert(true, '', response.message, this.props);
          }
        })
        .catch(error => {
          this.setState({dataLoading: false});
          Utils.showAlert(true, '', error.data.message, this.props);
        });
    }
  }

  validateFields(
    targetDate,
    textInputs,
    actionBy,
    convertToTask,
    description,
    meetingDetails,
  ) {
    if (!textInputs[0] && _.isEmpty(textInputs[0])) {
      Utils.showAlert(
        true,
        '',
        'Please enter the discussion point',
        this.props,
      );
      return false;
    }

    if (!actionBy && _.isEmpty(actionBy)) {
      Utils.showAlert(
        true,
        '',
        'Please enter the action by for discussion point',
        this.props,
      );
      return false;
    }

    if (convertToTask && !textInputs[2] && _.isEmpty(textInputs[2])) {
      Utils.showAlert(true, '', 'Please enter the task name', this.props);
      return false;
    }

    if (targetDate && !_.isEmpty(targetDate)) {
      let startDateFormatted = moment
        .parseZone(meetingDetails.meetingScheduleDateTime)
        .format('DD MM YYYY');
      let endDateFormatted = moment.parseZone(targetDate).format('DD MM YYYY');

      let startDate = moment(startDateFormatted, 'DD MM YYYY');
      let endDate = moment(endDateFormatted, 'DD MM YYYY');

      let totalDates = endDate.diff(startDate, 'days');
      if (totalDates < 0) {
        Utils.showAlert(
          true,
          '',
          'Target date cannot be a past date of meeting schedule',
          this.props,
        );
        return false;
      }
    }

    //Commnted for remove validations. For add the validations please uncomment.
    // if (!targetDate && _.isEmpty(targetDate)) {
    //   Utils.showAlert(
    //     true,
    //     '',
    //     'Please set the target date for discussion point',
    //     this.props,
    //   );
    //   return false;
    // }

    // if (!textInputs[4] && _.isEmpty(textInputs[4])) {
    //   Utils.showAlert(
    //     true,
    //     '',
    //     'Please enter the remarks for discussion point',
    //     this.props,
    //   );
    //   return false;
    // }

    // if (!description && _.isEmpty(description)) {
    //   Utils.showAlert(
    //     true,
    //     '',
    //     'Please enter the description for discussion point',
    //     this.props,
    //   );
    //   return false;
    // }

    return true;
  }

  onNextPress() {
    let indexMain = this.state.indexMain + 1;
    this.props.onChangeIndexMain(indexMain);
    this.props.onSetCount(this.state.count);
  }

  onDiscussionItemPress(item) {
    switch (item.id) {
      case 4:
        this.setState({showPicker: true});
        // this.blurContentEditor();
        break;
      default:
        break;
    }
  }

  showEnterUrlModal() {
    this.setState({showEnterUrlModal: true});
  }

  onCloseTaskModal() {
    this.setState({showEnterUrlModal: false, url: '', urlTitle: ''});
  }

  onUrlChange(text) {
    this.setState({url: text});
  }

  onUrlTitleChange(text) {
    this.setState({urlTitle: text});
  }

  async addUrlPress() {
    let html = await this.richText.current?.getContentHtml();
    let replacedHtml = html.replace(/(<div[^>]+?>|<div>|<\/div>)/gi, '');
    await this.setState({description: replacedHtml});
    let URL = this.state.url;
    let urlTitle = this.state.urlTitle != '' ? this.state.urlTitle : URL;
    this.setState({
      description: this.state.description.concat(
        ' <a href=' + URL + '>' + urlTitle + '</a>&nbsp;',
      ),
    });
    this.onCloseTaskModal();
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
              style={styles.cancelStyle}
              onPress={() => this.onCloseTaskModal()}>
              <Text style={styles.cancelTextStyle}>Cancel</Text>
            </TouchableOpacity>
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
          </View>
        </View>
      </Modal>
    );
  }

  onSelectUser = async item => {
    this.setState({
      userName: item.label,
      userID: item.key,
      popupMenuOpen: false,
    });
    await this.props.addPeopleModal(false);
    // this.blurContentEditor();
  };

  async onSearchTextChange(text) {
    await this.props.addPeopleModal(true);
    this.setState({userName: text, popupMenuOpen: true, userID: ''});
    let result = this.state.allUsers.filter(data =>
      data.label.toLowerCase().includes(text.toLowerCase()),
    );
    if (text == '') {
      this.setState({users: this.state.allUsers, userID: ''});
    } else {
      this.setState({users: result});
    }
  }

  renderMenuTrugger(placeHolder) {
    return (
      <View
        style={[
          styles.textInputFieldView,
          {
            marginRight: EStyleSheet.value('20rem'),
            marginLeft: EStyleSheet.value('5rem'),
          },
        ]}>
        <TextInput
          style={styles.textInput}
          placeholder={placeHolder}
          value={this.state.userName}
          onChangeText={text => this.onSearchTextChange(text)}
        />
      </View>
    );
  }

  userImage = function(item) {
    let userImage = item.userImage;

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
  };

  renderUserList(item) {
    const {navigation} = this.props;
    return (
      <View style={styles.userListStyle}>
        {this.userImage(item)}
        <View style={{flex: 1}}>
          <Text style={styles.userNameText}>{item.label}</Text>
        </View>
      </View>
    );
  }

  async getActiveUsers() {
    try {
      this.setState({dataLoading: true});
      let activeUsers = await APIServices.getActiveUsers();
      if (activeUsers.message == 'success') {
        let userList = [];
        for (let i = 0; i < activeUsers.data.length; i++) {
          if (activeUsers.data[i].firstName && activeUsers.data[i].lastName) {
            userList.push({
              key: activeUsers.data[i].userId,
              label:
                activeUsers.data[i].firstName +
                ' ' +
                activeUsers.data[i].lastName,
              userImage: activeUsers.data[i].profileImage,
            });
          }
        }
        userList.sort(this.arrayCompare);
        this.setState({
          users: userList,
          allUsers: userList,
          dataLoading: false,
        });
      } else {
        console.log('error');
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  arrayCompare(a, b) {
    const firstNameA = a.label.toUpperCase();
    const firstNameB = b.label.toUpperCase();

    let comparison = 0;
    if (firstNameA > firstNameB) {
      comparison = 1;
    } else if (firstNameA < firstNameB) {
      comparison = -1;
    }
    return comparison;
  }

  onPressCancel() {
    this.setState({showMessageModal: false});
  }

  setActionByGuest(value) {
    this.setState({
      actionByGuest: value,
      userID: '',
      userName: '',
      guestName: '',
    });

    if (value == true) {
      let {textInputs} = this.state;
      textInputs[2] = '';
      this.setState({textInputs, convertToTask: false, popupMenuOpen: false});
      this.props.addPeopleModal(false);
    }
  }

  onChangeActionByText(text) {
    this.setState({guestName: text});
  }

  setConvertToTask(value) {
    this.setState({
      convertToTask: value,
    });

    if (value == false) {
      let {textInputs} = this.state;
      textInputs[2] = '';
      this.setState({textInputs});
    }
  }

  renderDiscussionPointView(item, index) {
    let key = item.id;
    let value = this.state.targetDate;
    let description = this.state.description;
    let users = this.state.users;
    let actionByGuest = this.state.actionByGuest;
    let convertToTask = this.state.convertToTask;

    switch (key) {
      case 1:
      case 5:
        return (
          <View>
            <Text style={styles.fieldName}>{item.name}</Text>
            <View style={styles.textInputFieldView}>
              <TextInput
                ref={ref => (this.textInputValuesArray[index] = ref)}
                style={styles.textInput}
                placeholder={item.placeHolder}
                value={this.state.textInputs[index]}
                keyboardType={index == 0 ? 'numeric' : 'default'}
                onChangeText={text => this.onChangeText(text, index)}
                maxLength={100}
                // onFocus={() => this.onFocusTextInput(index)}
                // onBlur={() => this.blurContentEditor()}
              />
            </View>
          </View>
        );
      case 2:
        const optionsStyles = {
          optionsContainer: {
            marginTop: 1,
            width: '70%',
            marginLeft: 7,
          },
        };
        return (
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.3}}>
              <Text style={styles.fieldName}>By guest</Text>
              <View
                style={[
                  styles.textInputFieldView,
                  {marginRight: EStyleSheet.value('5rem')},
                ]}>
                <Switch
                  onValueChange={value => this.setActionByGuest(value)}
                  value={actionByGuest}
                  trackColor={colors.switchOnBgColor}
                  thumbColor={actionByGuest ? colors.switchColor : colors.gray}
                />
              </View>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={[
                  styles.fieldName,
                  {marginLeft: EStyleSheet.value('7rem')},
                ]}>
                {item.name}
              </Text>
              {actionByGuest ? (
                <View
                  style={[
                    styles.textInputFieldView,
                    {
                      marginRight: EStyleSheet.value('20rem'),
                      marginLeft: EStyleSheet.value('5rem'),
                    },
                  ]}>
                  <TextInput
                    style={styles.textInput}
                    placeholder={item.placeHolder}
                    value={this.state.guestName}
                    onChangeText={text => this.onChangeActionByText(text)}
                    maxLength={100}
                    // onBlur={() => this.blurContentEditor()}
                  />
                </View>
              ) : (
                <PopupMenu
                  menuTrigger={this.renderMenuTrugger(item.placeHolder)}
                  menuOptions={item => this.renderUserList(item)}
                  data={users}
                  onSelect={item => this.onSelectUser(item)}
                  open={this.state.popupMenuOpen}
                  customStyles={optionsStyles}
                />
              )}
            </View>
          </View>
        );
      case 3:
        return !actionByGuest ? (
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 0.3}}>
              <Text style={styles.fieldName}>To Task</Text>
              <View
                style={[
                  styles.textInputFieldView,
                  {marginRight: EStyleSheet.value('5rem')},
                ]}>
                <Switch
                  onValueChange={value => this.setConvertToTask(value)}
                  value={convertToTask}
                  trackColor={colors.switchOnBgColor}
                  thumbColor={convertToTask ? colors.switchColor : colors.gray}
                />
              </View>
            </View>
            <View style={{flex: 1}}>
              <Text
                style={[
                  styles.fieldName,
                  {marginLeft: EStyleSheet.value('7rem')},
                ]}>
                {item.name}
              </Text>

              <View
                style={[
                  styles.textInputFieldView,
                  {
                    marginRight: EStyleSheet.value('20rem'),
                    marginLeft: EStyleSheet.value('5rem'),
                  },
                ]}>
                <TextInput
                  style={styles.textInput}
                  editable={convertToTask}
                  placeholder={item.placeHolder}
                  value={this.state.textInputs[index]}
                  onChangeText={text => this.onChangeText(text, index)}
                  maxLength={100}
                  // onBlur={() => this.blurContentEditor()}
                />
              </View>
            </View>
          </View>
        ) : null;
      case 4:
        return (
          <View>
            <Text style={styles.fieldName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.textInputFieldView}
              onPress={() => this.onDiscussionItemPress(item)}>
              {value != '' ? (
                <Text style={styles.textInput}>{value}</Text>
              ) : (
                <Text
                  style={[styles.textInput, {color: colors.colorGreyChateau}]}>
                  {item.placeHolder}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        );
      case 6:
        return (
          <View>
            <Text style={styles.fieldName}>{item.name}</Text>

            {/* Commented because of the issue in RichTextEditorPell. 
            If this used in flatlist all the screen will blinking.*/}
            {/* <View style={styles.textEditorStyle}>
              <RichTextEditorPell
                chatText={description}
                fromActions={true}
                getRefEditor={refEditor => this.getRefEditor(refEditor)}
                doumentPicker={() => {
                  this.filePicker();
                }}
                onInsertLink={() => this.showEnterUrlModal()}
              />
            </View> */}
            <View
              style={[
                styles.textInputFieldView,
                {height: EStyleSheet.value('150rem')},
              ]}>
              <TextInput
                ref={ref => (this.textInputValuesArray[index] = ref)}
                style={[
                  styles.textInput,
                  {height: EStyleSheet.value('150rem')},
                ]}
                placeholder={item.placeHolder}
                value={description}
                onChangeText={text => this.onChangeDescriptionText(text)}
                multiline={true}
                textAlignVertical={'top'}
              />
            </View>
          </View>
        );
      default:
        break;
    }
  }

  render() {
    let discusstionPointsArray = this.state.discusstionPointsArray;
    let dataLoading = this.state.dataLoading;

    return (
      <View style={styles.container}>
        <FlatList
          ref={r => (this.flatList = r)}
          style={styles.flatListStyle}
          data={discusstionPointsArray}
          renderItem={({item, index}) =>
            this.renderDiscussionPointView(item, index)
          }
          keyExtractor={item => item.id}
        />
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.addPoint()}>
            <Text style={styles.buttonText}>Add Discussion Point</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.colorDeepSkyBlue}]}
            onPress={() => this.onNextPress()}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
        <FilePickerModal
          showFilePickerModal={this.state.showImagePickerModal}
          onPressCancel={() => this.onCloseFilePickerModal()}
          selectCamera={() => this.selectCamera()}
          selectFiles={() => this.selectGallery()}
        />
        {this.state.showPicker ? this.renderDateTimePicker() : null}
        {this.renderEnterUrlModal()}
        <MessageShowModal
          showMessageModal={this.state.showMessageModal}
          details={this.details}
          onPress={() => {}}
          onPressCancel={() => this.onPressCancel(this)}
        />
        {dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  flatListStyle: {
    marginBottom: '80rem',
  },
  fieldName: {
    marginHorizontal: '20rem',
    marginTop: '10rem',
    fontSize: '10rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.projectTaskNameColor,
  },
  textInputFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
  },
  textInput: {
    fontSize: '11rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.colorApple,
    borderRadius: '5rem',
    marginTop: '17rem',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '50rem',
    marginHorizontal: '5rem',
  },
  buttonText: {
    flex: 1,
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: '0rem',
    marginBottom: '15rem',
    flexDirection: 'row',
    marginHorizontal: '15rem',
  },
  textEditorStyle: {
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    borderColor: colors.colorSilver,
    borderWidth: '0.5rem',
    marginHorizontal: '20rem',
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
    marginLeft: '10rem',
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
  userIcon: {
    width: '45rem',
    height: '45rem',
    borderRadius: 90 / 2,
  },
  userListStyle: {
    height: '50rem',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '20rem',
    borderBottomWidth: 1,
    borderBottomColor: colors.lighterGray,
  },
  userNameText: {
    fontSize: '12rem',
    color: colors.projectText,
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MeetingDiscussionPointScreen);
