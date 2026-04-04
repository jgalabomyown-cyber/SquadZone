# TODO: Fix Next.js Router Error in DashboardLayout

## Steps to Complete:

### [ ] Step 1: Edit app/home/page.tsx
- Remove incorrect `import router from "next/router";`
- Add `const router = useRouter();` inside the `fetchUser` function (client-safe)
- Replace `router.replace('/');` with the correct router instance
- Remove `router` from useEffect deps

### [ ] Step 2: Test the fix
- Run `npm run dev`
- Navigate to `/home` without authentication
- Verify redirect to '/' works without console errors

### [ ] Step 3: Complete task
- Use attempt_completion
