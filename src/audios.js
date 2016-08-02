import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Alert
} from 'react-native';
var RNFS = require('react-native-fs');
var Sound = require('react-native-sound');
var store = require('react-native-simple-store');
import {Actions} from 'react-native-router-flux';
import MusicControl from 'react-native-music-control';

import Button from './components/button';
import ImageButton from './components/image_button';
import Audio from './components/audio';
import CurrentAudio from './components/current_audio';
import styles from './styles/main_styles';

export default class Audios extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      files: [],
      audios: {},
      currentAudio: undefined,
      currentAudioName: '',
      dataSource: this.ds.cloneWithRows({}),
      playing: false,
    }

    this.setAudios();
  }

  componentDidMount() {
    MusicControl.enableBackgroundMode(true);
    MusicControl.enableControl('pause', true);
    MusicControl.enableControl('play', true);
    // MusicControl.enableControl('togglePlayPause', true);
    // MusicControl.enableControl('artwork', true);
    MusicControl.enableControl('skipForward', true, {interval: 5});
    MusicControl.enableControl('skipBackward', true, {interval: 5});

    MusicControl.on('play', ()=> {
      console.log('lock play...');
      this.play();
    })

    MusicControl.on('pause', ()=> {
      console.log('lock pause...');
      this.play();
      MusicControl.resetNowPlaying();
    })

    MusicControl.on('togglePlayPause', () => {
      console.log('lock play/pause...');
      // this.play();
    })

    MusicControl.on('skipBackward', () => console.log('skipBackward...'));
    MusicControl.on('skipForward', () => console.log('skipForward...'));
  }

  setAudios() {
    store.get('audios')
      .then((audios) => {
        if (!audios) {
          audios = {};
        }

        RNFS.readDir(RNFS.DocumentDirectoryPath)
          .then((files) => {
            files = this.removeStoreFile(files);

            // var audios = this.state.audios.
            files.forEach((file) => {
              var s = new Sound(file.name, RNFS.DocumentDirectoryPath, (e) => {
                if (e) {
                  if (this.props.download == true) {
                    Alert.alert('Failed to download file.');
                  }
                  RNFS.unlink(file.path);
                  s.release();
                  return;
                }

                file.slug = file.name.slice(0, file.name.length - 4).replace(/\s/g, '_').replace(/\./g, '_').toLowerCase();
                file.duration = s.getDuration();

                // Get the playbackTime.
                var audio = audios[file.slug];

                if (audio != null || audio != undefined) {
                  file.playbackTime = audio.playbackTime;
                } else if (this.props.download == true && this.props.audio != undefined) {
                  file.playbackTime = this.props.audio.playbackTime;
                } else {
                  file.playbackTime = 0;
                }

                if (audio && audio.hasOwnProperty('playedTime')) {
                  file.playedTime = audio.playedTime;
                }

                file.repository = {name: 'root', path: '/', slug: 'root'};
                for (var key in audios) {
                  if (audios[key].deleted) {
                    delete audios[key];
                  }
                }

                audios[file.slug] = file;
                store.update('audios', audios);
                this.setState({ audios: audios, dataSource: this.ds.cloneWithRows(audios) });

                this.getLastPlayed();
                s.release();
              })
            })
          });
      })
  }

  getLastPlayed() {
    store.get('lastPlayed')
      .then((audio) => {
        if (audio && this.state.audios[audio.slug] != undefined) {
          this.setCurrentAudio(audio, false);
        }
      })
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
      this.setCurrentAudio(this.state.audios[slug], true);
    } else if (this.state.currentAudioName != this.state.audios[slug].name) {
      this.state.currentAudio.stop();
      this.state.currentAudio.release();
      this.setCurrentAudio(this.state.audios[slug], true);
    } else {
      this.play();
    }
  }

  setCurrentAudio(audioFile, playNow) {
    var audio = new Sound(audioFile.name, RNFS.DocumentDirectoryPath, (e) => {
      audio.name = audioFile.name;
      audio.setCategory('Playback');
      // audio.enableInSilenceMode = true;
      if (e) {
        this.setState({currentAudio: undefined});
      } else {
        audio.slug = audioFile.slug;
        audio.setCurrentTime(audioFile.playbackTime);
        this.setState({currentAudio: audio, currentAudioName: audioFile.name, playing: playNow}, () => {
          if (playNow) {
            this.play();
          }
        });
      }
    });
  }

  setProgress(value, audio) {
    if (this.state.currentAudio) {
      this.setState({playbackTime: value}, () => {
        this.state.currentAudio.setCurrentTime(value);
      })
    } else {
      store.get('audios')
        .then((audios) => {
          audios[audio.slug].playbackTime = value;
          store.save('audios', audios)
            .then(() => {
              this.setAudios();
            })
        })
    }
  }

  deleteAudio(slug) {
    // Remove entry from local storage.
    store.get('audios')
      .then((audios) => {
        if (audios != null) {
          var audio = audios[slug];
          var path = audio.path;

          // Mark the Audio as being deleted.
          audios[slug].deleted = true;
          audios[slug].path = undefined;
          store.update('audios', audios);

          // Remove file from file system.
          Alert.alert('Delete Audio', 'Are you sure you want to delete: ' + audio.name, [
            {text: 'Cancel', onPress: () => {}},
            {text: 'OK', onPress: () => {
              RNFS.unlink(path)
                .then(() => {

                  // Remove entry from this.state.audios.
                  delete audios[slug];

                  if (this.state.currentAudio.name == audio.name) {
                    lastPlayed = undefined;
                  } else {
                    lastPlayed = this.state.currentAudio;
                  }

                  this.setAudios();
                })
                .catch((error) => {
                  Alert.alert(error.message);
                });
            }}
          ])
        }
      })
  }

  play() {
    if (this.state.currentAudio) {
      this.state.currentAudio.getCurrentTime((seconds, isPlaying) => {
        if (isPlaying == true) {
          this.state.currentAudio.pause();

          // Update the current Audios.
          var audios = this.state.audios;
          audios[this.state.currentAudio.slug].playbackTime = seconds;
          this.setState({playing: false, audios: audios, dataSource: this.ds.cloneWithRows(audios)});

          // Save playbackTime to store.
          store.get('audios')
            .then((audios) => {
              if (audios != null) {
                this.savePlaybackTime(seconds);
              }
            })
        } else {
          var audios = this.state.audios;
          audios[this.state.currentAudio.slug].playedTime = Date.now();

          var currentAudio = this.state.currentAudio;
          currentAudio.playedTime = Date.now();

          this.state.currentAudio.play(() => {
            // Reset playbackTime to 0 onEnd.
            this.savePlaybackTime(0, () => {
              audios[this.state.currentAudio.slug].playbackTime = 0;

              // Setting the name too because it didn't seem to refresh without it for whatever reason...
              audios[this.state.currentAudio.slug].name = audios[this.state.currentAudio.slug].name + ' ';

              this.setState({ audios: audios, dataSource: this.ds.cloneWithRows(audios), playing: false });
            });
          });

          store.get('audios')
            .then((audios) => {
              if (audios) {
                var audio = audios[this.state.currentAudio.slug];
                MusicControl.setNowPlaying({
                  title: this.state.currentAudio.name,
                  artwork: 'https://raw.githubusercontent.com/asommer70/audiopila-ios/master/affinity/exports/icon-60%403x.png',
                  elapsedPlaybackTime: audio.playbackTime,
                  playbackDuration: audio.duration,
                  // playbackQueueCount: 1,
                  // playbackQueueIndex: 0,
                  // persistentID: audio.name
                })
              }
            })

          this.setState({playing: true, audios: audios, dataSource: this.ds.cloneWithRows(audios)});
        }
        // this.getLastPlayed();
      })
    }
  }

  savePlaybackTime(seconds, callback) {
    // Save playbackTime to store.
    store.get('audios')
      .then((audios) => {
        if (audios != null) {
          var audio = audios[this.state.currentAudio.slug];
          audios[audio.slug].playbackTime = seconds;
          audios[audio.slug].playedTime = Date.now();
          audio.playedTime = Date.now();

          store.update('audios', audios);
          store.save('lastPlayed', audio);

          if (callback) {
            callback();
          }
        }
      })
  }

  choosePila(slug) {
    Actions.pilasModal({title: 'Upload To', audio: this.state.audios[slug]});
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
        <View style={styles.cardWrapper}>
          <Audio
            audio={rowData}
            setAudio={this.setAudio.bind(this)}
            setProgress={this.setProgress.bind(this)}
            deleteAudio={this.deleteAudio.bind(this)}
            choosePila={this.choosePila.bind(this)}
          />
        </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <CurrentAudio
          playing={this.state.playing}
          currentAudio={this.state.currentAudio ? this.state.currentAudio : {name: 'Nothing playing... yet.', disabled: true}}
          onPress={this.play.bind(this)}
        />

        <ListView
          style={styles.audioList}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
        />
      </View>
    );
  }
}
