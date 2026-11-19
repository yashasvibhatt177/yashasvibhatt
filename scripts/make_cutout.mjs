import { execSync } from 'child_process';

const points = [
  // Crown
  [430, 415], [455, 412], [475, 420],
  // Right side of face/hair
  [490, 440], [500, 470], [505, 510], [508, 550], [502, 590],
  // Right neck into shoulder fabric
  [510, 625], [525, 640], [545, 655], [575, 670], [605, 690], [625, 715],
  // Right arm / dupatta drape down to waist
  [630, 750], [635, 790], [635, 840], [640, 900], [640, 980], [635, 1060], [630, 1150],
  // Bottom across waist
  [440, 1150], [240, 1150],
  // Left drape up to waist
  [235, 1080], [230, 980], [240, 880], [255, 800],
  // Left curls
  [265, 730], [275, 660], [290, 600], [315, 540], [340, 490],
  // Top left hair
  [370, 450], [400, 425]
];

const polyStr = points.map(p => `${p[0]},${p[1]}`).join(' ');

console.log("Generating pristine cutout...");
const cmd = `convert public/assets/aistudio/WhatsApp_Image_2026-02-20_at_10.51.03_AM_65e98dfd.jpeg \\
  \\( +clone -alpha transparent -background none \\
     -fill white -draw "polygon ${polyStr}" \\
     -blur 0x1.5 \\) \\
  -compose DstIn -composite \\
  -crop 440x750+225+405 +repage \\
  public/assets/aistudio/yashasvi_cutout.png`;

execSync(cmd, { stdio: 'inherit' });
console.log("Pristine cutout generated!");
