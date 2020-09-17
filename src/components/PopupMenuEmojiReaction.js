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
class PopupMenuEmojiReaction extends Component {
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

    if (this.props.onChange) {
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
        width: EStyleSheet.value('200rem'),
        paddingVertical: EStyleSheet.value('0rem'),
        paddingHorizontal: 0,
        marginTop:
          Platform.OS === 'ios'
            ? EStyleSheet.value('-40rem')
            : EStyleSheet.value('-35rem'),
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
              <Image style={[styles.menuIcon]} source={icons.addEmoji} />
            </View>
          </MenuTrigger>
          <MenuOptions customStyles={customStyles}>
            {this.props.data.length > 0 ? (
              <FlatList
                data={this.props.data}
                horizontal
                keyExtractor={(item, index) => index}
                renderItem={({item, index}) => {
                  return (
                    <MenuOption
                      disabled={item.disabledOpt}
                      key={index}
                      value={item}>
                      <View style={styles.menuItemTouchable}>
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

const styles = EStyleSheet.create({
  menuIcon: {
    width: '18rem',
    height: '18rem',
  },
  dropView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropContainer: {
    flexDirection: 'column',
    marginTop: '2rem',
    marginRight: '-15rem',
  },
  menuItemTouchable: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '10rem',
    marginVertical: '12rem',
  },
  menuItemText: {
    fontFamily: Platform.OS == 'ios' ? 'CircularStd-Medium' : 'Product Sans',
    fontSize: '15rem',
  },
  menuStyle: {
    marginRight: '15rem',
  },
});

export default PopupMenuEmojiReaction;
