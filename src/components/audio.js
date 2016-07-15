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
import styles, { colors } from '../styles/main_styles';

export default class Audio extends Component {
  render() {
    var audio = this.props.audio;

    return (
      <View key={audio.name} style={[styles.audio, styles.smallShadow, styles.whiteBackground]}>
        <Text style={[styles.name, styles.audioName]}>{audio.name}</Text>
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

        <Slider
          value={audio.playbackTime}
          maximumValue={audio.duration}
          onSlidingComplete={(value) => this.props.setProgress(value, audio)}
          minimumTrackTintColor={colors.primaryTwo}
          maximumTrackTintColor={colors.primaryOne}
          thumbImage={require('../img/circle-icon.png')}
          style={styles.slider}
        />

        <View style={[styles.row, styles.center]}>
          <Text>{Math.round(audio.playbackTime)}s/{Math.round(audio.duration)}s</Text>
        </View>

        <View style={[styles.row, styles.centerRow]}>
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
