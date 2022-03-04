//import * as NARAS from 'naras.js';

//The app creates an WebAudioAPI and a sound loader
const app = new NARAS.App();

//register sound resources with ID
app.addResource('sound', './sounds/sound1.wav')

app.loadThen(()=>{
    //this creates a new Sound object from resources you loaded
    const mixer = new NARAS.Mixer();
    const mixer2 = new NARAS.Mixer();
    const sound = new NARAS.Sound(app.loader.get('sound'));

    app.master.addChild(mixer);
    mixer.addChild(mixer2);
    mixer.loop = true;
    mixer2.addChild(sound);
    mixer.scale = 0.5;
    mixer2.scale = 1.8;
    sound.useDelay = true;
    sound.delay.set(100, 0.4);

    document.getElementById('original').addEventListener('click', ()=>{
        mixer.play();
    })

});

//start loading resources you registerd
app.loadAll();