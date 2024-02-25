import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core'
import type { AdapterAccount } from '@auth/core/adapters'

export const users = sqliteTable('user', {
    id: text('id').notNull().primaryKey(),
    name: text('name'),
    email: text('email').notNull(),
    emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
    image: text('image'),
    isAdmin: integer('isAdmin', { mode: 'boolean' }).default(false),
})

export const accounts = sqliteTable(
    'account',
    {
        userId: text('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type').$type<AdapterAccount['type']>().notNull(),
        provider: text('provider').notNull(),
        providerAccountId: text('providerAccountId').notNull(),
        refresh_token: text('refresh_token'),
        access_token: text('access_token'),
        expires_at: integer('expires_at'),
        token_type: text('token_type'),
        scope: text('scope'),
        id_token: text('id_token'),
        session_state: text('session_state'),
    },
    (account) => ({
        compoundKey: primaryKey({
            columns: [account.provider, account.providerAccountId],
        }),
    }),
)

export const sessions = sqliteTable('session', {
    sessionToken: text('sessionToken').notNull().primaryKey(),
    userId: text('userId')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})

export const verificationTokens = sqliteTable(
    'verificationToken',
    {
        identifier: text('identifier').notNull(),
        token: text('token').notNull(),
        expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
    },
    (vt) => ({
        compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
    }),
)

export const products = sqliteTable('product', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name'),
    image: text('image', { mode: 'json' }).$type<string[]>(),
    description: text('description'),
})

export const posts = sqliteTable('posts', {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    name: text('name'),
    images: text('images', { mode: 'json' }).$type<string[]>(),
    content: text('content'),
})
