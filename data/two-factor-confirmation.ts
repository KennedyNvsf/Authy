import sanityClient from "@/lib/sanityClient";

export const getTwoFactorConfirmationByUserId = async (
    userId: string
) => {
    try {

        const twoFactorConfirmationQry = `*[_type == "twoFactorConfirmation" && userId == "${userId}"][0]`;
        const twoFactorConfirmation = await sanityClient.fetch(twoFactorConfirmationQry);

        return twoFactorConfirmation;
        
    } catch (error) {
        return null
    }
}

