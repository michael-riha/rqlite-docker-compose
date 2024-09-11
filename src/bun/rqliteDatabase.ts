/**
 * @module RqliteDatabase
 * TypeScript implementation of rqlite database abstraction similar to Bun's SQLite API.
 * Provides asynchronous methods for running SQL queries and managing prepared statements.
 */

export default class RqliteDatabase {
  baseUrl: string;

  /**
   * Create a new rqlite database connection.
   * 
   * @param {string} baseUrl - The base URL of the rqlite HTTP API (e.g., 'http://localhost:4001').
   */
  constructor(baseUrl: string) {
      this.baseUrl = baseUrl;
  }

  /**
   * Execute a non-query SQL statement (INSERT, UPDATE, DELETE, etc.).
   * 
   * @param {string} sql - The SQL query to execute.
   * @param {any[]} [params=[]] - Optional array of parameters to bind to the SQL query.
   * @returns {Promise<{ changes: number, lastInsertRowid: number }>} 
   * A promise that resolves to the result of the SQL execution.
   */
  async run(sql: string, params: any[] = []): Promise<{ changes: number; lastInsertRowid: number }> {
      const result = await this._executeQuery(sql, params);
      return result;
  }

  /**
   * Execute a SELECT query and return the first row.
   * 
   * @param {string} sql - The SQL query to execute.
   * @param {any[]} [params=[]] - Optional array of parameters to bind to the SQL query.
   * @returns {Promise<any | null>} A promise that resolves to the first row of the result set, or null if no rows found.
   */
  async get(sql: string, params: any[] = []): Promise<any | null> {
      const rows = await this.query(sql, params);
      return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Execute a SELECT query and return all rows.
   * 
   * @param {string} sql - The SQL query to execute.
   * @param {any[]} [params=[]] - Optional array of parameters to bind to the SQL query.
   * @returns {Promise<any[]>} A promise that resolves to an array of rows.
   */
  async query(sql: string, params: any[] = []): Promise<any[]> {
      const result = await this._executeQuery(sql, params);
      return result.rows;
  }

  /**
   * Internal method to send SQL queries to rqlite's HTTP API.
   * 
   * @param {string} sql - The SQL query to execute.
   * @param {any[]} params - Parameters to bind to the SQL query.
   * @returns {Promise<any>} A promise that resolves to the JSON response from rqlite.
   */
  private async _executeQuery(sql: string, params: any[]): Promise<any> {
      const response = await fetch(`${this.baseUrl}/db/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sql, params }),
      });
      return response.json();
  }

  /**
   * Prepare a SQL statement for execution.
   * 
   * @param {string} sql - The SQL query to prepare.
   * @returns {Statement} A prepared statement object.
   */
  prepare(sql: string): Statement {
      return new Statement(this, sql);
  }
}

/**
* Class representing a prepared SQL statement in rqlite.
* 
* This class allows binding of parameters to the query and execution through various methods like `all()`, `get()`, and `run()`.
*/
export class Statements {
  private db: RqliteDatabase;
  private sql: string;
  private params: any[];

  /**
   * Create a new prepared SQL statement.
   * 
   * @param {RqliteDatabase} db - The rqlite database instance.
   * @param {string} sql - The SQL query to prepare.
   */
  constructor(db: RqliteDatabase, sql: string) {
      this.db = db;
      this.sql = sql;
      this.params = [];
  }

  /**
   * Bind parameters to the SQL query.
   * Unlike some native libraries, `bind()` directly binds the parameters, and 
   * you don't need to call an extra method to run them after binding.
   * 
   * @param {...any[]} params - The parameters to bind.
   * @returns {Statement} The current statement instance for method chaining.
   */
  bind(...params: any[]): this {
      this.params = params;
      return this;
  }

  /**
   * Execute the query and return all rows.
   * 
   * @returns {Promise<any[]>} A promise that resolves to an array of rows.
   */
  async all(): Promise<any[]> {
      return await this.db.query(this.sql, this.params);
  }

  /**
   * Execute the query and return a single row.
   * 
   * @returns {Promise<any | null>} A promise that resolves to the first row of the result set, or null if no rows found.
   */
  async get(): Promise<any | null> {
      return await this.db.get(this.sql, this.params);
  }

  /**
   * Execute a non-query SQL statement (INSERT, UPDATE, DELETE).
   * 
   * @returns {Promise<{ changes: number; lastInsertRowid: number }>} A promise that resolves to the result of the SQL execution.
   */
  async run(): Promise<{ changes: number; lastInsertRowid: number }> {
      return await this.db.run(this.sql, this.params);
  }

  /**
   * Return the values of the first column from all rows.
   * 
   * @returns {Promise<any[]>} A promise that resolves to an array of values from the first column.
   */
  async values(): Promise<any[]> {
      const rows = await this.all();
      return rows.map(row => Object.values(row)[0]);
  }

  /**
   * Finalize the statement, marking it as complete.
   * This method clears the SQL query and parameters.
   * 
   * @returns {Statement} The current statement instance.
   */
  finalize(): this {
      this.sql = '';
      this.params = [];
      return this;
  }

  /**
   * Convert the SQL query to a string.
   * 
   * @returns {string} The SQL query as a string.
   */
  toString(): string {
      return this.sql;
  }
}
