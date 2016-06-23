import { combineReducers } from 'redux';
import AudioReducer from './reducer_audio';

const rootReducer = combineReducers({
  audios: AudioReducer
});

export default rootReducer;
