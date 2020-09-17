import React, {Component} from 'react';
import {ScrollView, Dimensions} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
const entireScreenWidth = Dimensions.get('window').width;
EStyleSheet.build({$rem: entireScreenWidth / 380});
const {height, width} = Dimensions.get('window');
import * as actions from '../redux/actions';
import {connect} from 'react-redux';

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';

class PopupMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
    };
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.addPeopleModelVisible !== this.props.addPeopleModelVisible &&
      this.props.addPeopleModelVisible
    ) {
      this.setState({opened: this.props.addPeopleModelVisible});
    }

    if (
      prevProps.addPeopleModelVisible !== this.props.addPeopleModelVisible &&
      !this.props.addPeopleModelVisible
    ) {
      this.setState({opened: this.props.addPeopleModelVisible});
    }
  }

  componentDidMount() {
    this.setState({opened: this.props.open});
  }

  async onBackdropPress() {
    this.setState({opened: false});
    await this.props.addPeopleModal(false);
  }

  render() {
    return (
      <Menu
        opened={this.state.opened}
        onBackdropPress={() => this.onBackdropPress()}
        onSelect={value => this.onOptionSelect(value)}>
        <MenuTrigger>{this.props.menuTrigger}</MenuTrigger>
        <MenuOptions customStyles={optionsStyles}>
          <ScrollView style={{maxHeight: 250}}>
            {this.props.data.map(item => {
              return (
                <MenuOption onSelect={() => this.props.onSelect(item)}>
                  {this.props.menuOptions(item)}
                </MenuOption>
              );
            })}
          </ScrollView>
        </MenuOptions>
      </Menu>
    );
  }
}

const optionsStyles = {
  optionsContainer: {
    marginTop: 40,
    width: '90%',
    marginLeft: 20,
  },
};

const styles = EStyleSheet.create({});

const mapStateToProps = state => {
  return {
    addPeopleModelVisible: state.project.addPeopleModelVisible,
  };
};
export default connect(
  mapStateToProps,
  actions,
)(PopupMenu);
