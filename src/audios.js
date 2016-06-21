import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Slider
} from 'react-native';
var RNFS = require('react-native-fs');
var Sound = require('react-native-sound');

import Button from './components/button';

// Can sync audio files to the RNFS.DocumentDirectoryPath.
// Can't play OGG files...

// RNFS.downloadFile({
//   fromUrl: 'http://localhost:8080/01%20Keep%20Your%20Hands%20Off%20Her.mp3',
//   // fromUrl: 'http://localhost:8080/01%20Babel.mp3',
//   toFile: RNFS.DocumentDirectoryPath + '/Keep_Your_Hands_Off_Her.mp3',
//   // toFile: RNFS.DocumentDirectoryPath + '/Babel.mp3',
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
      currentAudioName: '',
      audioProgress: 0,
    }
  }

  componentDidMount() {
    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((audios) => {
        console.log('audios:', audios);
        // RNFS.unlink(audios[1].path);

        // TODO:as Get progress time from local store and set Audio's progressBar.
        // TODO:as Save audio details into the store.  Name, duration, playbackTime, etc.

        this.setState({audios})
      });
  }

  setAudio(idx) {
    // AudioPlayer.play(this.state.audios[idx].path);
    if (this.state.currentAudio == undefined) {
      this.setCurrentAudio(this.state.audios[idx]);
    } else if (this.state.currentAudioName != this.state.audios[idx].name) {
      this.state.currentAudio.stop();
      this.state.currentAudio.release();
      this.setCurrentAudio(this.state.audios[idx]);
    } else {
      this.play();
    }
  }

  setCurrentAudio(audioFile) {
    var audio = new Sound(audioFile.name, RNFS.DocumentDirectoryPath, (e) => {
      if (e) {
        console.log('error', e);
        this.setState({currentAudio: undefined});
      } else {
        // console.log('duration', s.getDuration());
        this.setState({currentAudio: audio, currentAudioName: audioFile.name}, () => {
          this.play();
        });
      }
    });
  }

  setProgress(value) {
    console.log('value:', value);
    this.setState({audioProgress: value}, () => {
      this.state.currentAudio.setCurrentTime(value);
    })
  }

  play() {
    console.log('currentAudio.getDuration:', this.state.currentAudio.getDuration());
    this.state.currentAudio.getCurrentTime((seconds, isPlaying) => {
      console.log('seconds:', seconds, 'isPlaying:', isPlaying);
      if (isPlaying == true) {
        this.state.currentAudio.pause();
        this.setState({audioProgress: seconds});

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
                <Text style={styles.instructions}>{audio.name}</Text>

                <Button text={'Play/Pause'} onPress={this.setAudio.bind(this, idx)} idx={idx} />

                <Slider value={this.state.audioProgress} maximumValue={197} onSlidingComplete={(value) => this.setProgress(value)} />
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

  progressView: {
    marginTop: 10,
  },
});
