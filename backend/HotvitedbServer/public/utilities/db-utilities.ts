import * as sqlite3 from "sqlite3";
import {User} from "../model";

export class dbUtility {
    private static db: sqlite3.Database =
        new sqlite3.Database('../data/Hotvitedb.db');

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

   /* public static async saveEvent(event: Event): Promise<boolean> {
        try {
            //save address

            //save location

            //save chat

            //save condition


            //save event
            this.db.run(
                `INSERT INTO event (id, title, description, address_id, location_id, type, creator_id, status, chat_id,
                                    created_at, event_start_date, event_end_date)
                 VALUES (?, ?, ?, ?, ?)`,
                [user.id, user.username, user.email, user.password, user.aboutme]
            );

            console.log(`User ${user.username} added successfully.`);
            return true;
        } catch (error) {
            console.error('Error inserting new user into database', error);
            return false;
        }

    }*/

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
