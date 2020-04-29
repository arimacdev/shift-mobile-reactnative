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
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });
import Loader from '../../../components/Loader';
import moment from 'moment';
const initialLayout = { width: entireScreenWidth };

class DefaultBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tasks: [],
            dataLoading : false,
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    async componentDidMount() {
        let selectedProjectID = this.props.selectedProjectID;
        this.setState({dataLoading:true});
        taskData = await APIServices.getAllTaskInDefaultBoardData(selectedProjectID);
        if(taskData.message == 'success'){
            let dataArray = [];
            dataArray =  taskData.data.filter(function(obj) {
                return obj.sprintId == "default";
            });

            this.setState({
                tasks : dataArray,
                dataLoading:false
            });
        }else{
            this.setState({dataLoading:false});
        }
    }

    renderTaskList(item) {
        return (
            <TouchableOpacity style={styles.mainContainer}>
                <View style={styles.userView}>
                    {this.userIcon(item)}
                    <View style={{ flex: 1, bottom: 15 }}>
                        <Text style={styles.text}>{item.taskName}</Text>
                        {this.dateView(item)}
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

    dateView = function(item) {
        let date = item.taskDueDateAt;
        let currentTime = moment().format();
        let dateText = '';
        let color = '';
    
        let taskStatus = item.taskStatus;
        if (taskStatus == 'closed' && date) {
          // task complete
          dateText = moment(date).format('YYYY-MM-DD');
          color = '#36DD5B';
        } else if (taskStatus != 'closed' && date) {
          if (moment(date).isAfter(currentTime)) {
            dateText = moment(date).format('YYYY-MM-DD');
            color = '#0C0C5A';
          } else {
            dateText = moment(date).format('YYYY-MM-DD');
            color = '#ff6161';
          }
        } else {
          dateText = 'Add Due Date';
          color = '#000000';
        }
        
        return  <Text style={[styles.subText, {color: color}]}>{dateText}</Text>;
      };

    render() {
        let dataLoading = this.state.dataLoading
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
                {dataLoading && <Loader/>}
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
