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
import AsyncStorage from '@react-native-community/async-storage';
import APIServices from '../../../services/APIServices';
import moment from 'moment';
import AwesomeAlert from 'react-native-awesome-alerts';


class FilesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      dataLoading : false,
      projectID : '',
      taskID : '',
      userID : '',
      addedUser : '',
      showAlert : false,
      alertTitle : '',
      alertMsg : '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  }

  componentDidMount() {
    AsyncStorage.getItem('userID').then(userID => {
      if (userID) {
        const {navigation: {state: {params}}} = this.props;
        let projectID = params.projectID
        let taskID = params.taskID
        this.setState({
          projectID : projectID,
          taskID : taskID,
          userID : userID}, function() {
          this.fetchData(userID);
        });
      } 
    });
  }

  async fetchData(userID) {
      let projectID = this.state.projectID
      let taskID = this.state.taskID
      this.setState({dataLoading:true});
      filesData = await APIServices.getFilesInTaskData(projectID,taskID,userID);
      if(filesData.message == 'success'){
        this.setState({files : filesData.data,dataLoading:false});
      }else{
        this.setState({dataLoading:false});
      }
  }

  async deleteFile(item){
    let projectID = this.state.projectID;
    let taskID = this.state.taskID;
    let userID = this.state.userID;
    let taskFileId = item.taskFileId;

    this.setState({dataLoading:true});
    try {
      resultObj = await APIServices.deleteFileInTaskData(projectID,taskID,taskFileId);
      if(resultObj.message == 'success'){
        this.setState({dataLoading:false});
        this.fetchData(userID);
      }else{
        this.setState({dataLoading:false});
      }
    }
    catch(e) {
      if(e.status == 401){
        this.setState({dataLoading:false});
        this.showAlert("",e.data.message);
      }
    }
    
}

  renderUserListList(item) {
    // let fileDateText = '';
    // let fileDate = moment.parseZone(item.taskFileDate).format('Do MMMM YYYY');
    // let fileTimeText = '';
    // let fileTime = moment.parseZone(item.taskFileDate).format('hh:mmA');
    // if(fileDate != 'Invalid date'){
    //   fileDateText = fileDate;
    //   fileTimeText = fileTime
    // }else{
    //   fileDateText = '';
    // }
    return (
      <TouchableOpacity onPress={()=>this.props.navigation.navigate('FilesView',{filesData:item})}>
        <View style={styles.filesView}>
          <Image source={icons.gallary} style={styles.taskStateIcon} />
          <View style={{flex: 1}}>
            <Text style={styles.text}>
              {item.taskFileName}
            </Text>
            <Text style={styles.textDate}>
            </Text>
          </View>
          <View style={styles.controlView}>
            <TouchableOpacity 
              onPress={() => this.deleteFile(item)}
              style={{marginLeft: EStyleSheet.value('24rem')}}>
                  <Image 
                    style={{width: 28, height: 28,borderRadius: 28/ 2 }} 
                    source={require('../../../asserts/img/bin.png')}
                  />
              </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  

  onBackPress() {
    this.props.navigation.goBack();
  };

  hideAlert (){
    this.setState({
      showAlert : false,
      alertTitle : '',
      alertMsg : '',
    })
  }

  showAlert(title,msg){
    this.setState({
      showAlert : true,
      alertTitle : title,
      alertMsg : msg,
    })
  }
  render() {
    let files = this.state.files;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.flalList}
          data={files}
          renderItem={({item}) => this.renderUserListList(item)}
          keyExtractor={item => item.projId}
        />
        {dataLoading && <Loader />}
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
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  filesView: {
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lighterGray,
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
  textDate:{
    fontSize: '10rem',
    color: colors.lightgray,
    textAlign: 'center',
    lineHeight: '13rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  flalList: {
    marginTop: '20rem',
    marginBottom: '10rem',
  },
  taskStateIcon: {
    width: '25rem',
    height: '25rem',
  },
  editDeleteIcon: {
    width: '25rem',
    height: '25rem',
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
    marginRight: '10rem',
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
    marginRight: '15rem',
    marginLeft: '10rem',
  },
  userIcon:{
    width: '28rem',
    height: '28rem',
    borderRadius: 56 / 2,
  }
});

const mapStateToProps = state => {
  return {
    usersLoading: state.users.usersLoading,
    users: state.users.users,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(FilesScreen);
