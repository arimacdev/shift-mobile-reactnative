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
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import NavigationService from '../../../services/NavigationService';
import APIServices from '../../../services/APIServices';
import {NavigationEvents} from 'react-navigation';
import EmptyListView from '../../../components/EmptyListView';

class SearchGruopTaskScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      groupTasks: [],
      allgroupTasks: [],
      searchText: '',
      dataLoading: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    this.fetchData();
  }

  loadData() {}

  async fetchData() {
    this.setState({dataLoading: true});
    let groupTaskData = await APIServices.getGroupTaskData();
    if (groupTaskData.message == 'success') {
      this.setState({
        dataLoading: false,
        groupTasks: groupTaskData.data,
        allgroupTasks: groupTaskData.data,
        searchText: '',
      });
    } else {
      this.setState({dataLoading: false, searchText: ''});
    }
  }

  renderGroupTasks(item) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('TasksTabScreen', {taskDetails: item})
        }>
        <View style={styles.groupTaskView}>
          <Image style={styles.taskIconStyle} source={icons.taskBlue} />
          <View style={{flex: 1}}>
            <Text style={styles.textGroupName}>{item.taskGroupName}</Text>
          </View>
          <View style={styles.controlView}>
            <Image style={styles.userIconStyle} source={icons.users} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  onSearchTextChange(text) {
    this.setState({searchText: text});
    let result = this.state.allgroupTasks.filter(data =>
      data.taskGroupName.toLowerCase().includes(text.toLowerCase()),
    );
    if (text == '') {
      this.setState({groupTasks: this.state.allgroupTasks});
    } else {
      this.setState({groupTasks: result});
    }
  }

  render() {
    let groupTasks = this.state.groupTasks;
    let dataLoading = this.state.dataLoading;
    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={payload => this.loadData(payload)} />
        <View style={styles.projectFilerView}>
          <Image style={styles.searchIcon} source={icons.searchGray} />
          <TextInput
            style={[styles.textInput, {width: '95%'}]}
            placeholder={'Search'}
            value={this.state.searchText}
            onChangeText={text => this.onSearchTextChange(text)}
          />
        </View>
        <FlatList
          data={groupTasks}
          renderItem={({item}) => this.renderGroupTasks(item)}
          keyExtractor={item => item.taskGroupId}
          ListEmptyComponent={<EmptyListView />}
        />
        {dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  projectFilerView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
    flexDirection: 'row',
  },
  textFilter: {
    fontSize: '14rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
  },
  projectView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    height: '60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '12rem',
    marginHorizontal: '20rem',
  },
  text: {
    fontSize: '14rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  userIcon: {
    width: '20rem',
    height: '20rem',
  },
  statusView: {
    backgroundColor: colors.gray,
    width: '5rem',
    height: '60rem',
    alignItems: 'flex-end',
    borderTopRightRadius: '5rem',
    borderBottomRightRadius: '5rem',
  },
  dropIcon: {
    width: '13rem',
    height: '13rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '7rem',
  },
  searchIcon: {
    width: '17rem',
    height: '17rem',
  },
  groupTaskView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    height: '60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  textGroupName: {
    fontSize: '12rem',
    color: colors.userListUserNameColor,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '600',
  },
  taskIconStyle: {
    width: '18rem',
    height: '18rem',
  },
  userIconStyle: {
    width: '16rem',
    height: '16rem',
    marginRight: '16rem',
  },
});

const mapStateToProps = state => {
  return {
    projectsLoading: state.project.projectsLoading,
    projects: state.project.projects,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(SearchGruopTaskScreen);
