import { BUILD_PATH } from './constants';
import { rmDir } from './utils';

const removeJs = async () => {
  console.log('[-- remove JS dir --]\n');
  await rmDir(BUILD_PATH);
};

removeJs();
