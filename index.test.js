const config = require('./config.json');
const validate = require('./index');

it('Checks an address', () => {
  validate.address(config.user_id,{
    street: "350 5th Ave",
    zip: "10118"
  })
  .then(address => {
    expect(address.street).toBe("350 5TH AVE");
    expect(address.city).toBe("NEW YORK");
    expect(address.state).toBe("NY");
    expect(address.zip).toBe("10118");
  });
});

it('Supports using State field', () => {
  validate.address(config.user_id,{
    street: "350 5th Ave",
    state: "NY",
    zip: "10118"
  })
  .then(address => {
    expect(address.street).toBe("350 5TH AVE");
    expect(address.city).toBe("NEW YORK");
    expect(address.state).toBe("NY");
    expect(address.zip).toBe("10118");
  });
});

it('Supports using City field', () => {
  validate.address(config.user_id,{
    street: "350 5th Ave",
    city: "New York",
    zip: "10118"
  })
  .then(address => {
    expect(address.street).toBe("350 5TH AVE");
    expect(address.city).toBe("NEW YORK");
    expect(address.state).toBe("NY");
    expect(address.zip).toBe("10118");
  });
});

it('Supports using both State and City fields', () => {
  validate.address(config.user_id,{
    street: "350 5th Ave",
    city: "New York",
    state: "NY",
    zip: "10118"
  })
  .then(address => {
    expect(address.street).toBe("350 5TH AVE");
    expect(address.city).toBe("NEW YORK");
    expect(address.state).toBe("NY");
    expect(address.zip).toBe("10118");
  });
});

it('Gets an error', () => {
  validate.address(config.user_id,{
    street: "350 5th Ave",
    zip: "33333"
  })
  .then(address => {
    expect(address.street).toBe("350 5TH AVE");
    expect(address.city).toBe("NEW YORK");
    expect(address.state).toBe("NY");
    expect(address.zip).toBe("10118");
  })
  .catch(error => {
    expect(error.error).toBe("Invalid Zip Code.")
  });
});