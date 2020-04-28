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
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import { NavigationEvents } from 'react-navigation';
const initialLayout = { width: entireScreenWidth };

class OtherBoard extends Component {
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
            <View>
               
                <View >
                    <TouchableOpacity>
                    <View style={styles.button}>
                        {/* <Image
                            style={[styles.bottomBarIcon, { marginRight: 15, marginLeft: 10 }]}
                            source={icons.userWhite}
                            resizeMode={'center'}
                        /> */}
                        <View style={{ flex: 1 }}>
                            <Text style={styles.buttonText}>New Sprint</Text>
                        </View>

                        <Image
                            style={[styles.addIcon, { marginRight: 10 }]}
                            source={icons.addGreen}
                            resizeMode={'center'}
                        />
                    </View>
                </TouchableOpacity>

                <ScrollView style={styles.subContainer}>
                    
                    {/* <FlatList
                        style={styles.flalList}
                        data={this.state.owner}
                        renderItem={({ item }) => this.renderPeopleList(item)}
                        keyExtractor={item => item.projId}
                        // onRefresh={() => this.onRefresh()}
                        // refreshing={isFetching}
                    /> */}
                   
                </ScrollView>

                </View>
                
            </View>

        );
    }
}

const styles = EStyleSheet.create({
button: {
        flexDirection: 'row',
        backgroundColor: colors.lightGreen,
        borderRadius: 5,
        marginTop: '17rem',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '12rem',
        height: '55rem',
        marginHorizontal: '20rem',
    },
    buttonText: {
        fontSize: '12rem',
        color: colors.white,
        lineHeight: '17rem',
        fontFamily: 'HelveticaNeuel',
        fontWeight: 'bold',
    },
    addIcon: {
        width: '28rem',
        height: '28rem',
    },
    subContainer: {
        marginBottom: '65rem'
     },
     flalList : {
        marginTop: '30rem',
        marginBottom: '10rem',
      },
      mainContainer: {
        backgroundColor: colors.projectBgColor,
        borderRadius: 5,
        marginHorizontal: '20rem',
        marginVertical: '7rem',
    },
    userView: {
        backgroundColor: colors.projectBgColor,
        borderRadius: 5,
        height: '60rem',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '12rem',
      },
      userIcon: {
        width: '45rem',
        height: '45rem',
      },
      text: {
        fontSize: '12rem',
        color: colors.userListUserNameColor,
        textAlign: 'center',
        lineHeight: '17rem',
        fontFamily: 'CircularStd-Medium',
        textAlign: 'left',
        marginLeft: '10rem',
        fontWeight: '600'
      },
      subText: {
        fontSize: '10rem',
        color: '#b9b9b9',
        textAlign: 'center',
        lineHeight: '17rem',
        fontFamily: 'CircularStd-Medium',
        textAlign: 'left',
        marginLeft: '10rem',
        fontWeight: '400'
      },
});

const mapStateToProps = state => {
    return {};
};
export default connect(
    mapStateToProps,
    actions,
)(OtherBoard);
