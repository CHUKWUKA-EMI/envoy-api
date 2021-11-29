import {MigrationInterface, QueryRunner} from "typeorm";

export class updatedUserTable1636867125337 implements MigrationInterface {
    name = 'updatedUserTable1636867125337'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "envoy_users" ADD "isOnline" number DEFAULT 0 NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "envoy_users" DROP COLUMN "isOnline"`);
    }

}
