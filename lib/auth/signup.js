'use server'
import connect from "../connectToDB";
import User from "../models/user";
import bcrypt from "bcryptjs";

export async function signup({ password, email, name }) {
    await connect(); // Ensure database connection

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error("vartotojas jau egzistuoja");
    }

    // Generate a salt and hash the password
    const saltLength = 10;
    const salt = await bcrypt.genSalt(saltLength);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save the user in the database
    const newUser = new User({
        name,
        email,
        password: hashedPassword,
        plan: "basic",
        userId: "none"
    });

    await newUser.save();

    return "Vartotojas sėkmingai sukurtas";
}
