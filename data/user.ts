import sanityClient from "@/lib/sanityClient";

export const getUserByEmail = async (email: string) => {
    try {
    // Fetch user by email
    const userQry = `*[_type == "user" && email == "${email}"][0]`;
    const user = await sanityClient.fetch(userQry);

    return user;

    } catch {
        return null;
    }
}

export const getUserById = async (_id: string) => {
    try {
    // Fetch user by ID
    const userQry = `*[_type == "user" && _id == "${_id}"][0]`;
    const user = await sanityClient.fetch(userQry);

    return user;

    } catch {
        return null;
    }
}