import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableHighlight
} from 'react-native';

class Button extends Component {
  render() {
    return (
      <TouchableHighlight
        style={[styles.button, this.props.buttonStyle]}
        underlayColor={'#eeeeee'}
        onPress={this.props.onPress}
        >
        <Text style={[styles.buttonText, this.props.textStyle]}>{this.props.text}</Text>
      </TouchableHighlight>
    );
  }
}

var styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: '#DBDEE3',
    marginTop: 10,
    backgroundColor: 'white',
  },

  buttonText: {
    flex: 1,
    alignSelf: 'center',
    fontSize: 20,
    color: '#424242'
  }
});

export default Button;
