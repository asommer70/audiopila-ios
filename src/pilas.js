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

export default class Settings extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: this.ds.cloneWithRows({}),
      pilas: {},
      pila: undefined
    }

    store.get('pilas')
      .then((pilas) => {
        console.log('pilas:', pilas);
        if (pilas) {
          this.setState({ pilas: pilas, dataSource: this.ds.cloneWithRows(pilas) });
        }

        store.get('pila')
          .then((pila) => {
            console.log('pila:', pila);

            if (pila) {
              this.setState({pila: pila});
            }
          })
      })
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
        <View style={styles.pila}>
          <Text>{rowData.name}</Text>
        </View>
    );
  }

  render() {
    var pila;
    if (this.state.pila) {
      pila = (
        <View style={styles.pila}>
          <Text style={styles.label}>Last Synced To:</Text>
          <Text>{this.state.pila.name}</Text>
          <Text style={styles.label}>When:</Text>
          <Text>{moment(this.state.pila.lastSynced).fromNow()}</Text>
        </View>
      )
    } else {
      pila = (
        <View style={styles.pila}>
          <Text>Haven't synced to another Audio Pila!... yet.</Text>
        </View>
      )
    }

    return (
      <View stye={styles.container}>
        <View style={styles.wrapper}>
          {pila}

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

  wrapper: {
    marginTop: 80,
    flex: 1,
  },

  pilas: {
    marginTop: 5,
  },

  separator: {
    height: 1,
    backgroundColor: '#DBDEE3',
  },

  pila: {
    marginTop: 10,
    padding: 10
  },

  label: {
    fontSize: 16,
    color: 'black'
  }
});
