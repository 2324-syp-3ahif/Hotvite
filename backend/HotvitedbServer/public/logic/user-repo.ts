import {User} from "../model";
import {dbUtility} from "../utilities/db-utilities";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";

export async function createUser(user: User): Promise<User> {
    // add salt to the password
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return {
        id: uuidv4(),
        username: user.username,
        email: user.email,
        password: hashedPassword,
        aboutme: user.aboutme,
    };
}

export async function isValidUser(user: User): Promise<boolean> {
    //check if the email is already in use

    if (await dbUtility.hasEntryInColumnInTable("user", "email", user.email)) {
        return false;
    }

    return true;
}