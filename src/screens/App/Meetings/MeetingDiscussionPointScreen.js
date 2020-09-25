import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import EStyleSheet, {value} from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import EmptyListView from '../../../components/EmptyListView';
import icons from '../../../asserts/icons/icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import APIServices from '../../../services/APIServices';
import Utils from '../../../utils/Utils';
import _ from 'lodash';
import RichTextEditorPell from '../../../components/RichTextEditorPell';

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
      date: false,
      actual: false,
      dateMeeting: new Date(),
      scheduleTime: new Date(),
      actualTime: new Date(),
      dateOfMeetingValue: '',
      dateOfMeeting: '',
      scheduleTimeOfMeeting: '',
      actualTimeOfMeeting: '',
      textInputs: [],
      indexMain: 1,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  async onChangeText(text, index) {
    let removedText = '';
    if (index == 5) {
      removedText = text.replace(/\D+/g, '');
    } else {
      removedText = text;
    }

    let {textInputs} = this.state;
    textInputs[index] = removedText;
    await this.setState({textInputs});
  }

  async initiateMeeting() {
    let dateOfMeeting = this.state.dateOfMeeting;
    let dateOfMeetingValue = this.state.dateOfMeetingValue;
    let scheduleTimeOfMeeting = this.state.scheduleTimeOfMeeting;
    let actualTimeOfMeeting = this.state.actualTimeOfMeeting;
    let textInputs = this.state.textInputs;
    let projectID = this.props.selectedProjectID;
    let meetingTopic = textInputs[1];
    let meetingVenue = textInputs[2];
    let expectedDuration = textInputs[5];
    let indexMain = this.state.indexMain;

    if (
      this.validateFields(
        dateOfMeeting,
        scheduleTimeOfMeeting,
        actualTimeOfMeeting,
        textInputs,
      )
    ) {
      let meetingScheduleDateTime = dateOfMeetingValue
        ? moment(
            dateOfMeetingValue + scheduleTimeOfMeeting,
            'DD/MM/YYYY hh:mmA',
          ).format('YYYY-MM-DD[T]HH:mm:ss')
        : '';
      let meetingActualDateTime = dateOfMeetingValue
        ? moment(
            dateOfMeetingValue + actualTimeOfMeeting,
            'DD/MM/YYYY hh:mmA',
          ).format('YYYY-MM-DD[T]HH:mm:ss')
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

  validateFields(
    dateOfMeeting,
    scheduleTimeOfMeeting,
    actualTimeOfMeeting,
    textInputs,
  ) {
    if (!dateOfMeeting && _.isEmpty(dateOfMeeting)) {
      Utils.showAlert(
        true,
        '',
        'Please set the date for the meeting',
        this.props,
      );
      return false;
    }

    if (!textInputs[1] && _.isEmpty(textInputs[1])) {
      Utils.showAlert(
        true,
        '',
        'Please enter the vanue for the meeting',
        this.props,
      );
      return false;
    }

    if (!textInputs[2] && _.isEmpty(textInputs[2])) {
      Utils.showAlert(
        true,
        '',
        'Please enter the topic for the meeting',
        this.props,
      );
      return false;
    }

    if (scheduleTimeOfMeeting && !_.isEmpty(scheduleTimeOfMeeting)) {
      let startTime = moment(scheduleTimeOfMeeting, 'hh:mmA');
      let todayTime = moment(new Date()).format('hh:mmA');
      let endTime = moment(todayTime, 'hh:mmA');
      let totalHours = startTime.diff(endTime, 'seconds');
      if (totalHours < 0) {
        Utils.showAlert(
          true,
          '',
          'Start time cannot be a past time',
          this.props,
        );
        return false;
      }
    } else {
      Utils.showAlert(
        true,
        '',
        'Please set the schedule time for the meeting',
        this.props,
      );
      return false;
    }

    if (actualTimeOfMeeting && !_.isEmpty(actualTimeOfMeeting)) {
      let startTime = moment(scheduleTimeOfMeeting, 'hh:mmA');
      let endTime = moment(actualTimeOfMeeting, 'hh:mmA');
      let totalTime = endTime.diff(startTime, 'seconds');
      if (totalTime < 0) {
        Utils.showAlert(
          true,
          '',
          'Actual time should be after schedule time',
          this.props,
        );
        return false;
      }
    } else {
      Utils.showAlert(
        true,
        '',
        'Please set the actual time for the meeting',
        this.props,
      );
      return false;
    }

    if (!textInputs[5] && _.isEmpty(textInputs[5])) {
      Utils.showAlert(
        true,
        '',
        'Please enter the planned duration for the meeting',
        this.props,
      );
      return false;
    }

    return true;
  }

  hideDateTimePicker = () => {
    this.setState({showPicker: false});
  };

  handleDateTimeConfirm = selectedDateTime => {
    this.hideDateTimePicker();
    let dateTime = new Date(selectedDateTime);
    let newDateTime = '';
    let newDateTimeValue = '';

    if (this.state.date && !this.state.actual) {
      newDateTime = moment(dateTime).format('MMMM DD, YYYY');
      newDateTimeValue = moment(dateTime).format('DD MM YYYY');
    } else {
      newDateTime = moment(dateTime).format('hh:mmA');
    }

    if (this.state.date && !this.state.actual) {
      this.setState({
        dateOfMeeting: newDateTime,
        dateOfMeetingValue: newDateTimeValue,
        dateMeeting: new Date(dateTime),
      });
    } else if (!this.state.date && this.state.actual) {
      this.setState({
        actualTimeOfMeeting: newDateTime,
        actualTime: new Date(dateTime),
      });
    } else {
      this.setState({
        scheduleTimeOfMeeting: newDateTime,
        scheduleTime: new Date(dateTime),
      });
    }
  };

  renderDateTimePicker() {
    let date = this.state.date;
    let actual = this.state.actual;
    let dateMeeting = this.state.dateMeeting;
    let actualTime = this.state.actualTime;
    let scheduleTime = this.state.scheduleTime;

    return (
      <View>
        <DateTimePickerModal
          isVisible={this.state.showPicker}
          date={
            date && !actual
              ? dateMeeting
              : !date && actual
              ? actualTime
              : scheduleTime
          }
          mode={date && !actual ? 'date' : 'time'}
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

  onDiscussionItemPress(item) {
    switch (item.id) {
      case 3:
        this.setState({showPicker: true, date: true, actual: false});
        break;
      default:
        break;
    }
  }

  renderDiscussionPointView(item, index) {
    let key = item.id;
    let value = this.state.dateOfMeeting;
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
                chatText={this.state.chatText}
                timeTextChange={this.state.timeTextChange}
                taskId={this.state.taskId}
                getRefEditor={refEditor => this.getRefEditor(refEditor)}
                doumentPicker={() => {
                  this.FilePicker();
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
          <TouchableOpacity onPress={() => this.initiateMeeting()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Add Discussion Point</Text>
            </View>
          </TouchableOpacity>
        </View>

        {this.state.showPicker ? this.renderDateTimePicker() : null}
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
    flexDirection: 'row',
    backgroundColor: colors.colorApple,
    borderRadius: '5rem',
    marginTop: '17rem',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '50rem',
    marginHorizontal: '20rem',
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
    width: '100%',
    marginBottom: '15rem',
  },
  textEditorStyle: {
    height: '130rem',
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    borderColor: colors.colorSilver,
    borderWidth: '0.5rem',
    marginHorizontal: '20rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MeetingDiscussionPointScreen);
