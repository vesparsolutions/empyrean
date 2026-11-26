import fs from 'node:fs';
import path from 'node:path';
import QRCode from 'qrcode';
import sharp from 'sharp';
import { jsPDF } from 'jspdf';

export type ServerTicketPassTable =
  | 'early_birds'
  | 'all_access'
  | 'buy_four_get_one'
  | 'couple'
  | 'day_1'
  | 'day_2'
  | 'day_3';

const TEMPLATE_FILENAME_BY_TABLE: Record<ServerTicketPassTable, string> = {
  early_birds: 'Alldays.png',
  all_access: 'Alldays.png',
  buy_four_get_one: 'B4G1.png',
  couple: 'Couple.png',
  day_1: 'Day1.png',
  day_2: 'Day2.png',
  day_3: 'Day3.png',
};

function isInFinderPattern(row: number, col: number, count: number): boolean {
  const inTopLeft = row < 7 && col < 7;
  const inTopRight = row < 7 && col >= count - 7;
  const inBottomLeft = row >= count - 7 && col < 7;
  return inTopLeft || inTopRight || inBottomLeft;
}

function buildBrandedQrSvg(token: string, logoDataUri: string): string {
  const qr = QRCode.create(token, { errorCorrectionLevel: 'H' });
  const count = qr.modules.size;
  const data = qr.modules.data;

  const size = 600;
  const margin = 22;
  const cell = (size - margin * 2) / count;

  // Clear center logo zone (~21% of QR width + quiet margin) matching AdminPage QRCodeStyling
  const logoSize = Math.round(size * 0.21);
  const logoMargin = 6;
  const clearHalf = logoSize / 2 + logoMargin;
  const center = size / 2;

  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `<rect width="${size}" height="${size}" fill="#ffffff"/>`,
  ];

  // Draw rounded data modules (skipping finder patterns and center logo zone)
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (isInFinderPattern(r, c, count)) continue;
      if (!data[r * count + c]) continue;

      const x = margin + c * cell;
      const y = margin + r * cell;
      const cx = x + cell / 2;
      const cy = y + cell / 2;
      if (Math.abs(cx - center) < clearHalf && Math.abs(cy - center) < clearHalf) {
        continue;
      }

      const radius = (cell * 0.36).toFixed(2);
      parts.push(
        `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${(cell * 0.92).toFixed(2)}" height="${(cell * 0.92).toFixed(2)}" rx="${radius}" ry="${radius}" fill="#0b1839"/>`
      );
    }
  }

  // Draw the 3 extra-rounded finder squares (#0b1839) + gold center dots (#b48a3e)
  const finderPositions = [
    { r: 0, c: 0 },
    { r: 0, c: count - 7 },
    { r: count - 7, c: 0 },
  ];
  for (const pos of finderPositions) {
    const fx = margin + pos.c * cell;
    const fy = margin + pos.r * cell;
    const outerSize = 7 * cell;
    const innerHole = 5 * cell;
    const dotSize = 3 * cell;

    parts.push(
      `<rect x="${fx.toFixed(2)}" y="${fy.toFixed(2)}" width="${outerSize.toFixed(2)}" height="${outerSize.toFixed(2)}" rx="${(cell * 1.6).toFixed(2)}" fill="#0b1839"/>`,
      `<rect x="${(fx + cell).toFixed(2)}" y="${(fy + cell).toFixed(2)}" width="${innerHole.toFixed(2)}" height="${innerHole.toFixed(2)}" rx="${(cell * 1.1).toFixed(2)}" fill="#ffffff"/>`,
      `<circle cx="${(fx + outerSize / 2).toFixed(2)}" cy="${(fy + outerSize / 2).toFixed(2)}" r="${(dotSize / 2).toFixed(2)}" fill="#b48a3e"/>`
    );
  }

  // Center Vespar emblem
  const lx = center - logoSize / 2;
  const ly = center - logoSize / 2;
  parts.push(
    `<image href="${logoDataUri}" x="${lx.toFixed(2)}" y="${ly.toFixed(2)}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet"/>`,
    `</svg>`
  );

  return parts.join('');
}

/**
 * Generates the exact Empyrean 2026 landscape PDF ticket buffer on the server,
 * matching the template artwork, (1739, 408) stub QR placement, and jsPDF layout.
 */
export async function generateTicketPdfBuffer(params: {
  token: string;
  passTable: ServerTicketPassTable;
}): Promise<Buffer> {
  const publicDir = path.join(process.cwd(), 'public');
  const templateFile = TEMPLATE_FILENAME_BY_TABLE[params.passTable] || 'Alldays.png';
  const templatePath = path.join(publicDir, 'ticket-templates', templateFile);
  const logoPath = path.join(publicDir, 'vespar-qr.png');

  const [templateBuffer, logoBuffer] = await Promise.all([
    fs.promises.readFile(templatePath),
    fs.promises.readFile(logoPath),
  ]);

  const logoDataUri = `data:image/png;base64,${logoBuffer.toString('base64')}`;
  const qrSvg = buildBrandedQrSvg(params.token, logoDataUri);
  const qrPngBuffer = await sharp(Buffer.from(qrSvg)).png().toBuffer();

  const meta = await sharp(templateBuffer).metadata();
  const ticketWidth = meta.width || 1920;
  const ticketHeight = meta.height || 819;

  // Match AdminPage.tsx exact stub coordinates:
  // Measured stub interior: X=1600..1878 (centerX=1739), clear Y=247..569 (centerY=408)
  const qrSize = Math.round(ticketWidth * (240 / 1920));
  const qrX = Math.round(ticketWidth * (1739 / 1920) - qrSize / 2);
  const qrY = Math.round(ticketHeight * (408 / 819) - qrSize / 2);
  const cardRadius = Math.round(qrSize * 0.065);

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [ticketWidth, ticketHeight],
    hotfixes: ['px_scaling'],
  });

  pdf.addImage(new Uint8Array(templateBuffer), 'PNG', 0, 0, ticketWidth, ticketHeight);
  pdf.setFillColor(255, 255, 255);
  pdf.roundedRect(qrX, qrY, qrSize, qrSize, cardRadius, cardRadius, 'F');
  pdf.addImage(new Uint8Array(qrPngBuffer), 'PNG', qrX + 4, qrY + 4, qrSize - 8, qrSize - 8);

  return Buffer.from(pdf.output('arraybuffer'));
}
