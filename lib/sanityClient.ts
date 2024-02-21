import { createClient } from 'next-sanity';
import { SanityClient } from 'sanity';


const client: SanityClient | any = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
  apiVersion: '2024-01-03',
});

const sanityClient: SanityClient = (client as SanityClient);

export default sanityClient;
