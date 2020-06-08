import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import NavigationService from '../../../services/NavigationService';
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
const initialLayout = {width: entireScreenWidth};

class WorkloadSearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      workload: [],
      allWorkload: [],
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
      let workloadArray = [];
      workloadArray = workloadData.data;
      this.setState({workload: workloadArray, allWorkload: workloadArray});
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
      this.setState({workload: workloadArray, allWorkload: workloadArray});
    } else {
      this.setState({dataLoading: false});
    }
  }

  async tabOpen() {}

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

  onSearchTextChange(text) {
    this.setState({searchText: text});
    let result = this.state.allWorkload.filter(
      data =>
        data.firstName.toLowerCase().includes(text.toLowerCase()) ||
        data.lastName.toLowerCase().includes(text.toLowerCase()),
    );
    if (text == '') {
      this.setState({workload: this.state.allWorkload});
    } else {
      this.setState({workload: result});
    }
  }

  renderPeopleList(item) {
    let progress = 0;
    if (item.totalTasks > 0) {
      progress = item.tasksCompleted / item.totalTasks;
    }
    return (
      <TouchableOpacity
        style={styles.mainContainer}
        onPress={() => this.navigateToWorkloadTabScreen(item)}>
        {/* <NavigationEvents onWillFocus={payload => this.tabOpen(payload)} /> */}
        <View style={styles.userView}>
          {this.userIcon(item)}
          <View style={{flex: 1}}>
            <Text style={styles.text}>
              {item.firstName + ' ' + item.lastName}
            </Text>
            <Text style={styles.subText}>{item.email}</Text>
          </View>
        </View>
        <Text style={styles.subText}>
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
        <View style={styles.workloadFilerView}>
          <Image style={styles.searchIcon} source={icons.searchGray} />
          <TextInput
            style={[styles.textInput, {width: '95%'}]}
            placeholder={'Search'}
            value={this.state.searchText}
            onChangeText={text => this.onSearchTextChange(text)}
          />
        </View>
        <FlatList
          style={styles.flalList}
          data={this.state.workload}
          renderItem={({item}) => this.renderPeopleList(item)}
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
    fontSize: '12rem',
    color: colors.userListUserNameColor,
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
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  flalList: {
    marginTop: '0rem',
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
  workloadFilerView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
    flexDirection: 'row',
  },
  searchIcon: {
    width: '17rem',
    height: '17rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '7rem',
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
)(WorkloadSearchScreen);
