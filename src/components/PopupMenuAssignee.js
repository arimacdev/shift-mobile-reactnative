import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  TextInput,
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

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import APIServices from '../services/APIServices';
import FadeIn from 'react-native-fade-in-image';

class PopupMenuAssignee extends Component {
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
    this.DataLength = this.state.allActiveUsers.length;
    this.setState({keyboardHeight: height * 0.9 - e.endCoordinates.height});
  }

  _keyboardDidHide(e) {
    console.log('KeyBoard Hide assignee');
    this.setState({keyboardHeight: height * 0.23 - e.endCoordinates.height});
  }
  onTriggerPress() {
    this.setState({opened: true});
  }

  componentDidMount() {
    let projectID = this.props.projectID;
    this.getActiveUsers(projectID);
    if (this.state.userName != '') {
      this.onSearchTextChange(this.state.userName);
    }
    this.setState({opened: false});
  }

  async getActiveUsers(projectID) {
    // this.setState({dataLoading: true});
    let activeUsers = await APIServices.getAllUsersByProjectId(projectID);
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

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.addPeopleModelVisible !== this.props.addPeopleModelVisible &&
      this.props.addPeopleModelVisible
    ) {
      this.setState({opened: this.props.addPeopleModelVisible});
    }

    if (
      prevProps.addPeopleModelVisible !== this.props.addPeopleModelVisible &&
      !this.props.addPeopleModelVisible
    ) {
      this.setState({opened: this.props.addPeopleModelVisible});
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

  menuTrigger() {
    return (
      <View style={[styles.taskFieldView]}>
        <TextInput
          style={[styles.textInput, {width: '95%'}]}
          placeholder={'Type name'}
          value={this.state.userName}
          onFocus={() => this.onTriggerPress()}
          placeholderTextColor={colors.placeholder}
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

  menuOptions(item) {
    return (
      <View
        style={[
          styles.projectView,
          {
            backgroundColor: colors.projectBgColor,
          },
        ]}>
        {this.userImage(item)}
        <View style={{flex: 1}}>
          <Text style={styles.text}>{item.label}</Text>
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
        maxHeight:
          50 * this.DataLength <= height - (this.state.keyboardHeight + 240)
            ? 50 * this.DataLength
            : height - (this.state.keyboardHeight + 240),
      },
    };

    return (
      <Menu
        opened={this.state.opened}
        onBackdropPress={() => this.onBackdropPress()}
      >
        <MenuTrigger>{this.menuTrigger()}</MenuTrigger>
        <MenuOptions customStyles={optionsStyles}>
          <ScrollView style={scrollStyle.scrollViewMenuOption}>
            {this.state.activeUsers.map(item => {
              return (
                <MenuOption onSelect={() => this.onSelect(item)}>
                  {this.menuOptions(item)}
                </MenuOption>
              );
            })}
          </ScrollView>
        </MenuOptions>
      </Menu>
    );
  }
}

const optionsStyles = {
  optionsContainer: {
    marginTop: -5,
    width: '88%',
    marginLeft: -18,
    backgroundColor: colors.projectBgColor,
  },
};

const styles = EStyleSheet.create({
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '0rem',
    marginBottom: '0rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    width: '100%',
    marginRight: '0rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  userIcon: {
    width: '45rem',
    height: '45rem',
    borderRadius: 90 / 2,
  },
  projectView: {
    height: '55rem',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '10rem',
    paddingBottom: '10rem',
    paddingTop: '5rem',
    borderBottomWidth: '1rem',
    borderBottomColor: colors.lighterGray,
  },
  text: {
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
  return {
    addPeopleModelVisible: state.project.addPeopleModelVisible,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(PopupMenuAssignee);
