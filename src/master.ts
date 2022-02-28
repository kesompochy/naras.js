import Loader from './loader';

declare global {
    interface Window {
        webkitAudioContext: any
    }
}

const AudioContext = window.AudioContext || window.webkitAudioContext;

export default class SoundMaster{
    cxt: AudioContext = new AudioContext();
    private _masterGain: GainNode = this.cxt.createGain();
    private _unlockEvents: string[] = ['click', 'scroll', 'touchstart'];

    loader: Loader = new Loader();
    constructor(){
        this._masterGain.connect(this.cxt.destination);

        //for(let i=0, len=this._unlockEvents.length;i<len;i++){
        //    document.addEventListener(this._unlockEvents[i], this._initContext.bind(this), {once: true});
        //}
        this.initContext();
    }
    initContext(): void{
        if(this.cxt.state === 'suspended'){
            this.cxt.resume();
        }
        for(let i=0, len=this._unlockEvents.length;i<len;i++){
            document.removeEventListener(this._unlockEvents[i], this.initContext.bind(this));
        }
    }
}