
const timeframes = {
  MONTH: 1,
  QUARTER: 3,
  YEAR: 11,
};

const Dates = require("../util/dates");
const Util = require("../util/util");
const Transform = require("../util/reportTransform");
const getAccounts = require("./get_accounts").operation.perform;

const retrieve = async (z, bundle, startDate, endDate) => {
  let params = {
    fromDate: startDate,
    toDate: endDate
  }

  // Remove undefined from the request
  params = Object.fromEntries(
    Object.entries(params)
      .filter(([k, v]) => v !== undefined)
  );

  const options = {
    url: 'https://api.xero.com/api.xro/2.0/Reports/ProfitAndLoss',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.access_token}`,
      'Xero-tenant-id': `${bundle.inputData.tenantId}`,
    },
    params
  };

  let response = await z.request(options);

  response.throwForStatus();
  const results = response.data;

  const report = Transform.transformSections(results);

  report.startDate = new Date(startDate);
  report.endDate = new Date(endDate);

  // report.periods = periods;
  // report.months = months;

  return report;
}

const retrieveReports = async (z, bundle, dateList) => {
  let o = {
    reports: []
  };

  for (var [s,e] of dateList) {
    let report = await retrieve(z, bundle, s, e);

    o.reports.push(report);
  }

  return o;
}

const perform = async (z, bundle) => {

  let { startDate, endDate, buildMultipleReports, multipleReportPeriods } = bundle.inputData;

  endDate = endDate ? new Date(endDate) : Dates.getEOM(new Date()); // same default as Xero endpoint

  startDate = startDate ? new Date(startDate) : Dates.FYS(); // default to Financial Year Start

  let months = Dates.getMonthDifference(startDate, endDate);

  // create date list

  let dateList = buildMultipleReports ?
    Dates.enumerateDaysBetweenDates( startDate, endDate, multipleReportPeriods )
    :
    [ [Dates.xeroDateString(startDate), Dates.xeroDateString(endDate)] ]

  // construct string

  // endDate = Dates.xeroDateString(endDate);
  // startDate = Dates.xeroDateString(startDate);

  let response = await retrieveReports( z, bundle, dateList );

  if (response.reports.length === 1) return [response.reports[0]];

  // Apply 0.00 to all empty fields

  // Get accounts

  // let accounts = await getAccounts(z, bundle);

  // accounts = accounts[0].Accounts.map((x) => {
  //   return {
  //     name: x.Name,
  //     type: x.Type,
  //     code: x.Code
  //   }
  // });

  // // Apply to transactions

  // for (let report of response.reports) {
  //   for (let section of Object.values(report)) {
  //     for (let { name, type, code } of accounts) {
  //       if (section[name] === undefined) section[name] = "0.00";
  //     }
  //   }
  // }
  
  return [response]
}

const testReport = {
  timePeriod: "30 Apr 21 to 31 May 22",
  "Income": {
    "All Sales": 1000.00,
    "GROSS PROFIT": 1000.0
  },
  "Less Operating Expenses": {
    "Purchases": 450.00,
    "GROSS LOSS": 450.00
  },

  startDate: new Date(),
  endDate: new Date(),
  months: 11
}

module.exports = {
  operation: {
    perform,
    inputFields: [
      {
        key: 'tenantId',
        label: 'Tenant (Organisation)',
        type: 'string',
        helpText: 'Select the Organisation to work with.',
        dynamic: 'get_tenants.tenantId.tenantName',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'startDate',
        label: 'Start Date',
        type: 'datetime',
        helpText: 'The date the report starts. You can use [Zapier Date Formatting](https://zapier.com/help/create/basics/different-field-types-in-zaps#step-1). Leave blank for the **most recent financial year**.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'endDate',
        label: 'End Date',
        type: 'datetime',
        helpText: 'The date the report ends. You can use [Zapier Date Formatting](https://zapier.com/help/create/basics/different-field-types-in-zaps#step-1). Leave it blank for the **end of the current month**.',
        required: false,
        list: false,
        altersDynamicFields: false,
      },
      {
        key: 'buildMultipleReports',
        label: 'Generate Multiple Reports?',
        type: 'boolean',
        helpText: 'Whether to generate multiple reports. If so, we\'ll bring back **reports segmented by the period you select below**.',
        required: false,
        list: false,
        altersDynamicFields: true,
      },
      function (z, bundle) {
        if (bundle.inputData.buildMultipleReports) {
          return [{
            key: 'multipleReportPeriods',
            label: 'Period Between Reports',
            type: 'string',
            helpText: 'The time period for generating **multiple reports**.',
            choices: [
              { label: 'Month by Month', key: 'months' }
            ],
            default: 'months',
            required: false,
            list: false,
            altersDynamicFields: false,
          }];
        }
        return [];
      },
    ],
    outputFields: [
      {
        key: "timePeriod",
        label: "Time Period",
        type: "string"
      },
      {
        key: "months",
        label: "Months",
        type: "integer"
      },
      {
        key: "startDate",
        label: "Start Date",
        type: "datetime"
      },
      {
        key: "endDate",
        label: "End Date",
        type: "datetime"
      }
    ],
    sample: testReport
  },
  key: 'get_report',
  noun: 'Report',
  display: {
    label: 'Get Profit & Loss Report',
    description: 'Get a Profit & Loss report from Xero, with support for time period options.',
    hidden: false,
    important: true,
  },
};
