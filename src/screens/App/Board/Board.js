import React, {Component} from 'react';
import {View, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ButtonGroup} from 'react-native-elements';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import DefaultBoard from './DefaultBoard';
import OtherBoard from './OtherBoard';
import AsyncStorage from '@react-native-community/async-storage';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      pageView: null,
    };
    this.updateIndex = this.updateIndex.bind(this);
  }

  updateIndex(selectedIndex) {
    this.setState({selectedIndex});
    this.renderPage();
  }

  renderPage() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let projectId = params.projDetails.projectId;
    let projectName = params.projDetails.projectName;
    switch (this.state.selectedIndex) {
      case 0:
        return (
          <DefaultBoard
            selectedProjectID={projectId}
            navigation={this.props.navigation}
            selectedProjectName={projectName}
            //   isActive={isActive}
          />
        );
      case 1:
        return (
          <OtherBoard
            selectedProjectID={projectId}
            navigation={this.props.navigation}
            selectedProjectName={projectName}
            //   isActive={isActive}
          />
        );
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      AsyncStorage.getItem('userID').then(userID => {
        if (userID) {
          // this.fetchData(userID);
        }
      });
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('userID').then(userID => {
      if (userID) {
        // this.fetchData(userID);
      }
    });
  }

  render() {
    const buttons = ['Default Borad', 'Other Borad'];
    const {selectedIndex} = this.state;
    return (
      <View>
        <ButtonGroup
          onPress={this.updateIndex}
          selectedIndex={selectedIndex}
          buttons={buttons}
          containerStyle={
            selectedIndex == 0 ? styles.defaultBoardView : styles.otherBoardView
          }
          selectedButtonStyle={{backgroundColor: '#0bafff'}}
          textStyle={{
            fontFamily: 'CircularStd-Medium',
            fontWeight: 'bold',
            fontSize: 14,
          }}
          disabledTextStyle={{color: '#080848'}}
        />
        {this.renderPage()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  defaultBoardView: {
    height: 60,
    marginTop: '7%',
    marginBottom: '1%',
    marginLeft: '5%',
    marginRight: '5%',
    borderRadius: 10,
    backgroundColor: '#edf0f5',
  },
  otherBoardView: {
    height: 60,
    marginTop: '7%',
    marginBottom: '1%',
    marginLeft: '5%',
    marginRight: '8%',
    borderRadius: '10rem',
    backgroundColor: '#edf0f5',
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(Board);
