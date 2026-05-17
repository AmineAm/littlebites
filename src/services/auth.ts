import {
  signInWithCredential,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'

export async function signInWithGoogle(idToken: string) {
  const credential = GoogleAuthProvider.credential(idToken)
  const result = await signInWithCredential(auth, credential)
  await ensureUserDocument(result.user)
  return result.user
}

export async function signUpWithEmail(email: string, password: string) {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  await ensureUserDocument(result.user)
  return result.user
}

export async function signInWithEmail(email: string, password: string) {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signOut() {
  await firebaseSignOut(auth)
}

export function subscribeToAuthState(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback)
}

async function ensureUserDocument(user: FirebaseUser) {
  const ref = doc(db, 'users', user.uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) {
    await setDoc(ref, {
      uid:                  user.uid,
      email:                user.email ?? '',
      displayName:          user.displayName ?? undefined,
      createdAt:            serverTimestamp(),
      updatedAt:            serverTimestamp(),
      activeCharacter:      'marco-lily',
      onboardingComplete:   false,
      adventureLevel:       'curious',
      homeCuisine:          '',
      notificationsEnabled: false,
    })
  }
}
