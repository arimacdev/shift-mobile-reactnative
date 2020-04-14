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
import Tasks from './TasksTabScreen';
import Projects from '../Projects/ProjectsDetailsScreen';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

const initialLayout = {width: entireScreenWidth};

class TasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {key: 'tasks', title: 'Tasks'},
        {key: 'board', title: 'Board'},
        {key: 'prople', title: 'People'},
        {key: 'projects', title: 'Projects'},
      ],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
  }

  renderTabBar(props) {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicatorStyle}
        style={styles.tabBarStyle}
        tabStyle={{width: 120}}
        scrollEnabled={true}
        labelStyle={{fontWeight:'bold'}}
        activeColor={colors.darkBlue}
        inactiveColor={'gray'}
      />
    );
  }

  renderScene(route) {
    const {navigation: {state: {params}}} = this.props;
    let projectId = params.projDetails.projectId;
    switch (route.route.key) {
      case 'tasks':
        return <Tasks selectedProjectID={projectId}/>;
      case 'projects':
        return <Projects selectedProjectID={projectId}/>;
    }
  }

  render() {
    return (
      <TabView
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
  tabBarStyle:{
    backgroundColor: 'white',
    height: '60rem',
    alignItems: 'center',
  }
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(TasksScreen);
