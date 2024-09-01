import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AudioPlayerComponent } from './audio-player.component';
import { ElementRef } from '@angular/core';

/*
    Note: These tests may log a console error due to `jsdom` not implementing `HTMLMediaElement.prototype.pause`.
    This does not affect the test outcomes but can be misleading.
  */

describe('AudioPlayerComponent', () => {
  let component: AudioPlayerComponent;
  let fixture: ComponentFixture<AudioPlayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioPlayerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AudioPlayerComponent);
    component = fixture.componentInstance;

    // Mock the audioPlayer ElementRef
    component.audioPlayer = new ElementRef({
      play: jest.fn().mockResolvedValue(() => {}),
      pause: jest.fn().mockImplementation(() => {}),
      currentTime: 0,
      duration: 100,
      paused: true,
    } as Partial<HTMLAudioElement>);

    fixture.detectChanges();
  });

  it('should create the AudioPlayerComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should call play when togglePlayPause is invoked', async () => {
    const mockPlay = jest
      .spyOn(component.audioPlayer.nativeElement, 'play')
      .mockImplementation(() => Promise.resolve());

    component.togglePlayPause();

    expect(mockPlay).toHaveBeenCalled();
  });

  it('should call pause when togglePlayPause is invoked while playing', async () => {
    const mockPause = jest.spyOn(component.audioPlayer.nativeElement, 'pause');
    component.isPlaying = true;
    jest
      .spyOn(component.audioPlayer.nativeElement, 'paused', 'get')
      .mockReturnValue(false);

    component.togglePlayPause();

    expect(mockPause).toHaveBeenCalled();
    expect(component.isPlaying).toBe(false);
  });

  it('should update currentTime and duration when updateProgress is called', () => {
    const mockCurrentTime = 30;
    const mockDuration = 100;
    jest
      .spyOn(component.audioPlayer.nativeElement, 'currentTime', 'get')
      .mockReturnValue(mockCurrentTime);
    jest
      .spyOn(component.audioPlayer.nativeElement, 'duration', 'get')
      .mockReturnValue(mockDuration);

    component.updateProgress();

    expect(component.currentTime).toBe(mockCurrentTime);
    expect(component.duration).toBe(mockDuration);
  });

  it('should set currentTime correctly when seekAudio is called', () => {
    const mockEvent = {
      target: {
        value: '50',
      },
    } as unknown as Event;
    const mockCurrentTime = 50;
    const mockSetCurrentTime = jest.spyOn(
      component.audioPlayer.nativeElement,
      'currentTime',
      'set'
    );

    component.seekAudio(mockEvent);

    expect(mockSetCurrentTime).toHaveBeenCalledWith(mockCurrentTime);
  });
});
