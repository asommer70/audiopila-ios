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

  smallShadow: {
    shadowColor: colors.accentTwo,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },

  row: {
    flexDirection: 'row',
  },

  center: {
    alignSelf: 'center',
  },

  centerRow: {
    alignItems: 'center'
  },

  separator: {
    height: 1,
    backgroundColor: colors.primaryTwo,
  },

  progressView: {
    marginTop: 10,
    marginBottom: 10
  },

  whiteBackground: {
    backgroundColor: colors.secondaryTwo,
  },

  cardWrapper: {
    padding: 10,
    backgroundColor: colors.secondaryOne,
  },

  //
  // Audios components
  //
  audioList: {
    marginTop: 5,
  },

  audio: {
    // marginTop: 10,
    padding: 10,
  },

  //
  // Settings component
  //
  wrapper: {
    marginTop: 100,
    alignSelf: 'center',
    flex: 1,
    padding: 10,
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
    marginTop: 10,
    marginBottom: 5,
    width: 200,
    alignSelf: 'center',
    color: colors.primaryTwo,
  },

  label: {
    color: colors.primaryTwo,
    fontSize: 16,
    fontWeight: 'bold',
  },

  //
  // Buttons
  //
  button: {
    justifyContent: 'center',
    alignSelf: 'center',
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

  actionButton: {
    width: 60,
    height: 60,
    paddingLeft: 25,
    paddingRight: 25,
    marginRight: 10,
    marginBottom: 20,
    marginTop: 20,
  },

  disabledButton: {
    width: 60,
    height: 60,
    paddingLeft: 25,
    paddingRight: 25,
    marginRight: 10,
    backgroundColor: colors.secondaryOne
  },

  iconButton: {
    width: 50,
    height: 50,
  },

  deleteButton: {
    width: 30,
    height: 30,
    marginLeft: 25,
    borderRadius: 20,
    borderWidth: 0,
    padding: 0,
    backgroundColor: colors.secondaryTwo,
    shadowColor: colors.accentTwo,
    shadowOffset: {width: 2, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 2
  },

  downloadButton: {
    width: 200
  },

  downloadText: {
    fontSize: 14,
  },

  imageButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    borderColor: '#DBDEE3',
    marginTop: 10,
    backgroundColor: '#54777D',
  },

  //
  // CurrentAudio component
  //
  hero: {
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


  //
  // Audio component
  //
  audioName: {
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 18,
    fontWeight: 'bold'
  },

  slider: {
    shadowColor: colors.accentTwo,
    shadowOffset: {width: 1, height: 2},
    shadowOpacity: 0.4,
    shadowRadius: 1
  },

  //
  // Pilas component
  //
  pilas: {
    marginTop: 5,
    marginBottom: 5,
    height: 315,
    backgroundColor: colors.secondaryOne,
  },

  pila: {
    marginTop: 10,
    padding: 10,
    // backgroundColor: colors.secondaryOne,
  },

  pilaAudioWrapper: {
    marginTop: 80,
    flex: 1,
  },

  //
  // Pilas Modal component
  //
  repoName: {
    marginLeft: 20,
    width: 150,
    padding: 10
  }
});

export default MainStyles;
