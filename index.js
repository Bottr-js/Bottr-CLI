#!/usr/bin/env node

var program = require('commander')
var childProcess = require('child_process')
var readline = require('readline')
var io = require('socket.io-client')
var fs = require('fs');
var color = require('ansi-color').set

function init() {
  fs.readFile(__dirname + 'templates/package.json', (err, data) => {
    if (err) throw err;

    fs.writeFile('package.json', data, function(err) {
      if (err) throw err;
      exec('npm install');
    })
  });

  fs.readFile(__dirname + 'templates/index.js', (err, data) => {
    if (err) throw err;

    fs.writeFile('index.js', data, function(err) {
      if (err) throw err;
    })
  });
}

function startServer() {
  console.log('Started bot...')
  return childProcess.exec('node .', function (error, stdout, stderr) {
    process.exit(1)
  });
}

function console_out(rl, msg) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(msg);
  rl.prompt(true);
}

function startClient(url) {

  var connectionUrl = url || 'http://localhost:3000/'
  console.log('Connected to ' + connectionUrl)

  var socket = io(connectionUrl)
  var rl = readline.createInterface(process.stdin, process.stdout);

  rl.on('line', function (line) {
    socket.emit('message', { text: line });
    rl.prompt(true);
  });

  rl.on('SIGINT', () => {
    process.exit(0)
  });

  socket.on('message', function (data) {
      var leader = color("<bot> ", "green");
      console_out(rl, leader + data.text);
  });

  rl.prompt(true);
}

program
.version('0.0.1')

program
.command('init')
.action(function () {
  init()
})

program
.command('start')
.action(function () {
  startServer()
})

program
.command('test')
.option('-u, --url <url>', 'The URL for the bot')
.action(function (flags) {
  var child = startServer()
  startClient(flags.url)

  process.on('exit', function () {
      child.kill()
  })
})

program
.action(function (cmd, env) {
  program.outputHelp()
})

program.parse(process.argv);
