const http = require('http');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// This urlStruct handles all of the routing
const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getCSS,
  '/success': responseHandler.getSuccess,
  '/badRequest': responseHandler.getBadRequest,
  '/unauthorized': responseHandler.getUnauthorized,
  '/forbidden': responseHandler.getForbidden,
  '/internal': responseHandler.getInternal,
  '/notImplemented': responseHandler.getNotImplemented,
  notFound: responseHandler.getNotFound,
};

// Upon recieving a request, it will pull out any query parameters if present.
// It will then route the page to the corretc endpoint using the urlStruct.
const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

  request.query = Object.fromEntries(parsedURL.searchParams);
  request.acceptedTypes = request.headers.accept.split(',');

  if (urlStruct[parsedURL.pathname]) { // if the user goes to an existing page
    urlStruct[parsedURL.pathname](request, response);
  } else { // if the page does not exist
    urlStruct.notFound(request, response);
  }
};

// Starts the server using npm start
http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
