import { ScriptManagerState } from './types';


export default function (): ScriptManagerState {
    return {
        scriptList: [],
        groupList:[]
    }
}
// [{
//     title: 'Publish Buster75',
//     name: 'buildBuster',
//     command: 'dotnet build --configuration Release',
//     cwd: 'C:\\JOBB\\Alvitech\\Buster75\\Buster75.Website'
// },{
//     title: 'Install Gulp Global',
//     name: 'install_gulp',
//     command: 'npm i gulp -g',
//     cwd: ''
// },{
//     title: 'Install bundler',
//     name: 'install_bundler',
//     command: 'npm i',
//     cwd: 'C:\\JOBB\\Alvitech\\Buster75\\Buster75.Website\\bundler'
// }],
