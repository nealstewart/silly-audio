import * as React from 'react';
import { Dim } from './types';
import { drawFrame } from './circleVisualisation';
const AUDIO = require('./static/shakuhachi.mp3');

const DEFAULT_DIMENSIONS: Dim = {
  width: 1280,
  height: 920
};

class App extends React.Component {
  readonly frequencyData: Uint8Array;
  readonly analyser: AnalyserNode;
  readonly audioContext: AudioContext;
  gradientStyle: CanvasGradient;
  canvasElement: HTMLCanvasElement;
  request: number;
  audioSrc?: MediaElementAudioSourceNode;
  audioElement?: HTMLAudioElement;
  dim?: Dim;

  constructor() {
    super();
    this.audioContext = new AudioContext();
    this.analyser = this.audioContext.createAnalyser();
    this.request = 0;
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
  }

  componentWillUnmount() {
    if (!this.audioSrc) {
      return;
    }
    this.audioSrc.disconnect(this.analyser);
    this.audioSrc.disconnect(this.audioContext.destination);
    this.stop();
  }

  onRef(el: HTMLAudioElement | null) {
    if (this.audioElement) {
      return;
    }

    this.audioElement = el!;
    this.audioSrc = this.audioContext.createMediaElementSource(this.audioElement);
    this.audioSrc.connect(this.analyser);
    this.audioSrc.connect(this.audioContext.destination);
  }

  onCanvasRef(el: HTMLCanvasElement | null) {
    if (this.canvasElement) {
      return;
    }

    this.canvasElement = el!;
    this.forceUpdate();
  }

  onDivRef(div: HTMLDivElement | null) {
    if (!div) {
      return;
    }
    this.dim = div.getBoundingClientRect();
  }

  animate() {
    this.forceUpdate();
    this.request = requestAnimationFrame(
      () => this.animate());
  }

  stop() {
    cancelAnimationFrame(this.request);
  }

  render() {
    this.analyser.getByteFrequencyData(this.frequencyData);

    const dim = this.dim || DEFAULT_DIMENSIONS;

    const {width, height} = dim;
    if (this.canvasElement) {
      drawFrame(dim, this.frequencyData, this.canvasElement.getContext('2d')!);
    }

    return (
      <div className="App" ref={el => this.onDivRef(el)}>
        <canvas width={width} height={height} ref={el => this.onCanvasRef(el)} />
        <audio
          onPlaying={() => this.animate()}
          onPause={() => this.stop()}
          ref={a => this.onRef(a)}
          src={AUDIO}
          controls={true}
        />
      </div>
    );
  }
}

export default App;
