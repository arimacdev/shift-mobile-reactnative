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
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
import AddNewTasksScreen from '../Tasks/AddNewTasksScreen';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import moment from 'moment';
import FadeIn from 'react-native-fade-in-image';
import {SkypeIndicator} from 'react-native-indicators';
import {NavigationEvents} from 'react-navigation';
import APIServices from '../../../services/APIServices';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import Collapsible from '../../../components/CollapsibleView';
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
      filterdDataAllTaks: [],
      allDataAllTaks: [],
      filterdDataMyTasks: [],
      allDataMyTasks: [],
      index: 0,
      bottomItemPressColor: colors.darkBlue,
      selectedProjectID: 0,
      isActive: this.props.isActive,
      selectedTypeAllTasks: 'Pending',
      selectedTypeMyTasks: 'Pending',

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
    let workloadTasks = await APIServices.getWorkloadWithAssignTasksCompletion(
      selectedUserId,
      from,
      to,
    );
    if (workloadTasks.message == 'success') {
      // this.setProjectTaskData(projectTaskDetailsData.data);
      // projectData = await APIServices.getProjectData(selectedProjectID);
      if (workloadTasks.message == 'success') {
        this.setState({workloadTasks: workloadTasks.data, dataLoading: false});
        if (workloadTasks.data.length > 0) {
          this.setState({noData: ''});
        } else {
          this.setState({noData: 'No data found'});
        }
      } else {
        this.setState({dataLoading: false});
      }
    } else {
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
    let date = item.dueDate;
    let currentTime = moment().format();
    let dateText = '';
    let color = '';

    let taskStatus = item.taskStatus;
    if (taskStatus == 'closed' && date) {
      // task complete
      dateText = moment(date).format('DD/MM/YYYY');
      color = '#36DD5B';
    } else if (taskStatus != 'closed' && date) {
      if (moment(date).isAfter(currentTime)) {
        dateText = moment(date).format('DD/MM/YYYY');
        color = '#0C0C5A';
      } else {
        dateText = moment(date).format('DD/MM/YYYY');
        color = '#ff6161';
      }
    } else {
      dateText = 'Add Due Date';
      color = '#000000';
    }

    return <Text style={[styles.textDate, {color: color}]}>{dateText}</Text>;
  };

  userImage = function(item) {
    let userImage = item.taskAssigneeProfileImage;

    if (userImage) {
      return (
        <FadeIn>
          <Image
            source={{uri: userImage}}
            style={{width: 24, height: 24, borderRadius: 24 / 2}}
          />
        </FadeIn>
      );
    } else {
      return (
        <Image
          style={{width: 24, height: 24, borderRadius: 24 / 2}}
          source={require('../../../asserts/img/defult_user.png')}
        />
      );
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

  // onEnableScroll= (value: boolean) => {
  //   this.setState({
  //     enableScrollViewScroll: value,
  //   });
  // };

  _renderContent(item, userId, projectId, isActive) {
    return (
      <Animatable.View
        animation={isActive ? 'bounceIn' : undefined}
        duration={400}
        style={styles.flatListView}>
        <FlatList
          style={styles.flatListStyle}
          //   onTouchStart={() => {
          //     this.setState({enableScrollViewScroll:false})
          //  }}
          //  onMomentumScrollEnd={() => {
          //   this.setState({enableScrollViewScroll:true})
          //  }}
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

  // _updateSections = activeSections => {
  //   this.setState({activeSections});

  //   let activeSectionPostion = activeSections[0];
  //   let px = activeSectionPostion.x ? activeSectionPostion.x - 50 : 150;
  //   console.log('dddddddddddddddddd', activeSectionPostion.x);
  //   setTimeout(() => {
  //     this._myScroll.scrollTo(px, 0, true);
  //   }, 50);
  // };

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

  renderBase() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Image style={styles.dropIcon} source={icons.arrowDark} />
      </View>
    );
  }

  onFilterAllTasks(key) {
    let value = key;
    let searchValue = '';
    let index = this.state.index;
    switch (value) {
      case 'Pending':
        searchValue = 'pending';
        break;
      case 'Implementing':
        searchValue = 'implementing';
        break;
      case 'QA':
        searchValue = 'qa';
        break;
      case 'Ready to Deploy':
        searchValue = 'readyToDeploy';
        break;
      case 'Re-Opened':
        searchValue = 'reOpened';
        break;
      case 'Deployed':
        searchValue = 'deployed';
        break;
      case 'Closed':
        searchValue = 'closed';
        break;
    }

    let filteredData = this.state.allDataAllTaks.filter(function(item) {
      return item.taskStatus.includes(searchValue);
    });
    this.setState({
      filterdDataAllTaks: filteredData,
      selectedTypeAllTasks: key,
    });
  }

  onFilterMyTasks(key) {
    let value = key;
    let searchValue = '';
    let index = this.state.index;
    switch (value) {
      case 'Pending':
        searchValue = 'pending';
        break;
      case 'Implementing':
        searchValue = 'implementing';
        break;
      case 'QA':
        searchValue = 'qa';
        break;
      case 'Ready to Deploy':
        searchValue = 'readyToDeploy';
        break;
      case 'Re-Opened':
        searchValue = 'reOpened';
        break;
      case 'Deployed':
        searchValue = 'deployed';
        break;
      case 'Closed':
        searchValue = 'closed';
        break;
    }
    let filteredData = this.state.allDataMyTasks.filter(function(item) {
      return item.taskStatus.includes(searchValue);
    });
    this.setState({
      filterdDataMyTasks: filteredData,
      selectedTypeMyTasks: key,
    });
  }

  onSuccess(text) {
    console.log('text', text);
  }

  renderCollaps(item) {
    console.log('item', item.item);
    return (
      <Collapsible title={item.item.projectName} data={item.item.taskList} />
    );
  }

  render() {
    let dataLoading = this.state.dataLoading;
    // let filterdDataMyTasks = this.state.filterdDataMyTasks;

    return (
      <View
        style={styles.backgroundImage}
        // onStartShouldSetResponderCapture={() => {
        //   this.setState({enableScrollViewScroll: true});
        // }}
      >
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
          // scrollEnabled={this.state.enableScrollViewScroll}
          ref={myScroll => (this._myScroll = myScroll)}>
          {this.state.workloadTasks.length > 0 ? (
            <Accordion
              underlayColor={colors.white}
              sections={this.state.workloadTasks}
              // sectionContainerStyle={{height:200}}
              containerStyle={{marginBottom: 20, marginTop: 10}}
              activeSections={this.state.activeSections}
              renderHeader={this._renderHeader}
              renderContent={item =>
                this._renderContent(item.taskList, item.userId, item.projectId)
              }
              onChange={this._updateSections}
            />
          ) : (
            <View style={styles.noDataStyle}>
              <Text style={{color: colors.gray, fontSize: 20}}>
                {this.state.noData}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* <FlatList
          style={styles.flatListStyle}
          data={this.state.workloadTasks}
          renderItem={(item) => this.renderCollaps(item)}
          keyExtractor={item => item.taskId}
        /> */}

        {dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
    // backgroundColor: colors.pageBackGroundColor,
  },
  projectFilerView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    // width: '330rem',
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
  },
  textFilter: {
    fontSize: '14rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
    // fontWeight: 'bold',
  },
  projectView: {
    backgroundColor: colors.white,
    borderRadius: 5,
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
    width: '20rem',
    height: '20rem',
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
  landing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    paddingTop: 20,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  header: {
    padding: 20,
    marginHorizontal: 20,
    marginTop: 10,
    borderTopStartRadius: 5,
    borderTopEndRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'left',
    fontSize: 16,
    fontWeight: '500',
    color: colors.white,
  },
  content: {
    padding: 0,
    backgroundColor: '#fff',
  },
  active: {
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inactive: {
    backgroundColor: 'rgba(245,252,255,1)',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },
  multipleToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 30,
    alignItems: 'center',
  },
  multipleToggle__title: {
    fontSize: 16,
    marginRight: 8,
  },
  flatListStyle: {
    marginBottom: '10rem',
    marginTop: '10rem',
  },
  flatListView: {
    // height: 300,
    marginHorizontal: 20,
    borderBottomEndRadius: 5,
    borderBottomStartRadius: 5,
    backgroundColor: colors.projectBgColor,
  },
  noDataStyle: {
    flex: 1,
    height: height - 200,
    alignItems: 'center',
    justifyContent: 'center',
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
