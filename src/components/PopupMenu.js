import React, {Component} from 'react';
import {
  View,
  ScrollView,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import colors from '../config/colors';
import icons from '../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
const {height, width} = Dimensions.get('window');

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

export default class PopupMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View>
        <Menu>
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
      </View>
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
    fontFamily: 'Product Sans',
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
