function main(){
    const master = new NARAS.SoundMaster();
    master.addResource('arigato', './sounds/arigato.wav');
    master.loadAll();
    


    const setup = () => {

        const sound = new NARAS.Sound(master.loader.get('arigato'), {volume: 1, loop: false});
        master.addChild(sound);

        const play = () => {
            sound.volume = Math.random()*1;
            if(!sound.playing) sound.reStart();
            else sound.pause();
        }

        const playOnce = () => {
            sound.loop = false;
            sound.start();
            
        }
        const playLoop = () => {
            sound.loop = true;
            if(sound.playing) {
                sound.pause();
                loopButton.value = "play loop";
            } else {
                sound.reStart();
                loopButton.value = "pause";
            }
            
        }
        const changeVolume = (e) => {
            const v = e.target.value;
            sound.volume = v;
        }

        const slider = document.getElementById('volume');
        const onceButton = document.getElementById('once');
        const loopButton = document.getElementById('loop');
        slider.addEventListener('input', changeVolume);
        onceButton.addEventListener('click', playOnce);
        loopButton.addEventListener('click', playLoop);



    }
    master.loader.loadThen(setup);
}

window.onload = main;