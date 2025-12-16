import { app } from 'electron';
import { existsSync, mkdirSync, unlinkSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { pathToFileURL } from 'url';
import initSqlJs, { Database, SqlJsStatic } from 'sql.js';

const userDataDir = app.getPath('userData');
const dataDir = join(userDataDir, 'data');
const iconDir = join(userDataDir, 'PlayLists');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });
if (!existsSync(iconDir)) mkdirSync(iconDir, { recursive: true });

const dbPath = join(dataDir, 'bmusic.sqlite');

let SQL: SqlJsStatic | null = null;
let db: Database | null = null;

async function ensureDb(): Promise<Database> {
  if (db) return db;
  if (!SQL) {
    SQL = await initSqlJs({});
  }
  if (existsSync(dbPath)) {
    const fileBuffer = readFileSync(dbPath);
    db = new SQL.Database(new Uint8Array(fileBuffer));
  } else {
    db = new SQL.Database();
  }
  // Base tables
  db.run(`
    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      idx INTEGER NOT NULL,
      icon_path TEXT
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS musics (
      id INTEGER PRIMARY KEY,
      player_name TEXT NOT NULL,
      player_data TEXT NOT NULL,
      icon_url TEXT,
      music_name TEXT,
      music_author TEXT,
      UNIQUE(player_name, player_data)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS playlist_musics (
      playlist_id INTEGER NOT NULL,
      music_id INTEGER NOT NULL,
      position INTEGER NOT NULL,
      PRIMARY KEY (playlist_id, music_id)
    );
  `);
  // Optional metadata columns on playlists (add if missing)
  const info = db.exec(`PRAGMA table_info(playlists)`);
  const names = new Set<string>((info[0]?.values || []).map(v => String(v[1])));
  if (!names.has('description')) {
    db.run(`ALTER TABLE playlists ADD COLUMN description TEXT`);
  }
  if (!names.has('author')) {
    db.run(`ALTER TABLE playlists ADD COLUMN author TEXT`);
  }
  if (!names.has('author_icon_url')) {
    db.run(`ALTER TABLE playlists ADD COLUMN author_icon_url TEXT`);
  }
  if (!names.has('created_at')) {
    db.run(`ALTER TABLE playlists ADD COLUMN created_at INTEGER`);
  }
  if (!names.has('updated_at')) {
    db.run(`ALTER TABLE playlists ADD COLUMN updated_at INTEGER`);
  }
  return db;
}

function persist() {
  if (!db) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  if (!existsSync(dirname(dbPath))) mkdirSync(dirname(dbPath), { recursive: true });
  writeFileSync(dbPath, buffer);
}

async function getNextIndex(): Promise<number> {
  const d = await ensureDb();
  const res = d.exec('SELECT COALESCE(MAX(idx) + 1, 0) AS nextIdx FROM playlists');
  const next = res[0]?.values?.[0]?.[0] as number | undefined;
  return next ?? 0;
}

export type PlaylistRow = {
  name: string;
  index: number;
  icon_path?: string | null;
};

