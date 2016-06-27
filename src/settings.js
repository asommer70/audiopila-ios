import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput
} from 'react-native';
import {Actions} from 'react-native-router-flux';
var RNFS = require('react-native-fs');

import Button from './components/button';

export default class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      downloadUrl: ''
    }
  }

  downloadFile() {
    var parts = this.state.downloadUrl.replace(/\s|%20/g, '_').split('/');
    var fileName = parts[parts.length - 1];

    RNFS.downloadFile({
      fromUrl: this.state.downloadUrl,
      toFile: RNFS.DocumentDirectoryPath + '/' + fileName,
    }).then((res, error) => {
      Actions.audios({type: 'reset'});
    }).catch((error) => {
      console.log('error:', error);
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.wrapper}>
          <View style={styles.formWrapper}>

            <View style={styles.formElement}>
              <Text style={styles.label}>Download Audio File From URL:</Text>
              <TextInput
                style={styles.input}
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


});
