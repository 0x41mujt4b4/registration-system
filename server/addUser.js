import db from '@/server/mysql';

async function addUser(user) {
    try {
        // Create a connection to the database
        const connection = await db();

        // Insert the user into the database
        const [result] = await connection.execute('INSERT INTO users (username, password) VALUES (?, ?)', [user.username, user.password]);

        // Close the connection
        await connection.end();

        return result; // Return the ID of the inserted user
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
}

module.exports = addUser;