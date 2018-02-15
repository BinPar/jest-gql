import env from 'process-env'

export default {
  endPoint: env.get('GQL_API_URL'),
};
