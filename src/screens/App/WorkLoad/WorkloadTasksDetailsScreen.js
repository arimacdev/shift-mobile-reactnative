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
      subTasks:[]
    };
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let workloadTasksDetails = params.workloadTasksDetails;
    let date = workloadTasksDetails.dueDate;
    this.setState({
      workloadTasksDetails: workloadTasksDetails,
      duedate: 'Due on ' + moment(date).format('Do MMMM YYYY'),
      taskNotes: workloadTasksDetails.taskNotes,
    });
    this.setTaskStatus(workloadTasksDetails);
    this.fetchData(
      params.projectId,
      workloadTasksDetails.taskId,
      params.userId,
    );
  }

  async fetchData(selectedProjectID, selectedProjectTaskID, userID) {
    this.setState({dataLoading: true});
    try {
      subTaskData = await APIServices.getSubTaskData(
        selectedProjectID,
        selectedProjectTaskID,
        userID,
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

  setTaskStatus(workloadTasksDetails) {
    let statusValue = '';
    switch (workloadTasksDetails.taskStatus) {
      case 'pending':
        statusValue = 'Pending';
        break;
      case 'implementing':
        statusValue = 'Implementing';
        break;
      case 'qa':
        statusValue = 'QA';
        break;
      case 'readyToDeploy':
        statusValue = 'Ready to Deploy';
        break;
      case 'reOpened':
        statusValue = 'Re-Opened';
        break;
      case 'deployed':
        statusValue = 'Deployed';
        break;
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

  renderProjectList(item) {
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
            ? this.state.subTasks.map(item => {
                return (
                  <View style={styles.baseInnerContent}>
                    <Image
                      style={styles.subTaskIcon}
                      source={icons.subTask}
                      resizeMode="contain"
                    />
                    <Text style={styles.baseInnerText}>{item.subtaskName}</Text>
                  </View>
                );
              })
            : null}
          {item.id == 2 ? (
            <Text
              style={{
                fontSize: 11,
                color: colors.gray,
                marginBottom: 10,
                marginLeft: 8,
              }}>
              {this.state.taskNotes == '' || this.state.taskNotes == null ? 'No notes' : this.state.taskNotes}
            </Text>
          ) : null}
        </View>
      </View>
    );
  }

  render() {
    let dataLoading = this.state.dataLoading;
    return (
      <ScrollView style={styles.container}>
        <View>
          <View style={styles.projectFilerView}>
            <Text style={{color: colors.white}}>{this.state.taskStatus}</Text>
          </View>
          <FlatList
            data={taskData}
            renderItem={({item}) => this.renderProjectList(item)}
            keyExtractor={item => item.taskId}
          />
        </View>
        {dataLoading && <Loader />}
      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  projectFilerView: {
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
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
    borderRadius: 5,
    height: '60rem',
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectMainView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
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
    fontFamily: 'Circular Std Book',
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
  },
  baseView: {
    marginTop: -5,
    marginBottom: 10,
  },
  baseInnerContent: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 45,
  },
  baseInnerText: {
    fontSize: 11,
    color: colors.gray,
    marginLeft: 5,
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
