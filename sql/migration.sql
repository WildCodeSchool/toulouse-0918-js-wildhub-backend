ALTER TABLE `projects` CHANGE `id` `iid` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `projects` CHANGE `githubId` `id` INT(11) NOT NULL;

ALTER TABLE `users` CHANGE `id` `iid` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `users` CHANGE `githubId` `id` INT(11) NOT NULL;

ALTER TABLE `projects_languages` CHANGE `id` `iid` INT(11) NOT NULL AUTO_INCREMENT;
ALTER TABLE `languages` CHANGE `id` `iid` INT(11) NOT NULL AUTO_INCREMENT;