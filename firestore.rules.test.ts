/**
 * Firestore Security Rules Test Specification (Dirty Dozen Verification)
 * Validates that all 12 adversarial payloads in security_spec.md return PERMISSION_DENIED.
 */

export interface SecurityTestCase {
  id: number;
  name: string;
  collection: string;
  docId: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  auth: { uid: string; email?: string; email_verified?: boolean } | null;
  payload?: Record<string, unknown>;
  expectedResult: 'PERMISSION_DENIED' | 'ALLOWED';
}

export const DIRTY_DOZEN_TESTS: SecurityTestCase[] = [
  {
    id: 1,
    name: 'Unauthenticated create on /suggestions',
    collection: 'suggestions',
    docId: 'sug_1',
    operation: 'create',
    auth: null,
    payload: { authorId: 'anon' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 2,
    name: 'Unverified admin email spoof on /inquiries',
    collection: 'inquiries',
    docId: 'inq_1',
    operation: 'get',
    auth: {
      uid: 'spoof_uid',
      email: 'jakshay18397@gmail.com',
      email_verified: false,
    },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 3,
    name: 'Identity spoofing authorId mismatch on create',
    collection: 'suggestions',
    docId: 'sug_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'u1@example.com', email_verified: true },
    payload: { authorId: 'user_2' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 4,
    name: 'Shadow field injection (isVerifiedAdmin: true)',
    collection: 'suggestions',
    docId: 'sug_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'u1@example.com', email_verified: true },
    payload: { authorId: 'user_1', isVerifiedAdmin: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 5,
    name: 'Path variable ID poisoning with special chars',
    collection: 'suggestions',
    docId: 'bad$id!@#',
    operation: 'create',
    auth: { uid: 'user_1', email: 'u1@example.com', email_verified: true },
    payload: { authorId: 'user_1' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 6,
    name: 'Denial-of-Wallet string overflow (>1000 chars)',
    collection: 'suggestions',
    docId: 'sug_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'u1@example.com', email_verified: true },
    payload: { authorId: 'user_1', suggestionText: 'x'.repeat(1500) },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 7,
    name: 'Client timestamp forgery on /blueprints',
    collection: 'blueprints',
    docId: 'bp_1',
    operation: 'create',
    auth: { uid: 'user_1', email: 'u1@example.com', email_verified: true },
    payload: { authorId: 'user_1', createdAt: '1999-01-01T00:00:00Z' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 8,
    name: 'Immortal field mutation (changing authorId on update)',
    collection: 'suggestions',
    docId: 'sug_1',
    operation: 'update',
    auth: { uid: 'user_1', email: 'u1@example.com', email_verified: true },
    payload: { authorId: 'user_2' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 9,
    name: 'PII horizontal privilege escalation on /inquiries',
    collection: 'inquiries',
    docId: 'inq_owner_1',
    operation: 'get',
    auth: { uid: 'user_2', email: 'u2@example.com', email_verified: true },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 10,
    name: 'Value poisoning upvotes field with string',
    collection: 'suggestions',
    docId: 'sug_1',
    operation: 'update',
    auth: { uid: 'user_2', email: 'u2@example.com', email_verified: true },
    payload: { upvotes: '999999' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 11,
    name: 'System field tampering (modifying aiAssessment during upvote)',
    collection: 'suggestions',
    docId: 'sug_1',
    operation: 'update',
    auth: { uid: 'user_2', email: 'u2@example.com', email_verified: true },
    payload: { upvotes: 2, aiAssessment: 'Hacked assessment' },
    expectedResult: 'PERMISSION_DENIED',
  },
  {
    id: 12,
    name: 'Terminal state bypass on Completed inquiry',
    collection: 'inquiries',
    docId: 'inq_completed',
    operation: 'update',
    auth: { uid: 'user_1', email: 'u1@example.com', email_verified: true },
    payload: { status: 'New' },
    expectedResult: 'PERMISSION_DENIED',
  },
];
