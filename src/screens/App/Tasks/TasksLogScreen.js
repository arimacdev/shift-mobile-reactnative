import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import Tasks from './TasksTabScreen';
import Projects from '../Projects/ProjectsDetailsScreen';
import PeopleScreen from '../People/PeopleScreen';
import FilesScreen from '../Files/ProjectFilesScreen';
import Board from '../Board/Board';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {MenuProvider} from 'react-native-popup-menu';
import APIServices from '../../../services/APIServices';
import EmptyListView from '../../../components/EmptyListView';

const initialLayout = {width: entireScreenWidth};

taskLogData = [
  {
    id: 0,
    date: '2020 Jan 20',
    details: [
      {
        time: '10:25 AM :',
        name: '@inidika',
        log: 'Set the task type to Original',
      },
      {time: '11:30 AM :', name: '@inidika', log: 'has update the task name'},
      {
        time: '11:40 AM :',
        name: '@inidika',
        log: 'has assign to @indika to task',
      },
    ],
  },
  {
    id: 1,
    date: '2020 Jan 30',
    details: [
      {time: '09:10 AM :', name: '@inidika', log: 'has update the task name'},
      {
        time: '01:25 PM :',
        name: '@inidika',
        log: 'has assign to @indika to task',
      },
    ],
  },
  {
    id: 2,
    date: '2020 Feb 1',
    details: [
      {time: '04:22 PM :', name: '@inidika', log: 'has update the task name'},
    ],
  },
];

class TasksLogScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;

    let selectedProjectTaskID = params.selectedProjectTaskID;
    this.fetchData(selectedProjectTaskID);
  }

  async fetchData(selectedProjectTaskID) {
    await APIServices.getTaskLogData(selectedProjectTaskID)
      .then(response => {
        if (response.message == 'success') {
          this.setState({indeterminate: false, files: [], uploading: 100});
          this.fetchData(this.props.selectedProjectID);
        } else {
          this.setState({indeterminate: false, files: [], uploading: 0});
        }
      })
      .catch(error => {
        if (error.status == 401) {
          this.setState({indeterminate: false, files: [], uploading: 0});
          this.showAlert('', error.data.message);
        }
      });
  }

  renderTaskLogDetailsList(item) {
    return (
      <View>
        <View style={styles.detailsView}>
          <Text style={styles.timeText}>{item.time}</Text>
          <View style={styles.logView}>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.logText}>{item.log}</Text>
          </View>
        </View>
      </View>
    );
  }

  renderTaskLogList(item) {
    return (
      <View>
        <View style={styles.dateView}>
          <Text style={styles.dateText}>{item.date}</Text>
        </View>
        <FlatList
          data={item.details}
          renderItem={({item}) => this.renderTaskLogDetailsList(item)}
          keyExtractor={item => item.id}
        />
      </View>
    );
  }

  renderTaskLog() {
    return (
      <View>
        {/* <View style={styles.taskLogTextView}>
          <Text style={styles.taskLogText}>Task Log</Text>
        </View> */}
        <FlatList
          style={styles.flatListStyle}
          data={taskLogData}
          renderItem={({item}) => this.renderTaskLogList(item)}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyListView />}
        />
      </View>
    );
  }

  render() {
    return <View style={styles.container}>{this.renderTaskLog()}</View>;
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  flatListStyle: {
    marginTop: '20rem',
  },
  taskLogTextView: {
    backgroundColor: colors.darkBlue,
    height: '50rem',
    justifyContent: 'center',
    marginBottom: '15rem',
  },
  taskLogText: {
    fontSize: '15rem',
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: '20rem',
  },
  dateView: {
    backgroundColor: colors.projDetails,
    height: '40rem',
    justifyContent: 'center',
    marginHorizontal: '20rem',
    borderRadius: '5rem',
    marginBottom: '10rem',
  },
  dateText: {
    fontSize: '15rem',
    color: colors.gray,
    fontWeight: 'bold',
    marginHorizontal: '15rem',
  },
  detailsView: {
    backgroundColor: colors.projectBgColor,
    height: '55rem',
    justifyContent: 'center',
    marginHorizontal: '20rem',
    borderRadius: '5rem',
    marginBottom: '10rem',
    paddingHorizontal: '15rem',
  },
  timeText: {
    color: colors.gray,
    fontWeight: 'bold',
    fontSize: '10rem',
    marginBottom: '2rem',
  },
  logView: {
    flexDirection: 'row',
  },
  nameText: {
    color: colors.gray,
    fontWeight: 'bold',
    marginRight: '5rem',
    fontSize: '11rem',
  },
  logText: {
    color: colors.gray,
    fontSize: '11rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(TasksLogScreen);
