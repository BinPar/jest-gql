import { gql } from 'react-apollo';
import runGQLTest from '../../src/gqlTest';
import login from '../loginAsAdmin';

const test = {
  previous: [login],
  name: 'allAdvertisers Test',
  gql: gql`
    query {
      allCampaignCreativities {
        id
      }
    }
  `,
  result: data => ({ firstRecordID: data.allCampaignCreativities[0].id }),
  test: data => !!data.firstRecordID,
  endPoint: 'http://localhost:3005/graphql',
};

runGQLTest(test);

export default test;
