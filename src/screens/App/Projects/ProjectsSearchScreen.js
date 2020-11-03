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
import {Icon} from 'native-base';
import EmptyListView from '../../../components/EmptyListView';
import APIServices from '../../../services/APIServices';
import Utils from '../../../utils/Utils';

class ProjectsSearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      allProjects: [],
      searchText: '',
      dataLoading: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.projectsLoading !== this.props.projectsLoading &&
      this.props.projects &&
      this.props.projects.length > 0
    ) {
      let sortData = this.props.projects.sort(this.arrayCompare);
      this.setState({
        projects: sortData,
        allProjects: sortData,
      });
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('userID').then(userID => {
      this.props.getAllProjectsByUser(userID);
    });
  }

  renderProjectList(item) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('TasksScreen', {projDetails: item})
        }>
        {this.renderProjectDetails(item)}
      </TouchableOpacity>
    );
  }

  renderProjectDetails = function(item) {
    let color = '';
    switch (item.projectStatus) {
      case 'presales':
      case 'presalesPD':
      case 'preSalesQS':
      case 'preSalesN':
      case 'preSalesC':
      case 'preSalesL':
        color = colors.colorTomato;
        break;
      case 'ongoing':
        color = colors.colorAmber;
        break;
      case 'support':
        color = colors.colorFreeSpeechMagenta;
        break;
      case 'finished':
        color = colors.colorDeepSkyBlue;
        break;
    }
    return (
      <View style={styles.projectView}>
        <Icon
          name={'folder'}
          type={'Feather'}
          style={{fontSize: EStyleSheet.value('22rem'), color: color}}
        />
        <View style={{flex: 1}}>
          <Text style={styles.text}>{item.projectName}</Text>
        </View>
        <TouchableOpacity
          onPress={() => this.pinProject(item.projectId, item.isStarred, item)}>
          <Icon
            name={item.isStarred ? 'star' : 'star-outline'}
            style={styles.starIconStyle}
          />
        </TouchableOpacity>
        <View style={[styles.statusView, {backgroundColor: color}]} />
      </View>
    );
  };

  async pinProject(projectID, isPin, itemMain) {
    let isPinProject = !isPin;

    this.setState({dataLoading: true});
    await APIServices.pinProjectData(projectID, isPinProject)
      .then(response => {
        if (response.message == 'success') {
          this.setState({dataLoading: false});
          this.onPinProject(itemMain);
        } else {
          this.setState({dataLoading: false});
          Utils.showAlert(true, '', response.message, this.props);
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        let message = error.data
          ? error.data.message
          : 'Error occurred while pin the project';
        Utils.showAlert(true, '', message, this.props);
      });
  }

  async onPinProject(itemMain) {
    let searchText = this.state.searchText;
    let filteredData = this.state.allProjects.filter(function(item) {
      if (itemMain.projectId == item.projectId) {
        item.isStarred = !item.isStarred;
      }
      return item.projectName.toLowerCase().includes(searchText.toLowerCase());
    });

    let sortData = filteredData.sort(this.arrayCompare);
    this.setState({projects: sortData});
  }

  arrayCompare(a, b) {
    const projectNameA = a.projectName.toUpperCase();
    const projectNameB = b.projectName.toUpperCase();

    let comparison = 0;
    if (projectNameA > projectNameB) {
      comparison = 1;
    } else if (projectNameA < projectNameB) {
      comparison = -1;
    }
    return comparison;
  }

  onSearchTextChange(text) {
    this.setState({searchText: text});
    let result = this.state.allProjects.filter(data =>
      data.projectName.toLowerCase().includes(text.toLowerCase()),
    );
    let sortData = result.sort(this.arrayCompare);
    if (text == '') {
      this.setState({projects: this.state.allProjects});
    } else {
      this.setState({projects: sortData});
    }
  }

  render() {
    let projects = this.state.projects;
    let projectsLoading = this.state.projectsLoading;
    let dataLoading = this.state.dataLoading;

    return (
      <View style={styles.container}>
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
          data={projects}
          renderItem={({item}) => this.renderProjectList(item)}
          keyExtractor={item => item.projId}
          ListEmptyComponent={<EmptyListView />}
        />
        {projectsLoading && <Loader />}
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
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
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
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Book',
    textAlign: 'left',
    marginLeft: '7rem',
  },
  searchIcon: {
    width: '17rem',
    height: '17rem',
  },
  starIconStyle: {
    fontSize: '30rem',
    color: colors.colorAmber,
    marginRight: '15rem',
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
)(ProjectsSearchScreen);
