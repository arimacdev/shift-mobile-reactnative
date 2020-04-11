import React, {Component} from 'react';
import {View, FlatList, Text, Dimensions, Image, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import FadeIn from 'react-native-fade-in-image';
import Loader from '../../../components/Loader';


class UsersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        users : [],
        allUsers: [],
        isFetching : false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.usersLoading !== this.props.usersLoading && this.props.users && this.props.users.length > 0) {
      this.setState({
        users : this.props.users,
        allUsers : this.props.users,
       });
    }

    if (this.state.isFetching) {
      this.setState({
          isFetching : false,
      });
  }
  }

  componentDidMount() {
    this.fetchData()
     
  }

  fetchData() {
    this.props.getAllUsers()
  }

  userIcon = function (item) {

    let userImage = item.profileImage

    if(userImage){
      return (
          <FadeIn>
              <Image
                  source={{uri: userImage}}
                  style={{width: 45, height: 45,borderRadius: 45/ 2}} 
                />
          </FadeIn>
      );
    }else{
        return (
          <Image 
            style={{width: 45, height: 45,borderRadius: 45/ 2}} 
            source={require('../../../asserts/img/defult_user.png')}
          />
        );
    }

  };



  renderUserListList(item) {
    return (
    <TouchableOpacity onPress={()=>this.props.navigation.navigate('ViewUserScreen',{userItem:item})}>
      <View style={styles.userView}>
          {this.userIcon(item)}
          <View style={{flex: 1}}>
            <Text style={styles.text}>{item.firstName + ' ' + item.lastName}</Text>
          </View>
          <View style={styles.controlView}>
            <TouchableOpacity >
                <Image 
                  style={{width: 28, height: 28,borderRadius: 28/ 2 }} 
                  source={require('../../../asserts/img/edit_user.png')}
                />
            </TouchableOpacity>
            
            <TouchableOpacity style={{marginLeft: EStyleSheet.value('24rem')}}>
                <Image 
                  style={{width: 28, height: 28,borderRadius: 28/ 2 }} 
                  source={require('../../../asserts/img/block_user.png')}
                />
            </TouchableOpacity>
           
          </View>
        </View>
    </TouchableOpacity>
    );
  }

  onRefresh() {
    this.setState({ isFetching: true,}, function() {
       this.fetchData();
    });
   
}

  render() {
    let users = this.state.users;
    let isFetching = this.state.isFetching;
    let usersLoading = this.props.usersLoading;
    
    return (
      <View style={styles.backgroundImage}>
        <FlatList
          style={styles.flalList}
          data={users}
          renderItem={({item}) => this.renderUserListList(item)}
          keyExtractor={item => item.projId}
          onRefresh={() => this.onRefresh()}
          refreshing={isFetching}
        />
        {usersLoading && <Loader/>}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
     backgroundColor: colors.pageBackGroundColor,
  },
  userView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    height: '60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
  },
  userIcon: {
    width: '45rem',
    height: '45rem',
  },
  text: {
    fontSize: '12rem',
    color: colors.userListUserNameColor,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
    fontWeight: '400'
  },
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  flalList : {
    marginTop: '30rem',
    marginBottom: '10rem',
  }
});

const mapStateToProps = state => {
  return {
    usersLoading : state.users.usersLoading,
    users : state.users.users
  };
};
export default connect(
  mapStateToProps,
  actions,
)(UsersScreen);
