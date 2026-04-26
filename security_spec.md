# Firebase Security Specification - DPSS Ultimate Test Builder

## Data Invariants
1. **User Settings**: Every user MUST have exactly one settings document at `/users/{userId}` where `userId` matches their `auth.uid`.
2. **Ownership**: All documents in `history`, `customExerciseTypes`, `customDesigns`, `strictRules`, `masterProtocols`, and `templates` MUST belong to a user, identified by a `uid` field matching `request.auth.uid`.
3. **Immutability**: The `uid` field and `timestamp` fields (where applicable) are immutable once created.
4. **Content Integrity**: Reading content cannot exceed 1MB. Titles cannot be empty.
5. **Relational Integrity**: A custom exercise type referencing a design must point to a valid design document (optional enhancement).

## The "Dirty Dozen" Payloads

1. **Identity Spoofing (History)**: Creating a history item with another user's `uid`.
2. **Shadow Field Injection**: Adding an `isAdmin: true` field to a user profile.
3. **Ghost Update**: Attempting to change the `uid` of an existing history document.
4. **Terminal State Bypass**: (If applicable, e.g., a "published" status) - Not applicable here yet.
5. **Resource Exhaustion (Large ID)**: Using a 2KB string as a document ID.
6. **Resource Exhaustion (Large Content)**: Injecting a 5MB string into the `content` field.
7. **Type Poisoning**: Sending a `number` for the `title` field in `history`.
8. **Unauthorized List**: Attempting to list all history items without a `uid` filter (relying on client-side filtering).
9. **PII Leak**: An unauthenticated user attempting to get a user profile by ID.
10. **Orphaned Write**: Creating a history item with a non-string `timestamp`.
11. **Malicious Regex**: Sending a document ID that contains forbidden shell characters or is extremely long.
12. **Cross-Tenant Access**: User A attempting to update User B's custom design.

## Test Runner (Logic)

The following tests verify that all malicious payloads return `PERMISSION_DENIED`.

```typescript
// firestore.rules.test.ts (Conceptual)
describe('Firestore Security Rules', () => {
  it('should deny creating history for another user', async () => { ... });
  it('should deny updating uid field', async () => { ... });
  it('should deny injections of shadow fields', async () => { ... });
  it('should deny unauthorized listing', async () => { ... });
  // ... etc
});
```
