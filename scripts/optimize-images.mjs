import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const postsDir = path.join(rootDir, "static", "images", "posts");
const sobreDir = path.join(rootDir, "static", "images", "sobre");
const doacoesDir = path.join(rootDir, "static", "images", "doacoes");
const contentPostsDir = path.join(rootDir, "content", "posts");

async function convertWithSharp(inputPath, outputPath, options = {}) {
  const { width, height, quality = 75 } = options;
  let pipeline = sharp(inputPath);
  if (width && height) {
    pipeline = pipeline.resize(width, height, { fit: "cover" });
  }
  await pipeline.webp({ quality, effort: 6 }).toFile(outputPath);
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

    await convertWithSharp(inputPath, tempOutputPath, { width: 640, height: 360, quality: 75 });
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
      await convertWithSharp(qrPng, qrWebp, { width: 380, height: 380, quality: 80 });
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
    if (file.includes("-400.")) continue;

    const baseName = path.basename(file, ext);
    const inputPath = path.join(sobreDir, file);
    const outputName = `${baseName}.webp`;
    const tempOutputPath = path.join(sobreDir, `${baseName}.temp.webp`);
    const finalOutputPath = path.join(sobreDir, outputName);

    const statBefore = await fs.stat(inputPath);

    await convertWithSharp(inputPath, tempOutputPath, { quality: 80 });
    const statAfter = await fs.stat(tempOutputPath);

    if (file !== outputName) {
      await fs.unlink(inputPath);
    }

    await fs.rename(tempOutputPath, finalOutputPath);

    console.log(
      `✓ ${file} (${(statBefore.size / 1024).toFixed(1)} KiB) -> ${outputName} (${(statAfter.size / 1024).toFixed(1)} KiB)`
    );

    if (["congregacao", "foto3", "comunidade"].includes(baseName)) {
      const resp400Path = path.join(sobreDir, `${baseName}-400.webp`);
      await convertWithSharp(finalOutputPath, resp400Path, { width: 400, height: 268, quality: 80 });
      console.log(`  ✓ Generated ${baseName}-400.webp`);
    }
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
