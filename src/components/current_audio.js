import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import ImageButton from './image_button';

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
    <View style={styles.currentPlayer}>
      <Text>{props.playing ? 'Currently Playing:' : 'Last Played:'} {props.currentAudio.name}</Text>
      <ImageButton imageSrc={image} buttonStyle={buttonStyles} onPress={props.onPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  currentPlayer: {
    marginTop: 70,
    padding: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#424242'
  },

  actionButton: {
    width: 40,
    paddingLeft: 25,
    paddingRight: 25
  },

  disabledButton: {
    width: 40,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: 'gray'
  }
});

export default CurrentAudio;
