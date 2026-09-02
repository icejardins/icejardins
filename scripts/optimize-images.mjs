import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const rootDir = process.cwd();
const postsDir = path.join(rootDir, "static", "images", "posts");
const sobreDir = path.join(rootDir, "static", "images", "sobre");
const contentPostsDir = path.join(rootDir, "content", "posts");

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

    await sharp(inputPath)
      .resize(800, 450, { fit: "cover" })
      .webp({ quality: 80, effort: 6 })
      .toFile(tempOutputPath);

    const statAfter = await fs.stat(tempOutputPath);

    // If input was jpg, remove old jpg file
    if (file !== outputName) {
      await fs.unlink(inputPath);
    }

    await fs.rename(tempOutputPath, finalOutputPath);

    console.log(
      `✓ ${file} (${(statBefore.size / 1024).toFixed(1)} KiB) -> ${outputName} (${(statAfter.size / 1024).toFixed(1)} KiB)`
    );
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

    // Keep aspect ratio with max width 1200
    await sharp(inputPath)
      .resize({ width: 1200, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(tempOutputPath);

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
  await optimizeSobre();
  await updateMarkdownFrontmatter();
  console.log("\nAll images optimized successfully!");
}

main().catch((err) => {
  console.error("Optimization failed:", err);
  process.exit(1);
});
