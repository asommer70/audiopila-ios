import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Slider
} from 'react-native';
var store = require('react-native-simple-store');

import Button from './button';

export default class Audio extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentAudio: undefined,
      playbackTime: this.props.audio.playbackTime,
    }
  }

  componentDidMount() {
    store.get(this.props.audio.slug)
  }

  setProgress(value) {
    console.log('value:', value);
    this.setState({playbackTime: value}, () => {
      this.state.currentAudio.setCurrentTime(value);
    })
  }

  render() {
    var audio = this.props.audio;
    return (
      <View key={audio.name}>
        <Text style={styles.instructions}>{audio.name}</Text>

        <Button text={'Play/Pause'} onPress={this.props.setAudio.bind(this, this.props.audio.slug)} slug={this.props.audio.slug} />

        <Slider value={this.state.playbackTime} maximumValue={audio.duration} onSlidingComplete={(value) => this.props.setProgress(value)} />
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

  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },

  instructions: {
    textAlign: 'center',
    color: '#424242',
    marginBottom: 5,
  },

  progressView: {
    marginTop: 10,
  },
});
