import React, {Component} from 'react';
import {View, Text, FlatList, Dimensions, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import EStyleSheet, {value} from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import APIServices from '../../../services/APIServices';
import Utils from '../../../utils/Utils';
import moment from 'moment';

const initialLayout = {width: entireScreenWidth};

class MeetingViewScreen extends Component {
  textInputValuesArray = [];
  constructor(props) {
    super(props);
    this.state = {
      indexMain: 3,
      meetings: [],
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    this.loadMeetings();
  }

  async loadMeetings() {
    let projectId = this.props.selectedProjectID;
    let startIndex = 0;
    let endIndex = 10;
    let filter = false;
    let filterKey = '';
    let filterDate = '';
    this.setState({dataLoading: true});
    await APIServices.getMeetingsData(
      projectId,
      startIndex,
      endIndex,
      filter,
      filterKey,
      filterDate,
    )
      .then(response => {
        if (response.message == 'success') {
          this.setState({
            dataLoading: false,
            meetings: response.data,
          });
        } else {
          this.setState({dataLoading: false});
          Utils.showAlert(true, '', response.message, this.props);
        }
      })
      .catch(error => {
        this.setState({dataLoading: false});
        Utils.showAlert(true, '', error.data.message, this.props);
      });
  }

  onChangeIndexMain(indexMain) {
    this.setState({indexMain: indexMain});
  }

  initiateMeeting() {
    this.setState({indexMain: 0});
    this.props.onChangeIndexMain(0);
  }

  renderView(item) {
    let meetingActualDate = moment(item.meetingActualTime).format('MMMM DD');
    let meetingActualDateValue = moment(item.meetingActualTime).format('ddd');
    let meetingActualTime = moment(item.meetingActualTime).format('hh:mm A');
    return (
      <View>
        {/* <Text style={styles.fieldName}>{meetingActualDate}</Text> */}

        <TouchableOpacity
          style={styles.textInputFieldView}
          onPress={() => this.onItemPress(item)}>
          {/* <View style={{flexDirection: 'row', marginLeft: 20}}>
            <View style={{alignItems: 'center'}}>
              <Text style={styles.meetingDateStyle}>{meetingActualDate}</Text>
              <Text style={styles.meetingDateValueStyle}>
                {meetingActualDateValue}
              </Text>
            </View>
          </View> */}
          {/* <View> */}
          <Text style={styles.meetingDateStyle}>{meetingActualDate}</Text>
          <Text style={styles.meetingTimeStyle}>{meetingActualTime}</Text>
          <Text style={styles.meetingVenue}>{item.meetingVenue}</Text>
          <Text style={styles.meetingTopic}>{item.meetingTopic}</Text>

          {/* </View> */}
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    let meetings = this.state.meetings;
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <FlatList
            ref={r => (this.flatList = r)}
            style={styles.flatListStyle}
            data={meetings}
            renderItem={({item}) => this.renderView(item)}
            keyExtractor={item => item.id}
          />
          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={() => this.initiateMeeting()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Initiate a Meeting</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  flatListStyle: {
    marginBottom: '100rem',
  },
  fieldName: {
    marginHorizontal: '20rem',
    marginTop: '10rem',
    fontSize: '10rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.projectTaskNameColor,
  },
  textInputFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    paddingHorizontal: '12rem',
    // flexDirection:'row',
    // alignItems:'center',
    // height: '45rem',
    paddingVertical: '10rem',
    marginHorizontal: '20rem',
  },
  textInput: {
    fontSize: '11rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: colors.colorApple,
    borderRadius: '5rem',
    marginTop: '17rem',
    alignItems: 'center',
    paddingHorizontal: '12rem',
    height: '50rem',
    marginHorizontal: '20rem',
  },
  buttonText: {
    flex: 1,
    fontSize: '12rem',
    color: colors.white,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: '0rem',
    width: '100%',
    marginBottom: '15rem',
  },
  textEditorStyle: {
    height: '130rem',
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    borderColor: colors.colorSilver,
    borderWidth: '0.5rem',
    marginHorizontal: '20rem',
  },
  meetingDateStyle: {
    fontSize: '13rem',
    color: colors.colorCoralRed,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Bold',
    textAlign: 'left',
  },
  meetingTimeStyle: {
    fontSize: '15rem',
    color: colors.colorDeepSkyBlue,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Bold',
    textAlign: 'left',
  },
  meetingTopic: {
    fontSize: '12rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  meetingVenue: {
    fontSize: '13rem',
    color: colors.black,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginTop:'5rem'
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MeetingViewScreen);
