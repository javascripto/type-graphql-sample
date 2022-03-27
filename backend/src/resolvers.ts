import { randomUUID } from 'crypto';
import { Context } from 'apollo-server-core';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { User } from "./models/User";
import { validate } from 'class-validator';


@Resolver()
export class HelloResolver {
  @Query(() => String)
  hello(@Ctx() context: Context) {
    console.log({ context });
    return "Hello World!";
  }
}

@Resolver(User)
export class UserResolver {
  private data: User[] = [];

  @Query(() => [User])
  users(): User[] {
    return this.data;
  }

  @Mutation(() => User)
  async createUser(@Arg('name') name: string): Promise<User> {
    const user = Object.assign(new User(), { id: randomUUID(), name});
    const errors = await validate(user);
    if (errors.length) throw new Error(`Validation error`)
    this.data.push(user);
    return user;
  }

  @Mutation(() => Boolean)
  deleteUser(@Arg('id') id: string): boolean {
    const index = this.data.findIndex(user => user.id === id);
    if (index >= 0) {
      this.data.splice(index, 1);
      return true;
    }
    return false;
  }
}
