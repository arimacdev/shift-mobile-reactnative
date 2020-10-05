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
import EStyleSheet, {value} from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import APIServices from '../../../services/APIServices';
import Utils from '../../../utils/Utils';
import _ from 'lodash';
import MeetingDiscussionPointScreen from './MeetingDiscussionPointScreen';
import MeetingOtherDetailsScreen from './MeetingOtherDetailsScreen';

const initialLayout = {width: entireScreenWidth};

class MeetingViewScreen extends Component {
  textInputValuesArray = [];
  constructor(props) {
    super(props);
    this.state = {
      indexMain: 3,
      meetings: [],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  async loadMeetings() {
    this.setState({dataLoading: true});
    await APIServices.loadMeetingsData(projectID)
      .then(response => {
        if (response.message == 'success') {
          this.setState({
            dataLoading: false,
            meetings: response.data.meetingId,
          });
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
          minimumDate={new Date()}
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

  onFocusTextInput(index) {
    this.flatList.scrollToIndex({animated: true, index: index});
  }

  onChangeIndexMain(indexMain) {
    this.setState({indexMain: indexMain});
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
                keyboardType={index == 5 ? 'numeric' : 'default'}
                onChangeText={text => this.onChangeText(text, index)}
                maxLength={100}
                onFocus={() => this.onFocusTextInput(index)}
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
    let indexMain = this.state.indexMain;

    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <FlatList
            ref={r => (this.flatList = r)}
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
        </View>
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
)(MeetingViewScreen);
