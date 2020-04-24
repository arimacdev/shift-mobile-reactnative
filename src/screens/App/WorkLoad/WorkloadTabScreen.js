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
import Tasks from './WorkloadTabTasksScreen';
import Projects from '../Projects/ProjectsDetailsScreen';
import PeopleScreen from '../People/PeopleScreen';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import EStyleSheet from 'react-native-extended-stylesheet';
import Header from '../../../components/Header';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {MenuProvider} from 'react-native-popup-menu';

const initialLayout = {width: entireScreenWidth};
const menuItems = [
  {value: 0, text: 'Due on', color: colors.lightRed},
  {value: 1, text: 'This week', color: colors.lightGreen},
];
class WorkloadTabScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {key: 'tasks', title: 'Tasks'},
        {key: 'graphs', title: 'Graphs'},
      ],
      from:'all',
      to:'all'
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
        labelStyle={{fontWeight: 'bold'}}
        activeColor={colors.darkBlue}
        inactiveColor={'gray'}
      />
    );
  }

  renderScene(route) {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let userId = params.workloadTaskDetails.userId;
    const isActive =
      this.state.routes.indexOf(route.route) === this.state.index;
    switch (route.route.key) {
      case 'tasks':
        return (
          <Tasks
            selectedUserId={userId}
            navigation={this.props.navigation}
            isActive={isActive}
            from={this.state.from}
            to={this.state.to}
          />
        );
      case 'graphs':
        return (
          <Projects
            selectedProjectID={userId}
            navigation={this.props.navigation}
            isActive={isActive}
          />
        );
    }
  }

  onMenuItemChange(item) {
    switch (item.value) {
      case 0:
        this.setState({from:'2020-03-30T23:59:00', to:'2020-04-30T23:59:00'})
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <MenuProvider>
        <View style={{flex: 1}}>
          <Header
            isWorkloadFilter
            navigation={this.props.navigation}
            title={
              this.props.navigation.state.params
                ? this.props.navigation.state.params.workloadTaskDetails
                    .firstName +
                  ' ' +
                  this.props.navigation.state.params.workloadTaskDetails
                    .lastName
                : ''
            }
            onPress={() => this.props.navigation.goBack()}
            menuItems={menuItems}
            onMenuItemChange={item => this.onMenuItemChange(item)}
          />
          <TabView
            lazy
            // style={{flex: 1}}
            navigationState={{
              index: this.state.index,
              routes: this.state.routes,
            }}
            renderScene={route => this.renderScene(route)}
            onIndexChange={index => this.setState({index})}
            initialLayout={initialLayout}
            renderTabBar={props => this.renderTabBar(props)}
          />
        </View>
      </MenuProvider>
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
)(WorkloadTabScreen);
