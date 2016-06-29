import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ProgressViewIOS,
  Platform
} from 'react-native';
import {Actions} from 'react-native-router-flux';
var RNFS = require('react-native-fs');
var store = require('react-native-simple-store');
var FileDownload = require('react-native-file-download');
var DeviceInfo = require('react-native-device-info');

import Button from './components/button';

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      downloadUrl: '',
      httpSyncUrl: '',
      progress: 0,
      downloading: false
    }
  }

  downloadFile() {
    var parts = this.state.downloadUrl.replace(/\s|%20/g, '_').split('/');
    var fileName = parts[parts.length - 1];
    const headers = {
      'Accept-Language': 'en-US'
    }

    // Check file extension.
    var ext = this.state.downloadUrl.substr(this.state.downloadUrl.length - 4);
    if (/\.mp3|\.m4a|\.mp4/g.exec(ext) !== null) {

      FileDownload.addListener(this.state.downloadUrl, (info) => {
        console.log(`complete ${(info.totalBytesWritten / info.totalBytesExpectedToWrite * 100)}%`);
        this.updateProgress(info.totalBytesWritten / info.totalBytesExpectedToWrite);
      });

      FileDownload.download(this.state.downloadUrl, RNFS.DocumentDirectoryPath, fileName, headers)
      .then((response) => {
        Actions.audios({type: 'reset', download: true});
      })
      .catch((error) => {
        console.log('download error:', error);
        Alert.alert('File could not be downloaded...');
      })
    } else {
      Alert.alert('Sorry this device can only handle mp3, mp4, and m4a files at this time.')
    }
  }

  updateProgress(progress) {
    this.setState({ progress });
  }

  getProgress(offset) {
    var progress = this.state.progress + offset;
    return Math.sin(progress % Math.PI) % 1;
  }

  syncToUrl() {
    this.getSyncData((data) => {
      fetch(this.state.httpSyncUrl, {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((response) => {
        console.log('response.status:', response.status);
        if (response.status == 200) {
          return response.json();
        } else {
          Alert.alert(`There was a problem syncing to that URL status code is: ${response.status}`)
        }
      })
      .then((data) => {
        if (data) {
          console.log('returned data:', data);
          this.savePila(data);
          Alert.alert(data.message);
        }
      })
      .catch((error) => {
        console.log('syncToUrl error:', error);
      });
    })
  }

  getSyncData(callback) {
    var deviceName = DeviceInfo.getDeviceName().replace(/\s|%20/g, '_').toLocaleLowerCase();
    var data = {
      name: deviceName,
      platform: Platform.OS
    }

    store.get('audios')
      .then((audios) => {
        if (audios) {
          data.audios = audios;
          store.get('lastPlayed')
            .then((lastAudio) => {
              data.lastPlayed = lastAudio;
              data.lastSynced = Date.now();
              data.syncedTo = this.state.syncToUrl;

              callback(data);
            })
        }
      })
  }

  savePila(data) {
    store.get('pilas')
      .then((pilas) => {
        if (!pilas) {
          store.save('pilas', data.pilas);
          store.save('pila', data.pila);
        } else {
          pilas[data.pila] = data.pila;
          store.update('pilas', pilas);
        }
        this.setState({httpSyncUrl: ''});
      })
  }

  render() {
    var progressBar;
    if (this.state.downloading) {
      progressBar = <ProgressViewIOS style={styles.progressView} progress={this.getProgress(0)}/>;
    } else {
      progressBar = <View/>;
    }

    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.formWrapper}>

            <View style={styles.formElement}>
              <Text style={styles.label}>Download Audio File From URL:</Text>
              <TextInput
                style={styles.input}
                onFocus={() => this.setState({downloading: true})}
                onChangeText={ (text) => this.setState({ downloadUrl: text }) }
                value={this.state.downloadUrl}
              />
            </View>

            <Button
              style={styles.downloadButton}
              text={'Download File'}
              onPress={this.downloadFile.bind(this)}
              textStyle={styles.downloadText}
              buttonStyle={styles.downloadButton} />

            {progressBar}
          </View>
        </View>

        <View style={styles.wrapper}>
          <View style={styles.formWrapper}>

            <View style={styles.formElement}>
              <Text style={styles.label}>Enter Pila URL for HTTP Sync:</Text>
              <TextInput
                style={styles.input}
                onChangeText={ (text) => this.setState({ httpSyncUrl: text }) }
                value={this.state.httpSyncUrl}
              />
            </View>

            <Button
              style={styles.downloadButton}
              text={'Sync To Pila'}
              onPress={this.syncToUrl.bind(this)}
              textStyle={styles.downloadText}
              buttonStyle={styles.downloadButton} />

            {progressBar}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60
  },

  wrapper: {
    marginTop: 40,
    alignSelf: 'center',
    flex: 1,
  },

  formWrapper: {
    backgroundColor: '#ffffff',
    padding: 20
  },

  input: {
    padding: 4,
    height: 40,
    borderWidth: 1,
    borderColor: '#424242',
    borderRadius: 3,
    marginTop: 5,
    marginBottom: 5,
    width: 200,
    alignSelf: 'flex-end',
    color: '#424242'
  },

  downloadButton: {
    width: 200
  },

  downloadText: {
    fontSize: 14,
  },

  progressView: {
    marginTop: 10,
  }

});
