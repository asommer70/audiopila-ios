import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';
var RNFS = require('react-native-fs');
var Sound = require('react-native-sound');

import Button from './components/button';

// Can sync audio files to the RNFS.DocumentDirectoryPath.
// Can't play OGG files...

// RNFS.downloadFile({
//   // fromUrl: 'http://localhost:8080/Velvet%20Revolver/Contraband/Disc%201%20-%206%20-%20Fall%20to%20Pieces.ogg',
//   fromUrl: 'http://localhost:8080/01%20Keep%20Your%20Hands%20Off%20Her.mp3',
//   // toFile: RNFS.DocumentDirectoryPath + '/Fall_To_Pieces.ogg',
//   toFile: RNFS.DocumentDirectoryPath + '/Keep_Your_Hands_Off_Her.mp3',
// }).then((res, error) => {
//   console.log('res:', res, 'error:', error);
// }).catch((error) => {
//   console.log('error:', error);
// })

export default class Audios extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audios: [],
      currentAudio: undefined,
    }
  }

  componentDidMount() {
    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((audios) => {
        console.log('audios:', audios);
        this.setState({audios})
      });
  }

  setAudio(idx) {
    // AudioPlayer.play(this.state.audios[idx].path);
    if (this.state.currentAudio == undefined) {
      var audio = new Sound(this.state.audios[idx].name, RNFS.DocumentDirectoryPath, (e) => {
        if (e) {
          console.log('error', e);
          this.setState({currentAudio: undefined});
        } else {
          // console.log('duration', s.getDuration());
          this.setState({currentAudio: audio}, () => {
            this.play();
          });
        }
      });
    } else {
      this.play();
    }
  }

  play() {
    this.state.currentAudio.getCurrentTime((seconds, isPlaying) => {
      console.log('seconds:', seconds, 'isPlaying:', isPlaying);
      if (isPlaying == true) {
        this.state.currentAudio.pause();
      } else {
        this.state.currentAudio.play();
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Audios List
        </Text>

        {
          this.state.audios.map((audio, idx) => {
            return (
              <View key={audio.name}>
                <Button text={audio.name} onPress={this.setAudio.bind(this, idx)} idx={idx} />
              </View>
            )
          })
        }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#424242',
    marginBottom: 5,
  },
});
