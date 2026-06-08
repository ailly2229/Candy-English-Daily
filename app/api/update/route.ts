import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { Lesson } from "@/lib/lessons";
import { LESSON_SOURCES, SOURCE_ORDER, type LessonSource } from "@/lib/sources";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function readTag(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? decodeXml(match[1].replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "").trim()) : "";
}

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<[^>]+>/g, "")
    .trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

function idFromDate(source: LessonSource, date: Date): string {
  return `${source}-${date.toISOString().slice(0, 10).replaceAll("-", "")}`;
}

function extractAudio(itemXml: string): string {
  const enclosure = itemXml.match(/<enclosure[^>]+url="([^"]+)"/i);
  return enclosure?.[1] ?? "";
}

function extractSentences(content: string): string[] {
  const sentences = content
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.replace(/[.!?]$/, "").trim())
    .filter((sentence) => sentence.split(/\s+/).length >= 5);

  return sentences.length > 0 ? sentences.slice(0, 3) : [content.slice(0, 180)];
}

function buildLessonFromFeed(xml: string, source: LessonSource): Lesson {
  const item = xml.match(/<item\b[\s\S]*?<\/item>/i)?.[0];
  if (!item) {
    throw new Error(`No BBC ${LESSON_SOURCES[source].name} item found in RSS feed.`);
  }

  const title = readTag(item, "title") || LESSON_SOURCES[source].name;
  const pubDate = new Date(readTag(item, "pubDate"));
  const date = Number.isNaN(pubDate.getTime()) ? new Date() : pubDate;
  const description =
    readTag(item, "itunes:summary") ||
    readTag(item, "description") ||
    `${LESSON_SOURCES[source].name} lesson.`;
  const content = description.replace(/\s+/g, " ");

  return {
    id: idFromDate(source, date),
    slug: `${source}-${slugify(title)}`,
    source,
    title,
    date: date.toISOString().slice(0, 10),
    duration: source === "easy" ? 10 : 15,
    audio: extractAudio(item),
    content,
    sentences: extractSentences(content),
    vocabulary: []
  };
}

async function fetchLesson(source: LessonSource): Promise<Lesson> {
  const response = await fetch(LESSON_SOURCES[source].feedUrl, {
    next: { revalidate: 0 },
    headers: {
      "user-agent": "Candy English Daily/0.1"
    }
  });

  if (!response.ok) {
    throw new Error(`${LESSON_SOURCES[source].name} feed request failed with ${response.status}.`);
  }

  return buildLessonFromFeed(await response.text(), source);
}

async function persistLessons(newLessons: Lesson[]) {
  const filePath = path.join(process.cwd(), "data", "lessons.json");
  const existing = JSON.parse(await fs.readFile(filePath, "utf8")) as Lesson[];
  const ids = new Set(newLessons.map((lesson) => lesson.id));
  const merged = [...newLessons, ...existing.filter((item) => !ids.has(item.id))];
  await fs.writeFile(filePath, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
}

export async function GET(request: NextRequest) {
  try {
    const dryRun = request.nextUrl.searchParams.get("dryRun") === "1";
    const lessons = await Promise.all(SOURCE_ORDER.map((source) => fetchLesson(source)));
    let persisted = !dryRun;

    if (!dryRun) {
      try {
        await persistLessons(lessons);
      } catch {
        persisted = false;
      }
    }

    return NextResponse.json({
      ok: true,
      dryRun,
      sources: SOURCE_ORDER.map((source) => ({
        id: source,
        name: LESSON_SOURCES[source].name,
        feedUrl: LESSON_SOURCES[source].feedUrl
      })),
      persisted,
      lessons
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : "BBC feed request failed."
      },
      { status: 502 }
    );
  }
}
