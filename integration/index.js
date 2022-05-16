const authentication = require('./authentication');
const getTenantsTrigger = require('./triggers/get_tenants.js');
const getReportSearch = require('./searches/get_report.js');
const getAccountsSearch = require('./searches/get_accounts.js');

const findBalanceSheet = require("./searches/balance_sheet");

const updateLineItem = require("./creates/update_line_item");

module.exports = {
  version: require('./package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication: authentication,

  // beforeRequest: [

  // ],
  searches: {
    [getReportSearch.key]: getReportSearch,
    [getAccountsSearch.key]: getAccountsSearch,
    [findBalanceSheet.key]: findBalanceSheet
  },

  triggers: { [getTenantsTrigger.key]: getTenantsTrigger },
  flags: { skipThrowForStatus: true },

  creates: {
    [updateLineItem.key]: updateLineItem
  }
};