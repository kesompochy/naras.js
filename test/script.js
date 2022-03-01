function main(){

    const app = new NARAS.App();
    app.addResource('arigato', './sounds/arigato.wav');
    app.loadAll();
    


    const setup = () => {
        const sound = new NARAS.Sound(app.loader.getResource('arigato'), );
        //app.masterContainer.addChild(sound);
        
        const container = new NARAS.Container();
        app.masterContainer.addChild(container);
        container.addChild(sound);

        const play = () => {
            container.start();
        }

        document.addEventListener('click', play);
/*
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
*/


    }
    app.loadThen(setup);
}

window.onload = main;