const perform = async (z, bundle) => {
  const options = {
    url: 'https://api.xero.com/connections',
    method: 'GET',
    headers: {
      Authorization: `Bearer ${bundle.authData.access_token}`,
    },
    params: {},
  };

  return z.request(options).then((response) => {
    response.throwForStatus();
    const results = response.json;

    // You can do any parsing you need for results here before returning them

    return results;
  });
};

module.exports = {
  operation: { perform: perform, canPaginate: false },
  key: 'get_tenants',
  noun: 'Tenant',
  display: {
    label: 'Get Tenants',
    description: 'Retrieve the Tenants (Organisations) available.',
    hidden: true,
    important: false,
  },
};
