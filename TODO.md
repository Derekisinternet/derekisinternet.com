# To Do

## Movement

- [ ] configure sinewave oscillator.
- [ ] decide how to modulate the oscillator based on branch traits
  - vine width? Decrease amplitude
  - direction, one of the axes is freq

## Synth

- [ ] create method of chaining modules
  - [x] create setter methods for in an out in model
  - [x] create inputs in view
  - [x] create outputs in view
  - [ ] create button method that connects one module output to another module input
    - [x] created global patch buffer. 
    - [ ] create method that adds output to patch buffer
    - [ ] create method that pops output out of buffer and connects it to module input
  - [ ] refactor oscillator MVC to decouple gain

- [x] BUG: selector to create modules doesn't allow you to make type that's currently selected


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

