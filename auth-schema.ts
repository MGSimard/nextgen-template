import { pgTable, text, integer, bigint, timestamp, boolean } from "drizzle-orm/pg-core";
			
export const users = pgTable("users", {
					id: text("id").primaryKey(),
					name: text('name').notNull(),
 email: text('email').notNull().unique(),
 emailVerified: boolean('email_verified').notNull(),
 image: text('image'),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull(),
 role: text('role'),
 banned: boolean('banned'),
 banReason: text('ban_reason'),
 banExpires: timestamp('ban_expires')
				});

export const sessions = pgTable("sessions", {
					id: text("id").primaryKey(),
					expiresAt: timestamp('expires_at').notNull(),
 token: text('token').notNull().unique(),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull(),
 ipAddress: text('ip_address'),
 userAgent: text('user_agent'),
 userId: text('user_id').notNull().references(()=> users.id),
 impersonatedBy: text('impersonated_by'),
 activeOrganizationId: text('active_organization_id')
				});

export const accounts = pgTable("accounts", {
					id: text("id").primaryKey(),
					accountId: text('account_id').notNull(),
 providerId: text('provider_id').notNull(),
 userId: text('user_id').notNull().references(()=> users.id),
 accessToken: text('access_token'),
 refreshToken: text('refresh_token'),
 idToken: text('id_token'),
 accessTokenExpiresAt: timestamp('access_token_expires_at'),
 refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
 scope: text('scope'),
 password: text('password'),
 createdAt: timestamp('created_at').notNull(),
 updatedAt: timestamp('updated_at').notNull()
				});

export const verifications = pgTable("verifications", {
					id: text("id").primaryKey(),
					identifier: text('identifier').notNull(),
 value: text('value').notNull(),
 expiresAt: timestamp('expires_at').notNull(),
 createdAt: timestamp('created_at'),
 updatedAt: timestamp('updated_at')
				});

export const organizations = pgTable("organizations", {
					id: text("id").primaryKey(),
					name: text('name').notNull(),
 slug: text('slug').unique(),
 logo: text('logo'),
 createdAt: timestamp('created_at').notNull(),
 metadata: text('metadata')
				});

export const members = pgTable("members", {
					id: text("id").primaryKey(),
					organizationId: text('organization_id').notNull().references(()=> organizations.id),
 userId: text('user_id').notNull().references(()=> users.id),
 role: text('role').notNull(),
 createdAt: timestamp('created_at').notNull()
				});

export const invitations = pgTable("invitations", {
					id: text("id").primaryKey(),
					organizationId: text('organization_id').notNull().references(()=> organizations.id),
 email: text('email').notNull(),
 role: text('role'),
 status: text('status').notNull(),
 expiresAt: timestamp('expires_at').notNull(),
 inviterId: text('inviter_id').notNull().references(()=> users.id)
				});

export const rateLimits = pgTable("rate_limits", {
					id: text("id").primaryKey(),
					key: text('key'),
 count: integer('count'),
 lastRequest: bigint('last_request', { mode: 'number' })
				});
