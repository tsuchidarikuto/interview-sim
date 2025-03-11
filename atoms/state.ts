import {atom} from 'jotai';
import {questionTypes,interviewResultTypes, CompanyTypes,ResumeTypes,SettingTypes,RankingTypes,UserTypes} from '@/types';

/**
 * 面接の質問リストを管理するAtom
 */
export const questionsAtom = atom<questionTypes[]>([]);

/**
 * 面接結果を管理するAtom
 * 初期値として各評価項目を0に設定
 */
export const interviewResultAtom = atom<interviewResultTypes>({
    isPass: false,
    isRead: false,
    positiveFeedback: '',
    negativeFeedback: '',
    technicalScore: 0,
    communicationScore: 0,
    teamworkScore: 0,
    logicalThinkingScore: 0,
    learningDesireScore: 0,
    companyUnderstandingScore: 0,
});

/**
 * 企業情報を管理するAtom
 */
export const companyAtom = atom<CompanyTypes | undefined>(undefined);

/**
 * 履歴書情報を管理するAtom
 */
export const resumeAtom = atom<ResumeTypes | undefined>(undefined);

/**
 * 設定情報を管理するAtom
 */
export const settingAtom = atom<SettingTypes | undefined>(undefined);

/**
 * ランキング情報を管理するAtom
 */
export const rankingAtom = atom<RankingTypes[]>([]);

/**
 * 録音状態を管理するAtom
 */
export const isRecordingAtom = atom <boolean>(false);

/**
 * 音声再生状態を管理するAtom
 */
export const isPlayingAudioAtom = atom<boolean>(false);

/**
 * ユーザー情報を管理するAtom
 */
export const userAtom = atom<UserTypes | null>(null);