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
  BackHandler,
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
import Utils from '../../../utils/Utils';

menuItemsFile = [{value: 0, text: 'Move'}, {value: 1, text: 'Delete'}];
menuItemsFolder = [{value: 0, text: 'Update'}, {value: 1, text: 'Delete'}];
class ProjectFilesScreen extends Component {
  menuItems = [
    {value: 0, text: 'Add New Folder', icon: icons.addFolderGray},
    {value: 1, text: 'Add New File', icon: icons.addFileGray},
  ];
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
      selectedFolderToMove: '',
      folderNavigation: [
        {
          folderId: 'default',
          folderName: 'Project Files',
          folderType: 'PROJECT',
        },
      ],
      parentFolderId: '',
      fromUpdateFolder: false,
      folderItem: '',
      fileItem: '',
      folderDataModal: [],
      showImagePickerModal: false,
    };
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    // BackHandler.addEventListener(
    //   'hardwareBackPress',
    //   this.handleBackButtonClick,
    // );
  }

  componentDidMount() {
    this.fetchData(this.props.selectedProjectID);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      this.fetchData(this.props.selectedProjectID);
    }
  }

  componentWillUnmount() {
    // BackHandler.removeEventListener(
    //   'hardwareBackPress',
    //   this.handleBackButtonClick,
    // );
  }

  handleBackButtonClick() {
    let length = this.state.folderNavigation.length - 1;
    this.state.folderNavigation.splice(length, 1);
    this.setState({searchText: ''});

    if (this.state.folderNavigation.length > 1) {
      this.getSubFoldersFiles(this.state.folderNavigation[length]);
    } else if (this.state.folderNavigation.length == 1) {
      this.menuItems = [
        {value: 0, text: 'Add New Folder', icon: icons.addFolderGray},
        {value: 1, text: 'Add New File', icon: icons.addFileGray},
      ];
      this.fetchData(this.props.selectedProjectID);
    } else {
      this.props.navigation.goBack(null);
    }
    return true;
  }

  async fetchData(selectedProjectID) {
    try {
      this.setState({dataLoading: true});
      let filesData = await APIServices.getAllMainFoldersFilesData(
        selectedProjectID,
      );
      if (filesData.message == 'success') {
        this.setState({
          filesData: filesData.data.files,
          allFilesData: filesData.data.files,
          folderData: filesData.data.folders,
          allFolderData: filesData.data.folders,
          folderDataModal: filesData.data.folders,
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
    let url =
      item.fileType == 'PROJECT' ? item.projectFileUrl : item.taskFileUrl;
    let fileName =
      item.fileType == 'PROJECT' ? item.projectFileName : item.taskFileName;
    this.setState({
      progress: 0,
      loading: true,
    });
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      path: dirs.DownloadDir + '/' + fileName,
      fileCache: true,
    })
      .fetch('GET', url, {
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
      })
      .catch(error => {
        console.log(error);
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
          this.loadFolderData();
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
        this.loadFolderData();
      },
    );
  }

  onFolderMenuItemChange(item, folderItem) {
    switch (item.value) {
      case 0:
        this.updateFolder(folderItem);
        break;
      case 1:
        this.deleteFolder(folderItem);
        break;
      default:
        break;
    }
  }

  updateFolder(folderItem) {
    this.setState({
      folderItem: folderItem,
      folderName: folderItem.folderName,
      fromUpdateFolder: true,
    });
    this.showNewFolderModal();
  }

  async updateFolderDetails() {
    let projectID = this.props.selectedProjectID;
    let folderItemId = this.state.folderItem.folderId;
    let folderName = this.state.folderName;

    this.setState({
      dataLoading: true,
      showMessageModal: false,
      showNewFolderModal: false,
    });

    await APIServices.updateFolderData(projectID, folderItemId, folderName)
      .then(response => {
        if (response.message == 'success') {
          this.deleteDetails = {
            icon: icons.folder,
            type: 'success',
            title: 'Sucsess',
            description: 'Folder name has been updated successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
          this.loadFolderData();
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

  deleteFolder(folderItem) {
    this.deleteDetails = {
      icon: icons.alertRed,
      type: 'confirm',
      title: 'Delete Folder',
      description:
        "You are about to permanantly delete this folder and all of it's data,\n If you are not sure, you can cancel this action.",
      buttons: {positive: 'Delete', negative: 'Cancel'},
    };
    this.onPressMessageModal = () => this.deleteFolderDetails(folderItem);
    this.setState({showMessageModal: true});
  }

  async deleteFolderDetails(folderItem) {
    let projectID = this.props.selectedProjectID;
    let folderItemId = folderItem.folderId;

    this.setState({dataLoading: true, showMessageModal: false});

    await APIServices.deleteFolderData(projectID, folderItemId)
      .then(response => {
        if (response.message == 'success') {
          this.deleteDetails = {
            icon: icons.folder,
            type: 'success',
            title: 'Sucsess',
            description: 'Folder has been deleted successfully',
            buttons: {},
          };
          this.setState({dataLoading: false, showMessageModal: true});
          this.loadFolderData();
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
      });
  }

  onFileMenuItemChange(item, fileItem) {
    switch (item.value) {
      case 0:
        this.moveFolder(fileItem);
        break;
      case 1:
        this.deleteFileAlert(fileItem);
        break;
      default:
        break;
    }
  }

  async moveFolder(fileItem) {
    let length = this.state.folderNavigation.length - 1;

    let folderExist = this.state.folderDataModal.filter(item => {
      return item.folderName == 'Main';
    });

    let projectFolders = this.state.folderDataModal.filter(item => {
      return item.folderType == 'PROJECT';
    });

    let filteredProjectFolders = projectFolders.filter(item => {
      return item.folderName !== this.state.folderNavigation[length].folderName;
    });

    await this.setState({folderDataModal: filteredProjectFolders});

    if (this.state.folderNavigation.length > 1 && folderExist.length == 0) {
      this.state.folderDataModal.push({
        folderCreatedAt: '',
        folderCreator: '',
        folderId: null,
        folderName: 'Main',
        folderType: 'PROJECT',
        isDeleted: false,
        parentFolder: null,
        projectId: '',
        taskId: null,
      });
    }
    this.setState({fileItem: fileItem});
    this.onShowMoveFolderModal();
  }

  renderFilesList(item) {
    let details = '';
    let size = this.bytesToSize(
      item.fileType == 'PROJECT' ? item.projectFileSize : item.taskFileSize,
    );
    let date = moment(
      item.fileType == 'PROJECT' ? item.projectFileAddedOn : item.taskFileDate,
    ).format('YYYY-MM-DD');
    let name = item.firstName + ' ' + item.lastName;
    let fileItem = item;

    // details = size + ' | ' + date + ' by ' + name;
    details = size + ' | ' + date;

    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('FilesView', {filesData: item})
        }>
        <View style={styles.filesView}>
          <Image
            source={this.getTypeIcons(
              item.fileType == 'PROJECT'
                ? item.projectFileName
                : item.taskFileName,
            )}
            style={styles.taskStateIcon}
          />
          <View style={{flex: 1}}>
            <Text style={styles.text} numberOfLines={1}>
              {item.fileType == 'PROJECT'
                ? item.projectFileName
                : item.taskFileName}
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
            {item.fileType == 'PROJECT' ? (
              <PopupMenuNormal
                data={menuItemsFile}
                onChange={item => this.onFileMenuItemChange(item, fileItem)}
                menuStyle={styles.menuStyle}
                customStyle={styles.customStyle}
                customMenuIcon={styles.customMenuIconStyle}
                menuIcon={icons.menuGray}
              />
            ) : null}
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

  renderImagePickerModal() {
    return (
      <Modal
        // isVisible={true}
        isVisible={this.state.showImagePickerModal}
        style={styles.modalStyleImagePicker}
        onBackButtonPress={() => this.onCloseImagePickerModal()}
        onBackdropPress={() => this.onCloseImagePickerModal()}
        onRequestClose={() => this.onCloseImagePickerModal()}
        coverScreen={false}
        backdropTransitionOutTiming={0}>
        <View style={styles.imagePickerModalInnerStyle}>
          <Text style={styles.imagePickerModalTitleStyle}>Add Files</Text>
          <Text style={styles.imagePickerModalTextStyle}>
            Select the file source
          </Text>
          <View style={styles.imagePickerButtonViewStyle}>
            <TouchableOpacity
              style={styles.cameraButtonStyle}
              onPress={() => this.selectCamera()}>
              <Text style={styles.positiveTextStyle}>Camera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.galleryButtonStyle}
              onPress={() => this.selectFiles()}>
              <Text style={styles.positiveTextStyle}>Files</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButtonStyle}
              onPress={() => this.onCloseImagePickerModal()}>
              <Text style={styles.cancelTextStyle}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  onCloseImagePickerModal() {
    this.setState({showImagePickerModal: false});
  }

  async filePicker() {
    this.setState({showImagePickerModal: true});
  }

  async selectCamera() {
    await this.setState({showImagePickerModal: false});

    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };
    setTimeout(() => {
      ImagePicker.launchCamera(options, res => {
        if (res.didCancel) {
        } else if (res.error) {
        } else if (res.customButton) {
        } else {
          this.setImageForFile(res);
        }
      });
    }, 100);
  }

  async selectGallery() {
    await this.setState({showImagePickerModal: false});
    const options = {
      title: 'Select pictures',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      quality: 0.2,
    };

    setTimeout(() => {
      ImagePicker.launchImageLibrary(options, res => {
        if (res.didCancel) {
        } else if (res.error) {
        } else if (res.customButton) {
        } else {
          this.setImageForFile(res);
        }
      });
    }, 100);
  }

  async selectFiles() {
    await this.setState({showImagePickerModal: false});

    setTimeout(() => {
      this.doumentPicker();
    }, 100);
  }

  async setImageForFile(res) {
    let length = this.state.folderNavigation.length - 1;
    let folderId = this.state.folderNavigation[length].folderId;

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

    await this.setState({files: this.state.files});

    this.uploadFile(this.state.files, this.props.selectedProjectID, folderId);
  }

  async uploadFile(files, selectedProjectID, folderId) {
    await this.setState({
      indeterminate: true,
      Uploading: 0,
      dataLoading: true,
    });

    await APIServices.uploadFileData(files, selectedProjectID, folderId)
      .then(response => {
        if (response.message == 'success') {
          this.setState({
            indeterminate: false,
            files: [],
            Uploading: 100,
            dataLoading: false,
          });
          this.loadFolderData();
        } else {
          this.setState({
            indeterminate: false,
            files: [],
            Uploading: 0,
            dataLoading: false,
          });
        }
      })
      .catch(error => {
        this.setState({
          indeterminate: false,
          files: [],
          Uploading: 0,
          dataLoading: false,
        });
        if (error.status == 401) {
          this.showAlert('', error.data.message);
        } else if (error.status == 413) {
          this.showAlert('', 'File size is too large');
        } else {
          this.showAlert('', 'File upload error');
        }
      });
  }

  async doumentPicker() {
    let length = this.state.folderNavigation.length - 1;
    let folderId = this.state.folderNavigation[length].folderId;
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
        console.log(
          res.uri,
          res.type, // mime type
          res.name,
          res.size,
        );
      }
      await this.setState({files: this.state.files});
      this.uploadFile(this.state.files, this.props.selectedProjectID, folderId);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('file pick error', err);
      } else {
        throw err;
      }
    }
  }

  loadFolderData() {
    let length = this.state.folderNavigation.length - 1;
    this.setState({searchText: ''});

    if (this.state.folderNavigation.length > 1) {
      this.getSubFoldersFiles(this.state.folderNavigation[length]);
    } else {
      this.fetchData(this.props.selectedProjectID);
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
      <View style={progressBarStyle}>
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
    let folderNavigation = this.state.folderNavigation;
    let length = this.state.folderNavigation.length - 1;

    this.setState({searchText: text});
    let result = '';
    if (folderNavigation[length].folderType == 'TASK') {
      result = this.state.allFilesData.filter(data =>
        data.taskFileName.toLowerCase().includes(text.toLowerCase()),
      );
    } else {
      result = this.state.allFilesData.filter(data =>
        data.projectFileName.toLowerCase().includes(text.toLowerCase()),
      );
    }

    let resultFolder = this.state.allFolderData.filter(data =>
      data.folderName.toLowerCase().includes(text.toLowerCase()),
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
        this.setState({fromUpdateFolder: false, folderName: ''});
        this.showNewFolderModal();
        break;
      case 1:
        this.filePicker();
        break;
      default:
        break;
    }
  }

  renderFolderList(item, index) {
    let folderData = this.state.folderData;
    let oddNumber = (folderData.length - 1) % 2;
    let folderItem = item;

    return (
      <TouchableOpacity
        onPress={() => this.onFolderViewPress(item)}
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
        <Text style={styles.folderTextStyle} numberOfLines={1}>
          {item.folderName}
        </Text>
        {item.folderType == 'PROJECT' ? (
          <PopupMenuNormal
            data={menuItemsFolder}
            onChange={item => this.onFolderMenuItemChange(item, folderItem)}
            menuStyle={styles.menuStyle}
            customStyle={styles.customStyle}
            customMenuIcon={styles.customMenuIconStyle}
            menuIcon={icons.menuGray}
          />
        ) : null}
      </TouchableOpacity>
    );
  }

  onFolderViewPress(item) {
    this.getSubFoldersFiles(item);
  }

  async getSubFoldersFiles(item) {
    let projectID = this.props.selectedProjectID;
    let folderId = item.folderId;

    this.setState({dataLoading: true});
    await APIServices.getAllSubFoldersFilesData(projectID, folderId)
      .then(response => {
        if (response.message == 'success') {
          if (this.state.folderNavigation.length < 2) {
            this.state.folderNavigation.push({
              folderId: item.folderId,
              folderName: item.folderName,
              folderType: item.folderType,
            });
          }
          this.menuItems = [
            {value: 1, text: 'Add New File', icon: icons.addFileGray},
          ];
          this.setState({
            filesData: response.data.files,
            allFilesData: response.data.files,
            folderData: response.data.folders,
            allFolderData: response.data.folders,
            dataLoading: false,
          });
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
      });
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

  async createNewFolder(parent) {
    let projectID = this.props.selectedProjectID;
    let folderName = this.state.folderName;
    let folderId = parent ? null : this.state.parentFolderId;

    this.setState({
      dataLoading: true,
      showMessageModal: false,
      showNewFolderModal: false,
    });

    await APIServices.addProjectFolderData(projectID, folderName, folderId)
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
          this.loadFolderData();
        } else {
          this.setState({dataLoading: false});
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        this.showAlert('', error.data.message);
      });
  }

  removeWhiteSpace(folderName) {
    return folderName.replace(/^\s+/, '').replace(/\s+$/, '') == '';
  }

  renderNewFolderModal() {
    let fromUpdateFolder = this.state.fromUpdateFolder;
    let folderName = this.state.folderName;
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
          <Text style={styles.modalTitleStyle}>
            {fromUpdateFolder ? 'Update Folder' : 'New Folder'}
          </Text>
          <View style={styles.modalInputTextViewStyle}>
            <View style={styles.modalInputTextViewInnerStyle}>
              <TextInput
                style={styles.modalInputTextInnerStyle}
                placeholder={'Folder Name'}
                value={folderName}
                onChangeText={text => this.onFolderNameChange(text)}
              />
            </View>
          </View>
          <View style={styles.ButtonViewStyle}>
            <TouchableOpacity
              style={styles.cancelStyle}
              onPress={() => this.onCloseNewFolderModal()}>
              <Text style={styles.cancelTextStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.positiveStyle,
                {
                  backgroundColor:
                    folderName == '' || this.removeWhiteSpace(folderName)
                      ? colors.lighterGray
                      : colors.lightGreen,
                },
              ]}
              disabled={
                folderName == '' || this.removeWhiteSpace(folderName)
                  ? true
                  : false
              }
              onPress={() =>
                fromUpdateFolder
                  ? this.updateFolderDetails()
                  : this.createNewFolder(true)
              }>
              <Text style={styles.positiveTextStyle}>
                {fromUpdateFolder ? 'Update' : 'Create'}
              </Text>
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
    this.setState({showMoveFolderModal: false, selectedFolderToMove: ''});
  }

  onFolderModalViewPress(item) {
    let length = this.state.folderNavigation.length - 1;
    let folderId = this.state.folderNavigation[length].folderId;
    let parentFolderId = folderId == 'default' ? null : folderId;
    this.setState({
      selectedFolderToMove: item.folderId,
      parentFolderId: parentFolderId,
    });
  }

  async moveFileToFolder() {
    let projectID = this.props.selectedProjectID;
    let fileId = this.state.fileItem.projectFileId;
    let parentFolderId = this.state.parentFolderId;
    let selectedFolderToMove = this.state.selectedFolderToMove;

    if (selectedFolderToMove != '') {
      this.setState({
        dataLoading: true,
        showMoveFolderModal: false,
        showMessageModal: false,
      });
      await APIServices.moveFilesBetweenFoldersData(
        projectID,
        fileId,
        parentFolderId,
        selectedFolderToMove,
      )
        .then(response => {
          if (response.message == 'success') {
            this.deleteDetails = {
              icon: icons.folder,
              type: 'success',
              title: 'Sucsess',
              description: 'File has been moved successfully',
              buttons: {},
            };
            this.setState({
              dataLoading: false,
              showMessageModal: true,
              selectedFolderToMove: '',
            });
            this.loadFolderData();
          } else {
            this.setState({dataLoading: false});
          }
        })
        .catch(error => {
          this.setState({dataLoading: false});
          this.showAlert('', error.data.message);
        });
    } else {
      Utils.showAlert(true, '', 'Please choose a folder to move', this.props);
    }
  }

  renderModalFolderList(item, index) {
    let folderData = this.state.folderData;
    let oddNumber = (folderData.length - 1) % 2;
    let selectedFolderToMove = this.state.selectedFolderToMove;

    return (
      <TouchableOpacity
        onPress={() => this.onFolderModalViewPress(item)}
        style={[
          styles.folderModalListView,
          {
            backgroundColor:
              selectedFolderToMove == item.folderId
                ? colors.projectBgColor
                : colors.white,
            marginRight:
              oddNumber == 0 && index == folderData.length - 1
                ? EStyleSheet.value('15rem')
                : EStyleSheet.value('5rem'),
          },
        ]}>
        <Image style={styles.folderIconStyle} source={icons.folderFilledGray} />
        <Text style={styles.folderNameModalStyle} numberOfLines={1}>
          {item.folderName}
        </Text>
      </TouchableOpacity>
    );
  }

  renderMoveFolderModal() {
    let folderDataModal = this.state.folderDataModal;
    return (
      <Modal
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
            data={folderDataModal}
            numColumns={2}
            renderItem={({item, index}) =>
              this.renderModalFolderList(item, index)
            }
            keyExtractor={item => item.folderId}
          />
          <View style={styles.ButtonViewStyle}>
            <TouchableOpacity
              style={styles.cancelStyle}
              onPress={() => this.onCloseMoveFolderModal()}>
              <Text style={styles.cancelTextStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.positiveStyle,
                {
                  backgroundColor:
                    this.state.selectedFolderToMove == ''
                      ? colors.lighterGray
                      : colors.lightGreen,
                },
              ]}
              disabled={this.state.selectedFolderToMove == '' ? true : false}
              onPress={() => this.moveFileToFolder()}>
              <Text style={styles.positiveTextStyle}>Move</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  renderFolderNavigationList(item) {
    return (
      <View>
        {item.folderId == 'default' ? (
          <TouchableOpacity
            style={{marginLeft: 5}}
            onPress={() => this.handleBackButtonClick()}>
            <Text style={styles.navigationMainFolderText}>
              {item.folderName}
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.navigationSubFolderText}>
            {' > ' + item.folderName}
          </Text>
        )}
      </View>
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
    let folderNavigation = this.state.folderNavigation;
    let length = this.state.folderNavigation.length - 1;

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
          {folderNavigation[length].folderType == 'PROJECT' ? (
            <View>
              <PopupMenuFileUpload
                data={this.menuItems}
                onChange={item => this.onMenuItemChange(item)}
              />
            </View>
          ) : null}

          {folderNavigation.length > 1 ? (
            <FlatList
              style={styles.folderFlatListStyle}
              data={folderNavigation}
              horizontal
              renderItem={({item, index}) =>
                this.renderFolderNavigationList(item, index)
              }
              keyExtractor={item => item.folderId}
            />
          ) : null}
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
                    keyExtractor={item => item.folderId}
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
        {this.renderImagePickerModal()}
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
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '5rem',
    fontWeight: '400',
  },
  textDate: {
    fontSize: '10rem',
    color: colors.textPlaceHolderColor,
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
    fontFamily: 'CircularStd-Medium',
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
  folderTextStyle: {
    marginHorizontal: '20rem',
    flex: 1,
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
    fontFamily: 'CircularStd-Medium',
  },
  modalInputTextViewStyle: {
    marginTop: '20rem',
  },
  modalTextStyle: {
    fontSize: '15rem',
    fontFamily: 'CircularStd-Medium',
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
    marginLeft: '10rem',
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
    marginVertical: '3rem',
    alignItems: 'center',
  },
  navigationMainFolderText: {
    fontSize: '18rem',
    color: colors.lightBlue,
    fontFamily: 'CircularStd',
  },
  navigationSubFolderText: {
    fontSize: '18rem',
    color: colors.colorLightSlateGrey,
    fontFamily: 'CircularStd',
  },
  progressBarStyle: {
    width: '100%',
    height: '50rem',
    borderRadius: '5rem',
    marginRight: '5rem',
    marginTop: '5rem',
    justifyContent: 'center',
  },
  folderNameModalStyle: {
    marginLeft: '5rem',
    marginRight: '50rem',
  },
  modalStyleImagePicker: {
    bottom: Platform.OS == 'ios' ? '15%' : '0%',
    // justifyContent: 'flex-end',
    // margin: 0,
  },
  imagePickerButtonViewStyle: {
    marginTop: '20rem',
    marginBottom: '10rem',
  },
  imagePickerModalInnerStyle: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
    padding: '20rem',
  },
  imagePickerModalTitleStyle: {
    fontSize: '20rem',
    marginBottom: '5rem',
  },
  imagePickerModalTextStyle: {
    fontSize: '15rem',
  },
  cameraButtonStyle: {
    height: '45rem',
    backgroundColor: colors.lightGreen,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
    marginBottom: '10rem',
  },
  galleryButtonStyle: {
    height: '45rem',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
    marginBottom: '10rem',
  },
  cancelButtonStyle: {
    height: '45rem',
    backgroundColor: colors.colorCoralRed,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
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
