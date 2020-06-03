import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Loader from '../../../components/Loader';
import moment from 'moment';
import APIServices from '../../../services/APIServices';

let taskData = [
  {
    id: 0,
    name: 'Sub tasks',
    icon: icons.subTask,
    renderImage: false,
  },
  {
    id: 1,
    name: 'Due on',
    icon: icons.calendarBlue,
    renderImage: false,
  },
  {
    id: 2,
    name: 'Notes',
    icon: icons.noteRed,
    renderImage: false,
  },
  {
    id: 3,
    name: 'Files',
    icon: icons.fileOrange,
    renderImage: false,
  },
];

class WorkloadTasksDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workloadTasksDetails: [],
      taskStatus: 'Pending',
      duedate: '',
      taskName: '',
      note: '',
      subTasks: [],
      files: [],
    };
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let workloadTasksDetails = params.workloadTasksDetails;
    let date =
      workloadTasksDetails.taskDueDateAt !== null
        ? moment(workloadTasksDetails.taskDueDateAt).format('Do MMMM YYYY')
        : '';
    this.setState({
      workloadTasksDetails: workloadTasksDetails,
      taskNotes: workloadTasksDetails.taskNote,
    });
    if (date == '') {
      this.setState({duedate: 'Add Due Date'});
    } else {
      this.setState({duedate: 'Due on ' + date});
    }
    this.setTaskStatus(workloadTasksDetails);
    this.fetchSubTasksData(
      params.projectId,
      workloadTasksDetails.taskId,
      params.userId,
    );
    this.fetchFilesData(
      params.projectId,
      workloadTasksDetails.taskId,
      params.userId,
    );
  }

  async fetchSubTasksData(selectedProjectID, selectedProjectTaskID, userID) {
    this.setState({dataLoading: true});
    try {
      subTaskData = await APIServices.getChildTasksOfParentData(
        selectedProjectID,
        selectedProjectTaskID,
      );
      if (subTaskData.message == 'success') {
        this.setState({
          subTasks: subTaskData.data,
          dataLoading: false,
        });
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  async fetchFilesData(projectID, taskID, userID) {
    this.setState({dataLoading: true});
    try {
      filesData = await APIServices.getFilesInTaskData(
        projectID,
        taskID,
        userID,
      );
      if (filesData.message == 'success') {
        this.setState({files: filesData.data, dataLoading: false});
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  setTaskStatus(workloadTasksDetails) {
    let statusValue = '';
    switch (workloadTasksDetails.taskStatus) {
      case 'open':
        statusValue = 'Open';
        break;
      case 'pending':
        statusValue = 'Pending';
        break;
      case 'onHold':
        statusValue = 'On Hold';
        break;
      case 'cancel':
        statusValue = 'Cancel';
        break;
      case 'fixing':
        statusValue = 'Fixing';
        break;
      case 'testing':
        statusValue = 'Testing';
        break;
      case 'resolved':
        statusValue = 'Resolved';
        break;
      case 'inprogress':
        statusValue = 'In progress';
        break;
      case 'completed':
        statusValue = 'Completed';
        break;
      case 'implementing':
        statusValue = 'Implementing';
        break;
      case 'underReview':
        statusValue = 'Under Review';
        break;
      case 'waitingForApproval':
        statusValue = 'Waiting For Approval';
        break;
      case 'review':
        statusValue = 'Review';
        break;
      case 'discussion':
        statusValue = 'Discussion';
        break;
      case 'waitingResponse':
        statusValue = 'Waiting Response';
        break;
      case 'ready':
        statusValue = 'Ready';
        break;
      case 'fixed':
        statusValue = 'Fixed';
        break;
      case 'rejected':
        statusValue = 'Rejected';
        break;
      case 'qa':
        statusValue = 'QA';
        break;
      case 'readyToDeploy':
        statusValue = 'Ready To Deploy';
        break;
      case 'reOpened':
        statusValue = 'Reopened';
        break;
      case 'deployed':
        statusValue = 'Deployed';
      case 'closed':
        statusValue = 'Closed';
        break;
    }
    this.setState({
      taskStatus: statusValue,
    });
  }

  renderDetails(item) {
    let value = '';
    switch (item.id) {
      case 0:
        value = this.state.taskName;
        break;
      case 1:
        value = this.state.duedate;
        break;
      case 2:
        value = this.state.note;
        break;
      default:
        break;
    }

    return (
      <View style={{flex: 1}}>
        <Text
          style={[
            styles.text,
            {
              color:
                value !== '' ? colors.darkBlue : colors.projectTaskNameColor,
            },
          ]}>
          {value !== '' ? value : item.name}
        </Text>
      </View>
    );
  }

  renderList(item) {
    return (
      <View style={styles.projectMainView}>
        <View style={styles.projectView}>
          <Image
            style={styles.completionIcon}
            source={item.icon}
            resizeMode="contain"
          />
          {this.renderDetails(item)}
        </View>
        <View style={styles.baseView}>
          {item.id == 0
            ? this.state.subTasks.map((item, index) => {
                return (
                  <View
                    style={[
                      styles.baseInnerContent,
                      {marginTop: index == 0 ? -5 : 0},
                    ]}>
                    <Image
                      style={styles.subTaskIcon}
                      source={icons.subTask}
                      resizeMode="contain"
                    />
                    <Text style={styles.baseInnerText}>{item.taskName}</Text>
                  </View>
                );
              })
            : null}
          {item.id == 2 ? (
            this.state.taskNotes !== '' && this.state.taskNotes !== null ? (
              <Text
                style={{
                  fontSize: 11,
                  color: colors.gray,
                  marginBottom: 10,
                  marginLeft: 8,
                }}>
                {this.state.taskNotes}
              </Text>
            ) : null
          ) : null}
          {item.id == 3
            ? this.state.files.map((item, index) => {
                return (
                  <View
                    style={[
                      styles.baseInnerContent,
                      {marginTop: index == 0 ? -5 : 0},
                    ]}>
                    <Image
                      style={styles.filesIcon}
                      source={icons.fileOrange}
                      resizeMode="contain"
                    />
                    <Text style={styles.baseInnerText}>
                      {item.taskFileName}
                    </Text>
                  </View>
                );
              })
            : null}
        </View>
      </View>
    );
  }

  render() {
    let dataLoading = this.state.dataLoading;
    return (
      <View style={{flex:1}}>
        <ScrollView style={styles.container}>
          <View style={styles.innerContainer}>
            <View style={styles.projectFilerView}>
              <Text style={{color: colors.white}}>{this.state.taskStatus}</Text>
            </View>
            <FlatList
              data={taskData}
              renderItem={({item}) => this.renderList(item)}
              keyExtractor={item => item.taskId}
            />
          </View>
        </ScrollView>
        {dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    marginBottom: '10rem',
  },
  projectFilerView: {
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
  },
  projectView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    height: '60rem',
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectMainView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '7rem',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '11rem',
    color: colors.projectTaskNameColor,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  textDate: {
    fontFamily: 'CircularStd-Book',
    fontSize: '9rem',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    marginRight: '5rem',
  },
  completionIcon: {
    width: '23rem',
    height: '23rem',
    marginHorizontal: '5rem',
  },
  subTaskIcon: {
    width: '13rem',
    height: '13rem',
    marginTop: '1rem',
  },
  filesIcon: {
    width: '13rem',
    height: '13rem',
  },
  baseView: {
    marginTop: '-5rem',
    marginBottom: '10rem',
  },
  baseInnerContent: {
    flexDirection: 'row',
    marginBottom: '10rem',
    marginLeft: '45rem',
  },
  baseInnerText: {
    fontSize: '10rem',
    color: colors.gray,
    marginLeft: '5rem',
    marginRight: '10rem',
  },
});

const mapStateToProps = state => {
  return {
    state,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(WorkloadTasksDetailsScreen);
