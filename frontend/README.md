# ClaimLite frontend

The Angular frontend is an Nx workspace with two independently buildable applications:

- `claimlite` is the host shell on port 4200. It owns the dashboard and User Directory.
- `claims` is the Claims remote on port 4201. It owns claim logging and the claims roster.

The host loads the remote routes at runtime through Webpack Module Federation. The remote URL is configured in `claimlite/public/mf.manifest.json`; update that file for the environment where the remote is deployed. The remote server must allow cross-origin requests for `remoteEntry.js` and its chunks.

## Run locally

Install dependencies from this directory:

```bash
npm install
```

Start both applications:

```bash
npm run start:all
```

Open [http://localhost:4200](http://localhost:4200). The remote can also be run on its own at [http://localhost:4201/claims](http://localhost:4201/claims).

To run one application:

```bash
npm run start:host
npm run start:claims
```

Build each application independently:

```bash
npm run build:host
npm run build:claims
```

The backend API is expected at `http://localhost:3000/api`; start the backend separately from the repository root instructions.
