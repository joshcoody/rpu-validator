'use strict';

var axios = require('axios');

var removeExtraSpaces = function removeExtraSpaces(string) {
  return string.trim().replace(/\s{2,}/g, "");
};

var xmlTagSelector = function xmlTagSelector(xml, tag) {
  var result = xml.match(new RegExp('<' + tag + '>(.*)</' + tag + '>'));
  return result ? result[1] : false;
};

var sendUSPSRequest = function sendUSPSRequest(USER_ID, url, xml) {
  return new Promise(function (resolve, reject) {
    if (!USER_ID) reject({
      error: 'Did not set your USER ID'
    });
    axios.get(url + removeExtraSpaces(xml)).then(function (response) {
      return response.data;
    }).then(function (data) {
      if (xmlTagSelector(data, 'Error')) {
        reject({
          error: xmlTagSelector(data, 'Description').trim()
        });
      } else {
        var result = {};
        if (xmlTagSelector(data, 'Address2')) result.street = xmlTagSelector(data, 'Address2').trim();
        if (xmlTagSelector(data, 'City')) result.city = xmlTagSelector(data, 'City').trim();
        if (xmlTagSelector(data, 'State')) result.state = xmlTagSelector(data, 'State').trim();
        if (xmlTagSelector(data, 'Zip5')) result.zip = xmlTagSelector(data, 'Zip5').trim();
        resolve(result);
      }
    }).catch(function (error) {
      reject({
        error: error
      });
    });
  });
};

var address = function address(USER_ID, _address) {
  var url = "https://secure.shippingapis.com/ShippingAPI.dll?API=Verify&XML=";

  var xml = '\n    <AddressValidateRequest USERID="' + USER_ID + '">\n      <Revision>1</Revision>\n      <Address ID="0">\n        <Address1></Address1>\n        <Address2>' + _address.street + '</Address2>\n        <City>' + _address.city + '</City>\n        <State>' + _address.state + '</State>\n        <Zip5>' + _address.zip + '</Zip5>\n        <Zip4></Zip4>\n      </Address>\n    </AddressValidateRequest>\n  ';

  return new Promise(function (resolve, reject) {
    sendUSPSRequest(USER_ID, url, xml).then(function (response) {
      resolve(response);
    }).catch(function (error) {
      reject(error);
    });
  });
};

var zip = function zip(USER_ID, _zip) {
  var url = "https://secure.shippingapis.com/ShippingAPI.dll?API=CityStateLookup&XML=";

  var xml = '\n    <CityStateLookupRequest USERID="' + USER_ID + '">\n      <ZipCode ID="0">\n        <Zip5>' + _zip + '</Zip5>\n      </ZipCode>\n    </CityStateLookupRequest>\n  ';

  return new Promise(function (resolve, reject) {
    sendUSPSRequest(USER_ID, url, xml).then(function (response) {
      resolve(response);
    }).catch(function (error) {
      reject(error);
    });
  });
};

module.exports.address = address;
module.exports.zip = zip;
