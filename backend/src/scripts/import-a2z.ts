import fs from "fs";
import mongoose from "mongoose";

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/dsa-agent";

const file = fs.readFileSync(
  "src/scripts/strivers-a2z-sheet-learn-dsa-a-to-z.html",
  "utf8"
);

const A2ZSchema = new mongoose.Schema(
  {
    problemId: Number,
    problemName: String,
    category: String,
    subcategory: String,
    difficulty: String,
    article: String, 
    youtube: String,
    leetcode: String,
  },
  { timestamps: true }
);

const A2Z = mongoose.model("A2Z", A2ZSchema);

function decodeNextFlightChunks(html: string): string {
  const marker = "self.__next_f.push([1, \"";
  let cursor = 0;
  let combined = "";

  while (true) {
    const start = html.indexOf(marker, cursor);
    if (start === -1) break;

    const contentStart = start + marker.length;
    const contentEnd = html.indexOf('"])', contentStart);
    if (contentEnd === -1) break;

    const rawChunk = html.slice(contentStart, contentEnd);

    try {
      // The payload is a JSON-like escaped JS string fragment.
      const decoded = JSON.parse(`"${rawChunk.replace(/\n/g, "\\n")}"`);
      combined += decoded;
    } catch {
      // Ignore malformed chunks; enough valid chunks still contain sections.
    }

    cursor = contentEnd + 3;
  }

  return combined;
}

function extractBalancedArray(input: string, startIndex: number): string {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = startIndex; i < input.length; i++) {
    const ch = input[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "[") {
      depth++;
      continue;
    }

    if (ch === "]") {
      depth--;
      if (depth === 0) {
        return input.slice(startIndex, i + 1);
      }
    }
  }

  throw new Error("Could not extract balanced sections array");
}

function cleanValue(value?: string): string {
  if (!value || value === "$undefined") return "";
  return value;
}

function normalizeLeetcodeUrl(url?: string): string {
  const clean = cleanValue(url);
  if (!clean) return "";

  const match = clean.match(/^https?:\/\/leetcode\.com\/problems\/[^/?#]+\/?/i);
  return match?.[0] ?? clean;
}

function normalizeAnyUrl(url?: string): string {
  const clean = cleanValue(url);
  if (!clean) return "";

  if (/^https?:\/\//i.test(clean)) return clean;
  if (clean.startsWith("/")) return `https://takeuforward.org${clean}`;
  return "";
}

function resolveBestProblemLink(problem: any): string {
  const leetcode = normalizeLeetcodeUrl(problem.leetcode);
  if (leetcode) return leetcode;

  const fallbackCandidates = [
    problem.plus
  ];

  for (const candidate of fallbackCandidates) {
    const normalized = normalizeAnyUrl(candidate);
    if (normalized) return normalized;
  }

  return "";
}

async function run() {
  console.log("Parsing A2Z file...");

  const decoded = decodeNextFlightChunks(file);
  const sectionsKey = '"sections":[';
  const sectionsIndex = decoded.indexOf(sectionsKey);
  if (sectionsIndex === -1) throw new Error("Sections not found in flight data");

  const arrayStart = sectionsIndex + sectionsKey.length - 1;
  const sectionsJson = extractBalancedArray(decoded, arrayStart);
  const sections = JSON.parse(sectionsJson);

  let count = 0;
  const ops: Array<any> = [];

  for (const section of sections) {
    const category = section.category_name;

    for (const sub of section.subcategories) {
      const subcategory = sub.subcategory_name;

      for (const problem of sub.problems) {
        ops.push({
          updateOne: {
            filter: { problemId: problem.problem_id },
            update: {
              problemId: problem.problem_id,
              problemName: cleanValue(problem.problem_name),
              category: cleanValue(category),
              subcategory: cleanValue(subcategory),
              difficulty: cleanValue(problem.difficulty),
              article: cleanValue(problem.article),
              youtube: cleanValue(problem.youtube),
              leetcode: resolveBestProblemLink(problem),
            },
            upsert: true,
          },
        });

        count++;
      }
    }
  }

  if (ops.length > 0) {
    await A2Z.bulkWrite(ops, { ordered: false });
  }

  console.log("Imported:", count, "problems");

  await mongoose.disconnect();
  process.exit(0);
}

async function main() {
  await mongoose.connect(MONGO_URI);
  await run();
}

main();