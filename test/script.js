//import * as NARAS from 'naras.js';

//The app creates an WebAudioAPI and a sound loader
const app = new NARAS.App();

//register sound resources with ID
app.addResource('sound', './sounds/sound1.wav')

app.loadThen(()=>{
    //this creates a new Sound object from resources you loaded
    const mixer = new NARAS.Mixer();
    const sound = new NARAS.Sound(app.loader.get('sound'));

    app.baseMixer.addChild(mixer);
    mixer.addChild(sound);
    sound.position = 1000;


    document.getElementById('original').addEventListener('click', ()=>{
        mixer.play();
    })

});

//start loading resources you registerd
app.loadAll();