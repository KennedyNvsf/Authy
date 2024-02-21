import sanityClient from "@/lib/sanityClient";


export const getAccountByUserId = async (userId: string) => {
    try {
    // Fetch user by ID
    const accountQry = `*[_type == "account" && userId == "${userId}"][0]`;
    const account = await sanityClient.fetch(accountQry);

    return account;

    } catch {
        return null;
    }
}