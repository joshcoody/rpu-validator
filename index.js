const url = "https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=";

const removeExtraSpaces = string => string.trim().replace(/\s{2,}/g, "");

const Validator = class Validator {
  constructor(USER_ID) {
    this.USER_ID = USER_ID;
  }
  address(address) {
    return new Promise((resolve, reject) => {
      if (!this.USER_ID) reject({
        error: 'Did not set your USER ID'
      });
      let xml = `
        <AddressValidateRequest USERID="${this.USER_ID}">
          <Revision>1</Revision>
          <Address ID="0">
            <Address1></Address1>
            <Address2>${address.street}</Address2>
            <City>${address.city}</City>
            <State>${address.state}</State>
            <Zip5>${address.zip}</Zip5>
            <Zip4></Zip4>
          </Address>
        </AddressValidateRequest>
      `;

      fetch(url + removeExtraSpaces(xml))
        .then(response => response.text())
        .then(data => {
          let parser = new DOMParser();
          let xmlDoc = parser.parseFromString(data, "text/xml");
          if (xmlDoc.querySelector('Error')) {
            reject({
              error: xmlDoc.querySelector('Description').innerHTML.trim()
            });
          } else {
            return {
              street: xmlDoc.querySelector('Address2').innerHTML.trim(),
              city: xmlDoc.querySelector('City').innerHTML.trim(),
              state: xmlDoc.querySelector('State').innerHTML.trim(),
              zip: xmlDoc.querySelector('Zip5').innerHTML.trim()
            };
          }
        })
        .then(address => {
          resolve(address);
        })
        .catch(error => {
          reject({
            error: error
          });
        });
    });
  }
}