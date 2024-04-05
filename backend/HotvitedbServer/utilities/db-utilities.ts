import * as sqlite3 from "sqlite3";
import {Address, Chat, Condition, Event, Location, User} from "../model";

export class dbUtility {
    private static db: sqlite3.Database =
        new sqlite3.Database('./data/Hotvitedb.db');

    public static async saveUser(user: User): Promise<boolean> {
        try {
            this.db.run(
                `INSERT INTO user (id, username, email, password, aboutme)
                 VALUES (?, ?, ?, ?, ?)`,
                [user.id, user.username, user.email, user.password, user.aboutme]
            );

            console.log(`User ${user.username} added successfully.`);
            return true;
        } catch (error) {
            console.error('Error inserting new user into database', error);
            return false;
        }
    }

    public static async saveEvent(event: Event): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this.db.serialize(() => {
                    this.db.run('BEGIN TRANSACTION;');


                    //save address
                    this.saveAddress(event.address).catch(error => {
                        console.error('Error inserting new address into database', error);
                        this.db.run('ROLLBACK;');
                        reject(false);
                    });



                    //save location
                    this.saveLocation(event.location).catch(error => {
                        console.error('Error inserting new location into database', error);
                        this.db.run('ROLLBACK;');
                        reject(false);
                    });

                    //save chat
                    this.saveChat(event.chat).catch(error => {
                        console.error('Error inserting new chat into database', error);
                        this.db.run('ROLLBACK;');
                        reject(false);
                    });


                    //save conditions
                    this.saveConditions(event.conditions).catch(error => {
                        console.error('Error inserting new conditions into database', error);
                        this.db.run('ROLLBACK;');
                        reject(false);
                    });


                    //save event
                    this.db.run(
                        `INSERT INTO event ( id
                                           , title
                                           , description
                                           , address_id
                                           , location_id
                                           , type
                                           , creator_id
                                           , status
                                           , chat_id
                                           , created_at
                                           , event_start_date
                                           , event_end_date)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        [event.id
                            , event.title
                            , event.description
                            , event.address.id
                            , event.location.id
                            , event.type
                            , event.creator_id
                            , event.status
                            , event.chat.id
                            , event.created_at
                            , event.event_start_date
                            , event.event_end_date],
                        (error) => {
                            if (error) {
                                console.error('Error inserting new event into database', error);
                                this.db.run('ROLLBACK;');
                                reject(false);
                            } else {
                                this.db.run('COMMIT;');
                                console.log(`Event ${event.title} added successfully.`);
                                resolve(true);
                            }
                        }
                    );
                });
            } catch (error) {
                console.error('Error inserting new event into database', error);
                reject(false);
            }
        });
    }

    private static async saveAddress(address: Address) {
        try {
            this.db.run(
                `INSERT INTO address (id, Street, city, country, state)
                 VALUES (?, ?, ?, ?, ?)`,
                [address.id, address.Street, address.city, address.country, address.state]
            );

            console.log(`Address added successfully.`);
            return true;
        } catch (error) {
            console.error('Error inserting new address into database', error);
            return false;
        }
    }

    private static async saveLocation(location: Location) {
        try {
            this.db.run(
                `INSERT INTO location (id, latitude, longitude)
                 VALUES (?, ?, ?)`,
                [location.id, location.latitude, location.longitude]
            );

            console.log(`Location added successfully.`);
            return true;
        } catch (error) {
            console.error('Error inserting new location into database', error);
            return false;
        }
    }

    private static async saveChat(chat: Chat) {
        try {
            this.db.run(
                `INSERT INTO chat (id, about, name)
                 VALUES (?, ?, ?)`,
                [chat.id, chat.about, chat.name]
            );

            console.log(`Chat added successfully.`);
            return true;
        } catch (error) {
            console.error('Error inserting new chat into database', error);
            return false;
        }
    }


    private static async saveConditions(conditions: Condition[]) {
        try {
            conditions.forEach(condition => {
                this.db.run(
                    `INSERT INTO condition (event_id, text)
                     VALUES (?, ?)`,
                    [condition.event_id, condition.text]
                );

                console.log(`Condition added successfully.`);
            });


            return true;
        } catch (error) {
            console.error('Error inserting new user into database', error);
            return false;
        }
    }

    public static async getTableByValue(table: string, column: string, value: string): Promise<any> {
        try {
            return new Promise((resolve, reject) => {
                this.db.all(`SELECT *
                             FROM ${table}
                             WHERE ${column} = '${value}'`, (err, rows) => {
                    if (err) {
                        console.error('Error fetching $table:', err, {$table: table});
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    public static async updateValueByRowInTableWithCondition(table: string
        , column: string
        , value: string
        , conditionColumn: string
        , conditionValue: string): Promise<any> {
        try {
            return new Promise((resolve, reject) => {
                this.db.all(`UPDATE ${table}
                             set ${column} = '${value}'
                             WHERE ${conditionColumn} = '${conditionValue}'`, (err, rows) => {
                    if (err) {
                        console.error('Error fetching $table:', err, {$table: table});
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });
        } catch (e) {
            console.error(e);
            throw e;
        }
    }

    public static async deleteRowInTable(table: string, column: string, value: string): Promise<any> {
        try {
            return new Promise((resolve, reject) => {
                this.db.all(`DELETE FROM ${table}
                             WHERE ${column} = '${value}'`, (err, rows) => {
                    if (err) {
                        console.error('Error fetching $table:', err, {$table: table});
                        reject(err);
                        return;
                    }
                    resolve(rows);
                });
            });
        } catch (e) {
            console.error(e);
            throw e;
        }
    }


    public static async getAllFromTable(table: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.all(`SELECT *
                         FROM ${table}`, (err, rows) => {
                if (err) {
                    console.error('Error fetching users:', err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    public static async hasEntryInColumnInTable(table: string, column: string, value: string): Promise<boolean> {
        const result = await dbUtility.getTableByValue(table, column, value);
        if (isArrayWithLength(result)) {
            return true;
        }

        return false;

        function isArrayWithLength<T>(value: any): value is T[] {
            return Array.isArray(value) && value.length >= 1;
        }
    }
}