import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Slider
} from 'react-native';
import { connect } from 'react-redux';

class Audio extends Component {
  render() {
    if (!this.props.audios) {
      return <div>No Audio files download... yet.</div>;
    }

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Audios List
        </Text>

        {
          Object.keys(this.state.audios).map((key) => {
            return (
              <View key={key}>
                <Audio audio={this.state.audios[key]} setAudio={this.setAudio.bind(this)} />
              </View>
            )
          })
        }
      </View>
    );
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
})

function mapStateToProps(state) {
  return {
    audios
  };
}

export default connect(mapStateToProps)(Audios);
