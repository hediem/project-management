import { capitalize } from "../helpers/functions";
import ActionRecord from "./ActionRecord";
import { config, query } from "../helpers/config";
import { CLASSES } from "../types/ActionRecordTypes";


// TODO: set and check primary and foreign keys

export async function tablesChecker() {
  let tables = await query(
    `SELECT TABLE_NAME as tablename, COLUMN_NAME as column_name, COLUMN_TYPE as column_type FROM information_schema.columns WHERE TABLE_SCHEMA = '${config.db.database}';`
  );
  let queries = [];
  tables = tables.reduce(
    (
      total: object,
      value: { tablename: string; column_name: string; column_type: string }
    ) => {
      let tablename = value.tablename;
      let obj = total?.[tablename];
      if (!obj) obj = [];
      total[tablename] = [
        ...obj,
        { name: value.column_name, type: value.column_type },
      ];
      return total;
    },
    {}
  );
  // NOT NULL AUTO_INCREMENT PRIMARY KEY
  Object.keys(CLASSES).forEach((theClass) => {
    let c: ActionRecord = CLASSES[theClass]();
    if (Object.keys(tables).includes(c.tableName)) {
      // c.fields.forEach((classField) => {
      //   let f = tables[theClass].find((v) => v.name === classField.name);
      //   if (!f) {
      //     let q = `ALTER TABLE ${c.tableName} ADD ${
      //       classField.name
      //     } ${classField.property.type}`;
      //     if (typeof classField.size !== "undefined")
      //       q += `(${classField.property.size})`;
      //     if (classField.property.notNull)
      //       q += " NOT NULL"`ALTER TABLE ${c.tableName} ADD ${
      //         classField.name
      //       } ${classField.type}`;
      //     q += ";";
      //     query(q);
      //     if (typeof classField.dependency !== "undefined"){
      //       if (classField.dependency.type === "ispk") query(`ALTER TABLE`)
      //     }
      //   } else if (!classField.type.includes(f.type)) {
      //     query(
      //       `ALTER TABLE ${c.tableName} MODIFY COLUMN ${
      //         classField.name
      //       } ${classField.type};`
      //     );
      //   }
      // });
    } else {
      let keys = [];
      let q = `CREATE TABLE \`${c.tableName}\` (${c.fields
        .map((val) => {
          let str = `\`${val.name}\` ${val.property.type}`;
          if (typeof val.property.size !== "undefined") {
            str += `(${val.property.size})`;
          }
          if (val.property.notNull) {
            str += " NOT NULL";
          }
          if (typeof val.dependency !== "undefined") {
            if (val.dependency.type === "ispk") {
              str += " AUTO_INCREMENT";
              keys.push(` PRIMARY KEY (\`${val.name}\`)`);
            } else if (val.dependency.type === "isfk" && val.dependency.force) {
              keys.push(
                ` FOREIGN KEY (\`${val.name}\`) REFERENCES \`${val.dependency.table}\`(\`${val.dependency.field}\`)`
              );
            }
          }
          return str;
        })
        .join(", ")}`;
      if (keys.length !== 0) q += ", " + keys.join(", ");
      q += ");";
      queries.push(q);
    }
  });
  for (let i = 0; i < queries.length; i++) {
    await query(queries[i]);
  }
  return queries;
}

export default class Controler {
  async Action(query: string, posts: any) {
    let q = query.split("_");
    if (q.length < 2) {
      throw new Error("Wrong Query!?");
    }
    let action = q[0];
    q.splice(0, 1);
    let table = q.reduce((total, value) => {
      return total + capitalize(value);
    }, "");
    if (!Object.keys(CLASSES).includes(table)) {
      throw new Error(`Wrong Tablename!? tablename: ${table}`);
    }
    let x: ActionRecord = CLASSES[table]();
    let result: any;
    switch (capitalize(action)) {
      case "Find":
        let conditions = "",
          fields: string[] = [],
          page = 0,
          count = 0,
          orderBy: string[] = [],
          orderType = "";

        if (posts.conditions) {
          conditions = posts.conditions;
        }
        if (posts.fields) {
          fields = posts.fields.split(",");
        }
        if (posts.page) {
          page = parseInt(posts.page);
        }
        if (posts.count) {
          count = parseInt(posts.count);
        }
        if (posts.orderBy) {
          orderBy = posts.orderBy;
        }
        if (posts.orderType) {
          orderType = posts.orderType;
        }
        result = await x.find(
          conditions,
          fields,[],
          page,
          count,
          orderBy,
          orderType
        );
        break;
      case "Insert":
        result = await x.insert(posts);
        break;
      case "Update":
        result = await x.update(posts.keyvalues, posts.conditions);
        break;
      case "Delete":
        result = await x.delete(posts.conditions);
        break;
      default:
        throw new Error("Wrong Action!?");
    }
    return result;
  }
}
