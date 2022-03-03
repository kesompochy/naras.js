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
    mixer.addChild(sound2);


    document.getElementById('original').addEventListener('click', ()=>{
        sound2.play();
    })

});

//start loading resources you registerd
app.loadAll();