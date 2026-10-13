/**
 * Simplified silhouette of Chhatrapati Shivaji Maharaj Terminus as SVG path
 * data (1000 × 420, ground at y = 420). Used by the opening scene, the box
 * artwork (via Path2D) and the case study, so the landmark is drawn the same
 * way everywhere.
 */

type P = [number, number];

const spire = (x0: number, x1: number, top: number, tip: number): P[] => [
  [x0, top],
  [(x0 + x1) / 2, tip],
  [x1, top],
];

function silhouette(): P[] {
  const pts: P[] = [
    [0, 420],
    [0, 350],
    [40, 350],
    ...spire(40, 70, 330, 300),
    [70, 350],
    [120, 350],
    [120, 312],
    ...spire(118, 142, 300, 248),
    [142, 312],
    [205, 312],
    ...spire(195, 235, 300, 268), // wing gable
    [235, 312],
    [280, 312],
    ...spire(278, 302, 300, 252),
    [302, 284],
    [330, 284],
    ...spire(330, 390, 284, 232), // main gable left
    [390, 270],
    [395, 270],
    ...spire(395, 430, 232, 176), // flanking tower left
    [430, 232],
    [440, 232],
    [440, 196],
    [455, 196],
    [455, 170],
  ];
  // central dome
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI - (i / 16) * Math.PI;
    pts.push([500 + Math.cos(a) * 45, 170 - Math.sin(a) * 72]);
  }
  pts.push([545, 170], [545, 196], [560, 196], [560, 232], [570, 232]);
  pts.push(...spire(570, 605, 232, 176));
  pts.push([605, 270], [610, 270]);
  pts.push(...spire(610, 670, 284, 232));
  pts.push([670, 284], [698, 284], [698, 300]);
  pts.push(...spire(698, 722, 300, 252));
  pts.push([720, 312], [765, 312]);
  pts.push(...spire(765, 805, 300, 268));
  pts.push([805, 312], [858, 312]);
  pts.push(...spire(858, 882, 300, 248));
  pts.push([880, 312], [880, 350], [930, 350]);
  pts.push(...spire(930, 960, 330, 300));
  pts.push([960, 350], [1000, 350], [1000, 420]);
  return pts;
}

const toPath = (pts: P[]) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";

export const CST_PATH = (() => {
  let d = toPath(silhouette());
  // statue finial on the dome
  d += "M496 98L504 98L504 74L500 64L496 74Z";
  return d;
})();

/** Pointed-arch windows and string courses, drawn as strokes over the silhouette. */
export const CST_DETAIL = (() => {
  let d = "";
  const arch = (x: number, y: number, w: number, h: number) => {
    d += `M${x} ${y + h}L${x} ${y + w * 0.6}Q${x} ${y} ${x + w / 2} ${y - w * 0.15}Q${x + w} ${y} ${x + w} ${y + w * 0.6}L${x + w} ${y + h}`;
  };
  for (let x = 130; x < 290; x += 26) arch(x, 340, 14, 40);
  for (let x = 720; x < 875; x += 26) arch(x, 340, 14, 40);
  for (let x = 330; x < 680; x += 30) {
    if (x > 430 && x < 560) continue;
    arch(x, 312, 16, 46);
  }
  arch(470, 250, 60, 120); // grand entrance
  arch(462, 200, 16, 30);
  arch(522, 200, 16, 30);
  d += "M120 330L880 330M300 300L700 300M455 182L545 182";
  // rose window
  d += "M512 222A12 12 0 1 0 488 222A12 12 0 1 0 512 222";
  return d;
})();
