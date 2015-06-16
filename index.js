#!/usr/bin/env node
/*
Firewall traversing 2-way midi
Ideas from https://gist.github.com/metal3d/1135356
*/

var dgram = require('dgram');

var yargs = require('yargs');
var midi = require('midi');

var argv = yargs
  .help('help')
  .alias('h', 'help')

  .boolean('verbose')
  .describe('verbose', 'Verbose debugging info')
  .alias('v', 'verbose')

  .nargs('ip', 1)
  .describe('ip', 'The destination IP address to connect a socket to')
  .alias('i', 'ip')
  .require('ip')

  .nargs('port', 1)
  .describe('port', 'The host port for the socket')
  .default('port', 5556)
  .alias('p', 'port')

  .nargs('destination', 1)
  .describe('destination', 'The destination port for the socket')
  .default('destination', 5557)
  .alias('d', 'destination')

  .usage('Usage: $0 --ip 192.168.0.5 [--port 3000] [--destination 3001]')
  .example('$0 -i 192.168.0.5', 'connect a socket to 192.168.0.5 on port 5556/5557')
  .example('$0 -i 192.168.0.4 -p 5557 -d 5556', 'connect a socket to 192.168.0.4 on port 5557/5556')

  .argv;

var server = dgram.createSocket('udp4');
var input = new midi.input();
input.openVirtualPort('JetMIDI in');
var output = new midi.output();
output.openVirtualPort('JetMIDI out');

server.on("listening", function () {
  var address = server.address();
  console.log("server listening " + address.address + ":" + address.port);
});

var listening = false;
var ACK_GARBAGE = new Buffer("node-transversal-garbage");
var ACK_MAGICK = new Buffer("node-transversal-magick");

function sendMSG(msg){
  server.send(
    msg, 0 , 
    msg.length, 
    argv.destination, argv.ip);
}

server.on("message", function (msg, rinfo) {
  if (listening) {
    if (argv.verbose)
      console.log('server', msg);
    var out = [];
    for (i in msg){
      out.push(msg[i]);
    }
    output.sendMessage(out);
  }else if (msg.toString() == ACK_MAGICK.toString()) {
    listening = true;
  }
});

input.on('message', function(delta, msg){
  if (argv.verbose)
    console.log('input', msg);
  if (Array.isArray(msg))
    msg = new Buffer(msg);
  sendMSG(msg);
});

server.bind(argv.port);

for (var i=0; i<10; i++) {
  setTimeout(function (){sendMSG( ACK_GARBAGE); }, 1000*i); 
}
setTimeout(function (){sendMSG( ACK_MAGICK); } , 1000*(i++));
setTimeout(function (){
  console.log("Ready");
},1000*(i++));
