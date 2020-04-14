import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import {NavigationEvents} from 'react-navigation';

let projDetails = [
  {
    text: 'Project start date',
    details: '2020 Jan 01',
  },
  {
    text: 'Project end date',
    details: '2020 Jan 14',
  },
  {
    text: 'Estimated project timeline',
    details: '2 weeks',
  },
  {
    text: 'Actual time for now',
    details: '1 week 2 days',
  },
];

let projOuterDetails = [
  {
    text: '10',
    details: 'Due today',
    icon: icons.calenderWhite,
    color: '#ffb129',
  },
  {
    text: '12',
    details: 'Overdue',
    icon: icons.warningWhite,
    color: '#e65c62',
  },
  {
    text: '236',
    details: 'left',
    icon: icons.clockWhite,
    color: '#704cf1',
  },
  {
    text: '12',
    details: 'Assigned to you',
    icon: icons.userWhiteProj,
    color: '#67d2e0',
  },
  {
    text: '236',
    details: 'Completed',
    icon: icons.rightWhite,
    color: '#6fcd17',
  },
];

class ProjectsDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      allProjects: [],
      selectedType: 'Ongoing',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.projectsLoading !== this.props.projectsLoading &&
      this.props.projects &&
      this.props.projects.length > 0
    ) {
      let searchValue = 'ongoing';
      let filteredData = this.props.projects.filter(function(item) {
        return item.projectStatus.includes(searchValue);
      });
      this.setState({
        projects: filteredData,
        allProjects: this.props.projects,
      });
    }
  }

  componentDidMount() {}

  renderInnerList(item) {
    return (
      <View style={styles.projectInnerView}>
        <Text style={styles.projectInnerText}>{item.text}</Text>
        <Text style={styles.projectInnerDetailText}>{item.details}</Text>
      </View>
    );
  }

  renderOuterList(item, index) {
    return (
      <View
        style={[
          styles.projectOuterView,
          {
            flex:
              index == projOuterDetails.length - 1 &&
              (projOuterDetails.length - 1) % 2 == 0
                ? 0.5
                : 1,

            marginRight:
              index == projOuterDetails.length - 1 &&
              (projOuterDetails.length - 1) % 2 == 0
                ? 20
                : 3,
            backgroundColor: item.color,
          },
        ]}>
        <View style={styles.ProjectOuterInnerView}>
          <Image
            style={styles.outerListIcon}
            source={item.icon}
            resizeMode="contain"
          />
          <View style={{marginLeft: 15}}>
            <Text style={styles.projectOuterText}>{item.text}</Text>
            <Text style={styles.projectOuterDetailsText}>{item.details}</Text>
          </View>
        </View>
      </View>
    );
  }

  loadProjects() {
    this.setState({
      selectedType: 'Ongoing',
    });
    AsyncStorage.getItem('userID').then(userID => {
      this.props.getAllProjectsByUser(userID);
    });
  }

  render() {
    let projects = this.state.projects;
    let projectsLoading = this.state.projectsLoading;
    let selectedType = this.state.selectedType;

    return (
      <ScrollView style={styles.container}>
        <NavigationEvents onWillFocus={payload => this.loadProjects(payload)} />
        <View style={styles.projectDetailsView}>
          <View style={styles.projDetailsInnerView}>
            <View style={{flex: 1}}>
              <Text style={styles.textProjName}>REDD MRI</Text>
              <Text style={styles.textProjCompany}>REDD Digital Pty Ltd.</Text>
            </View>
            <View>
              <Image style={styles.editIcon} source={icons.editUser} />
            </View>
          </View>
          <View style={styles.border} />
          <View style={styles.projectDetailsInnerView}>
            <View style={styles.projectDetailsHeadding}>
              <Text style={styles.projectDetailsHeaddingText}>
                Project ongoing
              </Text>
            </View>
            <View
              style={[
                styles.projectDetailsHeadding,
                {backgroundColor: colors.lightGreen},
              ]}>
              <Text style={styles.projectDetailsHeaddingText}>Healthy</Text>
            </View>
          </View>
          <FlatList
            style={styles.projectInnerFlatList}
            data={projDetails}
            numColumns={2}
            renderItem={({item}) => this.renderInnerList(item)}
            keyExtractor={item => item.projId}
          />
        </View>
        <FlatList
          style={styles.projectOuterFlatList}
          data={projOuterDetails}
          numColumns={2}
          renderItem={({item, index}) => this.renderOuterList(item, index)}
          keyExtractor={item => item.projId}
        />
        {projectsLoading && <Loader />}
      </ScrollView>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  projectDetailsView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '10rem',
    marginTop: '17rem',
    marginBottom: '3rem',
    marginHorizontal: '20rem',
  },
  textProjName: {
    fontSize: '25rem',
    color: colors.darkBlue,
    fontFamily: 'CircularStd-Medium',
    fontWeight: 'bold',
  },
  projDetailsInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: '15rem',
    paddingHorizontal: '20rem',
  },
  textProjCompany: {
    fontSize: '14rem',
    color: colors.projectText,
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
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
  editIcon: {
    width: '35rem',
    height: '35rem',
  },
  projectDetailsHeadding: {
    backgroundColor: colors.lightBlue,
    flex: 1,
    borderRadius: '3rem',
    marginTop: '7rem',
    marginBottom: '4rem',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '30rem',
    marginHorizontal: '2rem',
  },
  projectDetailsHeaddingText: {
    color: colors.white,
  },
  outerListIcon: {
    width: '30rem',
    height: '30rem',
  },
  projectInnerView: {
    flex: 1,
    backgroundColor: colors.projDetails,
    borderRadius: '7rem',
    marginTop: '5rem',
    paddingLeft: '12rem',
    paddingVertical: '15rem',
    marginHorizontal: '3rem',
  },
  projectInnerText: {
    marginBottom: '3rem',
    fontSize: '10rem',
  },
  projectInnerDetailText: {
    color: colors.lightBlue,
    fontSize: '10rem',
    fontFamily: 'CircularStd-Medium',
  },
  projectOuterView: {
    backgroundColor: colors.projDetails,
    borderRadius: '7rem',
    marginTop: '5rem',
    paddingLeft: '13rem',
    paddingVertical: '15rem',
    marginHorizontal: '3rem',
  },
  ProjectOuterInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  projectOuterText: {
    color: colors.white,
    marginBottom: '-5rem',
    fontSize: '28rem',
    fontWeight: 'bold',
    fontFamily: 'CircularStd-Medium',
  },
  projectOuterDetailsText: {
    color: colors.white,
    fontSize: '13rem',
  },
  border: {
    borderWidth: '0.5rem',
    width: '100%',
    borderColor: colors.lightgray,
    marginTop: '5rem',
  },
  projectDetailsInnerView: {
    flexDirection: 'row',
    paddingHorizontal: '18rem',
  },
  projectInnerFlatList: {
    marginHorizontal: '18rem',
    marginBottom: '20rem',
  },
  projectOuterFlatList: {
    marginHorizontal: '18rem',
    marginBottom: '20rem',
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
)(ProjectsDetailsScreen);
