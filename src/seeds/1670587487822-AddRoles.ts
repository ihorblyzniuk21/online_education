import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedRoles1670587487822 implements MigrationInterface {
  name = 'SeedRoles1670587487822';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO roles (value, description) VALUES ('SUPER_ADMIN', 'Super administrator'), ('ADMIN', 'Administrator'), ('HEAD_TEACHER', 'Head teacher'), ('TEACHER', 'Teacher'), ('STUDENT', 'Student'), ('PARENT', 'Parent')`,
    );
  }

  public async down(): Promise<void> {}
}
