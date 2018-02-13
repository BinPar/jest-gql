import createApolloClient from './createApolloClient';

const { describe, test, expect } = global;
const apolloClient = createApolloClient();

const runGQLTest = async (testToRun) => {
  describe('GraphQL Tests', async () => {
    let data = {};
    const executeTest = async (testInfo, num) => {
      if (testInfo.previous) {
        const results = await Promise.all(testInfo.previous);
        results.forEach((testData) => {
          data = { ...data, ...testData };
        });
      }
      test(`${testInfo.name}${num !== undefined ? ` ${num}` : ''}`, async () => {
        expect.assertions(1);
        if (!testInfo.gql) {
          throw Error('No GQL operation provided to the runGQLTest.');
        }
        if (testInfo.gql.definitions.length !== 1) {
          throw Error('Only one GQL operation is allowed in a runGQLTest.');
        }
        const definition = testInfo.gql.definitions[0];
        let result = null;
        switch (definition.operation) {
          case 'mutation': {
            const params = { mutation: testInfo.gql };
            if (testInfo.vars) {
              params.variables = await testInfo.vars(data);
            }
            result = await apolloClient.mutate(params);

            if (testInfo.result) {
              data = { ...data, ...(await testInfo.result(result.data)) };
            }
            if (testInfo.test) {
              expect(testInfo.test(data)).toBe(true);
            } else {
              throw Error('On test defined for the runGQLTest.');
            }
            break;
          }
          case 'query': {
            const params = { query: testInfo.gql };
            if (testInfo.vars) {
              params.variables = await testInfo.vars(data);
            }
            result = await apolloClient.query(params);

            if (testInfo.result) {
              data = { ...data, ...(await testInfo.result(result.data)) };
            }
            if (testInfo.test) {
              expect(testInfo.test(data)).toBe(true);
            } else {
              throw Error('On test defined for the runGQLTest.');
            }
            break;
          }
          default:
            throw Error(`Unknown GQL operation ${definition.operation}.`);
        }
      });
    };
    if (testToRun.repeat) {
      await Promise.all(
        new Array(testToRun.repeat).fill(0).map((_, i) => executeTest(testToRun, i + 1)),
      );
    } else {
      await executeTest(testToRun);
    }
    return data;
  });
};
export default runGQLTest;
