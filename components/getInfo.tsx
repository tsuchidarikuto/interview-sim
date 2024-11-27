'use client';
import { collection, getDocs, query ,updateDoc,doc} from '@firebase/firestore';
import { firestore } from '@/firebase';

export const getInfo = async <T,>(collectionName: string): Promise<T[]> => {
  try {
    const q = query(collection(firestore, collectionName));
    const snapShot = await getDocs(q);
    if (snapShot.empty) {
      console.log('No matching documents.');
      return [];
    }
    const data = snapShot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as T[];
    console.log('Fetched data in getInfo:', data); // データをログ出力
    return data;
  } catch (e) {
    console.error('Error fetching data:', e);
    return [];
  }
};

export const updateInfo = async <T extends{id:string}>(collectionName: string, data: T): Promise<void> => {
  try {
    await updateDoc(doc(firestore, collectionName, data.id), data);
    console.log('Document successfully updated!');
  } catch (e) {
    console.error('Error updating document:', e);
  }
}