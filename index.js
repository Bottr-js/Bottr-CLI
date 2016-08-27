#!/usr/bin/env node
var program = require('commander')
var childProcess = require('child_process')
var readline = require('readline')
var io = require('socket.io-client')
var color = require('ansi-color').set

function startServer() {
  console.log('Started bot...')
  childProcess.exec('node .');
}

function console_out(rl, msg) {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(msg);
  rl.prompt(true);
}

function startClient() {

  var socket = io('http://localhost:3000/scrabble-dictionary')
  var rl = readline.createInterface(process.stdin, process.stdout);

  rl.on('line', function (line) {
    // - FIXME: Prompt user on ctrl+c
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
  //- Implement package constructor
  console.log('init')
});

program
.command('start')
.action(function () {
  startServer()
});

program
.command('test')
.action(function () {
  startServer()
  //- Detect bots and server
  //- Ask server to print it out so CLI can detect it
  //- Ask user which one to connect to
  startClient()
});

program
.action(function (cmd, env) {
  program.outputHelp()
});

program.parse(process.argv);
