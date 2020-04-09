import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Text, TouchableOpacity,ScrollView} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import {
  ScrollableTabView,
  DefaultTabBar,
  ScrollableTabBar,
} from '@valdio/react-native-scrollable-tabview';
import Board from '../../App/Tasks/BordTabScreen';

class TasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  render() {
    return (
      <ScrollableTabView
      tabBarTextStyle={{width:55}}
      tabBarUnderlineStyle={{width:55, marginLeft:15}}
        renderTabBar={() => <ScrollableTabBar/>}
        ref={tabView => {
          this.tabView = tabView;
        }}>
          <Board tabLabel="Tasks"/>
        <ScrollView tabLabel="Board" >
          <View>
            <Text>TwoTwoTwoTwoTwoTwo</Text>
          </View>
        </ScrollView>
        <ScrollView tabLabel="People" >
          <View>
            <Text>TwoTwoTwoTwoTwoTwo</Text>
          </View>
        </ScrollView>
        <ScrollView tabLabel="Projects" >
          <View>
            <Text>Two</Text>
          </View>
        </ScrollView>
        <ScrollView tabLabel="Filter" >
          <View>
            <Text>Two</Text>
          </View>
        </ScrollView>
        {/* <TouchableOpacity
          tabLabel="Back"
          onPress={() => this.tabView.goToPage(0)}>
          <Text>Lets go back!</Text>
        </TouchableOpacity> */}
      </ScrollableTabView>
    );
  }
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: colors.pageBackGroundColor,
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(TasksScreen);
