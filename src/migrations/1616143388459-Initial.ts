import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1616143388459 implements MigrationInterface {
    name = 'Initial1616143388459'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `schedules` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `dateCreated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `dateUpdated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `message` text NOT NULL, `scheduledTime` datetime NOT NULL, `status` enum ('NEW', 'RUNNING', 'COMPLETED') NOT NULL DEFAULT 'NEW', PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `schedule_recipient_statuses` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `dateCreated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `dateUpdated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `deliveryTime` datetime NULL, `messageIdentifier` varchar(255) NULL, `status` enum ('SENT', 'ACCEPTD', 'DELIVRD', 'UNDELIV', 'UNKNOWN') NOT NULL DEFAULT 'SENT', `recipientId` int NULL, `scheduleId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `recipient_list_items` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `dateCreated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `dateUpdated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `phoneNumber` varchar(255) NOT NULL, `masterListId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `recipient_lists` (`id` int NOT NULL AUTO_INCREMENT, `uuid` varchar(36) NOT NULL, `dateCreated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `dateUpdated` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `name` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `schedules_recipients_list_recipient_lists` (`schedulesId` int NOT NULL, `recipientListsId` int NOT NULL, INDEX `IDX_82ff7ae7c389c5b90762f72f20` (`schedulesId`), INDEX `IDX_0557e8106f9f495c5c8a2a24c7` (`recipientListsId`), PRIMARY KEY (`schedulesId`, `recipientListsId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `schedule_recipient_statuses` ADD CONSTRAINT `FK_99868e223b1cb16d5a1fde6d03d` FOREIGN KEY (`recipientId`) REFERENCES `recipient_list_items`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `schedule_recipient_statuses` ADD CONSTRAINT `FK_9961c9df6be1d4650bcb9643a0d` FOREIGN KEY (`scheduleId`) REFERENCES `schedules`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `recipient_list_items` ADD CONSTRAINT `FK_f5ee57b8c23e12429838c7e4802` FOREIGN KEY (`masterListId`) REFERENCES `recipient_lists`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `schedules_recipients_list_recipient_lists` ADD CONSTRAINT `FK_82ff7ae7c389c5b90762f72f205` FOREIGN KEY (`schedulesId`) REFERENCES `schedules`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
        await queryRunner.query("ALTER TABLE `schedules_recipients_list_recipient_lists` ADD CONSTRAINT `FK_0557e8106f9f495c5c8a2a24c75` FOREIGN KEY (`recipientListsId`) REFERENCES `recipient_lists`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `schedules_recipients_list_recipient_lists` DROP FOREIGN KEY `FK_0557e8106f9f495c5c8a2a24c75`");
        await queryRunner.query("ALTER TABLE `schedules_recipients_list_recipient_lists` DROP FOREIGN KEY `FK_82ff7ae7c389c5b90762f72f205`");
        await queryRunner.query("ALTER TABLE `recipient_list_items` DROP FOREIGN KEY `FK_f5ee57b8c23e12429838c7e4802`");
        await queryRunner.query("ALTER TABLE `schedule_recipient_statuses` DROP FOREIGN KEY `FK_9961c9df6be1d4650bcb9643a0d`");
        await queryRunner.query("ALTER TABLE `schedule_recipient_statuses` DROP FOREIGN KEY `FK_99868e223b1cb16d5a1fde6d03d`");
        await queryRunner.query("DROP INDEX `IDX_0557e8106f9f495c5c8a2a24c7` ON `schedules_recipients_list_recipient_lists`");
        await queryRunner.query("DROP INDEX `IDX_82ff7ae7c389c5b90762f72f20` ON `schedules_recipients_list_recipient_lists`");
        await queryRunner.query("DROP TABLE `schedules_recipients_list_recipient_lists`");
        await queryRunner.query("DROP TABLE `recipient_lists`");
        await queryRunner.query("DROP TABLE `recipient_list_items`");
        await queryRunner.query("DROP TABLE `schedule_recipient_statuses`");
        await queryRunner.query("DROP TABLE `schedules`");
    }

}
