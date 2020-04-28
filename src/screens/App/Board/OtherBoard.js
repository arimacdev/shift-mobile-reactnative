import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Image,
    Text,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import NavigationService from '../../../services/NavigationService';
import APIServices from '../../../services/APIServices';
import EStyleSheet from 'react-native-extended-stylesheet';
import FadeIn from 'react-native-fade-in-image';
import * as Progress from 'react-native-progress';
import { ButtonGroup } from 'react-native-elements';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });
import Accordion from 'react-native-collapsible/Accordion';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import { NavigationEvents } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
const initialLayout = { width: entireScreenWidth };

class OtherBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sprints: [
                {
                    sprintId: "1259d276-c79a-4a7d-9ae2-a517b1a61621",
                    projectId: "e1e4b8c2-70a0-4600-96b7-f7c28be1dbf3",
                    sprintName: "Sprint 5",
                    sprintDescription: "2020-05-15 - 2020-05-21",
                    sprintCreatedBy: "d159877c-b01d-4447-a798-0821293d968a",
                    sprintCreatedAt: "2020-04-21T10:47:10.000+0000",
                    sprintStartDate: null,
                    sprintEndDate: null,
                    isDeleted: false
                }
            ],

        activeSections: [],
        };
    }



    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentDidMount() {

    }

    _renderHeader = (section, index) => {
        return section.total == 0 ? (
          <TouchableOpacity>
            <Animatable.View
              duration={400}
              style={[
                styles.header,
                {
                  backgroundColor:
                    section.total == 0 ? colors.noTasksColor : colors.darkBlue,
                  borderBottomEndRadius:
                    index == this.state.activeSections[0] ? 0 : 5,
                  borderBottomStartRadius:
                    index == this.state.activeSections[0] ? 0 : 5,
                },
              ]}>
              <View style={{flex: 1}}>
                <Text style={styles.headerText}>
                  {section.projectName} - {section.completed}/{section.total}
                </Text>
              </View>
    
              <Image
                style={styles.dropIcon}
                source={
                  index == this.state.activeSections[0]
                    ? icons.arrowDown
                    : section.total == 0
                    ? icons.arrowUpGray
                    : icons.arrowUp
                }
              />
            </Animatable.View>
          </TouchableOpacity>
        ) : (
          <Animatable.View
            duration={400}
            style={[
              styles.header,
              {
                backgroundColor:
                  section.total == 0 ? colors.noTasksColor : colors.darkBlue,
                borderBottomEndRadius:
                  index == this.state.activeSections[0] ? 0 : 5,
                borderBottomStartRadius:
                  index == this.state.activeSections[0] ? 0 : 5,
              },
            ]}>
            <View style={{flex: 1}}>
              <Text style={styles.headerText}>
                {section.projectName} - {section.completed}/{section.total}
              </Text>
            </View>
    
            <Image
              style={styles.dropIcon}
              source={
                index == this.state.activeSections[0]
                  ? icons.arrowDown
                  : section.total == 0
                  ? icons.arrowUpGray
                  : icons.arrowUp
              }
            />
          </Animatable.View>
        );
      };

      _renderContent(item, isActive) {
        return (
          <Animatable.View
            animation={isActive ? 'bounceIn' : undefined}
            duration={400}
            style={styles.flatListView}>
            <FlatList
              style={styles.flatListStyle}
              //   onTouchStart={() => {
              //     this.setState({enableScrollViewScroll:false})
              //  }}
              //  onMomentumScrollEnd={() => {
              //   this.setState({enableScrollViewScroll:true})
              //  }}
              data={item}
              renderItem={({item, index}) => this.renderProjectList(item, index)}
              keyExtractor={item => item.taskId}
            />
          </Animatable.View>
        );
      }

    render() {

        return (
            <View>

                <View >
                    <TouchableOpacity>
                        <View style={styles.button}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.buttonText}>New Sprint</Text>
                            </View>
                            <Image
                                style={[styles.addIcon, { marginRight: 10 }]}
                                source={icons.addGreen}
                                resizeMode={'center'}
                            />
                        </View>
                    </TouchableOpacity>

                    <ScrollView style={styles.subContainer}>

                        <Accordion
                            underlayColor={colors.white}
                            sections={this.state.sprints}
                            // sectionContainerStyle={{height:200}}
                            containerStyle={{ marginBottom: 20, marginTop: 10 }}
                            activeSections={this.state.activeSections}
                            renderHeader={this._renderHeader}
                            renderContent={item => this._renderContent(item.taskList)}
                            onChange={this._updateSections}
                        />

                    </ScrollView>

                </View>

            </View>

        );
    }
}

const styles = EStyleSheet.create({
    button: {
        flexDirection: 'row',
        backgroundColor: colors.lightGreen,
        borderRadius: 5,
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
        fontFamily: 'HelveticaNeuel',
        fontWeight: 'bold',
    },
    addIcon: {
        width: '28rem',
        height: '28rem',
    },
    subContainer: {
        marginBottom: '65rem'
    },
    flalList: {
        marginTop: '30rem',
        marginBottom: '10rem',
    },
    mainContainer: {
        backgroundColor: colors.projectBgColor,
        borderRadius: 5,
        marginHorizontal: '20rem',
        marginVertical: '7rem',
    },
    userView: {
        backgroundColor: colors.projectBgColor,
        borderRadius: 5,
        height: '60rem',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '12rem',
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
        fontWeight: '600'
    },
    subText: {
        fontSize: '10rem',
        color: '#b9b9b9',
        textAlign: 'center',
        lineHeight: '17rem',
        fontFamily: 'CircularStd-Medium',
        textAlign: 'left',
        marginLeft: '10rem',
        fontWeight: '400'
    },
});

const mapStateToProps = state => {
    return {};
};
export default connect(
    mapStateToProps,
    actions,
)(OtherBoard);
