import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Slider
} from 'react-native';
var store = require('react-native-simple-store');

import ImageButton from './image_button';

export default class Audio extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currentAudio: undefined,
      playing: false
    }
  }

  setProgress(value) {
    this.setState({playbackTime: value}, () => {
      this.state.currentAudio.setCurrentTime(value);
    })
  }

  render() {
    var audio = this.props.audio;

    return (
      <View key={audio.name}>
        <Text style={styles.name}>{audio.name}</Text>

        <View style={styles.row}>
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

          <ImageButton
            imageSrc={require('../img/upload-icon.png')}
            buttonStyle={styles.actionButton}
            onPress={this.props.choosePila.bind(this, this.props.audio.slug)}
          />

          <ImageButton
            imageSrc={require('../img/delete-icon.png')}
            buttonStyle={styles.deleteButton}
            onPress={this.props.deleteAudio.bind(this, this.props.audio.slug)}
          />
        </View>

        <Slider value={this.props.audio.playbackTime} maximumValue={audio.duration} onSlidingComplete={(value) => this.props.setProgress(value)} />
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

  name: {
    textAlign: 'center',
    color: '#424242',
    marginBottom: 5,
    fontSize: 18
  },

  progressView: {
    marginTop: 10,
  },

  actionButton: {
    width: 40,
    paddingLeft: 25,
    paddingRight: 25,
    marginRight: 10
  },

  deleteButton: {
    width: 40,
    height: 40,
    marginLeft: 50
  }
});
