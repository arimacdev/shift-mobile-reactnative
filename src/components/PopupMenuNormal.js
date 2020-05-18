import React, {Component} from 'react';
import {View, StyleSheet, Text, Image, FlatList, Platform} from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import icons from '../assest/icons/icons';
import colors from '../config/colors';

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
        });
      }
      if (nextProps.data.length === 1) {
        this.onDefaultOptionSelect(nextProps.data[0]);
      }
    }
  }

  setSelectedItem(item) {
    if (item) {
      this.setState({
        opened: false,
        text: item.text,
        selectdItem: item,
      });
    }
  }

  onOptionSelect(item) {
    this.setState({
      opened: false,
      text: item.text,
      selectdItem: item,
    });
    // this.updateDataOrder(item);
    if (this.props.onChange) {
      this.props.onChange(item);
    }
  }

  onDefaultOptionSelect(item) {
    if (this.props.onChange && !this.defaultRan) {
      this.defaultRan = true;
      this.props.onChange(item);
    }
  }

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
        minWidth: 120,
        width: 150,
        paddingVertical: 5,
        paddingHorizontal: 0,
        marginTop: Platform.OS === 'ios' ? 17 : -30,
        backgroundColor: colors.white,
        borderRadius: 5,
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
            onPress={() => this.onTriggerPress()}
            disabled={this.props.disabledOpt}>
            <View style={styles.dropView}>
              <Image style={[styles.menuIcon]} source={icons.menuVertical} />
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={customStyles}>
            {this.props.data.length > 1 ? (
              <FlatList
                data={this.props.data}
                keyExtractor={(item, index) => index}
                renderItem={({item, index}) => {
                  return (
                    <MenuOption
                      disabled={item.disabledOpt}
                      key={index}
                      value={item}>
                      <View style={styles.menuItemTouchable}>
                        <Text
                          style={[
                            styles.menuItemText,
                            {color: index == 1 ? colors.lightRed : colors.gray},
                          ]}>
                          {item.text}
                        </Text>
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

const localColors = {
  borderColor: 'rgba(0, 0, 0, 0.12)',
};

const styles = StyleSheet.create({
  defaultSelectedText: {
    fontSize: 16,
    marginLeft: 15,
    marginRight: 15,
  },
  menuIcon: {
    width: 20,
    height: 20,
    marginTop: 3,
    marginRight: -10,
  },
  dropDownText: {
    fontSize: 12,
  },
  dropView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
  },
  dropContainer: {
    flexDirection: 'column',
    marginTop: 2,
    marginRight: -15,
  },
  menuItemTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  selectedItemBorder: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: localColors.borderColor,
  },
  menuItemText: {
    fontFamily:  Platform.OS=='ios'? 'CircularStd-Medium':'Product Sans',
    fontSize: 12,
    paddingLeft: 5,
  },
  menuItemArrowWrapper: {
    width: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemArrow: {
    width: 12,
    height: 12,
  },
  menuStyle: {
    marginRight: 20,
  },
  menuItemTextView: {
    width: 20,
    height: 20,
    paddingVertical: 10,
    paddingLeft: 15,
  },
});

export default PopupMenuNormal;
