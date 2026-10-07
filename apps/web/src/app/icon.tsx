import { ImageResponse } from 'next/og';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 120 120">
          <path
            d="M 40 0 H 80 V 40 H 120 V 80 A 40 40 0 0 0 80 120 H 40 V 80 H 0 V 40 A 40 40 0 0 0 40 0 Z"
            fill="#4B624A"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
