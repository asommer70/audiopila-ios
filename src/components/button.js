import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

import styles, { colors } from '../styles/main_styles';

class Button extends Component {
  render() {
    return (
      <TouchableHighlight
        style={[styles.button, this.props.buttonStyle]}
        underlayColor={colors.secondaryOne}
        onPress={this.props.onPress}
        >
        <Text style={[styles.buttonText, this.props.textStyle]}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

export default Button;
