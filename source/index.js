const axios = require('axios');

const removeExtraSpaces = string => string.trim().replace(/\s{2,}/g, "");

const xmlTagSelector = (xml, tag) => {
  let result = xml.match(new RegExp(`<${tag}>(.*)</${tag}>`));
  return result ? result[1] : false;
}

const sendUSPSRequest = (USER_ID, url, xml) => {
  return new Promise((resolve, reject) => {
    if (!USER_ID) reject({
      error: 'Did not set your USER ID'
    });
    axios.get(url + removeExtraSpaces(xml))
      .then(response => response.data)
      .then(data => {
        if (xmlTagSelector(data, 'Error')) {
          reject({
            error: xmlTagSelector(data, 'Description').trim()
          });
        } else {
          let result = {};
          if (xmlTagSelector(data, 'Address2')) result.street = xmlTagSelector(data, 'Address2').trim();
          if (xmlTagSelector(data, 'City')) result.city = xmlTagSelector(data, 'City').trim();
          if (xmlTagSelector(data, 'State')) result.state = xmlTagSelector(data, 'State').trim();
          if (xmlTagSelector(data, 'Zip5')) result.zip = xmlTagSelector(data, 'Zip5').trim();
          resolve(result);
        }
      })
      .catch(error => {
        reject({
          error: error
        });
      });
  });
}

const address = (USER_ID, address) => {
  let url = "https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=";

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

  return new Promise((resolve, reject) => {
    sendUSPSRequest(USER_ID, url, xml)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

const zip = (USER_ID, zip) => {
  var url = "https://secure.shippingapis.com/ShippingAPI.dll?API=CityStateLookup&XML=";

  var xml = `
    <CityStateLookupRequest USERID="${USER_ID}">
      <ZipCode ID="0">
        <Zip5>${zip}</Zip5>
      </ZipCode>
    </CityStateLookupRequest>
  `;

  return new Promise((resolve, reject) => {
    sendUSPSRequest(USER_ID, url, xml)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        reject(error);
      });
  });
};

module.exports.address = address;
module.exports.zip = zip;