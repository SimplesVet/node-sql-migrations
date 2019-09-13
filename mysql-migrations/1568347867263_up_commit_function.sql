DROP FUNCTION IF EXISTS fn_hello;

CREATE FUNCTION fn_hello()
returns varchar(255)
begin
  return 'Hello';
end;
;
