var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http = require('./http-helpers');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // console.log('///REQUEST:', req);
  archive.readListOfUrls(function() {});
  if (req.method === 'OPTIONS') {
    res.writeHead(200, http.headers);
    res.end();
  } else if (req.method === 'POST') {
    // Get data from input on client
    req.on('data', function(data) {
      console.log('///..data:', data.toString());

      // Read in sites.txt

        // Get the object

      // If it's already in the object
        // If it's 'loaded'
          // Auto-redirect user to archived version
        // else (it's 'unloaded')
          // Auto-redirect to loading.html
      // Else (it's not in the object)
        // Append it to the object
        // Write the object back to sites.txt
    });

    // {"facebook.com":"loaded", "google.com":"unloaded", "soundcloud.com":"unloaded"}
  }
  fs.readFile(archive.paths.index, function(err, data) {
    res.end(data);
  });
};

