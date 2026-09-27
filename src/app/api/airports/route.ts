import { NextResponse } from 'next/server';

const SOURCE = 'https://raw.githubusercontent.com/davidmegginson/ourairports-data/main/airports.csv';

function parseCsvLine(line: string) {
  const values: string[] = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') { value += '"'; i += 1; continue; }
    if (char === '"') { quoted = !quoted; continue; }
    if (char === ',' && !quoted) { values.push(value); value = ''; continue; }
    value += char;
  }
  values.push(value);
  return values;
}

export async function GET() {
  const response = await fetch(SOURCE, { next: { revalidate: 86400 } });
  if (!response.ok) return NextResponse.json({ error: 'Airport source unavailable' }, { status: 502 });

  const csv = await response.text();
  const lines = csv.split(/\r?\n/).filter(Boolean);
  const header = parseCsvLine(lines.shift() ?? '');
  const index = Object.fromEntries(header.map((name, i) => [name, i]));

  const airports = lines.map((line) => {
    const row = parseCsvLine(line);
    const type = row[index.type] ?? '';
    const iata = row[index.ident] ?? '';
    const lat = Number(row[index.latitude_deg]);
    const lon = Number(row[index.longitude_deg]);
    if (!['large_airport', 'medium_airport'].includes(type)) return null;
    if (!/^[A-Z]{3}$/.test(iata) || !Number.isFinite(lat) || !Number.isFinite(lon)) return null;
    return {
      iata,
      name: row[index.name] ?? iata,
      city: row[index.municipality] ?? '',
      country: row[index.iso_country] ?? '',
      lat,
      lon,
    };
  }).filter(Boolean);

  return NextResponse.json(airports, {
    headers: {
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
    },
  });
}
