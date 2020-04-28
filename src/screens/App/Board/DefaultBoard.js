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
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import { NavigationEvents } from 'react-navigation';
const initialLayout = { width: entireScreenWidth };

class DefaultBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [
                {
                    taskId: "068d165b-b527-4a5a-81de-4e276e415a2f",
                    taskName: "Add task iOS bug test.",
                    projectId: "29371ddb-6679-4d5a-9fc2-6e37f05091e7",
                    taskAssignee: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskInitiator: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskNote: "",
                    taskStatus: "pending",
                    taskCreatedAt: "2020-04-27T07:25:09.000+0000",
                    taskDueDateAt: null,
                    taskReminderAt: null,
                    taskAssigneeProfileImage: "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                    sprintId: "default",
                    deleted: false
                },
                {
                    taskId: "068d165b-b527-4a5a-81de-4e276e415a2f",
                    taskName: "Add task iOS bug test.",
                    projectId: "29371ddb-6679-4d5a-9fc2-6e37f05091e7",
                    taskAssignee: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskInitiator: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskNote: "",
                    taskStatus: "closed",
                    taskCreatedAt: "2020-04-27T07:25:09.000+0000",
                    taskDueDateAt: null,
                    taskReminderAt: null,
                    taskAssigneeProfileImage: "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                    sprintId: "default",
                    deleted: false
                },
                {
                    taskId: "068d165b-b527-4a5a-81de-4e276e415a2f",
                    taskName: "Add task iOS bug test.",
                    projectId: "29371ddb-6679-4d5a-9fc2-6e37f05091e7",
                    taskAssignee: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskInitiator: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskNote: "",
                    taskStatus: "pending",
                    taskCreatedAt: "2020-04-27T07:25:09.000+0000",
                    taskDueDateAt: null,
                    taskReminderAt: null,
                    taskAssigneeProfileImage: "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                    sprintId: "default",
                    deleted: false
                },
                {
                    taskId: "068d165b-b527-4a5a-81de-4e276e415a2f",
                    taskName: "Add task iOS bug test.",
                    projectId: "29371ddb-6679-4d5a-9fc2-6e37f05091e7",
                    taskAssignee: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskInitiator: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskNote: "",
                    taskStatus: "pending",
                    taskCreatedAt: "2020-04-27T07:25:09.000+0000",
                    taskDueDateAt: null,
                    taskReminderAt: null,
                    taskAssigneeProfileImage: "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                    sprintId: "default",
                    deleted: false
                },
                {
                    taskId: "068d165b-b527-4a5a-81de-4e276e415a2f",
                    taskName: "Add task iOS bug test.",
                    projectId: "29371ddb-6679-4d5a-9fc2-6e37f05091e7",
                    taskAssignee: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskInitiator: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskNote: "",
                    taskStatus: "pending",
                    taskCreatedAt: "2020-04-27T07:25:09.000+0000",
                    taskDueDateAt: null,
                    taskReminderAt: null,
                    taskAssigneeProfileImage: "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                    sprintId: "default",
                    deleted: false
                },
                {
                    taskId: "068d165b-b527-4a5a-81de-4e276e415a2f",
                    taskName: "Add task iOS bug test.",
                    projectId: "29371ddb-6679-4d5a-9fc2-6e37f05091e7",
                    taskAssignee: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskInitiator: "138bbb3d-02ed-4d72-9a03-7e8cdfe89eff",
                    taskNote: "",
                    taskStatus: "closed",
                    taskCreatedAt: "2020-04-27T07:25:09.000+0000",
                    taskDueDateAt: null,
                    taskReminderAt: null,
                    taskAssigneeProfileImage: "https://arimac-pmtool.s3-ap-southeast-1.amazonaws.com/profileImage_1584904875259_image_4.jpg",
                    sprintId: "default",
                    deleted: false
                },
            ]
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentDidMount() {

    }

    renderTaskList(item) {
        return (
            <TouchableOpacity style={styles.mainContainer}>
                <NavigationEvents onWillFocus={payload => this.tabOpen(payload)} />
                <View style={styles.userView}>
                    {this.userIcon(item)}
                    <View style={{ flex: 1, bottom: 15 }}>
                        <Text style={styles.text}>{item.taskName}</Text>
                        <Text style={styles.subText}>{item.taskId}</Text>
                    </View>
                    {this.userImage(item)}
                </View>
            </TouchableOpacity>
        );
    }

    userImage = function (item) {
        let userImage = item.taskAssigneeProfileImage;
        if (userImage) {
            return (
                <FadeIn>
                    <Image
                        source={{ uri: userImage }}
                        style={{ width: 24, height: 24, borderRadius: 24 / 2, top: 20 }}
                    />
                </FadeIn>
            );
        } else {
            return (
                <Image
                    style={{ width: 24, height: 24, borderRadius: 24 / 2, top: 20 }}
                    source={require('../../../asserts/img/defult_user.png')}
                />
            );
        }
    };

    userIcon = function (item) {
        if (item.taskStatus == 'closed') {
            return (
                <FadeIn>
                    <Image
                        source={require('../../../assest/icons/task_complete.png')}
                        style={{ width: 40, height: 40, borderRadius: 40 / 2, bottom: 15 }}
                    />
                </FadeIn>
            );
        } else {
            return (
                <Image
                    style={{ width: 40, height: 40, borderRadius: 40 / 2, backgroundColor: '#edf0f5', bottom: 15 }}
                />
            );
        }
    };


    render() {

        return (
            <View>
                <View >
                    <ScrollView style={styles.subContainer}>
                        <FlatList
                            style={styles.flalList}
                            data={this.state.tasks}
                            renderItem={({ item }) => this.renderTaskList(item)}
                            keyExtractor={item => item.projId}
                        // onRefresh={() => this.onRefresh()}
                        // refreshing={isFetching}
                        />
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const styles = EStyleSheet.create({

    subContainer: {
        marginBottom: '65rem',
        backgroundColor: colors.projectBgColor,
        borderRadius: 5,
        marginHorizontal: '20rem',
        marginTop: '7rem',
        marginBottom: 200
    },
    flalList: {
        marginTop: '8rem',
        marginBottom: '4rem',
    },
    mainContainer: {
        backgroundColor: colors.projectBgColor,
        borderRadius: 5,
        marginHorizontal: '8rem',
        marginBottom: '8rem',
    },
    userView: {
        backgroundColor: 'white',
        borderRadius: 5,
        height: '80rem',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '12rem'
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
)(DefaultBoard);
