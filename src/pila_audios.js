import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ListView
} from 'react-native';
import {Actions} from 'react-native-router-flux';
var RNFS = require('react-native-fs');
var store = require('react-native-simple-store');
var FileDownload = require('react-native-file-download');
var DeviceInfo = require('react-native-device-info');
var moment = require('moment');

import Button from './components/button';
import ImageButton from './components/image_button';
import PilaApi from './lib/pila_api';

export default class PilaAudios extends Component {
  constructor(props) {
    super(props);
    console.log('pilaAudios props:', props);

    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: this.ds.cloneWithRows(this.props.audios),
    }
  }

  download(name) {
    console.log('downloading:', name);
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
              onPress={this.download.bind(this, rowData.name)}
            />
        </View>
    );
  }

  render() {
    return(
      <View style={styles.container}>
        <View style={styles.wrapper}>
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
});