export const playlistsDb = {
  async all(): Promise<PlaylistRow[]> {
    const d = await ensureDb();
    const res = d.exec('SELECT name, idx, icon_path FROM playlists ORDER BY idx ASC');
    const rows = (res[0]?.values || []) as any[];
    return rows.map((v: any[]) => ({ name: String(v[0]), index: Number(v[1]), icon_path: v[2] ? String(v[2]) : null }));
  },
  // 接收前端传入的 JSON，解析并写入关系表
  async upsertPlaylistFromJson(name: string, dataJson: string): Promise<void> {
    const d = await ensureDb();
    let parsed: any;
    try { parsed = JSON.parse(dataJson || '{}'); } catch { parsed = {}; }
    const description = typeof parsed.description === 'string' ? parsed.description : null;
    const author = typeof parsed.author === 'string' ? parsed.author : null;
    const authorIconUrl = typeof parsed.authorIconUrl === 'string' ? parsed.authorIconUrl : null;
    const list = Array.isArray(parsed.list) ? parsed.list as any[] : [];

    // ensure playlist exists
    const plRes = d.exec(`SELECT id FROM playlists WHERE name = $name`, { $name: name });
    let playlistId: number | null = plRes[0]?.values?.[0]?.[0] as number | undefined ?? null;
    if (playlistId == null) {
      const idx = await getNextIndex();
      d.run(`INSERT INTO playlists (name, idx, description, author, author_icon_url, created_at, updated_at) VALUES ($name, $idx, $desc, $author, $aicon, $ca, $ua)`, {
        $name: name, $idx: idx, $desc: description, $author: author, $aicon: authorIconUrl, $ca: Date.now(), $ua: Date.now()
      });
      const row = d.exec(`SELECT id FROM playlists WHERE name = $name`, { $name: name });
      playlistId = row[0]?.values?.[0]?.[0] as number | undefined ?? null;
    } else {
      d.run(`UPDATE playlists SET description = $desc, author = $author, author_icon_url = $aicon, updated_at = $ua WHERE id = $id`, {
        $desc: description, $author: author, $aicon: authorIconUrl, $ua: Date.now(), $id: playlistId
      });
    }
    if (playlistId == null) { persist(); return; }

    // clear previous relations
    d.run(`DELETE FROM playlist_musics WHERE playlist_id = $pid`, { $pid: playlistId });

    // upsert musics and relations with order
    const insertMusic = (m: any) => {
      const playerName = String(m.playerName ?? '');
      const playerData = String(m.playerData ?? '');
      const iconUrl = m.iconUrl != null ? String(m.iconUrl) : null;
      const musicName = m.musicName != null ? String(m.musicName) : null;
      const musicAuthor = m.musicAuthor != null ? String(m.musicAuthor) : null;
      if (!playerName || !playerData) return null;
      const ex = d.exec(`SELECT id FROM musics WHERE player_name = $pn AND player_data = $pd`, { $pn: playerName, $pd: playerData });
      let mid: number | null = ex[0]?.values?.[0]?.[0] as number | undefined ?? null;
      if (mid == null) {
        d.run(`INSERT INTO musics (player_name, player_data, icon_url, music_name, music_author) VALUES ($pn, $pd, $icon, $name, $author)`, {
          $pn: playerName, $pd: playerData, $icon: iconUrl, $name: musicName, $author: musicAuthor
        });
        const r2 = d.exec(`SELECT id FROM musics WHERE player_name = $pn AND player_data = $pd`, { $pn: playerName, $pd: playerData });
        mid = r2[0]?.values?.[0]?.[0] as number | undefined ?? null;
      } else {
        d.run(`UPDATE musics SET icon_url = COALESCE($icon, icon_url), music_name = COALESCE($name, music_name), music_author = COALESCE($author, music_author) WHERE id = $id`, {
          $icon: iconUrl, $name: musicName, $author: musicAuthor, $id: mid
        });
      }
      return mid;
    };

    let pos = 0;
    for (const m of list) {
      const mid = insertMusic(m);
      if (mid == null) continue;
      d.run(`INSERT OR REPLACE INTO playlist_musics (playlist_id, music_id, position) VALUES ($pid, $mid, $pos)`, {
        $pid: playlistId, $mid: mid, $pos: pos++
      });
    }
    persist();
  },
  // 组装前端需要的 JSON 字符串
  async readPlaylistAsJson(name: string): Promise<string | null> {
    const d = await ensureDb();
    const pl = d.exec(`SELECT id, description, author, author_icon_url FROM playlists WHERE name = $name`, { $name: name });
    const prow = pl[0]?.values?.[0];
    if (!prow) return null;
    const playlistId = Number(prow[0]);
    const description = prow[1] != null ? String(prow[1]) : undefined;
    const author = prow[2] != null ? String(prow[2]) : undefined;
    const authorIconUrl = prow[3] != null ? String(prow[3]) : undefined;

    const res = d.exec(`
      SELECT m.icon_url, m.music_name, m.music_author, m.player_name, m.player_data
      FROM playlist_musics pm
      JOIN musics m ON m.id = pm.music_id
      WHERE pm.playlist_id = $pid
      ORDER BY pm.position ASC
    `, { $pid: playlistId });
    const values = res[0]?.values || [];
    const list = values.map((r: any[]) => ({
      iconUrl: r[0] != null ? String(r[0]) : undefined,
      musicName: r[1] != null ? String(r[1]) : undefined,
      musicAuthor: r[2] != null ? String(r[2]) : undefined,
      playerName: String(r[3]),
      playerData: String(r[4])
    }));
    return JSON.stringify({ description, author, authorIconUrl, list });
  },
  async setIndex(name: string, index: number): Promise<boolean> {
    const d = await ensureDb();
    d.run(`UPDATE playlists SET idx = $idx WHERE name = $name`, { $idx: index, $name: name });
    persist();
    return true;
  },
  async rename(oldName: string, newName: string): Promise<boolean> {
    const d = await ensureDb();
    d.run(`UPDATE playlists SET name = $newName WHERE name = $oldName`, { $newName: newName, $oldName: oldName });
    persist();
    return true;
  },
  async delete(name: string): Promise<boolean> {
    const d = await ensureDb();
    const res = d.exec(`SELECT id, icon_path FROM playlists WHERE name = $name`, { $name: name });
    const row = res[0]?.values?.[0];
    const playlistId = row ? Number(row[0]) : null;
    const iconPath = row ? (row[1] as string | undefined) : undefined;
    if (playlistId != null) {
      d.run(`DELETE FROM playlist_musics WHERE playlist_id = $pid`, { $pid: playlistId });
    }
    d.run(`DELETE FROM playlists WHERE name = $name`, { $name: name });
    if (iconPath && existsSync(iconPath)) {
      try { unlinkSync(iconPath); } catch {}
    }
    persist();
    return true;
  },
  async readIconUrl(name: string): Promise<string | null> {
    const d = await ensureDb();
    const res = d.exec(`SELECT icon_path FROM playlists WHERE name = $name`, { $name: name });
    const iconPath = res[0]?.values?.[0]?.[0] as string | undefined;
    if (!iconPath) return null;
    const u = pathToFileURL(iconPath);
    u.search = `?${Date.now()}`;
    return u.toString();
  },
  async saveIcon(name: string, data: Uint8Array): Promise<boolean> {
    const d = await ensureDb();
    const res = d.exec(`SELECT id, name, idx FROM playlists WHERE name = $name`, { $name: name });
    const row = res[0]?.values?.[0];
    if (!row) return false;
    const idx = Number(row[2]);
    const nm = String(row[1]);
    const safeBase = `${idx}.${nm}`.replace(/[\\/:*?\"<>|]/g, '_');
    const filePath = join(iconDir, `${safeBase}.webp`);
    if (!existsSync(dirname(filePath))) mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, Buffer.from(data));
    d.run(`UPDATE playlists SET icon_path = $path WHERE name = $name`, { $path: filePath, $name: name });
    persist();
    return true;
  }
};
