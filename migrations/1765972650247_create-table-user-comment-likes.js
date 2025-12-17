/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('user_comment_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"users"',
      onDelete: 'cascade',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: '"comments"',
      onDelete: 'cascade',
    },
  });

  /* Constraint Unik: 1 User cuma boleh like 1 kali di komen yang sama */
  pgm.addConstraint('user_comment_likes', 'unique_user_comment_like', 'UNIQUE(user_id, comment_id)');
};

exports.down = (pgm) => {
  pgm.dropTable('user_comment_likes');
};
