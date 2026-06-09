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
const HISTORY_MONTHS = 6;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const LESSONS_PATH = path.join(ROOT_DIR, "data", "lessons.json");
const POCKET_ENGLISH_PATH = path.join(ROOT_DIR, "data", "pocket-english.json");
const POCKET_ENGLISH_URL = "https://www.bbc.co.uk/learningenglish/chinese/features/take-away-english";

const VOCAB_TRANSLATIONS = {
  "old friend": "老朋友",
  "keep in touch": "保持联系",
  "stay in touch": "保持联系",
  "lose touch": "失去联系",
  "get back in touch": "重新取得联系",
  "stay friends": "继续做朋友",
  "named after": "以某人命名",
  common: "常见的",
  unusual: "不寻常的",
  nickname: "昵称",
  "open mic night": "开放麦之夜",
  "touch your soul": "触动心灵",
  jargon: "行话",
  impenetrable: "难以理解的",
  "turn-off": "令人失去兴趣的事物",
  "get goose bumps": "起鸡皮疙瘩",
  "can-do attitude": "积极进取的态度",
  "long-standing": "长期存在的",
  variation: "变化形式",
  convenience: "便利",
  alliteration: "头韵",
  assonance: "谐元音",
  simile: "明喻",
  poetry: "诗歌",
  poem: "诗",
  recite: "朗诵",
  emotion: "情绪",
  powerful: "有力量的",
  friendship: "友谊",
  conversation: "对话",
  worksheet: "练习表"
};

function readTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim()) : "";
}

