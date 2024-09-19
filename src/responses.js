const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const respond = (request, response, content, type) => {
  response.writeHead(200, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => respond(request, response, index, 'text/html');

const getCats = (request, response) => {
  const cat = {
    name: 'Whiskers',
    age: 2,
  };

  if (request.acceptedTypes[0] === 'text/xml') {
    let xmlString = '<response>';
    xmlString += `<name>${cat.name}</name>`;
    xmlString += `<age>${cat.age}</age>`;
    xmlString += '</response>';
    return respond(request, response, xmlString, 'text/xml');
  }

  const catString = JSON.stringify(cat);
  // We can't just send a JSON object, so we need to turn it
  // into a string or bit array. Parse will convert that back
  // into a JSON objetc
  return respond(request, response, catString, 'application/json');
};

module.exports = {
  getCats,
  getIndex,
};
