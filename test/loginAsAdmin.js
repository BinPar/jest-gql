import gql from 'graphql-tag';

const test = {
  name: 'Login Test',
  gql: gql`
    mutation($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        OK
        token
      }
    }
  `,
  vars: () => ({ email: 'admin@test.com', password: 'adminPassword' }),
  result: data => ({ OK: data.login.OK, oAuthToken: data.login.token }),
  test: data => data.OK,
};

export default test;
