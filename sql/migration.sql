ALTER TABLE `projects` CHANGE `id` `iid` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `projects` CHANGE `githubId` `id` INT(11) NOT NULL;

ALTER TABLE `users` CHANGE `id` `iid` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `users` CHANGE `githubId` `id` INT(11) NOT NULL;

ALTER TABLE `projects_languages` CHANGE `id` `iid` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `languages` CHANGE `id` `iid` INT(11) NOT NULL AUTO_INCREMENT;


----

ALTER TABLE `projects` ADD COLUMN registeredAt TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE `projects` ADD COLUMN createdAt TIMESTAMP NULL;
ALTER TABLE `projects` ADD COLUMN updatedAt TIMESTAMP NULL;

ALTER TABLE `projects` CHANGE `createdAt` `createdAt` TIMESTAMP NOT NULL;
ALTER TABLE `projects` CHANGE `updatedAt` `updatedAt` TIMESTAMP NOT NULL;