# To Do

## Movement

- [ ] configure sinewave oscillator.
- [ ] decide how to modulate the oscillator based on branch traits
  - vine width? Decrease amplitude
  - direction, one of the axes is freq

## Synth

- [x] create oscillator factory
  - [x] create oscillator
  - [x] create ui artifact that controls oscillator
  - [x] refactor power button to control local instance, rather than single global
- [x] control oscillator volume
- [x] control oscillator waveform
- [x] update gain when slider changed
- [x] BUG: creating multiple oscillators confuses each oscillator's toggle button
- [x] BUG: oscillator gain not set until clicking volume input
- [x] BUG: volume knobs have same problem as toggle buttons did
- [x] create oscillator frequency interface
  - [x] create a frequency setter for oscMod
  - [x] create input element for note frequencies
  - [X] add option to adjust frequency range (high, med, low)
      - [x] dropdown with three options: H, M, L
      - [X] range update automatically translates pitch position to new range
- [ ] create method of chaining modules
  - [x] create setter methods for in an out in model

  - [ ] some sort of hover event so you can tell what the Hz is
    - called a tooltip
    - [x] add a span as a child node to the slider
    - [x] add some css to make it look cool (cribbed from w3schools)
    - [ ] render it in js so that I can make the tooltip render dynamically


- [ ] optimize oscillator css
  - [ ] oscillator elements organized in a nice box
  - [ ] good color scheme

- [ ] create way to generate notes
  - [ ] generates note frequenciess with math, rather than table lookup

- [ ] create module that alters inputs
  - envelope generator?


- [ ] create patch mechanism
  - api endpoint to set output destination
  - api endpoint to modulate output
  - visual component that draws a line from one out to another in

