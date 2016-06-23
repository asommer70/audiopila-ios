import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

import Main from './main';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware()(createStore);

export default class Dux extends Component {
  render() {
    return (
      <Provider store={createStoreWithMiddleware(reducers)}>
        <Main />
      </Provider>
    )
  }
}
