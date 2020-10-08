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
import Loader from '../../../components/Loader';
import MessageShowModal from '../../../components/MessageShowModal';
import EmptyListView from '../../../components/EmptyListView';

const initialLayout = {width: entireScreenWidth};

class MeetingViewScreen extends Component {
  details = {
    icon: icons.alertRed,
    type: 'confirm',
    title: 'Delete Meeting',
    description:
      "You're about to permanently delete this meeting and all of its data.\nIf you're not sure, you can close this pop up.",
    buttons: {positive: 'Delete', negative: 'Cancel'},
  };
  onPressMessageModal = () => {};

  textInputValuesArray = [];
  constructor(props) {
    super(props);
    this.state = {
      indexMain: 3,
      meetings: [],
      showMessageModal: false,
      listScroll: false,
      startIndex: 0,
      endIndex: 10,
      filter: false,
      filterKey: '',
      filterDate: '',
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {
    let startIndex = this.state.startIndex;
    let endIndex = this.state.endIndex;
    let filter = this.state.filter;
    let filterKey = this.state.filterKey;
    let filterDate = this.state.filterDate;
    this.loadMeetings(startIndex, endIndex, filter, filterKey, filterDate);
  }

  async loadMeetings(startIndex, endIndex, filter, filterKey, filterDate) {
    let projectId = this.props.selectedProjectID;
    let listScroll = this.state.listScroll;

    let startIndexData = listScroll ? this.state.startIndex + 10 : startIndex;
    let endIndexData = listScroll ? this.state.endIndex + 10 : endIndex;

    this.setState({
      dataLoading: true,
      startIndex: startIndexData,
      endIndex: endIndexData,
    });
    await APIServices.getMeetingsData(
      projectId,
      startIndexData,
      endIndexData,
      filter,
      filterKey,
      filterDate,
    )
      .then(response => {
        if (response.message == 'success') {
          let meetingsArray = Object.values(
            response.data.reduce((acc, item) => {
              let meetingExpectedTime = moment
                .parseZone(item.meetingExpectedTime)
                .format('L');
              if (!acc[meetingExpectedTime])
                acc[meetingExpectedTime] = {
                  meetingExpectedTime: meetingExpectedTime,
                  data: [],
                };
              acc[meetingExpectedTime].data.push(item);
              acc[meetingExpectedTime].data.sort(this.arrayCompare);
              return acc;
            }, {}),
          );
          meetingsArray.sort(this.arrayCompare);
          this.setState({
            dataLoading: false,
            // listScroll:false,
            meetings: this.state.meetings.concat(meetingsArray),
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
    const dateA = a.meetingExpectedTime;
    const dateB = b.meetingExpectedTime;

    let comparison = 0;
    if (dateA < dateB) {
      comparison = 1;
    } else if (dateA > dateB) {
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
    return hours > 0 && minutes > 0
      ? `${hours}h ${minutes}m`
      : hours > 0
      ? `${hours} hour(s)`
      : `${minutes} mins`;
  }

  onItemPress(item) {}

  onPressCancel() {
    this.setState({showMessageModal: false});
  }

  deleteMeetingAlert(item) {
    this.details = {
      icon: icons.alertRed,
      type: 'confirm',
      title: 'Delete Meeting',
      description:
        "You're about to permanently delete this meeting and all of its data.\nIf you're not sure, you can close this pop up.",
      buttons: {positive: 'Delete', negative: 'Cancel'},
    };
    this.setState({showMessageModal: true});
    this.onPressMessageModal = () => this.deleteMeeting(item);
  }

  async deleteMeeting(item) {
    let projectId = this.props.selectedProjectID;
    let meetingId = item.meetingId;
    let startIndex = this.state.startIndex;
    let endIndex = this.state.endIndex;
    let filter = this.state.filter;
    let filterKey = this.state.filterKey;
    let filterDate = this.state.filterDate;

    setTimeout(async () => {
      this.setState({dataLoading: true, showMessageModal: false});
      await APIServices.deleteMeetingsData(projectId, meetingId)
        .then(async response => {
          if (response.message == 'success') {
            this.details = {
              icon: icons.meetingGreen,
              type: 'success',
              title: 'Sucsess',
              description: 'Meeting has been deleted successfully',
              buttons: {},
            };
            await this.setState({
              dataLoading: false,
              showMessageModal: true,
              startIndex:0,
              endIndex:10,
            });
            this.loadMeetings(startIndex, endIndex, filter, filterKey, filterDate);
          } else {
            this.setState({dataLoading: false});
            Utils.showAlert(true, '', response.message, this.props);
          }
        })
        .catch(error => {
          this.setState({dataLoading: false});
          Utils.showAlert(true, '', error.data.message, this.props);
        });
    }, 200);
  }

  onListScroll() {
    this.setState({listScroll: true});
  }

  renderSubView(item) {
    let meetingActualDate = moment
      .parseZone(item.meetingExpectedTime)
      .format('DD');
    let meetingActualDateValue = moment
      .parseZone(item.meetingExpectedTime)
      .format('ddd');
    let meetingExpectedTime = moment
      .parseZone(item.meetingExpectedTime)
      .format('hh:mm A');

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
          <View style={styles.horizontalLine} />
          <View style={styles.subViewInnerStyle}>
            <View style={{flexDirection: 'row'}}>
              <Text style={[styles.meetingTimeStyle]}>
                {meetingExpectedTime}
              </Text>
              {/* <Text style={styles.meetingMinutes}>
                {this.convertMinsToTime(item.expectedDuration)}
              </Text> */}
            </View>
            <Text style={styles.meetingTopic}>{item.meetingTopic}</Text>
            <Text style={styles.meetingVenue}>{item.meetingVenue}</Text>
          </View>
          <View style={styles.controlOuterView}>
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
                onPress={() => this.deleteMeetingAlert(item)}
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
    let meetingActualYear = moment
      .parseZone(item.meetingExpectedTime)
      .format('MMMM, YYYY');

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
    let dataLoading = this.state.dataLoading;
    let startIndex = this.state.startIndex;
    let endIndex = this.state.endIndex;
    let filter = this.state.filter;
    let filterKey = this.state.filterKey;
    let filterDate = this.state.filterDate;
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          <FlatList
            ref={r => (this.flatList = r)}
            style={styles.flatListStyle}
            data={meetings}
            renderItem={({item}) => this.renderView(item)}
            keyExtractor={index => index}
            ListEmptyComponent={<EmptyListView />}
            onEndReached={() =>
              this.loadMeetings(
                startIndex,
                endIndex,
                filter,
                filterKey,
                filterDate,
              )
            }
            onEndReachedThreshold={0.7}
            onScroll={() => this.onListScroll()}
          />
          <View style={styles.bottomContainer}>
            <TouchableOpacity onPress={() => this.initiateMeeting()}>
              <View style={styles.button}>
                <Text style={styles.buttonText}>Initiate a Meeting</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <MessageShowModal
          showMessageModal={this.state.showMessageModal}
          details={this.details}
          onPress={this.onPressMessageModal}
          onPressCancel={() => this.onPressCancel(this)}
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
    fontSize: '15rem',
    color: colors.colorTomato,
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
    backgroundColor: colors.colorFreeSpeechMagenta,
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
    marginLeft: '15rem',
  },
  controlView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: '10rem',
  },
  controlIcon: {
    width: '25rem',
    height: '25rem',
  },
  controlOuterView: {
    height: '65rem',
    justifyContent: 'space-between',
  },
  horizontalLine: {
    width: '1rem',
    height: '50rem',
    backgroundColor: colors.lightgray,
    marginLeft: '15rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(MeetingViewScreen);
