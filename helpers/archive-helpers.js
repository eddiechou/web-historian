//
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

var Promise = require('bluebird');

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
    var wholeString = data.toString();
    var sites = wholeString.split('\n');
    if (callback) {
      callback(sites);
    }
  });
};

exports.isUrlInList = function(url, callback) {
  exports.readListOfUrls(function(sites) {
    var found = _.any(sites, function(site, i) {
      return site.match(url);
    });
    callback(found);
  });

};

// Should append as strings with \n
exports.addUrlToList = function(url, callback) {
  fs.appendFile(exports.paths.list, url + '\n', function(err, file) {
    callback();
  });
};

exports.isUrlArchived = function(url, callback) {
  // Check if fie with url as name exists in archivedSites
  var testUrl = exports.paths.archivedSites + '/' + url;
  fs.exists(testUrl, function(exists) {
    callback(exists);
  });
};

exports.downloadUrls = function(urls) {
  // For each URL in urls
  urls.forEach(function(url) {
    if (!url) { return; }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};


/* Todo: Promises Versions of the methods */

var readFile = Promise.promisify(fs.readFile);
var appendFile = Promise.promisify(fs.appendFile);
var exists = Promise.promisify(fs.exists);

exports.readListOfUrlsQ1 = function(callback) {
  return readFile(exports.paths.list)
    .then(function(sites) {
      var wholeString = data.toString();
      var sites = wholeString.split('\n');
      (sites);
    })
    .catch(function(err) {
      // file doesn't exist in archive!
      callback ? callback() : exports.send404(res);
    });
};

exports.isUrlInListQ1 = function(url, callback) {
  return exports.readListOfUrls()
    .then(function(sites) {
      var found = _.any(sites, function(site, i) {
        return site.match(url);
      });
      resolve(found);
    });
};

// Should append as strings with \n
exports.addUrlToListQ1 = function(url, callback) {
  return appendFile(exports.paths.list, url + '\n')
    .then(function(result) {
      callback(result);
    });
};

exports.isUrlArchivedQ1 = function(url, callback) {
  // Check if fie with url as name exists in archivedSites
  var testUrl = exports.paths.archivedSites + '/' + url;
  return exists(testUrl)
    .then(function(result) {
      callback(result);
    });
};

exports.downloadUrlsQ1 = function(urls) {
  // For each URL in urls
  urls.forEach(function(url) {
    if (!url) { return; }
    request('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
  });
};


// exports.readListOfUrls = exports.readListOfUrlsQ1;
// exports.isUrlInList = exports.isUrlInListQ1;
// exports.addUrlToList = exports.addUrlToListQ1;
// exports.isUrlArchived = exports.isUrlArchivedQ1;
// exports.downloadUrls = exports.downloadUrlsQ1;
