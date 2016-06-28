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

import Button from './components/button';
import ImageButton from './components/image_button';
import Audio from './components/audio';
import CurrentAudio from './components/current_audio';

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

  setAudios() {
    // this.syncFiles();
    RNFS.readDir(RNFS.DocumentDirectoryPath)
      .then((files) => {
        files = this.removeStoreFile(files);

        var audios = this.state.audios;
        files.forEach((file) => {
          var s = new Sound(file.name, RNFS.DocumentDirectoryPath, (e) => {
            if (e) {
              console.log('setAudios new Sound error:', e, 'file:', file);
              if (this.props.download == true) {
                Alert.alert('Failed to download file.');
              }
              RNFS.unlink(file.path);
              s.release();
              return;
            }

            file.slug = file.name.slice(0, file.name.length - 4).replace(/\s/g, '_').toLowerCase();
            file.duration = s.getDuration();

            // Get the playbackTime.
            store.get(file.slug)
              .then((audio) => {
                if (audio != null) {
                  file.playbackTime = audio.playbackTime;
                  store.update(file.slug, file);
                } else {
                  file.playbackTime = 0;
                  store.save(file.slug, file);
                }

                audios[file.slug] = file;

                this.setState({ audios: audios, dataSource: this.ds.cloneWithRows(audios) });
                s.release();
                this.getLastPlayed();
              })
          })
        })
      });
  }

  getLastPlayed() {
    store.get('lastPlayed')
      .then((audio) => {
        if (audio) {
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
      if (e) {
        console.log('setCurrentAudio error:', e);
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

  setProgress(value) {
    this.setState({playbackTime: value}, () => {
      this.state.currentAudio.setCurrentTime(value);
    })
  }

  deleteAudio(slug) {
    // Remove entry from local storage.
    store.get(slug)
      .then((audio) => {
        if (audio != null) {
          // Remove file from file system.
          Alert.alert('Delete Audio', 'Are you sure you want to delete: ' + audio.name, [
            {text: 'Cancel', onPress: () => console.log('Delete canceled...') },
            {text: 'OK', onPress: () => {
              RNFS.unlink(audio.path)
                .then(() => {
                  // Remove entry from this.state.audios.
                  var audios = this.state.audios;
                  delete audios[slug];
                  this.setState({audios: audios, dataSource: this.ds.cloneWithRows(audios)});
                })
                .catch((error) => {
                  console.log('RNFS.unlink error:', error);
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
          this.setState({playing: false});

          // Save playbackTime to store.
          store.get(this.state.currentAudio.slug)
            .then((audio) => {
              if (audio != null) {
                store.update(audio.slug, {playbackTime: seconds});

                store.get('lastPlayed')
                  .then((lastAudio) => {
                    if (lastAudio) {
                      store.update('lastPlayed', audio)
                    } else {
                      store.save('lastPlayed', audio)
                    }
                  })
              }
            })
        } else {
          this.state.currentAudio.play();
          this.setState({playing: true});
        }
      })
    }
  }

  _renderRow(rowData, sectionID, rowID) {
  return (
      <View style={styles.audio}>
        <Audio
          audio={rowData}
          setAudio={this.setAudio.bind(this)}
          setProgress={this.setProgress.bind(this)}
          deleteAudio={this.deleteAudio.bind(this)}
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
          renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator}/>}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  audioList: {
    marginTop: 5,
  },

  separator: {
    height: 1,
    backgroundColor: '#DBDEE3',
  },

  audio: {
    marginTop: 10,
    padding: 10
  },
});
