import Master from '../app/narasmaster';

export default class Loader{
    private _resources: Map<string, AudioBuffer> = new Map();
    private _tasks: Array<Promise<ArrayBuffer>> = [];
    private _loadThen: Function = function(){};
    private _cxt: AudioContext = Master.cxt;


    add(id: string, src: string): Loader{
        const promise = this._promiseLoadingSound(id, src);
        this._tasks.push(promise);
        return this;
    }
    loadAll(): void{
        Promise.all(this._tasks)
            .then(()=>{this._loadThen();});
    }
    loadThen(func: Function){
        this._loadThen = func;
    }
    private _promiseLoadingSound(id: string, src: string): Promise<any>{
        const promise = new Promise((resolve)=>{
            fetch(src).then((res)=>{
                return res.arrayBuffer();
            }).then((data)=>{
                return this._cxt.decodeAudioData(data);
            }).then((buf)=>{

                const audio = Master.cxt.createBuffer(buf.numberOfChannels, buf.length, buf.sampleRate);

                for(let i=0;i<audio.numberOfChannels;i++){
                    const data = audio.getChannelData(i);
                    const bufData = buf.getChannelData(i);
                    const freq = 100;
                    const pitch = 2;
                    for(let j=0;j<data.length/freq;j++){
                        for(let k=0;k<freq;k++){
                            data[j*freq + k] = bufData[j*freq + pitch*(k%(freq/pitch))];
                        }
                    }
                }


                this._resources.set('processed', audio);
                this._resources.set(id, buf);
                resolve(buf);
            })
        });

        return promise;
    }
    getResource(id: string): AudioBuffer | undefined{
        return this._resources.get(id);
    }
}