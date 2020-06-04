import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  BackHandler,
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
import CalendarPicker from 'react-native-calendar-picker';
import Modal from 'react-native-modal';
const {height, width} = Dimensions.get('window');
import {Icon} from 'native-base';

const initialLayout = {width: entireScreenWidth};
const menuItems = [
  {value: 0, text: 'Due today', color: colors.colorRed},
  {value: 1, text: 'This Week', color: colors.thisWeekColor},
  {value: 2, text: 'This Month', color: colors.colorOrange},
  {value: 3, text: 'Custom', color: colors.customColor},
];
class WorkloadTabScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        {key: 'tasks', title: 'Tasks'},
        // {key: 'graphs', title: 'Graphs'},//comment according to the #394 issue
      ],
      from: 'all',
      to: 'all',
      date: new Date(),
      isCustom: false,
      mode: 'date',
      fromDate: new Date(),
      toDate: new Date(),
      fromDateOpen: false,
      showPicker: false,

      selectedStartDate: null,
      selectedEndDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
    this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentWillMount() {
    BackHandler.addEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  componentWillUnmount() {
    BackHandler.removeEventListener(
      'hardwareBackPress',
      this.handleBackButtonClick,
    );
  }

  handleBackButtonClick() {
    if (this.state.showPicker) {
      this.onCloseModel();
    } else {
      this.props.navigation.goBack(null);
    }
    return true;
  }

  onDateChange(date, type) {
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
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
      //comment according to the #394 issue
      // case 'graphs':
      //   return (
      //     <Projects
      //       selectedProjectID={userId}
      //       navigation={this.props.navigation}
      //       isActive={isActive}
      //     />
      //   );
    }
  }

  getWeekDays() {
    var startOfWeek = moment(new Date())
      .startOf('isoweek')
      .toDate();
    var endOfWeek = moment(new Date())
      .endOf('isoweek')
      .toDate();
    this.setState({
      isCustom: false,
      from: moment(startOfWeek).format('YYYY-MM-DD[T]') + '00:00:00',
      to: moment(endOfWeek).format('YYYY-MM-DD[T]') + '23:59:59',
      date: new Date(),
    });
  }

  getMonthDays() {
    var startOfMonth = moment(new Date())
      .startOf('month')
      .toDate();
    var endOfMonth = moment(new Date())
      .endOf('month')
      .toDate();
    this.setState({
      isCustom: false,
      from: moment(startOfMonth).format('YYYY-MM-DD[T]') + '00:00:00',
      to: moment(endOfMonth).format('YYYY-MM-DD[T]') + '23:59:59',
      date: new Date(),
    });
  }

  onMenuItemChange(item) {
    switch (item.value) {
      case 0:
        this.setState({
          isCustom: false,
          from: moment(new Date()).format('YYYY-MM-DD[T]') + '00:00:00',
          to: moment(new Date()).format('YYYY-MM-DD[T]') + '23:59:59',
          date: new Date(),
        });
        break;
      case 1:
        this.getWeekDays();
        break;
      case 2:
        this.getMonthDays();
        break;
      case 3:
        this.setState({
          isCustom: true,
          from: 'all',
          to: 'all',
          date: new Date(),
        });
        break;
      default:
        break;
    }
  }

  onCalendarPress(item) {
    this.setState({fromDateOpen: item, showPicker: true});
  }

  onCloseModel() {
    this.setState({showPicker: false});
  }

  onDateSet() {
    let selectedStartDate =
      moment(this.state.selectedStartDate).format('YYYY-MM-DD[T]') + '00:00:00';
    let selectedEndDate =
      moment(this.state.selectedEndDate).format('YYYY-MM-DD[T]') + '23:59:59';

    this.setState({
      from: selectedStartDate == '' ? 'all' : selectedStartDate,
      to: selectedEndDate == '' ? 'all' : selectedEndDate,
      showPicker: false,
      date: new Date(),
    });
  }

  getButtonDisabledStaus() {
    if (
      this.state.selectedStartDate == null ||
      this.state.selectedEndDate == null
    ) {
      return true;
    } else {
      return false;
    }
  }

  onCanclePress() {
    this.setState({
      selectedStartDate: this.state.from !== 'all' ? this.state.from : '',
      selectedEndDate: this.state.to !== 'all' ? this.state.to : '',
    });
    this.onCloseModel();
  }

  renderCalender() {
    const {selectedStartDate, selectedEndDate} = this.state;
    const minDate = new Date(); // Today
    const maxDate = new Date(2500, 1, 1);
    const startDate = selectedStartDate
      ? moment(this.state.selectedStartDate).format('Do MMMM YYYY')
      : 'From';
    const endDate = selectedEndDate
      ? moment(this.state.selectedEndDate).format('Do MMMM YYYY')
      : 'To';
    return (
      <Modal
        isVisible={this.state.showPicker}
        style={styles.modalStyle}
        onBackButtonPress={() => this.onCloseModel()}
        onBackdropPress={() => this.onCloseModel()}
        onRequestClose={() => this.onCloseModel()}
        coverScreen={false}>
        <View style={{margin: 10}}>
          <View>
            <CalendarPicker
              startFromMonday={true}
              allowRangeSelection={true}
              // minDate={minDate}
              // maxDate={maxDate}
              selectedStartDate={selectedStartDate}
              selectedEndDate={selectedEndDate}
              width={width - 60}
              previousTitle={
                <Icon name={'arrow-dropleft'} style={styles.iconCalendar} />
              }
              nextTitle={
                <Icon name={'arrow-dropright'} style={styles.iconCalendar} />
              }
              todayBackgroundColor={colors.lightBlue}
              selectedDayColor={colors.selectedRange}
              selectedDayTextColor={colors.white}
              weekdays={['M', 'T', 'W', 'T', 'F', 'S', 'S']}
              textStyle={styles.dateTextStyle}
              dayLabelsWrapper={{
                borderBottomWidth: 0,
                borderTopWidth: 0,
              }}
              dayShape={'square'}
              onDateChange={this.onDateChange}
            />
          </View>
          <View style={styles.selectedDates}>
            <Text>{startDate}</Text>
            <Text style={styles.dashText}> - </Text>
            <Text>{endDate}</Text>
          </View>

          <View style={styles.ButtonViewStyle}>
            <TouchableOpacity
              style={styles.cancelStyle}
              onPress={() => this.onCanclePress()}>
              <Text style={styles.cancelTextStyle}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.okStyle,
                {
                  backgroundColor: this.getButtonDisabledStaus()
                    ? colors.lighterGray
                    : colors.lightGreen,
                },
              ]}
              disabled={this.getButtonDisabledStaus()}
              onPress={() => this.onDateSet()}>
              <Text style={styles.saveTextStyle}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
        {this.renderCalender()}
      </MenuProvider>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
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
  dateTextStyle: {
    color: colors.black,
    fontWeight: 'bold',
  },
  selectedDates: {
    flexDirection: 'row',
    marginTop: '0rem',
    height: '45rem',
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '15rem',
  },
  dashText: {
    fontSize: '29rem',
    color: colors.gray,
    marginBottom: '5rem',
  },
  ButtonViewStyle: {
    flexDirection: 'row',
    marginTop: '10rem',
    marginBottom: '10rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '15rem',
  },
  cancelStyle: {
    marginRight: '10rem',
    backgroundColor: colors.lightRed,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    flex: 1,
    justifyContent: 'center',
  },
  okStyle: {
    backgroundColor: colors.lightGreen,
    borderRadius: '5rem',
    paddingHorizontal: '40rem',
    paddingVertical: '10rem',
    flex: 1,
    justifyContent: 'center',
  },
  cancelTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
  },
  saveTextStyle: {
    fontSize: '15rem',
    color: colors.white,
    textAlign: 'center',
  },
  modalStyle: {
    backgroundColor: colors.white,
    marginVertical: '100rem',
    borderRadius: '5rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(WorkloadTabScreen);
