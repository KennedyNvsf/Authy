import { defineField } from 'sanity';
import {TokenIcon} from '@sanity/icons'

const twoFactorToken = {
  name: 'twoFactorToken',
  title: 'Two Factor Token',
  type: 'document',
  icon: TokenIcon,
  fields: [
    defineField({
      name: 'identifier',
      title: 'identifier',
      type: 'string',
    }),
    defineField({
      name: 'token',
      title: 'Token',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'expires',
      title: 'Token Expiry',
      type: 'datetime',
      validation: Rule => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'token',
    },
  },
};

export default twoFactorToken;