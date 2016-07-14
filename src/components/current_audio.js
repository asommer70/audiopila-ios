import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import moment from 'moment';
import ImageButton from './image_button';
import styles from '../styles/main_styles';

const CurrentAudio = (props) => {
  var image;
  if (props.playing) {
    image = require('../img/pause-icon.png');
  } else {
    image = require('../img/play-icon.png');
  }

  var buttonStyles;
  if (props.currentAudio.disabled) {
    buttonStyles = styles.disabledButton;
  } else {
    buttonStyles = styles.actionButton;
  }

  return (
    <View style={styles.center}>
      <View style={[styles.hero, styles.bigShadow]}>
        <Text style={styles.name}>{props.playing ? 'Currently Playing:' : 'Last Played:'}</Text>
        <Text>{props.currentAudio.name}</Text>

        <View style={styles.center}>
          <ImageButton imageSrc={image} buttonStyle={buttonStyles} onPress={props.onPress} />
        </View>
      </View>
    </View>
  )
}

export default CurrentAudio;
