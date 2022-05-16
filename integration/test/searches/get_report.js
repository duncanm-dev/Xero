require('should');

const { doesNotThrow } = require('should');
const zapier = require('zapier-platform-core');

const App = require('../../index');
const appTester = zapier.createAppTester(App);

describe('Search - get_report', (z, bundle) => {
  zapier.tools.env.inject();

  it('should get an array', async () => {
    const bundle = {
      authData: {
        access_token: process.env.ACCESS_TOKEN,
        refresh_token: process.env.REFRESH_TOKEN
      },

      inputData: {
        tenantId: "8e7e14e9-93a1-4ed6-8591-93f1ab154249",
        buildMultipleReports: true,
        startDate: "2022-03-12",
        endDate: "2022-05-12"
      },
    };

    const results = await appTester(
      App.searches['get_report'].operation.perform,
      bundle
    );
    console.dir(results, { depth: null });
  });
});
