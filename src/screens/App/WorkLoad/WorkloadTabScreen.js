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
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const initialLayout = {width: entireScreenWidth};
const menuItems = [
  {value: 0, text: 'Due today', color: colors.dueTodayColor},
  {value: 1, text: 'This Week', color: colors.thisWeekColor},
  {value: 2, text: 'This Month', color: colors.thosMonthColor},
  {value: 3, text: 'Custom', color: colors.customColor},
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
      from: 'all',
      to: 'all',
      date: new Date(),
      isCustom: false,
      mode: 'date',
      fromDate: new Date(),
      toDate: new Date(),
      fromDateOpen: false,
      showPicker:false
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
            date={this.state.date}
            isCustom={this.state.isCustom}
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
        this.setState({
          isCustom: false,
          from: '2020-03-30T23:59:00',
          to: '2020-04-30T23:59:00',
          date: new Date(),
        });
        break;
      case 3:
        this.setState({
          isCustom: true,
          from: 'all',
          to: 'all',
        });
        break;
      default:
        break;
    }
  }

  onCalendarPress(item) {
    this.setState({fromDateOpen: item, showPicker:true});
  }

  onChangeDate(event, selectedDate) {
    let date = new Date(selectedDate);
    let newDate = '';
    let newDateValue = '';

    if (this.state.fromDate) {
      newDate = moment(date).format('YYYY-MM-DD[T]HH:mm:ss');
      newDateValue = moment(date).format('YYYY-MM-DD[T]HH:mm:ss');
    } else {
      newDate = moment(date).format('YYYY-MM-DD[T]HH:mm:ss');
      newDateValue = moment(date).format('YYYY-MM-DD[T]HH:mm:ss');
    }
    if (event.type == 'set') {
      if (this.state.fromDateOpen) {
        this.setState({
          fromDateOpen: false,
          from: newDate,
          selectedDateReminderValue: newDateValue,
          showPicker: true,
          // showTimePicker: false,
          fromDate: new Date(selectedDate),
          // date:new Date()
        });
      } else {
        this.setState({
          to: newDate,
          selectedDateValue: newDateValue,
          showPicker: false,
          // showTimePicker: false,
          toDate: new Date(selectedDate),
          date:new Date()
        });
      }
    }
    // event.dismissed
    // event.set
  }

  renderDatePicker() {
    return (
      <DateTimePicker
        testID="dateTimePicker"
        timeZoneOffsetInMinutes={0}
        value={
          this.state.fromDateOpen == true
            ? this.state.fromDate
            : this.state.toDate
        }
        mode={this.state.mode}
        is24Hour={true}
        display="default"
        onChange={(event, selectedDate) =>
          this.onChangeDate(event, selectedDate)
        }
      />
    );
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
            isCustom={this.state.isCustom}
            onCalendarPress={item => this.onCalendarPress(item)}
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
        {this.state.showPicker ? this.renderDatePicker() : null}
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
