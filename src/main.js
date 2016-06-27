import React, { Component } from 'react';
import { Router, Scene, TabBar, Actions } from 'react-native-router-flux';

import Settings from './settings';
import Audios from './audios';
import TabIcon from './components/tabicon';

export default class Main extends Component {
  constructor() {
    super();

    this.state = {
      dirSync: false
    }
  }

  dirSync() {
    console.log('dirSync...');
    this.setState({dirSync: true});
  }

  render() {
    return (
      <Router>
        <Scene key="root">
            <Scene key="audios" onRight={() => Actions.settings()} rightTitle={"Settings"} component={Audios} title="Audios" initial={true} icon={TabIcon} navigationBarStyle={{backgroundColor:'green'}} titleStyle={{color:'white'}} />
            <Scene key="settings" component={Settings} title="Settings" icon={TabIcon} navigationBarStyle={{backgroundColor:'silver'}} titleStyle={{color:'white'}} />
        </Scene>
      </Router>
    )
  }
}
