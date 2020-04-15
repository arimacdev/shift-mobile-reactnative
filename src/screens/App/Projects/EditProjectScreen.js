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
  Alert
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
import _ from 'lodash';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import APIServices from '../../../services/APIServices';

let dropData = [
    {
        id: 'Ongoing',
        value: 'Ongoing',
    },
    {
        id: 'Support',
        value: 'Support',
    },
    {
        id: 'Finished',
        value: 'Finished',
    },
    {
      id: 'Presales',
      value: 'Presales',
    },
    {
      id: 'Presales : Project Discovery',
      value: 'Presales : Project Discovery',
    },
    {
      id: 'Presales : Quotation Submission',
      value: 'Presales : Quotation Submission',
    },
    {
      id: 'Presales : Negotiation',
      value: 'Presales : Negotiation',
    },
    {
      id: 'Presales : Confirmed',
      value: 'Presales : Confirmed',
    },
    {
      id: 'Presales : Lost',
      value: 'Presales : Lost',
    },
]

class EditProjectScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      projectName : '',
      projectClient : '',
      projectStartDate : '',
      projectStartDateValue : '',
      projectStartTime : '',
      projectEndDate : '',
      projectEndDateValue : '',
      projectEndTime : '',
      estimateDates : '',
      showAlert : false,
      alertTitle : '',
      alertMsg : '',
      dataLoading : false,
      projectID : '',
      projectStatus : '',
      projectStatusValue : '',
      startDateChanged : false,
      endDateChanged : false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.updateProjectError !== this.props.updateProjectError
        && this.props.updateProjectError && this.props.updateProjectErrorMessage == '') {
          this.showAlert("","Error While Project Update");
    }

    if (prevProps.updateProjectError !== this.props.updateProjectError
      && this.props.updateProjectError && this.props.updateProjectErrorMessage != '') {
        this.showAlert("",this.props.updateProjectErrorMessage);
    }
  
    if (prevProps.updateProjectSuccess !== this.props.updateProjectSuccess
          && this.props.updateProjectSuccess) {
            this.showAlert("","Project Updated");
            this.props.navigation.goBack();
    }
    // delete project
    if (prevProps.deleteProjectError !== this.props.deleteProjectError
      && this.props.deleteProjectError && this.props.deleteProjectErrorMessage == '') {
        this.showAlert("","Error While Project Deleting the Project");
    }

    if (prevProps.deleteProjectError !== this.props.deleteProjectError
      && this.props.deleteProjectError && this.props.deleteProjectErrorMessage != '') {
        this.showAlert("",this.props.deleteProjectErrorMessage);
    }

    if (prevProps.deleteProjectSuccess !== this.props.deleteProjectSuccess
          && this.props.deleteProjectSuccess) {
            this.showAlert("","Project Deleted");
            this.props.navigation.goBack();
    }
  }

  async componentDidMount() {
    const {navigation: {state: {params}}} = this.props;
    let projectId = params.projDetails;
    this.setState({dataLoading:true});
    projectData = await APIServices.getProjectData(projectId);
    if(projectData.message == 'success'){
        await this.setProjectStartDate(projectData.data.projectStartDate);
        await this.setProjectEndDate(projectData.data.projectEndDate);
        await this.setProjectStatus(projectData.data.projectStatus);
        this.setState({
            projectID : projectData.data.projectId,
            projectName : projectData.data.projectName,
            projectClient : projectData.data.clientId,
            //projectStartDate : startDate,
            //projectEndDate : endDate,
            //projectStatus : projectStatus,
            dataLoading : false,
        });
    }else{
        this.setState({dataLoading:false});
    }
  }

  setProjectStartDate(selectedDate){
    this.setState({
        projectStartDate : moment.parseZone(selectedDate).format('Do MMMM YYYY'),
        projectStartDateValue :  moment.parseZone(selectedDate).format('DD MM YYYY'),
        projectStartTime :   moment.parseZone(selectedDate).format('hh:mmA'),
    });
  }

  setProjectEndDate(selectedDate){
    this.setState({
        projectEndDate :  moment.parseZone(selectedDate).format('Do MMMM YYYY'),
        projectEndDateValue :  moment.parseZone(selectedDate).format('DD MM YYYY'),
        projectEndTime :  moment.parseZone(selectedDate).format('hh:mmA'),
    });
  }

  setProjectStatus(status){
    let statusValue = '';
    switch (status) {
        case 'ongoing':
              statusValue = 'Ongoing'
              break;
        case 'support':
              statusValue = 'Support'
              break;
        case 'finished':
              statusValue = 'Finished'
              break;
        case 'presales':
              statusValue = 'Presales'
              break;      
        case 'presalesPD':  
              statusValue = 'Presales : Project Discovery'
              break;
        case 'preSalesQS':
              statusValue = 'Presales : Quotation Submission'
              break;
        case 'preSalesN':
              statusValue = 'Presales : Negotiation'
              break;
        case 'preSalesC':
              statusValue = 'Presales : Confirmed'
              break;
        case 'preSalesL' : 
              statusValue = 'Presales : Lost'
              break;
      }
      this.setState({
        projectStatus : statusValue,
        projectStatusValue : status,
      })
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
          projectEndDate : newDate,
          projectEndDateValue : newDateValue,
          showPicker: false,
          showTimePicker: true,
          dateReminder: new Date(selectedDate),
          endDateChanged : true,
        });
      } else {
        this.setState({
          projectStartDate : newDate,
          projectStartDateValue : newDateValue,
          showPicker: false,
          showTimePicker: true,
          date: new Date(selectedDate),
          startDateChanged : true,
        });
      }
    }
  }

  onChangeTime(event, selectedTime) {
    let time = new Date(selectedTime);
    let newTime = moment(time).format('hh:mmA');
    // let newTime = time.getHours() + ':' + time.getMinutes();

    if (event.type == 'set') {
      if (this.state.reminder) {
        this.setState({
          projectEndTime : newTime,
          selectedTimeReminder: newTime,
          showPicker: false,
          showTimePicker: false,
          timeReminder: new Date(selectedTime),
        });
      }else {
        this.setState({
          projectStartTime : newTime,
          selectedTimeReminder: newTime,
          showPicker: false,
          showTimePicker: false,
          timeReminder: new Date(selectedTime),
        });
      }
    }
  };

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

  reomoveProject (){
    Alert.alert(
			'Delete Project',
			'Are you sure to Delete the Project',
			[
			  {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
			  {text: 'Ok', onPress: () =>this.reomoveProjectSuccess()},
			],
			{ cancelable: false }
		  );
  };

  reomoveProjectSuccess = () => {
    let projectID = this.state.projectID;
    this.props.deleteProject(projectID);
	}

  saveProject() {
    let projectID = this.state.projectID;
    let projectName = this.state.projectName;
    let projectClient = this.state.projectClient;
    let projectStatus = this.state.projectStatus;
    let projectStartDateValue = this.state.projectStartDateValue;
    let projectEndDateValue = this.state.projectEndDateValue;
    let projectStartTime = this.state.projectStartTime;
    let projectEndTime = this.state.projectEndTime;
    let startDateChanged = this.state.startDateChanged;
    let endDateChanged = this.state.endDateChanged;
    let projectStatusValue = this.state.projectStatusValue;

    if(this.validateProject(projectName,projectClient,projectStartDateValue,projectEndDateValue,projectStatus,startDateChanged,endDateChanged)){
      let IsoStartDate = projectStartDateValue ? moment(projectStartDateValue + projectStartTime,'DD/MM/YYYY hh:mmA').format('YYYY-MM-DD[T]HH:mm:ss') : '';
      let IsoSEndDate = projectEndDateValue ? moment(projectEndDateValue + projectEndTime,'DD/MM/YYYY hh:mmA').format('YYYY-MM-DD[T]HH:mm:ss') : '';
      AsyncStorage.getItem('userID').then(userID => {
        this.props.updateproject(projectID,userID,projectName,projectClient,IsoStartDate,IsoSEndDate,projectStatusValue);
      });
     
    }
  };

  validateProject(projectName,projectClient,projectStartDateValue,projectEndDateValue,projectStatus,startDateChanged,endDateChanged) {
    if (!projectName && _.isEmpty(projectName)) {
      this.showAlert("","Please Enter the Project Name");
      return false;
    }
    if (!projectClient && _.isEmpty(projectClient)) {
      this.showAlert("","Please Enter the Project Client");
        return false;
    }

    if (!projectStatus && _.isEmpty(projectStatus)) {
        this.showAlert("","Please select the Project Status");
          return false;
    }

    if (!projectStartDateValue && _.isEmpty(projectStartDateValue)) {
      this.showAlert("","Please a Start Date");
      return false;
    }
    if (!projectEndDateValue && _.isEmpty(projectEndDateValue)) {
      this.showAlert("","Please a Start End");
        return false;
    }

    if(projectStartDateValue && !_.isEmpty(projectStartDateValue)  && startDateChanged){
      let startDate  = moment(projectStartDateValue, "DD MM YYYY");
      let today = moment(new Date()).format('DD MM YYYY');
      let endDate = moment(today, "DD MM YYYY");
      let totalDates = startDate.diff(endDate, "days");
      if(totalDates < 0){
        this.showAlert("","Start date cannot be a past date");
        return false;
      }
    } 
    if(projectEndDateValue && !_.isEmpty(projectEndDateValue) && endDateChanged){
      let startDate  = moment(projectStartDateValue, "DD MM YYYY");
      let endDate  = moment(projectEndDateValue, "DD MM YYYY");
      let totalDates = endDate.diff(startDate, "days");
      if(totalDates < 0){
        this.showAlert("","End date should be after start date");
        return false;
      }
    } 
    return true;
  };

  onFilter(key) {
    console.log("key",key);
    let value = key;
    let searchValue = '';
    switch (value) {
      case 'Ongoing':
            searchValue = 'ongoing'
            break;
      case 'Support':
            searchValue = 'support'
            break;
      case 'Finished':
            searchValue = 'finished'
            break;
      case 'Presales':  
            searchValue = 'presales'
            break;      
      case 'Presales : Project Discovery':  
            searchValue = 'presalesPD'
            break;
      case 'Presales : Quotation Submission':
            searchValue = 'preSalesQS'
            break;
      case 'Presales : Negotiation':
            searchValue = 'preSalesN'
            break;
      case 'Presales : Confirmed':
            searchValue = 'preSalesC'
            break;
      case 'Presales : Lost' : 
            searchValue = 'preSalesL'
            break;
    }
  
  this.setState({
    projectStatus : key,
    projectStatusValue : searchValue,
  });
}

  hideAlert (){
    this.setState({
      showAlert : false,
      alertTitle : '',
      alertMsg : '',
    })
  }

  showAlert(title,msg){
    this.setState({
      showAlert : true,
      alertTitle : title,
      alertMsg : msg,
    })
  }

  render() {
    let projectName = this.state.projectName;
    let projectClient = this.state.projectClient;
    let projectStartDate = this.state.projectStartDate;
    let projectEndDate = this.state.projectEndDate;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let projectStartTime = this.state.projectStartTime;
    let projectEndTime = this.state.projectEndTime;
    let dataLoading = this.props.dataLoading;
    let projectStatus = this.state.projectStatus
    let updateProjectLoading = this.state.updateProjectLoading;
    let deleteProjectErrorMessage = this.state.deleteProjectErrorMessage;
    
    return (
      <ScrollView style={{marginBottom: EStyleSheet.value('02rem')}}>
        <View style={[styles.taskFieldView, {marginTop: 20}]}>
          <TextInput
            style={[styles.textInput, {width: '95%'}]}
            placeholder={'Project Name'}
            value={projectName}
            onChangeText={projectName => this.setState({projectName})}
          />
        </View>
        <View style={[styles.taskFieldView]}>
          <TextInput
            style={[styles.textInput, {width: '95%'}]}
            placeholder={'Client'}
            value={projectClient}
            onChangeText={projectClient => this.setState({projectClient})}
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
            value={projectStatus}
            itemColor={'black'}
            selectedItemColor={'black'}
            dropdownOffset={{top: 10}}
            baseColor={colors.projectBgColor}
            // renderBase={this.renderBase}
            renderAccessory={this.renderBase}
            itemTextStyle={{marginLeft: 15}}
            itemPadding={10}
            onChangeText={(value => this.onFilter(value))}
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
              {projectEndDate == ''
                ? 'Project end date'
                : projectEndDate + ' ' +projectEndTime}
            </Text>
            <Image
              style={styles.calendarIcon}
              source={icons.calendar}
              resizeMode={'center'}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.saveProject()}>
          <View style={styles.button}>
            <Image
              style={[styles.bottomBarIcon, {marginRight: 15, marginLeft: 10}]}
              source={icons.folderWhite}
              resizeMode={'center'}
            />
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>Save Changes</Text>
            </View>

            <Image
              style={[styles.addIcon, {marginRight: 10}]}
              source={icons.addGreen}
              resizeMode={'center'}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this.reomoveProject()}>
          <View style={styles.buttonDelete}>
            <Image
              style={[styles.bottomBarIcon, {marginRight: 15, marginLeft: 10}]}
              source={icons.folderWhite}
              resizeMode={'center'}
            />
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>Delete Project</Text>
            </View>
            <Image
              style={[styles.addIcon, {marginRight: 10}]}
              source={icons.deleteWhite}
              resizeMode={'center'}
            />
          </View>
        </TouchableOpacity>
        {this.state.showPicker ? this.renderDatePicker() : null}
        {this.state.showTimePicker ? this.renderTimePicker() : null}
        {dataLoading && <Loader/>}
        {updateProjectLoading && <Loader/>}
        {deleteProjectErrorMessage && <Loader/>}
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
        />
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
    marginTop: '0rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '60rem',
    marginHorizontal: '20rem',
  },
  textFilter: {
    fontSize: '14rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'Circular Std Medium',
    textAlign: 'center',
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
    fontFamily: 'Circular Std Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  textDate: {
    fontSize: '9rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'Circular Std Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  avatarIcon: {
    width: '20rem',
    height: '20rem',
    marginLeft: 10,
  },
  statusView: {
    alignItems: 'center',
    flexDirection: 'row',
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
    fontFamily: 'Circular Std Medium',
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
    backgroundColor: colors.lightGreen,
    borderRadius: 5,
    marginTop: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonDelete : {
    flexDirection: 'row',
    backgroundColor: colors.lightRed,
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
  return {
    updateProjectLoading: state.project.updateProjectLoading,
    updateProjectError : state.project.updateProjectError,
    updateProjectSuccess : state.project.updateProjectSuccess,
    updateProjectErrorMessage : state.project.updateProjectErrorMessage,
    deleteProjectLoading: state.project.deleteProjectLoading,
    deleteProjectError : state.project.deleteProjectError,
    deleteProjectSuccess : state.project.deleteProjectSuccess,
    deleteProjectErrorMessage : state.project.deleteProjectErrorMessage,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(EditProjectScreen);
