var cheerio = require('cheerio');
var request = require('request');
var outputFilename = './README.md';
var fs = require('fs');
var path = require('path');
var episodes = [];
var picks = [];

var output = '# Ruby Rogues Pick Links \nFor each episode of the [Ruby Rogues podcast](https://devchat.tv/ruby-rogues) there are a lot of great picks each guest shares. This is a repository of all the great links shared on the show.\n';

function write(path, str, mode) {
  fs.writeFileSync(path, str, { mode: mode || 0666 });
  return '   \x1b[36mupdate\x1b[0m : ' + path;
}

request({
    method: 'GET',
    url: 'https://devchat.tv/ruby-rogues/picks'
}, function(err, response, body, callback) {
  if (err) return console.error(err);
  $ = cheerio.load(body);

  var prevTitle;

  $('.episode-group .episode__body .no-bullets li').each(function(key, callback){
    var title = $(this).parent().parent().parent().find('h5').text();
    var linkText = $(this).text().trim();
    var link = $(this).find('a').attr('href');

    // replace local links
    if(link.charAt(0) === '/'){
      link = 'https://devchat.tv' + link;
    }

    var published = $(this).parent().parent().parent().find('.compact dd').text();
    published = published.split('Duration');
    published = published[0];

    if(prevTitle !== title || prevTitle === undefined){
      prevTitle = title;
      output += '\n##' + title + '\n';
      output += 'Published: ' + published + '\n';
      output += '- [' + linkText + '](' + link + ')\n';
    }else{
      output += '- [' + linkText + '](' + link + ')\n';
    }
  });

fs.writeFile(outputFilename, output, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('File saved to ' + outputFilename);
    }
  }); 
});