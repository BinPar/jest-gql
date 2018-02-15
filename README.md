# GraphQL based tests for Jest

**jest-gql** is a minimalistic framework for GraphQL tests using jest and Apollo Client

- [How to use](#how-to-use)
  - [Setup](#setup)
  - [Creating the tests](#creating-the-tests)
  - [Composed test example](#composed-test-example)
  - [Oauth token authentication](#oauth-token-authentication)
  - [Remarks](#remarks)
  - [Executing the tests](#executing-the-tests)

## How to use
### Setup

```bash
npm install --save-dev @binpar/jest-gql react react-apollo react-dom graphql-tag jest apollo-client
```

If you have need to setup babel and eslint we recommend to add this packages too (otherwise jump to [executing the tests](#executing-the-tests):

```bash
npm install --save-dev babel-cli babel-core babel-loader babel-plugin-inline-import babel-plugin-transform-exponentiation-operator babel-plugin-transform-object-rest-spread babel-preset-env babel-preset-es2015 babel-register eslint eslint-plugin-import eslint-plugin-jsx-a11y
```

And create the **.babelrc** and  **.eslintrc** in the application directory:

#### .babelrc
```json
{
  "presets": [
    [
      "env",
      {
        "targets": {
          "node": "6.11"
        }
      }
    ]
  ],
  "plugins": [
    [
      "transform-object-rest-spread",
      {
        "useBuiltIns": true
      }
    ],
    [
      "babel-plugin-inline-import",
      {
        "extensions": [".json", ".gql", ".graphql"]
      }
    ],
    "transform-exponentiation-operator"
  ]
}
```

#### .eslintrc
```json
{  
  "extends": [
    "airbnb"
  ],
  "rules": {
    "no-underscore-dangle": [
      "error",
      {
        "allow": [
          "_id"
        ]
      }
    ],
    "import/no-extraneous-dependencies": 0
  }
}
```

### Creating the tests

It is recommended to create a **folder** in the root of the project called ```test``` and a ```__tests__``` folder inside it.

On the ```__tests__``` folder we will place the tests that will be executed by the framework.

On the ```test``` folder we will place the tests that are going to be required as pre-requisites by our tests (like a login GraphQL mutation used in several tests but not executed by it shelf).

As an example, by adding a file called ```allWorks.js``` to the tests ```__tests__``` folder we will setup a test:

```javascript
import { gql } from 'react-apollo';
import runGQLTest from '@binpar/jest-gql';

const test = {
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
  result: res => ({ workId: res.getWorks[0].id }),
  test: data => !!data.workId,
  repeat: 2,
  endPoint: process.env.GQL_API_URL,
};

runGQLTest(test);
export default test;
```

The properties of the tests are:

**previous**: Array with the reference of the tests that need to be executed before the current test (typically stored in the parent folder).

**name**: The name of the test

**gql**: The gql request to execute

**vars**: The variables that we will used by the gql. The function will receive a data object containing the data of the previous tests (all the tests setup in the previous property)

**result**: A function that will be executed after the GraphQL execution that will allow us to setup what information do we retrieve from the server response.

**test**: A function that will be executed with the data generated by the result (and the previous test) and will return a **boolean** indicating the test result (**true**: success, **false**: fail).

**endPoint**: URL of the GraphQL end point.

**repeat**: The number of times that we want the test to be runned

### Composed test example

```test/login.js```:
```javascript
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
```

```test/__tests__/me.js```:
```javascript
import { gql } from 'react-apollo';
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

export default test;
```

Notice that the test that will run is ```me.js```, but it will execute ```login.js``` as a pre-requisite that will be shared by many tests.

### Oauth token authentication

In the previous example, in the ```login.js``` the token returned by the query is stored in the data in the **oAuthToken** property.

This is a special property that will be used for the subsequent requests of this test in order to authenticate the user using **Oauth token authentication**.

### Remarks

All the tests stored in ```__tests__``` will run in parallel, but the execution plan of one test (resulting of the recursive evaluation of the **previous** property will be executed in serial).

Every test will use an unique ApolloClient and NetworkInterface during the execution.

### Executing the tests

It is recommended to add this two lines to the **scripts** section of the **package.json**:

```json
{
  "scripts": {
    "test": "GQL_API_URL='[your endpoint URL]' jest",
    "testDev": "GQL_API_URL='[your endpoint URL]' jest --watch"
  }
}
```

The first one will allow us to use **npm run test** to run all the tests.

The second one will allow us to use **npm run testDev** to execute the tests in interactive mode during the development.