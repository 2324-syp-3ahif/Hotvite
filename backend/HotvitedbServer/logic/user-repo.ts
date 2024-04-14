import {dbUtility} from "../utilities/db-utilities";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid";
import {User} from "../models/user";

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

export async function isValidNewUser(user: object): Promise<boolean> {
    //check if the email is already in use

    if(!isUser(user)){
        return false;
    }

    if (await dbUtility.hasEntryInColumnInTable("user", "email", user.email)) {
        return false;
    }

    return true;
}

export async function validateUserCredentials(password: string, id: string) {
    const user: User = (await dbUtility.getTableByValue("user", "id", id))[0];

    const hashedPassword = user.password;

    return await bcrypt.compare(password, hashedPassword);
}

export async function isValidRequestByUser(id: string, password: string): Promise<boolean | string> {
    if (!await dbUtility.hasEntryInColumnInTable("user", "id", id)) {
        return `user with id: ${id} does not exit`;
    }

    if (!await validateUserCredentials(password, id)) {
        return `password entered: ${password} not valid`;
    }

    return true;
}

function isUser(obj: object): obj is User {
    if ("username" in obj
        && "email" in obj
        && "password" in obj
        && "aboutme" in obj) {
        return true;
    }

    return false;
}