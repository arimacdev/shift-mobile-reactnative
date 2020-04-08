import React, { Component } from 'react';
import {
    View,
    Dimensions,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    Platform
} from 'react-native';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { Button, Text, Icon } from 'native-base';
import EStyleSheet from 'react-native-extended-stylesheet';
import AsyncStorage from '@react-native-community/async-storage';
import { connect } from 'react-redux';
import colors from '../config/colors';
import NavigationService from '../services/NavigationService';
import * as actions from '../redux/actions';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


const CustomDrawerContentComponent = props => (
    <ScrollView>
        <SafeAreaView
            style={styles.container}
            forceInset={{ top: 'always', horizontal: 'never' }}
        >
            <TouchableOpacity style={styles.header} onPress={() => { NavigationService.navigate('MyAccount'); }}>
                <View style={styles.headerLeft}>
                   
                </View>
                <View style={styles.headerRight}>
                    
                </View>

            </TouchableOpacity>
            <DrawerNavigatorItems {...props} />
            <TouchableOpacity style={styles.logoutButton} onPress={() => { props.logoutUser(true) }}>
            </TouchableOpacity>
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
        alignItems: 'center'
    },
    thumbnail: {
        width: '71rem',
        height: '71rem',
        borderRadius: '50rem'
    },
    headerLeft: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerRight: {
        flex: 2
    },
    textName: {
        color: colors.white,
        fontFamily: 'HelveticaNeueMedium',
        fontSize: '16rem',
        fontWeight: Platform.OS === 'ios' ? '500' : '400',
    },
    textEmail: {
        opacity: 0.75,
        color: 'rgba(255, 255, 255, 0.5)',
        fontFamily: 'HelveticaNeuelight',
        fontSize: '15rem',
        fontWeight: Platform.OS === 'ios' ? '500' : '400',
    },
    text: {
        opacity: 0.5,
        color: '#ffffff',
        fontFamily: 'HelveticaNeueMedium',
        fontSize: 14.5, 
        fontWeight: 'bold',
        marginLeft: 34
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
    }
});

const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, actions)(CustomDrawerContentComponent);
