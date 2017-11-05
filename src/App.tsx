import * as React from 'react';
import { Dim } from './types';
import { drawFrame } from './circleVisualisation';

const dim: Dim = {
  width: 1280,
  height: 920
};

class App extends React.Component {
  gradientStyle: CanvasGradient;
  canvasContext: CanvasRenderingContext2D | null;
  canvasElement: HTMLCanvasElement;
  readonly frequencyData: Uint8Array;
  request: number;
  audioSrc?: MediaElementAudioSourceNode;
  readonly analyser: AnalyserNode;
  readonly audioContext: AudioContext;
  audioElement?: HTMLAudioElement;

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
    this.canvasContext = this.canvasElement.getContext('2d');
    this.forceUpdate();
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
    const context = this.canvasContext;

    const {width, height} = dim;

    if (context) {
      drawFrame(dim, this.frequencyData, context);
    }

    return (
      <div>
        <canvas width={width} height={height} ref={el => this.onCanvasRef(el)} />
        <audio
          onPlaying={() => this.animate()}
          onPause={() => this.stop()}
          ref={a => this.onRef(a)}
          src="/shakuhachi.mp3"
          controls={true}
        />
      </div>
    );
  }
}

export default App;
