import { NativeModules } from 'react-native';

const MusicFilesManager = {
  getAll(options) {
    return new Promise((resolve, reject) => {
      NativeModules.MusicFilesManager.getAll(options, reject, resolve);
    });
  },
  getCovers(ids) {
    return new Promise((resolve, reject) => {
      NativeModules.MusicFilesManager.getCovers(ids, reject, resolve);
    });
  }
}

export default MusicFilesManager;