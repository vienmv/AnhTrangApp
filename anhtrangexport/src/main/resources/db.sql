CREATE TABLE IF NOT EXISTS `persistent_logins` (
  `username` varchar(64) NOT NULL,
  `series` varchar(64) NOT NULL,
  `token` varchar(64) NOT NULL,
  `last_used` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`series`)
);

INSERT INTO user(id, created_date, enabled, name, phone, password)
VALUES (1, now(), 1, 'admin', '0123456789','$2a$12$cZpjQBhfxpEd3xBoywRTU.jx3f.UD/ygj/nR373ebd/0uZe.xtYZ2')
ON DUPLICATE KEY UPDATE id = 1;

INSERT INTO user_role(user_id, role)
VALUES (1, 'ROLE_ADMIN') ON DUPLICATE KEY UPDATE user_id = 1, role='ROLE_ADMIN';

INSERT INTO versions(id, version)
VALUES (1, 1) ON DUPLICATE KEY UPDATE id = 1;