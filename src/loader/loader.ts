import Master from '../app/master';

export default class Loader{
    private static _resources: Map<string, AudioBuffer> = new Map();
    private static _tasks: Array<Promise<ArrayBuffer>> = [];
    private static _loadThen: Function = function(){};
    private static _cxt: AudioContext = Master.cxt;


    static add(id: string, src: string): Loader{
        const promise = this._promiseLoadingSound(id, src);
        this._tasks.push(promise);
        return this;
    }
    static loadAll(): void{
        Promise.all(this._tasks)
            .then(()=>{this._loadThen();});
    }
    static loadThen(func: Function){
        this._loadThen = func;
    }
    private static _promiseLoadingSound(id: string, src: string): Promise<any>{
        const promise = new Promise((resolve)=>{
            fetch(src).then((res)=>{
                return res.arrayBuffer();
            }).then((data)=>{
                return this._cxt.decodeAudioData(data);
            }).then((buf)=>{
                this._resources.set(id, buf);
                resolve(buf);
            })
        });

        return promise;
    }
    static get(id: string): AudioBuffer | undefined{
        return this._resources.get(id);
    }
}