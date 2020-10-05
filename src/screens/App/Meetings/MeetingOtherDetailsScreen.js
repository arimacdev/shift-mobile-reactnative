import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import moment from 'moment';
import APIServices from '../../../services/APIServices';
import Utils from '../../../utils/Utils';
import _ from 'lodash';
import PopupMenu from '../../../components/PopupMenu';
import icons from '../../../asserts/icons/icons';
import FadeIn from 'react-native-fade-in-image';
import PopupMenuMultipleUserList from '../../../components/PopupMenuMultipleUserList';

const initialLayout = {width: entireScreenWidth};

class MeetingOtherDetailsScreen extends Component {
  textInputValuesArray = [];
  constructor(props) {
    super(props);
    this.state = {
      discusstionPointsArray: [
        {
          id: 1,
          name: 'Actual duration of the meeting',
          placeHolder: 'Enter actual duration of the meeting',
        },
        {
          id: 2,
          name: 'Attendance (%)',
          placeHolder: 'Enter attendance (%)',
        },
        {
          id: 3,
          name: 'Chaired by',
          placeHolder: 'Add Chaired by',
        },
        {
          id: 4,
          name: 'Chaired by - Non Org (Ex: Member 1, Member 2)',
          placeHolder: 'Add Chaired by',
        },
        {
          id: 5,
          name: 'Meeting Attended',
          placeHolder: 'Add Meeting Attended',
        },
        {
          id: 6,
          name: 'Meeting Attended  - Non Org (Ex: Member 1, Member 2)',
          placeHolder: 'Add Meeting Attended',
        },
        {
          id: 7,
          name: 'Members Absent',
          placeHolder: 'Add Members Absent',
        },
        {
          id: 8,
          name: 'Members Absent  - Non Org (Ex: Member 1, Member 2)',
          placeHolder: 'Add Members Absent',
        },
        {
          id: 9,
          name: 'Additional copies to',
          placeHolder: 'Add additional copies to',
        },
        {
          id: 10,
          name: 'Additional copies to  - Non Org (Ex: Member 1, Member 2)',
          placeHolder: 'Add additional copies to',
        },
        {
          id: 11,
          name: 'Minutes of Meeting Prepared by',
          placeHolder: 'Add Minutes of Meeting Prepared by',
        },
        {
          id: 12,
          name: 'Prepared by  - Non Org (Ex: Member 1, Member 2)',
          placeHolder: 'Add Prepared by',
        },
      ],
      showUserListModal: false,
      date: new Date(),
      targetDate: '',
      targetDateValue: '',
      textInputs: [],
      textInputsUserList: [],
      indexMain: 2,
      description: '',
      files: [],
      showImagePickerModal: false,
      showEnterUrlModal: false,
      url: '',
      urlTitle: '',
      users: [],
      allUsers: [],
      popupMenuOpen: false,
      userName: '',
      userID: '',
      userList: [],
      userListIndex: 0,
      selectedUserList: [],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    this.getActiveUsers();
  }

  onFocusTextInput(index) {
    this.flatList.scrollToIndex({animated: true, index: index});
  }

  async onChangeText(text, index) {
    let removedText = '';
    if (index == 0 || index == 1) {
      removedText = text.replace(/\D+/g, '');
    } else {
      removedText = text;
    }

    let {textInputs} = this.state;
    textInputs[index] = removedText;
    await this.setState({textInputs});
  }

  onBackPress() {
    let indexMain = this.state.indexMain - 1;
    this.props.onChangeIndexMain(indexMain);
  }

  async addOtherDetails() {
    let meetingDetails = this.props.meetingDetails;
    let textInputs = this.state.textInputs;
    let textInputsUserList = this.state.textInputsUserList;
    let indexMain = this.state.indexMain;
    let actualDuration = textInputs[0];
    let meetingChaired = [];
    let meetingAttended = [];
    let meetingAbsent = [];
    let meetingCopiesTo = [];
    let meetingPrepared = [];
    let isUpdated = false;

    for (let i = 0; i < textInputsUserList.length; i++) {
      const element = textInputsUserList[i];
      switch (i) {
        case 3:
          for (let index = 0; index < element.length; index++) {
            const subElement = element[index];
            meetingChaired.push({
              attendeeId: subElement.Id,
              isGuest: false,
            });
          }
          break;
        case 5:
          for (let index = 0; index < element.length; index++) {
            const subElement = element[index];
            meetingAttended.push({
              attendeeId: subElement.Id,
              isGuest: false,
            });
          }
          break;
        case 7:
          for (let index = 0; index < element.length; index++) {
            const subElement = element[index];
            meetingAbsent.push({
              attendeeId: subElement.Id,
              isGuest: false,
            });
          }
          break;
        case 9:
          for (let index = 0; index < element.length; index++) {
            const subElement = element[index];
            meetingCopiesTo.push({
              attendeeId: subElement.Id,
              isGuest: false,
            });
          }
          break;
        case 11:
          for (let index = 0; index < element.length; index++) {
            const subElement = element[index];
            meetingPrepared.push({
              attendeeId: subElement.Id,
              isGuest: false,
            });
          }
          break;
        default:
          break;
      }
    }

    for (let j = 0; j < textInputs.length; j++) {
      const element = textInputs[j];
      let array = element == undefined ? [] : element.split(',');
      switch (j) {
        case 3:
          for (let index = 0; index < array.length; index++) {
            const subElement = array[index];
            meetingChaired.push({
              attendeeId: subElement,
              isGuest: true,
            });
          }
          break;
        case 5:
          for (let index = 0; index < array.length; index++) {
            const subElement = array[index];
            meetingAttended.push({
              attendeeId: subElement,
              isGuest: true,
            });
          }
          break;
        case 7:
          for (let index = 0; index < array.length; index++) {
            const subElement = array[index];
            meetingAbsent.push({
              attendeeId: subElement,
              isGuest: true,
            });
          }
          break;
        case 9:
          for (let index = 0; index < array.length; index++) {
            const subElement = array[index];
            meetingCopiesTo.push({
              attendeeId: subElement,
              isGuest: true,
            });
          }
          break;
        case 11:
          for (let index = 0; index < array.length; index++) {
            const subElement = array[index];
            meetingPrepared.push({
              attendeeId: subElement,
              isGuest: true,
            });
          }
          break;
        default:
          break;
      }
    }

    console.log('meetingChaired', meetingChaired);
    console.log('meetingAttended', meetingAttended);
    console.log('meetingAbsent', meetingAbsent);
    console.log('meetingCopiesTo', meetingCopiesTo);
    console.log('meetingPrepared', meetingPrepared);

    if (this.validateFields(textInputs)) {
      this.setState({dataLoading: true});
      await APIServices.updateMeetingData(
        meetingDetails,
        actualDuration,
        meetingChaired,
        meetingAttended,
        meetingAbsent,
        meetingCopiesTo,
        meetingPrepared,
        isUpdated,
      )
        .then(response => {
          if (response.message == 'success') {
            this.setState({dataLoading: false, indexMain: indexMain + 1});
          } else {
            this.setState({dataLoading: false});
            Utils.showAlert(true, '', response.message, this.props);
          }
        })
        .catch(error => {
          this.setState({dataLoading: false});
          Utils.showAlert(true, '', error.data.message, this.props);
        });
    }
  }

  validateFields(textInputs) {
    if (!textInputs[0] && _.isEmpty(textInputs[0])) {
      Utils.showAlert(
        true,
        '',
        'Please enter the actual duration of the meeting',
        this.props,
      );
      return false;
    }
    return true;
  }

  onFinishPress() {
    let indexMain = this.state.indexMain + 1;
    this.addOtherDetails();
    this.props.onChangeIndexMain(indexMain);
  }

  onSelectUser(userList) {
    let {textInputsUserList, userListIndex} = this.state;
    textInputsUserList[userListIndex] = userList;
    this.setState({textInputsUserList, showUserListModal: false});
  }

  async getActiveUsers() {
    try {
      this.setState({dataLoading: true});
      let activeUsers = await APIServices.getActiveUsers();
      if (activeUsers.message == 'success') {
        let userList = [];
        for (let i = 0; i < activeUsers.data.length; i++) {
          if (activeUsers.data[i].firstName && activeUsers.data[i].lastName) {
            userList.push({
              key: activeUsers.data[i].userId,
              label:
                activeUsers.data[i].firstName +
                ' ' +
                activeUsers.data[i].lastName,
              userImage: activeUsers.data[i].profileImage,
              isSelected: false,
            });
          }
        }
        userList.sort(this.arrayCompare);
        this.setState({
          users: userList,
          allUsers: userList,
          dataLoading: false,
        });
      } else {
        console.log('error');
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
    }
  }

  arrayCompare(a, b) {
    const firstNameA = a.label.toUpperCase();
    const firstNameB = b.label.toUpperCase();

    let comparison = 0;
    if (firstNameA > firstNameB) {
      comparison = 1;
    } else if (firstNameA < firstNameB) {
      comparison = -1;
    }
    return comparison;
  }

  onItemPress(key) {
    let {textInputsUserList} = this.state;
    let selectedUserList = textInputsUserList[key];

    this.setState({
      showUserListModal: true,
      userListIndex: key,
      selectedUserList: selectedUserList == undefined ? [] : selectedUserList,
    });
  }

  onCrossPress(Id, key) {
    let {textInputsUserList} = this.state;
    let selectedUserList = textInputsUserList[key];

    let userListArray = selectedUserList.filter(item => {
      return item.Id !== Id;
    });
    textInputsUserList[key] = userListArray;
    this.setState({textInputsUserList});
  }

  renderSelectedUserList(item, key) {
    let {textInputsUserList} = this.state;
    let userList =
      textInputsUserList[key] == undefined ? [] : textInputsUserList[key];
    return userList.length > 0 ? (
      userList.map(list => {
        return (
          <View style={styles.selectedUserListViewStyle}>
            <Text style={styles.selectedUserListStyle}>{list.userName}</Text>
            <TouchableOpacity onPress={() => this.onCrossPress(list.Id, key)}>
              <Image source={icons.delete} style={styles.crossIcon} />
            </TouchableOpacity>
          </View>
        );
      })
    ) : (
      <Text style={[styles.textInput, {color: colors.colorGreyChateau}]}>
        {item.placeHolder}
      </Text>
    );
  }

  renderOtherDetailsView(item, index) {
    let key = item.id;
    let {textInputsUserList} = this.state;
    let userList =
      textInputsUserList[key] == undefined ? [] : textInputsUserList[key];

    switch (key) {
      case 1:
      case 2:
      case 4:
      case 6:
      case 8:
      case 10:
      case 12:
        return (
          <View>
            <Text style={styles.fieldName}>{item.name}</Text>
            <View style={styles.textInputFieldView}>
              <TextInput
                ref={ref => (this.textInputValuesArray[index] = ref)}
                style={styles.textInput}
                placeholder={item.placeHolder}
                value={this.state.textInputs[index]}
                keyboardType={index == 0 || index == 1 ? 'numeric' : 'default'}
                onChangeText={text => this.onChangeText(text, index)}
                maxLength={100}
                onFocus={() => this.onFocusTextInput(index)}
              />
            </View>
          </View>
        );
      case 3:
      case 5:
      case 7:
      case 9:
      case 11:
        return (
          <View>
            <Text style={styles.fieldName}>{item.name}</Text>
            <TouchableOpacity
              style={
                userList.length > 0
                  ? [
                      styles.textInputFieldView,
                      {paddingVertical: EStyleSheet.value('7.5rem')},
                      styles.userListArrayStyle,
                    ]
                  : styles.textInputFieldView
              }
              onPress={() => this.onItemPress(key)}>
              {this.renderSelectedUserList(item, key)}
            </TouchableOpacity>
          </View>
        );
      default:
        break;
    }
  }

  onBackdropPress() {
    this.setState({showUserListModal: false});
  }

  renderUserListModal() {
    let users = this.state.users;
    let dataLength = this.state.dataLength;

    return (
      <PopupMenuMultipleUserList
        addPeopleModelVisible={this.state.showUserListModal}
        onSelect={selectedUserList => this.onSelectUser(selectedUserList)}
        onBackdropPress={() => this.onBackdropPress()}
        selectedUserList={this.state.selectedUserList}
        activeUsersData={true}
        activeUsers={users}
        dataLength={dataLength}
        keyboardValue={0}
        customScrollStyle={styles.customScrollStyle}
        hasBackdrop={true}
        coverScreen={true}
        customModalStyle={styles.popupMenuModalStyle}
      />
    );
  }

  render() {
    let discusstionPointsArray = this.state.discusstionPointsArray;

    return (
      <View style={styles.container}>
        <FlatList
          ref={r => (this.flatList = r)}
          style={styles.flatListStyle}
          data={discusstionPointsArray}
          renderItem={({item, index}) =>
            this.renderOtherDetailsView(item, index)
          }
          keyExtractor={item => item.id}
        />
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onBackPress()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.colorDeepSkyBlue}]}
            onPress={() => this.onFinishPress()}>
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        </View>
        {this.renderUserListModal()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  flatListStyle: {
    marginBottom: '100rem',
  },
  fieldName: {
    marginHorizontal: '20rem',
    marginTop: '10rem',
    fontSize: '10rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.projectTaskNameColor,
  },
  textInputFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
  },
  textInput: {
    fontSize: '11rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    width: '100%',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.colorApple,
    borderRadius: '5rem',
    marginTop: '17rem',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '50rem',
    marginHorizontal: '5rem',
  },
  buttonText: {
    flex: 1,
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: '0rem',
    marginBottom: '15rem',
    flexDirection: 'row',
    marginHorizontal: '15rem',
  },
  textEditorStyle: {
    // height: '150rem',
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    borderColor: colors.colorSilver,
    borderWidth: '0.5rem',
    marginHorizontal: '20rem',
  },
  urlModalInnerStyle: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
    padding: '20rem',
  },
  urlModalTitleStyle: {
    fontSize: '20rem',
  },
  urlModalInputTextViewStyle: {
    marginTop: '20rem',
  },
  urlModalTextStyle: {
    fontSize: '15rem',
  },
  urlModalInputTextViewInnerStyle: {
    backgroundColor: colors.colorWhisper,
    borderRadius: '5rem',
    marginTop: '5rem',
    height: Platform.OS == 'ios' ? '35rem' : '50rem',
  },
  urlModalInputTextInnerStyle: {
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
  userIcon: {
    width: '45rem',
    height: '45rem',
    borderRadius: 90 / 2,
  },
  userListStyle: {
    height: '50rem',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '20rem',
    borderBottomWidth: 1,
    borderBottomColor: colors.lighterGray,
  },
  userNameText: {
    fontSize: '12rem',
    color: colors.projectText,
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  selectedUserListViewStyle: {
    flexDirection: 'row',
    backgroundColor: colors.colorsNavyBlue,
    marginRight: '10rem',
    borderRadius: '5rem',
    marginTop: '5rem',
    height: '25rem',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedUserListStyle: {
    fontSize: '11rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginHorizontal: '10rem',
  },
  crossIcon: {
    marginRight: '5rem',
    width: '12rem',
    height: '12rem',
  },
  userListArrayStyle: {
    flexWrap: 'wrap',
    height: 'auto',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MeetingOtherDetailsScreen);
