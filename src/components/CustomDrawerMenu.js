import React, {useEffect, useState} from 'react';
import {
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
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
      }
    } catch (error) {
      let title = '';
      let msg = 'Logout error';
      let config = {showAlert: true, alertTitle: title, alertMsg: msg};
      props.showMessagePopup(config);
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
            let title = '';
            let msg = 'One signal notification unsubscribe failed';
            let config = {showAlert: true, alertTitle: title, alertMsg: msg};
            props.showMessagePopup(config);
          });
      }
    });
  };

  return (
    <ScrollView>
      <SafeAreaView
        style={styles.container}
        forceInset={{top: 'always', horizontal: 'never'}}>
        <TouchableOpacity
          style={styles.header}
          onPress={() =>
            props.navigation.navigate('ViewProfileScreen', {
              profile: props.loginUser,
            })
          }>
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
              source={require('../asserts/img/drawer_close.png')}
              style={{
                width: EStyleSheet.value('18rem'),
                height: EStyleSheet.value('18rem'),
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
        <View
          style={{
            borderBottomColor: '#252677',
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
              source={require('../asserts/img/drawer_projects.png')}
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
              source={require('../asserts/img/drawer_tasks.png')}
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
              source={require('../asserts/img/drawer_workload.png')}
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
              source={require('../asserts/img/drawer_users.png')}
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
            source={require('../asserts/img/logout.png')}
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
  thumbnail: {
    width: '71rem',
    height: '71rem',
    borderRadius: '50rem',
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
  iconBack: {
    fontSize: '32rem',
    color: colors.yellow,
    fontWeight: '800',
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
