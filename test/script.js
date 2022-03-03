//import * as NARAS from 'naras.js';

//The app creates an WebAudioAPI and a sound loader
const app = new NARAS.App();

//register sound resources with ID
app.addResource('sound1', './sounds/sound1.wav')

app.loadThen(()=>{
    //this creates a new Sound object from resources you loaded
    const mixer = new NARAS.Mixer();
    const sound2 = new NARAS.Sound(app.loader.get('sound1'));

    app.master.addChild(mixer);
    mixer.loop = true;
    mixer.loopRange = 2000;

    const mixer2 = new NARAS.Mixer();
    mixer2.loop = true;
    mixer2.loopRange = 300;
    mixer.addChild(mixer2);
    mixer2.addChild(sound2);


    document.getElementById('original').addEventListener('click', ()=>{
        mixer2.play();
    })

});

//start loading resources you registerd
app.loadAll();