function main(){
    const master = new NARAS.SoundMaster();
    master.addSound('arigato', './sounds/arigato.wav');
    master.loadAll();
    
    

    const setup = () => {

        const sound = new NARAS.Sound(master.loader.get('arigato'));
        master.addChild(sound);

        const play = () => {
            if(!sound.playing) sound.reStart();
            else sound.pause();
        }

        document.addEventListener('click', play);


    }
    master.loader.loadThen(setup);
}

window.onload = main;