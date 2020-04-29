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
import Collapsible from '../../../components/CollapsibleView';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../../../components/Loader';
import { NavigationEvents } from 'react-navigation';
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
                    isDeleted: false,
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
                        }
                    ]
                },
                {
                    sprintId: "1259d276-c79a-4a7d-9ae2-a517b1a61621",
                    projectId: "e1e4b8c2-70a0-4600-96b7-f7c28be1dbf3",
                    sprintName: "Sprint 5",
                    sprintDescription: "2020-05-15 - 2020-05-21",
                    sprintCreatedBy: "d159877c-b01d-4447-a798-0821293d968a",
                    sprintCreatedAt: "2020-04-21T10:47:10.000+0000",
                    sprintStartDate: null,
                    sprintEndDate: null,
                    isDeleted: false,
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
                        }
                    ]
                }
            ],
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentDidMount() {

    }

    renderItemMainTile(data) {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.item}>
                    <View style={styles.title_container} >
                        <Text style={styles.title}>{data.item.sprintName}</Text>
                        <Text style={styles.sub_txt}>{data.item.sprintName}</Text>
                    </View>

                    <ScrollView style={styles.sub_scrollView}>
                        <FlatList
                            data={data.item.tasks}
                            renderItem={this.renderItemSubTile.bind(this)}
                            keyExtractor={item => item.id}
                        />
                    </ScrollView>
                </View>
            </View>
        );
    }

    renderItemSubTile(data) {
        return (
            <View style={{ flex: 1 }}>
                <View style={styles.sub_item}>
                    <View style={{ flex: 1 }}>
                        {this.userIcon(data.item)}
                    </View>
                    <View style={{ flex: 6 }}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.text}>{data.item.taskName}</Text>
                            <Text style={styles.subText}>{data.item.taskId}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 1 }}>
                        {this.userImage(data.item)}
                    </View>
                </View>
            </View>
        );
    }

    userImage = function (item) {
        let userImage = item.taskAssigneeProfileImage;
        if (userImage) {
            return (
                <FadeIn>
                    <Image
                        source={{ uri: userImage }}
                        style={{ width: 24, height: 24, borderRadius: 24 / 2, top: 50, left: 4 }}
                    />
                </FadeIn>
            );
        } else {
            return (
                <Image
                    style={{ width: 24, height: 24, borderRadius: 24 / 2, top: 50, left: 4 }}
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
                        style={{ width: 40, height: 40, borderRadius: 40 / 2 }}
                    />
                </FadeIn>
            );
        } else {
            return (
                <Image
                    style={{ width: 40, height: 40, borderRadius: 40 / 2, backgroundColor: '#edf0f5' }}
                />
            );
        }
    };

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
                    <ScrollView style={styles.scrollView}>
                        <FlatList
                            data={this.state.sprints}
                            horizontal={true}
                            renderItem={this.renderItemMainTile.bind(this)}
                            keyExtractor={item => item.id}
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
    item: {
        width: '300rem',
        marginHorizontal: 5,
        alignItems: 'center',
        marginLeft: '20rem',
        marginTop: '20rem',

    },
    sub_item: {
        width: '280rem',
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        height: '85rem',
        marginVertical: 7,
        padding: 5,
        marginLeft: 10,
        marginRight: 10,
        borderRadius: 5

    },
    title: {
        marginTop: '10rem',
        fontFamily: 'CircularStd-Medium',
        fontWeight: '400',
        color: '#ffffff'
    },
    sub_txt: {
        fontFamily: 'CircularStd-Medium',
        fontWeight: '400',
        marginBottom: '10rem',
        color: '#ffffff'
    },
    title_container: {
        backgroundColor: '#0bafff',
        width: '100%',
        alignItems: 'center',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
        // bo
    },
    sub_scrollView: {
        height: '250rem',
        backgroundColor: '#edf0f5'
    },
    userView: {
        backgroundColor: 'white',
        borderRadius: 5,
        height: '80rem',
        width: '100%',
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
)(OtherBoard);
