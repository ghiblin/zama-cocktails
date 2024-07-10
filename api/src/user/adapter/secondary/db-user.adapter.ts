import { Inject, Injectable, Logger } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from '../../../drizzle/schema';
import { PG_CONNECTION } from '../../../drizzle/constants';

import { Result } from '../../../utils/result';
import { CreateUserProps, UserProps } from '../../domain/user.entity';
import { eq, sql } from 'drizzle-orm';
import { IUserAdapter } from '../../repositories/user.repository';

@Injectable()
export class DbUserAdapter implements IUserAdapter {
  #logger = new Logger(DbUserAdapter.name);

  constructor(
    @Inject(PG_CONNECTION) private readonly conn: NodePgDatabase<typeof schema>,
  ) {}

  async createUser({
    email,
    name,
    picture,
  }: CreateUserProps): Promise<Result<UserProps>> {
    this.#logger.verbose(
      `createUser: email=${email}, name=${name}, picture=${picture}`,
    );

    try {
      const rows = await this.conn
        .insert(schema.users)
        .values({
          email,
          name: name ?? null,
          picture: picture ?? null,
        })
        .returning({ id: schema.users.id })
        .onConflictDoUpdate({
          target: schema.users.email,
          set: {
            name: sql.raw(`excluded.${schema.users.name.name}`),
            picture: sql.raw(`excluded.${schema.users.picture.name}`),
          },
        });

      if (rows.length) {
        return new Result(
          {
            id: rows[0].id,
            email,
            name,
            picture,
          },
          null,
        );
      }
    } catch (error) {
      this.#logger.warn(`Failed to create user: ${error}`);
    }
    return new Result<UserProps>(null, new Error('Failed to create user'));
  }

  async findUserByEmail(email: string): Promise<Result<UserProps>> {
    this.#logger.verbose(`findUserByEmail: ${email}`);

    try {
      const user = await this.conn.query.users.findFirst({
        where: eq(schema.users.email, email),
      });
      if (!user) {
        return new Result<UserProps>(
          null,
          new Error(`User ${email} not found`),
        );
      }
      return new Result(user, null);
    } catch (error) {
      this.#logger.warn(`Failed to query user by email: ${error}`);
      return new Result<UserProps>(
        null,
        new Error(`Failed to query user by email ${email}`),
      );
    }
  }

  async findUserById(id: string): Promise<Result<UserProps>> {
    this.#logger.verbose(`findUserById: ${id}`);
    try {
      const user = await this.conn.query.users.findFirst({
        where: eq(schema.users.id, id),
      });
      if (!user) {
        return new Result<UserProps>(null, new Error(`User ${id} not found`));
      }
      return new Result(user, null);
    } catch (error) {
      this.#logger.warn(`Failed to query user by id: ${error}`);
      return new Result<UserProps>(
        null,
        new Error(`Failed to query user by id ${id}`),
      );
    }
  }
}
