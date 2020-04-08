import React, { Component } from 'react';
import {StyleSheet, View,FlatList,Text } from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors'


class TasksScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentDidMount() {
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
      backgroundColor : colors.pageBackGroundColor
    },
  });

const mapStateToProps = state => {
    return {
    }
};
export default connect(mapStateToProps, actions)(TasksScreen);