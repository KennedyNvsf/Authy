import { defineField } from 'sanity';
import {DocumentTextIcon} from '@sanity/icons'

const account = {
  name: 'account',
  title: 'Account',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'User Id',
      type: 'string',
      validation: Rule => Rule.required(),
  }),
    defineField({
      name: 'type',
      title: 'Account Type',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'provider',
      title: 'Account Provider',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'providerAccountId',
      title: 'Account Provider Id',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'refreshToken',
      title: 'Refresh Token',
      type: 'string',
    }),
    defineField({
      name: 'accessToken',
      title: 'Access Token',
      type: 'string',
  }),
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'number',
    }),
    defineField({
      name: 'tokenType',
      title: 'Token Type',
      type: 'string',
    }),
    defineField({
      name: 'scope',
      title: 'Scope',
      type: 'string',
    }),
    defineField({
      name: 'idToken',
      title: 'Id Token',
      type: 'string',
    }),
    defineField({
      name: 'sessionState',
      title: 'Session State',
      type: 'string',
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

export default account;