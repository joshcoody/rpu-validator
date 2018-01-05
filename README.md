# Validator

Simple Promise based API to validate different tasks.

### Table of contents
  * [How to Setup](#how-to-setup)
  * [How to Use](#how-to-use)
    * [Address Validator](#address-validator)

### How to Setup:

First you need to register for an API key / User ID [here](https://www.usps.com/business/web-tools-apis/welcome.htm).

Once you have your User ID, you need to instantiate the Validator via the following:

```javascript
const validate = new Validator('YOUR USER ID HERE');
```

Now going forward you can use run the method to validate an address like the following:

```javascript
validate.address({
  street: "350 5th Ave",
  zip: "10118"
})
```

### How to Use:

#### Address Validator

For US based addresses via USPS API.

You run the following to validate a basic address:

```javascript
validate.address({
  street: "350 5th Ave",
  zip: "10118"
})
.then(address => {
  /* Do something with the validated address */
  console.log(address);
})
```

The result of the above should return this:

```javascript
{
  street: "350 5TH AVE",
  city: "NEW YORK",
  state: "NY",
  zip: "10118"
}
```

You can catch any errors, like the following:

```javascript
validate.address({
  street: "350 5th Ave",
  zip: "33333"
})
.catch(error => {
  /* If something goes wrong errors will show up here */
  console.log(error)
});
```

You'll get back an error like this:

```javascript
{
  error: "Invalid Zip Code."
}
```