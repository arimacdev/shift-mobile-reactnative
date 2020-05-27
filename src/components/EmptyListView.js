import React, {Component} from 'react';
import {
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../redux/actions';
import colors from '../config/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
EStyleSheet.build({$rem: entireScreenWidth / 380});
const entireScreenWidth = Dimensions.get('window').width;
const entireScreenHeight = Dimensions.get('window').height;
import icons from '../assest/icons/icons';

class EmptyListView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    
  }


  render() {
    return (
        <View style={styles.listEmptyContainer}>
        <Text>No results found. Give another try</Text>
    </View>
    );
  }
}

const styles = EStyleSheet.create({
    listEmptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: entireScreenHeight * 0.2,
        alignSelf: 'center'
    }  
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(EmptyListView);
