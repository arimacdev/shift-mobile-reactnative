import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
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

const initialLayout = {width: entireScreenWidth};

class MeetingDiscussionPointScreen extends Component {
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
          placeHolder: 'Enter action by for the meeting',
        },
        {
          id: 3,
          name: 'Target Date',
          placeHolder: 'Set target date for the meeting',
        },
        {
          id: 4,
          name: 'Remarks',
          placeHolder: 'Enter Remarks for the meeting',
        },
        {
          id: 5,
          name: 'Description',
          placeHolder: 'Enter description for the meeting',
        },
      ],
      showPicker: false,
      date: new Date(),
      targetDate: '',
      targetDateValue: '',
      textInputs: [],
      indexMain: 1,
      description: '',
      files: [],
      showImagePickerModal: false,
      showEnterUrlModal: false,
      url:'',
      urlTitle:'',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

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

  getRefEditor(refEditor) {
    this.richText = refEditor;
  }

  // onChangeEditorText(text) {
  //   this.setState({description: text});
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

  async onChangeText(text, index) {
    let {textInputs} = this.state;
    textInputs[index] = text;
    await this.setState({textInputs});
  }

  async addPoint() {
    let targetDate = this.state.targetDate;
    let targetDateValue = this.state.targetDateValue;
    let textInputs = this.state.textInputs;
    let projectID = this.props.selectedProjectID;
    let meetingTopic = textInputs[0];
    let meetingVenue = textInputs[1];
    let expectedDuration = textInputs[3];
    let indexMain = this.state.indexMain;

    let html = await this.richText.current?.getContentHtml();
    await this.setState({description: html});
    let description = this.state.description;

    if (this.validateFields(targetDate, textInputs, description)) {
      let targetDateFormatted = targetDateValue
        ? moment(targetDateValue, 'DD/MM/YYYY hh:mmA').format(
            'YYYY-MM-DD[T]HH:mm:ss',
          )
        : '';
      this.setState({dataLoading: true});
      await APIServices.initiatMeetingData(
        projectID,
        meetingTopic,
        meetingVenue,
        meetingScheduleDateTime,
        meetingActualDateTime,
        expectedDuration,
      )
        .then(response => {
          if (response.message == 'success') {
            this.setState({dataLoading: false, indexMain: indexMain + 1});
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

  validateFields(targetDate, textInputs, description) {
    if (!textInputs[0] && _.isEmpty(textInputs[0])) {
      Utils.showAlert(
        true,
        '',
        'Please enter the discussion point',
        this.props,
      );
      return false;
    }

    if (!textInputs[1] && _.isEmpty(textInputs[1])) {
      Utils.showAlert(
        true,
        '',
        'Please enter the action by for discussion point',
        this.props,
      );
      return false;
    }

    if (!targetDate && _.isEmpty(targetDate)) {
      Utils.showAlert(
        true,
        '',
        'Please set the target date for discussion point',
        this.props,
      );
      return false;
    }

    if (!textInputs[3] && _.isEmpty(textInputs[3])) {
      Utils.showAlert(
        true,
        '',
        'Please enter the remarks for discussion point',
        this.props,
      );
      return false;
    }

    if (!description && _.isEmpty(description)) {
      Utils.showAlert(
        true,
        '',
        'Please enter the description for discussion point',
        this.props,
      );
      return false;
    }

    return true;
  }

  onNextPress() {}

  onDiscussionItemPress(item) {
    switch (item.id) {
      case 3:
        this.setState({showPicker: true});
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

  renderDiscussionPointView(item, index) {
    let key = item.id;
    let value = this.state.targetDate;
    let description = this.state.description;

    switch (key) {
      case 3:
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
      case 1:
      case 2:
      case 4:
        return (
          <View>
            <Text style={styles.fieldName}>{item.name}</Text>
            <View style={styles.textInputFieldView}>
              <TextInput
                ref={ref => (this.textInputValuesArray[index] = ref)}
                style={styles.textInput}
                placeholder={item.placeHolder}
                value={this.state.textInputs[index]}
                onChangeText={text => this.onChangeText(text, index)}
                maxLength={100}
                onFocus={() => this.onFocusTextInput(index)}
              />
            </View>
          </View>
        );
      case 5:
        return (
          <View>
            <Text style={styles.fieldName}>{item.name}</Text>
            <View style={styles.textEditorStyle}>
              <RichTextEditorPell
                chatText={description}
                getRefEditor={refEditor => this.getRefEditor(refEditor)}
                doumentPicker={() => {
                  this.filePicker();
                }}
                onInsertLink={() => this.showEnterUrlModal()}
                onChangeEditorText={text => this.onChangeEditorText(text)}
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
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  flatListStyle: {
    marginBottom: '100rem',
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
    // height: '150rem',
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
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MeetingDiscussionPointScreen);
