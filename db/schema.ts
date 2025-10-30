import { pgTable, serial, varchar, text, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  version: varchar("version", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const evaluations = pgTable("evaluations", {
  id: serial("id").primaryKey(),
  modelId: integer("model_id")
    .notNull()
    .references(() => models.id),
  vote: boolean("vote").notNull(), // true = thumbs up, false = thumbs down
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
