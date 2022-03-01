interface IOptions {
    volume: number;
    loop: boolean;
}

import Container from './container';

//メモ　detune.value は +100で1/12オクターブ上　+1200で1オクターブ上 -1200で1オクターブ下

export default class Sound extends Container{
    private _buffer: AudioBuffer;
    private _sourceNode: AudioBufferSourceNode | undefined;
    private _duration: number = 0;
    private _playedTime: number = 0;
    private _startedTime: number = 0;
    private _loop: boolean = false;
    private _playing: boolean = false;

    constructor(buf: AudioBuffer, options?: IOptions){
        super();
        this._buffer = buf;
        
        this._duration = buf.duration;

        /*
        this.loop = options?.loop || false;
        this.volume = options?.volume || 1;*/
    }

    set buffer(buffer: AudioBuffer){
        this._buffer = buffer;
        this._duration = buffer.duration;
    }
    reStartFunc: Function = () => {
        this._play(this._playedTime);
    }
    startFunc: Function = () => {
        this._playedTime = 0;
        this._play(0);
    }
    private _play(offset: number = 0){
        if(!this._buffer){
            return;
        }

        const cxt = this._cxt;

        this._sourceNode = cxt.createBufferSource()!;
        this._sourceNode.buffer = this._buffer;

        this._sourceNode.loop = this._loop;
        this._sourceNode.playbackRate.value = this._pitch;
        this._gainNode.gain.value = this._volume;

        const sourceNode = this._sourceNode;

        sourceNode.connect(this._gainNode);


        sourceNode.start(0, offset);

        

        this._sourceNode = sourceNode;

        this._startedTime = cxt.currentTime;

        this._playing = true;
        
        if(!this.loop) {
           this._sourceNode.onended = ()=>{this._endThen()};
        }
    }


    stopFunc: Function = () =>{
        if(this._playing && this._sourceNode){
            this._sourceNode.stop(0);
            this._sourceNode.disconnect(0);
            this._endThen();
        }
    }
    pauseFunc: Function = () =>{
        if(this._playing) {
            this._playedTime = (this._playedTime + this._cxt!.currentTime - this._startedTime) % this._duration;
            this._playing = false;
            this._sourceNode!.stop(0);
        }
    }
    private _endThen(): void{
        this._playing = false;
        this._playedTime = 0;
        this._sourceNode!.disconnect(0);
    }
    get playing(): boolean{
        return this._playing;
    }
    set loop(flag: boolean){
        this._loop = flag;
        if(this._sourceNode){
            this._sourceNode.loop = flag;
        }
    }
    get loop(): boolean{
        return this._loop;
    }
}


