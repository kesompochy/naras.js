import Master from '../app/master';

export default class Processer{
    private static _forAllChannels(buf: AudioBuffer, audio: AudioBuffer, 
                                    callback: (channel: Float32Array, data: Float32Array)=>void): AudioBuffer{
        for(let i=0, len=buf.numberOfChannels;i<len;i++){
            const channel = audio.getChannelData(i);
            const data = buf.getChannelData(i);
            callback(channel, data);
        }
        return audio;
    }
    private static _createSameSizedBuffer(buf: AudioBuffer): AudioBuffer{
        return Master.cxt.createBuffer(buf.numberOfChannels, buf.length, buf.sampleRate);
    }
    static reverse(buf: AudioBuffer): AudioBuffer{
        const audio = Processer._createSameSizedBuffer(buf);
        return Processer._forAllChannels(buf, audio, (channel, data)=>{
            for(let j=0, len=buf.length;j<len;j++){
                channel[j] = data[len-j];
            }
        });
    }
    static trim(buf: AudioBuffer, start: number, end: number): AudioBuffer{//startとendの単位は秒
        const sampleRate = buf.sampleRate;
        const trimmedLength = (end-start)*buf.sampleRate;

        const audio = Master.cxt.createBuffer(buf.numberOfChannels, trimmedLength, sampleRate);

        return Processer._forAllChannels(buf, audio, (channel, data)=>{
            for(let j=0, len=trimmedLength;j<len;j++){
                channel[j] = data[start*sampleRate + j];
            }
        });
    }
    static raisePitch(buf: AudioBuffer, range: number, interval: number): AudioBuffer{
        const audio = Master.cxt.createBuffer(buf.numberOfChannels,buf.length, buf.sampleRate);

        return Processer._forAllChannels(buf, audio, (channel, data)=>{
            for(let i=0, len1=buf.length/range;i<len1;i++){
                for(let j=0, len2=range;j<len2;j++){
                    //元データarrayをrange個ごとに区切って、その中でinterval飛ばしでループさせる。
                    channel[i*range + j] = data[Math.min(i*range + ((j*interval)|0)%range, buf.length-1)];
                }
            }
        });
    }
    static lowerPitch(buf: AudioBuffer, range: number, interval: number): AudioBuffer{
        const audio = Processer._createSameSizedBuffer(buf);

        return Processer._forAllChannels(buf, audio, (channel, data)=>{
            for(let i=0, len1=buf.length/range;i<len1;i++){
                for(let j=0, len2=range*interval;j<len2;j++){
                    channel[i*range + j] = data[Math.min(i*range + ((j/interval)|0), buf.length-1)];
                }
            }

        })
    }
    static noise(buf: AudioBuffer, rate: number, volume: number, strength: number): AudioBuffer{
        const audio = Processer._createSameSizedBuffer(buf);

        return Processer._forAllChannels(buf, audio, (channel, data)=>{
            for(let j=0, len=buf.length;j<len;j++){
                if(Math.random() > rate){
                    channel[j] = data[j] + (Math.random()-0.5)*2*strength;
                } else {
                    channel[j] = volume * 2*(Math.random()-0.5);
                }
            }
        })
    }
    static blur(buf: AudioBuffer, strength: number): AudioBuffer{
        const audio = Processer._createSameSizedBuffer(buf);
        return Processer._forAllChannels(buf, audio, (channel, data)=>{
            for(let j=0, len=buf.length;j<len;j++){
                let sum = 0;
                const num = strength*2+1;
                for(let k=0, len2=num;k<len2;k++){
                    sum += data[Math.max(Math.min(j-strength + k, buf.length-1), 0)];
                }
                channel[j] = sum/(num);
            }
        })
    }
}