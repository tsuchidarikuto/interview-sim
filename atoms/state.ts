import {atom} from 'jotai';
import type {PrimitiveAtom} from 'jotai';
import {questionTypes} from '@/types';

export const questionsAtom = atom<questionTypes[]>([]);
