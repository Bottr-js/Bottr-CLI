#!/usr/bin/env node
var program = require('commander');

program
.version('0.0.1')

program
.command('init')
.action(function () {
   console.log('init')
});

program
.command('start')
.action(function () {
   console.log('start')
});

program
.command('test')
.action(function () {
   console.log('test')
});

program
.action(function(){
  program.outputHelp()
});

program.parse(process.argv);
