import * as childProcess from 'child_process';
import { ChildProcess } from 'child_process';
import {SubEvent} from 'sub-events';


interface ScriptExecutorOptions{
    command:string,
    cwd: string | undefined,
}

interface ScriptExecutorResult{
    output:string,
    error:string
}

interface ScriptExecutionObject{
    process: ChildProcess,
    promise():Promise<ScriptExecutorResult>
}

export function runProcess(opts: ScriptExecutorOptions):ScriptExecutionObject{
    const onError = new SubEvent<childProcess.ExecException>();
    const onSuccess = new SubEvent<{error:string, output:string}>();

    const process = childProcess.exec(opts.command, {
        cwd: opts.cwd
    },(error, stdout, stderr) => {
        if(error){
            onError.emit(error);
            return;
        }
        onSuccess.emit({
            output: stdout,
            error: stderr
        })
    });

    return {
        process,
        promise(){
            return new Promise((resolve, reject) => {
                onSuccess.subscribe(resolve);
                onError.subscribe(reject);
            });
        }
    }
}