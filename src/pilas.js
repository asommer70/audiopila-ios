import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ListView
} from 'react-native';
import {Actions} from 'react-native-router-flux';
// var RNFS = require('react-native-fs');
var store = require('react-native-simple-store');
var FileDownload = require('react-native-file-download');
var DeviceInfo = require('react-native-device-info');
var moment = require('moment');

import Button from './components/button';
import ImageButton from './components/image_button';
import PilaApi from './lib/pila_api';

export default class Pilas extends Component {
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
        if (pilas) {
          // Remove this device from the pilas list.
          var me = DeviceInfo.getDeviceName().replace(/\s|%20/g, '_').toLocaleLowerCase();
          if (pilas[me] != undefined) {
            delete pilas[me];
          }
          this.setState({ pilas: pilas, dataSource: this.ds.cloneWithRows(pilas) });
        }

        store.get('pila')
          .then((pila) => {
            if (pila) {
              this.setState({pila: pila});
            }
          })
      })
  }

  sync(name) {
    var pila = this.state.pilas[name];

    PilaApi.syncToUrl(pila.httpUrl, (error, data) => {
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
    // store.delete('pilas');
    // store.delete('pila');
  }

  pilaAudios(name) {
    console.log('name:', name, 'pilaAudios...', 'this.state.pilas[name]:', this.state.pilas[name]);
    Actions.pilaAudios({audios: this.state.pilas[name].audios, title: 'Pila ' + name + ' Audios'})
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
        <View style={styles.pila}>
          <Text style={styles.label}>Name:</Text>
          <Text>{rowData.name}</Text>
          <Text style={styles.label}>Last Synced:</Text>
          <Text>{moment(rowData.lastSynced).fromNow()}</Text>

          <View style={styles.row}>
            <ImageButton
              imageSrc={require('./img/sync-icon.png')}
              buttonStyle={styles.actionButton}
              onPress={this.sync.bind(this, rowData.name)}
            />

            <ImageButton
              imageSrc={require('./img/music-icon.png')}
              buttonStyle={styles.actionButton}
              onPress={this.pilaAudios.bind(this, rowData.name)}
            />
          </View>
        </View>
    );
  }

  render() {
    var pila;
    if (this.state.pila) {
      pila = (
        <View style={[styles.center, styles.lastPila]}>
          <Text style={styles.label}>Last Synced To:</Text>
          <Text>{this.state.pila.name}</Text>
          <Text style={styles.label}>When:</Text>
          <Text>{moment(this.state.pila.lastSynced).fromNow()}</Text>

          <View style={styles.row}>
            <ImageButton
              imageSrc={require('./img/sync-icon.png')}
              buttonStyle={styles.actionButton}
              onPress={this.sync.bind(this, this.state.pila.name)}
            />

            <ImageButton
              imageSrc={require('./img/music-icon.png')}
              buttonStyle={styles.actionButton}
              onPress={this.pilaAudios.bind(this, this.state.pila.name)}
            />
          </View>
        </View>
      )
    } else {
      pila = (
        <View style={styles.pila}>
          <Text>Haven't synced to another Audio Pila!... yet.</Text>
          <Button text={'Settings'} onPress={Actions.settings} buttonStyle={{width: 200}} />
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

  row: {
    flexDirection: 'row'
  },

  wrapper: {
    marginTop: 80,
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
  },

  actionButton: {
    width: 40,
    paddingLeft: 25,
    paddingRight: 25,
    marginRight: 10
  },
});
