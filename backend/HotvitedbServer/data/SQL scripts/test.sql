CREATE TABLE TEST
(
    NAME TEXT PRIMARY KEY
);

select *
from user;

select *
from event;

delete from event;

delete from event_participant
where event_id = 'eID'
AND user_id = 'uID';