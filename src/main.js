import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';

import Settings from './settings';
import Audios from './audios';

export default class Main extends Component {
  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="audios" component={Audios} title="Audios" initial={true} />
          <Scene key="settings" component={Settings} title="Settings" />
        </Scene>
      </Router>
    )
  }
}
