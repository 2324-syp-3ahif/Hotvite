CREATE TABLE user (
                      id TEXT PRIMARY KEY,
                      username TEXT,
                      email TEXT,
                      password TEXT,
                      aboutme TEXT
);

CREATE TABLE event (
                       id TEXT PRIMARY KEY,
                       title VARCHAR(255),
                       description TEXT,
                       address_id TEXT,
                       location_id TEXT,
                       max_participants INTEGER,
                       price REAL,
                       type TEXT,
                       chat TEXT,
                       creator_id TEXT,
                       created_at INTEGER,
                       event_start_date INTEGER,
                       event_end_date INTEGER
);

CREATE TABLE requirement (
                           event_id TEXT,
                           text TEXT,
                           FOREIGN KEY (event_id) REFERENCES event(id)
);

CREATE TABLE address (
                         id TEXT PRIMARY KEY,
                         street VARCHAR(255),
                         city VARCHAR(255),
                         country VARCHAR(255)
);

CREATE TABLE event_participant (
                                   event_id TEXT,
                                   user_id TEXT,
                                   FOREIGN KEY (event_id) REFERENCES event(id),
                                   FOREIGN KEY (user_id) REFERENCES user(id),
                                   PRIMARY KEY (event_id, user_id)
);

CREATE TABLE location (
                          id TEXT PRIMARY KEY,
                          latitude TEXT,
                          longitude TEXT
);

CREATE TABLE user_saved_events (
                                   event_id TEXT,
                                   user_id TEXT,
                                   FOREIGN KEY (event_id) REFERENCES event(id),
                                   FOREIGN KEY (user_id) REFERENCES user(id),
                                   PRIMARY KEY (event_id, user_id)
);

CREATE TABLE chat (
                      id TEXT PRIMARY KEY,
                      about TEXT,
                      name VARCHAR(255)
);

CREATE TABLE user_notification (
                                   user_id TEXT,
                                   message TEXT,
                                   FOREIGN KEY (user_id) REFERENCES user(id)
);

CREATE TABLE message (
                         chat_id TEXT,
                         user_id TEXT,
                         content TEXT,
                         send TIMESTAMP,
                         FOREIGN KEY (chat_id) REFERENCES chat(id),
                         FOREIGN KEY (user_id) REFERENCES user(id)
);
