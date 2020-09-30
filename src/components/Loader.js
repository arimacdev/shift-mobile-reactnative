import {StyleSheet, View} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import colors from '../config/colors';
import {WaveIndicator} from 'react-native-indicators';

export default class Loader extends React.Component {
  static propTypes = {
    hideBackground: PropTypes.bool,
  };

  static defaultProps = {
    hideBackground: false,
  };

  state = {
    hideBackground: this.props.hideBackground,
  };

  render() {
    const backgroundStyle = this.state.hideBackground
      ? 'transparent'
      : 'rgba(0,0,0,0.3)';

    return (
      <View style={[styles.container, {backgroundColor: backgroundStyle}]}>
        <View
          style={{
            flex: 0.1,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <WaveIndicator color={colors.primary} size={80} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: 10,
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});
