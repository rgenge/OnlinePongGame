import { ClassProvider } from "@nestjs/common";
import { UserRepository } from "./user.repository";
import { InMemory } from "./inMemory.repository";

export const UserRepositoryProvider: ClassProvider = {
  provide: UserRepository,
  useClass: InMemory
}