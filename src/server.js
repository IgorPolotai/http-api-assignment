const http = require('http');
const responseHandler = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/cats': responseHandler.getCats,
  index: responseHandler.getIndex,
};

const onRequest = (request, response) => {
  const protocol = request.connection.encrypted ? 'https' : 'http';
  const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

  request.acceptedTypes = request.headers.accept.split(',');
  // console.log(parsedURL);

  // if I go to google.com/gmail, the pathName is /gmail
  if (urlStruct[parsedURL.pathname]) { // if the user goes to an existing page
    urlStruct[parsedURL.pathname](request, response);
  } else { // if the page does not exist
    urlStruct.index(request, response);
  }
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1: ${port}`);
});
