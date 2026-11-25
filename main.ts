// Entry program for the X quote-post bounty.
//
// The scored work is the public X post named by POST.json. This program only
// hands that file to the grader: it reads POST.json from the repository root,
// checks that it names an X status URL, and writes the same bytes to the
// output directory. Keeping the original bytes means the grader reads exactly
// the post address the repository declares. The program uses no network,
// clock, or files outside the repository.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const sourceDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const sourcePath = join(sourceDir, 'POST.json');
const outputPath = join(outputDir, 'POST.json');

let raw;
try {
  raw = readFileSync(sourcePath, 'utf8');
} catch (err) {
  console.error(`POST.json could not be read from ${sourceDir}: ${err.message}`);
  process.exit(1);
}

let parsed;
try {
  parsed = JSON.parse(raw);
} catch (err) {
  console.error(`POST.json is not valid JSON: ${err.message}`);
  process.exit(1);
}

const postUrl = parsed?.url;
const statusPattern = /^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/\d+$/;
if (typeof postUrl !== 'string' || !statusPattern.test(postUrl)) {
  console.error('POST.json must name an X status URL');
  process.exit(1);
}

mkdirSync(outputDir, { recursive: true });
writeFileSync(outputPath, raw);
