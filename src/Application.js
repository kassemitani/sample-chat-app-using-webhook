import React, {Component} from 'react';
import {View} from 'react-native';
import {autobind} from 'core-decorators';
// import {action, observable} from 'mobx';
import {observer} from 'mobx-react/native';
import {StackNavigator} from 'react-navigation';

import {Chat} from './screens'

import Store from './Store';


const MainNavigator = StackNavigator({
  Chat: {screen: Chat},
}, {mode: 'modal'});

@autobind @observer
export default class Application extends Component {
  constructor(props) {
    super(props);
    this.store = new Store();
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {<MainNavigator screenProps={{store: this.store}}/>}
      </View>
    );
  }

}