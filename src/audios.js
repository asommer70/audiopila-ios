import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Slider
} from 'react-native';
var RNFS = require('react-native-fs');
var Sound = require('react-native-sound');
var store = require('react-native-simple-store');

import Button from './components/button';
import Audio from './components/audio';

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
      files: [],
      audios: {},
      currentAudio: undefined,
      currentAudioName: '',
      audioProgress: 0,
    }
  }

  componentDidMount() {
    // this.syncFiles();
    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((files) => {
        files = this.removeStoreFile(files);

        var audios = this.state.audios;
        files.forEach((file) => {
          var s = new Sound(file.name, RNFS.DocumentDirectoryPath, (e) => {
            if (e) {
              console.log('error', e);
            }

            file.slug = file.name.slice(0, file.name.length - 4).replace(/\s/g, '_').toLowerCase();
            file.duration = s.getDuration();
            audios[file.slug] = file;

            this.setState({audios: audios});
            s.release();
          })
        })
      });
  }

  removeStoreFile(files) {
    // Remove the RCTAsyncLocalStorage_V1 entry.
    var storeIdx = files.findIndex((file) => {
      if (file.name == 'RCTAsyncLocalStorage_V1') {
        return true;
      }
    })
    if (storeIdx != -1) {
      files.splice(storeIdx, 1);
    }
    return files;
  }

  setAudio(slug) {
    console.log('slug:', slug);
    if (this.state.currentAudio == undefined) {
      console.log('this.state.audios[slug]:', this.state.audios[slug]);
      this.setCurrentAudio(this.state.audios[slug]);
    } else if (this.state.currentAudioName != this.state.audios[slug].name) {
      this.state.currentAudio.stop();
      this.state.currentAudio.release();
      this.setCurrentAudio(this.state.audios[slug]);
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
          Object.keys(this.state.audios).map((key) => {
            return (
              <View key={key}>
                <Audio audio={this.state.audios[key]} setAudio={this.setAudio.bind(this)} />
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
