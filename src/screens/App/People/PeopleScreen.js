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
// import Tasks from './TasksTabScreen';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import EStyleSheet from 'react-native-extended-stylesheet';
import FadeIn from 'react-native-fade-in-image';
import * as Progress from 'react-native-progress';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });

const initialLayout = { width: entireScreenWidth };

class PeopleScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            owner: [
                {
                    userId: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    idpUserId: "5421cabf-32cb-48c9-9820-35e723bd6e13",
                    firstName: "Naveen",
                    lastName: "Perera",
                    role: 'Project Owner',
                    email: "naveenperera@gmail.com",
                    userName: "5421cabf-32cb-48c9-9820-35e723bd6e13",
                    profileImage: "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                    totalTask: 25,
                    completed: 3,
                    progress: 0.5
                }
            ],
            admins: [
                {
                    userId: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    idpUserId: "5421cabf-32cb-48c9-9820-35e723bd6e13",
                    firstName: "Naveen",
                    lastName: "Perera",
                    role: 'Project Manager',
                    email: "naveenperera@gmail.com",
                    userName: "5421cabf-32cb-48c9-9820-35e723bd6e13",
                    profileImage: "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                    totalTask: 25,
                    completed: 3,
                    progress: 0.2
                },
                {
                    userId: "06794c0f-3216-4298-9809-bcd03f7b6ad0",
                    idpUserId: "963518f3-ee88-4068-b7de-fe0e54451f96",
                    firstName: "Nalin",
                    lastName: "Perera",
                    role: 'Project Manager',
                    email: "nalin@getnada.com",
                    userName: "963518f3-ee88-4068-b7de-fe0e54451f96",
                    profileImage: null,
                    totalTask: 25,
                    completed: 3,
                    progress: 0.9
                },
            ],
            users: [
                {
                    userId: "06794c0f-3216-4298-9809-bcd03f7b6ad0",
                    idpUserId: "963518f3-ee88-4068-b7de-fe0e54451f96",
                    firstName: "Nalin",
                    lastName: "Perera",
                    role: 'Developer',
                    email: "nalin@getnada.com",
                    userName: "963518f3-ee88-4068-b7de-fe0e54451f96",
                    profileImage: null,
                    totalTask: 25,
                    completed: 3,
                    progress: 1
                },
                {
                    userId: "06794c0f-3216-4298-9809-bcd03f7b6ad0",
                    idpUserId: "963518f3-ee88-4068-b7de-fe0e54451f96",
                    firstName: "Nalin",
                    lastName: "Perera",
                    role: 'Developer',
                    email: "nalin@getnada.com",
                    userName: "963518f3-ee88-4068-b7de-fe0e54451f96",
                    profileImage: null,
                    totalTask: 25,
                    completed: 3,
                    progress: 0.2
                },
                {
                    userId: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    idpUserId: "5421cabf-32cb-48c9-9820-35e723bd6e13",
                    firstName: "Naveen",
                    lastName: "Perera",
                    role: 'Developer',
                    email: "naveenperera@gmail.com",
                    userName: "5421cabf-32cb-48c9-9820-35e723bd6e13",
                    profileImage: "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                    totalTask: 25,
                    completed: 3,
                    progress: 0.1
                },
                {
                    userId: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    idpUserId: "5421cabf-32cb-48c9-9820-35e723bd6e13",
                    firstName: "Naveen",
                    lastName: "Perera",
                    role: 'Developer',
                    email: "naveenperera@gmail.com",
                    userName: "5421cabf-32cb-48c9-9820-35e723bd6e13",
                    profileImage: "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                    totalTask: 25,
                    completed: 3,
                    progress: 0.7
                }
            ],
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) { }

    componentDidMount() {
    }

    goToAddPeople = () => {
        NavigationService.navigate('AddPeopleScreen', {});
    }

    goToEditPeople = (item) => {
        NavigationService.navigate('EditPeople', {userItem: item});
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



    renderPeopleList(item) {
        return (
            <TouchableOpacity style={styles.mainContainer} onPress={() => this.props.navigation.navigate('ViewUserScreen', { userItem: item })}>
                <View style={styles.userView}>
                    {this.userIcon(item)}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.text}>{item.role}</Text>
                        <Text style={styles.subText}>{item.firstName + ' ' + item.lastName}</Text>
                    </View>
                    <View style={styles.controlView}>
                        <TouchableOpacity onPress={() => this.goToEditPeople(item)}>
                            <Image
                                style={{ width: 28, height: 28, borderRadius: 28 / 2 }}
                                source={require('../../../asserts/img/edit_user.png')}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity style={{ marginLeft: EStyleSheet.value('24rem') }}>
                            <Image
                                style={{ width: 28, height: 28, borderRadius: 28 / 2 }}
                                source={require('../../../asserts/img/bin.png')}
                            />
                        </TouchableOpacity>

                    </View>
                </View>
                <Text style={styles.subText}>{item.completed + ' / ' + item.totalTask + ' Tasks Completed'}</Text>
                <View style={styles.progressBarContainer}>
                    <Progress.Bar progress={item.progress} 
                width={null}
                animated={true}
                color={colors.lightGreen}
                unfilledColor={colors.lightRed}
                borderWidth={0}
                height={14}
                borderRadius={10}
                />
                </View>
                
            </TouchableOpacity>
        );
    }




    render() {
        return (
            <View>
                <TouchableOpacity onPress={() => this.goToAddPeople()}>
                    <View style={styles.button}>
                        <Image
                            style={[styles.bottomBarIcon, { marginRight: 15, marginLeft: 10 }]}
                            source={icons.taskWhite}
                            resizeMode={'center'}
                        />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.buttonText}>Add new</Text>
                        </View>

                        <Image
                            style={[styles.addIcon, { marginRight: 10 }]}
                            source={icons.add}
                            resizeMode={'center'}
                        />
                    </View>
                </TouchableOpacity>

                <ScrollView style={styles.subContainer}>
                    <Text style={styles.subTitle}>Project Owner</Text>
                    <FlatList
                        style={styles.flalList}
                        data={this.state.owner}
                        renderItem={({ item }) => this.renderPeopleList(item)}
                        keyExtractor={item => item.projId}
                        // onRefresh={() => this.onRefresh()}
                        // refreshing={isFetching}
                    />
                    <Text style={styles.subTitle}>Admins</Text>
                    <FlatList
                        style={styles.flalList}
                        data={this.state.admins}
                        renderItem={({ item }) => this.renderPeopleList(item)}
                        keyExtractor={item => item.projId}
                        // onRefresh={() => this.onRefresh()}
                        // refreshing={isFetching}
                    />
                    <Text style={styles.subTitle}>Other Users</Text>
                    <FlatList
                        style={styles.flalList}
                        data={this.state.users}
                        renderItem={({ item }) => this.renderPeopleList(item)}
                        keyExtractor={item => item.projId}
                        // onRefresh={() => this.onRefresh()}
                        // refreshing={isFetching}
                    />
                </ScrollView>
            </View>
        );
    }
}

