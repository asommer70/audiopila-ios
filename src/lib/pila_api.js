import { Platform } from 'react-native';
var store = require('react-native-simple-store');
var FileDownload = require('react-native-file-download');
var DeviceInfo = require('react-native-device-info');

export default class PilaApi {
  static syncToUrl(url, callback) {
    this.getSyncData(url, (data) => {
      fetch(url, {
        method: 'post',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then((response) => {
        if (response.status == 200) {
          return response.json();
        } else {
          callback({message: response}, null)
        }
      })
      .then((data) => {
        if (data) {
          this.savePila(data);
          callback(null, data);
        }
      })
      .catch((error) => {
        console.log('PilaApi.syncToUrl error:', error);
        callback(error, null);
      });
    })
  }

  static getSyncData(url, callback) {
    var deviceName = DeviceInfo.getDeviceName().replace(/\s|%20/g, '_').toLocaleLowerCase();
    var data = {
      name: deviceName,
      platform: Platform.OS,
      type: 'pila'
    }

    store.get('audios')
      .then((audios) => {
        if (audios) {
          data.audios = audios;
          store.get('lastPlayed')
            .then((lastAudio) => {
              data.lastPlayed = lastAudio;
              data.lastSynced = Date.now();
              data.syncedTo = url;

              callback(data);
            })
        }
      })
  }

  static savePila(data) {
    store.get('pilas')
      .then((pilas) => {
        if (!pilas) {
          store.save('pilas', data.pilas);
          store.save('pila', data.pila);
        } else {
          pilas[data.pila.name] = data.pila;
          store.update('pilas', pilas);
        }
      })
  }
}
