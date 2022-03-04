export default class Audio {
    readonly buffer: AudioBuffer;
    readonly duration: number;
    constructor(buf: AudioBuffer){
        this.buffer = buf;
        this.duration = buf.duration;
    }
}