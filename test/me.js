import { gql } from 'react-apollo';

const test = {
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

export default test;
