"use server";
import {query} from '@/server/mysql';

export default async function addUser(user) {
    try {
        // Insert the user into the database
        const results = await query('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [user.username, user.password, user.role]);

        return results.insertId; // Return the ID of the inserted user
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}