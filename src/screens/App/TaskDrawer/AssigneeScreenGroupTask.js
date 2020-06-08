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
import Loader from '../../../components/Loader';
import FadeIn from 'react-native-fade-in-image';
import APIServices from '../../../services/APIServices';
import EmptyListView from '../../../components/EmptyListView';

class AssigneeScreenGroupTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      allUsers: [],
      isFetching: false,
      searchText: '',
      selectedGroupTaskID: '',
    };
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let selectedGroupTaskID = params.selectedGroupTaskID;
    this.setState({selectedGroupTaskID: selectedGroupTaskID}, function() {
      this.fetchData();
    });
  }

  async fetchData() {
    let selectedGroupTaskID = this.state.selectedGroupTaskID;
    const activeUsers = await APIServices.getTaskPeopleData(
      selectedGroupTaskID,
    );
    if (activeUsers.message == 'success') {
      this.setState({
        users: activeUsers.data,
        allUsers: activeUsers.data,
        dataLoading: false,
      });
    } else {
      this.setState({dataLoading: false});
    }
  }

  onSelectUser(userName, userID) {
    const {navigation} = this.props;
    navigation.state.params.onSelectUser(userName, userID);
    navigation.goBack();
  }

  userImage = function(item) {
    let userImage = item.assigneeProfileImage;

    if (userImage) {
      return (
        <FadeIn>
          <Image source={{uri: userImage}} style={styles.userIcon} />
        </FadeIn>
      );
    } else {
      return (
        <Image
          style={styles.userIcon}
          source={icons.defultUser}
          resizeMode="contain"
        />
      );
    }
  };

  renderUserList(item) {
    const {navigation} = this.props;
    return (
      <TouchableOpacity
        onPress={() =>
          this.onSelectUser(
            item.assigneeFirstName + ' ' + item.assigneeLastName,
            item.assigneeId,
          )
        }>
        <View
          style={[
            styles.projectView,
            {
              backgroundColor:
                item.assigneeFirstName + ' ' + item.assigneeLastName ==
                navigation.state.params.userName
                  ? colors.projectBgColor
                  : '',
            },
          ]}>
          {this.userImage(item)}
          <View style={{flex: 1}}>
            <Text style={styles.text}>
              {item.assigneeFirstName + ' ' + item.assigneeLastName}
            </Text>
          </View>
          {/* {this.colorCode(item)} */}
        </View>
      </TouchableOpacity>
    );
  }

  // onRefresh() {
  //   this.setState({isFetching: true, users: [], allUsers: []}, function() {
  //     this.fetchData();
  //   });
  // }

  onSearchTextChange(text) {
    this.setState({searchText: text});
    let result = this.state.allUsers.filter(
      data =>
        data.firstName.toLowerCase().includes(text.toLowerCase()) ||
        data.lastName.toLowerCase().includes(text.toLowerCase()),
    );
    if (text == '') {
      this.setState({users: this.state.allUsers});
    } else {
      this.setState({users: result});
    }
  }

  render() {
    let users = this.state.users;
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
          data={users}
          renderItem={({item}) => this.renderUserList(item)}
          keyExtractor={item => item.projId}
          ListEmptyComponent={<EmptyListView />}
          //onRefresh={() => this.onRefresh()}
          //refreshing={isFetching}
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
    fontFamily: 'CircularStd-Book',
    textAlign: 'left',
    marginLeft: '7rem',
  },
  searchIcon: {
    width: '17rem',
    height: '17rem',
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(AssigneeScreenGroupTask);
