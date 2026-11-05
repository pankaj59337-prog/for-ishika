/**
 * Greeting Card Exporter
 * Generates an ultra-high-resolution luxury printable/sharable birthday card using Canvas API
 * Supports embedding Ishika's real photo if available!
 */

import { CONFIG } from "../config.js";

export class GreetingExporter {
  static async exportCard() {
    const canvas = document.getElementById("export-canvas");
    if (!canvas) return;

    const width = 1200;
    const height = 1600;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // 1. Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, "#130824");
    bgGrad.addColorStop(0.5, "#291036");
    bgGrad.addColorStop(1, "#18092B");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Cosmic stars & golden sparkles on canvas
    for (let i = 0; i < 220; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const r = Math.random() * 2.8 + 0.6;
      const alpha = Math.random() * 0.85 + 0.15;
      ctx.fillStyle = `rgba(244, 213, 141, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Ornate Double Gold Borders
    ctx.strokeStyle = "#F4D58D";
    ctx.lineWidth = 4;
    ctx.strokeRect(55, 55, width - 110, height - 110);

    ctx.strokeStyle = "rgba(244, 213, 141, 0.4)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(75, 75, width - 150, height - 150);

    // 4. Corner Ornaments
    const drawCorner = (cx, cy, rot) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.strokeStyle = "#F4D58D";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(0, 0);
      ctx.lineTo(40, 0);
      ctx.stroke();

      ctx.fillStyle = "#F8BBD9";
      ctx.font = "24px serif";
      ctx.fillText("✦", 8, 28);
      ctx.restore();
    };

    drawCorner(95, 95, 0);
    drawCorner(width - 95, 95, Math.PI / 2);
    drawCorner(width - 95, height - 95, Math.PI);
    drawCorner(95, height - 95, -Math.PI / 2);

    // 5. Crown / Star Header
    ctx.textAlign = "center";
    ctx.fillStyle = "#F4D58D";
    ctx.font = "bold 32px Outfit, sans-serif";
    ctx.fillText("✦ A SPECIAL BIRTHDAY WISH ✦", width / 2, 180);

    // 6. "HAPPY BIRTHDAY"
    ctx.fillStyle = "#BE9BFF";
    ctx.font = "bold 50px Outfit, sans-serif";
    ctx.fillText("HAPPY BIRTHDAY", width / 2, 270);

    // 7. "ISHIKA" with luxury drop shadow
    ctx.save();
    ctx.shadowColor = "rgba(244, 213, 141, 0.85)";
    ctx.shadowBlur = 30;
    const nameGrad = ctx.createLinearGradient(0, 310, 0, 450);
    nameGrad.addColorStop(0, "#FFFDF8");
    nameGrad.addColorStop(0.5, "#F4D58D");
    nameGrad.addColorStop(1, "#F8BBD9");
    ctx.fillStyle = nameGrad;
    ctx.font = "900 120px 'Cinzel Decorative', 'Playfair Display', serif";
    ctx.fillText(CONFIG.birthdayPersonName.toUpperCase(), width / 2, 410);
    ctx.restore();

    // 8. Check if there is an uploaded or configured photo
    let photoImg = null;
    let savedPhotos = null;
    try {
      savedPhotos = JSON.parse(localStorage.getItem("ishika_birthday_photos"));
    } catch (e) {}

    const firstPhotoUrl =
      (CONFIG.photoAssets && CONFIG.photoAssets[0] && CONFIG.photoAssets[0].url) ||
      (savedPhotos && savedPhotos[0] && savedPhotos[0].url);

    if (firstPhotoUrl) {
      photoImg = await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = firstPhotoUrl;
      });
    }

    let startTextY = 560;

    // If photo exists, render it in a luxury golden framed circular / rounded badge
    if (photoImg) {
      const photoSize = 340;
      const photoX = (width - photoSize) / 2;
      const photoY = 470;

      ctx.save();
      // Golden outer halo
      ctx.strokeStyle = "#F4D58D";
      ctx.lineWidth = 6;
      ctx.shadowColor = "rgba(244, 213, 141, 0.9)";
      ctx.shadowBlur = 25;
      ctx.beginPath();
      ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2 + 6, 0, Math.PI * 2);
      ctx.stroke();

      // Clip image to circle
      ctx.beginPath();
      ctx.arc(width / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(photoImg, photoX, photoY, photoSize, photoSize);
      ctx.restore();

      startTextY = 880;
    } else {
      // Decorative divider flourish
      ctx.strokeStyle = "#F4D58D";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 180, 460);
      ctx.lineTo(width / 2 + 180, 460);
      ctx.stroke();

      ctx.fillStyle = "#FFF8F0";
      ctx.font = "24px serif";
      ctx.fillText("✨", width / 2, 468);
      startTextY = 560;
    }

    // 9. Heartfelt Message Body
    ctx.fillStyle = "#FFF8F0";
    ctx.font = "italic 30px 'Cormorant Garamond', Georgia, serif";

    const lines = [
      "Some days are special simply because of the people they celebrate.",
      "",
      "May this new year of your life bring endless happiness,",
      "unforgettable adventures, peaceful moments,",
      "and dreams that turn into reality.",
      "",
      "May every new sunrise bring another reason to smile.",
      "",
      "Keep shining, keep growing, and keep creating beautiful memories."
    ];

    let currentY = startTextY;
    lines.forEach((line) => {
      ctx.fillText(line, width / 2, currentY);
      currentY += 44;
    });

    // 10. Golden Highlight Callout
    ctx.fillStyle = "#F8BBD9";
    ctx.font = "bold italic 36px 'Cormorant Garamond', Georgia, serif";
    ctx.fillText('"The world became a little brighter the day you arrived."', width / 2, currentY + 45);

    // 11. Footer Signature
    ctx.fillStyle = "#F4D58D";
    ctx.font = "bold 30px 'Cinzel Decorative', serif";
    ctx.fillText(`Happy Birthday, ${CONFIG.birthdayPersonName}! ✨`, width / 2, height - 120);

    // 12. Trigger file download
    const link = document.createElement("a");
    link.download = `${CONFIG.birthdayPersonName}-Birthday-Universe-Wish.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
