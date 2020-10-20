import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  Image,
  Keyboard,
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

class PopupMenuUserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      activeUsers: [],
      allActiveUsers: [],
      userName: '',
      keyboardHeight: 0,
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
    // alert('Keyboard Shown');
    this.setState({keyboardHeight: height * 0.85 - e.endCoordinates.height});
  }

  _keyboardDidHide(e) {
    console.log('KeyBoard Hide userlist');
    let value = this.props.keyboardValue ? this.props.keyboardValue : 0.23;
    this.setState({keyboardHeight: height * value - e.endCoordinates.height});
    // alert('Keyboard Hidden');
  }
  onTriggerPress() {
    this.setState({opened: true});
  }

  componentDidMount() {
    if (this.props.activeUsersData) {
      // this.getActiveUserList(this.props.projectID);
      this.DataLength = this.props.dataLength;
      this.setState({
        activeUsers: this.props.activeUsers,
        allActiveUsers: this.props.activeUsers,
        // dataLoading: false,
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
      });
    }

    if (
      prevProps.addPeopleModelVisible !== this.props.addPeopleModelVisible &&
      !this.props.addPeopleModelVisible
    ) {
      this.setState({
        opened: this.props.addPeopleModelVisible,
        activeUsers: this.props.activeUsers,
        allActiveUsers: this.props.activeUsers,
      });
    }

    if (prevProps.userName !== this.props.userName) {
      this.onSearchTextChange(this.props.userName);
    }
  }

  async onBackdropPress() {
    this.setState({opened: false});
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
    const {navigation} = this.props;
    return (
      <View
        style={[
          styles.userView,
          {
            backgroundColor: this.props.backgroundColor
              ? this.props.backgroundColor
              : colors.projectBgColor,
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
      </View>
    );
  }

  onSelect(item) {
    this.setState({userName: item.label, opened: false});
    this.props.onSelect(item);
  }

  render() {
    const scrollStyle = {
      scrollViewMenuOption: {
        // height: height - (this.state.keyboardHeight + 140)
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
        coverScreen={this.props.coverScreen ? this.props.coverScreen : false}
        // animationIn="slideInDown"
        // animationOut="slideOutUp"
        // animationInTiming={600}
        // animationOutTiming={600}
        // backdropTransitionInTiming={600}
        // backdropTransitionOutTiming={600}
      >
        <View
          style={[
            Platform.OS == 'ios' ? styles.menuStyleIOS : styles.menuStyle,
            this.props.customMenuStyle,
          ]}>
          <ScrollView
            style={[
              scrollStyle.scrollViewMenuOption,
              this.props.customScrollStyle,
            ]}>
            {this.state.activeUsers.map(item => {
              return (
                <MenuOption onSelect={() => this.onSelect(item)}>
                  {this.menuOptions(item)}
                </MenuOption>
              );
            })}
          </ScrollView>
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
    marginBottom: '135rem',
    justifyContent: 'flex-end',
  },
  menuStyle: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
  },
  menuStyleIOS: {
    bottom: 200,
    height: '53%',
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
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
)(PopupMenuUserList);
