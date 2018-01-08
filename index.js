const isBrowser = () => { try { return this === window; } catch(e) { return false; } };

var commonFetch = null;

if (!isBrowser()) {
  commonFetch = require('node-fetch-polyfill');
} else {
  commonFetch = window.fetch;
}

const removeExtraSpaces = string => string.trim().replace(/\s{2,}/g, "");

const xmlTagSelector = (xml, tag) => {
  let result = xml.match(new RegExp(`<${tag}>(.*)</${tag}>`));
  return result ? result[1] : false;
}

const address = (USER_ID, address) => {
  let url = "https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=";
  return new Promise((resolve, reject) => {
    if (!USER_ID) reject({
      error: 'Did not set your USER ID'
    });
    let xml = `
      <AddressValidateRequest USERID="${USER_ID}">
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

    commonFetch(url + removeExtraSpaces(xml))
      .then(response => response.text())
      .then(data => {
        if (xmlTagSelector(data, 'Error')) {
          reject({
            error: xmlTagSelector(data, 'Description').trim()
          });
        } else {
          resolve({
            street: xmlTagSelector(data, 'Address2').trim(),
            city: xmlTagSelector(data, 'City').trim(),
            state: xmlTagSelector(data, 'State').trim(),
            zip: xmlTagSelector(data, 'Zip5').trim()
          });
        }
      })
      .catch(error => {
        reject({
          error: error
        });
      });
  });
};

if (!isBrowser()) {
  module.exports.address = address;
}