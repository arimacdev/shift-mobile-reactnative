import React, {Component} from 'react';
import {View, Text, Dimensions, Image} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import Loader from '../../../components/Loader';
import APIServices from '../../../services/APIServices';
import icons from '../../../asserts/icons/icons';
import Utils from '../../../utils/Utils';

class ViewUserScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userFirstName: '',
      userLastName: '',
      userLastEmail: '',
      userLastImage: '',
      dataLoading: false,
    };
  }

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let userItem = params.userItem;
    let userID = userItem.userId;
    this.fetchUserData(userID);
  }

  async fetchUserData(userID) {
    this.setState({dataLoading: true});
    try {
      let userData = await APIServices.getUserData(userID);
      if (userData.message == 'success') {
        this.setState({
          userFirstName: userData.data.firstName,
          userLastName: userData.data.lastName,
          userLastEmail: userData.data.email,
          userLastImage: userData.data.profileImage,
          dataLoading: false,
        });
      } else {
        this.setState({dataLoading: false});
      }
    } catch (error) {
      this.setState({dataLoading: false});
      this.props.navigation.goBack();
      Utils.showAlert(true, '', error.data.message, this.props);
    }
  }

  userIcon(userImage) {
    if (userImage) {
      return <Image source={{uri: userImage}} style={styles.avatar} />;
    } else {
      return <Image style={styles.avatar} source={icons.defultUser} />;
    }
  }

  render() {
    let userFirstName = this.state.userFirstName;
    let userLastName = this.state.userLastName;
    let userLastEmail = this.state.userLastEmail;
    let userLastImage = this.state.userLastImage;
    let dataLoading = this.state.dataLoading;

    return (
      <View style={styles.container}>
        <View style={styles.header} />
        {this.userIcon(userLastImage)}
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>
              {userFirstName + ' ' + userLastName}
            </Text>
          </View>
          <View style={[styles.taskFieldView, {marginTop: 0}]}>
            <Text style={styles.textBottom}>{userFirstName}</Text>
          </View>
          <View style={[styles.taskFieldView]}>
            <Text style={styles.textBottom}>{userLastName}</Text>
          </View>
          <View style={[styles.taskFieldView]}>
            <Text style={styles.textBottom}>{userLastEmail}</Text>
          </View>
        </View>
        {dataLoading && <Loader />}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.userViewHeader,
    height: '124rem',
  },
  avatar: {
    width: '130rem',
    height: '130rem',
    alignSelf: 'center',
    position: 'absolute',
    marginTop: '30rem',
    borderRadius: '75rem',
    borderWidth: '3rem',
    borderColor: colors.white,
  },
  name: {
    fontFamily: 'CircularStd-Bold',
    fontSize: '24rem',
    fontWeight: '400',
    color: colors.userViewHeader,
    textAlign: 'center',
    lineHeight: '30rem',
  },
  body: {
    marginTop: '20rem',
  },
  bodyContent: {
    alignItems: 'center',
    marginHorizontal: '30rem',
    marginTop: '30rem',
    marginBottom: '20rem',
  },
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '56rem',
    marginHorizontal: '20rem',
  },
  textBottom: {
    fontFamily: 'CircularStd-Medium',
    fontSize: '12rem',
    fontWeight: '400',
    color: colors.userViewData,
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(ViewUserScreen);
