import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = 'Krzysztof Piekarski - Philosopher, Analyst & Investor';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#0a0a0a',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Background grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: 'linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Accent line */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '8px',
            backgroundColor: '#FF4500',
          }}
        />

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
          <h1
            style={{
              fontSize: '72px',
              fontWeight: 900,
              color: '#ffffff',
              lineHeight: 0.9,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            KRZYSZTOF
            <br />
            PIEKARSKI
          </h1>

          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                backgroundColor: '#FF4500',
                color: '#000',
                padding: '8px 16px',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              PhD
            </span>
            <span
              style={{
                backgroundColor: '#fff',
                color: '#000',
                padding: '8px 16px',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              PHILOSOPHER
            </span>
            <span
              style={{
                backgroundColor: '#39FF14',
                color: '#000',
                padding: '8px 16px',
                fontSize: '18px',
                fontWeight: 700,
              }}
            >
              INVESTOR
            </span>
          </div>

          <p
            style={{
              fontSize: '28px',
              color: '#a0a0a0',
              maxWidth: '700px',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Breaking through mental barriers. Teaching professional-level investing.
          </p>
        </div>

        {/* Twitter handle */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '80px',
            fontSize: '24px',
            color: '#FF4500',
            fontFamily: 'monospace',
          }}
        >
          @7FlyingPlatypus
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
