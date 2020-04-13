export enum ScriptManagerCommitTypes{
    ADD_LOG= 'addLog',
    ADD_GROUP = 'addGroup',
    SET_SCRIPTS = 'setScripts',
    CLEAR_SCRIPT_LOG = 'clearScriptLog',
    ADD_ROW_TO_SCRIPT_LOG = 'addRowToScriptLog',
    ADD_SCRIPT = 'addScript',
    UPDATE_SCRIPT = 'updateScript',
    SET_SCRIPT_IN_PROGRESS = 'setScriptInProgress',
    SET_SCRIPT_NOT_IN_PROGRESS = 'setScriptNotInProgress',
    REMOVE_GROUP = 'removeGroup',
    REMOVE_SCRIPT = 'removeScript'
}
export enum ScriptManagerActionTypes{
    EXECUTE_SCRIPT = 'executeScript',
    UPDATE_SCRIPT = 'updateScript',
    LOAD_SCRIPTS = 'loadScripts',
    CREATE_SCRIPT = 'createScript'
}

export interface ScriptObjectContainer{
    log: string[],
    isRunning: boolean,
    runningScript?: number,
    script: ScriptObject,
}

export interface ScriptObject{
    id: number,
    title: string,
    commandList: CommandObject[]
}
export interface CommandObject{
    commandId: number,
    title:string,
    command:string,
    cwd?: string
}

export interface ScriptManagerState{
    scriptList: ScriptObjectContainer[],
}

export interface ScriptManagerContext{
    commit(fn: ScriptManagerCommitTypes, payload?:any): void,
    dispatch(fn: ScriptManagerActionTypes, payload?: any): void,
    state: ScriptManagerState
}