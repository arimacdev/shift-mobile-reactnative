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
const entireScreenWidth = Dimensions.get('window').width;
const entireScreenHeight = Dimensions.get('window').height;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import icons from '../assest/icons/icons';

class EmptyListView extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {}

  render() {
    return (
      <View style={styles.listEmptyContainer}>
        <Image
          style={styles.emptyIcon}
          source={icons.emptyResult}
          resizeMode={'contain'}
        />
        <Text style={styles.noResultText}>
          No data found
        </Text>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  listEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: entireScreenHeight * 0.2,
    alignSelf: 'center',
  },
  emptyIcon: {
    width: '100rem',
    height: '100rem',
  },
  noResultText: {
    fontSize: '15rem',
    color: colors.colorLightSlateGrey,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
    marginTop: '15rem',
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(EmptyListView);
