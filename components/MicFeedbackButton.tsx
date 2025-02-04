'use client';
import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import MicIcon from '@mui/icons-material/Mic';
import { useAtom } from "jotai";
import { isPlayingAudioAtom ,isRecordingAtom} from "@/atoms/state";

interface MicFeedbackButtonProps {
    handleListenUserSpeach: () => void;
}

export default function MicFeedbackButton({
    handleListenUserSpeach,
}: MicFeedbackButtonProps) {
    // マイク入力の音量を保持する state
    const [micVolume, setMicVolume] = useState<number>(0);
    // 録音状態（ボタンの disable 状態などと連動させる場合に利用）
    const [isRecording, setIsRecording] = useAtom(isRecordingAtom);
    const [isPlayingAudio,] = useAtom(isPlayingAudioAtom);

    useEffect(() => {
        // マイク入力を取得して音量に合わせたアニメーションを行う
        async function initAudio() {
            try {
                // ユーザーのマイクにアクセス
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                const audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                const microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256; // FFT サイズ（解析精度の調整可能）
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                // 定期的に音量（RMS: Root Mean Square）を計算
                const updateVolume = () => {
                    analyser.getByteTimeDomainData(dataArray);
                    let sum = 0;
                    for (let i = 0; i < bufferLength; i++) {
                        const value = dataArray[i] - 128;
                        sum += value * value;
                    }
                    const rms = Math.sqrt(sum / bufferLength);
                    setMicVolume(rms);
                    requestAnimationFrame(updateVolume);
                };
                updateVolume();
            } catch (error) {
                console.error("マイクへのアクセスに失敗しました:", error);
            }
        }
        initAudio();
    }, []);

    // micVolume の値に応じたスケール値（例：音量が大きいとアイコンが大きくなる）
    const scale = 1 + micVolume / 50; // 調整値はお好みで変更してください

    return (
        <Button
            variant="contained"
            size="large"            
            disabled={isPlayingAudio}
            // ボタン内のアイコンに対して scale を適用（transition でなめらかに）
            sx={{
                transform: (isPlayingAudio||!isRecording) ? "none" : `scale(${scale})`,
                transition: "transform 0.1s ease-out",
                                backgroundColor: isRecording ? "red" : undefined,
            }}
            onClick={() => {              
                
                handleListenUserSpeach();
                // 録音処理後に setIsRecording(false) を呼び出す処理を追加可能
            }}
        >
            <MicIcon fontSize="large" />
        </Button>
    );
}
