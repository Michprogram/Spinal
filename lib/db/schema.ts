import { pgTable, serial, text, timestamp, varchar, integer } from "drizzle-orm/pg-core"

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  age: integer("age").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export type Comment = typeof comments.$inferSelect
export type NewComment = typeof comments.$inferInsert

export const registrations = pgTable("registrations", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  rut: varchar("rut", { length: 12 }).notNull(),
  password: varchar("password", { length: 255 }),
  points: integer("points").default(0),
  createdAt: timestamp("created_at").defaultNow(),
})

export type Registration = typeof registrations.$inferSelect
export type NewRegistration = typeof registrations.$inferInsert

export const canCodes = pgTable("can_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  code: varchar("code", { length: 13 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

export type CanCode = typeof canCodes.$inferSelect
export type NewCanCode = typeof canCodes.$inferInsert
