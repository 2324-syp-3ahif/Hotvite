import * as sqlite3 from "sqlite3";
import {db} from "../dbserver";
import {User} from "../model";

//singleton design pattern

export class dbUtility {
    private static db: sqlite3.Database =
        new sqlite3.Database('../data/Hotvitedb.db');

    public static async saveUser(user: User): Promise<boolean> {
        try {
            db.run(
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
}
