import React, {Component} from 'react';
import {View, Text, TextInput, FlatList, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import EmptyListView from '../../../components/EmptyListView';

const initialLayout = {width: entireScreenWidth};

class MeetingScreen extends Component {
  taskNameTextInput = [];
  constructor(props) {
    super(props);
    this.state = {
      textInputArray: [
        {id: 1, name: 'Date', placeHolder: ''},
        {
          id: 2,
          name: 'Topic for the meeting',
          placeHolder: 'Enter Topic for the meeting',
        },
        {id: 3, name: 'Schedule Time of Start', placeHolder: ''},
      ],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  onChangeText(text) {}

  renderView(item) {
    return (
      <View>
        {/* <Text style={styles.fieldName}>{item.name}</Text> */}
        <View style={styles.textInputFieldView}>
          <TextInput
            ref={input => {
              this.taskNameTextInput = input;
            }}
            style={styles.textInput}
            placeholder={item.placeHolder}
            multiline={true}
            value={''}
            onChangeText={text => this.onChangeText(text)}
            maxLength={100}
            multiline={true}
          />
        </View>
      </View>
    );
  }

  render() {
    let textInputArray = this.state.textInputArray;
    return (
      <View style={styles.container}>
        <FlatList
          data={textInputArray}
          renderItem={({item}) => this.renderView(item)}
          keyExtractor={item => item.id}
          ListEmptyComponent={<EmptyListView />}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  fieldName:{
    marginHorizontal: '20rem',
    marginTop:'10rem'
  },
  textInputFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    width: '100%',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MeetingScreen);
