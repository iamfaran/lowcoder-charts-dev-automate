import gulp from "gulp";
import { execa } from "execa";
import path from "node:path";
import os from "node:os";
import fs from "fs-extra";
import decompress from "decompress";
import { globby } from "globby";

const repoRoot = "F:\\Lowcoder-Main\\lowcoder\\client\\packages";
const sdkPath = path.join(repoRoot, "lowcoder-sdk");
const compsPath = path.join(repoRoot, "lowcoder-comps");
const publicPath = path.join(repoRoot, "lowcoder\\public");

const compsUnpacked = path.join(compsPath, "dist", "package");
const publicPackage = path.join(publicPath, "package");

async function runYarn(cwd, command) {
  console.log(`\n📦 Running 'yarn ${command}' in ${cwd}`);
  if (!(await fs.pathExists(path.join(cwd, "node_modules")))) {
    await execa("yarn", ["install"], { cwd, stdio: "inherit" });
  }
  await execa("yarn", [command], { cwd, stdio: "inherit" });
}

async function latestTgz() {
  const files = await globby("*.tgz", {
    cwd: compsPath,
    absolute: true,
    onlyFiles: true,
  });
  if (!files.length) return null;
  const withTimes = await Promise.all(
    files.map(async (f) => ({ f, t: (await fs.stat(f)).mtimeMs }))
  );
  withTimes.sort((a, b) => b.t - a.t);
  return withTimes[0].f;
}

async function deployPackage() {
  if (await fs.pathExists(compsUnpacked)) {
    console.log("🚀 Copying unpacked package folder...");
    await fs.remove(publicPackage);
    await fs.copy(compsUnpacked, publicPackage, { overwrite: true });
    console.log("✅ Deployed package (unpacked).");
    return;
  }

  console.log("📦 Extracting latest .tgz from lowcoder-comps...");
  const tgz = await latestTgz();
  if (!tgz) throw new Error(`No .tgz found in ${compsPath}`);

  const temp = path.join(os.tmpdir(), "lowcoder-comps-temp");
  await fs.remove(temp);
  await fs.ensureDir(temp);

  await decompress(tgz, temp);

  const pkgDir = path.join(temp, "package");
  if (!(await fs.pathExists(pkgDir))) {
    throw new Error(
      "Extracted .tgz does not contain a top-level 'package' folder."
    );
  }

  await fs.remove(publicPackage);
  await fs.copy(pkgDir, publicPackage, { overwrite: true });
  console.log("✅ Deployed package from .tgz.");
}

// ---- Gulp tasks ----
export const buildSdk = async () => runYarn(sdkPath, "build");
export const buildComps = async () => runYarn(compsPath, "build");
export const deploy = async () => deployPackage();

// Full build: SDK → comps → deploy
export const buildAll = gulp.series(buildSdk, buildComps, deploy);

// ✅ Fast build: comps → deploy  (for npm run build:fast)
export const buildCompsOnly = gulp.series(buildComps, deploy);

export const watchAll = () => {
  gulp.watch(
    path.join(compsPath, "src", "**", "*.*"),
    { delay: 1000 },
    buildAll
  );
  return buildAll();
};

export default buildAll;
