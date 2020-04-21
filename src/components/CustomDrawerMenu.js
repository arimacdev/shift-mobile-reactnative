import React, {Component} from 'react';
import {
  View,
  Dimensions,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {DrawerNavigatorItems} from 'react-navigation-drawer';
import {Button, Text, Icon} from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import colors from '../config/colors';
import NavigationService from '../services/NavigationService';
import * as actions from '../redux/actions';
import FadeIn from 'react-native-fade-in-image';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

const CustomDrawerContentComponent = props => (
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
                style={{width: 64, height: 64, borderRadius: 64 / 2}}
              />
            </FadeIn>
          ) : (
            <Image
              style={{width: 64, height: 64, borderRadius: 64 / 2}}
              source={require('../asserts/img/defult_user.png')}
            />
          )}
        </View>
        <View style={styles.headerRight}>
          <View style={{}}>
            <Text style={styles.textName}>ARIMAC</Text>
          </View>
          <View style={{}}>
            <Text style={styles.textNameUser}>
              {props.loginUser.firstName ? ` ${props.loginUser.firstName}` : ''}
              {props.loginUser.lastName ? ` ${props.loginUser.lastName}` : ''}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View
        style={{
          borderBottomColor: '#252677',
          borderBottomWidth: 1,
        }}
      />
      <DrawerNavigatorItems {...props} />
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          props.logoutUser(true);
        }}
      />
    </SafeAreaView>
  </ScrollView>
);

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
    opacity: 0.5,
    color: '#ffffff',
    fontFamily: 'CircularStd-Medium',
    fontSize: 14.5,
    fontWeight: 'bold',
    marginLeft: 34,
  },
  logoutButton: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    marginTop: 10,
  },
  iconBack: {
    fontSize: '32rem',
    color: colors.yellow,
    fontWeight: '800',
  },
});

const mapStateToProps = state => {
  return {
    loginUser: state.users.loginUser,
  };
};

export default connect(
  mapStateToProps,
  actions,
)(CustomDrawerContentComponent);
