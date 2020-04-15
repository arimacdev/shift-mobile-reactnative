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
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import FadeIn from 'react-native-fade-in-image';


class AssigneeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      allProjects: [],
      searchText: '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.projectsLoading !== this.props.projectsLoading &&
      this.props.projects &&
      this.props.projects.length > 0
    ) {
      this.setState({
        projects: this.props.projects,
        allProjects: this.props.projects,
      });
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('userID').then(userID => {
      this.props.getAllProjectsByUser(userID);
    });
  }

  onSelectUser(userName) {
    const { navigation } = this.props;
    navigation.state.params.onSelectUser(userName);
    navigation.goBack();
  }

  userImage = function(item) {
    let userImage = 'https://i.pinimg.com/236x/5e/48/1b/5e481b8fa99c5f0ebc319b93f3c6e076--tiaras-singer.jpg';
    // let userImage = item.taskAssigneeProfileImage;

    if (userImage) {
      return (
        <FadeIn>
          <Image
            source={{uri: userImage}}
            style={styles.userIcon}
            resizeMode="contain"
          />
        </FadeIn>
      );
    } else {
      return (
        <Image
          style={styles.userIcon}
          source={require('../../../asserts/img/defult_user.png')}
          resizeMode="contain"
        />
      );
    }
  };

  renderProjectList(item) {
    return (
      <TouchableOpacity onPress={() => this.onSelectUser(item.projectName)}>
        <View
          style={[
            styles.projectView,
            {
              backgroundColor:
                item.projectName == this.props.userName
                  ? colors.projectBgColor
                  : '',
            },
          ]}>
          {this.userImage()}
          <View style={{flex: 1}}>
            <Text style={styles.text}>{item.projectName}</Text>
          </View>
          {/* {this.colorCode(item)} */}
        </View>
      </TouchableOpacity>
    );
  }

  colorCode = function(item) {
    let color = '';
    switch (item.projectStatus) {
      case 'presales':
        color = '#576377';
      case 'presalesPD':
        color = '#576377';
      case 'preSalesQS':
        color = '#576377';
      case 'preSalesN':
        color = '#576377';
      case 'preSalesC':
        color = '#576377';
        break;
      case 'preSalesL':
        color = '#FF6363';
        break;
      case 'ongoing':
        color = '#5E98F0';
        break;
      case 'support':
        color = '#FFA800';
        break;
      case 'finished':
        color = '#36DD5B';
        break;
    }
    return <View style={[styles.statusView, {backgroundColor: color}]} />;
  };

  renderBase() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Image style={styles.dropIcon} source={icons.arrow} />
      </View>
    );
  }

  onSearchTextChange(text) {
    this.setState({searchText: text});
    let result = this.state.allProjects.filter(data =>
      data.projectName.toLowerCase().includes(text.toLowerCase()),
    );
    if (text == '') {
      this.setState({projects: this.state.allProjects});
    } else {
      this.setState({projects: result});
    }
  }

  render() {
    let projects = this.state.projects;
    let projectsLoading = this.state.projectsLoading;
    return (
      <View style={styles.backgroundImage}>
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
        />
        {projectsLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  projectFilerView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
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
    textAlign: 'center',
    // fontWeight: 'bold',
  },
  projectView: {
    height: '70rem',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: '20rem',
    borderBottomWidth: 1,
    borderBottomColor: colors.lighterGray,
  },
  text: {
    fontSize: '12rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  userIcon: {
    width: '50rem',
    height: '50rem',
    borderRadius: 120 / 2,
  },
  statusView: {
    backgroundColor: colors.gray,
    width: '5rem',
    height: '60rem',
    alignItems: 'flex-end',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
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
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
    marginLeft: '7rem',
  },
  searchIcon: {
    width: '17rem',
    height: '17rem',
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
)(AssigneeScreen);
