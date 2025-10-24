# 🛠️ Lowcoder Dev Tools

A lightweight local build automation setup for Lowcoder developers.  
It simplifies rebuilding and deploying the Lowcoder SDK and component packages for faster iteration.

---

## ⚙️ Setup

1. **Place this folder anywhere** on your system (doesn't need to be inside the main Lowcoder repo).  

2. **Install dependencies**:
```bash
   npm install
```

3. **Configure the repo path** in your build script:
```javascript
   const repoRoot = "F:\\Lowcoder-Main\\lowcoder\\client\\packages";
```

---

## 🚀 Usage

### 🔹 Full Build (SDK → Comps → Deploy)

Runs the complete build process and deploys the new package into Lowcoder's public folder.
```bash
npm run build
```

### ⚡ Fast Build (Comps → Deploy)

Skips the SDK build and only rebuilds the comps package — faster for day-to-day component work.
```bash
npm run build:fast
```

### 👀 Watch Mode (Optional)

Automatically rebuilds whenever a file in `lowcoder-comps/src` changes.
```bash
npm run watch
```

---

## 🧩 What It Does

Each build automatically:

1. Builds `lowcoder-sdk`
2. Builds `lowcoder-comps`
3. Finds the newest `lowcoder-comps-*.tgz`
4. Extracts its internal `package/` folder
5. Copies it into:
```
   F:\Lowcoder-Main\lowcoder\client\packages\lowcoder\public\package
```

---

## 🪄 Notes

* Requires Node.js (v18 or newer) and npm installed.
* Works fully standalone — no changes needed in the Lowcoder repo.
* You can safely delete old `.tgz` files from `lowcoder-comps` if they accumulate.
* Update `repoRoot` in `gulpfile.js` if your directory structure changes.
* The script automatically removes and overwrites the existing `package` each time you build.

---

## 📄 Files Included

| File | Description |
|------|-------------|
| `gulpfile.js` | Automation logic for building and deployment |
| `package.json` | Defines dependencies and npm scripts |
| `README.md` | Setup and usage guide |

---

**Author:** Faran Javed  
**Purpose:** Streamline repetitive local build and deployment steps for Lowcoder developers.