DROP PROCEDURE IF EXISTS sp_git_status;

CREATE PROCEDURE sp_git_status()
BEGIN
  select 'Status OK' AS message;
END
