import createApolloClient from './createApolloClient';

const { describe, test, expect } = global;

const runGQLTest = async (testToRun) => {
  describe('GraphQL Tests', async () => {
    let data = {};
    const executeGQLCommand = async (executionPlan) => {
      const apolloClient = createApolloClient(data);
      const testInfo = executionPlan.pop();

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
          expect(testInfo.test(data, params.variables)).toBe(true);
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
          expect(testInfo.test(data, params.variables)).toBe(true);
          break;
        }
        default:
          throw Error(`Unknown GQL operation ${definition.operation}.`);
      }

      if (executionPlan.length) await executeGQLCommand(executionPlan);
    };

    const getExecutionPlan = (testInfo, executionPlan) => {
      executionPlan.push(testInfo);
      if (testInfo.previous) {
        const prev = [...testInfo.previous];
        while (prev.length) {
          getExecutionPlan(prev.pop(), executionPlan);
        }
      }
    };

    const executeTest = async (testInfo, num) => {
      const executionPlan = [];
      getExecutionPlan(testInfo, executionPlan);
      test(`${testInfo.name}${num !== undefined ? ` ${num}` : ''}`, async () => {
        expect.assertions(executionPlan.length);
        await executeGQLCommand(executionPlan);
      });
    };
    data.endPoint = testToRun.endPoint;
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
