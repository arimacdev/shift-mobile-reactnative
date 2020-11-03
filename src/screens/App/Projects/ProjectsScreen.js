import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import {NavigationEvents} from 'react-navigation';
import {Icon} from 'native-base';
import EmptyListView from '../../../components/EmptyListView';
import APIServices from '../../../services/APIServices';
import Utils from '../../../utils/Utils';

let dropData = [
  {
    id: 'Ongoing',
    value: 'Ongoing',
  },
  {
    id: 'Support',
    value: 'Support',
  },
  {
    id: 'Finished',
    value: 'Finished',
  },
  {
    id: 'pinned',
    value: 'Pinned',
  },
  {
    id: 'Presales',
    value: 'Presales',
  },
  {
    id: 'Presales : Project Discovery',
    value: 'Presales : Project Discovery',
  },
  {
    id: 'Presales : Quotation Submission',
    value: 'Presales : Quotation Submission',
  },
  {
    id: 'Presales : Negotiation',
    value: 'Presales : Negotiation',
  },
  {
    id: 'Presales : Confirmed',
    value: 'Presales : Confirmed',
  },
  {
    id: 'Presales : Lost',
    value: 'Presales : Lost',
  },
];

class ProjectsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      allProjects: [],
      selectedType: 'Presales',
      searchValue: 'presales',
      dataLoading: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.projectsLoading !== this.props.projectsLoading &&
      this.props.projects &&
      this.props.projects.length > 0
    ) {
      this.props.drawerItemSelect('projects');
      let searchValue = this.state.searchValue;
      let filteredData = this.props.projects.filter(function(item) {
        return searchValue == 'pinned'
          ? item.isStarred == true
          : item.projectStatus.includes(searchValue);
      });
      let sortData = filteredData.sort(this.arrayCompare);
      this.setState({
        projects: sortData,
        allProjects: this.props.projects,
      });
    }
  }

  componentDidMount() {}

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

  onFilter(key) {
    let value = key;
    let searchValue = '';
    switch (value) {
      case 'Ongoing':
        searchValue = 'ongoing';
        break;
      case 'Support':
        searchValue = 'support';
        break;
      case 'Finished':
        searchValue = 'finished';
        break;
      case 'Presales':
        searchValue = 'presales';
        break;
      case 'Presales : Project Discovery':
        searchValue = 'presalesPD';
        break;
      case 'Presales : Quotation Submission':
        searchValue = 'preSalesQS';
        break;
      case 'Presales : Negotiation':
        searchValue = 'preSalesN';
        break;
      case 'Presales : Confirmed':
        searchValue = 'preSalesC';
        break;
      case 'Presales : Lost':
        searchValue = 'preSalesL';
        break;
      case 'Pinned':
        searchValue = 'pinned';
        break;
    }

    let filteredData = [];

    filteredData = this.state.allProjects.filter(function(item) {
      return searchValue == 'pinned'
        ? item.isStarred == true
        : item.projectStatus.includes(searchValue);
    });

    let sortData = filteredData.sort(this.arrayCompare);
    this.setState({
      projects: sortData,
      selectedType: key,
      searchValue: searchValue,
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
    let searchValue = this.state.searchValue;
    let filteredData = this.state.allProjects.filter(function(item) {
      if (itemMain.projectId == item.projectId) {
        item.isStarred = !item.isStarred;
      }
      return searchValue == 'pinned'
        ? item.isStarred == true
        : item.projectStatus.includes(searchValue);
    });

    let sortData = filteredData.sort(this.arrayCompare);
    this.setState({projects: sortData});
  }

  renderBase() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Image style={styles.dropIcon} source={icons.arrow} />
      </View>
    );
  }

  loadProjects() {
    this.setState({
      selectedType: this.state.selectedType,
    });
    AsyncStorage.getItem('userID').then(userID => {
      this.props.getAllProjectsByUser(userID);
    });
  }

  render() {
    let projects = this.state.projects;
    let projectsLoading = this.props.projectsLoading;
    let selectedType = this.state.selectedType;
    let dataLoading = this.state.dataLoading;

    return (
      <View style={styles.container}>
        <NavigationEvents onWillFocus={payload => this.loadProjects(payload)} />
        <View style={styles.projectFilerView}>
          <Dropdown
            label=""
            labelFontSize={0}
            data={dropData}
            textColor={'white'}
            error={''}
            animationDuration={0.5}
            containerStyle={{width: '100%'}}
            overlayStyle={{width: '100%'}}
            pickerStyle={styles.projectFilterPicker}
            dropdownPosition={0}
            value={selectedType}
            itemColor={'black'}
            selectedItemColor={'black'}
            dropdownOffset={{top: 10}}
            baseColor={colors.lightBlue}
            renderAccessory={this.renderBase}
            itemTextStyle={{marginLeft: 15, fontFamily: 'CircularStd-Book'}}
            itemPadding={10}
            onChangeText={value => this.onFilter(value)}
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
    backgroundColor: colors.lightBlue,
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
  projectFilterPicker: {
    width: '89.5%',
    marginTop: '60rem',
    marginLeft: '13rem',
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
)(ProjectsScreen);
