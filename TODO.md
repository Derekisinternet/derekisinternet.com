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
- [ ] BUG: creating multiple oscillators confuses each oscillator's toggle button
  - I refactored the whole fucking mess into creatable JS objects, but now I'm running into undefineds
  - turns out creating HTML elements in JS doesn't return a pointer to them. You gotta query the DOM for them I guess. Not a big deal, I can just start creating unique IDs for them and then using `document.getElementById()`
  - still a bit complicated. I think it has to do with creating references in memory in different init methods that get destroyed outside the context. I think I just need:
    - global hash with oscillator config
    - html elements that lookup elements in global hash
  - I'm back to original functionality, but with objects instead of script. Observed behavior:
    - all of the toggle buttons only affect the newest created button
    - this problem only exists for the toggle. Other two elements are fine.


- [ ] create patch mechanism

- [ ] do some css
