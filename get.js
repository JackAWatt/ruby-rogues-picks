'use strict';
const cheerio = require('cheerio');
const request = require('request');
const outputFilename = './README.md';
const htmlFilename = './index.html';
const fs = require('fs');
const episodes = [];
const picks = [];
const pageTitle = 'Ruby Rogues Pick Links';
const pageDesc = 'For each episode of the Ruby Rogues podcast there are a lot of great picks each guest shares. This is the list of links.';

let output = `#${pageTitle}\nFor each episode of the [Ruby Rogues podcast](https://devchat.tv/ruby-rogues) there are a lot of great picks each guest shares. This is a repository of all the great links shared on the show.\n`;
let htmlPage = `<!DOCTYPE html><html><head><title>${pageTitle}</title><meta charset="UTF-8"><link rel="stylesheet" href="public/css/style.css" type="text/css" media="screen"><meta name="description" content="${pageDesc}"/><meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes"/></head><body><div class="container">`;
htmlPage += `<h1>${pageTitle}</h1><p>For each episode of the <a href="https://devchat.tv/ruby-rogues">Ruby Rogues podcast</a> there are a lot of great picks each guest shares. This is a repository of all the great links shared on the show.</p>`;

request({
    method: 'GET',
    url: 'https://devchat.tv/ruby-rogues/picks'
}, function(err, response, body, callback) {
  if (err) return console.error(err);
  const $ = cheerio.load(body);

  let prevTitle;
  let i = 0;

  $('.episode-group .episode__body .no-bullets li').each(function(key, callback){
    const title = $(this).parent().parent().parent().find('h5').text();
    const linkText = $(this).text().trim();
    let link = $(this).find('a').attr('href');

    // replace local links
    if(link.charAt(0) === '/'){
      link = 'https://devchat.tv' + link;
    }

    let published = $(this).parent().parent().parent().find('.compact dd').text();
    published = published.split('Duration');
    published = published[0];

    if(prevTitle !== title || prevTitle === undefined){
      prevTitle = title;

      if(i !== 0){
        htmlPage += '</ul>\n';
      }

      output += `\n##${title}\n`;
      htmlPage += `<h2>${title}</h2>\n`;

      output += `Published: ${published}\n`;
      htmlPage += `<p class="published">Published: ${published}</p>\n`;

      output += `- [${linkText}](${link})\n`;
      htmlPage += `<ul>\n<li><a href="${link}">${linkText}</a></li>\n`;
    }else{
      output += `- [${linkText}](${link})\n`;
      htmlPage += `<li><a href="${link}>${linkText}</a></li>\n`;
    }

    i++;
  });

  fs.writeFile(outputFilename, output, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('File saved to ' + outputFilename);
    }
  }); 

  const htmlFull = htmlPage + '</ul>\n</div>\n</body>';

  fs.writeFile(htmlFilename, htmlFull, function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log('File saved to ' + htmlFilename);
    }
  }); 
});