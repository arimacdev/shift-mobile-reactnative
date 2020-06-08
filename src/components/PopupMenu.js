import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
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
  MenuContext,
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

class PopupMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
        opened:false
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if(prevProps.addPeopleModelVisible !== this.props.addPeopleModelVisible && this.props.addPeopleModelVisible){
      this.setState({ opened: this.props.addPeopleModelVisible });
    }

    if(prevProps.addPeopleModelVisible !== this.props.addPeopleModelVisible && !this.props.addPeopleModelVisible){
      this.setState({ opened: this.props.addPeopleModelVisible });
    }
}

  componentDidMount() {
    this.setState({ opened: this.props.open });
  }

  async onBackdropPress() {
    this.setState({ opened: false });
    await this.props.addPeopleModal(false);
  }

  render() {
    return (
      //   <MenuContext style={{height:100}} ref={mc => (this.menuContext = mc)}>
      <Menu
        opened={this.state.opened}
        onBackdropPress={() => this.onBackdropPress()}
        onSelect={value => this.onOptionSelect(value)}>
        <MenuTrigger>{this.props.menuTrigger}</MenuTrigger>
        <MenuOptions customStyles={optionsStyles}>
          <ScrollView style={{maxHeight: 250}}>
            {this.props.data.map(item => {
              return (
                <MenuOption onSelect={() => this.props.onSelect(item)}>
                  {this.props.menuOptions(item)}
                </MenuOption>
              );
            })}
          </ScrollView>
        </MenuOptions>
      </Menu>
      //   </MenuContext>
    );
  }
}

const optionsStyles = {
  optionsContainer: {
    marginTop: 40,
    width: '90%',
    marginLeft: 20,
    // backgroundColor: 'green',
    // padding: 5,
  },
  //   optionsWrapper: {
  //     //   height:100,
  //     backgroundColor: 'purple',
  //   },
  //   optionWrapper: {
  //     // height:100,
  //     backgroundColor: 'yellow',
  //     margin: 5,
  //   },
  //   optionTouchable: {
  //     height:100,
  //     underlayColor: 'gold',
  //     activeOpacity: 70,
  //   },
  //   optionText: {
  //     color: 'brown',
  //   },
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: height - 500,
  },
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginTop: '0rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '60rem',
    marginHorizontal: '20rem',
  },
  inputsText: {
    fontFamily: Platform.OS=='ios'? 'CircularStd-Medium':'Product Sans',
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
});

const mapStateToProps = state => {
  return {
    addPeopleModelVisible: state.project.addPeopleModelVisible,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(PopupMenu);
