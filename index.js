var context = null;
var oscillator = null;
function getOrCreateContext() {
  if (!context) {
    context = new AudioContext();
    oscillator = context.createOscillator();
    oscillator.connect(context.destination);
  }
  return context;
  
}

var isStarted = false;
function playSound(frequency, target=0) {
  getOrCreateContext();
  oscillator.frequency.setTargetAtTime(frequency, context.currentTime, target);
  if (!isStarted) {
    oscillator.start(0);
    isStarted = true;
  } else {
    context.resume();
  }
}

function stopSound() {
  context.suspend();
}

function noteToFreq(note) {
  let a = 440;
  return (a / 32) * (2 ** ((note - 9) / 12));
}

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function op_play(note, target=0) {
  freq = noteToFreq(note)
  playSound(freq, target)
}

class jParser {
  constructor(data) {
    this._data_ = data.split(" ")
    this._char = data[0]
    this._index = 0

    this.tempo = 60
    this.fixed_duration = 1000
    this.temp_durarion = 1000
  }

  advanceChar = function() {
    try {
      var temp_val = this._data_[this._index+1]
      special_vals = ['_', ',']
      if (temp_val == '-END-') {
        return 'exit'
      }
      if (special_vals.includes(temp_val)) {
        r_I = 0
        while (true) {
          var temp_val = this._data_[this._index+1+r_I]
          if (temp_val != '_' && temp_val.val != ',') {
            break
          }
          r_I ++
          this._char = temp_val
          this._index = this._index+1+r_I
          return temp_val
        }
      } else {
        this._char = this._data_[this._index+1]
        this._index += 1
        return this._char
      }

    } catch {
      console.log("Reached end of notes!")
      return 'exit'
    }
  }
}
