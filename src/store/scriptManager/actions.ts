import './state';
import * as executor from '../components/scriptExecutor';
import {
    ScriptManagerContext,
    ScriptManagerCommitTypes,
    ScriptObject,
    LogRow} from './types';
import { getScripts, saveScripts } from './DAL';
import { ChildProcess } from 'child_process';

const processMap: {
    [key:string]: ChildProcess | null | undefined
} = {};

export async function executeScript(
    context: ScriptManagerContext,
    id: number
) {
    const scriptItem = context.state.scriptList.find(
        script => script.script.id === id
    );
    if (!scriptItem) {
        throw 'Could not find script';
    }
    
    context.commit(ScriptManagerCommitTypes.SET_SCRIPT_IN_PROGRESS, {
        id: scriptItem.script.id
    });
    context.commit(ScriptManagerCommitTypes.CLEAR_SCRIPT_LOG, {
        id: scriptItem.script.id
    });
    let commandList = Array.from(scriptItem.script.commandList);
    while(commandList.length > 0){
        const command = commandList.shift();
        if(!command){
            break;
        }
        const process = executor.runProcess({
            command: command.command,
            cwd: command.cwd
        });
        processMap[scriptItem.script.id] = process.process;
        process.process.stdout.on('data', chunk => {
            const rows:string[] = chunk.toString().split('\n').filter((x:string) => !!x);
            while(rows.length){
                const row:LogRow = {
                    text: rows.shift() || '',
                    type: 'output'
                }
                context.commit(ScriptManagerCommitTypes.ADD_ROW_TO_SCRIPT_LOG, {
                    id: scriptItem.script.id,
                    row: row
                });
            }
        });
        process.process.stderr.on('data', chunk => {
            const rows:string[] = chunk.toString().split('\n').filter((x:string) => !!x);
            while(rows.length){
                const row:LogRow = {
                    text: rows.shift() || '',
                    type: 'error'
                }
                context.commit(ScriptManagerCommitTypes.ADD_ROW_TO_SCRIPT_LOG, {
                    id: scriptItem.script.id,
                    row: row
                });
            }
        });
        try {
            const result = await process.promise();
            // console.log({result});

            const log:LogRow = {
                text: result.output,
                type: 'success'
            }
            context.commit(ScriptManagerCommitTypes.ADD_ROW_TO_SCRIPT_LOG, {
                id: scriptItem.script.id,
                row: log
            });
        } catch (e) {
            console.log({e});
            const log:LogRow = {
                text: e.message || e,
                type: 'error'
            }
            context.commit(ScriptManagerCommitTypes.ADD_ROW_TO_SCRIPT_LOG, {
                id: scriptItem.script.id,
                row: log
            });
            commandList = [];
        }
        finally{
            processMap[scriptItem.script.id] = null;
        }
    }
    context.commit(ScriptManagerCommitTypes.SET_SCRIPT_NOT_IN_PROGRESS, {
        id: scriptItem.script.id,
    });

}

export async function updateScript(
    context: ScriptManagerContext,
    payload: ScriptObject
) {
    console.log(payload);

    const copy:ScriptObject = JSON.parse(JSON.stringify(payload));
    console.log('commands to set id to', copy.commandList.filter((command) => command.commandId < 0));
    copy.commandList.filter((command) => command.commandId < 0).forEach((command) => {
        command.commandId = copy.commandList.reduce((acc, curr) => curr.commandId < acc ? acc : curr.commandId + 1, 1)
    })

    context.commit(ScriptManagerCommitTypes.UPDATE_SCRIPT, copy);
    await saveScripts(context.state.scriptList.map(script => script.script));
}

export async function createScript(
    context: ScriptManagerContext,
    payload: ScriptObject
) {
    if (!payload.title) {
        throw 'Title is required';
    }
    payload.id = context.state.scriptList.reduce((acc, curr) => curr.script.id < acc ? acc : curr.script.id + 1, 1);
    context.commit(ScriptManagerCommitTypes.ADD_SCRIPT, payload);
    await saveScripts(context.state.scriptList.map(script => script.script));
    return context.state.scriptList.find(script => script.script.id === payload.id);
}

export async function loadScripts(context: ScriptManagerContext) {
    const scripts = await getScripts();
    context.commit(ScriptManagerCommitTypes.SET_SCRIPTS, scripts);
}

export async function removeScript(
    context: ScriptManagerContext,
    id: number
) {
    const scriptItem = context.state.scriptList.find(
        script => script.script.id === id
    );
    if (!scriptItem) {
        throw 'Could not find script';
    }
    if (scriptItem.isRunning) {
        throw 'Script is running';
    }
    context.commit(ScriptManagerCommitTypes.REMOVE_SCRIPT, {
        id: scriptItem.script.id
    });
    saveScripts(context.state.scriptList.map(x => x.script));
}

export async function sendProcessInput(context: ScriptManagerContext, payload: {id: number, input:string}){
    const childProcess = processMap[payload.id];
    if(!childProcess){
        return;
    }
    childProcess.stdin.write(payload.input + '\n', 'UTF-8');
}