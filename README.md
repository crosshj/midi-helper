# midi-helper
a service designed to help with music creation using MIDI


# wish
    - play midi files which were previously recorded
    - record midi files from my Yamaha YPG-235 which is USB-MIDI
    - wifi midi host/passthrough


# get started (raspberry pi 3, for example)
    - `sudo apt-get install libasound2-dev`
    - `npm install`
    - `npm run watch`

# mac

install - `CXXFLAGS="-mmacosx-version-min=10.9" LDFLAGS="-mmacosx-version-min=10.9" npm install`

play:

  - enter Audio Midi Setup
  - create a new configuration
  - double click on IAC Driver
  - tick 'Device is online'
  - now you will have a port (but no sound)
  - open Garage Band and add an instrument, now you'll have sound
  
  https://help.ableton.com/hc/en-us/articles/209774225-How-to-setup-a-virtual-MIDI-bus

  