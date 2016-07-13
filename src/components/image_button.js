import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
  TouchableHighlight,
  Image,
  View
} from 'react-native';

class ImageButton extends Component {
  render() {
    var image;
    if (this.props.imageSrc) {
      image = <Image source={this.props.imageSrc} style={[styles.shareIcon, this.props.imageStyle]} />;
    } else {
      image = <View></View>;
    }

    return (
      <TouchableHighlight style={[styles.button, this.props.buttonStyle]} underlayColor={'#EADB9D'} onPress={this.props.onPress}>
        <View style={this.props.imagePos}>
          {image}
          {this.props.text ? <Text style={[styles.buttonText, this.props.textType]}>{this.props.text}</Text> : <View/>}
        </View>
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
    backgroundColor: '#54777D',
    shadowColor:'#424242',
    shadowOffset: {width: 1, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1
  },

  buttonText: {
    flex: 1,
    alignSelf: 'center',
    fontSize: 20,
    color: '#424242'
  }
});

export default ImageButton;
