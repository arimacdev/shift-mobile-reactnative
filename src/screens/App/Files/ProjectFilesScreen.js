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
  TextInput,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Loader from '../../../components/Loader';
import APIServices from '../../../services/APIServices';
import moment from 'moment';
import AwesomeAlert from 'react-native-awesome-alerts';
import DocumentPicker from 'react-native-document-picker';
import * as Progress from 'react-native-progress';
import RNFetchBlob from 'rn-fetch-blob';
import fileTypes from '../../../asserts/fileTypes/fileTypes';
import ImagePicker from 'react-native-image-picker';
import EmptyListView from '../../../components/EmptyListView';
import MessageShowModal from '../../../components/MessageShowModal';
import PopupMenuFileUpload from '../../../components/PopupMenuFileUpload';
import Modal from 'react-native-modal';
import PopupMenuNormal from '../../../components/PopupMenuNormal';

menuItems = [
  {value: 0, text: 'Add New Folder', icon: icons.addFolderGray},
  {value: 1, text: 'Add New File', icon: icons.addFileGray},
];

menuItemsFile = [{value: 0, text: 'Move'}, {value: 1, text: 'Delete'}];
class ProjectFilesScreen extends Component {
  folderNavigation = [];
  deleteDetails = {
    icon: icons.alertRed,
    type: 'confirm',
    title: 'Delete File',
    description:
      'You are about to permanantly delete this file,\n If you are not sure, you can cancel this action.',
    buttons: {positive: 'Delete', negative: 'Cancel'},
  };
  onPressMessageModal = () => {};
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
      searchText: '',
      showMessageModal: false,
      folderData: [],
      allFolderData: [],
      showNewFolderModal: false,
      folderName: '',
      showMoveFolderModal: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    this.fetchData(this.props.selectedProjectID);
  }

  async fetchData(selectedProjectID) {
    try {
      this.setState({dataLoading: true});
      let filesData = await APIServices.getProjectFiles(selectedProjectID);
      if (filesData.message == 'success') {
        this.setState({
          filesData: filesData.data,
          allFilesData: filesData.data,
          folderData: [{name: 'Design'}, {name: 'Project'}, {name: 'Task'}],
          allFolderData: [{name: 'Design'}, {name: 'Project'}, {name: 'Task'}],
          dataLoading: false,
          isFetching: false,
        });
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
      this.showAlert('', 'Data loading error');
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
      .then(() => {
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

  deleteFileAlert(item) {
    this.deleteDetails = {
      icon: icons.alertRed,
      type: 'confirm',
      title: 'Delete File',
      description:
        'You are about to permanantly delete this file,\n If you are not sure, you can cancel this action.',
      buttons: {positive: 'Delete', negative: 'Cancel'},
    };
    this.onPressMessageModal = () => this.deleteFile(item);
    this.setState({showMessageModal: true});
  }

  async deleteFile(item) {
    let projectID = this.props.selectedProjectID;
    let projectFileId = item.projectFileId;

    this.setState({dataLoading: true, showMessageModal: false});

    await APIServices.deleteProjectFile(projectID, projectFileId)
      .then(response => {
        if (response.message == 'success') {
          this.deleteDetails = {
            icon: icons.fileOrange,
            type: 'success',
            title: 'Sucsess',
            description: 'File has been deleted successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
          this.fetchData(this.props.selectedProjectID);
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        if (error.status == 401) {
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
    this.setState(
      {isFetching: false, filesData: [], allFilesData: []},
      function() {
        this.fetchData(this.props.selectedProjectID);
      },
    );
  }

  moveFolder() {
    this.onShowMoveFolderModal();
  }

  onFileMenuItemChange(item, fileItem) {
    switch (item.value) {
      case 0:
        this.moveFolder();
        break;
      case 1:
        this.deleteFileAlert(fileItem);
        break;
      default:
        break;
    }
  }

  renderFilesList(item) {
    let details = '';
    let size = this.bytesToSize(item.projectFileSize);
    let date = moment(item.projectFileAddedOn).format('YYYY-MM-DD');
    let name = item.firstName + ' ' + item.lastName;
    let fileItem = item;

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
              <Image style={styles.controlIcon} source={icons.downloadIcon} />
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => this.deleteFileAlert(item)}
              style={{marginLeft: EStyleSheet.value('10rem')}}>
              <Image style={styles.controlIcon} source={icons.deleteRoundRed} />
            </TouchableOpacity> */}
            <PopupMenuNormal
              data={menuItemsFile}
              onChange={item => this.onFileMenuItemChange(item, fileItem)}
              menuStyle={styles.menuStyle}
              customStyle={styles.customStyle}
              customMenuIcon={styles.customMenuIconStyle}
              menuIcon={icons.menuGray}
            />
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
        this.setState({indeterminate: false, files: [], Uploading: 0});
        if (error.status == 401) {
          this.showAlert('', error.data.message);
        } else {
          this.showAlert('', error);
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
          this.setState({indeterminate: false, files: [], Uploading: 0});
          if (error.status == 401) {
            this.showAlert('', error.data.message);
          } else {
            this.showAlert('', error);
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
    let resultFolder = this.state.allFolderData.filter(data =>
      data.name.toLowerCase().includes(text.toLowerCase()),
    );
    if (text == '') {
      this.setState({
        filesData: this.state.allFilesData,
        folderData: this.state.allFolderData,
      });
    } else {
      this.setState({filesData: result, folderData: resultFolder});
    }
  }

  onPressCancel() {
    this.setState({showMessageModal: false});
  }

  onMenuItemChange(item) {
    switch (item.value) {
      case 0:
        this.showNewFolderModal();
        break;
      case 1:
        Platform.OS == 'ios' ? this.iOSFilePicker() : this.doumentPicker();
        break;
      default:
        break;
    }
  }

  renderFolderList(item, index) {
    let folderData = this.state.folderData;
    let oddNumber = (folderData.length - 1) % 2;

    return (
      <TouchableOpacity
        onPress={() => this.onFolderViewPress()}
        style={[
          styles.folderListView,
          {
            marginRight:
              oddNumber == 0 && index == folderData.length - 1
                ? EStyleSheet.value('15rem')
                : EStyleSheet.value('5rem'),
          },
        ]}>
        <Image style={styles.folderIconStyle} source={icons.folderFilledGray} />
        <Text style={{marginHorizontal: 20}}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  onFolderViewPress() {
    this.folderNavigation.push({id: 1, name: 'Design'});
    this.fetchData(this.props.selectedProjectID);
  }

  showNewFolderModal() {
    this.setState({showNewFolderModal: true});
  }

  onCloseNewFolderModal() {
    this.setState({showNewFolderModal: false});
  }

  onFolderNameChange(text) {
    this.setState({folderName: text});
  }

  async createNewFolder() {
    let projectID = this.props.selectedProjectID;
    let folderName = this.state.folderName;

    this.setState({dataLoading: true, showMessageModal: false});

    await APIServices.addProjectFolderData(projectID, folderName)
      .then(response => {
        if (response.message == 'success') {
          this.deleteDetails = {
            icon: icons.folder,
            type: 'success',
            title: 'Sucsess',
            description: 'Folder has been created successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
          this.fetchData(this.props.selectedProjectID);
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
      });
  }

  renderNewFolderModal() {
    return (
      <Modal
        isVisible={this.state.showNewFolderModal}
        style={styles.modalStyle}
        onBackButtonPress={() => this.onCloseNewFolderModal()}
        onBackdropPress={() => this.onCloseNewFolderModal()}
        onRequestClose={() => this.onCloseNewFolderModal()}
        coverScreen={false}
        backdropTransitionOutTiming={0}>
        <View style={styles.modalInnerStyle}>
          <Text style={styles.modalTitleStyle}>New Folder</Text>
          <View style={styles.modalInputTextViewStyle}>
            {/* <Text style={styles.modalTextStyle}>Folder</Text> */}
            <View style={styles.modalInputTextViewInnerStyle}>
              <TextInput
                style={styles.modalInputTextInnerStyle}
                placeholder={'Folder Name'}
                value={this.state.folderName}
                onChangeText={text => this.onFolderNameChange(text)}
              />
            </View>
          </View>
          <View style={styles.ButtonViewStyle}>
            <TouchableOpacity
              style={[
                styles.positiveStyle,
                {
                  backgroundColor:
                    this.state.url == ''
                      ? colors.lighterGray
                      : colors.lightGreen,
                },
              ]}
              disabled={this.state.url == '' ? true : false}
              onPress={() => this.createNewFolder()}>
              <Text style={styles.positiveTextStyle}>Create</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelStyle}
              onPress={() => this.onCloseNewFolderModal()}>
              <Text style={styles.cancelTextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  onShowMoveFolderModal() {
    this.setState({showMoveFolderModal: true});
  }
  onCloseMoveFolderModal() {
    this.setState({showMoveFolderModal: false});
  }

  renderModalFolderList(item, index) {
    let folderData = this.state.folderData;
    let oddNumber = (folderData.length - 1) % 2;

    return (
      <TouchableOpacity
        onPress={() => this.onFolderViewPress()}
        style={[
          styles.folderModalListView,
          {
            marginRight:
              oddNumber == 0 && index == folderData.length - 1
                ? EStyleSheet.value('15rem')
                : EStyleSheet.value('5rem'),
          },
        ]}>
        <Image style={styles.folderIconStyle} source={icons.folderFilledGray} />
        <Text style={{marginHorizontal: 20}}>{item.name}</Text>
      </TouchableOpacity>
    );
  }

  renderMoveFolderModal() {
    let folderData = this.state.folderData;
    return (
      <Modal
        // isVisible={true}
        isVisible={this.state.showMoveFolderModal}
        style={styles.modalStyleFolderMove}
        onBackButtonPress={() => this.onCloseMoveFolderModal()}
        onBackdropPress={() => this.onCloseMoveFolderModal()}
        onRequestClose={() => this.onCloseMoveFolderModal()}
        coverScreen={false}
        backdropTransitionOutTiming={0}>
        <View style={styles.modalInnerStyle}>
          <Text style={styles.modalTitleStyle}>Move File to Folder</Text>
          <FlatList
            style={styles.moveFolderFlatListStyle}
            data={folderData}
            numColumns={2}
            renderItem={({item, index}) =>
              this.renderModalFolderList(item, index)
            }
            keyExtractor={item => item.id}
          />
          <View style={styles.ButtonViewStyle}>
            <TouchableOpacity
              style={[
                styles.positiveStyle,
                {
                  backgroundColor:
                    this.state.url == ''
                      ? colors.lighterGray
                      : colors.lightGreen,
                },
              ]}
              disabled={this.state.url == '' ? true : false}
              onPress={() => this.createNewFolder()}>
              <Text style={styles.positiveTextStyle}>Move</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelStyle}
              onPress={() => this.onCloseMoveFolderModal()}>
              <Text style={styles.cancelTextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  render() {
    let filesData = this.state.filesData;
    let dataLoading = this.state.dataLoading;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;
    let addFileTaskLoading = this.props.addFileTaskLoading;
    let isFetching = this.state.isFetching;
    let folderData = this.state.folderData;

    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={styles.projectFilerView}>
            <Image style={styles.searchIcon} source={icons.searchGray} />
            <TextInput
              style={[styles.textInput, {width: '95%'}]}
              placeholder={'Search'}
              value={this.state.searchText}
              onChangeText={text => this.onSearchTextChange(text)}
            />
          </View>

          {/*<TouchableOpacity
          onPress={() =>
            Platform.OS == 'ios' ? this.iOSFilePicker() : this.doumentPicker()
          }
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
        </TouchableOpacity> */}
          <View>
            <PopupMenuFileUpload
              data={menuItems}
              onChange={item => this.onMenuItemChange(item)}
            />
          </View>
          {folderData.length > 0 || filesData.length > 0 ? (
            <View>
              {folderData.length > 0 ? (
                <View>
                  <Text style={styles.titleStyle}>Folders</Text>
                  <FlatList
                    style={styles.folderFlatListStyle}
                    data={folderData}
                    numColumns={2}
                    renderItem={({item, index}) =>
                      this.renderFolderList(item, index)
                    }
                    keyExtractor={item => item.id}
                  />
                </View>
              ) : null}
              {filesData.length > 0 ? (
                <View>
                  <Text style={styles.titleStyle}>Files</Text>
                  <FlatList
                    style={styles.flalList}
                    data={filesData}
                    renderItem={({item}) => this.renderFilesList(item)}
                    keyExtractor={item => item.projId}
                    // onRefresh={() => this.onRefresh()}
                    // refreshing={isFetching}
                    // ListEmptyComponent={<EmptyListView />}
                  />
                </View>
              ) : null}
            </View>
          ) : (
            <EmptyListView />
          )}
        </ScrollView>
        {dataLoading && <Loader />}
        {addFileTaskLoading && <Loader />}
        {this.renderNewFolderModal()}
        {this.renderMoveFolderModal()}
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
        <MessageShowModal
          showMessageModal={this.state.showMessageModal}
          details={this.deleteDetails}
          onPress={this.onPressMessageModal}
          onPressCancel={() => this.onPressCancel(this)}
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
    borderRadius: '5rem',
    borderWidth: '1rem',
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
    marginBottom: '10rem',
  },
  taskStateIcon: {
    width: '40rem',
    height: '40rem',
  },
  taskFieldDocPickView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
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
    borderRadius: '5rem',
    marginTop: '10rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
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
    marginLeft: '7rem',
  },
  uploadingText: {
    marginTop: '5rem',
    textAlign: 'center',
    fontSize: '10rem',
    color: colors.darkBlue,
    fontWeight: 'bold',
  },
  projectFilerView: {
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
  controlIcon: {
    width: '28rem',
    height: '28rem',
    marginRight: '10rem',
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
  titleStyle: {
    fontSize: '16rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    marginLeft: '20rem',
    marginTop: '25rem',
  },
  folderFlatListStyle: {
    marginTop: '10rem',
    marginHorizontal: '15rem',
  },
  folderIconStyle: {
    marginLeft: '15rem',
    width: '25rem',
    height: '25rem',
  },
  folderListView: {
    flex: 0.5,
    flexDirection: 'row',
    height: '50rem',
    borderColor: colors.colorSilver,
    borderWidth: '1rem',
    borderRadius: '5rem',
    marginLeft: '5rem',
    marginVertical: '5rem',
    alignItems: 'center',
  },
  modalInnerStyle: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
    padding: '20rem',
  },
  modalTitleStyle: {
    fontSize: '20rem',
  },
  modalInputTextViewStyle: {
    marginTop: '20rem',
  },
  modalTextStyle: {
    fontSize: '15rem',
  },
  modalInputTextViewInnerStyle: {
    backgroundColor: colors.colorWhisper,
    borderRadius: '5rem',
    marginTop: '5rem',
    height: Platform.OS == 'ios' ? '35rem' : '50rem',
  },
  modalInputTextInnerStyle: {
    marginLeft: '10rem',
    marginTop: Platform.OS == 'ios' ? '10rem' : '0rem',
  },
  ButtonViewStyle: {
    flexDirection: 'row',
    marginTop: '20rem',
    marginBottom: '10rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positiveStyle: {
    flex: 1,
    height: '45rem',
    backgroundColor: colors.lightGreen,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
  },
  positiveTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
  },
  cancelStyle: {
    flex: 1,
    height: '45rem',
    marginLeft: '10rem',
    backgroundColor: colors.lightRed,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
  },
  cancelTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
  },
  customMenuIconStyle: {
    width: '20rem',
    height: '20rem',
    marginTop: '-2rem',
    marginRight: '-10rem',
  },
  customStyle: {
    flexDirection: 'column',
    marginTop: '2rem',
    marginRight: '5rem',
  },
  menuStyle: {
    marginRight: '0rem',
  },
  moveFolderFlatListStyle: {
    marginTop: '10rem',
    maxHeight: '300rem',
  },
  folderModalListView: {
    flex: 0.5,
    flexDirection: 'row',
    height: '50rem',
    borderColor: colors.colorSilver,
    borderWidth: '1rem',
    borderRadius: '5rem',
    // marginLeft: '5rem',
    marginVertical: '3rem',
    alignItems: 'center',
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
