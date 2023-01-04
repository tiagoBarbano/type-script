import db, { sql } from '../connectors/dbconnector';

export async function insertUser(num_item: number, nome_item: string) {
  await db.query(sql`
    INSERT INTO users (num_item, nome_item)
    VALUES (${num_item}, ${nome_item})
  `);
}

export async function getAllUser() {
  const users = await db.query(sql`
    SELECT * FROM users`);

  return users;
}

export async function getUser(id: number) {
  const users = await db.query(sql`
    SELECT * FROM users
    WHERE id=${id}
  `);
  if (users.length === 0) {
    return null;
  }
  return users[0];
}

export async function deleteUser(id: number) {
  await db.query(sql`
    DELETE FROM users
    WHERE id=${id}
  `);
}

export async function updateUser(id: number, num_item: number, nome_item: string) {
  await db.query(sql`
    UPDATE users
    SET num_item=${num_item}, nome_item=${nome_item}
    WHERE id=${id}
  `);
}