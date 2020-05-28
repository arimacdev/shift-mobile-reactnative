import React, {Component} from 'react';
import {
  View,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';

class GroupTaskNotesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      note: '',
    };
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let note = params.note;
    this.setState({note: note});
  }

  onNotesChange(text) {
    this.setState({note: text});
  }

  updateNote(userName, userID) {
    const {navigation} = this.props;
    let note = this.state.note;
    navigation.state.params.onUpdateNote(note);
    navigation.goBack();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={[styles.taskFieldView, {height: 160}]}>
          <TextInput
            style={[
              styles.textInput,
              {width: '95%', textAlignVertical: 'top', height: 150},
            ]}
            placeholder={'Notes'}
            value={this.state.note}
            multiline={true}
            onChangeText={text => this.onNotesChange(text)}
          />
        </View>
        <TouchableOpacity
          style={styles.bottomContainer}
          onPress={() => this.updateNote()}>
          <View style={styles.button}>
            <Image
              style={[styles.bottomBarIcon, {marginRight: 15, marginLeft: 10}]}
              source={icons.taskWhite}
              resizeMode={'contain'}
            />
            <View style={{flex: 1}}>
              <Text style={styles.buttonText}>Update Note</Text>
            </View>

            <Image
              style={[styles.addIcon, {marginRight: 10}]}
              source={icons.add}
              resizeMode={'contain'}
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    marginTop: '10rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '200rem',
    marginHorizontal: '20rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Black',
    textAlign: 'left',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
    marginTop: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonText: {
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    fontWeight: 'bold',
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: 15,
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(GroupTaskNotesScreen);
