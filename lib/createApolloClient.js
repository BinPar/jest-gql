import { ApolloClient, createNetworkInterface } from 'react-apollo';
import fetch from 'isomorphic-fetch';
import tokenInfo from './tokenInfo';
import config from './config';

if (!process.browser) {
  global.fetch = fetch;
}

const networkInterface = createNetworkInterface({
  uri: config.endPoint,
});

const middleWares = [
  {
    applyMiddleware(req, next) {
      const token = tokenInfo.token;
      if (token) {
        if (!req.options.headers) {
          req.options.headers = {};
        }
        req.options.headers.authorization = token ? `Bearer ${token}` : null;
      }
      next();
    },
  },
];

networkInterface.use(middleWares);

function create(initialState, data) {
  const severNetworkInterface = createNetworkInterface({ uri: config.endPoint, opts: data });
  severNetworkInterface.use(middleWares);
  return new ApolloClient({
    initialState,
    ssrMode: true,
    networkInterface: severNetworkInterface,
  });
}


export default create;
