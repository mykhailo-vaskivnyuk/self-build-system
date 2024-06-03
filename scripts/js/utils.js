
const  fsp = require('node:fs/promises');
const { join } = require('node:path');

const copyDir = async (dirFrom, dirTo, include = null, exclude = null) => {
  const dir = await fsp.opendir(dirFrom);
  let counter = 0;
  for await (const item of dir) {
    const { name } = item;
    if (item.isDirectory()) {
      const nextDirFrom = join(dirFrom, name);
      const nextDirTo = join(dirTo, name);
      console.log('[o] read', nextDirFrom);
      let created = false;
      try {
        await fsp.access(nextDirTo);
      } catch (e) {
        console.log('[+] create dir', nextDirTo);
        await fsp.mkdir(nextDirTo);
        created = true;
      }
      const count = await copyDir(
        nextDirFrom, nextDirTo, include, exclude,
      );
      if (!count && created) {
        console.log('[-] remove dir:', nextDirTo);
        await fsp.rmdir(nextDirTo);
      }
      counter += count;
      continue;
    }
    if (exclude && exclude.includes(dirFrom))
      continue;
    if (include && !include.includes(dirFrom))
      continue;
    const filePathFrom = join(dirFrom, name);
    const filePathTo = join(dirTo, name);
    fsp.copyFile(filePathFrom, filePathTo);
    counter++;
    console.log('--> copying', name);
  }
  console.log('<> total:', counter, dirFrom);
  return counter;
};

const logFromTo = (from, to) => {
  console.log('\nfrom', from);
  console.log('to', to, '\n');
};

const rmDir = async (dirToDel) => {
  let dir;
  try {
    dir = await fsp.opendir(dirToDel);
  } catch (e) {
    return;
  }
  let counter = 0;
  for await (const item of dir) {
    const { name } = item;
    if (item.isDirectory()) {
      const nextDirToDel = join(dirToDel, name);
      const count = await rmDir(nextDirToDel);
      counter += count;
      continue;
    }
    const filePathToDel = join(dirToDel, name);
    await fsp.rm(filePathToDel);
    counter++;
  }
  // dir.close();
  await fsp.rmdir(dirToDel);
  return counter;
};

const copyFiles = async (filesToCopy) => {
  for (const [from, to] of filesToCopy) {
    console.log('--> copying', from, '-->', to);
    await fsp.copyFile(from, to);
  }
};

module.exports = { copyDir, rmDir, logFromTo, copyFiles };
