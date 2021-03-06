# naras.js
The simple audio library with WebAudioAPI.

## Basic Usage

    import * as NARAS from 'naras.js';

    //The app creates an WebAudioAPI Context and a sound loader
    const app = new NARAS.App();

    //register sound resources with ID
    app.loader.add('sound1', './sounds/sound1.wav')
        .add('sound2', './sounds/sound2.wav')
        .add('sound3', './sounds/sound3.wav');

    app.loadThen(()=>{
        //this creates a new Sound object from resources you loaded
        const sound1 = new NARAS.Sound(app.loader.get('sound1'));
        const sound2 = new NARAS.Sound(app.loader.get('sound2'));
        const sound3 = new NARAS.Sound(app.loader.get('sound3'));

        //this creates a new Mixer object
        const mixer = new NARAS.Mixer();

        //every Sound or Mixer needs to connect to App.master to play sound
        app.baseMixer.addChild(sound1);
        app.baseMixer.addChild(mixer);
        
        //A Mixer can bundle Sounds or other Mixers
        mixer.addChild(sound2);
        mixer.addChild(sound3);

        //Sound has properties of volume, loop, pitch
        sound1.volume = 2;
        sound1.loop = true;
        sound2.scale = 0.75;
        //Mixer does so('loop' property excluded)
        mixer.volume = 0.6;
        mixer.scale = 2;

        //Sound and Mixer can add effect of delay
        sound1.useDelay = true;
        mixer.useDelay = true;
        //delay filter has property of interval, attenuation
        sound1.delay.set(500, 0.2);
        mixer.delay.interval = 800;
        mixer.delay.attenuation = 0.9;

        //panner (X, Y, Z)
        sound1.panner.set(2, -1, 1);
        mixer.panner.z = -1;

        const play = () => {
            //Sound's actions are 'play', 'stop', 'restart', 'pause'
            if(!sound1.playing){
                sound1.play();
            } else {
                sound1.stop();
            }
            
            //mixer can play all children sounds with its effect
            mixer.play();
        };
        document.addEventListener('click', play);
    });

    //start loading resources you registerd
    app.loadAll();
