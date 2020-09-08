import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Loader from '../../../components/Loader';
import moment from 'moment';
import FadeIn from 'react-native-fade-in-image';
import {SkypeIndicator} from 'react-native-indicators';
import {NavigationEvents} from 'react-navigation';
import APIServices from '../../../services/APIServices';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import EmptyListView from '../../../components/EmptyListView';
const {height, width} = Dimensions.get('window');

const Placeholder = () => (
  <View style={styles.landing}>
    <SkypeIndicator color={colors.primary} />
  </View>
);

class WorkloadTabTasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      selectedProjectID: 0,
      isActive: this.props.isActive,
      workloadTasks: [],
      dataLoading: false,
      isCollapsed: true,
      activeSections: [],
      enableScrollViewScroll: true,
      from: this.props.from,
      to: this.props.to,
      noData: '',
      refresh: false,
    };
  }

  async componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      let selectedUserId = this.props.selectedUserId;
      this.getAllWorkloadTasks(selectedUserId, this.props.from, this.props.to);
    }
    if (
      prevProps.from !== this.props.from ||
      prevProps.to !== this.props.to ||
      prevProps.date !== this.props.date
    ) {
      await this.setState({from: this.props.from, to: this.props.to});
      this.getAllWorkloadTasks(
        this.props.selectedUserId,
        this.state.from,
        this.state.to,
      );
    }
  }

  async getAllWorkloadTasks(selectedUserId, from, to) {
    this.setState({dataLoading: true, noData: '', workloadTasks: []});
    try {
      let workloadTasks = await APIServices.getWorkloadWithAssignTasksCompletion(
        selectedUserId,
        from,
        to,
      );
      if (workloadTasks.message == 'success') {
        this.setState({
          workloadTasks: workloadTasks.data,
          dataLoading: false,
        });
        if (workloadTasks.data.length > 0) {
          this.setState({noData: ''});
        } else {
          this.setState({noData: 'No data found'});
        }
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  _onRefresh = async () => {
    await this.setState({
      from: 'all',
      to: 'all',
      refresh: false,
      dataLoading: true,
    });
    this.getAllWorkloadTasks(
      this.props.selectedUserId,
      this.state.from,
      this.state.to,
    );
  };

  dateView = function(item) {
    let date = item.taskDueDateAt;
    let currentTime = moment().format();
    let dateText = '';
    let color = '';

    let taskStatus = item.taskStatus;
    if (taskStatus == 'closed' && date) {
      // task complete
      dateText = moment.parseZone(date).format('DD/MM/YYYY');
      color = colors.colorForestGreen;
    } else if (taskStatus != 'closed' && date) {
      if (moment.parseZone(date).isAfter(currentTime)) {
        dateText = moment.parseZone(date).format('DD/MM/YYYY');
        color = colors.colorMidnightBlue;
      } else {
        dateText = moment.parseZone(date).format('DD/MM/YYYY');
        color = colors.colorBittersweet;
      }
    } else {
      dateText = 'Add Due Date';
      color = colors.black;
    }

    return <Text style={[styles.textDate, {color: color}]}>{dateText}</Text>;
  };

  userImage = function(item) {
    let userImage = item.taskAssigneeProfileImage;

    if (userImage) {
      return (
        <FadeIn>
          <Image source={{uri: userImage}} style={styles.imageStyle} />
        </FadeIn>
      );
    } else {
      return <Image style={styles.imageStyle} source={icons.defultUser} />;
    }
  };

  _renderHeader = (section, index) => {
    return section.total == 0 ? (
      <TouchableOpacity>
        <Animatable.View
          duration={400}
          style={[
            styles.header,
            {
              backgroundColor:
                section.total == 0 ? colors.noTasksColor : colors.darkBlue,
              borderBottomEndRadius:
                index == this.state.activeSections[0] ? 0 : 5,
              borderBottomStartRadius:
                index == this.state.activeSections[0] ? 0 : 5,
            },
          ]}>
          <View style={{flex: 1}}>
            <Text style={styles.headerText}>
              {section.projectName} - {section.completed}/{section.total}
            </Text>
          </View>

          <Image
            style={styles.dropIcon}
            source={
              index == this.state.activeSections[0]
                ? icons.arrowDown
                : section.total == 0
                ? icons.arrowUpGray
                : icons.arrowUp
            }
          />
        </Animatable.View>
      </TouchableOpacity>
    ) : (
      <Animatable.View
        duration={400}
        style={[
          styles.header,
          {
            backgroundColor:
              section.total == 0 ? colors.noTasksColor : colors.darkBlue,
            borderBottomEndRadius:
              index == this.state.activeSections[0] ? 0 : 5,
            borderBottomStartRadius:
              index == this.state.activeSections[0] ? 0 : 5,
          },
        ]}>
        <View style={{flex: 1}}>
          <Text style={styles.headerText}>
            {section.projectName} - {section.completed}/{section.total}
          </Text>
        </View>

        <Image
          style={styles.dropIcon}
          source={
            index == this.state.activeSections[0]
              ? icons.arrowDown
              : section.total == 0
              ? icons.arrowUpGray
              : icons.arrowUp
          }
        />
      </Animatable.View>
    );
  };

  _renderContent(item, userId, projectId, isActive) {
    return (
      <Animatable.View
        animation={isActive ? 'bounceIn' : undefined}
        duration={400}
        style={styles.flatListView}>
        <FlatList
          style={styles.flatListStyle}
          data={item}
          renderItem={({item, index}) =>
            this.renderProjectList(item, index, userId, projectId)
          }
          keyExtractor={item => item.taskId}
        />
      </Animatable.View>
    );
  }

  _updateSections = activeSections => {
    this.setState({activeSections});
    if (!activeSections.length == 0) {
      let fy = activeSections * 70;
      this._myScroll.scrollTo({x: 0, y: fy, animated: true});
    }
  };

  renderProjectList(item, index, userId, projectId) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('WorkloadTasksDetailsScreen', {
            workloadTasksDetails: item,
            userId: userId,
            projectId: projectId,
          })
        }>
        <View style={styles.projectView}>
          <Image
            style={styles.completionIcon}
            source={
              item.taskStatus == 'closed'
                ? icons.rightCircule
                : icons.circuleGray
            }
          />
          <View style={{flex: 1}}>
            <Text style={styles.text}>{item.taskName}</Text>
          </View>
          <View style={styles.statusView}>
            {this.dateView(item)}
            {/* {this.userImage(item)} */}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    let dataLoading = this.state.dataLoading;

    return (
      <View style={styles.container}>
        <NavigationEvents
          onWillFocus={() =>
            this.getAllWorkloadTasks(
              this.props.selectedUserId,
              this.state.from,
              this.state.to,
            )
          }
        />
        <ScrollView
          style={{flex: 1}}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refresh}
              onRefresh={this._onRefresh}
            />
          }
          ref={myScroll => (this._myScroll = myScroll)}>
          {this.state.workloadTasks.length > 0 ? (
            <Accordion
              underlayColor={colors.white}
              sections={this.state.workloadTasks}
              containerStyle={styles.accordionStyle}
              activeSections={this.state.activeSections}
              renderHeader={this._renderHeader}
              renderContent={item =>
                this._renderContent(item.taskList, item.userId, item.projectId)
              }
              onChange={this._updateSections}
            />
          ) : (
            <View style={styles.noDataStyle}>
              {this.state.noData !== '' ? <EmptyListView /> : null}
            </View>
          )}
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
  projectView: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
    height: '60rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '11rem',
    color: colors.projectTaskNameColor,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  textDate: {
    fontSize: '9rem',
    fontWeight: '400',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    marginRight: '5rem',
  },
  statusView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dropIcon: {
    width: '20rem',
    height: '20rem',
  },
  completionIcon: {
    width: '40rem',
    height: '40rem',
  },
  landing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: '20rem',
    marginHorizontal: '20rem',
    marginTop: '10rem',
    borderTopStartRadius: '5rem',
    borderTopEndRadius: '5rem',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'left',
    fontSize: '15rem',
    fontWeight: '500',
    color: colors.white,
  },
  flatListStyle: {
    marginBottom: '10rem',
    marginTop: '10rem',
  },
  flatListView: {
    marginHorizontal: '20rem',
    borderBottomEndRadius: '5rem',
    borderBottomStartRadius: '5rem',
    backgroundColor: colors.projectBgColor,
  },
  noDataStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageStyle: {
    width: '22rem',
    height: '22rem',
    borderRadius: 50 / 2,
  },
  accordionStyle: {
    marginBottom: '20rem',
    marginTop: '10rem',
  },
});

const mapStateToProps = state => {
  return {
    allTaskByProjectLoading: state.project.allTaskByProjectLoading,
    allTaskByProject: state.project.allTaskByProject,
    myTaskByProjectLoading: state.project.myTaskByProjectLoading,
    myTaskByProject: state.project.myTaskByProject,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(WorkloadTabTasksScreen);
