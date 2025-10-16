
import {createRequire as ___nfyCreateRequire} from "module";
import {fileURLToPath as ___nfyFileURLToPath} from "url";
import {dirname as ___nfyPathDirname} from "path";
let __filename=___nfyFileURLToPath(import.meta.url);
let __dirname=___nfyPathDirname(___nfyFileURLToPath(import.meta.url));
let require=___nfyCreateRequire(import.meta.url);


// netlify/functions/export-pdf.ts
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
var export_pdf_default = async (_req, _ctx) => {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const draw = (txt, x, y, size = 12) => page.drawText(txt, { x, y, size, font, color: rgb(0, 0, 0) });
  draw("Candidate Experience Intelligence", 48, 740, 18);
  draw("Team: Engineering", 48, 712);
  draw("CXI: 78", 48, 692);
  draw("Top Negatives: Speed, Communication", 48, 672);
  const bytes = await pdf.save();
  return new Response(bytes, { headers: { "Content-Type": "application/pdf", "Content-Disposition": "inline; filename=report.pdf" } });
};
export {
  export_pdf_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsibmV0bGlmeS9mdW5jdGlvbnMvZXhwb3J0LXBkZi50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiaW1wb3J0IHR5cGUgeyBIYW5kbGVyQ29udGV4dCB9IGZyb20gXCJAbmV0bGlmeS9mdW5jdGlvbnNcIjtcbmltcG9ydCB7IFBERkRvY3VtZW50LCBTdGFuZGFyZEZvbnRzLCByZ2IgfSBmcm9tIFwicGRmLWxpYlwiO1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyAoX3JlcTogUmVxdWVzdCwgX2N0eDogSGFuZGxlckNvbnRleHQpID0+IHtcbiAgY29uc3QgcGRmID0gYXdhaXQgUERGRG9jdW1lbnQuY3JlYXRlKCk7XG4gIGNvbnN0IHBhZ2UgPSBwZGYuYWRkUGFnZShbNjEyLCA3OTJdKTsgLy8gTGV0dGVyXG4gIGNvbnN0IGZvbnQgPSBhd2FpdCBwZGYuZW1iZWRGb250KFN0YW5kYXJkRm9udHMuSGVsdmV0aWNhKTtcbiAgY29uc3QgZHJhdyA9ICh0eHQ6IHN0cmluZywgeDogbnVtYmVyLCB5OiBudW1iZXIsIHNpemU9MTIpID0+IHBhZ2UuZHJhd1RleHQodHh0LCB7IHgsIHksIHNpemUsIGZvbnQsIGNvbG9yOiByZ2IoMCwwLDApIH0pO1xuICBkcmF3KFwiQ2FuZGlkYXRlIEV4cGVyaWVuY2UgSW50ZWxsaWdlbmNlXCIsIDQ4LCA3NDAsIDE4KTtcbiAgZHJhdyhcIlRlYW06IEVuZ2luZWVyaW5nXCIsIDQ4LCA3MTIpO1xuICBkcmF3KFwiQ1hJOiA3OFwiLCA0OCwgNjkyKTtcbiAgZHJhdyhcIlRvcCBOZWdhdGl2ZXM6IFNwZWVkLCBDb21tdW5pY2F0aW9uXCIsIDQ4LCA2NzIpO1xuICBjb25zdCBieXRlcyA9IGF3YWl0IHBkZi5zYXZlKCk7XG4gIHJldHVybiBuZXcgUmVzcG9uc2UoYnl0ZXMsIHsgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL3BkZlwiLCBcIkNvbnRlbnQtRGlzcG9zaXRpb25cIjogXCJpbmxpbmU7IGZpbGVuYW1lPXJlcG9ydC5wZGZcIiB9IH0pO1xufTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7QUFDQSxTQUFTLGFBQWEsZUFBZSxXQUFXO0FBRWhELElBQU8scUJBQVEsT0FBTyxNQUFlLFNBQXlCO0FBQzVELFFBQU0sTUFBTSxNQUFNLFlBQVksT0FBTztBQUNyQyxRQUFNLE9BQU8sSUFBSSxRQUFRLENBQUMsS0FBSyxHQUFHLENBQUM7QUFDbkMsUUFBTSxPQUFPLE1BQU0sSUFBSSxVQUFVLGNBQWMsU0FBUztBQUN4RCxRQUFNLE9BQU8sQ0FBQyxLQUFhLEdBQVcsR0FBVyxPQUFLLE9BQU8sS0FBSyxTQUFTLEtBQUssRUFBRSxHQUFHLEdBQUcsTUFBTSxNQUFNLE9BQU8sSUFBSSxHQUFFLEdBQUUsQ0FBQyxFQUFFLENBQUM7QUFDdkgsT0FBSyxxQ0FBcUMsSUFBSSxLQUFLLEVBQUU7QUFDckQsT0FBSyxxQkFBcUIsSUFBSSxHQUFHO0FBQ2pDLE9BQUssV0FBVyxJQUFJLEdBQUc7QUFDdkIsT0FBSyx1Q0FBdUMsSUFBSSxHQUFHO0FBQ25ELFFBQU0sUUFBUSxNQUFNLElBQUksS0FBSztBQUM3QixTQUFPLElBQUksU0FBUyxPQUFPLEVBQUUsU0FBUyxFQUFFLGdCQUFnQixtQkFBbUIsdUJBQXVCLDhCQUE4QixFQUFFLENBQUM7QUFDckk7IiwKICAibmFtZXMiOiBbXQp9Cg==
