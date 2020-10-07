import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import APIServices from '../../../services/APIServices';
import Utils from '../../../utils/Utils';
import moment from 'moment';
import icons from '../../../asserts/icons/icons';

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
          let meetingsArray = Object.values(
            response.data.reduce((acc, item) => {
              let meetingActualTime = moment(item.meetingActualTime).format(
                'L',
              );
              if (!acc[meetingActualTime])
                acc[meetingActualTime] = {
                  meetingActualTime: meetingActualTime,
                  data: [],
                };
              acc[meetingActualTime].data.push(item);
              return acc;
            }, {}),
          );

          console.log(meetingsArray);

          this.setState({
            dataLoading: false,
            meetings: meetingsArray.sort(this.arrayCompare),
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

  arrayCompare(a, b) {
    const dateA = a.meetingActualTime;
    const dateB = b.meetingActualTime;

    let comparison = 0;
    if (dateA > dateB) {
      comparison = 1;
    } else if (dateA < dateB) {
      comparison = -1;
    }
    return comparison;
  }

  onChangeIndexMain(indexMain) {
    this.setState({indexMain: indexMain});
  }

  initiateMeeting() {
    this.setState({indexMain: 0});
    this.props.onChangeIndexMain(0);
  }

  convertMinsToTime(mins) {
    let hours = Math.floor(mins / 60);
    let minutes = mins % 60;
    // minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours > 0 ? `${hours} h ${minutes} m` : `${minutes} mins`;
  }

  onItemPress(item) {}

  renderSubView(item) {
    let meetingActualDate = moment(item.meetingActualTime).format('DD');
    let meetingActualDateValue = moment(item.meetingActualTime).format('ddd');
    let meetingActualTime = moment(item.meetingActualTime).format('hh:mm A');

    return (
      <TouchableOpacity
        style={styles.textInputFieldView}
        onPress={() => this.onItemPress(item)}>
        <View style={styles.subViewStyle}>
          <View style={styles.leftLineStyle} />
          <View>
            <Text style={styles.meetingDateStyle}>{meetingActualDate}</Text>
            <Text style={styles.meetingDateValueStyle}>
              {meetingActualDateValue}
            </Text>
          </View>
          <View style={styles.subViewInnerStyle}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.meetingTimeStyle]}>{meetingActualTime}</Text>
              {/* <Text style={styles.meetingMinutes}>
                {this.convertMinsToTime(item.expectedDuration)}
              </Text> */}
            </View>
            <Text style={styles.meetingTopic}>{item.meetingTopic}</Text>
            <Text style={styles.meetingVenue}>{item.meetingVenue}</Text>
          </View>
          <View
            style={{
             
              height: 70,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.meetingMinutes}>
              {this.convertMinsToTime(item.expectedDuration)}
            </Text>
            <View style={styles.controlView}>
              <TouchableOpacity onPress={() => this.goToEditPeople(item)}>
                <Image
                  style={styles.controlIcon}
                  source={icons.editRoundWhite}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.blockPeople(item)}
                style={{marginLeft: EStyleSheet.value('15rem')}}>
                <Image
                  style={styles.controlIcon}
                  source={icons.deleteRoundRed}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderView(item) {
    let meetingActualDate = moment(item.meetingActualTime).format('DD');
    let meetingActualYear = moment(item.meetingActualTime).format('MMMM, YYYY');
    let meetingActualDateValue = moment(item.meetingActualTime).format('ddd');
    let meetingActualTime = moment(item.meetingActualTime).format('hh:mm A');
    return (
      <View>
        <Text style={styles.fieldName}>{meetingActualYear}</Text>
        <FlatList
          ref={r => (this.flatList = r)}
          style={styles.flatListSubStyle}
          data={item.data}
          renderItem={({item}) => this.renderSubView(item)}
          keyExtractor={item => item.meetingId}
        />
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
            keyExtractor={index => index}
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
    marginTop: '10rem',
    marginBottom: '80rem',
  },
  flatListSubStyle: {
    marginBottom: '20rem',
  },
  fieldName: {
    marginHorizontal: '20rem',
    marginTop: '10rem',
    fontSize: '15rem',
    fontFamily: 'CircularStd-Medium',
    color: colors.projectTaskNameColor,
  },
  textInputFieldView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: '5rem',
    marginTop: '5rem',
    marginBottom: '5rem',
    // paddingHorizontal: '12rem',
    // flexDirection:'row',
    // alignItems:'center',
    height: '80rem',
    // paddingVertical: '10rem',
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
  meetingDateStyle: {
    fontSize: '19rem',
    color: colors.colorsNavyBlue,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Bold',
    textAlign: 'center',
  },
  meetingTimeStyle: {
    fontSize: '14rem',
    color: colors.colorFroly,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Bold',
    textAlign: 'left',
  },
  meetingTopic: {
    fontSize: '13rem',
    color: colors.colorMidnightBlue,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
    marginTop: '10rem',
  },
  meetingVenue: {
    fontSize: '11rem',
    color: colors.gray,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'left',
  },
  meetingDateValueStyle: {
    fontSize: '11rem',
    color: colors.colorMediumSlateBlue,
    lineHeight: '17rem',
    fontFamily: 'CircularStd-Medium',
    textAlign: 'center',
  },
  leftLineStyle: {
    backgroundColor: colors.colorOrange,
    width: '5rem',
    height: '80rem',
    marginRight: '10rem',
    borderTopStartRadius: '5rem',
    borderBottomStartRadius: '5rem',
  },
  meetingMinutes: {
    backgroundColor: colors.colorCaribbeanGreen,
    color: colors.white,
    fontSize: '11rem',
    fontFamily: 'CircularStd-Medium',
    borderRadius: '5rem',
    paddingHorizontal: '5rem',
    paddingTop: '1rem',
    textAlign: 'center',
    marginRight: '10rem',
    width: '65rem',
    height: '18rem',
  },
  subViewStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subViewInnerStyle: {
    flex: 1,
    marginLeft: '20rem',
  },
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight:'10rem'
  },
  controlIcon: {
    width: '25rem',
    height: '25rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MeetingViewScreen);
