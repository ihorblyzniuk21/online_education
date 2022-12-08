import config from '@app/ormconfig';
const ormseedconfig = {
  ...config,
  migrations: ['src/seeds/*.ts'],
};

export default ormseedconfig;