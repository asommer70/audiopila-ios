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
    <View style={styles.container}>
      <View style={styles.currentPlayer}>
        <Text style={styles.name}>{props.playing ? 'Currently Playing:' : 'Last Played:'}</Text>
        <Text>{props.currentAudio.name}</Text>
        <ImageButton imageSrc={image} buttonStyle={buttonStyles} onPress={props.onPress} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center'
  },

  currentPlayer: {
    marginTop: 70,
    padding: 5,
    paddingBottom: 10,
    width: 300,
    borderWidth: 1,
    borderColor: '#424242',
    shadowColor:'#424242',
    shadowOffset: {width: 3, height: 7},
    shadowOpacity: 0.4,
    shadowRadius: 5
  },

  name: {
    fontSize: 20
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
