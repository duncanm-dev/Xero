
// const timeframes = {
//   MONTH: 1,
//   QUARTER: 3,
//   YEAR: 11,
// };

const Dates = require("../util/dates");
const Transform = require("../util/reportTransform");

const perform = async (z, bundle) => {

  let { date } = bundle.inputData;

  date = date ? new Date(date) : Dates.getEOM(new Date()); // same default as Xero endpoint

  date = Dates.xeroDateString(date);

  let params = {
    date
  }

  console.log(params);

  // Remove undefined from the request
  params = Object.fromEntries(
    Object.entries(params)
      .filter(([k, v]) => v !== undefined)
  );

  const options = {
    url: 'https://api.xero.com/api.xro/2.0/Reports/BalanceSheet',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.access_token}`,
      'Xero-tenant-id': `${bundle.inputData.tenantId}`,
    },
    params
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.data;

    console.dir(results, { depth: null });

    const report = Transform.transformSections(results);
    report.Date = date;

    return [report];
  });
};

const testReport = {
    "timePeriod": "30 Apr 21 to 31 May 22",
    "Income": {
      "All Sales": 1000.00,
      "GROSS PROFIT": 1000.0
    },
    "Less Operating Expenses": {
      "Purchases": 450.00,
      "GROSS LOSS": 450.00
    },

  Date: Dates.getEOM(new Date())
}

module.exports = {
  key: 'get_balance_sheet',
  noun: 'Balance Sheet',

  display: {
    label: 'Get Balance Sheet',
    description: 'Gets a Balance Sheet for the end of the given month.'
  },

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
        key: 'date',
        label: 'Date',
        type: 'datetime',
        helpText: 'The date you want to generate a Balance Sheet for. You can use [Zapier Date Formatting](https://zapier.com/help/create/basics/different-field-types-in-zaps#step-1). Leave blank for the **current month**.',
        required: false,
        list: false,
        altersDynamicFields: false,
      }
    ],

    sample: testReport,

    // outputFields: [
      // these are placeholders to match the example `perform` above
      // {key: 'id', label: 'Person ID'},
      // {key: 'name', label: 'Person Name'}
    // ]
  }
};
