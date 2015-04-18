#!/usr/bin/env node
var yargs = require('yargs');
var midi = require('midi');

var argv = yargs
  .command('in', 'Create virtual device you can plug your keyboard into')
  .command('out', 'Create a virtual device you can plug your DAW into')
  .nargs('socket', 1)
  .default('socket', 'https://jetmidi.herokuapp.com')
  .alias('h', 'help')
  .alias('s', 'socket')
  .usage('Usage: $0 in/out/list [--name STRING]')
  .help('help')
  .describe('socket', 'The URL of your socket')
  .example('$0 in', 'start a local virtual device with an input port for your keyboard')
  .example('$0 out', 'start a local virtual device with an output port for your DAW')
  .argv;

if (argv._.indexOf('in') !== -1 || argv._.indexOf('out') !== -1){
  console.log('Creating socket to ' + argv.socket);
  var socket = require('socket.io-client')(argv.socket);
}else{
  console.log(yargs.help());
}

if (argv._.indexOf('in') !== -1){
  var input = new midi.input();
  input.openVirtualPort('jetmidi');
  input.on('message', function(delta, message){
    socket.emit('message', {delta:delta, message:message});
  });
}else if (argv._.indexOf('out') !== -1){
  var output = new midi.output();
  output.openVirtualPort('jetmidi');
  socket.on('message', function(msg){
    console.log('message', msg);
    output.sendMessage(msg);
  });
}




