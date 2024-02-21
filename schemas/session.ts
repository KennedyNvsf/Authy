import { defineField } from 'sanity';
import {DatabaseIcon} from '@sanity/icons'

const session = {
  name: 'session',
  title: 'Session',
  type: 'document',
  icon: DatabaseIcon,
  fields: [
    defineField({
      name: 'sessionToken',
      title: 'Session Token',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
        name: 'userId',
        title: 'User Id',
        type: 'string',
        validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'expires',
      title: 'Session Expiry',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
        name: 'user',
      title: 'User',
      type: 'reference',
      to: [{type: 'user'}],
    }),
  ],
  preview: {
    select: {
      title: '_id',
    },
  },
};

export default session;