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
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import APIServices from '../../../services/APIServices';
import Header from '../../../components/Header';
import Loader from '../../../components/Loader';
import {NavigationEvents} from 'react-navigation';
import EmptyListView from '../../../components/EmptyListView';
import AwesomeAlert from 'react-native-awesome-alerts';

class DrawerTasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupName: '',
      groupTasks: [],
      dataLoading: false,
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  async componentDidMount() {}

  async fetchData() {
    this.setState({dataLoading: true});
    let groupTaskData = await APIServices.getGroupTaskData();
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
      let newGroupTaskData = await APIServices.addGroupTaskData(groupName);
      if (newGroupTaskData.message == 'success') {
        this.setState({dataLoading: false, groupName: ''});
        this.fetchData();
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      this.setState({dataLoading: false});
      this.showAlert('', e.data.message);
    }
  }

  renderGroupTasks(item) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('TasksTabScreen', {taskDetails: item})
        }>
        <View style={styles.groupTaskView}>
          <Image style={styles.taskIconStyle} source={icons.taskBlue} />
          <View style={{flex: 1}}>
            <Text style={styles.textGroupName}>{item.taskGroupName}</Text>
          </View>
          <View style={styles.controlView}>
            <Image style={styles.userIconStyle} source={icons.users} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  loadData() {
    this.fetchData();
  }

  hideAlert() {
    this.setState({
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
    });
  }

  showAlert(title, msg) {
    this.setState({
      showAlert: true,
      alertTitle: title,
      alertMsg: msg,
    });
  }

  render() {
    let groupName = this.state.groupName;
    let groupTasks = this.state.groupTasks;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;

    return (
      <View style={styles.container}>
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
          ListEmptyComponent={<EmptyListView />}
        />
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
            overlayStyle={{backgroundColor: colors.alertOverlayColor}}
            contentContainerStyle={styles.alertContainerStyle}
            confirmButtonStyle={styles.alertConfirmButtonStyle}
          />
        {dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
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
  taskIconStyle: {
    width: '18rem',
    height: '18rem',
  },
  userIconStyle: {
    width: '16rem',
    height: '16rem',
    marginRight: '16rem',
  },
  alertContainerStyle: {
    bottom: 0,
    width: '100%',
    maxWidth: '100%',
    position: 'absolute',
    borderRadius: 0,
    borderTopStartRadius: '5rem',
    borderTopEndRadius: '5rem',
  },
  alertConfirmButtonStyle: {
    width: '100rem',
    backgroundColor: colors.colorBittersweet,
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(DrawerTasksScreen);
