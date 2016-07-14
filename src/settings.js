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

import styles, { colors } from './styles/main_styles';
import Button from './components/button';
import PilaApi from './lib/pila_api';

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
        this.updateProgress(info.totalBytesWritten / info.totalBytesExpectedToWrite);
      });

      FileDownload.download(this.state.downloadUrl, RNFS.DocumentDirectoryPath, fileName, headers)
      .then((response) => {
        Actions.audios({type: 'reset', download: true});
      })
      .catch((error) => {
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
    PilaApi.syncToUrl(this.state.httpSyncUrl, (error, data) => {
      if (error) {
        if (error.message.status) {
          Alert.alert(`There was a problem syncing to that URL status code is: ${error.message.status}`)
        } else {
          Alert.alert(error.message);
        }
      } else {
        this.setState({httpSyncUrl: ''});
        Alert.alert(data.message);
      }
    })
  }

  render() {
    var progressBar;
    if (this.state.downloading) {
      progressBar = <ProgressViewIOS style={styles.progressView} progress={this.getProgress(0)} progressTintColor={colors.primaryTwo}/>;
    } else {
      progressBar = <View/>;
    }

    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={[styles.formWrapper, styles.smallShadow]}>

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

        <View style={[styles.wrapper]}>
          <View style={[styles.formWrapper, styles.smallShadow]}>

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
          </View>
        </View>
      </View>
    );
  }
}