const styles = EStyleSheet.create({
    mainContainer: {
        backgroundColor: colors.projectBgColor,
        borderRadius: 5,
        marginHorizontal: '20rem',
        marginVertical: '7rem',
    },
    subContainer: {
       marginBottom: '65rem'
    },
    button: {
        flexDirection: 'row',
        backgroundColor: colors.lightBlue,
        borderRadius: 5,
        marginTop: '17rem',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
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
    bottomBarIcon: {
        width: '20rem',
        height: '20rem',
    },
    userView: {
        backgroundColor: colors.projectBgColor,
        borderRadius: 5,
        height: '60rem',
        // marginTop: '7rem',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '12rem',
        // marginHorizontal: '20rem',
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
      subText: {
        fontSize: '10rem',
        color: 'gray',
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
      },
      subTitle: {
        marginHorizontal: '20rem',
        fontSize: '16rem',
        color: 'black',
        fontFamily: 'CircularStd-Medium',
        textAlign: 'left',
        top: '12rem',
        fontWeight: 'bold'
      },
      progressBarContainer: {
        marginHorizontal: '10rem',
        marginVertical: '7rem',
      }
});

const mapStateToProps = state => {
    return {};
};
export default connect(
    mapStateToProps,
    actions,
)(PeopleScreen);
