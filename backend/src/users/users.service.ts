import { Injectable, Inject } from '@nestjs/common';
import { DRIZZLE } from '../database/database.module';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../database/schema';
import { eq, sql } from 'drizzle-orm';

@Injectable()
export class UsersService {
  constructor(
    @Inject(DRIZZLE) private db: NodePgDatabase<typeof schema>,
  ) {}

  async create(name: string, email: string, passwordHash: string): Promise<schema.User> {
    const [newUser] = await this.db
      .insert(schema.users)
      .values({ name, email, passwordHash })
      .returning();
    return newUser;
  }

  async findByEmail(email: string): Promise<schema.User | null> {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .limit(1);
    return user || null;
  }

  async findById(id: string): Promise<schema.User | null> {
    const [user] = await this.db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .limit(1);
    return user || null;
  }

  async incrementTokenVersion(userId: string): Promise<schema.User | null> {
    const [updatedUser] = await this.db
      .update(schema.users)
      .set({
        tokenVersion: sql`${schema.users.tokenVersion} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(schema.users.id, userId))
      .returning();
    return updatedUser || null;
  }
}
