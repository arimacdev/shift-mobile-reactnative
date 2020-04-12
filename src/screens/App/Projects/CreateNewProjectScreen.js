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
import moment from 'moment';

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

class CreateNewProjectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      taskName: '',
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
      files: [],
      notes: '',
      estimateTime: '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  onTaskNameChange(text) {
    this.setState({taskName: text});
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
    let newDate = '';

    if (this.state.reminder) {
      newDate = moment(date).format('Do MMMM YYYY');
    } else {
      newDate = moment(date).format('Do MMMM YYYY');
    }

    if (event.type == 'set') {
      if (this.state.reminder) {
        this.setState({
          selectedDateReminder: newDate,
          showPicker: false,
          showTimePicker: false,
          dateReminder: new Date(selectedDate),
        });
      } else {
        this.setState({
          selectedDate: newDate,
          showPicker: false,
          showTimePicker: false,
          date: new Date(selectedDate),
        });
      }
    }
  }

  onChangeTime(event, selectedTime) {
    let time = new Date(selectedTime);
    let newTime = moment(time).format('hh:mmA');

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

  onFilesCrossPress(uri) {
    let filesArray = this.state.files.filter(item => {
      return item.uri !== uri;
    });
    this.setState({files: filesArray});
  }

  renderDocPickeredView(item) {
    return (
      <View
        style={{
          width: 165,
          height: 50,
          flexDirection: 'row',
          backgroundColor: colors.white,
          borderRadius: 5,
          marginRight: 5,
          marginBottom: 5,
        }}>
        <View style={{justifyContent: 'center', marginLeft: 10}}>
          <Image
            style={styles.gallaryIcon}
            source={icons.gallary}
            resizeMode={'center'}
          />
        </View>

        <View
          style={{
            flexDirection: 'column',
            marginLeft: 10,
            justifyContent: 'center',
            flex: 1,
          }}>
          <Text style={{marginTop: -2}}>
            {item.name.substring(0, 5)}...{item.name.substr(-7)}
          </Text>
          <Text style={{fontSize: 10, marginTop: -2, color: colors.lightgray}}>
            {item.dateTime}
          </Text>
        </View>

        <View
          style={{
            justifyContent: 'flex-start',
            marginRight: 4,
            marginTop: 4,
            // backgroundColor:'red'
          }}>
          <TouchableOpacity onPress={() => this.onFilesCrossPress(item.uri)}>
            <Image
              style={styles.cross}
              source={icons.cross}
              resizeMode={'center'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  onEstimateTimeChange(text) {
    this.setState({estimateTime: text});
  }

  render() {
    return (
      <ScrollView style={{marginBottom: EStyleSheet.value('02rem')}}>
        <View style={styles.titleView}>
          <Text style={styles.titleText}>You’re about to start a new project</Text>
        </View>
        <View style={[styles.taskFieldView, {marginTop: 20}]}>
          <TextInput
            style={[styles.textInput, {width: '95%'}]}
            placeholder={'Project Name'}
            value={this.state.password}
            onChangeText={text => this.onTaskNameChange(text)}
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
            value={'Client'}
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
                ? 'Project start date'
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
                ? 'Project end date'
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
        <View style={styles.taskFieldView}>
          <TextInput
            style={[styles.textInput, {width: '95%'}]}
            placeholder={'Estimated project timeline'}
            value={this.state.estimateTime}
            onChangeText={text => this.onEstimateTimeChange(text)}
          />
        </View>
        <TouchableOpacity onPress={() => {}}>
          <View style={styles.button}>
            <Image
              style={[styles.bottomBarIcon, {marginRight: 15, marginLeft: 10}]}
              source={icons.folderWhite}
              resizeMode={'center'}
            />
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>Add new Project</Text>
            </View>

            <Image
              style={[styles.addIcon, {marginRight: 10}]}
              source={icons.add}
              resizeMode={'center'}
            />
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
  titleView:{
    marginTop:'20rem',
    marginLeft:'20rem'
  },
  titleText:{
    color: colors.gray,
    fontSize:'14rem'
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
  taskFieldDocPickView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginTop: '0rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
    paddingVertical: '6rem',
  },
  gallaryIcon: {
    width: '24rem',
    height: '24rem',
  },
  cross: {
    width: '7rem',
    height: '7rem',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
    marginTop: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonText: {
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'Circular Std Medium',
    fontWeight: 'bold',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(CreateNewProjectScreen);
