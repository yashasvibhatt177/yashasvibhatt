import React, { useMemo } from 'react';

interface PixelGridBackgroundProps {
  className?: string;
}

export const PixelGridBackground: React.FC<PixelGridBackgroundProps> = ({ className = '' }) => {
  // Generate a deterministic grid of tiles with varying shades of dark blue
  // matching Screenshot 1 from Figma
  const tiles = useMemo(() => {
    const rows = 18;
    const cols = 28;
    const items: Array<{
      id: string;
      row: number;
      col: number;
      color: string;
      opacity: number;
    }> = [];

    // Specific blue shades matching the Figma design reference
    const bluePalette = [
      '#050c2a',
      '#071238',
      '#0a1a4e',
      '#0d2266',
      '#081640',
      '#0f2878',
      '#13328f',
      '#0a1e58',
    ];

    // Seeded pseudo-random generator for consistent, faithful layout
    let seed = 42;
    const pseudoRandom = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const rand = pseudoRandom();
        // Approximately 20% of the cells are highlighted in subtle varying blues
        if (rand > 0.77) {
          const colorIdx = Math.floor(pseudoRandom() * bluePalette.length);
          const opacity = 0.35 + pseudoRandom() * 0.55;
          items.push({
            id: `${r}-${c}`,
            row: r,
            col: c,
            color: bluePalette[colorIdx],
            opacity: Number(opacity.toFixed(2)),
          });
        }
      }
    }
    return items;
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Base deep midnight canvas */}
      <div className="absolute inset-0 bg-[#02041b]" />

      {/* Grid container */}
      <div 
        className="absolute inset-0 w-full h-full grid"
        style={{
          gridTemplateColumns: 'repeat(28, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(18, minmax(0, 1fr))',
        }}
      >
        {tiles.map((tile) => (
          <div
            key={tile.id}
            style={{
              gridRowStart: tile.row + 1,
              gridColumnStart: tile.col + 1,
              backgroundColor: tile.color,
              opacity: tile.opacity,
            }}
            className="w-full h-full transition-opacity duration-1000"
          />
        ))}
      </div>
    </div>
  );
};
