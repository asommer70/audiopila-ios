import React, { Component } from 'react';
import { Router, Scene, TabBar, Modal, Actions } from 'react-native-router-flux';

import Settings from './settings';
import Audios from './audios';
import Pilas from './pilas';
import PilaAudios from './pila_audios';
import PilasModal from './pilas_modal';
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
            <Scene
              key="audios"
              onRight={() => Actions.settings()}
              rightTitle={"Settings"}
              onLeft={() => Actions.pilas()}
              leftTitle={"Pilas"}
              component={Audios}
              title="Audios"
              initial={true}
              icon={TabIcon}
              navigationBarStyle={{backgroundColor:'green'}}
              titleStyle={{color:'white'}}
            />
            <Scene
              key="settings"
              component={Settings}
              title="Settings"
              icon={TabIcon}
              navigationBarStyle={{backgroundColor:'silver'}}
              titleStyle={{color:'white'}}
            />
            <Scene
              key="pilas"
              component={Pilas}
              title="Pilas"
              icon={TabIcon}
              navigationBarStyle={{backgroundColor:'#424242'}}
              titleStyle={{color:'white'}}
            />
            <Scene
              key="pilaAudios"
              component={PilaAudios}
              title="Pila Audios"
              icon={TabIcon}
              navigationBarStyle={{backgroundColor:'orange'}}
              titleStyle={{color:'red'}}
            />
            <Scene key="pilasModal" component={PilasModal} />
        </Scene>
      </Router>
    )
  }
}
