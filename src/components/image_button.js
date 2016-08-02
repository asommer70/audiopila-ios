import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  View
} from 'react-native';

import styles from '../styles/main_styles';

class ImageButton extends Component {
  render() {
    var image;
    if (this.props.imageSrc) {
      image = <Image source={this.props.imageSrc} style={[this.props.imageStyle]} />;
    } else {
      image = <View></View>;
    }

    return (
      <TouchableHighlight style={[styles.imageButton, this.props.buttonStyle]} underlayColor={'#EADB9D'} onPress={this.props.onPress}>
        <View style={this.props.imagePos}>
          {image}
          {this.props.text ? <Text style={[styles.buttonText, this.props.textType]}>{this.props.text}</Text> : <View/>}
        </View>
      </TouchableHighlight>
    );
  }
}

export default ImageButton;
