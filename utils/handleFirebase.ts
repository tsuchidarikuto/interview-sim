'use client';
import { collection, getDocs, query ,updateDoc,doc, where,addDoc,getDoc, deleteDoc} from '@firebase/firestore';
import { firestore } from '@/firebase';

export const getArrayDataFromFirestore = async <T,>(collectionName: string,uid:string): Promise<T[]> => {
  try {
    const q = query(
      collection(firestore, collectionName),
      where('uid','==',uid)
    );
    if (!q) {
      console.log('No query.');
      return [];
    }
    const snapShot = await getDocs(q);
    if (snapShot.empty) {
      console.log('No matching documents.');
      return [];
    }
    const data = snapShot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as T[];
    
    return data;
  } catch (e) {
    console.error('Error fetching data:', e);
    return [];
  }
};

export const getDataFromFirestoreWithId = async <T>(collectionName:string,dataId:string):Promise<T | null> =>{
 try{
  const docRef = doc(firestore,collectionName,dataId);
  const snapShot = await getDoc(docRef);
  console.log(snapShot);
  const data = {...snapShot.data(),id:snapShot.id }as T;
  console.log(data);
  return data;
 }catch{
  return null;
 } 
}

export const updateDataOnFirestore = async <T extends{id:string}>(collectionName: string, data: T): Promise<void> => {  
  try {
    await updateDoc(doc(firestore, collectionName, data.id), data);
    console.log('Document successfully updated!');
  } catch (e) {
    console.error('Error updating document:', e);
  }
}

export const addDataToFirestore = async <T>(collectionName: string, data: T, uid: string): Promise<void> => {
  try {
    await addDoc(collection(firestore, collectionName), {
      ...data,
      uid: uid,
    });
    console.log('Document successfully added!');
  } catch (e) {
    console.error('Error adding document:', e);
  }
}

export const deleteDataOnFirestore = async (collectionName:string,dataId:string):Promise<boolean>=>{
  try{
    await deleteDoc(doc(firestore,collectionName,dataId));
    return true;
  }catch(e){
    console.log("Error during delete");
    return false;
  }
}


export async function getHistory(uid:string) {
        try {
            
            
            const q = query(
                collection(firestore, 'history'),
                where('uid','==',uid)
            );

            const snapShot = await getDocs(q);
            const interviewResultHistory = snapShot.docs.map(doc => {
                const data = doc.data();
                const interviewResult: any = { ...data, id: doc.id };
                return interviewResult;
            });
            interviewResultHistory.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
            const isFetching=false;
            return {interviewResultHistory,isFetching};
            
            
        } catch (e) {
            console.error('Error getting document:', e);
        }
};
