import Audio from '../audio/audio';
export default class Processer {
    private static _forAllChannels;
    private static _createSameSizedBuffer;
    static reverse(orig: Audio): Audio;
    static trim(orig: Audio, start: number, end: number): Audio;
    static raisePitch(orig: Audio, range: number, interval: number): Audio;
    static lowerPitch(orig: Audio, range: number, interval: number): Audio;
    static noise(orig: Audio, rate: number, volume: number, strength: number): Audio;
    static blur(orig: Audio, strength: number): Audio;
}
//# sourceMappingURL=processer.d.ts.map