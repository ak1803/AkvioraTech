# Akviora Technologies — Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants & Relationship Mapping

1. **Global Default Deny**: Any path not explicitly matched is unconditionally denied (`allow read, write: if false;`).
2. **Verified Identity Gate**: Every write operation across `/suggestions/{suggestionId}`, `/blueprints/{blueprintId}`, and `/inquiries/{inquiryId}` requires an authenticated user with `request.auth.token.email_verified == true`.
3. **Identity Ownership Invariant**: On document creation (`create`), `incoming().authorId == request.auth.uid` is strictly enforced. On `update`, `incoming().authorId == existing().authorId` is immutable.
4. **Temporal Integrity**: `createdAt` must equal `request.time` on `create` and is immutable (`incoming().createdAt == existing().createdAt`) on `update`. `updatedAt` must equal `request.time` on `create` and `update`.
5. **PII Isolation (`/inquiries/{inquiryId}`)**: Project inquiries contain PII (`email`). Therefore, `get` and `list` operations on `/inquiries/{inquiryId}` are strictly restricted to the document owner (`resource.data.authorId == request.auth.uid`) or a verified administrator (`isAdmin()`). Blanket `isSignedIn()` reads on `/inquiries` are prohibited.
6. **Terminal State Locking (`/inquiries/{inquiryId}`)**: Once `existing().status == 'Completed'`, non-admin users cannot perform subsequent updates.

---

## 2. The "Dirty Dozen" Adversarial Payloads

1. **Payload 1 (Unauthenticated Write)**: `auth = null` attempting `create` on `/suggestions/sug_1` -> `PERMISSION_DENIED`.
2. **Payload 2 (Unverified Email Spoof)**: `auth = { uid: 'u1', token: { email: 'jakshay18397@gmail.com', email_verified: false } }` attempting admin read on `/inquiries/inq_1` -> `PERMISSION_DENIED`.
3. **Payload 3 (Identity Spoofing on Create)**: `auth.uid = 'u1'` attempting `create` on `/suggestions/sug_1` with `authorId: 'u2'` -> `PERMISSION_DENIED`.
4. **Payload 4 (Shadow / Ghost Field Injection)**: `create` on `/suggestions/sug_1` including an undeclared field `isVerifiedAdmin: true` -> Rejected by `data.keys().hasOnly(...)` -> `PERMISSION_DENIED`.
5. **Payload 5 (ID Poisoning Attack)**: `create` on `/suggestions/invalid$id!@#` or >128 char ID -> Rejected by `isValidId(suggestionId)` -> `PERMISSION_DENIED`.
6. **Payload 6 (Denial-of-Wallet String Overflow)**: `create` on `/suggestions/sug_1` with `suggestionText` length > 1000 chars -> Rejected by `.size() <= 1000` -> `PERMISSION_DENIED`.
7. **Payload 7 (Client Timestamp Forgery)**: `create` on `/blueprints/bp_1` with a past/future timestamp (`createdAt != request.time`) -> `PERMISSION_DENIED`.
8. **Payload 8 (Immortal Field Mutation)**: `update` on `/suggestions/sug_1` attempting to mutate `createdAt` or `authorId` -> `PERMISSION_DENIED`.
9. **Payload 9 (PII Horizontal Privilege Escalation)**: Authenticated user `u2` attempting `get` or `list` on `/inquiries/inq_u1` owned by `u1` -> `PERMISSION_DENIED`.
10. **Payload 10 (Update-Gap / Value Poisoning)**: `update` on `/suggestions/sug_1` attempting to set `upvotes` to a string `"9999"` or negative number -> Rejected by `isValidSuggestion(incoming())` -> `PERMISSION_DENIED`.
11. **Payload 11 (System-Field Tampering on Upvote)**: Non-owner user `u2` attempting to modify `aiAssessment` or `suggestionText` during an upvote action on `/suggestions/sug_1` -> Rejected by `affectedKeys().hasOnly(['upvotes', 'updatedAt'])` -> `PERMISSION_DENIED`.
12. **Payload 12 (Terminal State Bypass)**: User attempting to `update` `/inquiries/inq_1` after `existing().status == 'Completed'` -> `PERMISSION_DENIED`.
