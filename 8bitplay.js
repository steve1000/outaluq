var gameMusic = new EightBit();

        gameMusic.setTimeSignature(4, 4);
        gameMusic.setTempo(200);

        var firstPiano = gameMusic.createInstrument('square');

        /**
         * Intro
         */
        // Bar 1
        firstPiano.addNote('E5, F#4', 'eighth');
        firstPiano.addNote('E5, F#4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('E5, F#4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('C5, F#4', 'eighth');
        firstPiano.addNote('E5, F#4', 'eighth');
        firstPiano.addRest('eighth');

        // Bar 2
        firstPiano.addNote('G5, B4, G4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addRest('quarter');
        firstPiano.addNote('G4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addRest('quarter');

        /**
         * Chorus
         */

        // Bar 1
        firstPiano.repeatStart();
        firstPiano.addNote('C5, E4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('G4, C3', 'eighth');
        firstPiano.addRest('quarter');
        firstPiano.addNote('E4, G3', 'eighth');
        firstPiano.addRest('eighth');

        // Bar 2
        firstPiano.addRest('eighth');
        firstPiano.addNote('A4, C3', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('B4, D4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('Bb4, Db4', 'eighth');
        firstPiano.addNote('A4, C3', 'eighth');
        firstPiano.addRest('eighth');

        // Bar 3
        firstPiano.addNote('G4, C4', 'tripletQuarter');
        firstPiano.addNote('E5, G4', 'tripletQuarter');
        firstPiano.addNote('G5, B4', 'tripletQuarter');
        firstPiano.addNote('A5, C5', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('F5, A4', 'eighth');
        firstPiano.addNote('G5, B4', 'eighth');

        // Bar 4
        firstPiano.addRest('eighth');
        firstPiano.addNote('E5, G4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('C5, E4', 'eighth');
        firstPiano.addNote('D5, F4', 'eighth');
        firstPiano.addNote('B4, D4', 'eighth');
        firstPiano.addRest('quarter');
        firstPiano.repeat();

        /**
         * Bridge
         */
        // Bar 1
        firstPiano.addRest('quarter');
        firstPiano.addNote('G5, E5', 'eighth');
        firstPiano.addNote('Gb5, Eb5', 'eighth');
        firstPiano.addNote('F5, D5', 'eighth');
        firstPiano.addNote('D#5, B4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('E5, C5', 'eighth');

        // Bar 2
        firstPiano.addRest('eighth');
        firstPiano.addNote('G#4, E4', 'eighth');
        firstPiano.addNote('A4, F4', 'eighth');
        firstPiano.addNote('C5, A4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('A4, C3', 'eighth');
        firstPiano.addNote('C5, E4', 'eighth');
        firstPiano.addNote('D5, F4', 'eighth');

        // Bar 3
        firstPiano.addRest('quarter');
        firstPiano.addNote('G5, E5', 'eighth');
        firstPiano.addNote('Gb5, Eb5', 'eighth');
        firstPiano.addNote('F5, D5', 'eighth');
        firstPiano.addNote('D#5, B4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('E5, C5', 'eighth');

        // Bar 4
        firstPiano.addRest('eighth');
        firstPiano.addNote('C6, G6, F6', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('C6, G6, F6', 'eighth');
        firstPiano.addNote('C6, G6, F6', 'eighth');

        // Bar 5
        firstPiano.addRest('quarter');
        firstPiano.addNote('G5, E5', 'eighth');
        firstPiano.addNote('Gb5, Eb5', 'eighth');
        firstPiano.addNote('F5, D5', 'eighth');
        firstPiano.addNote('D#5, B4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('E5, C5', 'eighth');

        // Bar 6
        firstPiano.addRest('eighth');
        firstPiano.addNote('G#4, E4', 'eighth');
        firstPiano.addNote('A4, F4', 'eighth');
        firstPiano.addNote('C5, A4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('A4, C3', 'eighth');
        firstPiano.addNote('C5, E4', 'eighth');
        firstPiano.addNote('D5, F4', 'eighth');

        // Bar 7
        firstPiano.addRest('quarter');
        firstPiano.addNote('Eb5, Ab4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addRest('eighth');
        firstPiano.addNote('D5, F4', 'eighth');
        firstPiano.addRest('quarter');

        // Bar 8
        firstPiano.addNote('C5, E4', 'eighth');
        firstPiano.addRest('eighth');
        firstPiano.addRest('quarter');
        firstPiano.addRest('half');

        firstPiano.finish();

        gameMusic.end();