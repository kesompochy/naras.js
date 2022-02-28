import SoundContext from './master';

export default class Sound {
    _buffer: any;
    _gainNode: GainNode;
    acxt: SoundContext;
    _duration: number = 0;
    playing: boolean = false;
    _volume: number = 1;
    _loop: boolean = false;
    _bufferSource: AudioBufferSourceNode;
    _endTimer: any | undefined;
    _startTime: number = 0;
    playedTime: number = 0;
    constructor(acxt: SoundContext){
        this.acxt = acxt;
        const cxt = acxt.cxt;

        this._bufferSource = cxt.createBufferSource();

        this._gainNode = cxt.createGain();
        this._gainNode.connect(cxt.destination);
    }
    play(){
        const cxt = this.acxt.cxt;
        
        const sourceBuffer = cxt.createBufferSource();
        sourceBuffer.buffer = this._buffer;
        sourceBuffer.loop = this._loop;
        sourceBuffer.connect(this._gainNode);
        sourceBuffer.start(0, this.playedTime);

        this._bufferSource = sourceBuffer;

        this._startTime = cxt.currentTime;

        this.playing = true;
        if(!this._loop) this._endTimer = setTimeout(this.endThen.bind(this), this._duration*1000);
    }
    pause(){
        if(this.playing) {
            this.playedTime = (this.playedTime + this.acxt.cxt.currentTime - this._startTime) % this._duration;
            this.playing = false;
            this._bufferSource.stop(0);
            this._clearTimer();
        }
    }
    _clearTimer(){
        clearTimeout(this._endTimer);
    }
    stop(){
        if(this.playing) this._bufferSource.stop(0);
        this.endThen();
    }
    endThen(){
        this.playing = false;
        this._bufferSource.disconnect(0);
    }
    set buffer(buf){
        this._buffer = buf;
        this._duration = buf.duration;
    }
    set volume(vol: number){
        this._volume = vol;
        this._gainNode.gain.value = vol;
    }

    set loop(bool: boolean){
        this._loop = bool;
    }
    get loop(){
        return this._loop;
    }
}