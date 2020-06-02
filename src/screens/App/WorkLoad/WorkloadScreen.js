import React, {Component} from 'react';
import {
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import APIServices from '../../../services/APIServices';
import EStyleSheet from 'react-native-extended-stylesheet';
import FadeIn from 'react-native-fade-in-image';
import * as Progress from 'react-native-progress';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import {NavigationEvents} from 'react-navigation';
import EmptyListView from '../../../components/EmptyListView';
import icons from '../../../assest/icons/icons';

class WorkloadScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workload: [],
      admins: [],
      users: [],
      dataLoading: false,
    };
  }

  componentDidMount() {
    let loginUserType = this.props.loginUserType;
    if (loginUserType == 'SUPER_ADMIN') {
      this.fetchDataAdmin();
    } else {
      this.fetchDataUser();
    }
  }

  async fetchDataAdmin() {
    this.setState({dataLoading: true});
    let workloadData = await APIServices.getWorkloadWithCompletionAll();

    if (workloadData.message == 'success') {
      this.setState({dataLoading: false});
      let userIDHeder = null;
      userIDHeder = await AsyncStorage.getItem('userID');
      let workloadArray = [];
      workloadArray = workloadData.data;
      workloadArray.forEach(function(item, i) {
        if (item.userId === userIDHeder) {
          workloadArray.splice(i, 1);
          workloadArray.unshift(item);
        }
      });
      this.setState({workload: workloadArray});
    } else {
      this.setState({dataLoading: false});
    }
  }

  async fetchDataUser() {
    this.setState({dataLoading: true});
    let workloadData = await APIServices.getWorkloadWithCompletionUser();

    if (workloadData.message == 'success') {
      this.setState({dataLoading: false});
      let workloadArray = [];
      workloadArray = workloadData.data;
      this.setState({workload: workloadArray});
    } else {
      this.setState({dataLoading: false});
    }
  }

  async tabOpen() {
    let loginUserType = this.props.loginUserType;
    if (loginUserType == 'SUPER_ADMIN') {
      this.fetchDataAdmin();
    } else {
      this.fetchDataUser();
    }
  }

  userIcon = function(item) {
    let userImage = item.profileImage;
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

  navigateToWorkloadTabScreen(item) {
    this.props.navigation.navigate('WorkloadTabScreen', {
      workloadTaskDetails: item,
    });
  }

  renderWorkloadList(item, index) {
    let progress = 0;
    if (item.totalTasks > 0) {
      progress = item.tasksCompleted / item.totalTasks;
    }
    return (
      <TouchableOpacity
        style={index == 0 ? styles.mainContainerMy : styles.mainContainer}
        onPress={() => this.navigateToWorkloadTabScreen(item)}>
        <View style={index == 0 ? styles.userViewMy : styles.userView}>
          {this.userIcon(item)}
          <View style={{flex: 1}}>
            <Text style={index == 0 ? styles.textMy : styles.text}>
              {item.firstName + ' ' + item.lastName}
            </Text>
            <Text style={index == 0 ? styles.subTextMy : styles.subText}>
              {item.email}
            </Text>
          </View>
        </View>
        <Text style={index == 0 ? styles.subTextMy : styles.subText}>
          {item.tasksCompleted + ' / ' + item.totalTasks + ' Tasks Completed'}
        </Text>
        <View style={styles.progressBarContainer}>
          <Progress.Bar
            progress={progress}
            width={null}
            animated={true}
            color={colors.lightGreen}
            unfilledColor={colors.lightRed}
            borderWidth={0}
            height={14}
            borderRadius={10}
          />
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    let dataLoading = this.state.dataLoading;

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={payload => this.tabOpen(payload)} />
        <FlatList
          style={styles.flalList}
          data={this.state.workload}
          renderItem={({item, index}) => this.renderWorkloadList(item, index)}
          keyExtractor={item => item.projId}
          ListEmptyComponent={<EmptyListView />}
          // onRefresh={() => this.onRefresh()}
          // refreshing={isFetching}
        />
        {dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainerMy: {
    backgroundColor: colors.darkBlue,
    borderRadius: '5rem',
    marginHorizontal: '20rem',
    marginVertical: '7rem',
  },
  mainContainer: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginHorizontal: '20rem',
    marginVertical: '7rem',
  },
  subContainer: {
    marginBottom: '65rem',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
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
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
  },
  userViewMy: {
    backgroundColor: colors.darkBlue,
    borderRadius: '5rem',
    height: '60rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
  },
  userView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    height: '60rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
  },
  userIcon: {
    width: '45rem',
    height: '45rem',
  },
  text: {
    fontSize: '15rem',
    color: colors.userListUserNameColor,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  textMy: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  subText: {
    fontSize: '10rem',
    color: 'gray',
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  subTextMy: {
    fontSize: '10rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
    opacity: 0.8,
  },
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  flalList: {
    marginTop: '20rem',
    marginBottom: '0rem',
  },
  subTitle: {
    marginHorizontal: '20rem',
    fontSize: '16rem',
    color: colors.projDetailsProjectName,
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    top: '12rem',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    marginHorizontal: '10rem',
    marginVertical: '7rem',
  },
  imageStyle: {
    width: '43rem',
    height: '43rem',
    borderRadius: 90 / 2,
  },
});

const mapStateToProps = state => {
  return {
    loginUserType: state.users.loginUserType,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(WorkloadScreen);
