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

export async function signInWithGoogle(): Promise<User | null> {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
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
