//
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    // console.log('///data in readfile:', (data)); 
    // console.log('in readListOfUrls');
    // console.log('// obj:', data.toString());
    // console.log('//Sites: ', sites);
    // console.log('***is sites an array', Array.isArray(sites));
    // data should contain array of sites
    // callback(obj);

    var wholeString = data.toString();
    var sites = wholeString.split('\n');
    callback(sites);
  });
};

exports.isUrlInList = function(url, callback) {
  //call readURL
  // console.log('CHECKING FOR READLIST', exports.readListOfUrls);
  exports.readListOfUrls(function(sites) {
    //check for target URL in readURL array
    // console.log('// IN isURLInList callback');
    // console.log('// getting sites inside:', sites);
    // console.log('//Within URLINLIST:', result);
   
    var result = sites.indexOf( url) > -1;   
    callback(result);
  });

};

// Should append as strings with \n
exports.addUrlToList = function(url, callback) {
  //Call readListOfUrls
  exports.readListOfUrls(function(sites) {
    //Add to the result array
    // console.log('///SITES WITHIN URL:', sites);
    sites.push(url);
    //Split the results by newline
    var results = sites.join('\n');
    // console.log('****/// sites within;', sites);
    fs.writeFile(exports.paths.list, results, callback);
    // console.log('///Within addToUrl exports list*** is:', exports.path.list);
    //Write the result back to the file
  });

};

exports.isUrlArchived = function(url, callback) {
  // Check if fie with url as name exists in archivedSites
  // console.log('URL');
  var testUrl = exports.paths.archivedSites + '/' + url;
  var result = fs.existsSync(testUrl);
  // console.log('RESULTTTTTT', result);
  callback(result);
};

// Input: URL array
// Output: nothing
exports.downloadUrls = function(urls) {
  // For each URL in urls
  urls.forEach(function(url) {
    exports.isUrlArchived(url, function(result) {
      // If not archived
      if (!result) {
        // Go get the file (HTML, CSS)
        var options = {
          host: url,
          post: 80,
          path: ''
        };
        http.get(options, function(res) {
          var html = '';
          res.on('data', function(chunk) {
            html += chunk;
          });
          res.on('end', function() {
            fs.writeFileSync(exports.paths.archivedSites + '/' + url, html);
          });
          // console.log('Got results', res);
        }).on('error', function(e) {
          console.log('Got error:' + e.message);
        });
        // Create the archive directory
        // Put files in archive directory
          
      }
    });

  });




};


































