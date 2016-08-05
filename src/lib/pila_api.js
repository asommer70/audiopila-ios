import { Platform } from 'react-native';
var store = require('react-native-simple-store');
var FileDownload = require('react-native-file-download');
var DeviceInfo = require('react-native-device-info');

const DEVICE_NAME = DeviceInfo.getDeviceName().replace(/\s|%20/g, '_').replace(/'/, '').toLocaleLowerCase();

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
          this.updateAudiosSync(data.pila.audios, data.pilas[DEVICE_NAME].audios, (audios) => {
            data.pilas[DEVICE_NAME].audios = audios;
            this.savePila(data);
            this.saveAudios(audios);
            callback(null, data);
          })
        }
      })
      .catch((error) => {
        callback(error, null);
      });
    })
  }

  static getSyncData(url, callback) {
    var data = {
      name: DEVICE_NAME,
      platform: Platform.OS,
      type: 'pila',
      lastSynced: Date.now(),
      syncedTo: url
    }

    store.get('audios')
      .then((audios) => {
        if (audios) {
          data.audios = audios;
          store.get('lastPlayed')
            .then((lastAudio) => {
              data.lastPlayed = lastAudio;

              callback(data);
            })
        } else {
          data.audios = {};
          data.lastPlayed = {};
          callback(data);
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
          store.update('pila', data.pila);
        }
      })
  }

  static saveAudios(data) {
    store.get('audios')
      .then((audios) => {
        if (!audios) {
          store.save('audios', data);
        } else {
          store.update('audios', data);
        }
      })
  }

  static updateAudiosSync(remoteAudios, localAudios, callback) {
    for (var key in remoteAudios) {
      var remoteAudio = remoteAudios[key];
      var localAudio = localAudios[key];

      if (localAudio != undefined) {
        if (localAudio.playedTime != undefined) {
          if (remoteAudio.playedTime > localAudio.playedTime) {
            localAudios[key].playbackTime = remoteAudio.playbackTime;
          }
        } else {
          localAudios[key].playbackTime = remoteAudio.playbackTime;
        }
      }
    }

    callback(localAudios);
  }

  static sendAction(url, action, callback) {
    fetch(url, {
      method: 'put',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({action: action})
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
        callback(data);
      }
    })
    .catch((error) => {
      callback(error, null);
    });
  }
}
