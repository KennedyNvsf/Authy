import { defineField } from 'sanity';
import { UserIcon } from "@sanity/icons";

const user = {
  name: 'user',
  title: 'User',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name of the user',
    }),
    defineField({
      name: 'email',
      title: 'User Email',
      type: 'string',
      description: 'User Email',
    }),
    defineField({
      name: 'emailVerified',
      title: 'Email Verification',
      type: 'datetime',
    }),
    defineField({
      name: 'image',
      title: 'User Image',
      type: 'string',
    }),
    defineField({
      name: 'password',
      title: 'User Password',
      type: 'string',
      hidden: true,
  }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      initialValue: 'USER',
      options: {
        list: ['ADMIN', 'USER'],
      },
  }),
    defineField({
      name: 'accounts',
      title: 'Accounts',
      type: 'reference',
      to: [{type: 'account'}],
    }),
      defineField({
        name: 'isTwoFactorEnabled',
        title: 'Is Two Factor Enabled',
        type: 'boolean',
        initialValue: false,
    }),
      defineField({
      name: 'twoFactorConfirmation',
      title: 'Two Factor Confirmation',
      type: 'reference',
      to: [{type: 'twoFactorConfirmation'}],
    })
  ],
  preview: {
    select: {
      title: 'name',
    },
  },
};

export default user;