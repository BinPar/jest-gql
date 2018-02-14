import { gql } from 'react-apollo';

const test = {
  name: 'Login Test',
  gql: gql`
    mutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        error
        token
      }
    }
  `,
  vars: () => ({ email: 'voceses@email.com', password: 'voceses' }),
  result: data => ({ error: data.login.error, oAuthToken: data.login.token }),
  test: data => !data.error,
};

export default test;
