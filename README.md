# naras.js
The simple audio library with WebAudioAPI.

## Install
    npm install naras.js

There is no default export. The correct way to import NarasJS is:

    import * as NARAS from 'naras.js';

The main file is `naras.min.js` in `./dist/`.

## Usage

    import * as NARAS from 'naras.js';

    const app = new NARAS.App();

    const setup = () => {
        const sound = new NARAS.Sound(app.loader.getResource(id));
        app.master.addChild(sound);

        const play = () => {
            sound.play();
        };
        document.addEventListener('click', play);
    };

    const id = 'soundID';
    const src = './sounds/sound.wav';
    app.addResource(id, src);
    app.loadThen(setup);
    app.loadAll();
