import * as SQLite from 'expo-sqlite';

export const database = SQLite.openDatabaseSync('courses-tracker.db');

type SqlParams = (string | number | null)[];

export interface QueryResult<T> {
  rows: T[];
  rowsAffected: number;
  insertId?: number;
}

export const executeSql = async <T = Record<string, unknown>>(
  query: string,
  params: SqlParams = []
): Promise<QueryResult<T>> => {
  try {
    const result = await database.runAsync(query, params);
    return {
      rows: [],
      rowsAffected: result.changes,
      insertId: result.lastInsertRowId
    };
  } catch (error) {
    console.error('SQLite error', { query, params, error });
    throw error;
  }
};

export const querySql = async <T = Record<string, unknown>>(
  query: string,
  params: SqlParams = []
): Promise<T[]> => {
  try {
    const result = await database.getAllAsync<T>(query, params);
    return result;
  } catch (error) {
    console.error('SQLite query error', { query, params, error });
    throw error;
  }
};

export const initializeDatabase = async () => {
  await executeSql(
    `CREATE TABLE IF NOT EXISTS courses (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT NOT NULL,
        address1 TEXT NOT NULL,
        address2 TEXT,
        city TEXT NOT NULL,
        stateRegion TEXT,
        country TEXT NOT NULL,
        postalCode TEXT,
        latitude REAL,
        longitude REAL,
        phone TEXT,
        website TEXT,
        isApproved INTEGER NOT NULL DEFAULT 0,
        createdByUserId TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        serverUpdatedAt TEXT
      );`
  );

  await executeSql(
    `CREATE TABLE IF NOT EXISTS tee_boxes (
        id TEXT PRIMARY KEY NOT NULL,
        courseId TEXT NOT NULL,
        name TEXT NOT NULL,
        parTotal INTEGER,
        yardageTotal INTEGER,
        slope REAL,
        rating REAL,
        serverUpdatedAt TEXT,
        FOREIGN KEY (courseId) REFERENCES courses (id) ON DELETE CASCADE
      );`
  );

  await executeSql(
    `CREATE TABLE IF NOT EXISTS visits (
        id TEXT PRIMARY KEY NOT NULL,
        userId TEXT NOT NULL,
        courseId TEXT NOT NULL,
        visitDate TEXT NOT NULL,
        holesPlayed INTEGER NOT NULL,
        grossScore INTEGER,
        teeBoxId TEXT,
        teeName TEXT,
        toPar INTEGER,
        serverUpdatedAt TEXT,
        isDirty INTEGER NOT NULL DEFAULT 0,
        isDeleted INTEGER NOT NULL DEFAULT 0,
        FOREIGN KEY (courseId) REFERENCES courses (id)
      );`
  );

  await executeSql(
    `CREATE TABLE IF NOT EXISTS wishlist_entries (
        id TEXT PRIMARY KEY NOT NULL,
        userId TEXT NOT NULL,
        courseId TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        serverUpdatedAt TEXT,
        isDirty INTEGER NOT NULL DEFAULT 0,
        isDeleted INTEGER NOT NULL DEFAULT 0,
        UNIQUE (userId, courseId)
      );`
  );

  await executeSql(
    `CREATE TABLE IF NOT EXISTS course_suggestions (
        id TEXT PRIMARY KEY NOT NULL,
        submittedByUserId TEXT NOT NULL,
        name TEXT NOT NULL,
        address1 TEXT NOT NULL,
        address2 TEXT,
        city TEXT NOT NULL,
        stateRegion TEXT,
        country TEXT NOT NULL,
        postalCode TEXT,
        phone TEXT,
        website TEXT,
        status TEXT NOT NULL,
        decisionBy TEXT,
        decisionAt TEXT,
        createdAt TEXT NOT NULL,
        serverUpdatedAt TEXT
      );`
  );

  await executeSql(
    `CREATE TABLE IF NOT EXISTS sync_state (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );`
  );

  await executeSql(
    'CREATE INDEX IF NOT EXISTS idx_courses_location ON courses (country, stateRegion, city);'
  );

  await executeSql(
    'CREATE INDEX IF NOT EXISTS idx_visits_by_course ON visits (userId, courseId, visitDate);'
  );

  await executeSql(
    'CREATE INDEX IF NOT EXISTS idx_visits_recent ON visits (userId, visitDate);'
  );
};
