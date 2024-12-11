import {atom} from 'jotai';
import {questionTypes,conversationTypes} from '@/types';

export const questionsAtom = atom<questionTypes[]>([]);

export const conversationAtom = atom<conversationTypes[]>([]);