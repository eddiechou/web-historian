// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var http = require('../web/http-helpers');
var url = require('url');

//archive.downloadUrls
//Run over sites.txt, add conditional of whether the target site is in archive or not
archive.readListOfUrls(function (results) {
  //If not run downloadUrls
  var urlsToDownload = [];
  results.forEach(function(url) {
    archive.isUrlArchived(url, function (isArchived) {
      if (isArchived === false) {
        urlsToDownload.push(url);
      }
    });
  });
  console.log(urlsToDownload);
  archive.downloadUrls(urlsToDownload);
});

//Grab .txt array
  //Use .isUrlArchived to check for websites within .txt that have not been archived
    //If archived, remove from .txt array
//Run .downloadUrls over filtered .txt array
  


 