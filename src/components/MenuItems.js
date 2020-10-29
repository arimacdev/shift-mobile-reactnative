import React, {Component} from 'react';
import {View, Text, Image, FlatList, Platform, Dimensions} from 'react-native';
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
class MenuItems extends Component {
  defaultRan = false;
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      text: props.text || props.data.length > 0 ? props.data[0].text : '',
      color: props.color || props.data.length > 0 ? props.data[0].color : '',
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
          color: nextProps.data[0].color,
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
        color: item.color,
        selectdItem: item,
      });
    }
  }

  onOptionSelect(item) {
    this.setState({
      opened: false,
      text: item.text,
      color: item.color,
      selectdItem: item,
    });
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
        width: EStyleSheet.value('145rem'),
        paddingVertical: EStyleSheet.value('10rem'),
        paddingHorizontal: 0,
        marginTop:
          Platform.OS === 'ios'
            ? EStyleSheet.value('15rem')
            : EStyleSheet.value('32rem'),
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
            onPress={() => this.onTriggerPress()}
            disabled={this.props.disabledOpt}>
            <View style={styles.dropView}>
              <Image style={[styles.filterIcon]} source={icons.filterIcon} />
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
                        <View
                          style={[
                            styles.menuItemTextView,
                            {backgroundColor: item.color},
                          ]}
                        />
                        <Text style={styles.menuItemText}>{item.text}</Text>
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

const styles = EStyleSheet.create({
  filterIcon: {
    width: '21rem',
    height: '21rem',
    marginTop: '2rem',
    marginRight: '-10rem',
  },
  dropView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: '8rem',
  },
  dropContainer: {
    flexDirection: 'column',
  },
  menuItemTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: '20rem',
    marginLeft: '20rem',
    marginTop: '10rem',
    marginBottom: '10rem',
  },
  menuItemText: {
    paddingLeft: '15rem',
    color: colors.gray,
  },
  menuStyle: {
    marginRight: '18rem',
  },
  menuItemTextView: {
    width: '18rem',
    height: '18rem',
    paddingVertical: '10rem',
    paddingLeft: '15rem',
  },
});

export default MenuItems;
