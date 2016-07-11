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
          console.log('download error:', error);
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

  _renderRow(rowData, sectionID, rowID) {
    return (
        <View style={styles.pila}>
          <Text style={styles.label}>Name:</Text>
          <Text>{rowData.name}</Text>
          <Text style={styles.label}>Playback Time:</Text>
          <Text>{Math.round(rowData.playbackTime)}</Text>
          <Text style={styles.label}>Duration:</Text>
          <Text>{moment.duration(Math.round(rowData.duration), 'seconds').humanize()}</Text>
          <Text style={styles.label}>Path:</Text>
          <Text>{rowData.path}</Text>

          <ImageButton
            imageSrc={require('./img/download-icon.png')}
            buttonStyle={styles.actionButton}
            onPress={this.download.bind(this, rowData.slug)}
          />

        </View>
    );
  }

  render() {
    var progressBar;
    if (this.state.downloading) {
      progressBar = <ProgressViewIOS style={styles.progressView} progress={this.getProgress(0)}/>;
    } else {
      progressBar = <View/>;
    }

    return(
      <View style={styles.container}>
        <View style={styles.wrapper}>
          {progressBar}
          <ListView
            style={styles.pilas}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
            renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={styles.separator}/>}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60
  },

  row: {
    flexDirection: 'row'
  },

  wrapper: {
    marginTop: 20,
    flex: 1,
  },

  center: {
    alignSelf: 'center'
  },

  pilas: {
    marginTop: 5,
  },

  separator: {
    height: 1,
    backgroundColor: '#DBDEE3',
  },

  lastPila: {
    marginTop: 5,
    padding: 10,
    width: 300,
    borderWidth: 1,
    borderColor: '#424242',
    shadowColor:'#424242',
    shadowOffset: {width: 3, height: 7},
    shadowOpacity: 0.4,
    shadowRadius: 5
  },

  pila: {
    marginTop: 10,
    padding: 10,
  },

  label: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
    marginTop: 5
  },

  actionButton: {
    width: 40,
    paddingLeft: 25,
    paddingRight: 25,
    marginRight: 10
  },

  progressView: {
    marginTop: 10,
  }
});
