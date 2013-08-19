/**
 * 8Bit.js Audio Library - Write music using 8bit oscillation sounds.
 * Supports rhythms and multiple instruments.
 *
 * @author Cody Lundquist - 2013
 */
var EightBit = (function() {
    var
        // Notes and their BPM numerator
        notes = {
            whole: 240,
            dottedHalf: 180,
            half: 120,
            dottedQuarter: 90,
            quarter: 60,
            dottedEighth: 45,
            tripletQuarter: 40,
            eighth: 30,
            dottedSixteenth: 22.5,
            tripletEighth: 20,
            sixteenth: 15,
            tripletSixteenth: 10,
            thirtySecond: 7.5
        },
        // Pitch frequencies with corresponding names
        pitches = {'C3': 130.81,'C#3': 138.59,'Db3': 138.59,'D3': 146.83,'D#3': 155.56,'Eb3': 155.56,'E3': 164.81,'F3': 174.61,'F#3': 185.00,'Gb3': 185.00,'G3': 196.00,'G#3': 207.65,'Ab3': 207.65,'A3': 220.00,'A#3': 233.08,'Bb3': 233.08,'B3': 246.94,'C4': 261.63,'C#4': 277.18,'Db4': 277.18,'D4': 293.66,'D#4': 311.13,'Eb4': 311.13,'E4': 329.63,'F4': 349.23,'F#4': 369.99,'Gb4': 369.99,'G4': 392.00,'G#4': 415.30,'Ab4': 415.30,'A4': 440.00,'A#4': 466.16,'Bb4': 466.16,'B4': 493.88,'C5': 523.25,'C#5': 554.37,'Db5': 554.37,'D5': 587.33,'D#5': 622.25,'Eb5': 622.25,'E5': 659.26,'F5': 698.46,'F#5': 739.99,'Gb5': 739.99,'G5': 783.99,'G#5': 830.61,'Ab5': 830.61,'A5': 880.00,'A#5': 932.33,'Bb5': 932.33,'B5': 987.77,'C6': 1046.50,'C#6': 1108.73,'Db6': 1108.73,'D6': 1174.66,'D#6': 1244.51,'Eb6': 1244.51,'E6': 1318.51,'F6': 1396.91,'F#6': 1479.98,'Gb6': 1479.98,'G6': 1567.98,'G#6': 1661.22,'Ab6': 1661.22,'A6': 1760.00,'A#6': 1864.66,'Bb6': 1864.66,'B6': 1975.53,'C7': 2093.00,'C#7': 2217.46,'Db7': 2217.46,'D7': 2349.32,'D#7': 2489.02,'Eb7': 2489.02,'E7': 2637.02,'F7': 2793.83,'F#7': 2959.96,'Gb7': 2959.96,'G7': 3135.96,'G#7': 3322.44,'Ab7': 3322.44,'A7': 3520.00,'A#7': 3729.31,'Bb7': 3729.31,'B7': 3951.07,'C8': 4186.01},
        // Used when parsing the time signature
        signatureToNote = {
            2: 'half',
            4: 'quarter',
            8: 'eighth',
            16: 'sixteenth'
        },
        // Different waveforms that are supported
        waveforms = {
            'sine': 0,
            'square': 1,
            'sawtooth': 2,
            'triangle': 3
        }
    ;

    /**
     * Constructor
     */
    function cls() {
        var ac = new (window.AudioContext || window.webkitAudioContext),
            muteGain = ac.createGainNode(),
            beatLength,
            tempo,
            allNotesBuffer = [],
            oscillators = [],
            articulationGap = .065,
            /**
             * Instrument Class
             */
            Instrument = (function() {
                /**
                 * Constructor
                 * @param [waveform]
                 */
                function cls(waveform) {
                    if (waveform) {
                        if (typeof waveforms[waveform] === 'undefined') {
                            throw new Error(waveform + ' is not a valid Waveform.');
                        }
                    } else {
                        waveform = 'sine';
                    }

                    var currentTime = 0,
                        lastRepeatCount = 0,
                        volumeLevel = .25,
                        pitchType = waveforms[waveform],
                        notesBuffer = []
                    ;

                    this.setVolume = function(newVolumeLevel) {
                        volumeLevel = newVolumeLevel;
                    };

                    /**
                     * Add a note to an instrument
                     * @param pitch - Comma separated string if more than one note
                     * @param note
                     * @param [tie]
                     */
                    this.addNote = function(pitch, note, tie) {
                        if (typeof notes[note] === 'undefined') {
                            throw new Error(note + ' is not a correct note.');
                        }

                        var duration = getDuration(note);

                        var checkPitches = pitch.split(',');

                        checkPitches.forEach(function(p) {
                            p = p.trim();
                            if (typeof pitches[p] === 'undefined') {
                                throw new Error(p + ' is not a valid pitch.');
                            }
                        });

                        notesBuffer.push({
                            volume: volumeLevel,
                            pitch: pitch,
                            pitchType: pitchType,
                            startTime: currentTime,
                            tie: tie,
                            stopTime: currentTime + duration - (tie ? 0 : articulationGap)
                        });

                        currentTime += duration;
                    };

                    /**
                     * Add a rest to an instrument
                     *
                     * @param note
                     */
                    this.addRest = function(note) {
                        if (typeof notes[note] === 'undefined') {
                            throw new Error('Need to use correct note.');
                        }

                        var duration = getDuration(note);

                        notesBuffer.push({
                            pitch: false,
                            pitchType: 0,
                            startTime: currentTime,
                            tie: true,
                            stopTime: currentTime + duration
                        });

                        currentTime += duration;
                    };


                    /**
                     * Place where a repeat section should start
                     */
                    this.repeatStart = function() {
                        lastRepeatCount = notesBuffer.length;
                    };

                    /**
                     * Number of times the section should repeat
                     * @param [numOfRepeats] - defaults to 1
                     */
                    this.repeat = function(numOfRepeats) {
                        numOfRepeats = typeof numOfRepeats === 'undefined' ? 1 : numOfRepeats;
                        for (var r = 0; r < numOfRepeats; r++) {
                            var copyNotesBuffer = notesBuffer.slice(lastRepeatCount);
                            lastRepeatCount = copyNotesBuffer.length;
                            for (var i = 0; i < copyNotesBuffer.length; i++) {
                                var noteCopy = clone(copyNotesBuffer[i]),
                                    duration = noteCopy.stopTime - noteCopy.startTime + (noteCopy.tie ? 0 : articulationGap);
                                noteCopy.startTime = currentTime;
                                noteCopy.stopTime = currentTime + duration - (noteCopy.tie ? 0 : articulationGap);

                                copyNotesBuffer[i] = noteCopy;
                                currentTime += duration;
                            }

                            notesBuffer = notesBuffer.concat(copyNotesBuffer);
                        }
                    };

                    /**
                     * Copies all notes to the master list of notes.
                     */
                    this.finish = function() {
                        allNotesBuffer = allNotesBuffer.concat(notesBuffer);
                    };
                }

                return cls;
            })()
        ;


        // Setup mute gain and connect to the context;
        muteGain.gain.value = 0;
        muteGain.connect(ac.destination);

        /**
         * Create a new instrument
         *
         * @param [waveform] - defaults to sine
         * @returns {Instrument}
         */
        this.createInstrument = function(waveform) {
            return new Instrument(waveform);
        };

        /**
         * Create all the oscillators;
         */
        this.end = function() {
            oscillators = [];
            for (var i = 0; i < allNotesBuffer.length; i++) {
                var pitch = allNotesBuffer[i].pitch;

                if (! pitch) {
                    pitch = '0';
                }

                pitch.split(',').forEach(function(p) {
                    p = p.trim();
                    var o = ac.createOscillator(),
                        volume = ac.createGainNode();

                    // Connect volume gain to the context;
                    volume.connect(ac.destination);

                    if (p === false) {
                        o.connect(muteGain);
                    } else {
                        // Set the volume for this note
                        volume.gain.value = allNotesBuffer[i].volume;
                        o.connect(volume);
                    }

                    o.type = allNotesBuffer[i].pitchType;
                    o.frequency.value = p !== '0' ? pitches[p] : 0;

                    oscillators.push({
                        startTime: allNotesBuffer[i].startTime,
                        stopTime: allNotesBuffer[i].stopTime,
                        o: o
                    });
                });
            }
        };


        /**
         * Sets the time signature for the music. Just like in notation 4/4 time would be setTimeSignature(4, 4);
         * @param top - Number of beats per bar
         * @param bottom - What note type has the beat
         */
        this.setTimeSignature = function(top, bottom) {
            if (typeof signatureToNote[bottom] === 'undefined') {
                throw new Error('The bottom time signature is not supported.');
            }

            var note = signatureToNote[bottom];

            beatLength = (60 / notes[note]) * (top / bottom);
        };

        /**
         * Sets the tempo
         *
         * @param t
         */
        this.setTempo = function(t) {
            tempo = t;
        };

        /**
         * Grabs all the oscillator notes and plays them
         */
        this.play = function() {
            for (var i = 0; oscillators.length > i; i++) {
                var o = oscillators[i].o,
                    startTime = oscillators[i].startTime,
                    stopTime = oscillators[i].stopTime
                ;

                o.noteOn(startTime + ac.currentTime);
                o.noteOff(stopTime + ac.currentTime);
            }

            this.end();
        };

        // Default to 120 tempo
        this.setTempo(120);

        // Default to 4/4 time signature
        this.setTimeSignature(4, 4);

        /**
         * Helper function to figure out how long a note is
         *
         * @param note
         * @returns {number}
         */
        function getDuration(note) {
            return (notes[note] / tempo) * beatLength;
        }
    }

    /**
     * Helper function to clone an object
     *
     * @param obj
     * @returns {obj}
     */
    function clone(obj) {
        if (null == obj || "object" != typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }

        return copy;
    }

    return cls;
})();