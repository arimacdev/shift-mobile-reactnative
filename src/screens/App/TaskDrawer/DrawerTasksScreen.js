import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import APIServices from '../../../services/APIServices';
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import {NavigationEvents} from 'react-navigation';

class DrawerTasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
      groupTasks: [],
      dataLoading: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  async componentDidMount() {}

  async fetchData() {
    this.setState({dataLoading: true});
    groupTaskData = await APIServices.getGroupTaskData();
    if (groupTaskData.message == 'success') {
      this.setState({dataLoading: false, groupTasks: groupTaskData.data});
    } else {
      this.setState({dataLoading: false});
    }
  }

  onNewGroupNameChange(text) {
    this.setState({groupName: text});
  }

  async onNewGroupNameSubmit(text) {
    try {
      let groupName = this.state.groupName;
      this.setState({dataLoading: true});
      newGroupTaskData = await APIServices.addGroupTaskData(groupName);
      if (newGroupTaskData.message == 'success') {
        this.setState({dataLoading: false, groupName: ''});
        this.fetchData();
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      this.setState({dataLoading: false});
    }
  }

  renderGroupTasks(item) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('TasksTabScreen', {taskDetails: item})
        }>
        <View style={styles.groupTaskView}>
          <Image style={{width: 20, height: 20}} source={icons.taskBlue} />
          <View style={{flex: 1}}>
            <Text style={styles.textGroupName}>{item.taskGroupName}</Text>
          </View>
          <View style={styles.controlView}>
            <Image
              style={{width: 18, height: 18, marginRight: 17}}
              source={icons.users}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  loadData() {
    this.fetchData();
  }

  render() {
    let groupName = this.state.groupName;
    let groupTasks = this.state.groupTasks;
    let dataLoading = this.state.dataLoading;

    return (
      <View style={styles.backgroundImage}>
        <NavigationEvents onWillFocus={payload => this.loadData(payload)} />
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('MyTasksTabScreen')}>
          <View style={styles.button}>
            <Image
              style={[styles.bottomBarIcon, {marginRight: 15, marginLeft: 10}]}
              source={icons.taskWhite}
              resizeMode={'contain'}
            />
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>My personal tasks</Text>
            </View>
          </View>
        </TouchableOpacity>
        <View style={[styles.addNewFieldView, {flexDirection: 'row'}]}>
          <Image
            style={styles.addNewIcon}
            source={icons.blueAdd}
            resizeMode={'contain'}
          />
          <TextInput
            style={[styles.textInput, {width: '95%'}]}
            placeholder={'Add a new group'}
            value={groupName}
            onChangeText={groupName => this.onNewGroupNameChange(groupName)}
            onSubmitEditing={() =>
              this.onNewGroupNameSubmit(this.state.groupName)
            }
          />
        </View>
        <FlatList
          style={styles.flalList}
          data={groupTasks}
          renderItem={({item}) => this.renderGroupTasks(item)}
          keyExtractor={item => item.projId}
        />
        {dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
    //  backgroundColor: colors.pageBackGroundColor,
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
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
  },
  buttonText: {
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Bold',
    fontWeight: 'bold',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
  },
  addNewFieldView: {
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.taskBorderColor,
    marginTop: '14rem',
    marginBottom: '0rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '57rem',
    marginHorizontal: '20rem',
  },
  addNewIcon: {
    width: '23rem',
    height: '23rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
  },
  flalList: {
    marginTop: '14rem',
    marginBottom: '10rem',
  },
  groupTaskView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    height: '60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  textGroupName: {
    fontSize: '12rem',
    color: colors.userListUserNameColor,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '600',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(DrawerTasksScreen);
