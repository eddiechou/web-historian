//
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('https');
var urlParse = require('url');
var request = require('request');

//Adding native function
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] === deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

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
  index: path.join(__dirname, '../web/public/index.html'),
  loading: path.join(__dirname, '../web/public/loading.html')
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
    if (callback) {
      callback(sites);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  //call readURL
  // console.log('CHECKING FOR READLIST', exports.readListOfUrls);
  // exports.readListOfUrls(function(sites) {
  //   //check for target URL in readURL array
  //   // console.log('// IN isURLInList callback');
  //   // console.log('// getting sites inside:', sites);
  //   // console.log('//Within URLINLIST:', result);
   
  //   var result = sites.indexOf( url) > -1;   
  //   callback(result);
  // });
  exports.readListOfUrls(function(sites) {
    var found = _.any(sites, function(site, i) {
      return site.match(url);
    });
    callback(found);
  });

};

// Should append as strings with \n
exports.addUrlToList = function(url, callback) {
  //Call readListOfUrls
  // exports.readListOfUrls(function(sites) {
    //Add to the result array
    // console.log('///SITES WITHIN URL:', sites);
  //   sites.push(url);
  //   //Split the results by newline

  //   var results = sites.join('\n');
  //   console.log('......///', results);
  //   // console.log('****/// sites within;', sites);
  //   fs.writeFile(exports.paths.list, results, callback);
  //   // console.log('///Within addToUrl exports list*** is:', exports.path.list);
  //   //Write the result back to the file
  // });
  fs.appendFile(exports.paths.list, url + '\n', function(err, file) {
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  // Check if fie with url as name exists in archivedSites
  // console.log('URL');

  var testUrl = exports.paths.archivedSites + '/' + url;
  fs.exists(testUrl, function(exists) {
    callback(exists);
  });
};

// Input: URL array
// Output: nothing
exports.downloadUrls = function(urls) {
  // For each URL in urls
  urls.forEach(function(url) {
    if (!url) { return; }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
    // exports.isUrlArchived(url, function(result) {
    //   // If not archived
    //   if (!result) {
    //     // Go get the file (HTML, CSS)
    //     var options = {
    //       host: url,
    //       post: 80,
    //       path: ''
    //     };
    //     http.get(options, function(res) {
    //       var html = '';
    //       res.on('data', function(chunk) {
    //         html += chunk;
    //       });
    //       res.on('end', function() {
    //         // var hostName = urlParse.parse(url).hostname;
    //         // console.log('//////////URL: ', url);
    //         // console.log('//////////HOstnAMAE: ', hostName);
    //         //url = www.google.com
    //         // console.log('&&&&&& URL BEFORE:', url);
    //         url = url.replace('www.', '').replace('.com', '');
    //         // console.log('&&&&&& URL AFTER:', url);
    //         if (!fs.existsSync(exports.paths.archivedSites + '/' + url)) {
    //           fs.mkdirSync(exports.paths.archivedSites + '/' + url);
    //         }
    //         fs.writeFileSync(exports.paths.archivedSites + '/' + url + '/index.html', html);
    //       });
    //       // console.log('Got results', res);
    //     }).on('error', function(e) {
    //       console.log('Got error:' + e.message);
    //     });
    //     // Create the archive directory
    //     // Put files in archive directory
          
    //   }
    // });

// })
};


































