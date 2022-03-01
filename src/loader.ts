export default class Loader{
    resources: Map<string, any> = new Map();
    tasks: Array<Promise<unknown>> = [];
    private _loadThen: Function = function(){}
    _cxt: AudioContext;
    constructor(cxt: AudioContext){
        this._cxt = cxt;
    }

    add(id: string, src: string): Loader{
        const promise = this._promiseLoadingSound(id, src);
        this.tasks.push(promise);
        return this;
    }
    loadAll(): void{
        Promise.all(this.tasks)
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
                this.resources.set(id, buf);
                resolve(buf);
            })
        });

        return promise;
    }
    get(id: string){
        return this.resources.get(id);
    }
}