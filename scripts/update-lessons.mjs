import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SOURCES = {
  easy: {
    name: "Learning Easy English",
    feedUrl: "https://podcasts.files.bbci.co.uk/p0hsrwv5.rss",
    duration: 10
  },
  standard: {
    name: "6 Minute English",
    feedUrl: "https://podcasts.files.bbci.co.uk/p02pc9tn.rss",
    duration: 15
  }
};

const SOURCE_ORDER = ["easy", "standard"];
const DRY_RUN = process.argv.includes("--dry-run");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const LESSONS_PATH = path.join(ROOT_DIR, "data", "lessons.json");

function readTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim()) : "";
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function idFromDate(source, date) {
  return `${source}-${date.toISOString().slice(0, 10).replaceAll("-", "")}`;
}

function extractAudio(itemXml) {
  const enclosure = itemXml.match(/<enclosure[^>]+url="([^"]+)"/i);
  return enclosure?.[1] ?? "";
}

function extractSentences(content) {
  const sentences = content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.replace(/[.!?]$/, "").trim())
    .filter((sentence) => sentence.split(/\s+/).length >= 5);

  return sentences.length > 0 ? sentences.slice(0, 3) : [content.slice(0, 180)];
}

function buildLessonFromFeed(xml, source) {
  const item = xml.match(/<item\b[\s\S]*?<\/item>/i)?.[0];
  if (!item) {
    throw new Error(`No ${SOURCES[source].name} item found in RSS feed.`);
  }

  const title = readTag(item, "title") || SOURCES[source].name;
  const pubDate = new Date(readTag(item, "pubDate"));
  const date = Number.isNaN(pubDate.getTime()) ? new Date() : pubDate;
  const description =
    readTag(item, "itunes:summary") ||
    readTag(item, "description") ||
    `${SOURCES[source].name} lesson.`;
  const content = description.replace(/\s+/g, " ");

  return {
    id: idFromDate(source, date),
    slug: `${source}-${slugify(title)}`,
    source,
    title,
    date: date.toISOString().slice(0, 10),
    duration: SOURCES[source].duration,
    audio: extractAudio(item),
    content,
    sentences: extractSentences(content),
    vocabulary: []
  };
}

async function fetchLesson(source) {
  const response = await fetch(SOURCES[source].feedUrl, {
    headers: {
      "user-agent": "Candy English Daily/0.1"
    }
  });

  if (!response.ok) {
    throw new Error(`${SOURCES[source].name} feed request failed with ${response.status}.`);
  }

  return buildLessonFromFeed(await response.text(), source);
}

async function main() {
  const existing = JSON.parse(await fs.readFile(LESSONS_PATH, "utf8"));
  const latestLessons = await Promise.all(SOURCE_ORDER.map((source) => fetchLesson(source)));
  const latestIds = new Set(latestLessons.map((lesson) => lesson.id));
  const merged = [...latestLessons, ...existing.filter((lesson) => !latestIds.has(lesson.id))];
  const nextJson = `${JSON.stringify(merged, null, 2)}\n`;
  const currentJson = await fs.readFile(LESSONS_PATH, "utf8");

  for (const lesson of latestLessons) {
    console.log(`${lesson.source}: ${lesson.date} - ${lesson.title}`);
  }

  if (nextJson === currentJson) {
    console.log("No lesson changes found.");
    return;
  }

  if (DRY_RUN) {
    console.log("Dry run only. data/lessons.json was not changed.");
    return;
  }

  await fs.writeFile(LESSONS_PATH, nextJson, "utf8");
  console.log("Updated data/lessons.json.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
