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
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import DocumentPicker from 'react-native-document-picker';
import moment from 'moment';
import _ from 'lodash';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import NavigationService from '../../../services/NavigationService';
import MessageShowModal from '../../../components/MessageShowModal';

let successDetails = {
  icon: icons.folderGreen,
  type: 'success',
  title: 'Success',
  description: 'You have created a project successfully',
  buttons: {},
};

class CreateNewProjectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bottomItemPressColor: colors.darkBlue,
      showPicker: false,
      showTimePicker: false,
      selectedDate: '',
      date: new Date(),
      time: new Date(),
      selectedDateReminder: '',
      selectedTimeReminder: '',
      dateReminder: new Date(),
      timeReminder: new Date(),
      mode: 'date',
      reminder: false,
      files: [],
      notes: '',
      estimateTime: '',
      projectName: '',
      projectClient: '',
      projectStartDate: '',
      projectStartDateValue: '',
      projectStartTime: '',
      projectEndDate: '',
      projectEndDateValue: '',
      projectEndTime: '',
      estimateDates: '',
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      isDateNeedLoading: false,
      projectAlias: '',
      showMessageModal: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.addProjectError !== this.props.addProjectError &&
      this.props.addProjectError &&
      this.props.addProjectErrorMassage == ''
    ) {
      this.showAlert('', 'Error While Project Creation');
    }

    if (
      prevProps.addProjectError !== this.props.addProjectError &&
      this.props.addProjectError &&
      this.props.addProjectErrorMassage != ''
    ) {
      this.showAlert('', this.props.addProjectErrorMassage);
    }

    if (
      prevProps.addProjectrSuccess !== this.props.addProjectrSuccess &&
      this.props.addProjectrSuccess
    ) {
      // this.showAlert('', 'Project Created');
      this.setState({showMessageModal: true});
    }
  }

  componentDidMount() {}

  onPressCancel() {
    this.setState({showMessageModal: false});
    NavigationService.navigate('ProjectsScreen');
  }

  renderBase() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Image style={styles.dropIcon} source={icons.arrowDark} />
      </View>
    );
  }

  showDatePicker = () => {
    this.setState({showPicker: true});
  };

  hideDatePicker = () => {
    this.setState({showPicker: false});
  };

  handleDateConfirm = date => {
    this.hideDatePicker();
    this.setState({isDateNeedLoading: true});
    let date1 = new Date(date);
    let newDate = '';
    let newDateValue = '';
    if (this.state.reminder) {
      newDate = moment(date1).format('Do MMMM YYYY');
      newDateValue = moment(date1).format('DD MM YYYY');
    } else {
      newDate = moment(date1).format('Do MMMM YYYY');
      newDateValue = moment(date1).format('DD MM YYYY');
    }
    if (this.state.reminder) {
      this.setState({
        projectEndDate: newDate,
        projectEndDateValue: newDateValue,
        dateReminder: new Date(date1),
      });
    } else {
      this.setState({
        projectStartDate: newDate,
        projectStartDateValue: newDateValue,
        date: new Date(date1),
      });
    }
    setTimeout(() => {
      this.setState({
        isDateNeedLoading: false,
        showTimePicker: true,
      });
    }, 500);
  };

  showTimePicker = () => {
    this.setState({showTimePicker: true});
  };

  hideTimePicker = () => {
    this.setState({showTimePicker: false});
  };

  handleTimeConfirm = time1 => {
    console.log(time1, 'time');
    this.hideTimePicker();
    let time = new Date(time1);
    let newTime = moment(time).format('hh:mmA');
    // let newTime = time.getHours() + ':' + time.getMinutes();
    // if (event.type == 'set') {
    if (this.state.reminder) {
      this.setState({
        projectEndTime: newTime,
        selectedTimeReminder: newTime,
        showPicker: false,
        showTimePicker: false,
        timeReminder: new Date(time1),
      });
    } else {
      this.setState({
        projectStartTime: newTime,
        selectedTimeReminder: newTime,
        showPicker: false,
        showTimePicker: false,
        time: new Date(time1),
      });
    }
    // } else {
    //   this.setState({
    //     showPicker: false,
    //     showTimePicker: false,
    //   });
    // }
  };

  onChangeDate(event, selectedDate) {
    let date = new Date(selectedDate);
    let newDate = '';
    let newDateValue = '';

    if (this.state.reminder) {
      newDate = moment(date).format('Do MMMM YYYY');
      newDateValue = moment(date).format('DD MM YYYY');
    } else {
      newDate = moment(date).format('Do MMMM YYYY');
      newDateValue = moment(date).format('DD MM YYYY');
    }

    if (event.type == 'set') {
      if (this.state.reminder) {
        this.setState({
          projectEndDate: newDate,
          projectEndDateValue: newDateValue,
          showPicker: false,
          showTimePicker: true,
          dateReminder: new Date(selectedDate),
        });
      } else {
        this.setState({
          projectStartDate: newDate,
          projectStartDateValue: newDateValue,
          showPicker: false,
          showTimePicker: true,
          date: new Date(selectedDate),
        });
      }
    } else {
      this.setState({
        showPicker: false,
        showTimePicker: false,
      });
    }
  }

  onChangeTime(event, selectedTime) {
    let time = new Date(selectedTime);
    let newTime = moment(time).format('hh:mmA');
    // let newTime = time.getHours() + ':' + time.getMinutes();

    if (event.type == 'set') {
      if (this.state.reminder) {
        this.setState({
          projectEndTime: newTime,
          selectedTimeReminder: newTime,
          showPicker: false,
          showTimePicker: false,
          timeReminder: new Date(selectedTime),
        });
      } else {
        this.setState({
          projectStartTime: newTime,
          selectedTimeReminder: newTime,
          showPicker: false,
          showTimePicker: false,
          time: new Date(selectedTime),
        });
      }
    } else {
      this.setState({
        showPicker: false,
        showTimePicker: false,
      });
    }
  }

  renderDatePicker() {
    if (Platform.OS == 'ios') {
      return (
        <View>
          <DateTimePickerModal
            isVisible={this.state.showPicker}
            mode="date"
            onConfirm={this.handleDateConfirm}
            onCancel={this.hideDatePicker}
          />
        </View>
      );
    } else {
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
  }

  renderTimePicker() {
    if (Platform.OS == 'ios') {
      return (
        <View>
          <DateTimePickerModal
            isVisible={this.state.showTimePicker}
            mode="time"
            onConfirm={this.handleTimeConfirm}
            onCancel={this.hideTimePicker}
          />
        </View>
      );
    } else {
      return (
        <DateTimePicker
          testID="dateTimePicker"
          timeZoneOffsetInMinutes={0}
          value={
            this.state.reminder == true
              ? this.state.timeReminder
              : this.state.time
          }
          mode={'time'}
          is24Hour={true}
          display="default"
          onChange={(event, selectedDate) =>
            this.onChangeTime(event, selectedDate)
          }
        />
      );
    }
  }

  onEstimateTimeChange(text) {
    this.setState({estimateTime: text});
  }

  saveProject() {
    let projectName = this.state.projectName;
    let projectClient = this.state.projectClient;
    let projectStartDateValue = this.state.projectStartDateValue;
    let projectEndDateValue = this.state.projectEndDateValue;
    let projectStartTime = this.state.projectStartTime;
    let projectEndTime = this.state.projectEndTime;
    let projectAlias = this.state.projectAlias;

    if (
      this.validateProject(
        projectName,
        projectClient,
        projectStartDateValue,
        projectEndDateValue,
        projectAlias,
      )
    ) {
      let IsoStartDate = projectStartDateValue
        ? moment(
            projectStartDateValue + projectStartTime,
            'DD/MM/YYYY hh:mmA',
          ).format('YYYY-MM-DD[T]HH:mm:ss')
        : '';
      let IsoSEndDate = projectEndDateValue
        ? moment(
            projectEndDateValue + projectEndTime,
            'DD/MM/YYYY hh:mmA',
          ).format('YYYY-MM-DD[T]HH:mm:ss')
        : '';
      AsyncStorage.getItem('userID').then(userID => {
        this.props.addproject(
          projectName,
          projectClient,
          IsoStartDate,
          IsoSEndDate,
          userID,
          projectAlias,
        );
      });
    }
  }

  validateProject(
    projectName,
    projectClient,
    projectStartDateValue,
    projectEndDateValue,
    projectAlias,
  ) {
    if (!projectName && _.isEmpty(projectName)) {
      this.showAlert('', 'Please enter the project name');
      return false;
    }
    if (!projectClient && _.isEmpty(projectClient)) {
      this.showAlert('', 'Please enter the client name');
      return false;
    }

    if (!projectAlias && _.isEmpty(projectAlias)) {
      this.showAlert('', 'Please enter the project alias');
      return false;
    }

    if (!projectStartDateValue && _.isEmpty(projectStartDateValue)) {
      this.showAlert('', 'Please enter the project start date');
      return false;
    }
    if (!projectEndDateValue && _.isEmpty(projectEndDateValue)) {
      this.showAlert('', 'Please enter the project end date');
      return false;
    }

    if (projectStartDateValue && !_.isEmpty(projectStartDateValue)) {
      let startDate = moment(projectStartDateValue, 'DD MM YYYY');
      let today = moment(new Date()).format('DD MM YYYY');
      let endDate = moment(today, 'DD MM YYYY');
      let totalDates = startDate.diff(endDate, 'days');
      if (totalDates < 0) {
        this.showAlert('', 'Start date cannot be a past date');
        return false;
      }
    }
    if (projectEndDateValue && !_.isEmpty(projectEndDateValue)) {
      let startDate = moment(projectStartDateValue, 'DD MM YYYY');
      let endDate = moment(projectEndDateValue, 'DD MM YYYY');
      let totalDates = endDate.diff(startDate, 'days');
      if (totalDates < 0) {
        this.showAlert('', 'End date should be after start date');
        return false;
      }
    }
    return true;
  }

  hideAlert() {
    this.setState({
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
    });
  }

  showAlert(title, msg) {
    this.setState({
      showAlert: true,
      alertTitle: title,
      alertMsg: msg,
    });
  }

  render() {
    let projectName = this.state.projectName;
    let projectClient = this.state.projectClient;
    let projectStartDate = this.state.projectStartDate;
    let projectEndDate = this.state.projectEndDate;
    let projectStartDateValue = this.state.projectStartDateValue;
    let projectEndDateValue = this.state.projectEndDateValue;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let addProjectLoading = this.props.addProjectLoading;
    let estimateDatesText = '';
    let projectStartTime = this.state.projectStartTime;
    let projectEndTime = this.state.projectEndTime;
    let projectAlias = this.state.projectAlias;
    if (projectStartDate && projectEndDate) {
      let startDate = moment(projectStartDateValue, 'DD MM YYYY');
      let endDate = moment(projectEndDateValue, 'DD MM YYYY');
      let totalDates = endDate.diff(startDate, 'days');
      if (totalDates > 0 && totalDates < 30) {
        let weeksText = Math.floor(parseInt(totalDates) / 7);
        let dateText = Math.floor(parseInt(totalDates) % 7);
        console.log(weeksText, dateText);
        estimateDatesText =
          weeksText.toString() +
          'week(s)' +
          ' ' +
          dateText.toString() +
          'day(s)';
      } else if (totalDates > 0 && totalDates >= 30) {
        let monthsText = Math.floor(parseInt(totalDates) / 30);
        let dateText = Math.floor(parseInt(totalDates) % 30);
        console.log(monthsText, dateText);
        estimateDatesText =
          monthsText.toString() +
          'month(s)' +
          ' ' +
          dateText.toString() +
          'day(s)';
      } else {
        estimateDatesText = '0 days';
      }
    } else {
      estimateDatesText = '0 days';
    }

    return (
      <View style={{flex: 1}}>
        <ScrollView style={{marginBottom: EStyleSheet.value('80rem')}}>
          <View style={styles.titleView}>
            <Text style={styles.titleText}>
              You’re about to start a new project
            </Text>
          </View>
          <View style={[styles.taskFieldView, {marginTop: 20}]}>
            <TextInput
              style={[styles.textInput, {width: '95%'}]}
              placeholder={'Project Name*'}
              value={projectName}
              onChangeText={projectName => this.setState({projectName})}
            />
          </View>
          <View style={[styles.taskFieldView]}>
            <TextInput
              style={[styles.textInput, {width: '95%'}]}
              placeholder={'Client*'}
              value={projectClient}
              onChangeText={projectClient => this.setState({projectClient})}
            />
          </View>
          <View style={[styles.taskFieldView]}>
            <TextInput
              style={[styles.textInput, {width: '95%'}]}
              placeholder={'Project Alias*'}
              value={projectAlias}
              maxLength={6}
              onChangeText={projectAlias => this.setState({projectAlias})}
            />
          </View>
          <TouchableOpacity
            onPress={() =>
              this.setState({showPicker: true, reminder: false, mode: 'date'})
            }>
            <View style={[styles.taskFieldView, {flexDirection: 'row'}]}>
              <Text style={[styles.textInput, {flex: 1}]}>
                {projectStartDate == ''
                  ? 'Project start date'
                  : projectStartDate + ' ' + projectStartTime}
              </Text>
              <Image
                style={styles.calendarIcon}
                source={icons.calendar}
                resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.setState({showPicker: true, reminder: true, mode: 'date'})
            }>
            <View style={[styles.taskFieldView, {flexDirection: 'row'}]}>
              <Text style={[styles.textInput, {flex: 1}]}>
                {projectEndDate == ''
                  ? 'Project end date'
                  : projectEndDate + ' ' + projectEndTime}
              </Text>
              <Image
                style={styles.calendarIcon}
                source={icons.calendar}
                resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>
          <View style={styles.taskFieldView}>
            <TextInput
              style={[styles.textInput, {width: '95%'}]}
              placeholder={'Estimated project timeline'}
              value={estimateDatesText}
              onChangeText={estimateDates => this.setState({estimateDatesText})}
              editable={false}
            />
          </View>
          <View style={[styles.taskFieldView]}>
            <TextInput
              style={[styles.textInput, {width: '95%'}]}
              placeholder={'Weight measures*'}
              value={projectAlias}
              maxLength={6}
              onChangeText={projectAlias => this.setState({projectAlias})}
            />
          </View>
          {this.state.showPicker ? this.renderDatePicker() : null}
          {this.state.showTimePicker ? this.renderTimePicker() : null}
          {this.state.isDateNeedLoading && <Loader />}
        </ScrollView>
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => this.saveProject()}>
            <View style={styles.button}>
              <Image
                style={[
                  styles.bottomBarIcon,
                  {marginRight: 15, marginLeft: 10},
                ]}
                source={icons.folderWhite}
                resizeMode={'contain'}
              />
              <View style={{flex: 1}}>
                <Text style={styles.buttonText}>Add new Project</Text>
              </View>

              <Image
                style={[styles.addIcon, {marginRight: 10}]}
                source={icons.add}
                resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>
        </View>
        {addProjectLoading && <Loader />}
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={alertTitle}
          message={alertMsg}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText=""
          confirmText="OK"
          confirmButtonColor={colors.primary}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
          overlayStyle={{backgroundColor: colors.alertOverlayColor}}
          contentContainerStyle={styles.alertContainerStyle}
          confirmButtonStyle={styles.alertConfirmButtonStyle}
        />
        <MessageShowModal
          showMessageModal={this.state.showMessageModal}
          details={successDetails}
          onPress={() => {}}
          onPressCancel={() => this.onPressCancel(this)}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  titleView: {
    marginTop: '20rem',
    marginLeft: '20rem',
  },
  titleText: {
    color: colors.gray,
    fontSize: '14rem',
  },
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginTop: '0rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '60rem',
    marginHorizontal: '20rem',
  },
  dropIcon: {
    width: '13rem',
    height: '13rem',
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
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
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
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonText: {
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    fontWeight: 'bold',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: 15,
  },
  alertContainerStyle: {
    bottom: 0,
    width: '100%',
    maxWidth: '100%',
    position: 'absolute',
    borderRadius: 0,
    borderTopStartRadius: '5rem',
    borderTopEndRadius: '5rem',
  },
  alertConfirmButtonStyle: {
    width: '100rem',
    backgroundColor: colors.colorBittersweet,
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {
    addProjectLoading: state.project.addProjectLoading,
    addProjectError: state.project.addProjectError,
    addProjectrSuccess: state.project.addProjectrSuccess,
    addProjectErrorMassage: state.project.addProjectErrorMassage,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(CreateNewProjectScreen);
