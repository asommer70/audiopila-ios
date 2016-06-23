import React, { Component } from 'react';
import { Router, Scene, TabBar } from 'react-native-router-flux';

import Settings from './settings';
import Audios from './audios';
import TabIcon from './components/tabicon';

export default class Main extends Component {
  render() {
    return (
      <Router>
        <Scene key="root" tabs={true}>
            <Scene key="audios" component={Audios} title="Audios" initial={true} icon={TabIcon} navigationBarStyle={{backgroundColor:'green'}} titleStyle={{color:'white'}} />
            <Scene key="settings" component={Settings} title="Settings" icon={TabIcon} navigationBarStyle={{backgroundColor:'silver'}} titleStyle={{color:'white'}} />
        </Scene>
      </Router>
    )
  }
}
