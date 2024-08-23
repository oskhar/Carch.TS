export default class Blueprint {
  private columns: string[] = [];
  private modifiers: Record<string, string[]> = {};
  private lastColumn: string | null = null;

  private indexes: string[] = [];

  id(columnName = "id"): Blueprint {
    this.columns.push(`${columnName} SERIAL PRIMARY KEY`);
    this.lastColumn = columnName;
    return this;
  }

  primary(columnName?: string): Blueprint {
    const col = columnName || this.lastColumn;
    if (!col) {
      throw new Error("No column specified for primary key.");
    }
    this.columns.push(`PRIMARY KEY (${col})`);
    return this;
  }

  string(columnName: string, length = 255): Blueprint {
    this.columns.push(`${columnName} VARCHAR(${length})`);
    this.lastColumn = columnName;
    return this;
  }

  text(columnName: string): Blueprint {
    this.columns.push(`${columnName} TEXT`);
    this.lastColumn = columnName;
    return this;
  }

  enum(columnName: string, values: string[]): Blueprint {
    this.columns.push(
      `${columnName} VARCHAR(255) CHECK (${columnName} IN ('${values.join(
        "', '"
      )}'))`
    );
    this.lastColumn = columnName;
    return this;
  }

  integer(columnName: string): Blueprint {
    this.columns.push(`${columnName} INTEGER`);
    this.lastColumn = columnName;
    return this;
  }

  bigInteger(columnName: string): Blueprint {
    this.columns.push(`${columnName} BIGINT`);
    this.lastColumn = columnName;
    return this;
  }

  boolean(columnName: string): Blueprint {
    this.columns.push(`${columnName} BOOLEAN`);
    this.lastColumn = columnName;
    return this;
  }

  timestamp(columnName: string): Blueprint {
    this.columns.push(`${columnName} TIMESTAMP`);
    this.lastColumn = columnName;
    return this;
  }

  nullable(columnName?: string): Blueprint {
    const col = columnName || this.lastColumn;
    if (!col) {
      throw new Error("No column specified for nullable modifier.");
    }
    this.modifiers[col] = this.modifiers[col] || [];
    this.modifiers[col].push("NULL");
    return this;
  }

  notNullable(columnName?: string): Blueprint {
    const col = columnName || this.lastColumn;
    if (!col) {
      throw new Error("No column specified for not nullable modifier.");
    }
    this.modifiers[col] = this.modifiers[col] || [];
    this.modifiers[col].push("NOT NULL");
    return this;
  }

  unique(columnName?: string): Blueprint {
    const col = columnName || this.lastColumn;
    if (!col) {
      throw new Error("No column specified for unique modifier.");
    }
    this.modifiers[col] = this.modifiers[col] || [];
    this.modifiers[col].push("UNIQUE");
    return this;
  }

  default(value: string | number | boolean, columnName?: string): Blueprint {
    const col = columnName || this.lastColumn;
    if (!col) {
      throw new Error("No column specified for default value.");
    }
    this.modifiers[col] = this.modifiers[col] || [];
    if (typeof value === "string") {
      this.modifiers[col].push(`DEFAULT '${value}'`);
    } else {
      this.modifiers[col].push(`DEFAULT ${value}`);
    }
    return this;
  }

  foreign(columnName: string, references: string, on: string): Blueprint {
    this.columns.push(
      `FOREIGN KEY (${columnName}) REFERENCES ${on}(${references})`
    );
    this.lastColumn = columnName;
    return this;
  }

  index(columnName: string): Blueprint {
    const col = columnName || this.lastColumn;
    if (!col) {
      throw new Error("No column specified for index.");
    }
    this.indexes.push(`${col}`);
    return this;
  }

  rememberToken(): Blueprint {
    this.string("remember_token", 100).nullable();
    return this;
  }

  timestamps(): Blueprint {
    this.timestamp("created_at").default("NOW()");
    this.timestamp("updated_at").nullable();
    return this;
  }

  softDeletes(): Blueprint {
    this.timestamp("deleted_at").nullable();
    return this;
  }

  private applyModifiers(column: string): string {
    const [columnName] = column.split(" ");
    const modifiers = this.modifiers[columnName];
    return modifiers ? `${column} ${modifiers.join(" ")}` : column;
  }

  toSql(tableName: string): string {
    const columnsWithModifiers = this.columns.map((col) =>
      this.applyModifiers(col)
    );

    let sql = `CREATE TABLE ${tableName} (${columnsWithModifiers.join(", ")})`;

    if (this.indexes.length) {
      this.indexes.forEach((indexColumn) => {
        sql += `; CREATE INDEX ${indexColumn}_index ON ${tableName} (${indexColumn})`;
      });
    }

    sql += ";";
    return sql;
  }

  dropTableSql(tableName: string): string {
    return `DROP TABLE IF EXISTS ${tableName};`;
  }
}
