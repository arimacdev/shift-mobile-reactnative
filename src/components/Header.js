import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Icon} from 'native-base';
import {connect} from 'react-redux';
import colors from '../config/colors';
import * as actions from '../redux/actions';
import NavigationService from '../services/NavigationService';
import icons from '../asserts/icons/icons';
import MenuItems from './MenuItems';
import images from '../asserts/img/images';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  navigateToSearch(screen) {
    console.log(screen);
    switch (screen) {
      case 'projectScreen':
        NavigationService.navigate('ProjectsSearchScreen');
        break;
      case 'userScreen':
        NavigationService.navigate('SearchUserScreen');
        break;
      case 'workLoadScreen':
        NavigationService.navigate('WorkloadSearchScreen');
        break;
      case 'tasksScreen':
        NavigationService.navigate('SearchGruopTaskScreen');
        break;
    }
  }

  navigateToAddNew(screen) {
    switch (screen) {
      case 'projectScreen':
        NavigationService.navigate('CreateNewProjectScreen');
        break;
      case 'userScreen':
        NavigationService.navigate('AddUserScreen');
        break;
    }
  }

  openPopup() {}

  render() {
    const {
      onPress,
      isHome,
      title,
      style,
      addButton,
      screen = {},
      search = false,
      isTasks = false,
      isUser = false,
      isWorkload = false,
      isWorkloadFilter = false,
      isCustom = false,
      loginUserType,
      isSearch,
      searchNavigation,
      isAddNew,
      addNewNavigation,
      drawStatus,
      taskStatus,
      isTaskLog,
      isDelete,
    } = this.props;
    // console.log('PPPP',this.props)
    return (
      <SafeAreaView style={{backgroundColor: colors.primary}}>
        <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
        {isHome ? (
          <View style={styles.header}>
            <View style={styles.menuIconContatiner}>
              <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
                <Image source={images.drawer} style={styles.icon} />
              </TouchableOpacity>
            </View>
            <View style={styles.leftContainer}>
              <View style={styles.leftContainerFull}>
                <Text style={styles.title}>{title}</Text>
              </View>
            </View>
            <View style={styles.rightContainer}>
              {isSearch && (
                <TouchableOpacity
                  style={{alignItems: 'flex-end'}}
                  onPress={() => this.navigateToSearch(searchNavigation)}>
                  <Icon
                    name={'ios-search'}
                    style={styles.headerButton}
                    type={'Ionicons'}
                  />
                </TouchableOpacity>
              )}

              {loginUserType == 'SUPER_ADMIN' && isAddNew && (
                <TouchableOpacity
                  style={{alignItems: 'flex-end', marginLeft: 40}}
                  onPress={() => this.navigateToAddNew(addNewNavigation)}>
                  <Icon
                    name={'ios-add'}
                    style={styles.headerButton}
                    type={'Ionicons'}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : isTasks ? (
          <View style={styles.header}>
            <View style={styles.menuIconContatiner}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={onPress}
                hitSlop={styles.hitslopStyle}>
                <Icon
                  name={'ios-arrow-round-back'}
                  style={styles.iconBack}
                  type={'Ionicons'}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[styles.leftContainer, {flexDirection: 'row', flex: 1}]}>
              <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
                <Image source={icons.whiteCircule} style={styles.icon} />
              </TouchableOpacity>
              <View style={styles.leftContainerFull}>
                <Text numberOfLines={1} style={styles.title}>
                  {title}
                </Text>
              </View>
            </View>
            <View style={[styles.rightContainer, {flex: 0}]}>
              <TouchableOpacity
                style={{alignItems: 'flex-end'}}
                onPress={() =>
                  this.props.navigation.navigate('ProjectsSearchScreen')
                }
                hitSlop={styles.hitslopStyle}>
                <Image
                  source={icons.editWhite}
                  style={styles.iconEdit}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{alignItems: 'flex-end', marginLeft: 20}}
                onPress={() =>
                  this.props.navigation.navigate('CreateNewProjectScreen')
                }
                hitSlop={styles.hitslopStyle}>
                <Image
                  source={icons.deleteWhite}
                  style={styles.iconEdit}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[style, styles.header]}>
            <View style={styles.menuIconContatiner}>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={onPress}
                hitSlop={styles.hitslopStyle}>
                <Icon
                  name={search ? 'ios-close' : 'ios-arrow-round-back'}
                  style={styles.iconBack}
                  type={'Ionicons'}
                />
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.leftContainer,
                {flex: 0.7},
                {flexDirection: 'row'},
              ]}>
              {drawStatus && (
                <Image
                  style={styles.completionIcon}
                  source={
                    taskStatus == 'Closed'
                      ? icons.rightCircule
                      : icons.whiteCircule
                  }
                />
              )}
              <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>
                {title}
              </Text>
            </View>
            <View style={styles.rightContainer}>
              {addButton && (
                <TouchableOpacity
                  style={{alignItems: 'flex-end'}}
                  onPress={() => this.navigateTo(screen)}>
                  <Icon
                    name={'plus'}
                    style={styles.iconPlus}
                    type={'Feather'}
                  />
                </TouchableOpacity>
              )}
              {isWorkloadFilter && (
                <MenuItems
                  // customStyle={styles.menuItems}
                  data={this.props.menuItems}
                  onChange={item => this.props.onMenuItemChange(item)}
                  // disabledOpt={this.props.dataList.length <= 0}
                />
              )}
              {isCustom && (
                <TouchableOpacity
                  style={{alignItems: 'flex-end'}}
                  onPress={() => this.props.onCalendarPress(true)}>
                  <Icon
                    name={'calendar'}
                    style={styles.iconCalendar}
                    type={'Feather'}
                  />
                </TouchableOpacity>
              )}
              {isTaskLog && (
                <TouchableOpacity
                  style={{alignItems: 'flex-end'}}
                  onPress={() => this.props.onPressTaskLog()}>
                  <Image
                    style={styles.iconTaskLog}
                    source={icons.taskLogWhite}
                  />
                </TouchableOpacity>
              )}
              {isDelete && (
                <TouchableOpacity
                  style={{alignItems: 'flex-end'}}
                  onPress={() => this.props.onPressDelete()}>
                  <Image
                    source={icons.deleteWhite}
                    style={styles.iconEdit}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }
}

const styles = EStyleSheet.create({
  header: {
    height: '56rem',
    backgroundColor: colors.primary,
    flexDirection: 'row',
    padding: '16rem',
    alignItems: 'center',
  },
  menuIconContatiner: {
    flex: 0.1,
    marginTop: Platform.OS === 'ios' ? '-4rem' : '0rem',
  },
  leftContainer: {
    flex: 0.4,
    alignItems: 'flex-start',
  },
  leftContainerFull: {
    flex: 0.9,
    alignItems: 'flex-start',
  },
  rightContainer: {
    flex: 0.5,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: '5rem',
  },
  title: {
    fontSize: '20rem',
    color: colors.white,
    fontFamily: 'CircularStd-Medium',
    fontWeight: '500',
    textAlign: 'left',
    marginLeft: '08rem',
  },
  icon: {
    width: '28rem',
    height: '28rem',
    borderRadius: '10rem',
    marginLeft: '5rem',
  },
  iconBack: {
    fontSize: '32rem',
    color: colors.white,
    fontWeight: '800',
  },
  iconPlus: {
    fontSize: '30rem',
    color: colors.white,
    fontWeight: '800',
  },
  headerButton: {
    fontSize: '30rem',
    color: colors.white,
    fontWeight: '800',
  },
  iconEdit: {
    width: '20rem',
    height: '20rem',
    marginLeft: '5rem',
  },
  completionIcon: {
    width: '25rem',
    height: '25rem',
  },
  iconCalendar: {
    fontSize: '25rem',
    color: colors.white,
    fontWeight: '800',
    marginLeft: '10rem',
  },
  iconTaskLog: {
    width: '20rem',
    height: '20rem',
    marginRight: '20rem',
  },
  hitslopStyle: {
    top: '20rem',
    bottom: '20rem',
    left: '50rem',
    right: '50rem',
  },
});

const mapStateToProps = state => {
  return {
    loginUserType: state.users.loginUserType,
  };
};

export default connect(
  mapStateToProps,
  actions,
)(Header);
