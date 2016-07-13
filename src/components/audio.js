import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Slider
} from 'react-native';
var store = require('react-native-simple-store');
var moment = require('moment');

import ImageButton from './image_button';

export default class Audio extends Component {
  render() {
    var audio = this.props.audio;

    return (
      <View key={audio.name} style={styles.audio}>
        <Text style={styles.name}>{audio.name}</Text>
        <Text>Last Played: {audio.hasOwnProperty('playedTime') == false ? 'Never... yet.' : moment(audio.playedTime).fromNow()}</Text>

        <View style={[styles.row, styles.center]}>
          <ImageButton
            imageSrc={require('../img/play-icon.png')}
            buttonStyle={styles.actionButton}
            onPress={this.props.setAudio.bind(this, this.props.audio.slug)}
          />

          <ImageButton
            imageSrc={require('../img/pause-icon.png')}
            buttonStyle={styles.actionButton}
            onPress={this.props.setAudio.bind(this, this.props.audio.slug)}
          />
        </View>

        <Slider value={this.props.audio.playbackTime} maximumValue={audio.duration} onSlidingComplete={(value) => this.props.setProgress(value)} />

        <View style={styles.row}>
          <ImageButton
            imageSrc={require('../img/upload-icon.png')}
            buttonStyle={styles.iconButton}
            onPress={this.props.choosePila.bind(this, this.props.audio.slug)}
          />

          <ImageButton
            imageSrc={require('../img/delete-icon.png')}
            buttonStyle={styles.deleteButton}
            onPress={this.props.deleteAudio.bind(this, this.props.audio.slug)}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  center: {
    alignSelf: 'center'
  },

  audio: {
    backgroundColor: '#FEFFE4',
    padding: 10,
    shadowColor:'#424242',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1
  },

  name: {
    textAlign: 'center',
    color: '#903749',
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold'
  },

  progressView: {
    marginTop: 10,
  },

  actionButton: {
    width: 60,
    height: 60,
    paddingLeft: 25,
    paddingRight: 25,
    marginRight: 10,
    marginBottom: 20,
    marginTop: 20,
  },

  iconButton: {
    width: 50,
    height: 50,
  },

  deleteButton: {
    width: 30,
    height: 30,
    marginLeft: 25,
    borderRadius: 20,
    borderWidth: 0,
    padding: 0,
    backgroundColor: '#FEFFE4',
    shadowColor:'#424242',
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 2
  }
});
