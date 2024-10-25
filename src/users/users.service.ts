import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { User } from '../entities/user.entity';
import * as argon2 from 'argon2';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOneById(id: number): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByIdWithEssay(userId: number): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: { id: userId },
      relations: ['essay'],
    });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ email });
  }

  async findAllUsersWithEssay() {
    return await this.usersRepository.find({ relations: ['essays'] });
  }

  async updateHashedRefreshToken(
    id: number,
    hashedRefreshToken: string,
  ): Promise<UpdateResult | undefined> {
    return await this.usersRepository.update(
      { id: id },
      { hashedRefreshToken },
    );
  }

  async saveUser(user: User) {
    return await this.usersRepository.save(user);
  }

  async createUser(
    name: string,
    email: string,
    password: string,
  ): Promise<User> {
    const hashedPassword = await argon2.hash(password);
    const newUser = this.usersRepository.create({
      name: name,
      email: email,
      hashedPassword: hashedPassword,
    });
    return await this.usersRepository.save(newUser);
  }
}
