import React, { Component } from 'react';
import {
    View,
    FlatList,
    Text,
    Dimensions,
    Image,
    TouchableOpacity,
    TextInput,
    ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import * as actions from '../../../redux/actions';
import colors from '../../../config/colors';
import icons from '../../../assest/icons/icons';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({ $rem: entireScreenWidth / 380 });
import { Dropdown } from 'react-native-material-dropdown';
import DateTimePicker from '@react-native-community/datetimepicker';
import DocumentPicker from 'react-native-document-picker';
import RoundCheckbox from 'rn-round-checkbox';
import moment from 'moment';
import PeopleScreen from './PeopleScreen';

class EditPeople extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            role: '',
            isSelected: true
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) { }

    componentDidMount() {
        const { navigation: { state: { params } } } = this.props;
        let peopleID = params.userItem;
        this.setState({
            role: peopleID.role,
            name: peopleID.firstName + ' ' + peopleID.lastName
        })
        console.log(peopleID)
    }

    onPeopleNameChange(text) {
        this.setState({ name: text });
    }

    onRoleChange(text) {
        this.setState({ role: text });
    }

    toggleCheckBox(newValue) {
        this.setState({ isSelected: !this.state.isSelected });
        console.log(newValue)
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={styles.topContainer}>
                    <View style={styles.editableLable}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.boxText}>Update the Role and Admin for</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={[styles.boxTextInput, { width: '100%' }]}
                                placeholder={this.state.name}
                                value={this.state.name}
                                editable={false}
                                onChangeText={text => this.onPeopleNameChange(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.editableLable}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.boxText}>Role</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                style={[styles.boxTextInput, { width: '100%' }]}
                                placeholder={this.state.role}
                                value={this.state.role}
                                onChangeText={text => this.onPeopleNameChange(text)}
                            />
                        </View>
                    </View>
                    <View style={styles.checkBoxContainer}>
                        <View style={{ flex: 1 }}>
                            <RoundCheckbox
                                size={18}
                                checked={this.state.isSelected}
                                backgroundColor={colors.lightGreen}
                                onValueChange={(newValue) => this.toggleCheckBox(newValue)}
                                borderColor={'gray'}
                            />
                        </View>
                        <View style={styles.CheckBoxLableContainer}>
                            <Text style={styles.checkBoxText}>Add as a Admin</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity>
                        <View style={styles.button}>
                            <Image
                                style={[styles.bottomBarIcon, { marginRight: 15, marginLeft: 10 }]}
                                source={icons.userWhite}
                                resizeMode={'center'}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.buttonText}>Save</Text>
                            </View>

                            <Image
                                style={[styles.addIcon, { marginRight: 10 }]}
                                source={icons.add}
                                resizeMode={'center'}
                            />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.buttonDelete}>
                            <Image
                                style={[styles.bottomBarIcon, { marginRight: 15, marginLeft: 10 }]}
                                source={icons.userWhite}
                                resizeMode={'center'}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </View>

                            <Image
                                style={[styles.addIcon, { marginRight: 10 }]}
                                source={icons.delete}
                                resizeMode={'center'}
                            />
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const styles = EStyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
    },
    topContainer: {
        marginTop: '20rem'
    },
    taskFieldView: {
        backgroundColor: colors.projectBgColor,
        borderRadius: 5,
        // width: '330rem',
        marginTop: '0rem',
        marginBottom: '7rem',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingHorizontal: '12rem',
        height: '60rem',
        marginHorizontal: '20rem',
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
        fontFamily: 'CircularStd-Book',
        textAlign: 'left',
        // width: '95%'
    },
    boxTextInput: {
        fontSize: '12rem',
        color: colors.gray,
        textAlign: 'center',
        lineHeight: '17rem',
        fontFamily: 'CircularStd-Book',
        textAlign: 'left',
        bottom: '5rem'
        // width: '95%'
    },
    checkBoxText: {
        fontSize: '12rem',
        color: colors.gray,
        textAlign: 'center',
        lineHeight: '17rem',
        fontFamily: 'CircularStd-Book',
        textAlign: 'left',
        // width: '95%'
    },
    boxText: {
        fontSize: '12rem',
        color: 'black',
        textAlign: 'center',
        // lineHeight: '10rem',
        fontWeight: 'bold',
        fontFamily: 'CircularStd-Book',
        textAlign: 'left',
        paddingTop: '20rem',
        marginHorizontal: '4rem',
        // width: '95%'
    },
    button: {
        flexDirection: 'row',
        backgroundColor: colors.lightGreen,
        borderRadius: 5,
        marginTop: '17rem',
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingHorizontal: '12rem',
        height: '55rem',
        marginHorizontal: '20rem',
    },
    buttonDelete: {
        flexDirection: 'row',
        backgroundColor: colors.lightRed,
        borderRadius: 5,
        marginTop: '10rem',
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
        fontFamily: 'CircularStd-Book',
        fontWeight: 'bold',
    },
    addIcon: {
        width: '28rem',
        height: '28rem',
    },
    bottomButtonContainer: {
        flex: 1,
        marginTop: '50%',

    },
    checkBoxContainer: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: '20rem',
    },
    CheckBoxLableContainer: {
        flex: 4,
        right: '40rem'
    },
    editableLable: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: colors.projectBgColor,
        borderRadius: 5,
        // width: '330rem',
        marginTop: '0rem',
        marginBottom: '7rem',
        // alignItems: 'center',
        // justifyContent: 'center',
        paddingHorizontal: '12rem',
        height: '70rem',
        marginHorizontal: '20rem',
    }
});

const mapStateToProps = state => {
    return {};
};
export default connect(
    mapStateToProps,
    actions,
)(EditPeople);
