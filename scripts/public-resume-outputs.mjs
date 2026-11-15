import fs from 'node:fs/promises';
import path from 'node:path';

// Share the workspace lock across commands that publish the local public PDF.
export async function createPublicBuildWorkspace(root) {
  const work = path.join(root, 'tmp/public-resume-build');
  await fs.mkdir(path.dirname(work), { recursive: true });
  await fs.mkdir(work).catch(error => {
    if (error.code !== 'EEXIST') throw error;
    throw new Error(`Public resume update may already be running. If no build is active, remove ${work} and retry.`);
  });
  return work;
}

// Stage alongside each destination so replacements are atomic even across mounts.
export async function replaceOutputs(root, files) {
  const staged = [];
  const replaced = [];
  try {
    for (const [relative, content] of files) {
      const output = path.join(root, relative);
      const parent = path.dirname(output);
      await fs.mkdir(parent, { recursive: true });
      const previous = await fs.lstat(output).catch(error => {
        if (error.code !== 'ENOENT') throw error;
      });
      if (previous && !previous.isFile()) throw new Error(`Expected a regular file: ${relative}`);
      const directory = await fs.mkdtemp(path.join(parent, '.resume-build-'));
      const candidate = path.join(directory, 'new');
      const backup = previous && path.join(directory, 'previous');
      staged.push({ output, directory, candidate, backup });
      await fs.writeFile(candidate, content, { mode: previous?.mode });
      if (backup) await fs.copyFile(output, backup);
    }
    for (const file of staged) {
      await fs.rename(file.candidate, file.output);
      replaced.push(file);
    }
  } catch (error) {
    const rollbackErrors = [];
    for (const file of replaced.reverse()) {
      try {
        if (file.backup) await fs.rename(file.backup, file.output);
        else await fs.unlink(file.output);
      } catch (rollbackError) {
        file.keepBackup = true;
        rollbackErrors.push(new Error(`Could not restore ${file.output}. Staged files are in ${file.directory}.`, { cause: rollbackError }));
      }
    }
    if (rollbackErrors.length) throw new AggregateError([error, ...rollbackErrors], 'Public resume update and rollback failed.');
    throw error;
  } finally {
    await Promise.all(staged.filter(file => !file.keepBackup)
      .map(({ directory }) => fs.rm(directory, { recursive: true, force: true })));
  }
}
