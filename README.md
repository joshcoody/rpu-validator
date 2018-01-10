# Validator

Simple Promise based API to validate different tasks.

### Table of contents
  * [How to Setup](#how-to-setup)
  * [How to Use](#how-to-use)
    * [Address Validator](#address-validator)
    * [City/State Lookup](#citystate-lookup)

### How to Setup:

Just include the following in your project:

```javascript
const validate = require('rpu-validator');
```

If your process supports it, you can use ES6 imports like the following:

```javascript
import { address, zip } from 'rpu-validator';
```

And then just remove the `validate.` from the examples below.

### How to Use:

#### Address Validator

For US based addresses via USPS API.

First you need to register for an API key / User ID [here](https://www.usps.com/business/web-tools-apis/welcome.htm).

Once you have your User ID, you can begin using the validator like so:

```javascript
validate.address("YOUR USER ID HERE", {
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
validate.address("YOUR USER ID HERE", {
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

#### City/State Lookup
For looking up what the City / State is for a supplied Zip Code.

Similar setup process to the [Address Validator](#address-validator), except instead of passing a whole address, you just pass the Zip Code.

If you run the following:

```javascript
validate.zip("YOUR USER ID HERE", '10118')
.then(response => {
  console.log(response)
})
```

You should get back a response like this:

```javascript
{
  city: "NEW YORK",
  state: "NY",
  zip: "10118"
}
```

You can catch any errors, like the following:

```javascript
validate.zip("YOUR USER ID HERE", '33333')
.catch(error => {
  console.log(error)
});
```

You'll get back an error like this:

```javascript
{
  error: "Invalid Zip Code."
}
```