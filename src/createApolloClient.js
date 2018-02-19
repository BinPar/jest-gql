import { ApolloClient, createNetworkInterface } from 'react-apollo';

function create(data) {
  const networkInterface = createNetworkInterface({
    uri: data.endPoint,
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
  const severNetworkInterface = createNetworkInterface({ uri: data.endPoint });
  severNetworkInterface.use(middleWares);
  return new ApolloClient({
    ssrMode: true,
    networkInterface: severNetworkInterface,
  });
}

export default create;
