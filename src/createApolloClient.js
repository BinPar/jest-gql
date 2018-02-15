import { ApolloClient, createNetworkInterface } from 'react-apollo';
import fetch from 'isomorphic-fetch';

if (!process.browser) {
  global.fetch = fetch;
}

function create(data) {
  const networkInterface = createNetworkInterface({
    uri: process.env.GQL_API_URL,
  });
  const middleWares = [
    {
      applyMiddleware(req, next) {
        const token = data.oAuthToken;
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
  const severNetworkInterface = createNetworkInterface({ uri: process.env.GQL_API_URL });
  severNetworkInterface.use(middleWares);
  return new ApolloClient({
    ssrMode: true,
    networkInterface: severNetworkInterface,
  });
}

export default create;
