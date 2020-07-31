import React, {Component} from 'react';
import {View, Dimensions, Image} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import colors from '../../../config/colors';

class FilesView extends Component {
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

  updateNote() {
    const {navigation} = this.props;
    let note = this.state.note;
    navigation.state.params.onUpdateNote(note);
    navigation.goBack();
  }

  render() {
    const {filesData} = this.props.navigation.state.params;
    return (
      <View style={styles.container}>
        <View style={[styles.imageViewStyle]}>
          <Image
            style={[styles.imageStyle]}
            source={{uri: filesData.projectFileUrl}}
            resizeMode={'contain'}
          />
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewStyle: {
    flexDirection: 'row',
    height: '100%',
    height: '100%',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(FilesView);
