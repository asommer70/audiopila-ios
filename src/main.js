import React, { Component } from 'react';
import { Router, Scene, TabBar, Modal, Actions } from 'react-native-router-flux';

import Settings from './settings';
import Audios from './audios';
import Pilas from './pilas';
import PilaAudios from './pila_audios';
import PilasModal from './pilas_modal';
import TabIcon from './components/tabicon';

import { colors } from './styles/main_styles';

export default class Main extends Component {
  constructor() {
    super();

    this.state = {
      dirSync: false
    }
  }

  dirSync() {
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
              rightButtonTextStyle={{color: colors.secondaryTwo}}
              onLeft={() => Actions.pilas()}
              leftTitle={"Pilas"}
              leftButtonTextStyle={{color: colors.secondaryTwo}}
              component={Audios}
              title="Audios"
              initial={true}
              icon={TabIcon}
              navigationBarStyle={{backgroundColor: colors.primaryOne}}
              titleStyle={{color: colors.secondaryTwo}}
            />
            <Scene
              key="settings"
              component={Settings}
              title="Settings"
              icon={TabIcon}
              navigationBarStyle={{backgroundColor: colors.primaryOne}}
              titleStyle={{color: colors.secondaryTwo}}
              backButtonImage={require('./img/back-icon.png')}
            />
            <Scene
              key="pilas"
              component={Pilas}
              title="Pilas"
              icon={TabIcon}
              navigationBarStyle={{backgroundColor: colors.primaryOne}}
              titleStyle={{color: colors.secondaryTwo}}
              backButtonImage={require('./img/back-icon.png')}
            />
            <Scene
              key="pilaAudios"
              component={PilaAudios}
              title="Pila Audios"
              icon={TabIcon}
              navigationBarStyle={{backgroundColor: colors.primaryOne}}
              titleStyle={{color: colors.secondaryTwo}}
              backButtonImage={require('./img/back-icon.png')}
            />
            <Scene
              key="pilasModal"
              component={PilasModal}
              navigationBarStyle={{backgroundColor: colors.primaryOne}}
              titleStyle={{color: colors.secondaryTwo}}
              backButtonImage={require('./img/back-icon.png')}
            />
        </Scene>
      </Router>
    )
  }
}
