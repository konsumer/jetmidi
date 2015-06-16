# jetmidi
Play midi over the internet, with sockets

This is a peer-to-peer socket for 2-way MIDI signals. It will attempt to traverse firewalls in the way, and allow you to send MIDI back and forth via a virtual MIDI pipe.

# cli

After installing with `npm install -g jetmidi`, you can run `jetmidi` to get some help.


## basic usage

One one computer (IP address 192.168.0.4, in this example) run this:

```
jetmidi --ip 192.168.0.5 --port 5556 --destination 5557
```

On the other machine (IP address 192.168.0.5, in this example):

```
jetmidi --ip 192.168.0.4 --port 5557 --destination 5556
```

On both computers you will get virtual MIDI devices named "JetMIDI in/out" that you can connect your DAW or input device to.