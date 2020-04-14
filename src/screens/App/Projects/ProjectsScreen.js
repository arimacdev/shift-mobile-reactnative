import React, {Component} from 'react';
import {View, FlatList, Text, Dimensions, Image, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import { Dropdown } from 'react-native-material-dropdown';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import { NavigationEvents } from 'react-navigation';

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
]

class ProjectsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      allProjects : [],
      selectedType : 'Ongoing',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.projectsLoading !== this.props.projectsLoading && this.props.projects && this.props.projects.length > 0) {
      let searchValue = 'ongoing';
      let filteredData = this.props.projects.filter(function (item) {
        return item.projectStatus.includes(searchValue);
      });
      this.setState({
        projects : filteredData,
        allProjects : this.props.projects,
    });
    }
  }

  componentDidMount() {
  }

  onFilter(key) {
    let value = key;
    let searchValue = '';
    switch (value) {
      case 'Ongoing':
            searchValue = 'ongoing'
            break;
      case 'Support':
            searchValue = 'support'
            break;
      case 'Finished':
            searchValue = 'finished'
            break;
      case 'Presales':  
            searchValue = 'presales'
            break;      
      case 'Presales : Project Discovery':  
            searchValue = 'presalesPD'
            break;
      case 'Presales : Quotation Submission':
            searchValue = 'preSalesQS'
            break;
      case 'Presales : Negotiation':
            searchValue = 'preSalesN'
            break;
      case 'Presales : Confirmed':
            searchValue = 'preSalesC'
            break;
      case 'Presales : Lost' : 
            searchValue = 'preSalesL'
            break;
    }
    
    let filteredData = this.state.allProjects.filter(function (item) {
      return item.projectStatus.includes(searchValue);
    });
  
  this.setState({
    projects: filteredData,
    selectedType : key
  });
}

  renderProjectList(item) {
    // TasksScreen
    //EditProjectScreen
    return (
    <TouchableOpacity onPress={()=>this.props.navigation.navigate('TasksScreen',{projDetails:item})}>  
      <View style={styles.projectView}>
        <Image style={styles.userIcon} source={icons.folder} />
        <View style={{flex:1}}>
            <Text style={styles.text}>{item.projectName}</Text>
        </View>
        {this.colorCode(item)}
      </View>
      </TouchableOpacity>
    );
  }

  colorCode = function (item) {
    let color = '';
    switch (item.projectStatus) {
      case 'presales':
            color = '#576377'
      case 'presalesPD':
            color = '#576377'
      case 'preSalesQS':
            color = '#576377'
      case 'preSalesN':
            color = '#576377'
      case 'preSalesC':  
            color = '#576377'    
          break;
      case 'preSalesL':
          color = '#FF6363' 
          break;
      case 'ongoing':
          color = '#5E98F0' 
          break;
      case 'support':
          color = '#FFA800'   
          break;
      case 'finished' : 
          color = '#36DD5B' 
          break    
  }
    return (
      <View style={[styles.statusView, {backgroundColor: color}]}/>
    );
  };

  renderBase(){
      return(
          <View style={{justifyContent:'center',flex:1}}>
            <Image style={styles.dropIcon} source={icons.arrow} />
          </View>
      )
  }

  loadProjects () {
    this.setState({
      selectedType : 'Ongoing'
    });
    AsyncStorage.getItem('userID').then(userID => {
      this.props.getAllProjectsByUser(userID)
    });
  }

  render() {
    let projects = this.state.projects;
    let projectsLoading = this.state.projectsLoading;
    let selectedType = this.state.selectedType

    return (
      <View style={styles.backgroundImage}>
        <NavigationEvents
                onWillFocus={(payload) => this.loadProjects(payload)}
                />
        <View style={styles.projectFilerView}>
        <Dropdown
        // style={{}}
        label=''
        labelFontSize={0}
        data={dropData}
        textColor={'white'}
        error={''}
        animationDuration={0.5}
        containerStyle={{width:'100%'}}
        overlayStyle={{width:'100%'}}
        pickerStyle={{width:'89%',marginTop:70, marginLeft:15}}
        dropdownPosition={0}
        value={selectedType}
        itemColor={'black'}
        selectedItemColor={'black'}
        dropdownOffset={{top:10}}
        baseColor={colors.lightBlue}
        // renderBase={this.renderBase}
        renderAccessory={this.renderBase}
        itemTextStyle={{marginLeft:15,fontFamily: 'CircularStd-Book',}}
        itemPadding={10}
        onChangeText={(value => this.onFilter(value))}

      />
            {/* <TouchableOpacity>
                <View>
                    <Text style={styles.textFilter}>Ongoing</Text>
                </View>
            </TouchableOpacity> */}
        </View>
        <FlatList
          data={projects}
          renderItem={({item}) => this.renderProjectList(item)}
          keyExtractor={item => item.projId}
        />
        {projectsLoading && <Loader/>}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
    // backgroundColor: colors.pageBackGroundColor,
  },
  projectFilerView:{
    backgroundColor: colors.lightBlue,
    borderRadius: 5,
    // width: '330rem',
    marginTop: '17rem',
    marginBottom:'12rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal:'20rem'
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
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    height:'60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: '12rem',
    marginHorizontal:'20rem'
  },
  text: {
    fontSize: '14rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft:'10rem'
  },
  userIcon: {
    width: '20rem',
    height: '20rem',
  },
  statusView:{
    backgroundColor: colors.gray,
    width:'5rem',
    height:'60rem',
    alignItems:'flex-end',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  dropIcon:{
    width: '13rem',
    height: '13rem',
  }
});

const mapStateToProps = state => {
  return {
    projectsLoading : state.project.projectsLoading,
    projects : state.project.projects
  };
};
export default connect(
  mapStateToProps,
  actions,
)(ProjectsScreen);
