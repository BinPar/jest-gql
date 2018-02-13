import { gql } from 'react-apollo';
import runGQLTest from '../lib/gqlTest';
import allWorks from './allWorks';

export default runGQLTest({
  previous: [allWorks],
  name: 'Validate senseless code',
  gql: gql`
    mutation validateCode($longCode: String!, $lang: String!) {
      validateCode(longCode: $longCode, lang: $lang) {
        available
      }
    }
  `,
  vars: data => ({ longCode: data.workId, lang: 'es' }),
  result: data => ({ available: data.validateCode.available }),
  test: data => !data.available,
});
