const perform = async (z, bundle) => {
  const options = {
    url: 'https://api.xero.com/api.xro/2.0/Accounts',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${bundle.authData.access_token}`,
      'Xero-tenant-id': `${bundle.inputData.tenantId}`,
    },
    params: {
      tenantId: bundle.inputData.tenantId,
    },
    body: {},
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return [results];
  });
};

module.exports = {
  operation: {
    perform: perform,
    inputFields: [
      {
        key: 'tenantId',
        label: 'Tenant (Organisation)',
        type: 'string',
        helpText: 'Select the tenant to work with.',
        dynamic: 'get_tenants.tenantId.tenantName',
        required: true,
        list: false,
        altersDynamicFields: false,
      },
    ],
  },
  key: 'get_accounts',
  noun: 'Account',
  display: {
    label: 'Retrieve Accounts',
    description: 'Retrieve a list of all accounts attached to the tenant.',
    hidden: false,
    important: true,
  },
};
