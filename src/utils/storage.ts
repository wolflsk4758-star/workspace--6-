import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';

export interface UserAccount {
  id: string;
  username: string;
  password: string;
  displayName: string;
  role: 'admin' | 'staff';
  createdAt: string;
}

export interface AppSettings {
  logoUrl: string;
  users: UserAccount[];
}

export const DEFAULT_LOGO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120' fill='none'><rect width='120' height='120' rx='26' fill='%23090D16' stroke='%23F59E0B' stroke-width='4'/><path d='M25 32L40 88L60 52L80 88L95 32' stroke='url(%23gold)' stroke-width='10' stroke-linecap='round' stroke-linejoin='round'/><circle cx='60' cy='26' r='6' fill='%23F59E0B'/><defs><linearGradient id='gold' x1='25' y1='32' x2='95' y2='88' gradientUnits='userSpaceOnUse'><stop stop-color='%23FBBF24'/><stop offset='1' stop-color='%23D97706'/></linearGradient></defs></svg>";

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'admin-main',
    username: 'admin',
    password: '1234',
    displayName: 'المدير العام (WOLF LSK)',
    role: 'admin',
    createdAt: '2026-10-01',
  },
];

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

// حفظ إعدادات الحسابات واللوغو في قاعدة البيانات السحابية
export const saveAppSettings = async (settings: AppSettings): Promise<void> => {
  try {
    await setDoc(doc(db, 'wolf_data', 'settings_document'), settings);
  } catch (error) {
    console.error("Error saving settings:", error);
  }
};

// جلب الحسابات واللوغو فورياً (Real-time) من قاعدة البيانات السحابية
export const subscribeToAppSettings = (callback: (settings: AppSettings) => void) => {
  return onSnapshot(doc(db, 'wolf_data', 'settings_document'), (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data() as Partial<AppSettings>;
      callback({
        logoUrl: data.logoUrl || DEFAULT_LOGO,
        users: data.users && data.users.length > 0 ? data.users : DEFAULT_USERS,
      });
    } else {
      const initialSettings: AppSettings = {
        logoUrl: DEFAULT_LOGO,
        users: DEFAULT_USERS,
      };
      saveAppSettings(initialSettings);
      callback(initialSettings);
    }
  });
};
