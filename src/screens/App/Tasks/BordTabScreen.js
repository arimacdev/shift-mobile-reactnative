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

let dropData = [{
    value: 'Status',
  }, {
    value: 'Completed',
  }, {
    value: 'Not started',
  }, {
    value: 'QA',
  }, {
    value: 'Unassigned',
  }, {
    value: 'Assigned',
  }];

class BordTabScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          taskId: '0001',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: '#ffc213',
          taskDate:'Yesterday',
          avatr:icons.folder
        },
        {
          taskId: '0002',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: '#ffc213',
          taskDate:'Yesterday',
          avatr:icons.folder
        },
        {
          taskId: '0003',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: '#ffc213',
          taskDate:'Yesterday',
          avatr:icons.folder
        },
        {
          taskId: '0004',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: '#ffc213',
          taskDate:'Yesterday',
          avatr:icons.folder
        },
      ],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  renderProjectList(item) {
    return (
    <TouchableOpacity onPress={()=>this.props.navigation.navigate('TasksScreen',{taskDetails:item})}>
      <View style={styles.projectView}>
        <Image style={styles.userIcon} source={item.avatr} />
        <View style={{flex:1}}>
            <Text style={styles.text}>{item.taskName}</Text>
        </View>
        <View style={styles.statusView}>
          <Text style={styles.text}>{item.projName}</Text>
          <Image style={styles.userIcon} source={item.avatr} />
        </View>
      </View>
      </TouchableOpacity>
    );
  }

renderBase(){
    return(
        <View style={{justifyContent:'center',flex:1}}>
           <Image style={styles.dropIcon} source={icons.arrowDark} />
        </View>
    )
}

  render() {
    return (
      <View style={styles.backgroundImage}>
        <View style={styles.projectFilerView}>
        <Dropdown
        // style={{}}
        label=''
        labelFontSize={0}
        data={dropData}
        textColor={colors.lightgray}
        error={''}
        animationDuration={0.5}
        containerStyle={{width:'100%'}}
        overlayStyle={{width:'100%'}}
        pickerStyle={{width:'89%',marginTop:70, marginLeft:15}}
        dropdownPosition={0}
        value={'Status'}
        itemColor={'black'}
        selectedItemColor={'black'}
        dropdownOffset={{top:10}}
        baseColor={colors.projectBgColor}
        // renderBase={this.renderBase}
        renderAccessory={this.renderBase}
        itemTextStyle={{marginLeft:15}}
        itemPadding={10}

      />
            {/* <TouchableOpacity>
                <View>
                    <Text style={styles.textFilter}>Ongoing</Text>
                </View>
            </TouchableOpacity> */}
        </View>
        <FlatList
          data={this.state.data}
          renderItem={({item}) => this.renderProjectList(item)}
          keyExtractor={item => item.projId}
        />
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
    backgroundColor: colors.projectBgColor,
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
    fontFamily: 'HelveticaNeuel',
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
    paddingHorizontal: '12rem',
    marginHorizontal:'20rem'
  },
  text: {
    fontSize: '12rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
    marginLeft:'10rem'
  },
  userIcon: {
    width: '20rem',
    height: '20rem',
  },
  statusView:{
    // backgroundColor: colors.gray,
    // width:'5rem',
    // height:'60rem',
    alignItems:'center',
    flexDirection:'row',
    // borderTopRightRadius: 5,
    // borderBottomRightRadius: 5,
  },
  dropIcon:{
    width: '13rem',
    height: '13rem',
  }
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(BordTabScreen);
