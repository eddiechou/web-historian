var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers');
var url = require('url');
// require more modules/folders here!

exports.handleRequest = function (req, res) {
  // console.log('///req:', req);
  archive.readListOfUrls(function() {});
  if (req.method === 'OPTIONS') {
    res.writeHead(200, httpHelpers.headers);
    res.end();
  } else if (req.method === 'POST') {
    httpHelpers.collectData(req, function(data) {
      var url = data.toString().slice(4).replace('http://', '');
      archive.isUrlInList(url, function(isInList) {
        if (isInList) {
          archive.isUrlArchived(url, function(isArchived) {
            if (isArchived) {
              httpHelpers.sendRedirect(res, '/' + url);
            } else {  // not archived
              httpHelpers.sendRedirect(res, '/loading.html');
            }
          });
        } else { // not in the list
          archive.addUrlToList(url, function() {
            httpHelpers.sendRedirect(res, '/loading.html');
          });
        }
      });
    });

  } else if (req.method === 'GET') {

    var pathname = url.parse(req.url).pathname;
    // Return the app's index file
    if (pathname === '/') {
      fs.readFile(archive.paths.index, function(err, data) {
        res.end(data);
      });
    }

    httpHelpers.serveAssets(res, pathname, function() {
      // trim leading slash if present
      if (pathname[0] === '/') { pathname = pathname.slice(1); }

      archive.isUrlInList(pathname, function(found) {
        if (found) {
          httpHelpers.sendRedirect(res, '/loading.html');
        } else {
          httpHelpers.send404(res);
        }
      });
    }); 
  }
};

