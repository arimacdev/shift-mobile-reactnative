import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import FadeIn from 'react-native-fade-in-image';
import Loader from '../../../components/Loader';
import Header from '../../../components/Header';
import APIServices from '../../../services/APIServices'
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationEvents} from 'react-navigation';

class SubTasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProjectID : '',
      selectedProjectTaskID: '',
      userID : '',
      subTasks : [],
    };
  }


  componentDidMount() {
    AsyncStorage.getItem('userID').then(userID => {
      if (userID) {
        const {navigation: {state: {params}}} = this.props;
        let selectedProjectID = params.selectedProjectID
        let selectedProjectTaskID = params.selectedProjectTaskID
        this.setState({
          selectedProjectID : selectedProjectID,
          selectedProjectTaskID : selectedProjectTaskID,
          userID : userID}, function() {
          this.fetchData(userID);
        });
      } 
    });
  }

  async fetchData(userID) {
      let selectedProjectID = this.state.selectedProjectID
      let selectedProjectTaskID = this.state.selectedProjectTaskID
      this.setState({dataLoading:true});
      subTaskData = await APIServices.getSubTaskData(selectedProjectID,selectedProjectTaskID,userID);
      if(subTaskData.message == 'success'){
        this.setState({
          subTasks : subTaskData.data,
          dataLoading:false
        });
      }else{
        this.setState({dataLoading:false});
      }
  }

  async deleteSubTask(item){
      let selectedProjectID = this.state.selectedProjectID;
      let selectedProjectTaskID = this.state.selectedProjectTaskID;
      let userID = this.state.userID;
      this.setState({dataLoading:true});
      resultObj = await APIServices.deleteSubTask(selectedProjectID,selectedProjectTaskID,item.subtaskId);
      if(resultObj.message == 'success'){
        this.setState({dataLoading:false});
        this.fetchData(userID);
      }else{
        this.setState({dataLoading:false});
      }
  }

  editSubTask(item){
    let selectedProjectID = this.state.selectedProjectID;
    let selectedProjectTaskID = this.state.selectedProjectTaskID;
    this.props.navigation.navigate('AddEditSubTaskScreen', {
      item: item,
      projectID : selectedProjectID,
      taskID : selectedProjectTaskID,
      screenType : 'edit'
    });
  }

  addSubTask(){
    let selectedProjectID = this.state.selectedProjectID;
    let selectedProjectTaskID = this.state.selectedProjectTaskID;
    this.props.navigation.navigate('AddEditSubTaskScreen', {
      item: {},
      projectID : selectedProjectID,
      taskID : selectedProjectTaskID,
      screenType : 'add'
    });
  }

  loadSubtasks(){
    let userID = this.state.userID;
    this.fetchData(userID);
  }

  renderSubTaskListList(item) {
    return (
        <View style={styles.subTaskView}>
          <NavigationEvents onWillFocus={payload => this.loadSubtasks(payload)} />
          <Image
            source={item.subtaskStatus? icons.rightCircule : icons.whiteCircule}
            style={styles.taskStateIcon}
          />
          <View style={{flex: 1}}>
            <Text style={styles.text}>
              {item.subtaskName}
            </Text>
          </View>
          <View style={styles.controlView}>
            <TouchableOpacity 
                onPress={() => this.editSubTask(item)}>
                <Image 
                  style={{width: 28, height: 28,borderRadius: 28/ 2 }} 
                  source={require('../../../asserts/img/edit_user.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity 
                  onPress={() => this.deleteSubTask(item)}
                  style={{marginLeft: EStyleSheet.value('20rem')}}>
              <Image
                style={styles.editDeleteIcon}
                source={icons.deleteRoundRed}
              />
            </TouchableOpacity>
          </View>
        </View>
    );
  }


  onBackPress() {
    this.props.navigation.goBack();
  }

  render() {
    let subTasks = this.state.subTasks;
    let dataLoading = this.props.dataLoading;

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flalList}
          data={subTasks}
          renderItem={({item}) => this.renderSubTaskListList(item)}
          keyExtractor={item => item.subtaskId}
        />
        <TouchableOpacity onPress={() => this.addSubTask()}>
          <View style={styles.button}>
            <Image
              style={styles.bottomBarIcon}
              source={icons.taskWhite}
              resizeMode={'center'}
            />
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>Add new Sub Task</Text>
            </View>

            <Image
              style={styles.addIcon}
              source={icons.add}
              resizeMode={'center'}
            />
          </View>
        </TouchableOpacity>
        {dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  subTaskView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    height: '60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
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
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  flalList: {
    marginTop: '20rem',
    marginBottom: '0rem',
  },
  taskStateIcon: {
    width: '30rem',
    height: '30rem',
  },
  editDeleteIcon: {
    width: 25,
    height: 25,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
    marginTop: '17rem',
    marginBottom: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonText: {
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    fontWeight: 'bold',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
    marginRight: 10,
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
    marginRight: 15,
    marginLeft: 10,
  },
});

const mapStateToProps = state => {
  return {
  };
};
export default connect(
  mapStateToProps,
  actions,
)(SubTasksScreen);
