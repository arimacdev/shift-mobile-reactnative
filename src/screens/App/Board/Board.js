import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import NavigationService from '../../../services/NavigationService';
import APIServices from '../../../services/APIServices';
import EStyleSheet from 'react-native-extended-stylesheet';
import FadeIn from 'react-native-fade-in-image';
import * as Progress from 'react-native-progress';
import { ButtonGroup } from 'react-native-elements';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });
import DefaultBoard from './DefaultBoard';
import OtherBoard from './OtherBoard';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import { NavigationEvents } from 'react-navigation';
const initialLayout = { width: entireScreenWidth };
import {MenuProvider} from 'react-native-popup-menu';

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedIndex: 0,
            pageView: null
        };
        this.updateIndex = this.updateIndex.bind(this)
    }

    updateIndex(selectedIndex) {
        this.setState({ selectedIndex })
        this.renderPage()
    }

    renderPage() {
         const {
            navigation: {
              state: {params},
            },
          } = this.props;
          let projectId = params.projDetails.projectId;
         switch (this.state.selectedIndex) {
            case 0:
              return (
                <DefaultBoard
                  selectedProjectID={projectId}
                  navigation={this.props.navigation}
                //   isActive={isActive}
                />
              );
            case 1:
              return (
                <OtherBoard
                  selectedProjectID={projectId}
                  navigation={this.props.navigation}
                //   isActive={isActive}
                />
              );
          }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.isActive !== this.props.isActive
            && this.props.isActive) {
            AsyncStorage.getItem('userID').then(userID => {
                if (userID) {
                    // this.fetchData(userID);
                }
            });
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('userID').then(userID => {
            if (userID) {
                // this.fetchData(userID);
            }
        });
    }

    render() {
        const buttons = ['Default Borad', 'Other Borad']
        const { selectedIndex } = this.state
        return (
            <MenuProvider>
            <View>
                <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                    containerStyle={{ height: 60, marginTop: '7%', marginBottom: '1%', marginLeft: '5%', marginRight: '5%', borderRadius: 10, backgroundColor: '#edf0f5' }}
                    selectedButtonStyle={{ backgroundColor: '#0bafff' }}
                    textStyle={{fontFamily: 'HelveticaNeuel'}}
                />
                {this.renderPage()}
            </View>
            </MenuProvider>
        );
    }
}

const styles = EStyleSheet.create({
});

const mapStateToProps = state => {
    return {};
};
export default connect(
    mapStateToProps,
    actions,
)(Board);
