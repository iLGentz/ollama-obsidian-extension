import fs from "node:fs/promises"; import path from "node:path"; import crypto from "node:crypto";
export type Config={token:string;vaultPath:string;port:number;extensionOrigin:string;chatFolder:string};
const file=path.join(process.cwd(),"bridge-data.json");
export async function loadConfig():Promise<Config>{try{return JSON.parse(await fs.readFile(file,"utf8"))}catch{const c={token:crypto.randomBytes(32).toString("hex"),vaultPath:"",port:3210,extensionOrigin:"",chatFolder:"AI Chats"};await fs.writeFile(file,JSON.stringify(c,null,2),{mode:0o600});console.log("Bridge token (shown only now):",c.token);return c}}
export async function saveConfig(c:Config){await fs.writeFile(file,JSON.stringify(c,null,2),{mode:0o600})}
