import { gql } from 'react-apollo';
import runGQLTest from '../../src/gqlTest';
import login from '../login';
import me from '../me';

const test = {
  previous: [login, me],
  name: 'Get Works List',
  gql: gql`
    query($catalogPrefix: String!) {
      getWorks(catalogPrefix: $catalogPrefix, limit: 20) {
        id
        title
      }
    }
  `,
  vars: () => ({ catalogPrefix: 'AM18' }),
  result: data => ({ workId: data.getWorks[0].id }),
  test: data => !!data.workId,
  endPoint: process.env.GQL_API_URL,
};

runGQLTest(test);
export default test;
