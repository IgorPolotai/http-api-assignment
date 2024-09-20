const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

// Writes the head and content of the response
const respond = (request, response, content, type, status) => {
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });
  response.write(content);
  response.end();
};

// Gets the homepage
const getIndex = (request, response) => respond(request, response, index, 'text/html', 200);

// Gets the stylesheet style.css
const getCSS = (request, response) => respond(request, response, css, 'text/css', 200);

// For all other endpoints, this crafts a custom response.
// Takes in the message text, error id, and status code, alongside the request and response.
// This first determines whether it is XML or JSON, then builds the response.
// If the response is a success (200) it will not include the id property of obj
// so that successes only have a message.
const createResponse = (request, response, message, id, status) => {
  const obj = {
    message,
    id,
  };

  if (request.acceptedTypes[0] === 'text/xml') {
    let xmlString = '<response>';
    xmlString += `<message>${obj.message}</message>`;
    if (status !== 200) { xmlString += `<id>${obj.id}</id>`; }
    xmlString += '</response>';
    // console.log("xml!");
    // console.log(xmlString);
    return respond(request, response, xmlString, 'text/xml', status);
  }

  if (status === 200) {
    delete obj.id;
  }
  const objString = JSON.stringify(obj);
  // console.log('json!');
  // console.log(objString);
  return respond(request, response, objString, 'application/json', status);
};

// Calls createResponse to create a Success response
const getSuccess = (request, response) => createResponse(request, response, 'This is a successful response.', 'success', 200);

// Calls createResponse to create a badRequest response
// The if statement handles the query parameter ?valid=true
const getBadRequest = (request, response) => {
  if (!request.query.valid || request.query.valid !== 'true') {
    return createResponse(request, response, 'Missing valid query query parameter set to true.', 'badRequest', 400);
  }
  return createResponse(request, response, 'This request has the required parameters.', 'badRequest', 200);
};

// Calls createResponse to create an Unauthorized response
// The if statement handles the query parameter ?loggedIn=yes
const getUnauthorized = (request, response) => {
  if (!request.query.loggedIn || request.query.loggedIn !== 'yes') {
    return createResponse(request, response, 'Missing loggedIn query parameter set to yes.', 'unauthorized', 401);
  }
  return createResponse(request, response, 'You have successfully viewed the content.', 'unauthorized', 200);
};

// Calls createResponse to create a Forbidden response
const getForbidden = (request, response) => createResponse(request, response, 'You do not have access to this content.', 'forbidden', 403);

// Calls createResponse to create an Internal Error response
const getInternal = (request, response) => createResponse(request, response, 'Internal Server Error. Something went wrong.', 'internalError', 500);

// Calls createResponse to create a Not Implemented response
const getNotImplemented = (request, response) => createResponse(request, response, 'A get request for this page has not been implemented yet. Check again later for updated content.', 'notImplemented', 501);

// Calls createResponse to create a Not Found response
const getNotFound = (request, response) => createResponse(request, response, 'The page you are looking for was not found.', 'notFound', 404);

// Exports the functions to be used in server.js
module.exports = {
  getIndex,
  getCSS,
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getNotFound,
};
