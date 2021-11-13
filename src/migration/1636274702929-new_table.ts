import {MigrationInterface, QueryRunner} from "typeorm";

export class newTable1636274702929 implements MigrationInterface {
    name = 'newTable1636274702929'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "envoy_users" ("id" varchar2(255), "firstName" varchar2(255) NOT NULL, "lastName" varchar2(255) NOT NULL, "email" varchar2(255) NOT NULL, "password" varchar2(255) NOT NULL, "imageUrl" varchar2(255), "imagekit_id" varchar2(255), "accountEnabled" number DEFAULT 0 NOT NULL, "role" varchar2(255) DEFAULT 'user' NOT NULL, "createdAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, "updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL, CONSTRAINT "UQ_56debb810bf8cb5fe2920c53cb7" UNIQUE ("email"), CONSTRAINT "PK_71c1db1afc418a88006b54aea78" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "envoy_users"`);
    }

}
