import { defineField } from 'sanity';
import {TokenIcon} from '@sanity/icons'

const twoFactorConfirmation = {
  name: 'twoFactorConfirmation',
  title: 'Two Factor Confirmation',
  type: 'document',
  icon: TokenIcon,
  fields: [
    defineField({
      name: 'userId',
      title: 'User Id',
      type: 'string',
    }),
    defineField({
      name: 'user',
      title: 'User',
      type: 'reference',
      to: [{type: 'user'}],
  }),
  ],
};

export default twoFactorConfirmation;