const testAuth = async (z, bundle) => {
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

    return results;
  });
};

const getAccessToken = (z, bundle) => {
    const options = {
        url: 'https://identity.xero.com/connect/token',
        method: 'POST',
        headers: {
        'content-type': 'application/x-www-form-urlencoded',
        'accept': 'application/json'
        },
        params: {
    
        },
        body: {
        'code': bundle.inputData.code,
        'client_id': process.env.CLIENT_ID,
        'client_secret': process.env.CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'redirect_uri': bundle.inputData.redirect_uri
        }
    }
  
  return z.request(options)
    .then((response) => {
        response.throwForStatus();
        const results = response.json;

        // You can do any parsing you need for results here before returning them

        return results;
    });
}

const refreshAccessToken = (z, bundle) => {
  const options = {
    url: 'https://identity.xero.com/connect/token',
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: {
      'grant_type': 'refresh_token',
      'refresh_token': bundle.authData.refresh_token,
      'client_id': process.env.CLIENT_ID,
      'client_secret': process.env.CLIENT_SECRET
    }
  }
  
  return z.request(options)
    .then((response) => {
      response.throwForStatus();
      const results = response.json;
      
  
      return results;
    });
}

module.exports = {
  type: 'oauth2',
  test: testAuth,
  oauth2Config: {
    authorizeUrl: {
      method: 'GET',
      url: 'https://login.xero.com/identity/connect/authorize',
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code',
      },
    },
    getAccessToken,
    refreshAccessToken,
    scope:
      'openid profile email accounting.transactions accounting.reports.read offline_access accounting.settings accounting.settings.read',
    autoRefresh: true,
  },
  connectionLabel: '{{tenantName}}',
};
