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
import * as actions from '../../../../redux/actions';
import colors from '../../../../config/colors';
import icons from '../../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Loader from '../../../../components/Loader';
import APIServices from '../../../../services/APIServices';
import moment from 'moment';
import AwesomeAlert from 'react-native-awesome-alerts';
import DocumentPicker from 'react-native-document-picker';
import ImagePicker from 'react-native-image-picker';

class MyTasksFilesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      dataLoading: false,
      taskID: '',
      userID: '',
      addedUser: '',
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.addFileTaskSuccess !== this.props.addFileTaskSuccess &&
      this.props.addFileTaskSuccess
    ) {
      this.fetchData();
    }
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let taskID = params.selectedTaskID;
    this.setState(
      {
        taskID: taskID,
      },
      function() {
        this.fetchData();
      },
    );
  }

  async fetchData() {
    let taskID = this.state.taskID;
    this.setState({dataLoading: true});
    let filesData = await APIServices.getFilesInMyTaskData(taskID);
    if (filesData.message == 'success') {
      this.setState({files: filesData.data, dataLoading: false});
    } else {
      this.setState({dataLoading: false});
    }
  }

  async deleteFile(item) {
    let taskID = this.state.taskID;
    let taskFileId = item.taskFileId;

    this.setState({dataLoading: true});
    try {
      let resultObj = await APIServices.deleteFileInMyTaskData(taskID, taskFileId);
      if (resultObj.message == 'success') {
        this.setState({dataLoading: false});
        this.fetchData();
      } else {
        this.setState({dataLoading: false});
      }
    } catch (e) {
      if (e.status == 401) {
        this.setState({dataLoading: false});
        this.showAlert('', e.data.message);
      }
    }
  }

  renderUserListList(item) {
    return (
      <TouchableOpacity>
        <View style={styles.filesView}>
          <Image source={icons.gallary} style={styles.taskStateIcon} />
          <View style={{flex: 1}}>
            <Text style={styles.text}>{item.taskFileName}</Text>
            <Text style={styles.textDate} />
          </View>
          <View style={styles.controlView}>
            <TouchableOpacity
              onPress={() => this.deleteFile(item)}
              style={{marginLeft: EStyleSheet.value('24rem')}}>
              <Image
                style={styles.deleteIconStyle}
                source={icons.deleteRoundRed}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  onBackPress() {
    this.props.navigation.goBack();
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

  async iOSFilePicker() {
    Alert.alert(
      'Add Files',
      'Select the file source',
      [
        {text: 'Camera', onPress: () => this.selectCamera()},
        {text: 'Gallery', onPress: () => this.selectGallery()},
        {text: 'Files', onPress: () => this.doumentPicker()},
        {text: 'Cancel', onPress: () => console.log('Back')},
      ],
      {
        cancelable: true,
      },
    );
  }

  async selectCamera() {
    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };
    ImagePicker.launchCamera(options, res => {
      if (res.didCancel) {
      } else if (res.error) {
      } else if (res.customButton) {
      } else {
        this.setImageForFile(res);
      }
    });
  }

  async selectGallery() {
    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };

    ImagePicker.launchImageLibrary(options, res => {
      if (res.didCancel) {
      } else if (res.error) {
      } else if (res.customButton) {
      } else {
        this.setImageForFile(res);
      }
    });
  }

  async setImageForFile(res) {
    this.onFilesCrossPress(res.uri);
    let imgName = res.fileName;
    if (typeof imgName === 'undefined' || imgName == null) {
      var getFilename = res.uri.split('/');
      imgName = getFilename[getFilename.length - 1];
    }
    await this.state.files.push({
      uri: res.uri,
      type: res.type, // mime type
      name: imgName,
      size: res.fileSize,
      dateTime:
        moment().format('YYYY/MM/DD') + ' | ' + moment().format('HH:mm'),
    });
    // this.setState({ files: this.state.files });

    await this.setState({
      files: this.state.files,
      indeterminate: true,
      Uploading: 0,
    });
  }

  async doumentPicker() {
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
      });
      for (const res of results) {
        this.onFilesCrossPress(res.uri);

        await this.state.files.push({
          uri: res.uri,
          type: res.type, // mime type
          name: res.name,
          size: res.size,
          dateTime:
            moment().format('YYYY/MM/DD') + ' | ' + moment().format('HH:mm'),
        });

        this.uploadFiles(this.state.files);
      }
      this.setState({files: this.state.files});
      console.log(this.state.files);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('file pick error', err);
      } else {
        throw err;
      }
    }
  }

  onFilesCrossPress(uri) {
    this.setState(
      {
        files: [],
      },
      () => {
        let filesArray = this.state.files.filter(item => {
          return item.uri !== uri;
        });
        this.setState({files: filesArray});
      },
    );
  }

  uploadFiles(file) {
    let taskID = this.state.taskID;
    this.props.addFileToMyTask(file, taskID);
  }

  render() {
    let files = this.state.files;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let addFileTaskLoading = this.props.addFileTaskLoading;
    return (
      <View style={styles.container}>
        <View flex={8}>
          <FlatList
            style={styles.flalList}
            data={files}
            renderItem={({item}) => this.renderUserListList(item)}
            keyExtractor={item => item.projId}
          />
        </View>
        <View flex={1}>
          <TouchableOpacity
            style={{}}
            onPress={() =>
              Platform.OS == 'ios' ? this.iOSFilePicker() : this.doumentPicker()
            }>
            <View style={styles.button}>
              <Image
                style={styles.bottomBarIcon}
                source={icons.taskWhite}
                resizeMode={'contain'}
              />
              <View style={{flex: 1}}>
                <Text style={styles.buttonText}>{'Add File'}</Text>
              </View>

              <Image
                style={styles.addIcon}
                source={icons.add}
                resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>
        </View>
        {dataLoading && <Loader />}
        {addFileTaskLoading && <Loader />}
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
    borderRadius: '5rem',
    borderWidth: '1rem',
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
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  textDate: {
    fontSize: '10rem',
    color: colors.lightgray,
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
  },
  taskStateIcon: {
    width: '25rem',
    height: '25rem',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
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
    marginRight: '10rem',
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
    marginRight: '15rem',
    marginLeft: '10rem',
  },
  deleteIconStyle: {
    width: '38rem',
    height: '38rem',
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
  return {
    addFileTaskLoading: state.tasks.addFileTaskLoading,
    addFileTaskSuccess: state.tasks.addFileTaskSuccess,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(MyTasksFilesScreen);
