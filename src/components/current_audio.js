import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import moment from 'moment';
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

  console.log('props:', props);

  return (
    <View style={styles.container}>
      <View style={styles.currentPlayer}>
        <Text style={styles.name}>{props.playing ? 'Currently Playing:' : 'Last Played:'}</Text>
        <Text>{props.currentAudio.name}</Text>

        <View style={styles.center}>
          <ImageButton imageSrc={image} buttonStyle={buttonStyles} onPress={props.onPress} />
        </View>
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
    marginBottom: 10,
    padding: 5,
    paddingBottom: 10,
    width: 300,
    borderWidth: 1,
    borderColor: '#2B2E4A',
    shadowColor:'#2B2E4A',
    shadowOffset: {width: 1, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 1,
    backgroundColor: '#FEFFE4',
  },

  name: {
    fontSize: 20,
  },

  center: {
    alignSelf: 'center',
  },

  actionButton: {
    width: 70,
    height: 70,
    paddingLeft: 25,
    paddingRight: 25
  },

  disabledButton: {
    width: 70,
    height: 70,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: '#E7E3C5'
  }
});

export default CurrentAudio;
