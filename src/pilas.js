import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ListView
} from 'react-native';
import {Actions} from 'react-native-router-flux';
var store = require('react-native-simple-store');
var DeviceInfo = require('react-native-device-info');
var moment = require('moment');

import Button from './components/button';
import ImageButton from './components/image_button';
import PilaApi from './lib/pila_api';
import styles from './styles/main_styles';

export default class Pilas extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: this.ds.cloneWithRows({}),
      pilas: {},
      pila: undefined,
      removedPila: false
    }

    this.setPilas(false);
  }

  setPilas(synced) {
    store.get('pila')
      .then((pila) => {
        if (pila) {
          this.setState({pila: pila}, () => {
            store.get('pilas')
              .then((pilas) => {
                if (pilas) {

                  // Remove this device from the pilas list.
                  var me = DeviceInfo.getDeviceName().replace(/\s|%20/g, '_').replace(/'/, '').toLocaleLowerCase();
                  if (pilas[me] != undefined) {
                    delete pilas[me];
                  }

                  if (pilas[pila.name.trim()]) {
                    this.setState({ pilas: pilas, dataSource: this.ds.cloneWithRows(pilas) });
                  } else {
                    this.setState({ pilas: pilas, dataSource: this.ds.cloneWithRows(pilas), removedPila: true });
                  }
                }
              })
          });
        }
      })
  }

  sync(name) {
    var pila = this.state.pilas[name];

    PilaApi.syncToUrl(pila.baseUrl + '/sync', (error, data) => {
      if (error) {
        if (error.message.status) {
          Alert.alert(`There was a problem syncing to that URL status code is: ${error.message.status}`)
        } else {
          Alert.alert(error.message);
        }
      } else {
        Alert.alert(data.message, null, [{text: 'OK', onPress: () => {
          this.setPilas(true);
        }}]);
      }
    })
    // store.delete('pilas');
    // store.delete('pila');
  }

  pilaAudios(name) {
    Actions.pilaAudios({pila: this.state.pilas[name], audios: this.state.pilas[name].audios, title: 'Pila ' + name + ' Audios'})
  }

  deletePila(name) {
    Alert.alert('Delete Pila', 'Are you sure you want to delete: ' + name, [
      {text: 'Cancel', onPress: () => {} },
      {text: 'OK', onPress: () => {
        store.get('pilas')
          .then((pilas) => {
            if (pilas) {
              var deviceName = DeviceInfo.getDeviceName().replace(/\s|%20/g, '_').toLocaleLowerCase();

              // Remove this device and selected Pila.
              var me = pilas[deviceName];

              if (pilas[name] != undefined) {
                delete pilas[name];
                delete pilas[deviceName];
              }

              store.get('pila')
                .then((pila) => {
                  if (pila) {
                    if (pila.name == name) {
                      removedPila = true;
                    } else {
                      removedPila = this.state.removedPila;
                    }

                    this.setState({ pilas: pilas, dataSource: this.ds.cloneWithRows(pilas), removedPila: removedPila }, () => {
                      // Put this device back into the list and update store.
                      pilas[deviceName] = me;
                      store.save('pilas', pilas);
                    });
                  }
                })
            }
          })
      }}
    ])
  }

  _renderRow(rowData, sectionID, rowID) {
    return (
       <View style={styles.cardWrapper}>
        <View style={[styles.pila, styles.smallShadow, styles.whiteBackground]}>
          <Text style={styles.label}>Name:</Text>
          <Text>{rowData.name}</Text>
          <Text style={styles.label}>Last Synced:</Text>
          <Text>{moment(rowData.lastSynced).fromNow()}</Text>

          <View style={[styles.row, styles.centerRow]}>
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

            <ImageButton
              imageSrc={require('./img/delete-icon.png')}
              buttonStyle={styles.deleteButton}
              onPress={this.deletePila.bind(this, rowData.name)}
            />
          </View>
        </View>
      </View>
    );
  }

  render() {
    var pila;
    if (this.state.pila) {
      pila = (
        <View style={[styles.center, styles.bigShadow, styles.hero]}>
          <Text style={styles.name}>Last Synced To:</Text>
          <Text>{this.state.pila.name}</Text>
          <Text style={styles.label}>When:</Text>
          <Text>{moment(this.state.pila.lastSynced).fromNow()}</Text>

          <View style={[styles.row, styles.centerRow]}>
            <ImageButton
              imageSrc={require('./img/sync-icon.png')}
              buttonStyle={this.state.removedPila == true ? styles.disabledButton : styles.actionButton}
              onPress={this.state.removedPila == true ? () => {} : this.sync.bind(this, this.state.pila.name)}
            />

            <ImageButton
              imageSrc={require('./img/music-icon.png')}
              buttonStyle={this.state.removedPila == true ? styles.disabledButton : styles.actionButton}
              onPress={this.state.removedPila == true ? () => {} : this.pilaAudios.bind(this, this.state.pila.name)}
            />
          </View>
        </View>
      )
    } else {
      pila = (
        <View style={[styles.pila, styles.whiteBackground, styles.center, styles.smallShadow, {marginTop: 100, width: 300, padding: 20}]}>
          <Text>Haven't synced to another Audio Pila!... yet.</Text>
        </View>
      )
    }

    return (
      <View style={styles.container}>
          {pila}

          <ListView
            style={styles.pilas}
            dataSource={this.state.dataSource}
            renderRow={this._renderRow.bind(this)}
            enableEmptySections={true}
          />
      </View>
    )
  }
}
