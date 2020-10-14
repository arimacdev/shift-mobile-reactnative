import React, {Component} from 'react';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import Tasks from './TasksTabScreen';
import Projects from '../Projects/ProjectsDetailsScreen';
import PeopleScreen from '../People/PeopleScreen';
import FilesScreen from '../Files/ProjectFilesScreen';
import Board from '../Board/Board';
import Meetings from '../Meetings/MeetingViewScreen';
import {TabView, TabBar, ScrollPager} from 'react-native-tab-view';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {MenuProvider} from 'react-native-popup-menu';

const initialLayout = {width: entireScreenWidth};

class TasksScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {key: 'tasks', title: 'Tasks'},
        {key: 'board', title: 'Board'},
        {key: 'people', title: 'People'},
        {key: 'projects', title: 'Project'},
        {key: 'files', title: 'Files'},
        {key: 'meetings', title: 'Meetings'},
      ],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  renderTabBar(props) {
    return (
      <TabBar
        {...props}
        indicatorStyle={styles.indicatorStyle}
        style={styles.tabBarStyle}
        tabStyle={{width: 120}}
        scrollEnabled={true}
        labelStyle={({fontWeight: 'bold'}, {fontFamily: 'CircularStd-Medium'})}
        activeColor={colors.darkBlue}
        inactiveColor={'gray'}
        getLabelText={({route}) => route.title}
      />
    );
  }

  renderScene(route) {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let projectId = params.projDetails.projectId;
    const isActive =
      this.state.routes.indexOf(route.route) === this.state.index;
    switch (route.route.key) {
      case 'tasks':
        return (
          <Tasks
            selectedProjectID={projectId}
            projDetails={params.projDetails}
            navigation={this.props.navigation}
            isActive={isActive}
          />
        );
      case 'projects':
        return (
          <Projects
            selectedProjectID={projectId}
            navigation={this.props.navigation}
            isActive={isActive}
          />
        );
      case 'people':
        return (
          <PeopleScreen
            selectedProjectID={projectId}
            navigation={this.props.navigation}
            isActive={isActive}
          />
        );
      case 'files':
        return (
          <FilesScreen
            selectedProjectID={projectId}
            navigation={this.props.navigation}
            isActive={isActive}
          />
        );
      case 'board':
        return (
          <Board
            selectedProjectID={projectId}
            projDetails={params.projDetails}
            navigation={this.props.navigation}
            isActive={isActive}
          />
        );
      case 'meetings':
        return (
          <Meetings
            selectedProjectID={projectId}
            navigation={this.props.navigation}
            isActive={isActive}
          />
        );
    }
  }

  render() {
    return (
      <MenuProvider style={{flex: 1}}>
        <TabView
          lazy
          navigationState={{index: this.state.index, routes: this.state.routes}}
          renderScene={route => this.renderScene(route)}
          onIndexChange={index => this.setState({index})}
          initialLayout={initialLayout}
          renderTabBar={props => this.renderTabBar(props)}
          // renderPager={props => <ScrollPager { ...props }/>}
        />
      </MenuProvider>
    );
  }
}

const styles = EStyleSheet.create({
  indicatorStyle: {
    backgroundColor: colors.darkBlue,
    height: '4rem',
    width: '65rem',
    marginLeft: '23rem',
  },
  tabBarStyle: {
    backgroundColor: 'white',
    height: '60rem',
    alignItems: 'center',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(TasksScreen);
