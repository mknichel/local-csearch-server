var express = require('express');
var process = require('child_process');
var soynode = require('soynode');
var app = express();

soynode.setOptions({
  outputDir: '/tmp/soynode-example',
  uniqueDir: true,
  allowDynamicRecompile: true,
  eraseTemporaryFiles: true
});

soynode.compileTemplates(__dirname, function (err) {
  if (err) {
    throw err;
  }
});

app.get('/', function (req, res) {
  var soyData = {};
  var query = req.query.q;
  if (query) {
    soyData.query = query;

    var cmd = 'csearch -i -n ';
    var fileFilter = [];
    var queryParts = query.split(' ').filter(function(part) {
      if (part.indexOf('f:') == 0) {
        fileFilter.push('(' + part.substring(2) + ')');
        return false;
      }
      return true;
    });
    if (fileFilter.length > 0) {
      cmd += '-f "' + fileFilter.join('|') + '" ';
    }
    cmd += queryParts.join(' ');
    var csearch = '';
    try {
      console.log('Running cmd: ' + cmd);
      csearch = process.execSync(cmd, function(error, stdout, stderr) {
        if (error) {
          console.log(error);
        }
      });
    } catch (e) {
      if (e.status != 1) {
        console.log(e);
        res.status(500);
        res.send(e);
        return;
      }
    }
    var results = csearch.toString();
    results = results.split('\n').filter(function(line) {
      return !(line.length == 0 ||
               line.indexOf('node_modules') != -1 ||
               line.indexOf('bower_components') != -1 ||
               line.indexOf('bazel') != -1 ||
               line.indexOf('/com/google/') != -1 ||
               line.indexOf('soyutils') != -1);
    });
    results = results.map(function(line) {
      var parts = line.split(':');
      return {
        filename: parts[0],
        snippet: parts[2]
      };
    });
    soyData.results = results;
  }
  res.send(soynode.render('csearch.initialPage', soyData));
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
