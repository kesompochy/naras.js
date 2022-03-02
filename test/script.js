function main(){

    const app = new NARAS.App();
    app.addResource('arigato', './sounds/arigato.wav');
    app.loadAll();
    


    const setup = () => {
        const container = new NARAS.Container();
        app.masterContainer.addChild(container);

        const sound = new NARAS.Sound(app.loader.getResource('arigato'));
        sound.loop = true;
        
        container.addChild(sound);
        container.useDelay();
        container.delay.set(0.1, 0.5);
        

        const play = () => {
            container.play();
            sound.panner.z = -50;
            requestAnimationFrame(ticking);
        }

        let t = 0;
        const ticking = () => {
            t += 1;
            

            requestAnimationFrame(ticking);
        }

        document.addEventListener('click', play);



    }
    app.loadThen(setup);
}

window.onload = main;