#!/usr/bin/env node

var program = require('commander')
var childProcess = require('child_process')
var fs = require('fs');
var port = process.env.port || 3000;

function startCommand(command, callback) {
  var child = childProcess.exec(command, callback)
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
  return child
}

function init() {

  console.log('Creating new bot...')

  fs.readFile(__dirname + '/templates/index.js', (err, data) => {
    if (err) throw err;

    console.log('Copying index.js...')

    fs.writeFile('index.js', data, function(err) {
      if (err) throw err;

      console.log('Copied index.js...')
    })
  });

  fs.readFile(__dirname + '/templates/package.json', (err, data) => {
    if (err) throw err;

    console.log('Copying Package.json...')

    fs.writeFile('package.json', data, function(err) {
      if (err) throw err;

      console.log('Copied Package.json...')
      console.log('Installing Dependencies...')

      startCommand('npm install')
    })
  });
}

function startServer() {
  return startCommand('node .', function (error, stdout, stderr) {
    process.exit(1)
  })
}

function console_out(rl, msg) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(msg);
  rl.prompt(true);
}

program
.version('0.1.0') // Read from Package.json

program
.command('init')
.action(function () {
  init()
})

program
.command('start')
.action(function () {
  startServer()
  console.log('Server is running on http://localhost:' + port)
  // - Start Mac, Mobile
})

program
.command('build')
.action(function () {
  // - Build Mac, Mobile
})

program
.action(function (cmd, env) {
  program.outputHelp()
})

program.parse(process.argv);
