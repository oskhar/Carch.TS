export default class Blueprint {
  private columns: string[] = [];
  private modifiers: Record<string, string[]> = {};
  private lastColumn: string | null = null;
  private indexes: string[] = [];
  private foreignKeys: string[] = [];

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

  foreignId(columnName: string): Blueprint {
    this.columns.push(`${columnName} INTEGER`);
    this.lastColumn = columnName;
    return this;
  }

  constrained(tableName?: string): Blueprint {
    if (!this.lastColumn) {
      throw new Error("No column specified for foreign key constraint.");
    }

    const inferredTableName =
      tableName || this.deriveTableNameFromColumn(this.lastColumn);

    this.foreignKeys.push(
      `FOREIGN KEY (${this.lastColumn}) REFERENCES ${inferredTableName}(id)`
    );
    return this;
  }

  private deriveTableNameFromColumn(columnName: string): string {
    if (columnName.endsWith("_id")) {
      const baseName = columnName.replace(/_id$/, "");

      if (/[^aeiou]y$/.test(baseName)) {
        return baseName.replace(/y$/, "ies");
      }

      if (/s$/.test(baseName)) {
        return baseName;
      }

      return baseName + "s";
    }

    return columnName;
  }

  foreign(columnName: string): Blueprint {
    this.lastColumn = columnName;
    return this;
  }

  references(referencedColumn: string): Blueprint {
    if (!this.lastColumn) {
      throw new Error("No column specified for foreign key reference.");
    }
    this.foreignKeys.push(
      `FOREIGN KEY (${this.lastColumn}) REFERENCES ${referencedColumn}`
    );
    return this;
  }

  on(tableName: string): Blueprint {
    const lastForeignKey = this.foreignKeys.pop();
    if (lastForeignKey) {
      this.foreignKeys.push(`${lastForeignKey}(${tableName})`);
    } else {
      throw new Error("No foreign key found to reference a table.");
    }
    return this;
  }

  onDelete(action: string): Blueprint {
    const lastForeignKey = this.foreignKeys.pop();
    if (lastForeignKey) {
      this.foreignKeys.push(`${lastForeignKey} ON DELETE ${action}`);
    } else {
      throw new Error("No foreign key found to add onDelete action.");
    }
    return this;
  }

  onUpdate(action: string): Blueprint {
    const lastForeignKey = this.foreignKeys.pop();
    if (lastForeignKey) {
      this.foreignKeys.push(`${lastForeignKey} ON UPDATE ${action}`);
    } else {
      throw new Error("No foreign key found to add onUpdate action.");
    }
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

    let sql = `CREATE TABLE ${tableName} (${columnsWithModifiers.join(", ")}`;

    if (this.foreignKeys.length) {
      sql += `, ${this.foreignKeys.join(", ")}`;
    }

    sql += ")";

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
