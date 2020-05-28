import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  TextInput
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
import DocumentPicker from 'react-native-document-picker';
import * as Progress from 'react-native-progress';
import RNFetchBlob from 'rn-fetch-blob';
import fileTypes from '../../../assest/fileTypes/fileTypes';
import ImagePicker from 'react-native-image-picker';

const a = [
  {
    uri: 'res.uri',
    type: 'res.type', // mime type
    name: 'aaaaa.jpg',
    size: 11445,
    dateTime: moment().format('YYYY/MM/DD') + ' | ' + moment().format('HH:mm'),
  },
  {
    uri: 'res.uri',
    type: 'res.type', // mime type
    name: 'ssss.jpg',
    size: 11445,
    dateTime: moment().format('YYYY/MM/DD') + ' | ' + moment().format('HH:mm'),
  },
  {
    uri: 'res.uri',
    type: 'res.type', // mime type
    name: 'vvvvv.jpg',
    size: 11445,
    dateTime: moment().format('YYYY/MM/DD') + ' | ' + moment().format('HH:mm'),
  },
];
class ProjectFilesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
      dataLoading: false,
      projectID: '',
      taskID: '',
      userID: '',
      addedUser: '',
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      filesData: [],
      allFilesData: [],
      progress: 0,
      loading: false,
      isFetching: false,
      Uploading: 0,
      indeterminate: false,
      searchText : '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    this.fetchData(this.props.selectedProjectID);
  }

  async fetchData(selectedProjectID) {
    this.setState({dataLoading: true});
    let filesData = await APIServices.getProjectFiles(selectedProjectID);
    if (filesData.message == 'success') {
      this.setState({
        filesData: filesData.data,
        allFilesData : filesData.data,
        dataLoading: false,
        isFetching: false,
      });
    } else {
      this.setState({dataLoading: false});
    }
  }

  actualDownload = item => {
    this.setState({
      progress: 0,
      loading: true,
    });
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      // add this option that makes response data to be stored as a file,
      // this is much more performant.
      path: dirs.DownloadDir + '/' + item.projectFileName,
      fileCache: true,
    })
      .fetch('GET', item.projectFileUrl, {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      })
      .progress((received, total) => {
        console.log('progress', received / total);
        this.setState({progress: received / total});
      })
      .then(res => {
        this.setState({
          progress: 100,
          loading: false,
        });
        this.showAlert(
          '',
          'Your file has been downloaded to downloads folder!',
        );
      });
  };

  async downloadFile(item) {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to download the file ',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.actualDownload(item);
      } else {
        Alert.alert(
          'Permission Denied!',
          'You need to give storage permission to download the file',
        );
      }
    } catch (err) {
      console.warn(err);
    }
  }

  deleteFileAlert (item){
    Alert.alert(
      'Delete File',
      'You are about to permanantly delete this file,\n If you are not sure, you can cancel this action.',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Ok', onPress: () => this.deleteFile(item)},
      ],
      {cancelable: false},
    );
  }

  async deleteFile(item) {
    let projectID = this.props.selectedProjectID;
    let projectFileId = item.projectFileId;

    this.setState({dataLoading: true});

    await APIServices.deleteProjectFile(projectID, projectFileId)
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false});
          this.fetchData(this.props.selectedProjectID);
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        if (error.status == 401) {
          this.setState({dataLoading: false});
          this.showAlert('', error.data.message);
        }
      });
  }

  bytesToSize(bytes) {
    var sizes = ['Bytes', 'Kb', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + '' + sizes[i];
  }

  getTypeIcons(fileName) {
    let key = fileName.split('.')[1];
    let imageType = '';
    switch (key) {
      case 'excel':
        imageType = fileTypes.excel;
        break;
      case 'jpg':
        imageType = fileTypes.jpg;
        break;
      case 'mp3':
        imageType = fileTypes.mp3;
        break;
      case 'pdf':
        imageType = fileTypes.pdf;
        break;
      case 'png':
        imageType = fileTypes.png;
        break;
      case 'video':
        imageType = fileTypes.video;
        break;
      case 'word':
        imageType = fileTypes.word;
        break;
      default:
        imageType = fileTypes.default;
        break;
    }
    return imageType;
  }

  onRefresh() {
    this.setState({isFetching: false, filesData: [],allFilesData:[]}, function() {
      this.fetchData(this.props.selectedProjectID);
    });
  }

  renderFilesList(item) {
    let details = '';
    let size = this.bytesToSize(item.projectFileSize);
    let date = moment(item.projectFileAddedOn).format('YYYY-MM-DD');
    let name = item.firstName + ' ' + item.lastName;

    details = size + ' | ' + date + ' by ' + name;

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('FilesView', {filesData: item})
        }>
        <View style={styles.filesView}>
          <Image
            source={this.getTypeIcons(item.projectFileName)}
            style={styles.taskStateIcon}
          />
          <View style={{flex: 1}}>
            <Text style={styles.text} numberOfLines={1}>
              {item.projectFileName}
            </Text>
            <Text style={styles.textDate} numberOfLines={1}>
              {details}
            </Text>
          </View>
          <View style={styles.controlView}>
            <TouchableOpacity
              onPress={() => this.downloadFile(item)}
              style={{marginLeft: EStyleSheet.value('24rem')}}>
              <Image
                style={{width: 30, height: 30}}
                source={icons.downloadIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.deleteFileAlert(item)}
              style={{marginLeft: EStyleSheet.value('10rem')}}>
              <Image
                style={{width: 30, height: 30}}
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
      'Add Files', 'Select the file source',
      [
        { text: 'Camera', onPress: () => this.selectCamera() },
        { text: 'Gallery', onPress: () => this.selectGallery() },
        { text: 'Files', onPress: () => this.doumentPicker() },
        { text: 'Cancel', onPress: () => console.log('Back') },
      ],
      {
        cancelable: true
      }
    );
  }

  async selectCamera() {
    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2
    };
    ImagePicker.launchCamera(options, (res) => {
      if (res.didCancel) {
      } else if (res.error) {
      } else if (res.customButton) {
      } else {
        this.setImageForFile(res)
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
      quality: 0.2
    };

    ImagePicker.launchImageLibrary(options, (res) => {
      if (res.didCancel) {
      } else if (res.error) {
      } else if (res.customButton) {
      } else {
        this.setImageForFile(res)
      }
    });
  }

  async setImageForFile(res) {
    this.onFilesCrossPress(res.uri);
    await this.state.files.push({
      uri: res.uri,
      type: res.type, // mime type
      name: 'Img ' + new Date().getTime(),
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

    await APIServices.uploadFileData(
      this.state.files,
      this.props.selectedProjectID,
    )
      .then(response => {
        if (response.message == 'success') {
          this.setState({indeterminate: false, files: [], Uploading: 100});
          this.fetchData(this.props.selectedProjectID);
        } else {
          this.setState({indeterminate: false, files: [], Uploading: 0});
        }
      })
      .catch(error => {
        if (error.status == 401) {
          this.setState({indeterminate: false, files: [], Uploading: 0});
          this.showAlert('', error.data.message);
        }
      });
      
  }

  async doumentPicker() {
    // Pick multiple files
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.plainText,
          DocumentPicker.types.pdf,
        ],
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
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size,
        );
      }
      await this.setState({
        files: this.state.files,
        indeterminate: true,
        Uploading: 0,
      });

      await APIServices.uploadFileData(
        this.state.files,
        this.props.selectedProjectID,
      )
        .then(response => {
          if (response.message == 'success') {
            this.setState({indeterminate: false, files: [], Uploading: 100});
            this.fetchData(this.props.selectedProjectID);
          } else {
            this.setState({indeterminate: false, files: [], Uploading: 0});
          }
        })
        .catch(error => {
          if (error.status == 401) {
            this.setState({indeterminate: false, files: [], Uploading: 0});
            this.showAlert('', error.data.message);
          }
        });
      // this.props.uploadFile(this.state.files, this.props.selectedProjectID);

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
    let projectID = this.state.projectID;
    let taskID = this.state.taskID;
    this.props.addFileToTask(file, taskID, projectID);
  }

  renderDocPickeredView() {
    return (
      <View
        style={{
          width: '100%',
          height: 50,
          borderRadius: 5,
          marginRight: 5,
          marginTop: 5,
          justifyContent: 'center',
        }}>
        <Progress.Bar
          progress={0.0}
          indeterminate={this.state.indeterminate}
          indeterminateAnimationDuration={1000}
          width={null}
          animated={true}
          color={colors.lightGreen}
          unfilledColor={colors.lightgray}
          borderWidth={0}
          height={20}
          borderRadius={5}
        />
        <Text style={styles.uploadingText}>
          Uploading {this.state.Uploading}%
        </Text>
      </View>
    );
  }

  onSearchTextChange(text) {
    this.setState({searchText: text});
    let result = this.state.allFilesData.filter(data =>
      data.projectFileName.toLowerCase().includes(text.toLowerCase()),
    );
    if (text == '') {
      this.setState({filesData: this.state.allFilesData});
    } else {
      this.setState({filesData: result});
    }
  }

  render() {
    let filesData = this.state.filesData;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let addFileTaskLoading = this.props.addFileTaskLoading;
    let isFetching = this.state.isFetching;
    return (
      <View style={styles.container}>
        <View style={styles.projectFilerView}>
          <Image style={styles.searchIcon} source={icons.searchGray} />
          <TextInput
            style={[styles.textInput, {width: '95%'}]}
            placeholder={'Search'}
            value={this.state.searchText}
            onChangeText={text => this.onSearchTextChange(text)}
          />
        </View>
        <TouchableOpacity
          onPress={() => Platform.OS == 'ios' ? this.iOSFilePicker() : this.doumentPicker()}
          disabled={this.state.indeterminate}>
          {this.state.files.length > 0 ? (
            <View
              style={[
                styles.taskFieldDocPickView,
                {flexDirection: 'row', flexWrap: 'wrap'},
              ]}>
              {this.renderDocPickeredView()}
            </View>
          ) : (
            <View style={[styles.taskFieldView, {flexDirection: 'row'}]}>
              <Image
                style={[styles.calendarIcon, {marginRight: 10}]}
                source={icons.upload}
                resizeMode={'contain'}
              />
              <Text style={[styles.textInput, {flex: 1}]}>Add files</Text>
            </View>
          )}
        </TouchableOpacity>
        <View flex={8}>
          <FlatList
            style={styles.flalList}
            data={filesData}
            renderItem={({item}) => this.renderFilesList(item)}
            keyExtractor={item => item.projId}
            onRefresh={() => this.onRefresh()}
            refreshing={isFetching}
          />
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
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.lighterGray,
    height: '60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '10rem',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '12rem',
    color: colors.userListUserNameColor,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
    fontWeight: '400',
  },
  textDate: {
    fontSize: '10rem',
    color: colors.textPlaceHolderColor,
    textAlign: 'center',
    lineHeight: '13rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
  },
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  flalList: {
    marginTop: '10rem',
  },
  taskStateIcon: {
    width: '40rem',
    height: '40rem',
  },
  editDeleteIcon: {
    width: '25rem',
    height: '25rem',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
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
  userIcon: {
    width: '28rem',
    height: '28rem',
    borderRadius: 56 / 2,
  },
  taskFieldDocPickView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginTop: '10rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
    paddingVertical: '6rem',
  },
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    // width: '330rem',
    marginTop: '10rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '60rem',
    marginHorizontal: '20rem',
  },
  calendarIcon: {
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
    // width: '95%'
  },
  uploadingText: {
    marginTop: 5,
    textAlign: 'center',
    fontSize: 11,
    color: colors.darkBlue,
    fontWeight: 'bold',
  },
  projectFilerView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
    flexDirection: 'row',
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
  searchIcon: {
    width: '17rem',
    height: '17rem',
  },
});
const mapStateToProps = state => {
  return {
    fileProgress: state.fileUpload.fileProgress,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(ProjectFilesScreen);
