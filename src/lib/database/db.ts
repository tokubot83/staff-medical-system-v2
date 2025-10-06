/**
 * データベース接続ユーティリティ
 * MySQL接続とクエリ実行のラッパー
 */

import mysql from 'mysql2/promise';

// 環境変数からDB接続情報を取得
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'staff_medical_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
};

// コネクションプール
let pool: mysql.Pool | null = null;

/**
 * コネクションプールを取得（シングルトン）
 */
export function getPool(): mysql.Pool {
  if (!pool) {
    pool = mysql.createPool(dbConfig);
  }
  return pool;
}

/**
 * クエリ実行（SELECT等）
 */
export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const connection = await getPool().getConnection();
  try {
    const [rows] = await connection.query(sql, params);
    return rows as T[];
  } finally {
    connection.release();
  }
}

/**
 * 単一行取得
 */
export async function queryOne<T = any>(
  sql: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/**
 * INSERT実行
 */
export async function insert(
  table: string,
  data: Record<string, any>
): Promise<number> {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');

  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;

  const connection = await getPool().getConnection();
  try {
    const [result] = await connection.query(sql, values);
    return (result as any).insertId;
  } finally {
    connection.release();
  }
}

/**
 * UPDATE実行
 */
export async function update(
  table: string,
  data: Record<string, any>,
  where: Record<string, any>
): Promise<number> {
  const setClause = Object.keys(data)
    .map(key => `${key} = ?`)
    .join(', ');

  const whereClause = Object.keys(where)
    .map(key => `${key} = ?`)
    .join(' AND ');

  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  const params = [...Object.values(data), ...Object.values(where)];

  const connection = await getPool().getConnection();
  try {
    const [result] = await connection.query(sql, params);
    return (result as any).affectedRows;
  } finally {
    connection.release();
  }
}

/**
 * DELETE実行
 */
export async function deleteRecord(
  table: string,
  where: Record<string, any>
): Promise<number> {
  const whereClause = Object.keys(where)
    .map(key => `${key} = ?`)
    .join(' AND ');

  const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
  const params = Object.values(where);

  const connection = await getPool().getConnection();
  try {
    const [result] = await connection.query(sql, params);
    return (result as any).affectedRows;
  } finally {
    connection.release();
  }
}

/**
 * トランザクション実行
 */
export async function transaction<T>(
  callback: (connection: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * コネクションプールを閉じる（アプリケーション終了時）
 */
export async function closePool(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
