'use client';
import { collection, getDocs, query } from '@firebase/firestore';
import { firestore } from '@/firebase';
import {ResumeTypes,CompanyTypes ,SettingTypes } from '@/types';
import {useState,useEffect} from 'react';


interface setResumeInfo {
    (data: ResumeTypes[]): void;
}
interface setCompanyInfo {
    (data: CompanyTypes[]): void;
}
interface setSettingInfo {
    (data: SettingTypes[]): void;
}
export const getResume = async (setResumeInfo: setResumeInfo) => {
    try {
        const q = query(collection(firestore, 'resumes'));
        const snapShot = await getDocs(q);
        if(snapShot){}
        const data = snapShot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
        })) as ResumeTypes[];
        
        setResumeInfo(data);
    } catch (e) {
        console.error(e);
    }
};

export const getCompany= async (setCompanyInfo:setCompanyInfo) =>{
    try{
      const q= query(collection(firestore,'company'));
      const snapShot = await getDocs(q);
      const data = snapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as CompanyTypes[];          
      setCompanyInfo(data);      
    } catch (e){
      console.error(e);
    }
};

export const getSetting= async (setSettingInfo:setSettingInfo) =>{
    try{
      const q= query(collection(firestore,'setting'));
      const snapShot = await getDocs(q);
      const data = snapShot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as SettingTypes[];          
      setSettingInfo(data);      
    } catch (e){
      console.error(e);
    }
}