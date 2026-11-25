import { ImageResponse } from 'next/og';
import { getProjectSlugs } from '@/entities/project';
import { siteConfig } from '@/shared/config/site';

export const alt = `${siteConfig.name} — ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Social preview in the site's palette: who, and what for whom. */
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#161513',
        color: '#f2efe9',
        padding: 72,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, color: '#aaa398' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 44,
            height: 44,
            borderRadius: 9999,
            background: '#ff5a1f',
            color: '#12110f',
            fontSize: 17,
          }}
        >
          AB
        </div>
        <span>
          {siteConfig.name} — {siteConfig.role}
        </span>
      </div>
      <div style={{ display: 'flex', maxWidth: 900, fontSize: 76, lineHeight: 1.05, letterSpacing: -2 }}>
        Fast websites and online stores for small businesses
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 24, color: '#aaa398' }}>
        <div style={{ width: 10, height: 10, borderRadius: 9999, background: '#4cc38a' }} />
        {getProjectSlugs().length} live projects · {siteConfig.city}
      </div>
    </div>,
    size,
  );
}
