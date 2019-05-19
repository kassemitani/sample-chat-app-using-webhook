'use strict';
import React, {Component} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Platform
} from 'react-native';

import {autobind} from 'core-decorators';
import {observer} from 'mobx-react/native';
import {GiftedChat} from 'react-native-gifted-chat';

const maxHeight = Platform.OS === 'ios' ? Dimensions.get('window').height - 65 : Dimensions.get('window').height - 85;

@observer @autobind
export default class Chat extends Component {
  static navigationOptions = ({navigation}) => ({
    title: 'eAgronom Chat',
    gesturesEnabled: false
  });

  componentDidMount() {
    console.log('componentDidMount !');
    this.props.screenProps.store.retrieveQueueMessages();
    this.props.screenProps.store.retrieveMessages();
  }

  render() {
    return (
      <View style={styles.container}>
        { <GiftedChat
          ref={(c) => this._GiftedMessenger = c}
          // user={{_id: this.props.screenProps.store.user._id}}
          messages={this.props.screenProps.store.messages.slice()}
          onSend={this.props.screenProps.store.sendMessage}
          keyboardDismissMode='on-drag'
          autoFocus={false}
          maxHeight={maxHeight}
        />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white'
  },
  banner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 5,
    backgroundColor: '#E98B50',
    opacity: 0.8
  },
  bannerText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 13,
    textAlign: 'center'
  }
});


