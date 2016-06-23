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

export default class Audios extends Component {
  constructor(props) {
    super(props);

    this.state = {
      files: [],
      audios: {},
      currentAudio: undefined,
      currentAudioName: '',
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

            // Get the playbackTime.
            store.get(file.slug)
              .then((audio) => {
                if (audio != null) {
                  file.playbackTime = audio.playbackTime;
                } else {
                  file.playbackTime = 0;
                  store.save(file.slug, file);
                }

                audios[file.slug] = file;

                this.setState({audios: audios});
                s.release();
              })
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
    if (this.state.currentAudio == undefined) {
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
        audio.slug = audioFile.slug;
        audio.setCurrentTime(audioFile.playbackTime);
        this.setState({currentAudio: audio, currentAudioName: audioFile.name}, () => {
          this.play();
        });
      }
    });
  }

  setProgress(value) {
    console.log('value:', value);
    this.setState({playbackTime: value}, () => {
      this.state.currentAudio.setCurrentTime(value);
    })
  }

  play() {
    this.state.currentAudio.getCurrentTime((seconds, isPlaying) => {
      if (isPlaying == true) {
        this.state.currentAudio.pause();

        // Save playbackTime to store.
        console.log('this.state.currentAudio.slug:', this.state.currentAudio);
        console.log('this.state.audios:', this.state.audios);
        store.get(this.state.currentAudio.slug)
          .then((audio) => {
            console.log('audio:', audio);
            if (audio != null) {
              store.update(audio.slug, {playbackTime: seconds});
            }
          })
      } else {
        this.state.currentAudio.play();
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        {
          Object.keys(this.state.audios).map((key) => {
            return (
              <View key={key}>
                <Audio audio={this.state.audios[key]} setAudio={this.setAudio.bind(this)} setProgress={this.setProgress.bind(this)} />
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

  instructions: {
    textAlign: 'center',
    color: '#424242',
    marginBottom: 5,
  },

  progressView: {
    marginTop: 10,
  },
});
