import React, {Component} from 'react';
import {View, FlatList, Text, Dimensions, Image, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});

class ProjectsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          projId: '0001',
          projName: 'REDD MRI',
          projStatus: 'Ongoing',
          projStatusColor: '#ffc213'
        },
        {
          projId: '0002',
          projName: 'VISA',
          projStatus: 'Completed',
          projStatusColor: '#2ec973',
        },
        {
          projId: '0003',
          projName: 'BLUEMOUNTION_IOT',
          projStatus: 'Not Started',
          projStatusColor: '#ff4c13',
        },
        {
          projId: '0004',
          projName: 'DILMAH_DISIGN',
          projStatus: 'Over due',
          projStatusColor: '#ff4c13',
        },
      ],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  renderProjectList(item) {
    return (
    <TouchableOpacity>
      <View style={styles.projectView}>
        <Image style={styles.userIcon} source={icons.folder} />
        <View style={{flex:1}}>
            <Text style={styles.text}>{item.projName}</Text>
        </View>
        <View style={[styles.statusView, {backgroundColor: item.projStatusColor}]}/>
      </View>
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.backgroundImage}>
        <View style={styles.projectFilerView}>
            <TouchableOpacity>
                <View>
                    <Text style={styles.textFilter}>Ongoing</Text>
                </View>
            </TouchableOpacity>
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
    paddingLeft: '12rem',
    marginHorizontal:'20rem'
  },
  text: {
    fontSize: '14rem',
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
    backgroundColor: colors.gray,
    width:'5rem',
    height:'60rem',
    alignItems:'flex-end',
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(ProjectsScreen);
