import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  FlatList,
  Platform,
  Dimensions,
} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import icons from '../asserts/icons/icons';
import colors from '../config/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

const shadow = Platform.select({
  android: {
    elevation: 6,
  },
});
class PopupMenuNormal extends Component {
  defaultRan = false;
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      text: props.text || props.data.length > 0 ? props.data[0].text : '',
      icon: props.icon || props.data.length > 0 ? props.data[0].icon : '',
    };
  }

  componentWillMount() {
    this.setSelectedItem(this.props.selectdItem);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data && nextProps.data.length > 0) {
      if (!this.props.selectedItem && nextProps.data.length > 1) {
        this.setState({
          text: nextProps.data[0].text,
          icon: nextProps.data[0].icon,
        });
      }
      // if (nextProps.data.length === 1) {
      //   this.onDefaultOptionSelect(nextProps.data[0]);
      // }
    }
  }

  setSelectedItem(item) {
    if (item) {
      this.setState({
        opened: false,
        text: item.text,
        icon: item.icon,
        selectdItem: item,
      });
    }
  }

  onOptionSelect(item) {
    this.setState({
      opened: false,
      text: item.text,
      icon: item.icon,
      selectdItem: item,
    });
    // this.updateDataOrder(item);
    if (this.props.onChange) {
      this.props.onChange(item);
    }
  }

  // onDefaultOptionSelect(item) {
  //   if (this.props.onChange && !this.defaultRan) {
  //     this.defaultRan = true;
  //     this.props.onChange(item);
  //   }
  // }

  // updateDataOrder(item) {
  //   const currentIndex = this.props.data.findIndex(elem => {
  //     return elem.value === item.value;
  //   });
  //   const newData = Utils.moveElementInArray(this.props.data, currentIndex, 0);
  //   this.props.data = newData;
  // }

  onTriggerPress() {
    this.setState({opened: true});
  }

  onBackdropPress() {
    this.setState({opened: false});
  }

  render() {
    let {margin: margin} = this.props;
    let marginDrop = {margin};

    const customStyles = {
      optionsContainer: {
        minWidth: EStyleSheet.value('115rem'),
        width: EStyleSheet.value('160rem'),
        paddingVertical: EStyleSheet.value('5rem'),
        paddingHorizontal: 0,
        marginTop:
          Platform.OS === 'ios'
            ? EStyleSheet.value('-40rem')
            : EStyleSheet.value('-20rem'),
        backgroundColor: colors.white,
        borderRadius: EStyleSheet.value('5rem'),
        ...shadow,
      },
      optionWrapper: {
        padding: 0,
      },
    };

    return (
      <View style={[styles.dropContainer, marginDrop, this.props.customStyle]}>
        <Menu
          style={styles.menuStyle}
          opened={this.state.opened}
          onSelect={value => this.onOptionSelect(value)}
          onBackdropPress={() => this.onBackdropPress()}>
          <MenuTrigger
            customStyles={{
              triggerTouchable: {
                hitSlop: {top: 15, bottom: 15, left: 15, right: 20},
              },
            }}
            onPress={() => this.onTriggerPress()}>
            <View style={styles.uploadButtonStyle}>
              <Image style={styles.plusIconStyle} source={icons.plusGray} />
              <Text style={styles.newTextStyle}>New</Text>
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={customStyles}>
            {this.props.data.length > 0 ? (
              <FlatList
                data={this.props.data}
                keyExtractor={(item, index) => index}
                renderItem={({item, index}) => {
                  return (
                    <MenuOption key={index} value={item}>
                      <View style={styles.menuItemTouchable}>
                        <Image
                          style={styles.menuItemIcon}
                          source={item.icon}
                          resizeMode={'contain'}
                        />
                        {index == 1 ? (
                          <View style={styles.menuItemView}>
                            <Text style={styles.menuItemText}>{item.text}</Text>
                            <Text style={styles.menuItemSubText}>
                              (Maximum upload file size is 10MB)
                            </Text>
                          </View>
                        ) : (
                          <Text style={styles.menuItemText}>{item.text}</Text>
                        )}
                      </View>
                    </MenuOption>
                  );
                }}
              />
            ) : null}
          </MenuOptions>
        </Menu>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  dropContainer: {
    flexDirection: 'column',
    marginTop: '2rem',
    marginRight: '-15rem',
  },
  menuItemTouchable: {
    flex: 1,
    flexDirection: 'row',
    paddingRight: '10rem',
    marginLeft: '20rem',
    marginTop: '10rem',
    marginBottom: '10rem',
  },
  menuItemText: {
    fontFamily: Platform.OS == 'ios' ? 'CircularStd-Medium' : 'Product Sans',
    fontSize: '11rem',
    paddingLeft: '10rem',
  },
  menuItemSubText: {
    fontFamily: Platform.OS == 'ios' ? 'CircularStd-Medium' : 'Product Sans',
    fontSize: '9rem',
    paddingHorizontal: '10rem',
    marginTop: '5rem',
  },
  menuItemIcon: {
    width: '15rem',
    height: '15rem',
  },
  menuStyle: {
    height: '10rem',
    width: '90rem',
    marginLeft: '20rem',
    marginTop: '25rem',
    marginBottom: '30rem',
  },
  uploadButtonStyle: {
    height: '30rem',
    width: '90rem',
    flexDirection: 'row',
    borderColor: colors.colorSilver,
    borderWidth: '1rem',
    borderRadius: '20rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIconStyle: {
    width: '15rem',
    height: '15rem',
  },
  newTextStyle: {
    fontSize: '14rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    marginLeft: '10rem',
  },
  menuItemView: {
    flexDirection: 'column',
  },
});

export default PopupMenuNormal;
