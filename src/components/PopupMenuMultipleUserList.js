import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  Image,
  Keyboard,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import colors from '../config/colors';
import icons from '../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
const {height, width} = Dimensions.get('window');
import * as actions from '../redux/actions';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';
import {MenuOption} from 'react-native-popup-menu';
import APIServices from '../services/APIServices';
import FadeIn from 'react-native-fade-in-image';

class PopupMenuMultipleUserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      activeUsers: [],
      allActiveUsers: [],
      userName: '',
      keyboardHeight: 0,
      selectedUserList: [],
    };

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow(e) {
    console.log('Keyboard Show');
    this.DataLength = this.props.activeUsers.length;
    this.setState({keyboardHeight: height * 0.85 - e.endCoordinates.height});
  }

  _keyboardDidHide(e) {
    console.log('KeyBoard Hide');
    let value = this.props.keyboardValue ? this.props.keyboardValue : 0.23;
    this.setState({keyboardHeight: height * value - e.endCoordinates.height});
  }
  onTriggerPress() {
    this.setState({opened: true});
  }

  componentDidMount() {
    if (this.props.activeUsersData) {
      this.DataLength = this.props.dataLength;
      this.setState({
        activeUsers: this.props.activeUsers,
        allActiveUsers: this.props.activeUsers,
        selectedUserList:
          this.props.selectedUserList.length > 0
            ? this.props.selectedUserList
            : [],
        userName: '',
      });
    } else {
      this.getUserList();
    }

    if (this.state.userName != '') {
      this.onSearchTextChange(this.state.userName);
    }
    this.setState({opened: false});
  }

  async getUserList() {
    // this.setState({dataLoading: true});
    let activeUsers = await APIServices.getAllUsersData();
    if (activeUsers.message == 'success') {
      let userList = [];
      activeUsers.data.sort(this.arrayCompare);
      for (let i = 0; i < activeUsers.data.length; i++) {
        if (activeUsers.data[i].firstName && activeUsers.data[i].lastName) {
          userList.push({
            key: activeUsers.data[i].userId,
            label:
              activeUsers.data[i].firstName +
              ' ' +
              activeUsers.data[i].lastName,
            userImage: activeUsers.data[i].profileImage,
          });
        }
      }
      this.setState({
        activeUsers: userList,
        allActiveUsers: userList,
        // dataLoading: false,
      });
      this.DataLength = userList.length;
    } else {
      console.log('error');
      // this.setState({dataLoading: false});
    }
  }

  async getActiveUserList(projectID) {
    // this.setState({dataLoading: true});
    let activeUsers = await APIServices.getAllUsersByProjectId(projectID);
    if (activeUsers.message == 'success') {
      let userList = [];
      activeUsers.data.sort(this.arrayCompare);
      for (let i = 0; i < activeUsers.data.length; i++) {
        if (activeUsers.data[i].firstName && activeUsers.data[i].lastName) {
          userList.push({
            key: activeUsers.data[i].userId,
            label:
              activeUsers.data[i].firstName +
              ' ' +
              activeUsers.data[i].lastName,
            userImage: activeUsers.data[i].profileImage,
          });
        }
      }
      this.setState({
        activeUsers: userList,
        allActiveUsers: userList,
        // dataLoading: false,
      });
      this.DataLength = userList.length;
    } else {
      console.log('error');
      // this.setState({dataLoading: false});
    }
  }

  arrayCompare(a, b) {
    const firstNameA = a.firstName.toUpperCase();
    const firstNameB = b.firstName.toUpperCase();

    let comparison = 0;
    if (firstNameA > firstNameB) {
      comparison = 1;
    } else if (firstNameA < firstNameB) {
      comparison = -1;
    }
    return comparison;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.addPeopleModelVisible !== this.props.addPeopleModelVisible &&
      this.props.addPeopleModelVisible
    ) {
      this.setState({
        opened: this.props.addPeopleModelVisible,
        activeUsers: this.props.activeUsers,
        allActiveUsers: this.props.activeUsers,
        selectedUserList:
          this.props.selectedUserList.length > 0
            ? this.props.selectedUserList
            : [],
        userName: '',
      });
    }
  }

  async onBackdropPress() {
    this.setState({opened: false});
    this.props.onBackdropPress();
  }

  async onSearchTextChange(text) {
    this.setState({userName: text, opened: true});
    let result = this.state.allActiveUsers.filter(data =>
      data.label.toLowerCase().includes(text.toLowerCase()),
    );
    if (text == '') {
      this.setState({activeUsers: this.state.allActiveUsers});
    } else {
      this.setState({activeUsers: result});
    }
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

  menuOptions(item) {
    let selectedUserList = this.state.selectedUserList;
    let itemFoundId = '';
    for (let index = 0; index < selectedUserList.length; index++) {
      const element = selectedUserList[index];
      if (element.Id == item.key) {
        itemFoundId = item.key;
      }
    }
    return (
      <View
        style={[
          styles.userView,
          {
            backgroundColor: this.props.backgroundColor
              ? this.props.backgroundColor
              : colors.white,
          },
        ]}>
        {this.userImage(item)}
        <View style={{flex: 1}}>
          <Text
            style={[
              styles.text,
              {
                color: this.props.textColor
                  ? this.props.textColor
                  : colors.projectText,
              },
            ]}>
            {item.label}
          </Text>
        </View>
        <Image
          style={styles.addUserIcon}
          source={
            itemFoundId == item.key ? icons.rightCircule : icons.whiteCircule
          }
          resizeMode="contain"
        />
      </View>
    );
  }

  async onSelect(item) {
    let selectedUserList = this.state.selectedUserList;
    let itemFoundId = '';
    for (let index = 0; index < selectedUserList.length; index++) {
      const element = selectedUserList[index];
      if (element.Id == item.key) {
        itemFoundId = item.key;
      }
    }

    let filteredData = this.state.activeUsers.filter(function(item) {
      if (itemFoundId == item.key) {
        item.isSelected = !item.isSelected;
      }
      return item;
    });

    this.setState({activeUsers: filteredData});

    if (itemFoundId != '') {
      let userListArray = selectedUserList.filter(item => {
        return item.Id !== itemFoundId;
      });
      this.setState({selectedUserList: userListArray});
    } else {
      selectedUserList.push({userName: item.label, Id: item.key});
    }
  }

  onCloseModal() {
    this.setState({opened: false});
    this.props.onBackdropPress();
  }

  onOkPress() {
    let selectedUserList = this.state.selectedUserList;
    this.setState({opened: false});
    this.props.onSelect(selectedUserList);
  }

  render() {
    const scrollStyle = {
      scrollViewMenuOption: {
        maxHeight:
          50 * this.DataLength <= height - (this.state.keyboardHeight + 240)
            ? 50 * this.DataLength
            : height - (this.state.keyboardHeight + 240),
      },
    };

    return (
      <Modal
        isVisible={this.state.opened}
        style={[styles.modalStyle, this.props.customModalStyle]}
        onBackdropPress={() => this.onBackdropPress()}
        hideModalContentWhileAnimating={true}
        hasBackdrop={this.props.hasBackdrop ? this.props.hasBackdrop : false}
        coverScreen={this.props.coverScreen ? this.props.coverScreen : false}>
        <View
          style={[
            Platform.OS == 'ios' ? styles.menuStyleIOS : styles.menuStyle,
            this.props.customMenuStyle,
          ]}>
          <View style={styles.textInputFieldView}>
            <TextInput
              style={styles.textInput}
              placeholder={'Search'}
              value={this.state.userName}
              onChangeText={text => this.onSearchTextChange(text)}
            />
          </View>
          <ScrollView
            style={[
              scrollStyle.scrollViewMenuOption,
              this.props.customScrollStyle,
            ]}>
            {this.state.activeUsers.length > 0 ? (
              this.state.activeUsers.map(item => {
                return (
                  <MenuOption onSelect={() => this.onSelect(item)}>
                    {this.menuOptions(item)}
                  </MenuOption>
                );
              })
            ) : (
              <View style={styles.noUserFoundView}>
                <Text style={styles.noUserFoundText}>No user found</Text>
              </View>
            )}
          </ScrollView>
          <View style={styles.ButtonViewStyle}>
            <TouchableOpacity
              style={styles.cancelStyle}
              onPress={() => this.onCloseModal()}>
              <Text style={styles.cancelTextStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.positiveStyle,
                {
                  backgroundColor:
                    this.state.selectedUserList.length == 0
                      ? colors.lighterGray
                      : colors.lightGreen,
                },
              ]}
              disabled={this.state.selectedUserList.length == 0 ? true : false}
              onPress={() => this.onOkPress()}>
              <Text style={styles.positiveTextStyle}>Ok</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  userIcon: {
    width: '45rem',
    height: '45rem',
    borderRadius: 90 / 2,
  },
  userView: {
    height: '55rem',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '10rem',
    paddingBottom: '10rem',
    paddingTop: '5rem',
    borderBottomWidth: 1,
    borderBottomColor: colors.lighterGray,
  },
  text: {
    fontSize: '12rem',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  modalStyle: {
    // marginBottom: '135rem',
    // justifyContent: 'flex-end',
  },
  menuStyle: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
  },
  menuStyleIOS: {
    bottom: 200,
    height: '53%',
    backgroundColor: colors.white,
    borderRadius: '5rem',
  },
  ButtonViewStyle: {
    marginHorizontal: '20rem',
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
  textInputFieldView: {
    backgroundColor: colors.white,
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '10rem',
    borderBottomWidth: 1,
  },
  textInput: {
    fontSize: '11rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    width: '100%',
  },
  addUserIcon: {
    width: '30rem',
    height: '30rem',
  },
  noUserFoundView: {
    height: '70rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noUserFoundText: {
    fontSize: '15rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  return {
    // addPeopleModelVisible: state.project.addPeopleModelVisible,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(PopupMenuMultipleUserList);
