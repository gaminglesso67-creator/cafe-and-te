import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at 50% 35%, #2A1F17 0%, #130F0C 100%)',
          borderRadius: '38px',
          border: '5px solid #D99B52',
          color: '#FAF3E8',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: '0.28em',
            color: '#8FB397',
            marginBottom: 4,
            textTransform: 'uppercase',
          }}
        >
          CAFE
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#D99B52',
            lineHeight: 1,
          }}
        >
          C&amp;T
        </div>
        <div
          style={{
            width: 86,
            height: 3,
            background: '#D99B52',
            marginTop: 12,
            borderRadius: 4,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
