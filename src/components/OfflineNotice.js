
import React, { Component } from 'react';
import { View, Text, Dimensions,Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import NetInfo from "@react-native-community/netinfo";
import colors from '../config/colors';
import NoInternetModal from '../components/NoInternetModal';

const { width,height } = Dimensions.get('window');
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

function MiniOfflineSign() {
    return (
        <View style={styles.offlineContainer} pointerEvents={'box-only'}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
    );
}

class OfflineNotice extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isConnected: true
        };
        //initial network state
        
    }

    componentDidMount() {
        const unsubscribe = NetInfo.addEventListener(state => {
            //console.log("Connection type", state.type);
            //console.log("Is connected?", state.isConnected);
            this.handleConnectivityChange(state.isConnected)
        });
    }

    componentWillUnmount() {
        unsubscribe();
    }

    handleConnectivityChange = isConnected => {
        if (isConnected) {
            this.setState({ isConnected });
        } else {
            this.setState({ isConnected });
        }
    };

    render() {
        if (!this.state.isConnected) {
            return <NoInternetModal
            showModal={!this.state.isConnected}
          />;
        }
        return null;
    }
}

const styles = EStyleSheet.create({
    offlineContainer: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        height: height,
        elevation: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width,
        position: 'absolute',
        top: 0,
        zIndex: 1
    },
    offlineText: {
         color: colors.primary, 
         fontFamily: 'HelveticaNeueMedium',
         marginTop : 5
         //backgroundColor : 'red',
         //padding : 10,
        // borderRadius :  5
    },
    image: {
        width: '90rem',
        height: '90rem',
        resizeMode: 'contain',
    }
});

export { OfflineNotice };
