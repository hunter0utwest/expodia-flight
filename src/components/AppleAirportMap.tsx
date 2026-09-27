/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    mapkit?: any;
  }
}

type Airport = {
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
};

type Props = {
  className?: string;
  height?: number;
};

export default function AppleAirportMap({ className = '', height = 430 }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [status, setStatus] = useState('Loading airports…');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const token = process.env.NEXT_PUBLIC_APPLE_MAPKIT_TOKEN;
        if (!token) {
          setStatus('Map authorization is not configured yet.');
          return;
        }

        if (!window.mapkit) {
          await new Promise<void>((resolve, reject) => {
            const existing = document.querySelector('script[data-expodia-mapkit]');
            if (existing) {
              existing.addEventListener('load', () => resolve(), { once: true });
              existing.addEventListener('error', () => reject(new Error('MapKit failed to load')), { once: true });
              return;
            }
            const script = document.createElement('script');
            script.src = 'https://cdn.apple-mapkit.com/mk/5.x.x/mapkit.js';
            script.async = true;
            script.dataset.expodiaMapkit = 'true';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('MapKit failed to load'));
            document.head.appendChild(script);
          });
        }

        if (cancelled || !hostRef.current || !window.mapkit) return;

        window.mapkit.init({ authorizationCallback: (done: (token: string) => void) => done(token) });

        const mapkit = window.mapkit;
        const map = new mapkit.Map(hostRef.current, {
          mapType: mapkit.Map.MapTypes.Standard,
          showsCompass: mapkit.FeatureVisibility.Visible,
          showsMapTypeControl: false,
          showsZoomControl: true,
          showsUserLocationControl: false,
          isRotationEnabled: false,
        });

        mapRef.current = map;
        map.region = new mapkit.CoordinateRegion(
          new mapkit.Coordinate(25, 10),
          new mapkit.CoordinateSpan(150, 320),
        );

        const response = await fetch('/api/airports', { cache: 'no-store' });
        if (!response.ok) throw new Error('Airport data unavailable');
        const airports: Airport[] = await response.json();

        const annotations = airports.map((airport) => {
          const annotation = new mapkit.MarkerAnnotation(
            new mapkit.Coordinate(airport.lat, airport.lon),
            { title: airport.name, subtitle: `${airport.iata} · ${airport.city}, ${airport.country}` }
          );
          annotation.data = airport;
          return annotation;
        });

        map.addAnnotations(annotations);
        if (!cancelled) setStatus(`${airports.length.toLocaleString()} airports`);
      } catch {
        if (!cancelled) setStatus('Airport map is temporarily unavailable.');
      }
    }

    load();
    return () => {
      cancelled = true;
      if (mapRef.current) mapRef.current.destroy();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className={`appleAirportMap ${className}`} style={{ height }} aria-label="Apple standard world map showing airports">
      <div ref={hostRef} className="appleAirportMapCanvas" />
      <div className="appleAirportMapStatus">{status}</div>
    </div>
  );
}
