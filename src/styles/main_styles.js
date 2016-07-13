import { StyleSheet } from 'react-native';

export const colors = {
  primaryOne: '#54777D',
  primaryTwo: '#903749',
  secondaryOne: '#E7E3C5',
  secondaryTwo: '#FEFFE4',
  accentOne: '#E84545',
  accentTwo: '#2B2E4A',
  accentThree: '#EADB9D',
};

const MainStyles = StyleSheet.create({
  //
  // Global styles
  //
  container: {
    flex: 1,
    backgroundColor: colors.secondaryOne,
  },

  bigShadow: {
    shadowColor: colors.accentTwo,
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.4,
    shadowRadius: 3,
    backgroundColor: colors.secondaryTwo,
  },

  //
  // Audios components
  //
  audioList: {
    marginTop: 5,
  },

  separator: {
    height: 1,
    backgroundColor: colors.primaryTwo,
  },

  audio: {
    marginTop: 10,
    padding: 10
  },

  //
  // Settings component
  //
  wrapper: {
    marginTop: 100,
    alignSelf: 'center',
    flex: 1,
  },

  formWrapper: {
    backgroundColor: colors.secondaryTwo,
    padding: 20
  },

  input: {
    padding: 4,
    height: 40,
    borderWidth: 1,
    borderColor: colors.primaryTwo,
    borderRadius: 3,
    marginTop: 5,
    marginBottom: 5,
    width: 200,
    alignSelf: 'flex-end',
    color: colors.primaryTwo,
  },

  downloadButton: {
    width: 200
  },

  downloadText: {
    fontSize: 14,
  },

  progressView: {
    marginTop: 10,
  },

  label: {
    color: colors.primaryTwo
  },

  //
  // Button Component
  //
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: colors.primaryTwo,
    marginTop: 10,
    backgroundColor: colors.accentThree,
  },

  buttonText: {
    flex: 1,
    alignSelf: 'center',
    fontSize: 20,
    color: colors.primaryTwo,
  },

  //
  // CurrentAudio component
  //
  currentPlayer: {
    marginTop: 70,
    marginBottom: 10,
    padding: 5,
    paddingBottom: 10,
    width: 300,
    borderWidth: 2,
    borderColor: colors.primaryTwo,
  },

  name: {
    fontSize: 20,
    color: colors.primaryTwo,
    fontWeight: 'bold',
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
    backgroundColor: colors.secondaryOne
  }
});

export default MainStyles;
