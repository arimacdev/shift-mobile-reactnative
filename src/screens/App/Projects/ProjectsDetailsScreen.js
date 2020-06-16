import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import APIServices from '../../../services/APIServices';
import NavigationService from '../../../services/NavigationService';
import Loader from '../../../components/Loader';
import {NavigationEvents} from 'react-navigation';
import moment from 'moment';

class ProjectsDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoading: false,
      projectDatesDetails: [],
      projectTaskDetails: [],
      projectName: '',
      projectClient: '',
      projectStatus: '',
      projectID: '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      this.fetchData();
    }
  }

  async componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    let selectedProjectID = this.props.selectedProjectID;
    this.setState({dataLoading: true});
    projectTaskDetailsData = await APIServices.getProjectTaskDetails(
      selectedProjectID,
    );
    if (projectTaskDetailsData.message == 'success') {
      this.setProjectTaskData(projectTaskDetailsData.data);
      let projectData = await APIServices.getProjectData(selectedProjectID);
      if (projectData.message == 'success') {
        this.setProjectData(projectData.data);
        this.setState({dataLoading: false});
      } else {
        this.setState({dataLoading: false});
      }
    } else {
      this.setState({dataLoading: false});
    }
  }

  setProjectTaskData(data) {
    //set projectTaskData to state
    let taskData = [];
    // today due task
    taskData.push({
      text: data.tasksDueToday.toString(),
      details: 'Due today',
      icon: icons.calenderWhite,
      color: '#ffb129',
    }),
      // Overdue task
      taskData.push({
        text: data.tasksOverDue.toString(),
        details: 'Overdue',
        icon: icons.warningWhite,
        color: '#e65c62',
      }),
      // left task
      taskData.push({
        text: data.tasksLeft.toString(),
        details: 'Left',
        icon: icons.clockWhite,
        color: '#704cf1',
      }),
      // today due task
      taskData.push({
        text: data.tasksAssigned.toString(),
        details: 'Assigned to you',
        icon: icons.userWhiteProj,
        color: '#67d2e0',
      }),
      // Completed task
      taskData.push({
        text: data.tasksCompleted.toString(),
        details: 'Completed',
        icon: icons.rightWhite,
        color: '#6fcd17',
      }),
      this.setState({
        projectTaskDetails: taskData,
      });
  }

  setProjectData(data) {
    this.setState({
      projectName: data.projectName,
      projectClient: data.clientId,
      projectID: data.projectId,
    });
    this.setProjectStatus(data.projectStatus);
    this.setProjectsDatesView(data);
  }

  setProjectStatus(status) {
    let statusValue = '';
    switch (status) {
      case 'ongoing':
        statusValue = 'Ongoing';
        break;
      case 'support':
        statusValue = 'Support';
        break;
      case 'finished':
        statusValue = 'Finished';
        break;
      case 'presales':
        statusValue = 'Presales';
        break;
      case 'presalesPD':
        statusValue = 'Project Discovery';
        break;
      case 'preSalesQS':
        statusValue = 'Quotation Submission';
        break;
      case 'preSalesN':
        statusValue = 'Negotiation';
        break;
      case 'preSalesC':
        statusValue = 'Confirmed';
        break;
      case 'preSalesL':
        statusValue = 'Lost';
        break;
    }
    this.setState({
      projectStatus: statusValue,
    });
  }

  setProjectsDatesView(data) {
    //set project dates to state
    let projectsDatesArray = [];
    let startDate = data.projectStartDate;
    let startNewDate = '';
    let startNewDateValue = '';
    let endDate = data.projectEndDate;
    let endNewDate = '';
    let endNewDateValue = '';
    let todayValue = '';
    let datesTextEsstimated = '';
    let datesTextAcctual = '';

    startNewDate = moment.parseZone(startDate).format('Do MMMM YYYY');
    startNewDateValue = moment.parseZone(startDate).format('DD MM YYYY');

    endNewDate = moment.parseZone(endDate).format('Do MMMM YYYY');
    endNewDateValue = moment.parseZone(endDate).format('DD MM YYYY');

    todayValue = moment.parseZone(new Date()).format('DD MM YYYY');

    let startDateMomentValue = moment(startNewDateValue, 'DD MM YYYY');
    let endDateMomentValue = moment(endNewDateValue, 'DD MM YYYY');
    let todatMomentValue = moment(todayValue, 'DD MM YYYY');

    let totalDatesEsstimated = endDateMomentValue.diff(
      startDateMomentValue,
      'days',
    );
    if (totalDatesEsstimated > 0 && totalDatesEsstimated < 30) {
      let weeksTextEsstimated = Math.floor(parseInt(totalDatesEsstimated) / 7);
      let dateTextEsstimated = Math.floor(parseInt(totalDatesEsstimated) % 7);
      datesTextEsstimated =
        weeksTextEsstimated.toString() +
        ' week(s)' +
        ' ' +
        dateTextEsstimated.toString() +
        ' day(s)';
    } else if (totalDatesEsstimated > 0 && totalDatesEsstimated >= 30) {
      let monthsText = Math.floor(parseInt(totalDatesEsstimated) / 30);
      let dateTextEsstimated = Math.floor(parseInt(totalDatesEsstimated) % 30);
      datesTextEsstimated =
        monthsText.toString() +
        'month(s)' +
        ' ' +
        dateTextEsstimated.toString() +
        'day(s)';
    } else {
      datesTextEsstimated = '0 days';
    }

    let totalDatesAcctual = todatMomentValue.diff(startDateMomentValue, 'days');
    if (totalDatesAcctual > 0 && totalDatesAcctual < 30) {
      let weeksTextAcctual = Math.floor(parseInt(totalDatesAcctual) / 7);
      let dateTextAcctual = Math.floor(parseInt(totalDatesAcctual) % 7);
      datesTextAcctual =
        weeksTextAcctual.toString() +
        ' week(s)' +
        ' ' +
        dateTextAcctual.toString() +
        ' day(s)';
    } else if (totalDatesAcctual > 0 && totalDatesAcctual >= 30) {
      let monthsText = Math.floor(parseInt(totalDatesAcctual) / 30);
      let dateTextAcctual = Math.floor(parseInt(totalDatesAcctual) % 30);
      dateTextAcctual =
        monthsText.toString() +
        'month(s)' +
        ' ' +
        dateTextAcctual.toString() +
        'day(s)';
    } else {
      datesTextAcctual = '0 days';
    }

    projectsDatesArray.push(
      {
        text: 'Project start date',
        details: startNewDate,
      },
      {
        text: 'Project end date',
        details: endNewDate,
      },
      {
        text: 'Estimated project timeline',
        details: datesTextEsstimated,
      },
      {
        text: 'Actual time for now',
        details: datesTextAcctual,
      },
    );

    this.setState({
      projectDatesDetails: projectsDatesArray,
    });
  }

  renderInnerList(item) {
    return (
      <View style={styles.projectInnerView}>
        <Text style={styles.projectInnerText}>{item.text}</Text>
        <Text style={styles.projectInnerDetailText}>{item.details}</Text>
      </View>
    );
  }

  renderOuterList(item, index) {
    let projectTaskDetails = this.state.projectTaskDetails;
    return (
      <View
        style={[
          styles.projectOuterView,
          {
            flex:
              index == projectTaskDetails.length - 1 &&
              (projectTaskDetails.length - 1) % 2 == 0
                ? 0.5
                : 1,

            marginRight:
              index == projectTaskDetails.length - 1 &&
              (projectTaskDetails.length - 1) % 2 == 0
                ? 20
                : 3,
            backgroundColor: item.color,
          },
        ]}>
        <View style={styles.ProjectOuterInnerView}>
          <Image
            style={styles.outerListIcon}
            source={item.icon}
            resizeMode="contain"
          />
          <View style={{marginLeft: 15}}>
            <Text style={styles.projectOuterText}>{item.text}</Text>
            <Text style={styles.projectOuterDetailsText}>{item.details}</Text>
          </View>
        </View>
      </View>
    );
  }

  async tabOpen() {
    this.fetchData();
  }

  navigateToEditProject() {
    let projectID = this.state.projectID;
    //props.navigation.navigate('EditProjectScreen',{projDetails:projectID});
    NavigationService.navigate('EditProjectScreen', {projDetails: projectID});
  }

  render() {
    let projectDatesDetails = this.state.projectDatesDetails;
    let projectTaskDetails = this.state.projectTaskDetails;
    let projectName = this.state.projectName;
    let projectClient = this.state.projectClient;
    let projectStatus = this.state.projectStatus;
    let dataLoading = this.state.dataLoading;

    return (
      <ScrollView style={styles.container}>
        <NavigationEvents onWillFocus={payload => this.tabOpen(payload)} />
        <View style={styles.projectDetailsView}>
          <View style={styles.projDetailsInnerView}>
            <View style={{flex: 1}}>
              <Text style={styles.textProjName}>{projectName}</Text>
              <Text style={styles.textProjCompany}>{projectClient}</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => this.navigateToEditProject()}>
                <Image style={styles.editIcon} source={icons.editUser} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.border} />
          <View style={styles.projectDetailsInnerView}>
            <View style={styles.projectDetailsHeadding}>
              <Text style={styles.projectDetailsHeaddingText}>
                {projectStatus}
              </Text>
            </View>
            <View
              style={[
                styles.projectDetailsHeadding,
                {backgroundColor: colors.lightGreen},
              ]}>
              <Text style={styles.projectDetailsHeaddingText}>Healthy</Text>
            </View>
          </View>
          <FlatList
            style={styles.projectInnerFlatList}
            data={projectDatesDetails}
            numColumns={2}
            renderItem={({item}) => this.renderInnerList(item)}
            keyExtractor={item => item.projId}
          />
        </View>
        <FlatList
          style={styles.projectOuterFlatList}
          data={projectTaskDetails}
          numColumns={2}
          renderItem={({item, index}) => this.renderOuterList(item, index)}
          keyExtractor={item => item.projId}
        />
        {dataLoading && <Loader />}
      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  projectDetailsView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '10rem',
    marginTop: '17rem',
    marginBottom: '3rem',
    marginHorizontal: '20rem',
  },
  textProjName: {
    fontSize: '20rem',
    color: colors.projDetailsProjectName,
    fontFamily: 'CircularStd-Bold',
    fontWeight: '400',
  },
  projDetailsInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '15rem',
    paddingHorizontal: '20rem',
  },
  textProjCompany: {
    fontSize: '12rem',
    color: colors.loginGray,
    fontFamily: 'CircularStd-Book',
    fontWeight: '400',
    textAlign: 'left',
  },
  userIcon: {
    width: '20rem',
    height: '20rem',
  },
  statusView: {
    backgroundColor: colors.gray,
    width: '5rem',
    height: '60rem',
    alignItems: 'flex-end',
    borderTopRightRadius: '5rem',
    borderBottomRightRadius: '5rem',
  },
  dropIcon: {
    width: '13rem',
    height: '13rem',
  },
  editIcon: {
    width: '35rem',
    height: '35rem',
  },
  projectDetailsHeadding: {
    backgroundColor: colors.lightBlue,
    flex: 1,
    borderRadius: '3rem',
    marginTop: '7rem',
    marginBottom: '4rem',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '30rem',
    marginHorizontal: '2rem',
  },
  projectDetailsHeaddingText: {
    color: colors.white,
    fontFamily: 'CircularStd-Medium',
    fontSize: '11rem',
    fontWeight: '400',
  },
  outerListIcon: {
    width: '30rem',
    height: '30rem',
  },
  projectInnerView: {
    flex: 1,
    backgroundColor: colors.projDetails,
    borderRadius: '7rem',
    marginTop: '5rem',
    paddingLeft: '12rem',
    paddingVertical: '15rem',
    marginHorizontal: '3rem',
  },
  projectInnerText: {
    marginBottom: '3rem',
    fontSize: '10rem',
    color: colors.loginGray,
    fontFamily: 'CircularStd-Bold',
    fontWeight: '400',
  },
  projectInnerDetailText: {
    color: colors.projectDetailsDate,
    fontSize: '10rem',
    fontFamily: 'CircularStd-Book',
    fontWeight: '400',
  },
  projectOuterView: {
    backgroundColor: colors.projDetails,
    borderRadius: '7rem',
    marginTop: '5rem',
    paddingLeft: '13rem',
    paddingVertical: '15rem',
    marginHorizontal: '3rem',
  },
  ProjectOuterInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectOuterText: {
    color: colors.white,
    marginBottom: '-5rem',
    fontSize: '24rem',
    fontWeight: '400',
    fontFamily: 'CircularStd-Bold',
  },
  projectOuterDetailsText: {
    color: colors.white,
    fontSize: '13rem',
    fontWeight: '400',
    fontFamily: 'CircularStd-Book',
  },
  border: {
    borderWidth: '0.5rem',
    width: '100%',
    borderColor: colors.lightgray,
    marginTop: '5rem',
  },
  projectDetailsInnerView: {
    flexDirection: 'row',
    paddingHorizontal: '18rem',
  },
  projectInnerFlatList: {
    marginHorizontal: '18rem',
    marginBottom: '20rem',
  },
  projectOuterFlatList: {
    marginHorizontal: '18rem',
    marginBottom: '20rem',
  },
});

const mapStateToProps = state => {
  return {
    projectsLoading: state.project.projectsLoading,
    projects: state.project.projects,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(ProjectsDetailsScreen);
