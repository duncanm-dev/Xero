const perform = async (z, bundle) => {
  const response = await z.request({
    method: 'POST',
    url: 'https://jsonplaceholder.typicode.com/posts',
    body: {
      name: bundle.inputData.name
    }
  });
  return response.data;
};

module.exports = {
  key: 'update_line_item',
  noun: 'Update_line_item',

  display: {
    label: 'Create Update_line_item',
    description: 'Creates a new update_line_item, probably with input from previous steps.'
  },

  operation: {
    perform,

    inputFields: [
      {
        key: 'name',
        required: true
      },
    ],

    sample: {
      id: 1,
      name: 'Test'
    },

    outputFields: [
    ]
  }
};
