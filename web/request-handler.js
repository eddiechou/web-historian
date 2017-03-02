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
    console.log('///In POST');
    req.on('data', function(data) {
      console.log('///..data:', data.toString().slice(4));
      // Grab URL
      var targetUrl = data.toString().slice(4);
      // If isURLArchived
      archive.isUrlArchived(targetUrl, function(result) {
        console.log('WITHIN URL ARCHIVED FUNC');
        if (result) {
          console.log('WITHIN PASSED');
        // redirect to archived site
          res.redirect(archive.paths.archivedSites + '/' + targetUrl);
        } else {
          console.log('WITHIN ELSE');
      // Else !isURLArchived
        // redirect to loading html
          // addURLtoList
          archive.addUrlToList(targetUrl, function() {
            res.writeHead(301, {
              'Location': archive.paths.loading
            });
            res.end();
          });
          // res.redirect(archive.paths.loading
        }
      });


    });    
  }
  fs.readFile(archive.paths.index, function(err, data) {
    res.end(data);
  });
};

