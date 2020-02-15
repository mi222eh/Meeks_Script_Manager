import './state';
import * as executor from '../components/scriptExecutor';
import { ScriptManagerContext, ScriptManagerCommitTypes, ScriptObject, ScriptObjectContainer, ScriptGroupObject } from './types';
import {getScripts, getGroups, saveGroups, saveScripts} from './DAL'; 



export async function executeScript (context:ScriptManagerContext, name:string) {
    const scriptItem = context.state.scriptList.find(script => script.script.name === name);
    if(!scriptItem){
        throw 'Could not find script';
    }
    context.commit(ScriptManagerCommitTypes.CLEAR_SCRIPT_LOG, {name:scriptItem.script.name});
    const process = executor.runProcess({
        command: scriptItem.script.command,
        cwd: scriptItem.script.cwd
    });
    process.process.stdout.on('data', (chunk) => {
        context.commit(ScriptManagerCommitTypes.ADD_ROW_TO_SCRIPT_LOG, {name: scriptItem.script.name, row:chunk});
    })
    const result = await process.promise();
    context.commit(ScriptManagerCommitTypes.ADD_ROW_TO_SCRIPT_LOG, {name: scriptItem.script.name, row:result.error});
    context.commit(ScriptManagerCommitTypes.ADD_ROW_TO_SCRIPT_LOG, {name: scriptItem.script.name, row:result.output});
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

export async function updateScript(context:ScriptManagerContext, payload:ScriptObject){
    console.log(payload);
    
    context.commit(ScriptManagerCommitTypes.UPDATE_SCRIPT, payload);
    await saveScripts(context.state.scriptList.map(script => script.script));
}

export async function updateGroup(context: ScriptManagerContext, payload: ScriptGroupObject){
    context.commit(ScriptManagerCommitTypes.UPDATE_GROUP, payload);
    await saveGroups(context.state.groupList.map(gI => gI.group));
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