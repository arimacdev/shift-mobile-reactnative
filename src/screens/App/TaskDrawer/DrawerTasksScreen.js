import React, {Component} from 'react';
import {View, FlatList, Text, Dimensions, Image, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import FadeIn from 'react-native-fade-in-image';
import Loader from '../../../components/Loader';
import Header from '../../../components/Header';
import { NavigationEvents } from 'react-navigation';

class DrawerTasksScreen extends Component {
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
      <View style={styles.backgroundImage}>
        
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
    //  backgroundColor: colors.pageBackGroundColor,
  },
  
});

const mapStateToProps = state => {
  return {
  };
};
export default connect(
  mapStateToProps,
  actions,
)(DrawerTasksScreen);
