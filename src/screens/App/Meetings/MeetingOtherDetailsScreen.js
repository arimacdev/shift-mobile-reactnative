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
import MultiSelect from 'react-native-multiple-select';

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
          name: 'Meeting Attended by',
          placeHolder: 'Add Meeting Attended by',
        },
        {
          id: 6,
          name: 'Meeting Attended by  - Non Org (Ex: Member 1, Member 2)',
          placeHolder: 'Add Meeting Attended by',
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
      showPicker: false,
      date: new Date(),
      targetDate: '',
      targetDateValue: '',
      textInputs: [],
      textInputsUserList: [{userName: '', userID: ''}],
      indexMain: 1,
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
      selectedItems: [],
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

  async addPoint() {
    let targetDate = this.state.targetDate;
    let targetDateValue = this.state.targetDateValue;
    let textInputs = this.state.textInputs;
    let projectId = this.props.selectedProjectID;
    let meetingId = this.props.meetingId;
    let discussionPoint = textInputs[0];
    let actionBy = this.state.userID;
    let remarks = textInputs[3];
    let actionByGuest = false;
    let indexMain = this.state.indexMain;

    let html = await this.richText.current?.getContentHtml();
    await this.setState({description: html});
    let description = this.state.description;

    if (this.validateFields(targetDate, textInputs, actionBy, description)) {
      let targetDateFormatted = targetDateValue
        ? moment(targetDateValue, 'DD/MM/YYYY hh:mmA').format(
            'YYYY-MM-DD[T]HH:mm:ss',
          )
        : '';
      this.setState({dataLoading: true});
      await APIServices.addDiscussionPointData(
        meetingId,
        projectId,
        description,
        discussionPoint,
        remarks,
        actionBy,
        actionByGuest,
        targetDateFormatted,
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

  validateFields(targetDate, textInputs, actionBy, description) {
    if (!textInputs[0] && _.isEmpty(textInputs[0])) {
      Utils.showAlert(
        true,
        '',
        'Please enter the discussion point',
        this.props,
      );
      return false;
    }

    if (!actionBy && _.isEmpty(actionBy)) {
      Utils.showAlert(
        true,
        '',
        'Please enter the action by for discussion point',
        this.props,
      );
      return false;
    }

    if (!targetDate && _.isEmpty(targetDate)) {
      Utils.showAlert(
        true,
        '',
        'Please set the target date for discussion point',
        this.props,
      );
      return false;
    }

    if (!textInputs[3] && _.isEmpty(textInputs[3])) {
      Utils.showAlert(
        true,
        '',
        'Please enter the remarks for discussion point',
        this.props,
      );
      return false;
    }

    if (!description && _.isEmpty(description)) {
      Utils.showAlert(
        true,
        '',
        'Please enter the description for discussion point',
        this.props,
      );
      return false;
    }

    return true;
  }

  onNextPress() {
    let indexMain = this.state.indexMain + 1;
    this.props.onChangeIndexMain(indexMain);
  }

  onDiscussionItemPress(item) {
    switch (item.id) {
      case 3:
        this.setState({showPicker: true});
        break;
      default:
        break;
    }
  }

  onSelectedItemsChange = selectedItems => {
    this.setState({selectedItems});
  };

  onSelectUser = async (item, index) => {
    let {textInputsUserList} = this.state;
    let i = 0;

    // for (i = 0; i < textInputsUserList.length; i++) {
    //   const element = textInputsUserList[i];
    //   if(index == i){

    //       userList.push({userName: e.label, userID: e.key});

    //     console.log("Sssssssssssssssssssssss",element)

    //   }

    // }
    await this.state.userList.push({userName: item.label, userID: item.key});
    textInputsUserList[index] = this.state.userList;
    await this.setState({textInputsUserList});

    console.log('Sssssssssssssssssssssss', textInputsUserList);

    this.setState({
      popupMenuOpen: false,
    });
    await this.props.addPeopleModal(false);
  };

  async onSearchTextChange(text) {
    await this.props.addPeopleModal(true);
    this.setState({userName: text, popupMenuOpen: true, userID: ''});
    let result = this.state.allUsers.filter(data =>
      data.label.toLowerCase().includes(text.toLowerCase()),
    );
    if (text == '') {
      this.setState({users: this.state.allUsers, userID: ''});
    } else {
      this.setState({users: result});
    }
  }

  renderMenuTrugger(placeHolder, index) {
    return (
      <View style={styles.textInputFieldView}>
        <TextInput
          style={styles.textInput}
          placeholder={placeHolder}
          value={this.state.textInputsUserList[index]}
          onChangeText={text => this.onSearchTextChange(text)}
        />
      </View>
    );
  }

  userImage = function(item) {
    let userImage = item.userImage;

    if (userImage) {
      return (
        <FadeIn>
          <Image source={{uri: userImage}} style={styles.userIcon} />
        </FadeIn>
      );
    } else {
      return (
        <Image
          style={styles.userIcon}
          source={icons.defultUser}
          resizeMode="contain"
        />
      );
    }
  };

  renderUserList(item) {
    const {navigation} = this.props;
    return (
      <View
        style={[
          styles.userListStyle,
          {
            backgroundColor:
              item.label == navigation.state.params.userName
                ? colors.projectBgColor
                : '',
          },
        ]}>
        {this.userImage(item)}
        <View style={{flex: 1}}>
          <Text style={styles.userNameText}>{item.label}</Text>
        </View>
      </View>
    );
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
              id: activeUsers.data[i].userId,
              name:
                activeUsers.data[i].firstName +
                ' ' +
                activeUsers.data[i].lastName,
              userImage: activeUsers.data[i].profileImage,
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

  renderDiscussionPointView(item, index) {
    let key = item.id;
    let value = this.state.targetDate;
    let description = this.state.description;
    let users = this.state.users;

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
        const optionsStyles = {
          optionsContainer: {
            marginTop: 1,
            width: '90%',
            marginLeft: 20,
          },
        };
        return (
          <View>
            <Text style={styles.fieldName}>{item.name}</Text>
            {/* <PopupMenu
              menuTrigger={this.renderMenuTrugger(item.placeHolder, index)}
              menuOptions={item => this.renderUserList(item)}
              data={users}
              onSelect={item => this.onSelectUser(item, index)}
              open={this.state.popupMenuOpen}
              customStyles={optionsStyles}
            /> */}
            <MultiSelect
              hideTags
              items={users}
              uniqueKey="id"
              ref={component => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={this.onSelectedItemsChange}
              selectedItems={this.state.selectedItems}
              selectText="Pick Items"
              searchInputPlaceholderText="Search Items..."
              onChangeInput={text => console.log(text)}
              altFontFamily="ProximaNova-Light"
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{color: '#CCC'}}
              submitButtonColor="#CCC"
              submitButtonText="Submit"
            />
            <View>
              {/* {this.multiSelect.getSelectedItemsExt(this.state.selectedItems)} */}
            </View>
          </View>
        );
      default:
        break;
    }
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
            this.renderDiscussionPointView(item, index)
          }
          keyExtractor={item => item.id}
        />
        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.addPoint()}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: colors.colorDeepSkyBlue}]}
            onPress={() => this.onNextPress()}>
            <Text style={styles.buttonText}>Finish</Text>
          </TouchableOpacity>
        </View>
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
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MeetingOtherDetailsScreen);
