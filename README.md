# Advanced Authentication Workflow | Authy: Next.js 14, NextAuthV5, SanityCMS Custom Adapter, Typescript
![IMAGE](https://github.com/KennedyNvsf/sanity_boardify/assets/45067556/561778e2-8fe8-4940-a4c6-7dd971249405)


This is a repository for Authy: Next.js 14, NextAuthV5, SanityCMS Custom Adapter, Typescript


Key Features:
- 🔐 Next-auth v5 (Auth.js)
- 🚀 Next.js 14 with server actions
- 📄Custom SANITY CMS Adapter Integration
- ☁️Embbed SANITY studio
- 🔑 Credentials Provider
- 🌐 OAuth Provider (Social login with Google & GitHub)
- 🔒 Forgot password functionality
- ✉️ Email verification
- 📱 Two factor verification
- 👥 User roles (Admin & User)
- 🚧 Role Gate
- 👤 useCurrentUser hook
- 🛂 useRole hook
- 🧑 currentUser utility
- 👮 currentRole utility
- 🖥️ Example with server component
- 💻 Example with client component
- 👑 Render content for admins using RoleGate component
- 🛡️ Protect API Routes for admins only
- 🔐 Protect Server Actions for admins only


### Cloning this repository

```shell
git clone 
```


### Install packages

```shell
npm i
```

### Setup .env file


```js

NEXT_PUBLIC_APP_URL=

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
NEXT_PUBLIC_SANITY_TOKEN=

AUTH_SECRET=

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

RESEND_API_KEY=

```

### Running app

```shell
npm run dev
```