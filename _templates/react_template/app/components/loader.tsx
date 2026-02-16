'use client'

import type React from 'react'

interface MetatronLoaderProps {
  duration?: number
  color?: string
}

export const Loader = ({
  duration = 8,
  color = '#ff6100',
}: MetatronLoaderProps) => {
  // Calculate timing for each animation phase
  const phaseTime = duration / 6

  // Hexagon points (outer and inner)
  const outerRadius = 160
  const innerRadius = 80
  const centerX = 200
  const centerY = 200

  // Distance between adjacent vertices on a hexagon is equal to the radius
  // So circles should have radius = distance/2 to touch
  const outerCircleRadius = outerRadius * 0.25 // Adjusted to touch neighbors
  const innerCircleRadius = innerRadius * 0.5
  const centerCircleRadius = 40

  // Calculate hexagon vertices starting from bottom-left (8 o'clock position)
  // Standard hexagon starts at top, we rotate by 210 degrees to start at 8 o'clock
  const getHexagonPoints = (radius: number, startAngle = 210) => {
    const points = []
    for (let i = 0; i < 6; i++) {
      const angle = (startAngle + i * 60) * (Math.PI / 180)
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      })
    }

    return points
  }

  const outerPoints = getHexagonPoints(outerRadius)
  const innerPoints = getHexagonPoints(innerRadius)

  // Create hexagon path (6 sides, each animated separately)
  const createHexagonSides = (points: Array<{ x: number; y: number }>) =>
    points.map((point, i) => {
      const nextPoint = points[(i + 1) % 6]

      return `M ${point.x} ${point.y} L ${nextPoint.x} ${nextPoint.y}`
    })

  const outerSides = createHexagonSides(outerPoints)
  const innerSides = createHexagonSides(innerPoints)

  const outerSideLength = Math.sqrt(
    Math.pow(outerPoints[1].x - outerPoints[0].x, 2) +
      Math.pow(outerPoints[1].y - outerPoints[0].y, 2),
  )

  const calculateLineLength = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
  ) => Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

  const innerSideLength = calculateLineLength(
    innerPoints[0].x,
    innerPoints[0].y,
    innerPoints[1].x,
    innerPoints[1].y,
  )

  return (
    <svg
      width="400"
      height="400"
      viewBox="0 0 400 400"
      className="w-full max-w-md">
      <defs>
        <style>{`
          @keyframes drawLine {
            from {
              stroke-dashoffset: var(--line-length);
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          .outer-side {
            stroke-dasharray: var(--line-length);
            stroke-dashoffset: var(--line-length);
          }
          
          .inner-side {
            stroke-dasharray: var(--line-length);
            stroke-dashoffset: var(--line-length);
          }
          
          ${outerSides
            .map(
              (_, i) => `
            .outer-side-${i} {
              animation: drawLine ${phaseTime / 6}s ease-in-out forwards;
              animation-delay: ${i * (phaseTime / 6)}s;
            }
          `,
            )
            .join('')}
          
          ${innerSides
            .map(
              (_, i) => `
            .inner-side-${i} {
              animation: drawLine ${phaseTime / 6}s ease-in-out forwards;
              animation-delay: ${phaseTime + i * (phaseTime / 6)}s;
            }
          `,
            )
            .join('')}
          
          .center-circle {
            opacity: 0;
            animation: fadeIn 0.6s ease-in-out forwards;
            animation-delay: ${phaseTime * 2}s;
          }
          
          .inner-vertex-circle {
            opacity: 0;
            animation: fadeIn 0.8s ease-in-out forwards;
            animation-delay: ${phaseTime * 2.5}s;
          }
          
          .outer-vertex-circle {
            opacity: 0;
            animation: fadeIn 0.8s ease-in-out forwards;
            animation-delay: ${phaseTime * 3}s;
          }
          
          .connecting-line {
            animation: drawLine 1.2s ease-in-out forwards;
            animation-delay: ${phaseTime * 3.5}s;
          }
        `}</style>
      </defs>

      {/* Outer hexagon sides */}
      {outerSides.map((path, i) => (
        <path
          key={`outer-${i}`}
          d={path}
          stroke={color}
          strokeWidth="2"
          fill="none"
          className={`outer-side outer-side-${i}`}
          style={{ '--line-length': outerSideLength } as React.CSSProperties}
        />
      ))}

      {/* Inner hexagon sides */}
      {innerSides.map((path, i) => (
        <path
          key={`inner-${i}`}
          d={path}
          stroke={color}
          strokeWidth="2"
          fill="none"
          className={`inner-side inner-side-${i}`}
          style={{ '--line-length': innerSideLength } as React.CSSProperties}
        />
      ))}

      {/* Center circle */}
      <circle
        cx={centerX}
        cy={centerY}
        r={centerCircleRadius}
        stroke={color}
        strokeWidth="2"
        fill="none"
        className="center-circle"
      />

      {/* Inner vertex circles */}
      {innerPoints.map((point, i) => (
        <circle
          key={`inner-circle-${i}`}
          cx={point.x}
          cy={point.y}
          r={innerCircleRadius}
          stroke={color}
          strokeWidth="2"
          fill="none"
          className="inner-vertex-circle"
        />
      ))}

      {/* Outer vertex circles */}
      {outerPoints.map((point, i) => (
        <circle
          key={`outer-circle-${i}`}
          cx={point.x}
          cy={point.y}
          r={outerCircleRadius}
          stroke={color}
          strokeWidth="2"
          fill="none"
          className="outer-vertex-circle"
        />
      ))}

      {/* Connecting lines from outer vertices to all inner vertices */}
      {outerPoints.map((outerPoint, i) => (
        <g key={`connections-${i}`}>
          {innerPoints.map((innerPoint, j) => {
            const lineLength = calculateLineLength(
              outerPoint.x,
              outerPoint.y,
              innerPoint.x,
              innerPoint.y,
            )

            return (
              <line
                key={`line-${i}-${j}`}
                x1={outerPoint.x}
                y1={outerPoint.y}
                x2={innerPoint.x}
                y2={innerPoint.y}
                stroke={color}
                strokeWidth="1"
                className="connecting-line"
                style={
                  {
                    strokeDasharray: lineLength,
                    strokeDashoffset: lineLength,
                    '--line-length': lineLength,
                  } as React.CSSProperties
                }
              />
            )
          })}
        </g>
      ))}

      {/* Lines from center to inner vertices */}
      {innerPoints.map((point, i) => {
        const lineLength = calculateLineLength(
          centerX,
          centerY,
          point.x,
          point.y,
        )

        return (
          <line
            key={`center-line-${i}`}
            x1={centerX}
            y1={centerY}
            x2={point.x}
            y2={point.y}
            stroke={color}
            strokeWidth="1"
            className="connecting-line"
            style={
              {
                strokeDasharray: lineLength,
                strokeDashoffset: lineLength,
                '--line-length': lineLength,
              } as React.CSSProperties
            }
          />
        )
      })}
    </svg>
  )
}
