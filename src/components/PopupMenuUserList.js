import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
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

import {
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
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
    this.DataLength = this.state.allActiveUsers.length;
    // alert('Keyboard Shown');
    this.setState({keyboardHeight: height * 0.8 - e.endCoordinates.height});
  }

  _keyboardDidHide(e) {
    console.log('KeyBoard Hide');
    this.setState({keyboardHeight: height * 0.23 - e.endCoordinates.height});
    // alert('Keyboard Hidden');
  }
  onTriggerPress() {
    this.setState({opened: true});
  }

  componentDidMount() {
    this.getUserList();
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

    if(prevProps.userName !== this.props.userName &&
      this.props.userName){
      this.onSearchTextChange(this.props.userName)
    }
  }

  async onBackdropPress() {
    this.setState({opened: false});
  }

  async onSearchTextChange(text) {
    console.log("vvvvvvvvvvvvvvvv",text)
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
          styles.projectView,
          {
            backgroundColor: colors.projectBgColor,
            // item.label == this.props.userName
            //   ? colors.projectBgColor
            //   : '',
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
        style={{height: 10}}
        hideModalContentWhileAnimating={true}
        hasBackdrop={false}
        coverScreen={false}
        animationIn="zoomInDown"
        animationOut="zoomOutUp"
        animationInTiming={600}
        animationOutTiming={600}
        backdropTransitionInTiming={600}
        backdropTransitionOutTiming={600}>
        <View style={{backgroundColor: colors.projectBgColor, borderRadius:5}}>
          <ScrollView style={scrollStyle.scrollViewMenuOption}>
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

const optionsStyles = {
  optionsContainer: {
    marginTop: -5,
    width: '88%',
    marginLeft: -18,
    backgroundColor: colors.projectBgColor,
  },
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: height - 700,
  },
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginTop: '0rem',
    marginBottom: '0rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    width: '100%',
    marginRight: '0rem',
  },
  inputsText: {
    fontFamily: Platform.OS == 'ios' ? 'CircularStd-Medium' : 'Product Sans',
    height: 45,
    flex: 1,
    marginTop: '28rem',
    color: colors.gray,
    textAlign: 'left',
  },
  inputsTextDefualt: {
    fontFamily: 'CircularStd-Medium',
    height: 45,
    flex: 1,
    marginTop: '28rem',
    color: colors.textPlaceHolderColor,
    textAlign: 'left',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
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
    borderBottomWidth: 1,
    borderBottomColor: colors.lighterGray,
  },
  text: {
    fontSize: '12rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
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
