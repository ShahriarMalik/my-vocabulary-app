import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.css',
})
export class AudioPlayerComponent implements AfterViewInit {
  @ViewChild('audioPlayer') audioPlayer!: ElementRef;
  @Input() audioSrc!: string;
  isPlaying = false;
  currentTime = 0;
  duration = 0;

  ngAfterViewInit() {
    const audio = this.audioPlayer.nativeElement;

    // Listen for metadata loaded event to get duration
    audio.addEventListener('loadedmetadata', () => {
      this.duration = audio.duration;
    });
  }

  togglePlayPause() {
    const audio = this.audioPlayer.nativeElement;

    if (audio.paused) {
      audio
        .play()
        .then(() => {
          this.isPlaying = true;
        })
        .catch((error: Error) => {
          if (error.name !== 'AbortError') {
            console.error('Error playing audio:', error);
          }
        });
    } else {
      audio.pause();
      this.isPlaying = false;
    }
  }

  updateProgress() {
    const audio = this.audioPlayer.nativeElement;
    this.currentTime = audio.currentTime;
    this.duration = audio.duration;
  }

  seekAudio(event: Event) {
    const audio = this.audioPlayer.nativeElement;
    const inputElement = event.target as HTMLInputElement;
    audio.currentTime = +inputElement.value;
  }

  onAudioEnd() {
    this.isPlaying = false;
    this.currentTime = 0;
  }

  formatTime(time: number): string {
    const seconds = Math.floor(time);
    const milliseconds = Math.floor((time - seconds) * 10); // Show only one decimal place
    return `0:${seconds < 10 ? '0' : ''}${seconds}.${milliseconds}`;
  }
}
