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

const initialLayout = {width: entireScreenWidth};

class MeetingScreen extends Component {
  textInputValuesArray = [];
  constructor(props) {
    super(props);
    this.state = {
      textInputArray: [
        {
          id: 1,
          name: 'Date for the meeting',
          placeHolder: 'Set date for the meeting',
        },
        {
          id: 2,
          name: 'Venue for the meeting',
          placeHolder: 'Enter venue for the meeting',
        },
        {
          id: 3,
          name: 'Topic for the meeting',
          placeHolder: 'Enter topic for the meeting',
        },
        {
          id: 4,
          name: 'Schedule time of start',
          placeHolder: 'Set schedule time of start',
        },
        {
          id: 5,
          name: 'Actual time of start',
          placeHolder: 'Set actual time of start',
        },
        {
          id: 6,
          name: 'Planned duration of the meeting (min)',
          placeHolder: 'Enter planned duration of the meeting (min)',
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
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  async onChangeText(text, index) {
    let {textInputs} = this.state;
    textInputs[index] = text;
    await this.setState({textInputs});
  }

  async initiateMeeting() {
    let dateOfMeeting = this.state.dateOfMeeting;
    let scheduleTimeOfMeeting = this.state.scheduleTimeOfMeeting;
    let actualTimeOfMeeting = this.state.actualTimeOfMeeting;
    let textInputs = this.state.textInputs;
    // APIServices.initiatMeetingData
    this.validateProject(
      dateOfMeeting,
      scheduleTimeOfMeeting,
      actualTimeOfMeeting,
      textInputs,
    );
  }

  validateProject(
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
      let startTime = moment(scheduleTimeOfMeeting, 'hh:mm A');
      let todayTime = moment(new Date()).format('hh:mm A');
      let endTime = moment(todayTime, 'hh:mm A');
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
      let startTime = moment(scheduleTimeOfMeeting, 'hh:mm A');
      let endTime = moment(actualTimeOfMeeting, 'hh:mm A');
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
      newDateTime = moment(dateTime).format('hh:mm A');
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

  onItemPress(item) {
    switch (item.id) {
      case 1:
        this.setState({showPicker: true, date: true, actual: false});
        break;
      case 4:
        this.setState({showPicker: true, date: false, actual: false});
        break;
      case 5:
        this.setState({showPicker: true, date: false, actual: true});
        break;
      default:
        break;
    }
  }

  getChangedValue(item) {
    let key = item.id;
    let value = '';
    switch (key) {
      case 1:
        value = this.state.dateOfMeeting;
        break;
      case 4:
        value = this.state.scheduleTimeOfMeeting;
        break;
      case 5:
        value = this.state.actualTimeOfMeeting;
        break;
      default:
        break;
    }

    return value;
  }

  renderView(item, index) {
    let key = item.id;
    let value = this.getChangedValue(item);
    switch (key) {
      case 1:
      case 4:
      case 5:
        return (
          <View>
            <Text style={styles.fieldName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.textInputFieldView}
              onPress={() => this.onItemPress(item)}>
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
      case 2:
      case 3:
      case 6:
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
              />
            </View>
          </View>
        );
      default:
        break;
    }
  }

  render() {
    let textInputArray = this.state.textInputArray;
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flatListStyle}
          data={textInputArray}
          renderItem={({item, index}) => this.renderView(item, index)}
          keyExtractor={item => item.id}
        />
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => this.initiateMeeting()}>
            <View style={styles.button}>
              <Text style={styles.buttonText}>Initiate Meeting</Text>
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
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MeetingScreen);
