import {dbUtility} from "../utilities/db-utilities";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import {User} from "../models/user";

export async function createUser(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return {
        id: uuidv4(),
        username: user.username,
        email: user.email,
        password: hashedPassword,
        aboutme: user.aboutme,
    };
}

export async function isValidNewUser(user: User): Promise<boolean> {
    //check if the email is already in use

    return !await dbUtility.hasEntryInColumnInTable("user", "email", user.email);
}

export async function validateUserCredentials(password: string, id: string) {
    const user = await dbUtility.getTableByValue<User>("user", "id", id);

    if (!user) {
        return false;
    }

    return await comparePassword(password, user.password);
}

export async function comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
}

export async function isValidRequestByUser(id: string, password: string) {
    if (!await dbUtility.hasEntryInColumnInTable("user", "id", id)) {
        return false;
    }

    return await validateUserCredentials(password, id);
}