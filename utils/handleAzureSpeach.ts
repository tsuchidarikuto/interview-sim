"use client";
import { useState } from "react";
import * as SpeechSDK from "microsoft-cognitiveservices-speech-sdk";

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
                if (result.reason === SpeechSDK.ResultReason.RecognizedSpeech) {                    
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
    const key = process.env.NEXT_PUBLIC_SPEECH_KEY || "";
    const region = process.env.NEXT_PUBLIC_SPEECH_REGION || "";
  
    // SpeechConfig の作成
    const speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, region);
    speechConfig.speechSynthesisLanguage = "ja-JP";
    speechConfig.speechSynthesisVoiceName = "ja-JP-KeitaNeural";
  
    // 自動再生を防ぐため、ストリーム出力を利用する
    const pullStream = SpeechSDK.AudioOutputStream.createPullStream();
    const audioConfig = SpeechSDK.AudioConfig.fromStreamOutput(pullStream);
    const synthesizer = new SpeechSDK.SpeechSynthesizer(speechConfig, audioConfig);
  
    return new Promise<boolean>((resolve) => {
      synthesizer.speakTextAsync(
        text,
        result => {
          if (result.reason === SpeechSDK.ResultReason.SynthesizingAudioCompleted) {
            // 合成済みの音声データを取得
            const audioData = result.audioData;
            // Blob を作成し、URL を生成する
            const blob = new Blob([audioData], { type: "audio/wav" });
            const url = URL.createObjectURL(blob);
            
            // HTMLAudioElement で再生（自前再生）
            const audio = new Audio(url);
            audio.onended = () => {
              resolve(true);
              URL.revokeObjectURL(url);
            };
            audio.onerror = () => {
              resolve(false);
              URL.revokeObjectURL(url);
            };
            
            // 再生開始
            audio.play().catch(err => {
              console.error("Audio再生エラー:", err);
              resolve(false);
              URL.revokeObjectURL(url);
            });
          } else {
            resolve(false);
          }
          synthesizer.close();
        },
        error => {
          console.error("合成エラー:", error);
          resolve(false);
          synthesizer.close();
        }
      );
    });
  }
  