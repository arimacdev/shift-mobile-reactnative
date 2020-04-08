import React, { Component } from 'react';
import {StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../redux/actions';
import colors from '../../config/colors'
import strings from '../../config/strings'

class LoginScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            userName : '', 
            password : '',
        };
        
    }
    
    componentDidMount() {    
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    render() {
        let userName = this.state.userName;
        let password = this.state.password;
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
      backgroundColor : 'yellow',
      justifyContent: "center",
      alignItems: "center"
    },
  });

const mapStateToProps = state => {
    return {
    };
};
export default connect(mapStateToProps, actions)(LoginScreen);