import './state';
import * as executor from '../components/scriptExecutor';
import { ScriptManagerContext, ScriptManagerCommitTypes, ScriptObject, ScriptObjectContainer } from './types';
import {getScripts, getGroups, saveGroups, saveScripts} from './DAL'; 



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
export async function executeGroupScript (context:ScriptManagerContext, name:string) {
    const groupItem = context.state.groupList.find(group => group.group.name === name);
    if(!groupItem){
        throw 'Could not find Group';
    }
    for (const script of groupItem.group.scripts) {
        const scriptItem = context.state.scriptList.find(scriptItem => scriptItem.script.name === script);
        if(!scriptItem){
            throw 'Could not find script';
        }
        const process = executor.runProcess({
            command: scriptItem.script.command,
            cwd: scriptItem.script.cwd
        });
        process.process.stdout.on('data', (chunk) => {
            context.commit(ScriptManagerCommitTypes.ADD_ROW_TO_GROUP_LOG, {
                name,
                row: chunk
            });
        })
        const result = await process.promise();
        context.commit(ScriptManagerCommitTypes.ADD_ROW_TO_GROUP_LOG, {
            name,
            row: result.output
        });
        context.commit(ScriptManagerCommitTypes.ADD_ROW_TO_GROUP_LOG, {
            name,
            row: result.error
        });
    }

}

export async function updateScript(){

}

export async function updateGroup(context: ScriptManagerContext, payload: {name:string, scripts:string[], title:string}){
    context.commit(ScriptManagerCommitTypes.SET_SCRIPTS_TO_GROUP, {name: payload.name, scripts: payload.scripts});
    saveGroups(context.state.groupList.map(gI => gI.group));
}

export async function createScript(context: ScriptManagerContext, payload: ScriptObject){
    if(!payload.command){
        throw 'Command is rquired';
    }
    if(!payload.name){
        throw 'Name is required';
    }
    if(context.state.scriptList.find(script => script.script.name === payload.name)){
        throw 'Name already exists';
    }
    context.commit(ScriptManagerCommitTypes.ADD_SCRIPT, payload);
    saveScripts(context.state.scriptList.map(script => script.script));
}

export async function addScript(){

}

export async function loadScripts(context: ScriptManagerContext){
    const scripts = await getScripts();
    context.commit(ScriptManagerCommitTypes.SET_SCRIPTS, scripts);
    const groups = await getGroups();
    context.commit(ScriptManagerCommitTypes.SET_GROUPS, groups);
}