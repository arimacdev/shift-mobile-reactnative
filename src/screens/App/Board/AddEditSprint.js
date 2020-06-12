import React, {Component} from 'react';
import {
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../asserts/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import _ from 'lodash';
import AwesomeAlert from 'react-native-awesome-alerts';
import Loader from '../../../components/Loader';
import APIServices from '../../../services/APIServices';

class AddEditSprint extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sprintName: '',
      sprintDescription: '',
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
      projectID: '',
      sprintId: '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    const {
      navigation: {
        state: {params},
      },
    } = this.props;
    let screenType = params.screenType;
    let projectID = params.projectID;
    if (screenType == 'add') {
      this.setState({
        screenType: 'add',
        projectID: projectID,
      });
    } else {
      let sprintId = params.item.sprintId;
      let sprintName = params.item.sprintName;
      let sprintDescription = params.item.sprintDescription;
      this.setState({
        screenType: 'edit',
        projectID: projectID,
        sprintId: sprintId,
        sprintName: sprintName,
        sprintDescription: sprintDescription,
      });
    }
  }

  saveSprint() {
    let screenType = this.state.screenType;
    if (screenType == 'add') {
      this.addSprint();
    } else {
      this.editSprint();
    }
  }

  async addSprint() {
    let sprintName = this.state.sprintName;
    let sprintDescription = this.state.sprintDescription;
    let projectID = this.state.projectID;
    if (this.validateProject(sprintName, sprintDescription)) {
      this.setState({dataLoading: true});
      try {
        resultObj = await APIServices.addSprintData(
          projectID,
          sprintName,
          sprintDescription,
        );
        if (resultObj.message == 'success') {
          this.setState({dataLoading: false});
          this.props.navigation.goBack();
        } else {
          this.setState({dataLoading: false});
          this.showAlert('', 'Error');
        }
      } catch (e) {
        if (e.status == 403) {
          this.setState({dataLoading: false});
          this.showAlert('', e.data.message);
        }
      }
    }
  }

  async editSprint() {
    let sprintName = this.state.sprintName;
    let sprintDescription = this.state.sprintDescription;
    let projectID = this.state.projectID;
    let sprintId = this.state.sprintId;
    if (this.validateProject(sprintName, sprintDescription)) {
      this.setState({dataLoading: true});
      try {
        resultObj = await APIServices.editSprintData(
          projectID,
          sprintName,
          sprintDescription,
          sprintId,
        );
        if (resultObj.message == 'success') {
          this.setState({dataLoading: false});
          this.props.navigation.goBack();
        } else {
          this.setState({dataLoading: false});
          this.showAlert('', 'Error');
        }
      } catch (e) {
        if (e.status == 403) {
          this.setState({dataLoading: false});
          this.showAlert('', e.data.message);
        }
      }
    }
  }

  validateProject(sprintName, sprintDescription) {
    if (!sprintName && _.isEmpty(sprintName)) {
      this.showAlert('', 'Please enter the sprint name');
      return false;
    }

    if (!sprintDescription && _.isEmpty(sprintDescription)) {
      this.showAlert('', 'Please enter the sprint description');
      return false;
    }
    return true;
  }

  hideAlert() {
    this.setState({
      showAlert: false,
      alertTitle: '',
      alertMsg: '',
    });
  }

  showAlert(title, msg) {
    this.setState({
      showAlert: true,
      alertTitle: title,
      alertMsg: msg,
    });
  }

  render() {
    let dataLoading = this.state.dataLoading;
    let sprintName = this.state.sprintName;
    let sprintDescription = this.state.sprintDescription;
    let showAlert = this.state.showAlert;
    let alertTitle = this.state.alertTitle;
    let alertMsg = this.state.alertMsg;

    return (
      <View style={{flex: 1}}>
        <ScrollView style={{marginBottom: EStyleSheet.value('02rem')}}>
          <View style={[styles.taskFieldView, {marginTop: 20}]}>
            <TextInput
              style={[styles.textInput, {width: '95%'}]}
              placeholder={'Sprint Name'}
              value={sprintName}
              onChangeText={sprintName => this.setState({sprintName})}
            />
          </View>
          <View style={[styles.taskFieldView, {marginTop: 20}]}>
            <TextInput
              style={[styles.textInput, {width: '95%'}]}
              placeholder={'Sprint Description'}
              value={sprintDescription}
              onChangeText={sprintDescription =>
                this.setState({sprintDescription})
              }
            />
          </View>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => this.saveSprint()}>
            <View style={styles.button}>
              <Image
                style={[
                  styles.bottomBarIcon,
                  {marginRight: 15, marginLeft: 10},
                ]}
                source={icons.folderWhite}
                resizeMode={'contain'}
              />
              <View style={{flex: 1}}>
                <Text style={styles.buttonText}>Add new Sprint</Text>
              </View>

              <Image
                style={[styles.addIcon, {marginRight: 10}]}
                source={icons.add}
                resizeMode={'contain'}
              />
            </View>
          </TouchableOpacity>
        </View>
        {dataLoading && <Loader />}
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title={alertTitle}
          message={alertMsg}
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          cancelText=""
          confirmText="OK"
          confirmButtonColor={colors.primary}
          onConfirmPressed={() => {
            this.hideAlert();
          }}
        />
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  titleView: {
    marginTop: '20rem',
    marginLeft: '20rem',
  },
  titleText: {
    color: colors.gray,
    fontSize: '14rem',
  },
  taskFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '0rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '60rem',
    marginHorizontal: '20rem',
  },
  textFilter: {
    fontSize: '14rem',
    color: colors.white,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
  },
  projectView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    height: '60rem',
    marginTop: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
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
  textDate: {
    fontSize: '9rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  avatarIcon: {
    width: '20rem',
    height: '20rem',
    marginLeft: '10rem',
  },
  statusView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  dropIcon: {
    width: '13rem',
    height: '13rem',
  },
  completionIcon: {
    width: '40rem',
    height: '40rem',
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
  },
  textInput: {
    fontSize: '12rem',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  calendarIcon: {
    width: '23rem',
    height: '23rem',
  },
  taskFieldDocPickView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '0rem',
    marginBottom: '7rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    marginHorizontal: '20rem',
    paddingVertical: '6rem',
  },
  gallaryIcon: {
    width: '24rem',
    height: '24rem',
  },
  cross: {
    width: '7rem',
    height: '7rem',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.lightBlue,
    borderRadius: '5rem',
    marginTop: '17rem',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '55rem',
    marginHorizontal: '20rem',
  },
  buttonText: {
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    fontWeight: 'bold',
  },
  addIcon: {
    width: '28rem',
    height: '28rem',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    marginBottom: '15rem',
  },
});

const mapStateToProps = () => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(AddEditSprint);
