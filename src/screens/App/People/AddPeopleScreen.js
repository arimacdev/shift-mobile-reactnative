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

class AddPeopleScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            role: '',
            isSelected: true
        };
    }

    componentDidUpdate(prevProps, prevState, snapshot) { }

    componentDidMount() { }

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
                <View style={[styles.taskFieldView, { marginTop: 30 }]}>
                    <TextInput
                        style={[styles.textInput, { width: '95%' }]}
                        placeholder={'Type a name to add'}
                        value={this.state.name}
                        onChangeText={text => this.onPeopleNameChange(text)}
                    />
                </View>
                <View style={[styles.taskFieldView]}>
                    <TextInput
                        style={[styles.textInput, { width: '95%' }]}
                        placeholder={'Role'}
                        value={this.state.role}
                        onChangeText={text => this.onPeopleNameChange(text)}
                    />
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
                <View style={styles.bottomButtonContainer}>
                    <TouchableOpacity onPress={() => this.saveProject()}>
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
                    <TouchableOpacity onPress={() => this.saveProject()}>
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
        flexDirection: 'column' 
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
        fontFamily: 'HelveticaNeuel',
        textAlign: 'left',
        // width: '95%'
    },
    checkBoxText: {
        fontSize: '12rem',
        color: colors.gray,
        textAlign: 'center',
        lineHeight: '17rem',
        fontFamily: 'HelveticaNeuel',
        textAlign: 'left',
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
        fontFamily: 'HelveticaNeuel',
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
    }
});

const mapStateToProps = state => {
    return {};
};
export default connect(
    mapStateToProps,
    actions,
)(AddPeopleScreen);
