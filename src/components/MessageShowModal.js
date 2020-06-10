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
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Modal from 'react-native-modal';
import icons from '../asserts/icons/icons';

class MessageShowModal extends Component {
  constructor(props) {
    super(props);
    this.state = {showMessageModal: false};
  }

  componentDidMount() {
    if (this.props.showMessageModal) {
      this.setState({showMessageModal: true});
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.showMessageModal !== this.props.showMessageModal &&
      this.props.showMessageModal
    ) {
      this.setState({showMessageModal: true});
    }
  }

  onCloseTaskModal() {
    this.setState({showMessageModal: false});
  }

  onPress() {
    this.props.onPress();
    this.onCloseTaskModal();
  }

  onCanclePress() {
    this.props.onPressCancel();
    this.onCloseTaskModal();
  }

  render() {
    let details = this.props.details;
    let buttons = this.props.details.buttons;
    return (
      <Modal
        isVisible={this.state.showMessageModal}
        style={styles.modalStyle}
        backdropTransitionOutTiming={0}>
        <View style={styles.modalMainView}>
          <TouchableOpacity
            style={styles.crossView}
            onPress={() => this.onCanclePress()}>
            <Image
              style={styles.crossIcon}
              source={icons.cross}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.imageContainer}>
            <Image
              style={styles.iconStyle}
              source={icons.alertRed}
              resizeMode="contain"
            />
            <Text style={styles.modalHeadderText}>{details.title}</Text>
            <Text style={styles.textDescription}>{details.description}</Text>
          </View>
          {details.type == 'confirm' && (
            <View style={styles.ButtonViewStyle}>
              <TouchableOpacity
                style={[styles.updateStyle]}
                onPress={() => this.onPress()}>
                <Text style={styles.updateTextStyle}>{buttons.positive}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelStyle}
                onPress={() => this.onCanclePress()}>
                <Text style={styles.cancelTextStyle}>{buttons.negative}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalStyle: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalMainView: {
    backgroundColor: colors.white,
    borderTopStartRadius: '5rem',
    borderTopEndRadius: '5rem',
  },
  modalHeaderView: {
    flexDirection: 'row',
    marginHorizontal: '20rem',
    marginVertical: '20rem',
    // alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeadderText: {
    fontSize: '16rem',
    fontFamily: 'CircularStd-Bold',
    marginHorizontal: '20rem',
    textAlign: 'center',
  },
  textDescription: {
    marginTop: '10rem',
    marginBottom: '20rem',
    fontSize: '12rem',
    fontFamily: 'CircularStd-Book',
    marginHorizontal: '40rem',
    color: colors.gray,
    textAlign: 'center',
  },
  ButtonViewStyle: {
    flexDirection: 'row',
    marginTop: '5rem',
    marginBottom: '20rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '20rem',
  },
  updateStyle: {
    flex: 1,
    height: '45rem',
    backgroundColor: colors.lightRed,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
  },
  updateTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
  },
  cancelStyle: {
    flex: 1,
    height: '45rem',
    marginLeft: '10rem',
    backgroundColor: colors.lightGreen,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    justifyContent: 'center',
  },
  cancelTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
    fontFamily: 'CircularStd-Medium',
  },
  iconBorderStyle: {
    borderRadius: '10rem',
    borderColor: colors.gray,
    borderWidth: '0.5rem',
  },
  iconStyle: {
    width: '42rem',
    height: '42rem',
    marginTop: '12rem',
    marginBottom: '10rem',
  },
  crossView: {
    alignSelf: 'flex-end',
  },
  crossIcon: {
    width: '12rem',
    height: '12rem',
    marginTop: '8rem',
    marginRight: '8rem',
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MessageShowModal);
