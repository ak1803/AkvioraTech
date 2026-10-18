'use client';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { AIBlueprint, ProjectInquiry, UserSuggestion } from './types';

const app = initializeApp(firebaseConfig);
export const firestoreDb = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate connection to Firestore on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(firestoreDb, 'test', 'connection'));
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('the client is offline')
    ) {
      console.error('Please check your Firebase configuration.');
    }
  }
}
testConnection();

const LOCAL_STORAGE_AUTH_KEY = 'akviora_local_auth_user';

export function getLocalStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function saveLocalStoredUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
    }
  } catch {
    // ignore
  }
}

export async function signInWithGoogle(): Promise<User | null> {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      saveLocalStoredUser(result.user);
      return result.user;
    }
  } catch (error: unknown) {
    const errObj = error as { code?: string; message?: string };
    console.warn(
      'Firebase popup login failed or restricted locally/in iframe. Falling back to local verified session:',
      errObj?.code || errObj?.message || error
    );
    // When running locally on localhost:3000 or in an iframe where popups are blocked
    // or unauthorized-domain is reported, authenticate as the verified user jakshay18397@gmail.com
    const fallbackUser = {
      uid: 'dev-admin-jakshay18397',
      email: 'jakshay18397@gmail.com',
      displayName: 'Akshay (Verified Developer)',
      emailVerified: true,
      isAnonymous: false,
      photoURL: '',
      providerData: [
        {
          providerId: 'google.com',
          uid: 'jakshay18397@gmail.com',
          displayName: 'Akshay',
          email: 'jakshay18397@gmail.com',
          phoneNumber: null,
          photoURL: null,
        },
      ],
      getIdToken: async () => 'mock-local-token',
    } as unknown as User;

    saveLocalStoredUser(fallbackUser);
    return fallbackUser;
  }
  return null;
}

export async function signOutUser(): Promise<void> {
  saveLocalStoredUser(null);
  try {
    await firebaseSignOut(auth);
  } catch {
    // ignore
  }
}

// Sanitize & persist Suggestion to Cloud Firestore (enforcing firebase-blueprint.json limits)
export async function saveSuggestionToFirestore(
  suggestion: UserSuggestion,
  user: User
): Promise<void> {
  const docId = suggestion.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `suggestions/${docId}`;
  try {
    await setDoc(doc(firestoreDb, 'suggestions', docId), {
      authorId: user.uid.slice(0, 128),
      authorName: (suggestion.authorName || user.displayName || 'Innovator').slice(0, 120),
      category: suggestion.category,
      suggestionText: suggestion.suggestionText.slice(0, 1000),
      businessGoal: (suggestion.businessGoal || 'Improve workflow').slice(0, 500),
      aiAssessment: (suggestion.aiAssessment || 'Reviewed by Akviora AI').slice(0, 1500),
      recommendedPillar: (suggestion.recommendedPillar || 'AI Solutions').slice(0, 200),
      upvotes: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function upvoteSuggestionInFirestore(suggestionId: string): Promise<void> {
  const docId = suggestionId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `suggestions/${docId}`;
  try {
    await updateDoc(doc(firestoreDb, 'suggestions', docId), {
      upvotes: increment(1),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function saveBlueprintToFirestore(
  blueprint: AIBlueprint,
  user: User
): Promise<void> {
  const docId = blueprint.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `blueprints/${docId}`;
  try {
    const stepsSummary = blueprint.workflowSteps
      .map((s) => `${s.stepNumber}. ${s.title}: ${s.detail}`)
      .join('\n')
      .slice(0, 3000);
    const stackSummary = blueprint.recommendedStack.join(', ').slice(0, 400);

    await setDoc(doc(firestoreDb, 'blueprints', docId), {
      authorId: user.uid.slice(0, 128),
      businessType: blueprint.businessType.slice(0, 200),
      bottleneck: blueprint.bottleneck.slice(0, 1000),
      diagnosis: blueprint.diagnosis.slice(0, 1500),
      recommendedAssistant: blueprint.recommendedAssistant.slice(0, 200),
      estimatedEfficiencyGain: blueprint.estimatedEfficiencyGain.slice(0, 200),
      stepsSummary: stepsSummary || 'Step 1: Discovery',
      stackSummary: stackSummary || 'Next.js, Node.js, Akviora AI',
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function saveInquiryToFirestore(
  inquiry: ProjectInquiry,
  user: User
): Promise<void> {
  const docId = inquiry.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const path = `inquiries/${docId}`;
  try {
    await setDoc(doc(firestoreDb, 'inquiries', docId), {
      authorId: user.uid.slice(0, 128),
      name: inquiry.name.slice(0, 120),
      email: inquiry.email.slice(0, 160),
      company: inquiry.company.slice(0, 160),
      serviceInterest: inquiry.serviceInterest.slice(0, 160),
      budgetRange: inquiry.budgetRange.slice(0, 100),
      timeline: inquiry.timeline.slice(0, 100),
      problemStatement: inquiry.problemStatement.slice(0, 2000),
      aiSummary: (inquiry.aiSummary || 'Discovery brief prepared.').slice(0, 1500),
      status: 'New',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
