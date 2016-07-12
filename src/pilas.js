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

export default class Pilas extends Component {
  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      dataSource: this.ds.cloneWithRows({}),
      pilas: {},
      pila: undefined
    }

    this.setPilas(false);
  }

  setPilas(synced) {
    console.log('setPilas...')
        store.get('pila')
          .then((pila) => {
            if (pila) {
              if (synced) {
                console.log('synced:', synced);
                pila.name = pila.name + ' ';
              }
              this.setState({pila: pila}, () => {
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
        console.log('data:', data);
        Alert.alert(data.message, null, [{text: 'OK', onPress: () => {
          this.setPilas(true);
        }}]);
      }
    })
    // store.delete('pilas');
    // store.delete('pila');
  }

  pilaAudios(name) {
    Actions.pilaAudios({audios: this.state.pilas[name].audios, title: 'Pila ' + name + ' Audios'})
  }

  deletePila(name) {
    console.log('deletePila name:', name);
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
          
          this.setState({ pilas: pilas, dataSource: this.ds.cloneWithRows(pilas) }, () => {
            // Put this device back into the list and update store.
            pilas[deviceName] = me;
            store.save('pilas', pilas);
          });
        }
      })
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

            <ImageButton
              imageSrc={require('./img/delete-icon.png')}
              buttonStyle={styles.deleteButton}
              onPress={this.deletePila.bind(this, rowData.name)}
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
    marginBottom: 5,
    height: 315,
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
