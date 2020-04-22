import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import Tasks from './Tasks';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

const initialLayout = {width: entireScreenWidth};

class TasksTabScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {key: 'tasks', title: 'Tasks'},
        {key: 'people', title: 'People'},
        {key: 'settings', title: 'Settings'},
      ],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}


  renderScene(route) {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let taskGroupId = params.taskDetails.taskGroupId;
    const isActive =
      this.state.routes.indexOf(route.route) === this.state.index;
    switch (route.route.key) {
      case 'tasks':
        return (
          <Tasks
            selectedTaskGroupId={taskGroupId}
            navigation={this.props.navigation}
            isActive={isActive}
          />
        );
    case 'settings':
        return (
            <View>
    
            </View>
        );  
    }
  }

  renderTabBar(props) {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicatorStyle}
        style={styles.tabBarStyle}
        tabStyle={{width: 120}}
        scrollEnabled={true}
        labelStyle={{fontWeight: 'bold'},{fontFamily: 'CircularStd-Medium'}}
        activeColor={colors.darkBlue}
        inactiveColor={'gray'}
      />
    );
  }

  render() {
    return (
      <TabView
        lazy
        navigationState={{index: this.state.index, routes: this.state.routes}}
        renderScene={route => this.renderScene(route)}
        onIndexChange={index => this.setState({index})}
        initialLayout={initialLayout}
        renderTabBar={props => this.renderTabBar(props)}
      />
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: colors.pageBackGroundColor,
  },
  indicatorStyle: {
    backgroundColor: colors.darkBlue,
    height: '4rem',
    width: '65rem',
    marginLeft: '23rem',
  },
  tabBarStyle: {
    backgroundColor: 'white',
    height: '60rem',
    alignItems: 'flex-start',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(TasksTabScreen);
