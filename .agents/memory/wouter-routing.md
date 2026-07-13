---
name: Wouter v3 routing
description: Pattern to avoid when using Wouter v3 nested Switch for layout routing.
---

The pattern `<Route path="/:rest*">` inside a `<Switch>` does NOT reliably match the root path `/` in Wouter v3 when used as a catch-all layout wrapper.

**Why:** `/:rest*` expects at least the leading slash plus optional rest; at the root the router may skip it.

**How to apply:** Instead of nesting layouts inside a catch-all Route, use `useLocation()` and branch components directly:
```tsx
function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith('/admin');
  return isAdmin ? <AdminRouter /> : <StoreRouter />;
}
```
Each sub-router then uses a flat `<Switch>` with explicit routes including `<Route path="/" component={Home} />` as the last specific route before the 404 catch-all.
