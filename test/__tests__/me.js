import { gql } from 'react-apollo';
import runGQLTest from '../../lib/gqlTest';
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
};
runGQLTest(test);
export default test;