function readRawTag(xml, tag) {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim() : "";
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

function decodeHtml(value) {
  return decodeXml(
    value
      .replace(/&nbsp;/g, " ")
      .replace(/&ndash;/g, "-")
      .replace(/&mdash;/g, "-")
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
  );
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

function idFromPocketUrl(url) {
  const episode = url.match(/ep-(\d+)/i)?.[1] ?? slugify(url);
  return `pocket-${episode}`;
}

function normalizeBbcUrl(url) {
  if (url.startsWith("//")) return `https:${url}`;
  if (url.startsWith("/")) return `https://www.bbc.co.uk${url}`;
  return url.replace(/^http:\/\//, "https://");
}

function extractAudio(itemXml) {
  const secure = itemXml.match(/<ppg:enclosureSecure[^>]+url="([^"]+)"/i);
  const enclosure = itemXml.match(/<enclosure[^>]+url="([^"]+)"/i);
  return (secure?.[1] ?? enclosure?.[1] ?? "").replace("http://", "https://").replace("/proto/http/", "/proto/https/");
}

function episodePathDate(date) {
  return date.toISOString().slice(2, 10).replaceAll("-", "");
}

function fallbackPageUrl(source, date) {
  const shortDate = episodePathDate(date);
  if (source === "easy") {
    return `https://www.bbc.co.uk/learningenglish/english/features/real-easy-english/${shortDate}`;
  }

  return `https://www.bbc.co.uk/learningenglish/english/features/6-minute-english_${date.getUTCFullYear()}/ep-${shortDate}`;
}

function extractPageUrl(itemXml, description, source, date) {
  const link = readTag(itemXml, "link");
  const urls = Array.from(description.matchAll(/https?:\/\/www\.bbc\.co\.uk\/learningenglish\/[^\s<"]+/gi)).map(
    ([url]) => url.replace(/[.,;!?)]+$/, "")
  );
  const episodeUrl =
    urls.find((url) => /\/features\/(?:real-easy-english|6-minute-english_\d{4})\/(?:ep-)?\d+/i.test(url)) ??
    urls.find((url) => !/\/(?:send|newsletters|easy_course|medium_course|hard_course)(?:\/|$)/i.test(url));

  return (episodeUrl ?? fallbackPageUrl(source, date) ?? link).replace(/^http:\/\//, "https://");
}

function extractSentences(content) {
  const sentences = content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.replace(/[.!?]$/, "").trim())
    .filter((sentence) => sentence.split(/\s+/).length >= 5);

  return sentences.length > 0 ? sentences.slice(0, 3) : [content.slice(0, 180)];
}

function stripTagsToLines(html) {
  return decodeHtml(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<\/h[1-6]>/gi, "\n\n")
      .replace(/<[^>]+>/g, "")
  )
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function extractSection(html, headingPattern, stopPattern) {
  const heading = html.match(headingPattern);
  if (!heading || heading.index === undefined) return "";
  const start = heading.index + heading[0].length;
  const rest = html.slice(start);
  const stop = rest.match(stopPattern);
  return stop && stop.index !== undefined ? rest.slice(0, stop.index) : rest;
}

function extractTranscript(html) {
  const section = extractSection(
    html,
    /<(?:h3|p)[^>]*>\s*(?:<strong[^>]*>)?\s*transcript\s*(?:<\/strong>)?\s*<\/(?:h3|p)>/i,
    /<(?:h2|h3|p)[^>]*>\s*(?:<strong[^>]*>)?\s*(?:download|vocabulary|more|quiz|worksheet|related|latest|did you know)\b/i
  );
  const transcript = stripTagsToLines(section)
    .replace(/^Note: This is not a word-for-word transcript\.\s*/i, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return transcript;
}

function extractVocabulary(html, transcript) {
  const section = extractSection(
    html,
    /<h3[^>]*>\s*(?:<strong[^>]*>)?\s*vocabulary\s*(?:<\/strong>)?\s*<\/h3>/i,
    /<(?:h2|h3|p)[^>]*>\s*(?:<strong[^>]*>)?\s*(?:transcript|download|try our|quiz|worksheet|more)\b/i
  );

  const items = [];
  const strongPattern = /<strong[^>]*>([\s\S]*?)<\/strong>\s*<br\s*\/?>\s*([\s\S]*?)(?=<br\s*\/?>\s*(?:&nbsp;)?\s*<br\s*\/?>\s*<strong|<strong[^>]*>|<\/p>|<h[1-6]|$)/gi;
  let match;

  while ((match = strongPattern.exec(section)) && items.length < 8) {
    const word = stripTagsToLines(match[1]).replace(/\s+/g, " ").trim();
    const definition = stripTagsToLines(match[2]).replace(/\s+/g, " ").trim();
    if (!word || !definition || word.length > 48) continue;

    items.push({
      word,
      meaning: VOCAB_TRANSLATIONS[word.toLowerCase()] ?? definition,
      phonetic: "",
      example: buildExample(word, transcript)
    });
  }

  return fillVocabularyFromTranscript(items, transcript);
}

function extractWorksheet(html) {
  const worksheetLink =
    html.match(/href="([^"]+worksheet[^"]+\.pdf)"/i)?.[1] ??
    html.match(/href="([^"]+_worksheet_?\.pdf)"/i)?.[1];

  if (!worksheetLink) return "";

  if (worksheetLink.startsWith("//")) {
    return `https:${worksheetLink}`;
  }

  if (worksheetLink.startsWith("/")) {
    return `https://www.bbc.co.uk${worksheetLink}`;
  }

  return worksheetLink.replace(/^http:\/\//, "https://");
}

function fillVocabularyFromTranscript(items, transcript) {
  const existing = new Set(items.map((item) => item.word.toLowerCase()));
  const lowerTranscript = transcript.toLowerCase();

  for (const [word, meaning] of Object.entries(VOCAB_TRANSLATIONS)) {
    if (items.length >= 8) break;
    if (existing.has(word)) continue;
    if (!lowerTranscript.includes(word)) continue;

    items.push({
      word,
      meaning,
      phonetic: "",
      example: buildExample(word, transcript)
    });
    existing.add(word);
  }

  return items;
}

function buildExample(word, transcript) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const sentence = transcript
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .find((item) => new RegExp(`\\b${escaped}\\b`, "i").test(item));

  if (sentence) return sentence.slice(0, 180);

  return `BBC presenters use "${word}" in this episode.`;
}

async function fetchPageData(pageUrl) {
  if (!pageUrl) {
    return { transcript: "", vocabulary: [] };
  }

  const response = await fetch(pageUrl, {
    headers: {
      "user-agent": "Candy English Daily/0.1"
    }
  });

  if (!response.ok) {
    return { transcript: "", vocabulary: [] };
  }

  const html = await response.text();
  const transcript = extractTranscript(html);

  return {
    transcript,
    vocabulary: extractVocabulary(html, transcript),
    worksheet: extractWorksheet(html),
    pageUrl
  };
}

async function buildLessonFromItem(item, source) {
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
  const rawDescription = readRawTag(item, "itunes:summary") || readRawTag(item, "description");
  const content = description.replace(/\s+/g, " ");
  const pageUrl = extractPageUrl(item, rawDescription || description, source, date);
  const pageData = await fetchPageData(pageUrl);
  const transcript = pageData.transcript || content;

  return {
    id: idFromDate(source, date),
    slug: `${source}-${slugify(title)}`,
    source,
    title,
    date: date.toISOString().slice(0, 10),
    duration: SOURCES[source].duration,
    audio: extractAudio(item),
    content,
    transcript,
    pageUrl,
    worksheet: pageData.worksheet || undefined,
    sentences: extractSentences(transcript),
    vocabulary: pageData.vocabulary
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

  const xml = await response.text();
  const cutoff = new Date();
  cutoff.setMonth(cutoff.getMonth() - HISTORY_MONTHS);

  const items = xml.match(/<item\b[\s\S]*?<\/item>/gi) ?? [];
  const recentItems = items.filter((item) => {
    const pubDate = new Date(readTag(item, "pubDate"));
    return !Number.isNaN(pubDate.getTime()) && pubDate >= cutoff;
  });

  const targetItems = recentItems.length > 0 ? recentItems : items.slice(0, 1);
  const lessons = await Promise.all(targetItems.map((item) => buildLessonFromItem(item, source)));

  return lessons.sort((a, b) => b.date.localeCompare(a.date));
}

function parsePocketDate(value) {
  const date = new Date(`${value} UTC`);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}

function parsePocketDateFromUrl(url) {
  const episodeDate = url.match(/ep-(\d{2})(\d{2})(\d{2})/i);
  if (!episodeDate) return "";

  const [, year, month, day] = episodeDate;
  return `20${year}-${month}-${day}`;
}

function extractPocketEnglishItems(html) {
  const items = [];
  const seen = new Set();
  const linkPattern =
    /<a[^>]+href="([^"]*\/learningenglish\/chinese\/features\/take-away-english\/ep-\d+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkPattern.exec(html)) && items.length < 12) {
    const url = normalizeBbcUrl(match[1]);
    if (seen.has(url)) continue;

    const title = stripTagsToLines(match[2]).replace(/\s+/g, " ").trim();
    if (!title || title.length < 6) continue;

    const after = stripTagsToLines(html.slice(match.index, match.index + 1600))
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const episodeLine = after.find((line) => /^Episode\s+\d+\s+\//i.test(line));
    const dateText = episodeLine?.match(/\/\s*(.+)$/)?.[1]?.trim() ?? "";
    const summary =
      after.find((line) => line !== title && !/^Episode\s+\d+\s+\//i.test(line) && line !== "已完成") ?? "";
    const date = parsePocketDate(dateText) || parsePocketDateFromUrl(url);

    seen.add(url);
    items.push({
      id: idFromPocketUrl(url),
      title,
      date,
      summary,
      url
    });
  }

  return items;
}

async function fetchPocketEnglish() {
  const response = await fetch(POCKET_ENGLISH_URL, {
    headers: {
      "user-agent": "Candy English Daily/0.1"
    }
  });

  if (!response.ok) {
    throw new Error(`Pocket English request failed with ${response.status}.`);
  }

  return extractPocketEnglishItems(await response.text());
}

async function main() {
  const existing = JSON.parse(await fs.readFile(LESSONS_PATH, "utf8"));
  const latestLessons = (await Promise.all(SOURCE_ORDER.map((source) => fetchLesson(source)))).flat();
  const pocketEnglish = await fetchPocketEnglish();
  const latestIds = new Set(latestLessons.map((lesson) => lesson.id));
  const merged = [...latestLessons, ...existing.filter((lesson) => !latestIds.has(lesson.id))];
  const nextJson = `${JSON.stringify(merged, null, 2)}\n`;
  const currentJson = await fs.readFile(LESSONS_PATH, "utf8");
  const nextPocketJson = `${JSON.stringify(pocketEnglish, null, 2)}\n`;
  const currentPocketJson = await fs.readFile(POCKET_ENGLISH_PATH, "utf8").catch(() => "");

  for (const lesson of latestLessons) {
    console.log(`${lesson.source}: ${lesson.date} - ${lesson.title}`);
  }

  for (const item of pocketEnglish.slice(0, 5)) {
    console.log(`pocket: ${item.date} - ${item.title}`);
  }

  if (nextJson === currentJson && nextPocketJson === currentPocketJson) {
    console.log("No lesson changes found.");
    return;
  }

  if (DRY_RUN) {
    console.log("Dry run only. data/lessons.json and data/pocket-english.json were not changed.");
    return;
  }

  await fs.writeFile(LESSONS_PATH, nextJson, "utf8");
  await fs.writeFile(POCKET_ENGLISH_PATH, nextPocketJson, "utf8");
  console.log("Updated data/lessons.json.");
  console.log("Updated data/pocket-english.json.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
