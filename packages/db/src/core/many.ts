import { filterItems } from "../query/filter";
import { selectItems } from "../query/select";
import { Filter } from "../query/types";
import { clone } from "./clone";
import { SyncKey } from "./createDB";
import { SyncTable } from "./createTable";

/**
 * Retrieve all entities from `table`.
 *
 * @example
 * const db = createDB();
 * const userTable = createTable<User>(db, "users")();
 * const allUsers = many(userTable);
 */
export async function many<T, P extends keyof T>(table: SyncTable<T, P>): Promise<T[]>;

/**
 * Retrieve all entities from `table` that match the given `filter`.
 *
 * @example
 * const db = createDB();
 * const userTable = createTable<User>(db, "users")();
 * // All users called 'Alice'
 * const allUsersNamedAlice = many(userTable, {
 *   where: {
 *     name: "Alice"
 *   }
 * });
 * // All users aged 25 and up
 * const allUsersOlderThan25 = many(userTable, {
 *   where: {
 *     age: gt(25)
 *   }
 * });
 */
export async function many<T, P extends keyof T>(
  table: SyncTable<T, P>,
  filter: Filter<T>
): Promise<T[]>;

export async function many<T, P extends keyof T>(
  table: SyncTable<T, P>,
  filter?: Filter<T>
): Promise<T[]> {
  if (!filter) {
    return table[SyncKey].storage.primary.valuesArray();
  }

  let items: T[] = [];

  if (filter.where) {
    // Select items from the db
    items = await selectItems(table, filter.where);

    // Filter items
    items = filterItems(table, items, filter.where);
  }

  return table[SyncKey].db[SyncKey].options.clone ? clone(items) : items;
}