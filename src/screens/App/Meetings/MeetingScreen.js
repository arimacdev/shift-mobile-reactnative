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
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import EmptyListView from '../../../components/EmptyListView';
import icons from '../../../asserts/icons/icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';


const initialLayout = {width: entireScreenWidth};

class MeetingScreen extends Component {
  taskNameTextInput = [];
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
      dateOfMeeting: '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  onChangeText(text) {}

  initiateMeeting() {}

  hideDateTimePicker = () => {
    this.setState({showPicker: false});
  };

  handleDateTimeConfirm = date => {
    this.hideDateTimePicker();
    let dateOfMeeting = new Date(date);
    let newDate = '';
    let newDateValue = '';

    newDate = moment(dateOfMeeting).format('MMMM DD, YYYY');
    newDateValue = moment(dateOfMeeting).format('DD MM YYYY');

    if (this.state.date && !this.state.actual) {
      this.setState({
        dateOfMeeting: newDate,
        dateOfMeetingValue: newDateValue,
        date: new Date(dateOfMeeting),
      });
    } else if (!this.state.date && this.state.actual) {
      this.setState({
        actualTimeOfMeeting: newDate,
        actualTimeOfMeetingValue: newDateValue,
        actualTime: new Date(dateOfMeeting),
      });
    } else {
      this.setState({
        scheduleTimeOfMeeting: newDate,
        scheduleTimeOfMeetingValue: newDateValue,
        scheduleTime: new Date(dateOfMeeting),
      });
    }
  };

  renderDateTimePicker() {
    return (
      <View>
        <DateTimePickerModal
          isVisible={this.state.showPicker}
          mode="date"
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

  renderView(item) {
    let key = item.id;
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
              {this.state.dateOfMeeting != '' ? (
                <Text
                  style={styles.textInput}>
                  {this.state.dateOfMeeting}
                </Text>
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
                ref={input => {
                  this.taskNameTextInput = input;
                }}
                style={styles.textInput}
                placeholder={item.placeHolder}
                multiline={true}
                value={''}
                onChangeText={text => this.onChangeText(text)}
                maxLength={100}
                multiline={true}
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
          renderItem={({item}) => this.renderView(item)}
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
    bottom: 0,
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
