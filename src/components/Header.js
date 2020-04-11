import React, { Component } from 'react';
import { View, Text, Dimensions, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Icon } from 'native-base';
import { connect } from 'react-redux';
import colors from '../config/colors';
import * as actions from '../redux/actions';

const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });


class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        const { onPress, isHome, title,style = {}, search=false } = this.props;
        // console.log('PPPP',this.props)
        return (
            <SafeAreaView style={{ backgroundColor: colors.primary }}>
                <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
                {
                    isHome ?
                        <View style={styles.header}>
                            <View style={styles.menuIconContatiner}>
                                <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
                                    <Icon name={'menu'} style={styles.icon} type={'SimpleLineIcons'} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.leftContainer}>
                                <View style={styles.leftContainerFull}>
                                        <Text style={styles.title}>{title}</Text>
                                    </View>
                                </View>
                            <View style={styles.rightContainer} >
                                <TouchableOpacity style={{alignItems:'flex-end'}} onPress={() => this.props.navigation.navigate('ProjectsSearchScreen')}>
                                    <Icon name={'ios-search'} style={[styles.icon,{fontSize: 25}]} type={'Ionicons'} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{alignItems:'flex-end',marginLeft:40}} onPress={() => this.props.navigation.navigate('CreateNewProjectScreen')}>
                                    <Icon name={'ios-add'} style={[styles.icon,{fontSize: 35}]} type={'Ionicons'} />
                                </TouchableOpacity>
                            </View>
                            
                        </View>

                        :
                        <View style={[style, styles.header]}>
                            <View style={styles.menuIconContatiner}>
                                <TouchableOpacity activeOpacity={0.6} onPress={onPress}>
                                <Icon name={search ? 'ios-close' : 'ios-arrow-round-back'} style={styles.iconBack} type={'Ionicons'} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.leftContainerFull}>
                                <Text style={styles.title}>{title}</Text>
                            </View>
                        </View>
                }
            </SafeAreaView>
        );
    }
}


const styles = EStyleSheet.create({
    container: {
        backgroundColor: colors.primary,
    },
    header: {
        height: '56rem',
        backgroundColor: colors.primary,
        flexDirection: 'row',
        padding: '16rem',
        alignItems: 'center',
    },
    menuIconContatiner: {
        flex: 0.1,
        marginTop: Platform.OS === 'ios' ? '-4rem' : '0rem'
    },
    leftContainer: {
        flex: 0.4,
        alignItems: 'flex-start'
    },
    leftContainerFull: {
        flex: 0.9,
        alignItems: 'flex-start'
    },
    rightContainer: {
        flex: 0.5,
        justifyContent: 'flex-end',
        alignItems: 'center',
        flexDirection: 'row',
    },
    nameContainer: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: '20rem',
        color: colors.white,
        fontFamily: 'HelveticaNeueMedium',
        fontWeight: '500',
        textAlign: 'left'
    },
    textName: {
        fontSize: '13rem',
        color: colors.white,
        marginRight: '4rem',
        fontFamily: 'HelveticaNeueMedium',
        fontWeight: Platform.OS === 'ios' ? '500' : '400',
    },
    thumbnail: {
        width: '28rem',
        height: '28rem'
    },
    drawerToggle: {
        paddingRight: '15rem'
    },
    headerLogo: {
        width: '55rem',
        height: '32rem'
    },
    textWelcome: {
        fontSize: '9rem',
        color: colors.white,
        marginRight: '4rem',
        opacity: 0.69,
        fontFamily: 'HelveticaNeueMedium',
        fontWeight: Platform.OS === 'ios' ? '500' : '400',
    },
    icon: {
        fontSize: '20rem',
        color: colors.white,
        fontWeight: '800',
    },
    iconBack: {
        fontSize: '32rem',
        color: colors.white,
        fontWeight: '800',
    }
});

const mapStateToProps = state => {
    return {
    };
};

export default connect(mapStateToProps, actions)(Header);
