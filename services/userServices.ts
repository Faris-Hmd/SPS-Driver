"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { revalidatePath } from "next/cache";
import { Driver, UserData } from "@/types/userTypes";

const COL = "users";

/**
 * GET: Returns user data including shipping info
 */
export async function getUser(email: string): Promise<UserData | null> {
  if (!email) return null;
  console.log("get user from server", email);

  try {
    const snap = await getDoc(doc(db, COL, email));
    if (!snap.exists()) return null;

    return {
      ...snap.data(),
      email: snap.id,
    } as UserData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

export async function getDriverInfo(
  email: string | undefined,
): Promise<Driver | null> {
  if (!email) return null;
  console.log("get driver info from server", email);

  try {
    const snap = await getDocs(
      query(collection(db, "drivers"), where("email", "==", email)),
    );
    if (!snap.docs.length) return null;

    return {
      ...snap.docs[0].data(),
      id: snap.docs[0].id,
    } as Driver;
  } catch (error) {
    console.error("Error fetching driver info:", error);
    return null;
  }
}
