import * as sqlite from "sqlite";
import {open} from "sqlite";
import sqlite3 from "sqlite3";
import {Event} from "../models/event";
import {Requirement} from "../models/requirement";
import {Chat} from "../models/chat";
import {Location} from "../models/location";
import {User} from "../models/user";
import {Address} from "../models/address";
import {UpdateEventDto} from "../models/updateEventDto";

export class dbUtility {
    private static db: sqlite.Database;

    static async initialize() {
        this.db = await open({
            filename: './data/Hotvitedb.db',
            driver: sqlite3.Database
        });
    }

    public static async saveUser(user: User): Promise<boolean> {
        try {
            const stmt = await
                this.db.prepare('INSERT INTO user (id, username, email, password, aboutme) VALUES (:id, :username, :email, :password, :aboutme)');

            await stmt.bind({
                ':id': user.id,
                ':username': user.username,
                ':email': user.email,
                ':password': user.password,
                ':aboutme': user.about_me
            });
            await stmt.run();
            await stmt.finalize();

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public static async registerUserToEvent(user: User, event: Event): Promise<boolean> {
        try {
            const stmt = await
                this.db.prepare(`INSERT INTO event_participant (user_id, event_id)
                                 VALUES (:user_id, :event_id)`);

            await stmt.bind({
                ':event_id': event.id,
                ':user_id': user.id
            });

            await stmt.run();
            await stmt.finalize();

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public static async updateEvent(event: UpdateEventDto): Promise<boolean> {
        try {
            const stmt = await this.db.prepare(
                `UPDATE event SET title = :title, description = :description, status = :status WHERE id = '${event.id}'`
            );

            await stmt.bind({
                ':title': event.title,
                ':description': event.description,
                ':status': event.status,
            });

            await stmt.run();
            await stmt.finalize();

            return true;
        } catch (error) {
            console.error('Error updating event in database', error);
            return false;
        }
    }

    public static async unregisterUserFromEvent(user: User, event: Event): Promise<boolean> {
        try {
            const stmt = await
                this.db.prepare('delete from event_participant where event_id = :event_id AND user_id = :user_id');

            await stmt.bind({
                ':event_id': event.id,
                ':user_id': user.id
            });

            await stmt.run();
            await stmt.finalize();

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public static async isUserRegisteredToEvent(user: User, event: Event): Promise<boolean> {
        try {
            const stmt = await this.db.prepare(`SELECT * FROM event_participant WHERE user_id = :user_id AND event_id = :event_id`);

            await stmt.bind({
                ':user_id': user.id,
                ':event_id': event.id
            });

            const result = await stmt.get();

            await stmt.finalize();

            return result !== undefined;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    public static async saveEvent(event: Event): Promise<boolean> {
        try {
            await this.db.run('BEGIN TRANSACTION;');

            try {
                await this.saveAddress(event.address);
            } catch (error) {
                console.error('Error inserting new address into database', error);
                await this.db.run('ROLLBACK;');
                return false;
            }

            try {
                await this.saveLocation(event.location);
            } catch (error) {
                console.error('Error inserting new location into database', error);
                await this.db.run('ROLLBACK;');
                return false;
            }

            // try {
            //     await this.saveChat(event.chat);
            // } catch (error) {
            //     console.error('Error inserting new chat into database', error);
            //     await this.db.run('ROLLBACK;');
            //     return false;
            // }

            try {
                await this.saveRequirements(event.requirements);
            } catch (error) {
                console.error('Error inserting new requirements into database', error);
                await this.db.run('ROLLBACK;');
                return false;
            }

            try {
                const stmt = await this.db.prepare(
                    `INSERT INTO event ( id
                                       , title
                                       , description
                                       , address_id
                                       , location_id
                                       , type
                                       , price
                                       , max_participants
                                       , chat
                                       , creator_id
                                       , created_at
                                       , event_start_date
                                       , event_end_date)
                     VALUES (:id, :title, :description, :address_id, :location_id, :type, :price, :max_participants, :chat, :creator_id, :created_at, :event_start_date, :event_end_date)`
                );

                await stmt.bind({
                    ':id': event.id,
                    ':title': event.title,
                    ':description': event.description,
                    ':address_id': event.address.id,
                    ':location_id': event.location.id,
                    ':type': event.type,
                    ':price': event.price,
                    ':max_participants': event.max_participants,
                    ':chat': event.chat,
                    ':creator_id': event.creator_id,
                    ':created_at': event.created_at,
                    ':event_start_date': event.event_start_date,
                    ':event_end_date': event.event_end_date
                });


                await stmt.run();
                await stmt.finalize();
            } catch (error) {
                console.error('Error inserting new event into database', error);
                await this.db.run('ROLLBACK;');
                return false;
            }

            await this.db.run('COMMIT;');
            return true;
        } catch (error) {
            console.error('Error inserting new event into database', error);
            return false;
        }
    }

    public static async getTableByValue<T>(table: string, column: string, value: string): Promise<T | undefined> {
        try {
            if (!value || !table || !column) {
                return undefined;
            }

            const stmt = await this.db.prepare(`select *
                                                from ${table}
                                                WHERE ${column} = :value`);

            await stmt.bind({':value': value});

            const result = await stmt.get();

            await stmt.finalize();

            return result;
        } catch (e) {
            console.error(e);
        }
    }

    public static async updateValueByRowInTableWithCondition(table: string, column: string, value: string, conditionColumn: string, conditionValue: string): Promise<boolean> {
        try {
            const stmt = await this.db.prepare(`UPDATE ${table}
                                                SET ${column} = :value
                                                WHERE ${conditionColumn} = :conditionValue`);
            await stmt.bind({
                ':value': value,
                ':conditionValue': conditionValue
            });

            await stmt.run();
            await stmt.finalize();

            return true;
        } catch (error) {
            console.error(`Error updating ${table} in database`, error);
            return false;
        }
    }

    public static async deleteRowInTable(table: string, column: string, value: string): Promise<boolean> {
        try {
            const stmt = await this.db.prepare(`DELETE
                                                FROM ${table}
                                                WHERE ${column} = :value`);

            await stmt.bind({':value': value});
            await stmt.run();
            await stmt.finalize();

            return true;
        } catch (error) {
            console.error(`Error deleting from ${table} in database`, error);
            return false;
        }
    }

    public static async getAllFromTable<T>(table: string): Promise<T | undefined> {
        try {
            const stmt = await this.db.prepare(`SELECT *
                                                FROM ${table}`);

            const result = await stmt.all<T>();
            await stmt.finalize();

            return result;
        } catch (error) {
            console.error(`Error retrieving data from ${table} in database`, error);
        }
    }

    private static async saveAddress(address: Address): Promise<boolean> {
        try {
            const stmt = await this.db.prepare('INSERT INTO address (id, street, city, country) VALUES (:id, :street, :city, :country)');
            await stmt.bind({
                ':id': address.id,
                ':street': address.street,
                ':city': address.city,
                ':country': address.country,
            });
            await stmt.run();
            await stmt.finalize();

            return true;
        } catch (error) {
            console.error('Error inserting new address into database', error);
            return false;
        }
    }

    private static async saveLocation(location: Location): Promise<boolean> {
        try {
            const stmt = await this.db.prepare('INSERT INTO location (id, latitude, longitude) VALUES (:id, :latitude, :longitude)');

            await stmt.bind({
                ':id': location.id,
                ':latitude': location.latitude,
                ':longitude': location.longitude
            });
            await stmt.run();
            await stmt.finalize();

            return true;
        } catch (error) {
            console.error('Error inserting new location into database', error);
            return false;
        }
    }

    // private static async saveChat(chat: Chat): Promise<boolean> {
    //     try {
    //         const stmt = await this.db.prepare('INSERT INTO chat (id, about, name) VALUES (:id, :about, :name)');
    //         await stmt.bind({
    //             ':id': chat.id,
    //             ':about': chat.about,
    //             ':name': chat.name
    //         });
    //         await stmt.run();
    //         await stmt.finalize();
    //
    //         return true;
    //     } catch (error) {
    //         console.error('Error inserting new chat into database', error);
    //         return false;
    //     }
    // }

    private static async saveRequirements(requirements: Requirement[]): Promise<boolean> {
        try {
            const stmt = await this.db.prepare('INSERT INTO requirement (event_id, text) VALUES (:event_id, :text)');

            for (const requirement of requirements) {
                await stmt.bind({
                    ':event_id': requirement.event_id,
                    ':text': requirement.text
                });
                await stmt.run();
            }

            await stmt.finalize();

            return true;
        } catch (error) {
            console.error('Error inserting new requirements into database', error);
            return false;
        }
    }

    public static async hasEntryInColumnInTable(table: string, column: string, value: string): Promise<boolean> {
        const result = await dbUtility.getTableByValue(table, column, value);

        return result !== undefined;
    }
}