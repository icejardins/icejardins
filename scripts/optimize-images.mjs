import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const rootDir = process.cwd();
const postsDir = path.join(rootDir, "static", "images", "posts");
const sobreDir = path.join(rootDir, "static", "images", "sobre");
const doacoesDir = path.join(rootDir, "static", "images", "doacoes");
const contentPostsDir = path.join(rootDir, "content", "posts");

async function convertWithCwebp(inputPath, outputPath, options = {}) {
  const { width, height, quality = 75 } = options;
  const args = ["-q", String(quality), "-m", "6"];
  if (width && height) {
    args.push("-resize", String(width), String(height));
  }
  args.push(inputPath, "-o", outputPath);
  await execFileAsync("cwebp", args);
}

async function optimizePosts() {
  const files = await fs.readdir(postsDir);
  console.log("Optimizing post images...");

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

    const baseName = path.basename(file, ext);
    const inputPath = path.join(postsDir, file);
    const outputName = `${baseName}.webp`;
    const tempOutputPath = path.join(postsDir, `${baseName}.temp.webp`);
    const finalOutputPath = path.join(postsDir, outputName);

    const statBefore = await fs.stat(inputPath);

    await convertWithCwebp(inputPath, tempOutputPath, { width: 640, height: 360, quality: 75 });
    const statAfter = await fs.stat(tempOutputPath);

    if (file !== outputName) {
      await fs.unlink(inputPath);
    }

    await fs.rename(tempOutputPath, finalOutputPath);

    console.log(
      `✓ ${file} (${(statBefore.size / 1024).toFixed(1)} KiB) -> ${outputName} (${(statAfter.size / 1024).toFixed(1)} KiB)`
    );
  }
}

async function optimizeDoacoes() {
  try {
    const qrPng = path.join(doacoesDir, "qrcode-pix.png");
    const qrWebp = path.join(doacoesDir, "qrcode-pix.webp");

    console.log("\nOptimizing doações QR code...");
    if (await fs.stat(qrPng).catch(() => null)) {
      await convertWithCwebp(qrPng, qrWebp, { width: 380, height: 380, quality: 80 });
      const statWebp = await fs.stat(qrWebp);
      console.log(`✓ qrcode-pix.webp generated (${(statWebp.size / 1024).toFixed(1)} KiB)`);
    }
  } catch (err) {
    console.warn("Could not optimize doacoes:", err.message);
  }
}

async function optimizeSobre() {
  const files = await fs.readdir(sobreDir);
  console.log("\nOptimizing sobre images...");

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) continue;

    const baseName = path.basename(file, ext);
    const inputPath = path.join(sobreDir, file);
    const outputName = `${baseName}.webp`;
    const tempOutputPath = path.join(sobreDir, `${baseName}.temp.webp`);
    const finalOutputPath = path.join(sobreDir, outputName);

    const statBefore = await fs.stat(inputPath);

    await convertWithCwebp(inputPath, tempOutputPath, { quality: 80 });
    const statAfter = await fs.stat(tempOutputPath);

    if (file !== outputName) {
      await fs.unlink(inputPath);
    }

    await fs.rename(tempOutputPath, finalOutputPath);

    console.log(
      `✓ ${file} (${(statBefore.size / 1024).toFixed(1)} KiB) -> ${outputName} (${(statAfter.size / 1024).toFixed(1)} KiB)`
    );
  }
}

async function updateMarkdownFrontmatter() {
  console.log("\nUpdating markdown frontmatter image paths to .webp...");
  const files = await fs.readdir(contentPostsDir);

  for (const file of files) {
    if (!file.endsWith(".md")) continue;
    const filePath = path.join(contentPostsDir, file);
    let content = await fs.readFile(filePath, "utf8");

    const updated = content.replace(/image\s*=\s*"(\/images\/posts\/[^"]+)\.(jpg|jpeg|png)"/gi, 'image = "$1.webp"');
    if (updated !== content) {
      await fs.writeFile(filePath, updated, "utf8");
      console.log(`✓ Updated image extension in ${file}`);
    }
  }
}

async function main() {
  await optimizePosts();
  await optimizeDoacoes();
  await optimizeSobre();
  await updateMarkdownFrontmatter();
  console.log("\nAll images optimized successfully!");
}

main().catch((err) => {
  console.error("Optimization failed:", err);
  process.exit(1);
});
