import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  private users: any[] = [];

  async createUser(email: string, password: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = { id: uuidv4(), email, password: hashed };
    this.users.push(user);
    return { id: user.id, email: user.email };
  }

  async findUserByEmail(email: string) {
    return this.users.find((user) => user.email === email);
  }

  async findUserById(id: string) {
    return this.users.find((user) => user.id === id);
  }

  async updateUser(id: string, email: string, password: string) {
    const user = await this.findUserById(id);
    if (!user) return null;
    user.email = email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    return { id: user.id, email: user.email };
  }

  async deleteUser(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) return null;
    const deletedUser = this.users.splice(index, 1)[0];
    return { id: deletedUser.id, email: deletedUser.email };
  }

  async validateUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return { id: user.id, email: user.email };
    }
    return null;
  }
}
