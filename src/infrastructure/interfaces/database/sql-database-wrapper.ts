export interface SQLDatabaseWrapper {
  query(queryString: string, queryConfig?: any[]): Promise<{ rows: any[] }>;
}
