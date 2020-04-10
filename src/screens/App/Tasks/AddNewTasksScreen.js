import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';

let dropData = [
  {
    value: 'Status',
  },
  {
    value: 'Completed',
  },
  {
    value: 'Not started',
  },
  {
    value: 'QA',
  },
  {
    value: 'Unassigned',
  },
  {
    value: 'Assigned',
  },
];

class AddNewTasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          taskId: '0001',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: '#ffc213',
          taskCompletion: false,
          taskDate: 'Yesterday',
          avatr: icons.whiteCircule,
        },
        {
          taskId: '0002',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: 'red',
          taskCompletion: false,
          taskDate: 'Today',
          avatr: icons.folder,
        },
        {
          taskId: '0003',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: 'gray',
          taskCompletion: false,
          taskDate: '2020/02/03',
          avatr: icons.folder,
        },
        {
          taskId: '0004',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: 'gray',
          taskCompletion: true,
          taskDate: '2020/01/12',
          avatr: icons.folder,
        },
      ],
      index: 0,
      bottomItemPressColor: colors.darkBlue,
      showPicker: false,
      showTimePicker: false,
      selectedDate: '',
      date: new Date(),
      selectedDateReminder: '',
      selectedTimeReminder: '',
      dateReminder: new Date(),
      timeReminder: new Date(),
      mode: 'date',
      reminder: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  renderProjectList(item) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('TasksScreen', {taskDetails: item})
        }>
        <View style={styles.projectView}>
          <Image
            style={styles.completionIcon}
            source={
              item.taskCompletion == true
                ? icons.rightCircule
                : icons.whiteCircule
            }
          />
          <View style={{flex: 1}}>
            <Text style={styles.text}>{item.taskName}</Text>
          </View>
          <View style={styles.statusView}>
            <Text style={[styles.textDate, {color: item.taskStatusColor}]}>
              {item.taskDate}
            </Text>
            <Image style={styles.avatarIcon} source={item.avatr} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderBase() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Image style={styles.dropIcon} source={icons.arrowDark} />
      </View>
    );
  }

  onChangeDate(event, selectedDate) {
    let date = new Date(selectedDate);
    // const NewDate = moment(date, 'DD-MM-YYYY')

    let NewDate =
      date.getDate() +
      '/' +
      parseInt(date.getMonth() + 1) +
      '/' +
      date.getFullYear();

    // console.log("event.type",event.type)
    if (event.type == 'set') {
      if (this.state.reminder) {
        this.setState({
          selectedDateReminder: NewDate,
          showPicker: false,
          showTimePicker: true,
          dateReminder: new Date(selectedDate),
        });
      } else {
        this.setState({
          selectedDate: NewDate,
          showPicker: false,
          showTimePicker: false,
          date: new Date(selectedDate),
        });
      }
    }
    // event.dismissed
    // event.set
  }

  onChangeTime(event, selectedTime) {
    let time = new Date(selectedTime);
    let newTime = time.getHours() + ':' + time.getMinutes();

    if (event.type == 'set') {
      if (this.state.reminder) {
        this.setState({
          selectedTimeReminder: newTime,
          showPicker: false,
          showTimePicker: false,
          timeReminder: new Date(selectedTime),
        });
      }
    }
  }

  renderDatePicker() {
    return (
      <DateTimePicker
        testID="dateTimePicker"
        timeZoneOffsetInMinutes={0}
        value={
          this.state.reminder == true
            ? this.state.dateReminder
            : this.state.date
        }
        mode={this.state.mode}
        is24Hour={true}
        display="default"
        onChange={(event, selectedDate) =>
          this.onChangeDate(event, selectedDate)
        }
      />
    );
  }

  renderTimePicker() {
    return (
      <DateTimePicker
        testID="dateTimePicker"
        timeZoneOffsetInMinutes={0}
        value={this.state.date}
        mode={'time'}
        is24Hour={true}
        display="default"
        onChange={(event, selectedDate) =>
          this.onChangeTime(event, selectedDate)
        }
      />
    );
  }

  

  async doumentPicker() {
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.images],
      });
      for (const res of results) {
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size,
        );
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  }

  render() {
    return (
      <ScrollView style={{marginBottom: 90}}>
        <View style={[styles.taskFieldView, {marginTop: 30}]}>
          <TextInput
            style={styles.textInput}
            placeholder={'Task name'}
            value={this.state.password}
            onChangeText={text => this.onPasswordChange(text)}
          />
        </View>
        <View style={styles.taskFieldView}>
          <Dropdown
            style={{paddingLeft: 5}}
            label=""
            labelFontSize={0}
            fontSize={13}
            data={dropData}
            textColor={colors.gray}
            error={''}
            animationDuration={0.5}
            containerStyle={{width: '100%'}}
            overlayStyle={{width: '100%'}}
            pickerStyle={{width: '89%', marginTop: 70, marginLeft: 15}}
            dropdownPosition={0}
            value={'Assignee'}
            itemColor={'black'}
            selectedItemColor={'black'}
            dropdownOffset={{top: 10}}
            baseColor={colors.projectBgColor}
            // renderBase={this.renderBase}
            renderAccessory={this.renderBase}
            itemTextStyle={{marginLeft: 15}}
            itemPadding={10}
          />
        </View>
        <View style={styles.taskFieldView}>
          <Dropdown
            style={{paddingLeft: 5}}
            label=""
            labelFontSize={0}
            fontSize={13}
            data={dropData}
            textColor={colors.gray}
            error={''}
            animationDuration={0.5}
            containerStyle={{width: '100%'}}
            overlayStyle={{width: '100%'}}
            pickerStyle={{width: '89%', marginTop: 70, marginLeft: 15}}
            dropdownPosition={0}
            value={'Tasks Status'}
            itemColor={'black'}
            selectedItemColor={'black'}
            dropdownOffset={{top: 10}}
            baseColor={colors.projectBgColor}
            // renderBase={this.renderBase}
            renderAccessory={this.renderBase}
            itemTextStyle={{marginLeft: 15}}
            itemPadding={10}
          />
        </View>
        <TouchableOpacity
          onPress={() =>
            this.setState({showPicker: true, reminder: false, mode: 'date'})
          }>
          <View style={[styles.taskFieldView, {flexDirection: 'row'}]}>
            <Text style={[styles.textInput, {flex: 1}]}>
              {this.state.selectedDate == ''
                ? 'Due Date'
                : this.state.selectedDate}
            </Text>
            <Image
              style={styles.calendarIcon}
              source={icons.calendar}
              resizeMode={'center'}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            this.setState({showPicker: true, reminder: true, mode: 'date'})
          }>
          <View style={[styles.taskFieldView, {flexDirection: 'row'}]}>
            <Text style={[styles.textInput, {flex: 1}]}>
              {this.state.selectedDateReminder == ''
                ? 'Reminder'
                : this.state.selectedTimeReminder +
                  ' ' +
                  this.state.selectedDateReminder}
            </Text>
            <Image
              style={styles.calendarIcon}
              source={icons.calendar}
              resizeMode={'center'}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.doumentPicker()}>
          <View style={[styles.taskFieldView, {flexDirection: 'row'}]}>
            <Image
              style={[styles.calendarIcon, {marginRight: 10}]}
              source={icons.upload}
              resizeMode={'center'}
            />
            <Text style={[styles.textInput, {flex: 1}]}>
              {this.state.selectedDateReminder == ''
                ? 'Add files'
                : this.state.selectedTimeReminder +
                  ' ' +
                  this.state.selectedDateReminder}
            </Text>
          </View>
        </TouchableOpacity>

        {this.state.showPicker ? this.renderDatePicker() : null}
        {this.state.showTimePicker ? this.renderTimePicker() : null}
      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    // width: '330rem',
    marginTop: '0rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '60rem',
    marginHorizontal: '20rem',
  },
  textFilter: {
    fontSize: '14rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'center',
    // fontWeight: 'bold',
  },
  projectView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    height: '60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '12rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  textDate: {
    fontSize: '9rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  avatarIcon: {
    width: '20rem',
    height: '20rem',
    marginLeft: 10,
  },
  statusView: {
    // backgroundColor: colors.gray,
    // width:'5rem',
    // height:'60rem',
    alignItems: 'center',
    flexDirection: 'row',
    // borderTopRightRadius: 5,
    // borderBottomRightRadius: 5,
  },
  dropIcon: {
    width: '13rem',
    height: '13rem',
  },
  completionIcon: {
    width: '40rem',
    height: '40rem',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    height: 80,
    width: '100%',
    backgroundColor: colors.projectBgColor,
  },
  bottomBarInnerContainer: {
    flexDirection: 'row',
    height: 80,
  },
  bottomItemView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bottomItemTouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  horizontalLine: {
    backgroundColor: colors.gray,
    width: 1,
    height: 40,
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
    // width: '95%'
  },
  calendarIcon: {
    width: '23rem',
    height: '23rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(AddNewTasksScreen);
