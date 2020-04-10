import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import {connect} from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
import {Dropdown} from 'react-native-material-dropdown';

let dropData = [
  {
    value: 'Status',
  },
  {
    value: 'Completed',
  },
  {
    value: 'Not started',
  },
  {
    value: 'QA',
  },
  {
    value: 'Unassigned',
  },
  {
    value: 'Assigned',
  },
];

let bottomData = [
  {
    value: 'All tasks',
    bottomBarColor: colors.darkBlue,
    bottomBarIcon: icons.taskDark,
  },
  {
    value: 'My tasks',
    bottomBarColor: colors.lightGreen,
    bottomBarIcon: icons.taskGreen,
  },
  {
    value: 'Add new tasks',
    bottomBarColor: colors.lightBlue,
    bottomBarIcon: icons.taskBlue,
  },
];

class TasksTabScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          taskId: '0001',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: '#ffc213',
          taskCompletion: false,
          taskDate: 'Yesterday',
          avatr: icons.whiteCircule,
        },
        {
          taskId: '0002',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: 'red',
          taskCompletion: false,
          taskDate: 'Today',
          avatr: icons.folder,
        },
        {
          taskId: '0003',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: 'gray',
          taskCompletion: false,
          taskDate: '2020/02/03',
          avatr: icons.folder,
        },
        {
          taskId: '0004',
          taskName: 'Home page login',
          taskStatus: 'Ongoing',
          taskStatusColor: 'gray',
          taskCompletion: true,
          taskDate: '2020/01/12',
          avatr: icons.folder,
        },
      ],
      index: 0,
      bottomItemPressColor: colors.darkBlue,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentDidMount() {}

  renderProjectList(item) {
    return (
      <TouchableOpacity
        onPress={() =>
          this.props.navigation.navigate('TasksScreen', {taskDetails: item})
        }>
        <View style={styles.projectView}>
          <Image
            style={styles.completionIcon}
            source={
              item.taskCompletion == true
                ? icons.rightCircule
                : icons.whiteCircule
            }
          />
          <View style={{flex: 1}}>
            <Text style={styles.text}>{item.taskName}</Text>
          </View>
          <View style={styles.statusView}>
            <Text style={[styles.textDate, {color: item.taskStatusColor}]}>
              {item.taskDate}
            </Text>
            <Image style={styles.avatarIcon} source={item.avatr} />
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  renderBase() {
    return (
      <View style={{justifyContent: 'center', flex: 1}}>
        <Image style={styles.dropIcon} source={icons.arrowDark} />
      </View>
    );
  }

  onBottomItemPress(index) {
    // let color;
    this.setState({index: index});
    // if (index == 0) {
    //   color = colors.darkBlue;
    // } else if (index == 1) {
    //   color =  colors.lightGreen;
    // } else {
    //   color = colors.lightBlue;
    // }

    // this.setState({bottomItemPressColor: color});
  }

  renderBottomBar() {
    return (
      <View style={styles.bottomBarContainer}>
        <View style={styles.bottomBarInnerContainer}>
          {bottomData.map((item, index) => {
            return (
              <View style={styles.bottomItemView}>
                <TouchableOpacity
                  style={[
                    styles.bottomItemTouch,
                    {
                      backgroundColor:
                        index == this.state.index
                          ? item.bottomBarColor
                          : colors.projectBgColor,
                    },
                  ]}
                  onPress={() => this.onBottomItemPress(index)}>
                  <Image
                    style={styles.bottomBarIcon}
                    source={
                      index == this.state.index
                        ? icons.taskWhite
                        : item.bottomBarIcon
                    }
                  />
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: 12,
                      color:
                        index == this.state.index
                          ? colors.white
                          : item.bottomBarColor,
                    }}>
                    {item.value}
                  </Text>
                </TouchableOpacity>
                {index !== bottomData.length - 1 ? (
                  <View style={styles.horizontalLine} />
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.backgroundImage}>
        {this.state.index !== 2 ? (
          <View>
            <View style={styles.projectFilerView}>
              <Dropdown
                // style={{}}
                label=""
                labelFontSize={0}
                data={dropData}
                textColor={colors.lightgray}
                error={''}
                animationDuration={0.5}
                containerStyle={{width: '100%'}}
                overlayStyle={{width: '100%'}}
                pickerStyle={{width: '89%', marginTop: 70, marginLeft: 15}}
                dropdownPosition={0}
                value={'Status'}
                itemColor={'black'}
                selectedItemColor={'black'}
                dropdownOffset={{top: 10}}
                baseColor={colors.projectBgColor}
                // renderBase={this.renderBase}
                renderAccessory={this.renderBase}
                itemTextStyle={{marginLeft: 15}}
                itemPadding={10}
              />
              {/* <TouchableOpacity>
                <View>
                    <Text style={styles.textFilter}>Ongoing</Text>
                </View>
            </TouchableOpacity> */}
            </View>
            <FlatList
              style={{marginBottom: 90}}
              data={this.state.data}
              renderItem={({item}) => this.renderProjectList(item)}
              keyExtractor={item => item.projId}
            />
          </View>
        ) : (
          <View>
            <Text>ddddddddddddd</Text>
          </View>
        )}

        {this.renderBottomBar()}
      </View>
    );
  }
}

const styles = EStyleSheet.create({
  backgroundImage: {
    flex: 1,
    // backgroundColor: colors.pageBackGroundColor,
  },
  projectFilerView: {
    backgroundColor: colors.projectBgColor,
    borderRadius: 5,
    // width: '330rem',
    marginTop: '17rem',
    marginBottom: '12rem',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: '12rem',
    height: '45rem',
    marginHorizontal: '20rem',
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
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  textDate: {
    fontSize: '9rem',
    color: colors.projectText,
    textAlign: 'center',
    fontWeight: 'bold',
    lineHeight: '17rem',
    fontFamily: 'HelveticaNeuel',
    textAlign: 'left',
    marginLeft: '10rem',
  },
  avatarIcon: {
    width: '20rem',
    height: '20rem',
    marginLeft: 10,
  },
  statusView: {
    // backgroundColor: colors.gray,
    // width:'5rem',
    // height:'60rem',
    alignItems: 'center',
    flexDirection: 'row',
    // borderTopRightRadius: 5,
    // borderBottomRightRadius: 5,
  },
  dropIcon: {
    width: '13rem',
    height: '13rem',
  },
  completionIcon: {
    width: '40rem',
    height: '40rem',
  },
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    height: 80,
    width: '100%',
    backgroundColor: colors.projectBgColor,
  },
  bottomBarInnerContainer: {
    flexDirection: 'row',
    height: 80,
  },
  bottomItemView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  bottomItemTouch: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  horizontalLine: {
    backgroundColor: colors.gray,
    width: 1,
    height: 40,
  },
  bottomBarIcon: {
    width: '20rem',
    height: '20rem',
  },
});

const mapStateToProps = state => {
  return {};
};
export default connect(
  mapStateToProps,
  actions,
)(TasksTabScreen);
