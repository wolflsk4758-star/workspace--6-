import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import { Order } from '../types';

// حفظ الفواتير في قاعدة البيانات السحابية
export const saveOrders = async (orders: Order[]): Promise<void> => {
  try {
    await setDoc(doc(db, 'wolf_data', 'orders_document'), { ordersArray: orders });
  } catch (error) {
    console.error("Error saving:", error);
  }
};

// تحميل الفواتير
export const loadOrders = async (): Promise<Order[]> => {
  try {
    const docSnap = await getDoc(doc(db, 'wolf_data', 'orders_document'));
    if (docSnap.exists()) {
      return docSnap.data().ordersArray || [];
    }
    return [];
  } catch (error) {
    console.error("Error loading:", error);
    return [];
  }
};

// جلب الفواتير فورياً (Real-time) عند إضافتها من أي جهاز
export const subscribeToOrders = (callback: (orders: Order[]) => void) => {
  return onSnapshot(doc(db, 'wolf_data', 'orders_document'), (docSnap) => {
    if (docSnap.exists()) {
      callback(docSnap.data().ordersArray || []);
    } else {
      callback([]);
    }
  });
};