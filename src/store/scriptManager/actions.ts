import './state';
import * as executor from '../components/scriptExecutor';
import { ScriptManagerContext, ScriptManagerCommitTypes } from './types';
import {getScripts, getGroups} from './DAL'; 



export async function executeScript (context:ScriptManagerContext, name:string) {
    const scriptItem = context.state.scriptList.find(script => script.script.name === name);
    if(!scriptItem){
        throw 'Could not find script';
    }
    const process = executor.runProcess({
        command: scriptItem.script.command,
        cwd: scriptItem.script.cwd
    });
    process.process.stdout.on('data', (chunk) => {
        console.log(chunk);
    })
    process.process.on('message', (message) => {
        console.log(message);
    });
    const result = await process.promise();
    console.log(result.output);
    console.warn(result.error);
}

export async function addScript(){

}

export async function loadScripts(context: ScriptManagerContext){
    const scripts = await getScripts();
    context.commit(ScriptManagerCommitTypes.SET_SCRIPTS, scripts);
    const groups = await getGroups();
    context.commit(ScriptManagerCommitTypes.SET_GROUPS, groups);
}