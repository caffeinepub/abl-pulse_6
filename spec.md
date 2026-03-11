# ABL PULSE

## Current State
- Backend has only `HealthSeekerRecord` type and submission functions. No HC data model or functions exist.
- Login modal uses hardcoded dummy credentials for both Admin and HC.
- HC login currently just checks dummy credentials and opens the same AdminDashboard.
- No HC registration form, no approval flow, no backend HC storage.
- HC sidebar filtering (hide Analytics/Settings) and delete button restriction were planned but never implemented.

## Requested Changes (Diff)

### Add
- `HCRecord` type in backend: id, name, mobile, email, passwordHash, experienceMonths, fieldExpertise, currentWorking, socialMedia, status (PENDING/ACTIVE/REJECTED), registeredAt
- Backend functions: `registerHC`, `loginHC`, `getHCRequests`, `getApprovedHCs`, `approveHC`, `rejectHC`
- Stable variables for HC records with pre/postupgrade hooks
- "Register as HC" button in login modal (HC tab)
- HC Registration Form modal: 8 fields (Name, Mobile, Email, Password, Experience dropdown, Field Expertise, Current Working, Social Media optional)
- "Awaiting Approval" success screen after HC registration
- HC login block logic: PENDING → show awaiting screen, REJECTED → show denied message, ACTIVE → open dashboard

### Modify
- HC login flow: replace dummy credential check with real `loginHC` backend call
- `AdminDashboard`: HC role now hides Analytics and Settings tabs; HC role hides delete buttons
- `LoginModal` HC tab: add "Register as HC" link/button below login form

### Remove
- Hardcoded dummy HC credential (`hc@ablpulse.in / ABLHC@2025`) — replaced by backend login

## Implementation Plan
1. Add `HCRecord` stable type + CRUD functions to `main.mo`
2. Regenerate `backend.d.ts` bindings
3. Add HC Registration Form component in `App.tsx`
4. Add "Register as HC" button in `LoginModal` HC tab
5. Replace dummy HC login with real `loginHC()` backend call
6. Add PENDING/REJECTED state screens
7. Fix HC sidebar filtering (Analytics/Settings hidden) and delete button restriction
