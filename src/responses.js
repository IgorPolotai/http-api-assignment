const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/styles.css`);

const respond = (request, response, content, type, status) => {
  response.writeHead(status, {
    'Content-Type': type,
    'Content-Length': Buffer.byteLength(content, 'utf8'),
  });
  response.write(content);
  response.end();
};

const getIndex = (request, response) => respond(request, response, index, 'text/html', 200);

const getCSS = (request, response) => respond(request, response, css, 'text/css', 200);

const createResponse = (request, response, message, id, status) => {
  const obj = {
    message: `Message: ${message}`,
    id: id,
  };

  if (request.acceptedTypes[0] === 'text/xml') {
    let xmlString = '<response>';
    xmlString += `<message>${obj.message}</message>`;
    if(id !== "success") {xmlString += `<id>${obj.id}</id>`;}
    xmlString += '</response>';
    console.log(xmlString);
    return respond(request, response, xmlString, 'text/xml', status);
  }

  if(id === "success") {
    delete obj.id;
  }
  const objString = JSON.stringify(obj);
  console.log(objString);
  // We can't just send a JSON object, so we need to turn it
  // into a string or bit array. Parse will convert that back
  // into a JSON object
  return respond(request, response, objString, 'application/json', status);
};

const getSuccess = (request, response) => createResponse(request, response, "This is a successful response.", "success", 200);

const getBadRequest = (request, response) => {
    createResponse(request, response, "This is a successful response", "success", 200);
}

const getUnauthorized = (request, response) => createResponse(request, response, "This is a successful response", "success", 200);

const getForbidden = (request, response) => createResponse(request, response, "You do not have access to this content.", "forbidden", 403);

const getInternal = (request, response) => createResponse(request, response, "TInternal Server Error. Something went wrong.", "internalError", 500);

const getNotImplemented = (request, response) => createResponse(request, response, "A get request for this page has not been implemented yet. Check again later for updated content.", "notImplemented", 501);

const getNotFound = (request, response) => createResponse(request, response, "The page you are looking for was not found.", "notFound", 404);

//     '/': responseHandler.getIndex,
//     '/style.css': responseHandler.getCSS,
//     '/success': responseHandler.getSuccess,
//     '/badRequest': responseHandler.getBadRequest,
//     '/unauthorized': responseHandler.getUnauthorized,
//     '/forbidden': responseHandler.getForbidden,
//     '/internal': responseHandler.getInternal,
//     '/notImplemented': responseHandler.getNotImplemented,
//     notFound: responseHandler.getNotFound,

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
