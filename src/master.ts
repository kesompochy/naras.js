import Loader from './loader';
import Sound from './sound';

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

    children: Sound[] = [];

    loader: Loader = new Loader(this.cxt);
    constructor(){
        this._masterGain.connect(this.cxt.destination);

        for(let i=0, len=this._unlockEvents.length;i<len;i++){
            document.addEventListener(this._unlockEvents[i], this._initContext.bind(this), {once: true});
        }
        this._initContext();
    }
    private _initContext(): void{
        if(this.cxt.state === 'suspended'){
            this.cxt.resume();
        }
        for(let i=0, len=this._unlockEvents.length;i<len;i++){
            document.removeEventListener(this._unlockEvents[i], this._initContext.bind(this));
        }
    }
    addResource(id: string, src: string): SoundMaster{
        this.loader.add(id, src);
        return this;
    }
    loadAll(): void{
        this.loader.loadAll();
    }
    addChild(sound: Sound){
        this.children.push(sound);
        sound.acquireContext(this.cxt);
    }
}