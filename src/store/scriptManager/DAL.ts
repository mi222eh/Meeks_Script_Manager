import { join } from 'path';
import { mkdirpSync, readJSON, writeJSON, existsSync } from 'fs-extra';
import { ScriptObject } from './types';

const settingsDir:string = join(process.env.LOCALAPPDATA || './', 'settings');
const scriptsFile = join(settingsDir, 'scripts.json');
const groupsFile = join(settingsDir, 'groups.json');

mkdirpSync(settingsDir);

export async function getScripts(): Promise<ScriptObject[]>{
    if(!existsSync(scriptsFile)){
        await writeJSON(scriptsFile, []);
    }
    return await readJSON(scriptsFile)
}
export async function saveScripts(scripts: ScriptObject[]){
    await writeJSON(scriptsFile, scripts);
}