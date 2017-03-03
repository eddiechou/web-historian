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
    // console.log('/////////PATHNAME:', pathname);
    // // if we don't have the archived file, return 404
    // archive.isUrlArchived(pathname, function(result) {
    //   if (!result) {
    //     res.writeHeader(404, httpHelpers.headers);
    //     res.end();
    //   } else {

    //     // it is archived, so return the file
    //     var createUrlThing = '';
    //     if (pathname[pathname.length - 1] !== '/') {
    //       createUrlThing = '/'; 
    //     }
    //     console.log('FILE PATH FOR RETURNING FILE: ', archive.paths.archivedSites + pathname + createUrlThing + 'index.html');
    //     fs.readFile(archive.paths.archive + '/' + pathname + 'index.html', function(err, data) {
    //       res.writeHeader(200, httpHelpers.headers);
    //       res.end(data);
    //     });
    //   }
    // });

    // if (pathname === 'Users/student/Desktop/hrsf72-web-historian/web/public/loading.html') {
    //   fs.readFile(archive.paths.loading, function(err, data) {
    //     res.writeHeader(200, httpHelpers.headers);
    //     res.end(data);
    //   });
    // }
  }
    // // Get data from input on client
    // // console.log('///In POST');
    // req.on('data', function(data) {
    //   // console.log('///..data:', data.toString().slice(4));
    //   // Grab URL
      // var targetUrl = data.toString().slice(4);
    //   // If isURLArchived
      // archive.isUrlArchived(targetUrl, function(result) {
      //   // console.log('WITHIN URL ARCHIVED FUNC');
      //   if (result) {
      //     // console.log('WITHIN PASSED');
      //   // redirect to archived site
      //     // res.redirect(archive.paths.archivedSites + '/' + targetUrl);
      //     res.statusCode = 302;
      //     res.setHeader('Location', archive.paths.archivedSites + '/' + targetUrl);
      //     res.end();
    //     } else {
    //       // console.log('WITHIN ELSE');
    //   // Else !isURLArchived
    //     // redirect to loading html
    //       // addURLtoList
    //       //archive.paths.loading
    //       res.statusCode = 302;
    //       res.setHeader('Location', archive.paths.loading);
    //       archive.addUrlToList(targetUrl, function() {
    //         console.log('////Within Else and addUrl');
    //         // res.writeHead(301, {
    //         //   'Location': archive.paths.loading
    //         fs.readFile(archive.paths.loading, function(err, data) {
    //           console.log('///////////data:', data.toString());
    //           res.end(data.toString());
    //         });

    //       });
    //       // res.redirect(archive.paths.loading
    //     }
    //   });


    // });    
};

