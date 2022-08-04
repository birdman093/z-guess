const config = {
  rapidAPI : {
    method: 'GET',
    url: 'https://zillow-com1.p.rapidapi.com/property',
    params: {
      property_url: ""
    },
    headers: {
      'X-RapidAPI-Key': '9106c0d77dmshb2c2b91d5d331c6p16909cjsndf004e48241a',
      'X-RapidAPI-Host': 'zillow-com1.p.rapidapi.com'
    }
  },
  db: {
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs361_featheru',
    password: '9999',
    database: 'cs361_featheru'
  }
};

module.exports = config;