# To Do

## DEMOS

### Movement

- [ ] configure sinewave oscillator.
- [ ] decide how to modulate the oscillator based on branch traits
  - vine width? Decrease amplitude
  - direction, one of the axes is freq

### Synth

- [ ] create method of chaining modules
  - [x] create setter methods for in an out in model
  - [x] create inputs in view
  - [x] create outputs in view
  - [ ] create button method that connects one module output to another module input
    - [x] create global patch buffer. 
    - [x] create method that adds output id to patch buffer
    - [ ] create method that pops output out of buffer and connects it to module input
      - [ ] button method gets module's .node
      - [ ] button calls node.patchTo or node.patchFrom

  - [x] refactor oscillator MVC to decouple gain

- [ ] optimize oscillator css
  - [ ] oscillator elements organized in a nice box
  - [ ] good color scheme

- [ ] create way to generate notes
  - [ ] generates note frequenciess with math, rather than table lookup

- [ ] create module that alters input wave
  - envelope generator?
  - ASDR


- [ ] create patch mechanism
  - api endpoint to set output destination
  - api endpoint to modulate output
  - visual component that draws a line from one out to another in

