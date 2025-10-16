import type { HandlerContext } from "@netlify/functions";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export default async (_req: Request, _ctx: HandlerContext) => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]); // Letter
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const draw = (txt: string, x: number, y: number, size=12) => page.drawText(txt, { x, y, size, font, color: rgb(0,0,0) });
  draw("Candidate Experience Intelligence", 48, 740, 18);
  draw("Team: Engineering", 48, 712);
  draw("CXI: 78", 48, 692);
  draw("Top Negatives: Speed, Communication", 48, 672);
  const bytes = await pdf.save();
  return new Response(bytes, { headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline; filename=report.pdf" } });
};
