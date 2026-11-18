const { copyFile, mkdir, readFile } = require('node:fs/promises');
const { join } = require('node:path');

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const source = join(__dirname, 'entry.png');
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const destination = join(outputDir, 'entry.png');

async function main() {
  const image = await readFile(source);
  if (!image.subarray(0, pngSignature.length).equals(pngSignature)) {
    throw new Error('entry.png does not have a valid PNG signature');
  }

  await mkdir(outputDir, { recursive: true });
  await copyFile(source, destination);
  console.log(`Copied PNG to ${destination}`);
}

main().catch((error) => {
  console.error(`Could not write ${destination}: ${error.message}`);
  process.exitCode = 1;
});
