import { pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name'),
  picture: text('picture'),
});

export const apiKeyType = pgEnum('type', ['read', 'write']);

export const apiKeys = pgTable('apikeys', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  type: apiKeyType('type').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
