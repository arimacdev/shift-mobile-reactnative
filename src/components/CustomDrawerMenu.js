import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import {DrawerNavigatorItems} from 'react-navigation-drawer';
import {Text} from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import colors from '../config/colors';
import NavigationService from '../services/NavigationService';
import * as actions from '../redux/actions';
import axios from 'axios';
import FadeIn from 'react-native-fade-in-image';
import icons from '../asserts/icons/icons';
import OneSignal from 'react-native-onesignal';
import APIServices from '../services/APIServices';
import MessageShowModal from './MessageShowModal';
import Utils from '../utils/Utils';
import images from '../asserts/img/images';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

const CustomDrawerContentComponent = props => {
  const details = {
    icon: icons.alertRed,
    type: 'confirm',
    title: 'Logout',
    description:
      "You're about to logout from this app. If you're not, you can close this pop up.",
    buttons: {positive: 'Logout', negative: 'Cancel'},
  };

  const [showMessageModal, setShowMessageModal] = useState(false);

  const confirmLogout = props => {
    props.navigation.closeDrawer();
    setShowMessageModal(true);
  };

  const onPressCancel = () => {
    setShowMessageModal(false);
  };

  const logOut = async () => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const logoutEndpoint = await AsyncStorage.getItem('logoutEndpoint');
    try {
      let response = await axios({
        url: logoutEndpoint + '?id_token_hint=' + accessToken,
        method: 'GET',
      });
      if (response.status === 200) {
        AsyncStorage.clear();
        OneSignal.setSubscription(false);
        NavigationService.navigate('ConfigurationScreen');
        props.destroySession();
      }
    } catch (error) {
      Utils.showAlert(true, '', 'Logout error', props);
    }
  };

  const setOneSignalUserUnsubscribe = async () => {
    setShowMessageModal(false);
    AsyncStorage.getItem('userIdOneSignal').then(userIdOneSignal => {
      if (userIdOneSignal) {
        APIServices.setOneSignalNotificationStatusData(userIdOneSignal, false)
          .then(response => {
            if (response.message == 'success') {
              logOut();
            }
          })
          .catch(err => {
            logOut();
            Utils.showAlert(
              true,
              '',
              'One signal notification unsubscribe failed',
              props,
            );
          });
      }
    });
  };

  const getSelectedScreen = () => {
    let key = props.selectedDrawerItem;
    let selectedScreen = 'Projects';
    switch (key) {
      case 'projects':
        selectedScreen = 'Projects';
        break;
      case 'tasks':
        selectedScreen = 'DrawerTasksScreen';
        break;
      case 'workload':
        selectedScreen = 'WorkloadScreen';
        break;
      default:
        break;
    }
    return selectedScreen;
  };

  return (
    <ScrollView>
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'always', horizontal: 'never'}}>
        <TouchableOpacity
          style={styles.header}
          onPress={() => {
            props.navigation.navigate('ViewProfileScreen', {
              profile: props.loginUser,
              selectedScreen: getSelectedScreen(),
              navigation: props.navigation
            });
          }}>
          <View style={styles.headerLeft}>
            {props.loginUser.profileImage ? (
              <FadeIn>
                <Image
                  source={{uri: props.loginUser.profileImage}}
                  style={styles.userIcon}
                />
              </FadeIn>
            ) : (
              <Image style={styles.userIcon} source={icons.defultUser} />
            )}
          </View>
          <View style={styles.headerRight}>
            <View style={{}}>
              <Text style={styles.textName}>ARIMAC</Text>
            </View>
            <View style={{}}>
              <Text style={styles.textNameUser}>
                {props.loginUser.firstName
                  ? `${props.loginUser.firstName}`
                  : ''}
                {props.loginUser.lastName ? ` ${props.loginUser.lastName}` : ''}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => props.navigation.closeDrawer()}
            style={styles.headerClose}>
            <Image
              source={images.drawerClose}
              style={{
                width: EStyleSheet.value('18rem'),
                height: EStyleSheet.value('18rem'),
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <View
          style={{
            borderBottomColor: colors.colorMidnightBlueLight,
            borderBottomWidth: 1,
          }}
        />
        <DrawerNavigatorItems {...props} />
        {/* DrawerTasksScreen */}
        {true && (
          <TouchableOpacity
            style={styles.custtomButton}
            onPress={() => {
              NavigationService.navigate('Projects');
              props.drawerItemSelect('projects');
            }}>
            <Image
              tintColor={
                props.selectedDrawerItem == 'projects'
                  ? colors.white
                  : colors.colorGovernorBay
              }
              source={images.drawerProjects}
              style={styles.iconStyle}
              resizeMode={'contain'}
            />
            <Text
              style={[
                props.selectedDrawerItem == 'projects'
                  ? styles.textSelected
                  : styles.text,
              ]}>
              Projects
            </Text>
          </TouchableOpacity>
        )}
        {true && (
          <TouchableOpacity
            style={styles.custtomButton1}
            onPress={() => {
              NavigationService.navigate('DrawerTasksScreen');
              props.drawerItemSelect('tasks');
            }}>
            <Image
              tintColor={
                props.selectedDrawerItem == 'tasks'
                  ? colors.white
                  : colors.colorGovernorBay
              }
              source={images.drawerTasks}
              style={styles.iconStyle}
              resizeMode={'contain'}
            />
            <Text
              style={[
                props.selectedDrawerItem == 'tasks'
                  ? styles.textSelected
                  : styles.text,
              ]}>
              Tasks
            </Text>
          </TouchableOpacity>
        )}
        {/* WorkLoad */}
        {true && (
          <TouchableOpacity
            style={styles.custtomButton1}
            onPress={() => {
              NavigationService.navigate('WorkloadScreen');
              props.drawerItemSelect('workload');
            }}>
            <Image
              tintColor={
                props.selectedDrawerItem == 'workload'
                  ? colors.white
                  : colors.colorGovernorBay
              }
              source={images.drawerWorkload}
              style={styles.iconStyle}
              resizeMode={'contain'}
            />

            <Text
              style={[
                props.selectedDrawerItem == 'workload'
                  ? styles.textSelected
                  : styles.text,
              ]}>
              Workload
            </Text>
          </TouchableOpacity>
        )}
        {/* UsersScreen */}
        {props.loginUserType == 'SUPER_ADMIN' && (
          <TouchableOpacity
            style={styles.custtomButton1}
            onPress={() => {
              NavigationService.navigate('UsersScreen');
              props.drawerItemSelect('users');
            }}>
            <Image
              tintColor={
                props.selectedDrawerItem == 'users'
                  ? colors.white
                  : colors.colorGovernorBay
              }
              source={images.drawerUsers}
              style={styles.iconStyle}
              resizeMode={'contain'}
            />
            <Text
              style={[
                props.selectedDrawerItem == 'users'
                  ? styles.textSelected
                  : styles.text,
              ]}>
              Users
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.custtomButton1}
          onPress={() => confirmLogout(props)}>
          <Image
            tintColor={
              props.selectedDrawerItem == 'logout'
                ? colors.white
                : colors.colorGovernorBay
            }
            source={images.logout}
            style={styles.iconStyle}
            resizeMode={'contain'}
          />
          <Text
            style={[
              props.selectedDrawerItem == 'logout'
                ? styles.textSelected
                : styles.text,
            ]}>
            Logout
          </Text>
        </TouchableOpacity>
        <MessageShowModal
          showMessageModal={showMessageModal}
          details={details}
          onPress={() => setOneSignalUserUnsubscribe()}
          onPressCancel={() => onPressCancel()}
        />
      </SafeAreaView>
    </ScrollView>
  );
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: '150rem',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flex: 2,
  },
  textName: {
    color: colors.white,
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
    fontWeight: '400',
  },
  textNameUser: {
    color: colors.white,
    fontFamily: 'CircularStd-Medium',
    fontSize: 15,
    fontWeight: '400',
  },
  text: {
    color: colors.colorGovernorBay,
    fontFamily: 'CircularStd-Book',
    fontSize: 19,
    fontWeight: '400',
    marginLeft: 20,
  },
  textSelected: {
    color: colors.white,
    fontFamily: 'CircularStd-Book',
    fontSize: 19,
    marginLeft: 20,
  },
  custtomButton: {
    flexDirection: 'row',
    paddingHorizontal: '18rem',
    marginTop: '15rem',
  },
  custtomButton1: {
    flexDirection: 'row',
    paddingHorizontal: '18rem',
    marginTop: '30rem',
    alignItems: 'center',
  },
  headerClose: {
    position: 'absolute',
    right: 0,
    top: 0,
    marginTop: '20rem',
    marginRight: '20rem',
  },
  userIcon: {
    width: '62rem',
    height: '62rem',
    borderRadius: 120 / 2,
  },
  iconStyle: {
    width: '18rem',
    height: '18rem',
  },
});

const mapStateToProps = state => {
  return {
    loginUser: state.users.loginUser,
    loginUserType: state.users.loginUserType,
    selectedDrawerItem: state.users.selectedDrawerItem,
  };
};

export default connect(
  mapStateToProps,
  actions,
)(CustomDrawerContentComponent);
