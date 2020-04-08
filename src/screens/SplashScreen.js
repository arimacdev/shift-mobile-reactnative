import React, { Component } from 'react';
import {StyleSheet, View, } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import AsyncStorage from '@react-native-community/async-storage';
import colors from '../config/colors'
import strings from '../config/strings'

class SplashScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {   
        };
        
    }
    componentDidMount() {
        setTimeout(() => {
            this.checkUserStatus();  
        }, 1500);
    }

    async checkUserStatus() { 
        AsyncStorage.getItem('userLoggedIn').then(userLoggedIn => {
            if (userLoggedIn === 'true') {
                //this.props.navigation.navigate('Projects');
                this.props.navigation.navigate('App');
            }else{
                this.props.navigation.navigate('App');
            }
        }); 
    }
    
    render() {
        return (
            <View
                style={styles.backgroundImage}>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    backgroundImage: {
      flex: 1,
      backgroundColor : 'red',
      justifyContent: "center",
      alignItems: "center"
    },
  });

const mapStateToProps = state => {
    return {
    };
};
export default connect(mapStateToProps, actions)(SplashScreen);