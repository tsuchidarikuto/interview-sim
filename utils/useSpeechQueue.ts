"use client"
import { useRef } from "react";
import { TextToSpeach ,stopAudio} from "./handleAzureSpeach";
import { useAtom } from "jotai";
import { isPlayingAudioAtom } from "@/atoms/state";

// useSpeechQueueフックは、テキスト読み上げのタスクをキューに追加し、順次実行します。
export const useSpeechQueue = () => {
    const [,setIsPlayingAudio] = useAtom(isPlayingAudioAtom);
    // タスクのキューを保持するためのref
    const queue = useRef<(() => Promise<void>)[]>([]);
    // 現在処理中かどうかを示すflag用ref
    const isProcessing = useRef(false);

    // キュー内のタスクを順番に処理する関数
    const processQueue = () => {
        // すでに処理中なら中断
        if (isProcessing.current) return;
        // キューが空なら中断
        if (queue.current.length === 0) return;
        // 処理開始
        setIsPlayingAudio(true);
        isProcessing.current = true;
        
        // キューから次のタスクを取得
        const task = queue.current.shift();
        if (task) {
            // タスクを実行し、完了後に次のタスクを処理する
            task().finally(() => {
                // タスク完了後に処理中フラグを解除
                isProcessing.current = false;
                setIsPlayingAudio(false);
                // キューの次のタスクを処理
                processQueue();
            });
        }
    };

    // テキスト読み上げタスクをキューに追加する関数
    const enqueue = (text: string) => {
        return new Promise<void>((resolve) => {
            // テキスト読み上げ関数をキューに追加
            queue.current.push(async () => {
                await TextToSpeach(text);
                // タスク完了時にPromiseを解決
                resolve();
            });
            // キュー処理を開始
            processQueue();
        });
    };

    
    
    
    const clearQueue = () => {
        // キュー内のタスクをすべてクリア
        queue.current = [];
        stopAudio();
                  
        setIsPlayingAudio(false);
        isProcessing.current = false;
        
      };
    
      return { enqueue, clearQueue };
    };