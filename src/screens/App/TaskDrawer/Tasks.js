import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
import AddNewTasksScreen from '../Tasks/AddNewTasksScreen';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import moment from 'moment';
import FadeIn from 'react-native-fade-in-image';
import {SkypeIndicator} from 'react-native-indicators';
import {NavigationEvents} from 'react-navigation';
import APIServices from '../../../services/APIServices';

const Placeholder = () => (
  <View style={styles.landing}>
    <SkypeIndicator color={colors.primary} />
  </View>
);

let dropData = [
  {
    id: 'All',
    value: 'All',
  },
  {
    id: 'Open',
    value: 'Open',
  },
  {
    id: 'Closed',
    value: 'Closed',
  },
];


class Tasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterdDataAllTaks: [],
      allDataAllTaks: [],
      index: 0,
      selectedTaskGroupId: '',
      isActive: this.props.isActive,
      selectedTypeAllTasks: 'All',
      dataLoading : false,
      taskName : ''
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.isActive !== this.props.isActive && this.props.isActive) {
      let selectedTaskGroupId = this.props.selectedTaskGroupId;
      this.setState(
        {
          selectedTaskGroupId: selectedTaskGroupId,
        },
        () => {
          this.getAllTaskInGroup();
        },
      );
    }
  }

  async componentDidMount() {
    let selectedTaskGroupId = this.props.selectedTaskGroupId;
      this.setState(
        {
          selectedTaskGroupId: selectedTaskGroupId,
        },
        () => {
          this.getAllTaskInGroup();
        },
      );
  }


  async getAllTaskInGroup() {
    this.setState({
      selectedTypeAllTasks: 'All',
    });
    let selectedTaskGroupId = this.state.selectedTaskGroupId;
    this.setState({dataLoading:true});
    allTaskData = await APIServices.getAllTaskByGroup(selectedTaskGroupId);
    if(allTaskData.message == 'success'){
      this.setState({
        dataLoading:false,
        allDataAllTaks:allTaskData.data,
        filterdDataAllTaks:allTaskData.data
      });   
    }else{
      this.setState({dataLoading:false});
    }
  }

  async tabOpenTaskTab() {
    let selectedTaskGroupId = this.props.selectedTaskGroupId;
    this.setState(
      {
        selectedTaskGroupId: selectedTaskGroupId,
      },
      () => {
        this.getAllTaskInGroup();
      },
    );
  }

  dateView = function(item) {
    let date = item.taskDueDateAt;
    let currentTime = moment().format();
    let dateText = '';
    let color = '';

    let taskStatus = item.taskStatus;
    if (taskStatus == 'closed' && date) {
      // task complete
      dateText = moment(date).format('DD/MM/YYYY');
      color = '#36DD5B';
    } else if (taskStatus != 'closed' && date) {
      if (moment(date).isAfter(currentTime)) {
        dateText = moment(date).format('DD/MM/YYYY');
        color = '#0C0C5A';
      } else {
        dateText = moment(date).format('DD/MM/YYYY');
        color = '#ff6161';
      }
    } else {
      dateText = 'Add Due Date';
      color = '#000000';
    }

    return <Text style={[styles.textDate, {color: color}]}>{dateText}</Text>;
  };

  userImage = function(item) {
    let userImage = item.taskAssigneeProfileImage;

    if (userImage) {
      return (
        <FadeIn>
          <Image
            source={{uri: userImage}}
            style={{width: 24, height: 24, borderRadius: 24 / 2}}
          />
        </FadeIn>
      );
    } else {
      return (
        <Image
          style={{width: 24, height: 24, borderRadius: 24 / 2}}
          source={require('../../../asserts/img/defult_user.png')}
        />
      );
    }
  };

  renderTaskList(item) {
    return (
      <TouchableOpacity>
        <View style={styles.taskView}>
          <Image
            style={styles.completionIcon}
            source={
              item.taskStatus == 'closed'
                ? icons.rightCircule
                : icons.whiteCircule
            }
          />
          <View style={{flex: 1}}>
            <Text style={styles.text}>{item.taskName}</Text>
          </View>
          <View style={styles.statusView}>
            {this.dateView(item)}
            {this.userImage(item)}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderBase() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Image style={styles.dropIcon} source={icons.arrowDark} />
      </View>
    );
  }


  onFilterAllTasks(key) {
    let value = key;
    let searchValue = '';
    let index = this.state.index;
    switch (value) {
      case 'All':
        searchValue = '';
        break;
      case 'Closed':
        searchValue = 'closed';
        break;
      case 'Open' : 
          searchValue = 'open';  
        break;
    }

    let filteredData = this.state.allDataAllTaks.filter(function(item) {
      return item.taskStatus.includes(searchValue);
    });
    this.setState({
      filterdDataAllTaks: filteredData,
      selectedTypeAllTasks: key,
    });
  }

  onNewTaskNameChange(text) {
    this.setState({ taskName: text });
  }

  async onNewTaskNameSubmit(text){
    try {
      let taskName = this.state.taskName;
      let selectedTaskGroupId = this.state.selectedTaskGroupId;
      this.setState({dataLoading:true});
      newGroupTaskData = await APIServices.addTaskGroupTaskData(taskName,selectedTaskGroupId);
      if(newGroupTaskData.message == 'success'){
        this.setState({dataLoading:false,taskName:''});   
        this.getAllTaskInGroup();
      }else{
        this.setState({dataLoading:false});
      }
    }catch(e) {
      this.setState({dataLoading:false});   
    }
  }

  render() {
    let filterdDataAllTaks = this.state.filterdDataAllTaks;
    let selectedTypeAllTasks = this.state.selectedTypeAllTasks;
    let dataLoading = this.state.dataLoading;
    let taskName =this.state.taskName

    return (
      <View style={styles.backgroundImage}>
        <NavigationEvents
          onWillFocus={payload => this.tabOpenTaskTab(payload)}
        />
          <View>
            <View style={styles.projectFilerView}>
                <Dropdown
                  label=""
                  labelFontSize={0}
                  data={dropData}
                  textColor={colors.dropDownText}
                  error={''}
                  animationDuration={0.5}
                  containerStyle={{width: '100%'}}
                  overlayStyle={{width: '100%'}}
                  pickerStyle={{width: '89%', marginTop: 70, marginLeft: 15}}
                  dropdownPosition={0}
                  value={selectedTypeAllTasks}
                  itemColor={'black'}
                  selectedItemColor={'black'}
                  dropdownOffset={{top: 10}}
                  baseColor={colors.projectBgColor}
                  renderAccessory={this.renderBase}
                  itemTextStyle={{
                    marginLeft: 15,
                    fontFamily: 'CircularStd-Book',
                  }}
                  itemPadding={10}
                  onChangeText={value => this.onFilterAllTasks(value)}
                />
            </View>
            <View style={[styles.addNewFieldView, {flexDirection: 'row'}]}>
                <TextInput
                  style={[styles.textInput, {width: '95%'}]}
                  placeholder={'Add a task'}
                  value={taskName}
                  onChangeText={taskName => this.onNewTaskNameChange(taskName)}
                  onSubmitEditing={() => this.onNewTaskNameSubmit(this.state.taskName)}
                />
            </View>
            <FlatList
              style={{marginBottom: EStyleSheet.value('80rem')}}
              data={filterdDataAllTaks}
              renderItem={({item}) => this.renderTaskList(item)}
              keyExtractor={item => item.taskId}
            />
          </View>
          {dataLoading && <Loader/>}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
    // backgroundColor: colors.pageBackGroundColor,
  },
  projectFilerView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    // width: '330rem',
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
  },
  textFilter: {
    fontSize: '14rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
    // fontWeight: 'bold',
  },
  taskView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    height: '60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '11rem',
    color: colors.projectTaskNameColor,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400',
  },
  textDate: {
    fontFamily: 'Circular Std Book',
    fontSize: '9rem',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    marginRight: '5rem',
  },
  avatarIcon: {
    width: '20rem',
    height: '20rem',
    marginLeft: 10,
  },
  statusView: {
    // backgroundColor: colors.gray,
    // width:'5rem',
    // height:'60rem',
    alignItems: 'center',
    flexDirection: 'row',
    // borderTopRightRadius: 5,
    // borderBottomRightRadius: 5,
  },
  dropIcon: {
    width: '13rem',
    height: '13rem',
  },
  completionIcon: {
    width: '40rem',
    height: '40rem',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    height: 80,
    width: '100%',
    backgroundColor: colors.projectBgColor,
  },
  bottomBarInnerContainer: {
    flexDirection: 'row',
    height: 80,
  },
  bottomItemView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bottomItemTouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  horizontalLine: {
    backgroundColor: colors.gray,
    width: 1,
    height: 40,
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
  },
  landing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addNewFieldView: {
    backgroundColor: '#e5e9ef',
    borderRadius: 5,
    borderWidth: 2,
    borderColor  : '#e5e9ef',
    marginTop: '10rem',
    marginBottom: '0rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '57rem',
    marginHorizontal: '20rem',
  },
});

const mapStateToProps = state => {
  return {
  };
};
export default connect(
  mapStateToProps,
  actions,
)(Tasks);
