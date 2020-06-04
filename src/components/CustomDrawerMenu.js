import React, { Component } from 'react';
import {
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
  Alert
} from 'react-native';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { Button, Text, Icon } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import colors from '../config/colors';
import NavigationService from '../services/NavigationService';
import * as actions from '../redux/actions';
import axios from 'axios';
import APIServices from '../services/APIServices';
import FadeIn from 'react-native-fade-in-image';
import icons from '../assest/icons/icons';
import { revoke } from 'react-native-app-auth';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const CustomDrawerContentComponent = props => (
  <ScrollView>
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: 'always', horizontal: 'never' }}>
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
                source={{ uri: props.loginUser.profileImage }}
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
              {props.loginUser.firstName ? `${props.loginUser.firstName}` : ''}
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
          {props.selectedDrawerItem == 'projects' ? (
            <Image
              tintColor="#FFFFFF"
              source={require('../asserts/img/drawer_projects.png')}
              style={{
                width: EStyleSheet.value('25rem'),
                height: EStyleSheet.value('23rem'),
              }}
            />
          ) : (
              <Image
                tintColor="#4d4f85"
                source={require('../asserts/img/drawer_projects.png')}
                style={{
                  width: EStyleSheet.value('25rem'),
                  height: EStyleSheet.value('23rem'),
                }}
              />
            )}
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
          {props.selectedDrawerItem == 'tasks' ? (
            <Image
              tintColor="#FFFFFF"
              source={require('../asserts/img/drawer_projects.png')}
              style={{
                width: EStyleSheet.value('25rem'),
                height: EStyleSheet.value('23rem'),
              }}
            />
          ) : (
              <Image
                tintColor="#4d4f85"
                source={require('../asserts/img/drawer_tasks.png')}
                style={{
                  width: EStyleSheet.value('25rem'),
                  height: EStyleSheet.value('23rem'),
                }}
              />
            )}
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
          {props.selectedDrawerItem == 'workload' ? (
            <Image
              tintColor="#FFFFFF"
              source={require('../asserts/img/drawer_workload.png')}
              style={{
                width: EStyleSheet.value('25rem'),
                height: EStyleSheet.value('23rem'),
              }}
            />
          ) : (
              <Image
                tintColor="#4d4f85"
                source={require('../asserts/img/drawer_workload.png')}
                style={{
                  width: EStyleSheet.value('25rem'),
                  height: EStyleSheet.value('23rem'),
                }}
              />
            )}
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
          {props.selectedDrawerItem == 'users' ? (
            <Image
              tintColor="#FFFFFF"
              source={require('../asserts/img/drawer_users.png')}
              style={{
                width: EStyleSheet.value('25rem'),
                height: EStyleSheet.value('23rem'),
              }}
            />
          ) : (
              <Image
                tintColor="#4d4f85"
                source={require('../asserts/img/drawer_users.png')}
                style={{
                  width: EStyleSheet.value('25rem'),
                  height: EStyleSheet.value('23rem'),
                }}
              />
            )}

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
        // onPress={() => {
        //   // NavigationService.navigate('UsersScreen');
        //   props.drawerItemSelect('users');
        // }}>
        // onPress={() => logOut(props)}>
        onPress={() => confirmLogout(props)}>
        {props.selectedDrawerItem == 'users' ? (
          <Image
            tintColor="#FFFFFF"
            source={require('../asserts/img/drawer_users.png')}
            style={{
              width: EStyleSheet.value('25rem'),
              height: EStyleSheet.value('23rem'),
            }}
          />
        ) : (
            <Image
              tintColor="#4d4f85"
              source={require('../asserts/img/drawer_users.png')}
              style={{
                width: EStyleSheet.value('25rem'),
                height: EStyleSheet.value('23rem'),
              }}
            />
          )}

        <Text
          style={[
            props.selectedDrawerItem == 'users'
              ? styles.textSelected
              : styles.text,
          ]}>
          Logout
          </Text>
      </TouchableOpacity>

    </SafeAreaView>
  </ScrollView>
);

const confirmLogout = (props) => {
  props.navigation.closeDrawer()
  Alert.alert(
    "Log Out",
    "Are you sure?",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "Logout", onPress: () => logOut(props) }
    ],
    { cancelable: false }
  )
}

const logOut = async () => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  try {

    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      client_id:'pmtool-frontend',
      refresh_token:accessToken
    };
  
    let response = await axios({
      url: 'https://pmtool.devops.arimac.xyz/auth/realms/pm-tool/protocol/openid-connect/logout',
      method: 'GET',
      headers:headers
    });
    if (response.status === 200) {
      AsyncStorage.clear();
      NavigationService.navigate('ConfigurationScreen');
    }
  } catch (error) {
  }

  // try {
  //   let result = await APIServices.logOut();
  //   if (result.status == 200) {
  //     console.log('filesData 22', result);
  //   } else {
  //   }
  // } catch (error) {
  // }
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
    color: '#ffffff',
    fontFamily: 'CircularStd-Bold',
    fontSize: 20,
    fontWeight: '400',
  },
  textNameUser: {
    color: '#ffffff',
    fontFamily: 'CircularStd-Medium',
    fontSize: 15,
    fontWeight: '400',
  },
  textEmail: {
    opacity: 0.75,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: 'CircularStd-Medium',
    fontSize: '15rem',
    fontWeight: Platform.OS === 'ios' ? '500' : '400',
  },
  text: {
    //opacity: 0.5,
    color: '#4d4f85',
    fontFamily: 'CircularStd-Book',
    fontSize: 19,
    fontWeight: '400',
    marginLeft: 34,
  },
  textSelected: {
    //opacity: 0.5,
    color: '#ffffff',
    fontFamily: 'CircularStd-Medium',
    fontSize: 19,
    fontWeight: 'bold',
    marginLeft: 34,
  },
  custtomButton: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginTop: 15,
  },
  custtomButton1: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginTop: '20rem',
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
