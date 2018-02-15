import { gql } from 'react-apollo';
import runGQLTest from '../../src/gqlTest';
import login from '../login';

const test = {
  previous: [login],
  name: 'Query authenticated user data',
  gql: gql`
    query {
      me {
        id
        name
        email
      }
    }
  `,
  result: data => ({ userEmail: data.me.email }),
  test: data => data.userEmail === 'voceses@email.com',
  endPoint: process.env.GQL_API_URL,
};
runGQLTest(test);
export default test;
