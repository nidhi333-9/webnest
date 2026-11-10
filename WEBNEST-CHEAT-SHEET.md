# WebNest cheat sheet

**What it is:** a site builder. Anyone signs up and gets a portfolio + blog at `webnest.com/<username>`.
**Built with:** Next.js 16 (pages and API in one app), Postgres 17, Prisma, bcrypt, Tailwind, Docker, AWS EC2, GitHub Actions.
**Not in this project:** no sensor, no separate backend, no JWT (`JWT_SECRET` in `.env` is unused).

## The picture

```
Browser ──► Next.js app (container 1) ──► Postgres (container 2)
            ├─ pages
            └─ /api routes  (the "backend")

push to GitHub main ──► runner on the EC2 server ──► rebuild containers
```

- Dashboard pages run in the browser and call `/api/...` with `fetch`.
- Public pages (`/<username>`, blog posts) read the database directly on the server.
- Every database call goes through one Prisma client: `frontend/lib/prisma.ts`.

## 14 tables

| Group | Tables |
|---|---|
| Accounts | User, Session, Tenant, Membership |
| Profile | Profile, SocialLink, Skill |
| Projects | Project, Technology, ProjectTechnology (join) |
| Blog | Post, Category, Tag, PostTag (join) |

- Tenant = one person's site. Posts, skills, projects, etc. belong to a tenant.
- Membership links User to Tenant with a role (OWNER / EDITOR).
- Tag and Technology are shared by everyone. Category is per tenant.
- Post slug is unique per tenant, not globally.
- Deleting a tenant deletes all its data (cascade).

## Auth in 6 lines

1. Register: check email/username are free, bcrypt-hash the password, create User + Tenant + Membership.
2. Create a Session row with a random 32-byte token (valid 7 days).
3. Send the token as a cookie: httpOnly, secure, sameSite lax.
4. Every request: look the token up in Session, check not expired, find the user's tenant (`getAuthUser.ts`).
5. `proxy.ts` redirects to `/login` for `/dashboard/*` without a valid session.
6. Every API route returns 401 without a session and only touches rows with the user's own `tenantId`.

## Where things are

| Want to see... | Open |
|---|---|
| Tables | `frontend/prisma/schema.prisma` |
| Login / register / logout | `frontend/app/api/auth/*/route.ts` |
| Who is calling? | `frontend/lib/getAuthUser.ts` |
| Dashboard guard | `frontend/proxy.ts` |
| Template for every API route | `frontend/app/api/posts/route.ts` |
| Public site | `frontend/app/[username]/page.tsx` |
| Public blog post | `frontend/app/[username]/blog/[slug]/page.tsx` |
| Docker | `frontend/Dockerfile`, `frontend/docker-compose.yml` |
| Auto-deploy | `.github/workflows/deploy.yml` |

Placeholders: `discover/page.tsx` uses hardcoded creators. `lib/api.ts` and `lib/constants.ts` are empty.

## Deploy

- Dockerfile: Node 22, `npm install`, `prisma generate`, `npm run build`, `npm start` on 3000.
- Compose: `db` (Postgres 17 + volume `postgres_data`) and `app` (needs `.env`).
- Workflow: push to `main` → runner on EC2 → `git pull`, `docker compose build --no-cache`, `docker compose up -d`, `docker builder prune -af`.
- AWS words to know: EC2, security group (firewall), SSH, Elastic IP, domain pointing to the server.

## Check on the server before the interview

1. How is HTTPS set up? (not in the repo)
2. How were the tables created on EC2? (no `prisma migrate deploy` in Dockerfile or workflow)
3. Does the server `.env` use host `db` instead of `localhost`?
4. Is port 5432 blocked in the security group? (compose publishes it, password is in a committed file)

## 30-second intro

> "WebNest is a site builder where anyone can sign up and get their own portfolio and blog at `webnest.com/username`. I built it with Next.js and Postgres. Users write posts, add projects and skills, and publish. It has its own login with hashed passwords and session cookies. I run it in Docker on an AWS EC2 server, and every push to GitHub redeploys it automatically."

## Likely questions

- **Why session cookies, not JWT?** The token is looked up in the database, so I can log someone out instantly by deleting the row.
- **How do you stop user A editing user B's data?** Every query filters by the logged-in user's `tenantId`; a mismatch gives 404.
- **Why Docker?** App and database run the same on my laptop and the server.
- **What would you improve?** Login rate limiting, input validation, real search on Discover, cleaning up old sessions.
- **A problem you hit?** I turned the secure-cookie flag off for an HTTP deploy, then back on once HTTPS worked.
- **What does Discover do?** It's a placeholder with sample creators; real search isn't built yet.

## Weak spots (say them before they ask)

- No rate limit on login.
- No password-length check at register (only when changing it).
- No email verification.
- Expired sessions are only deleted when someone tries to use them.
