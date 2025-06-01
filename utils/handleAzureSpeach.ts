"use client";
import { useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";
let audioPlayer: HTMLAudioElement | null = null;

export async function SpeachToText():Promise<string>{

    // 環境変数からキーとリージョンを取得
    const key = process.env.NEXT_PUBLIC_SPEECH_KEY || "";
    const region = process.env.NEXT_PUBLIC_SPEECH_REGION || "";

    // SpeechConfigの作成
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, region);
    speechConfig.speechRecognitionLanguage = "ja-JP";

    // マイクからの入力設定
    const audioConfig = SpeechSDK.AudioConfig.fromDefaultMicrophoneInput();
    const recognizer = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);

    // 一度だけ認識
    return new Promise<string>((resolve) => {
        recognizer.recognizeOnceAsync(
            (result: SpeechSDK.SpeechRecognitionResult) => {
                if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech&& result.text) {                    
                    resolve(result.text);
                } else {                    
                    resolve("error");
                }                
                recognizer.close();
            },
            (error: any) => {                
                resolve("error");                
                recognizer.close();
            }
        );
    });
}


export async function TextToSpeach(text: string): Promise<boolean> {
  try {
    // Use Gemini TTS API
    const response = await fetch('/api/gemini-tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error('Gemini TTS API error:', response.statusText);
      return false;
    }

    const audioBlob = await response.blob();
    const url = URL.createObjectURL(audioBlob);

    // HTMLAudioElement で再生（自前再生）
    audioPlayer = new Audio(url);
    // 再生速度を早くする（例: 1.1倍速）
    audioPlayer.playbackRate = 1.1;

    return new Promise<boolean>((resolve) => {
      audioPlayer!.onended = () => {
        resolve(true);
        URL.revokeObjectURL(url);
      };
      audioPlayer!.onerror = () => {
        resolve(false);
        URL.revokeObjectURL(url);
      };

      // 再生開始
      audioPlayer!.play().catch(err => {
        console.error("Audio再生エラー:", err);
        resolve(false);
        URL.revokeObjectURL(url);
      });
    });
  } catch (error) {
    console.error("Gemini TTS エラー:", error);
    return false;
  }
}
 

export function stopAudio(): void {
  console.log(audioPlayer)
  if (audioPlayer) {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;    
    URL.revokeObjectURL(audioPlayer.src);
    audioPlayer = null;
  }
}