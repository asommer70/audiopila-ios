import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ListView,
  ProgressViewIOS
} from 'react-native';
import {Actions} from 'react-native-router-flux';
var RNFS = require('react-native-fs');
var store = require('react-native-simple-store');
var DeviceInfo = require('react-native-device-info');
var moment = require('moment');

import Button from './components/button';
import ImageButton from './components/image_button';
import PilaApi from './lib/pila_api';
import styles, { colors } from './styles/main_styles';

export default class PilaAudios extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: this.ds.cloneWithRows(this.props.audios),
      downloading: false,
      progress: 0
    }
  }

  download(slug) {
    var audio = this.props.audios[slug];
    this.setState({downloading: true}, () => {
      const headers = {
        'Accept-Language': 'en-US'
      }

      // Check file extension.
      var ext = audio.name.substr(audio.name.length - 4);
      if (/\.mp3|\.m4a|\.mp4/g.exec(ext) !== null) {
        // this.updateProgress(info.totalBytesWritten / info.totalBytesExpectedToWrite);
        console.log('audio.httpUrl:', audio.httpUrl);
        RNFS.downloadFile({
          fromUrl: audio.httpUrl,
          toFile: RNFS.DocumentDirectoryPath + '/' + audio.name,
          progressDivider: 0,
          progress: (res) => {this.updateProgress(res.bytesWritten / res.contentLength)}
        })
        .then((response) => {
          console.log('response:', response);
          Actions.audios({type: 'reset', download: true, audio: audio});
        })
        .catch((error) => {
          Alert.alert('File could not be downloaded...');
        })
      } else {
        Alert.alert('Sorry this device can only handle mp3, mp4, and m4a files at this time.')
      }
    })
  }

  updateProgress(progress) {
    this.setState({ progress });
  }

  getProgress(offset) {
    var progress = this.state.progress + offset;
    return Math.sin(progress % Math.PI) % 1;
  }

  sendAction(action, slug) {
    var actionUrl = this.props.pila.baseUrl + '/audios/' + slug;

    PilaApi.sendAction(actionUrl, action, (data) => {
      if (data.message != 'playing' && data.message != 'nothing') {
        // Update the Audio.
        store.get('pilas')
          .then((pilas) => {
            if (pilas) {
              var pila = pilas[this.props.pila.name];

              // Update the audio.
              pila.audios[data.audio.slug].playbackTime = data.audio.playbackTime;
              pila.audios[data.audio.slug].playedTime = data.audio.playedTime;

              pilas[pila.name] = pila;
              store.save('pilas', pilas)
                .then(() => {
                  this.setState({dataSource: this.ds.cloneWithRows(pila.audios)});
                })
            }
          })
      }
    })
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
      <View style={styles.cardWrapper}>
       <View style={[styles.pila, styles.smallShadow, styles.whiteBackground]}>
          <Text style={styles.label}>Name:</Text>
          <Text>{rowData.name}</Text>
          <Text style={styles.label}>Playback Time:</Text>
          <Text>{Math.round(rowData.playbackTime)}s</Text>
          <Text style={styles.label}>Duration:</Text>
          <Text>{moment.duration(Math.round(rowData.duration), 'seconds').humanize()}</Text>
          <Text style={styles.label}>Path:</Text>
          <Text>{rowData.path}</Text>

          <View style={styles.row}>
            <ImageButton
              imageSrc={require('./img/backward-icon.png')}
              buttonStyle={styles.actionButton}
              onPress={this.sendAction.bind(this, 'backward', rowData.slug)}
            />

            <ImageButton
              imageSrc={require('./img/play-icon.png')}
              buttonStyle={styles.actionButton}
              onPress={this.sendAction.bind(this, 'play', rowData.slug)}
            />

            <ImageButton
              imageSrc={require('./img/pause-icon.png')}
              buttonStyle={styles.actionButton}
              onPress={this.sendAction.bind(this, 'pause', rowData.slug)}
            />

            <ImageButton
              imageSrc={require('./img/forward-icon.png')}
              buttonStyle={styles.actionButton}
              onPress={this.sendAction.bind(this, 'forward', rowData.slug)}
            />
          </View>

          <View style={styles.center}>
            <ImageButton
              imageSrc={require('./img/download-icon.png')}
              buttonStyle={styles.actionButton}
              onPress={this.download.bind(this, rowData.slug)}
            />
          </View>
        </View>
      </View>
    );
  }

  render() {
    var progressBar;
    if (this.state.downloading) {
      progressBar = <ProgressViewIOS style={styles.progressView} progressTintColor={colors.primaryTwo} progress={this.getProgress(0)}/>;
    } else {
      progressBar = <View/>;
    }

    return(
      <View style={styles.container}>
        <View style={styles.pilaAudioWrapper}>
          {progressBar}

          <ListView
            style={styles.pilas}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
          />
        </View>
      </View>
    )
  }
}
