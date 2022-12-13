import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSchool1670918561234 implements MigrationInterface {
    name = 'AddSchool1670918561234'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "schools" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "region" character varying NOT NULL, "district" character varying NOT NULL, "city" character varying NOT NULL, CONSTRAINT "PK_95b932e47ac129dd8e23a0db548" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "schoolId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_435e192698a6b7d10849295643d" FOREIGN KEY ("schoolId") REFERENCES "schools"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_435e192698a6b7d10849295643d"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "schoolId"`);
        await queryRunner.query(`DROP TABLE "schools"`);
    }

}
