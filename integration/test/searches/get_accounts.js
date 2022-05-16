// require('should');

// const zapier = require('zapier-platform-core');

// const App = require('../../index');
// const appTester = zapier.createAppTester(App);

// describe('Search - get_accounts', () => {
//   zapier.tools.env.inject();

//   it('should get an array', async () => {
//     const bundle = {
//       authData: {
//         access_token: process.env.ACCESS_TOKEN,
//         refresh_token: process.env.REFRESH_TOKEN,
//       },

//       inputData: {


//       },
//     };

//     const results = await appTester(
//       App.searches['get_accounts'].operation.perform,
//       bundle
//     );
//     results.should.be.an.Array();
//     results.length.should.be.aboveOrEqual(1);
//     results[0].should.have.property('id');
//   });
// });
