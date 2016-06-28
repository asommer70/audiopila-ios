import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  Alert,
  ProgressViewIOS
} from 'react-native';
import {Actions} from 'react-native-router-flux';
var RNFS = require('react-native-fs');
var FileDownload = require('react-native-file-download');

import Button from './components/button';

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      downloadUrl: '',
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
      Alert.alert('Sorry Audio Pila! can only handle mp3, mp4, and m4a files at this time.')
    }
  }

  updateProgress(progress) {
    // var progress = this.state.progress + 0.01;
    this.setState({ progress });
    // this.requestAnimationFrame(() => this.updateProgress());
  }

  getProgress(offset) {
    var progress = this.state.progress + offset;
    return Math.sin(progress % Math.PI) % 1;
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
