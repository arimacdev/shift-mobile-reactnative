import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import Collapsible from 'react-native-collapsible';
import Accordion from 'react-native-collapsible/Accordion';

export default class CollapsibleView extends Component {



  render() {
    return (
      <Collapsible collapsed={isCollapsed}>
        <SomeCollapsedView />
      </Collapsible>
    );
  }
}
