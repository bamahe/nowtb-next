// Small photo credit line — shows attribution for Wikimedia Commons and other credited images
import fs from "fs";
import path from "path";

// Load credits map at build time
let creditsMap: Record<string, string> = {};
try {
  const creditsPath = path.join(process.cwd(), "public/images/blog/credits.json");
  if (fs.existsSync(creditsPath)) {
    creditsMap = JSON.parse(fs.readFileSync(creditsPath, "utf-8"));
  }
} catch {
  // No credits file — that's fine
}

interface PhotoCreditProps {
  /** Image src path, e.g. "/images/blog/best-realtor-plant-city.jpg" */
  src: string;
}

export default function PhotoCredit({ src }: PhotoCreditProps) {
  // Extract filename from path
  const filename = src.split("/").pop() || "";
  const credit = creditsMap[filename];

  if (!credit) return null;

  return (
    <p className="font-body text-[10px] text-muted/50 mt-1 text-right">
      {credit}
    </p>
  );
}
