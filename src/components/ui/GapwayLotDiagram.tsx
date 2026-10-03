// =============================================================================
// GapwayLotDiagram: inline SVG schematic of the Gapway Lakes Estates plat
//
// A DIAGRAM, not a survey. It shows the arrangement the preliminary plat
// approved: lake on the north, Gapway Rd on the south, two rows of lots with
// the internal road between them, the retention pond on the shoreline, the
// cul de sac at the west end and the loop at the east end. Lot shapes and
// spacing are schematic and are not to scale. The labelled text inside the SVG
// is real content, so screen readers and AI crawlers can read the layout
// instead of being handed an opaque image.
//
// Server component. No client JS, no external requests, scales to any width.
// =============================================================================

// Palette pulled from the site tokens so this never drifts from the theme.
const NAVY = "#0c1829";
const SLATE = "#6b7a8d";
const BORDER = "#e2e6ed";
const LAKE = "#dbe8f4";
const LAKE_LINE = "#93b4d4";
const POND = "#c3dcef";
const LAWN = "#eef2f6";
const LOT = "#ffffff";
const ROAD = "#f1f3f7";

export default function GapwayLotDiagram() {
  // --- Lakefront row: lots 1 to 25, north of the internal road ------------
  // The retention pond sits on the shoreline between lots 13 and 14, so the
  // row is drawn in two runs with a gap where the pond interrupts it.
  const LAKE_ROW_Y = 86;
  const LAKE_ROW_H = 46;
  const LOT_W = 26;
  const GAP = 2;
  const ROW_START_X = 58;

  // x position of the nth lot in a run, accounting for the pond gap
  const POND_W = 62;
  function lakefrontX(lotNumber: number) {
    const i = lotNumber - 1;
    // Lots 14 to 25 sit to the right of the pond, so push them past it.
    const pondOffset = lotNumber >= 14 ? POND_W + GAP : 0;
    return ROW_START_X + i * (LOT_W + GAP) + pondOffset;
  }

  // --- Arietta view row: lots 26 to 45, south of the internal road --------
  const VIEW_ROW_Y = 176;
  const VIEW_ROW_H = 42;
  function viewX(lotNumber: number) {
    const i = lotNumber - 26;
    return ROW_START_X + i * (LOT_W + GAP);
  }

  const lakefrontLots = Array.from({ length: 25 }, (_, i) => i + 1);
  const viewLots = Array.from({ length: 20 }, (_, i) => i + 26);

  // Right edge of the plat, derived from the last lot so the frame always fits
  const PLAT_RIGHT = lakefrontX(25) + LOT_W + 34;

  return (
    <figure className="my-8">
      <div className="overflow-x-auto border border-border bg-white">
        <svg
          viewBox={`0 0 ${PLAT_RIGHT + 20} 300`}
          className="w-full min-w-[640px] h-auto"
          role="img"
          aria-labelledby="gapway-diagram-title gapway-diagram-desc"
        >
          <title id="gapway-diagram-title">
            Schematic layout of Gapway Lakes Estates, Auburndale, Florida
          </title>
          <desc id="gapway-diagram-desc">
            Lake Juliana runs along the north edge. Twenty five lakefront lots,
            numbered 1 to 25, line the shoreline, interrupted by a 4.8 acre
            retention pond between lots 13 and 14. A single internal road runs
            east to west between the two rows, ending in a cul de sac at the west
            end and a loop at the east end. Twenty lots, numbered 26 to 45, sit
            along the south side of the internal road facing Gapway Road, with
            views toward Lake Arietta. The sole entrance is off Gapway Road.
            Diagram is schematic and not to scale.
          </desc>

          {/* ---------- Lake Juliana, north edge ---------- */}
          <rect x="0" y="0" width={PLAT_RIGHT + 20} height="62" fill={LAKE} />
          <path
            d={`M 0 62 L ${PLAT_RIGHT + 20} 62`}
            stroke={LAKE_LINE}
            strokeWidth="2"
            fill="none"
          />
          <text x="20" y="30" fill={NAVY} fontSize="15" fontWeight="600" fontFamily="system-ui, sans-serif">
            LAKE JULIANA
          </text>
          <text x="20" y="48" fill={SLATE} fontSize="11" fontFamily="system-ui, sans-serif">
            about 924 acres · roughly 3/4 mile of frontage along this plat
          </text>
          <text x={PLAT_RIGHT - 40} y="30" fill={SLATE} fontSize="11" fontFamily="system-ui, sans-serif">
            NORTH
          </text>

          {/* ---------- Lakefront lots 1 to 25 ---------- */}
          {lakefrontLots.map((n) => (
            <g key={`lf-${n}`}>
              <rect
                x={lakefrontX(n)}
                y={LAKE_ROW_Y}
                width={LOT_W}
                height={LAKE_ROW_H}
                fill={LOT}
                stroke={BORDER}
                strokeWidth="1"
              />
              <text
                x={lakefrontX(n) + LOT_W / 2}
                y={LAKE_ROW_Y + LAKE_ROW_H / 2 + 4}
                fill={SLATE}
                fontSize="10"
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
              >
                {n}
              </text>
            </g>
          ))}

          {/* ---------- Retention pond, on the shoreline between 13 and 14 ---------- */}
          <rect
            x={lakefrontX(13) + LOT_W + GAP}
            y="62"
            width={POND_W}
            height={LAKE_ROW_Y + LAKE_ROW_H - 62}
            fill={POND}
            stroke={LAKE_LINE}
            strokeWidth="1"
          />
          <text
            x={lakefrontX(13) + LOT_W + GAP + POND_W / 2}
            y="92"
            fill={NAVY}
            fontSize="9"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
          >
            RETENTION
          </text>
          <text
            x={lakefrontX(13) + LOT_W + GAP + POND_W / 2}
            y="104"
            fill={NAVY}
            fontSize="9"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
          >
            POND
          </text>
          <text
            x={lakefrontX(13) + LOT_W + GAP + POND_W / 2}
            y="116"
            fill={SLATE}
            fontSize="8"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
          >
            4.8 ac
          </text>

          <text x="20" y={LAKE_ROW_Y - 8} fill={NAVY} fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">
            LOTS 1 to 25 · lakefront
          </text>

          {/* ---------- Internal road, west cul de sac to east loop ---------- */}
          <rect x="30" y="142" width={PLAT_RIGHT - 44} height="24" fill={ROAD} stroke={BORDER} strokeWidth="1" />
          {/* West end cul de sac */}
          <circle cx="42" cy="154" r="22" fill={ROAD} stroke={BORDER} strokeWidth="1" />
          <text x="42" y="130" fill={SLATE} fontSize="9" textAnchor="middle" fontFamily="system-ui, sans-serif">
            CUL DE SAC
          </text>
          {/* East end loop */}
          <ellipse
            cx={PLAT_RIGHT - 32}
            cy="154"
            rx="30"
            ry="22"
            fill={ROAD}
            stroke={BORDER}
            strokeWidth="1"
          />
          <ellipse
            cx={PLAT_RIGHT - 32}
            cy="154"
            rx="14"
            ry="8"
            fill={LAWN}
            stroke={BORDER}
            strokeWidth="1"
          />
          <text x={PLAT_RIGHT - 32} y="130" fill={SLATE} fontSize="9" textAnchor="middle" fontFamily="system-ui, sans-serif">
            LOOP
          </text>
          {/* Centre line, drawn as a dash pattern so it reads as a road */}
          <line
            x1="64"
            y1="154"
            x2={PLAT_RIGHT - 62}
            y2="154"
            stroke={SLATE}
            strokeWidth="1"
            strokeDasharray="6 7"
          />

          {/* ---------- Arietta view lots 26 to 45 ---------- */}
          {viewLots.map((n) => (
            <g key={`vw-${n}`}>
              <rect
                x={viewX(n)}
                y={VIEW_ROW_Y}
                width={LOT_W}
                height={VIEW_ROW_H}
                fill={LOT}
                stroke={BORDER}
                strokeWidth="1"
              />
              <text
                x={viewX(n) + LOT_W / 2}
                y={VIEW_ROW_Y + VIEW_ROW_H / 2 + 4}
                fill={SLATE}
                fontSize="10"
                textAnchor="middle"
                fontFamily="system-ui, sans-serif"
              >
                {n}
              </text>
            </g>
          ))}

          {/* Lawn open space, east of the view row */}
          <rect
            x={viewX(45) + LOT_W + GAP}
            y={VIEW_ROW_Y}
            width="54"
            height={VIEW_ROW_H}
            fill={LAWN}
            stroke={BORDER}
            strokeWidth="1"
          />
          <text
            x={viewX(45) + LOT_W + GAP + 27}
            y={VIEW_ROW_Y + 20}
            fill={SLATE}
            fontSize="8"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
          >
            LAWN
          </text>
          <text
            x={viewX(45) + LOT_W + GAP + 27}
            y={VIEW_ROW_Y + 31}
            fill={SLATE}
            fontSize="8"
            textAnchor="middle"
            fontFamily="system-ui, sans-serif"
          >
            2.3 ac
          </text>

          <text x="20" y={VIEW_ROW_Y + VIEW_ROW_H + 18} fill={NAVY} fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">
            LOTS 26 to 45 · Lake Arietta views
          </text>

          {/* ---------- Gapway Rd, south edge, with the single entrance ---------- */}
          <rect x="0" y="252" width={PLAT_RIGHT + 20} height="26" fill={NAVY} />
          <text x="20" y="269" fill="#ffffff" fontSize="12" fontWeight="600" fontFamily="system-ui, sans-serif">
            GAPWAY RD
          </text>
          {/* Entrance stub connecting Gapway Rd up into the internal road */}
          <rect x={viewX(33)} y="218" width="22" height="34" fill={ROAD} stroke={BORDER} strokeWidth="1" />
          <text
            x={viewX(33) + 42}
            y="240"
            fill={NAVY}
            fontSize="10"
            fontWeight="600"
            fontFamily="system-ui, sans-serif"
          >
            SINGLE ENTRANCE
          </text>
          <text x={PLAT_RIGHT - 46} y="269" fill="#ffffff" fontSize="10" fontFamily="system-ui, sans-serif">
            SOUTH
          </text>
          <text x="20" y="294" fill={SLATE} fontSize="10" fontFamily="system-ui, sans-serif">
            Lake Arietta lies south of Gapway Rd. Schematic only, not to scale, not a survey.
          </text>
        </svg>
      </div>
      <figcaption className="font-body text-xs text-muted mt-2">
        Schematic of the approved 45 lot layout: lake on the north, Gapway Rd on the
        south, retention pond on the shoreline between lots 13 and 14. Drawn from the
        preliminary plat approved October 20, 2025. Not to scale and not a survey. Lot
        lines, dimensions, and lot count can change before the final plat is recorded.
      </figcaption>
    </figure>
  );
}
