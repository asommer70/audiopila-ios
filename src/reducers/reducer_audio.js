var RNFS = require('react-native-fs');
var Sound = require('react-native-sound');

export default function() {
  var audios = {};

  RNFS.readDir(RNFS.DocumentDirectoryPath)
    .then((files) => {
      files = this.removeStoreFile(files);

      var audios = this.state.audios;
      files.forEach((file) => {
        var s = new Sound(file.name, RNFS.DocumentDirectoryPath, (e) => {
          if (e) {
            console.log('error', e);
          }

          file.slug = file.name.slice(0, file.name.length - 4).replace(/\s/g, '_').toLowerCase();
          file.duration = s.getDuration();
          audios[file.slug] = file;

          // this.setState({audios: audios});
          s.release();
        })
      })
    });

  return audios;
}
