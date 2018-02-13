import { gql } from 'react-apollo';
import runGQLTest from '../lib/gqlTest';

export default runGQLTest({
  name: 'Get Works List',
  gql: gql`
      query ($catalogPrefix: String!){
        getWorks(catalogPrefix:$catalogPrefix, limit:20) {
          id
          title
        }
      }
    `,
  vars: () => ({ catalogPrefix: 'AM18' }),
  result: data => ({ workId: data.getWorks[0].id }),
  test: data => !!data.workId,
  repeat: 5,
});
