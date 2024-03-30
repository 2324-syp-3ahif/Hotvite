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

    public static async getUserByEmail(email:string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM user WHERE email = $email', {$email: email} , (err, rows) => {
                if (err) {
                    console.error('Error fetching users:', err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }

    public static async getAllUsers(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM user', (err, rows) => {
                if (err) {
                    console.error('Error fetching users:', err);
                    reject(err);
                    return;
                }
                resolve(rows);
            });
        });
    }
}
