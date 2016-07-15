import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Alert,
  ProgressViewIOS
} from 'react-native';
var store = require('react-native-simple-store');
var DeviceInfo = require('react-native-device-info');
var RNFS = require('react-native-fs');
import {Actions} from 'react-native-router-flux';

import Button from './components/button';
import ImageButton from './components/image_button';
import styles, { colors } from './styles/main_styles';

export default class PilasModal extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: this.ds.cloneWithRows({}),
      pilas: {},
      uploading: false,
      progress: 0
    }

    store.get('pilas')
      .then((pilas) => {
        if (pilas) {
          // Remove this device from the pilas list.
          var me = DeviceInfo.getDeviceName().replace(/\s|%20/g, '_').toLocaleLowerCase();
          if (pilas[me] != undefined) {
            delete pilas[me];
          }

          this.setState({ pilas: pilas, dataSource: this.ds.cloneWithRows(pilas) });
        }
      })
  }

  getProgress(offset) {
    var progress = this.state.progress + offset;
    return Math.sin(progress % Math.PI) % 1;
  }

  uploadToRepo(pila, slug) {
    var audio = this.props.audio;
    var ext = audio.name.substr(audio.name.length - 3);

    this.setState({uploading: true}, () => {

      RNFS.uploadFiles({
        toUrl: pila.baseUrl + '/repos/' + slug,
        files: [{
          name: audio.name,
          filename: audio.name,
          filepath: audio.path,
          filetype: 'audio/x-' + ext
        }],
        method: 'POST',
        headers: {
          'Accept': 'application/json',
        },
        fields: {
          audio: audio.name,
          slug: slug,
        },
        progressCallback: (res) => { this.setState({progress: res.totalBytesSent / res.totalBytesExpectedToSend}) },
      })
      .then((response) => {
        Actions.pop();
      })
      .catch((err) => {
        Alert.alert('File could not be uploaded...');
      });
    });
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
      <View style={styles.cardWrapper}>
       <View style={[styles.pila, styles.smallShadow, styles.whiteBackground]}>
          <Text style={styles.label}>Pila Name:</Text>
          <Text>{rowData.name}</Text>

          <Text style={styles.label}>Repositories:</Text>
        {
          Object.keys(rowData.repositories).map((repo) => {
            var repo = rowData.repositories[repo];
            return (
              <View key={repo.name} style={styles.row}>
                <TouchableHighlight
                  style={styles.button}
                  underlayColor={'#eeeeee'}
                  onPress={this.uploadToRepo.bind(this, rowData, repo.slug)}>
                  <Text>{repo.name}</Text>
                </TouchableHighlight>
              </View>
            )
          })
        }
        </View>
      </View>
    );
  }

  render() {
    var progressBar;
    if (this.state.uploading) {
      progressBar = <ProgressViewIOS style={styles.progressView} progressTintColor={colors.primaryTwo} progress={this.getProgress(0)}/>;
    } else {
      progressBar = <View/>;
    }

    return (
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
