import fs from "node:fs/promises"; import path from "node:path";
const hidden=(p:string)=>p.split(path.sep).some(x=>x.startsWith("."));
export async function vaultRoot(raw:string){if(!raw)throw new Error("Vault non configurato");const r=await fs.realpath(raw);if(!(await fs.stat(r)).isDirectory())throw new Error("Vault non valido");return r}
export async function safePath(root:string,relative:string){if(path.isAbsolute(relative)||relative.split(/[\/]/).includes(".."))throw new Error("Percorso non consentito");const full=path.resolve(root,relative),real=await fs.realpath(full);if(!real.startsWith(root+path.sep)&&real!==root)throw new Error("Percorso esterno al vault");return real}
export async function listNotes(root:string){const out:string[]=[];async function walk(dir:string){for(const e of await fs.readdir(dir,{withFileTypes:true})){if(hidden(e.name)||e.name===".obsidian"||e.name===".git")continue;const f=path.join(dir,e.name);if(e.isDirectory())await walk(f);else if(e.isFile()&&e.name.toLowerCase().endsWith(".md"))out.push(path.relative(root,f).split(path.sep).join("/"))}}await walk(root);return out.sort()}
export function markdown(x:{prompt:string;response:string;model:string;contexts:string[];imageName?:string}){const esc=(s:string)=>s.replace(/[
]/g," ").replace(/"/g,"'");return `---
created: ${new Date().toISOString()}
model: "${esc(x.model)}"
contexts: [${x.contexts.map(v=>'"'+esc(v)+'"').join(", ")}]
image: "${esc(x.imageName||"")}"
---

# Conversazione AI

## Prompt

${x.prompt}

## Risposta

${x.response}
`}
export async function writeConversation(root:string,folder:string,data:Parameters<typeof markdown>[0]){if(hidden(folder)||folder.includes("..")||path.isAbsolute(folder))throw new Error("Cartella chat non valida");const dir=path.resolve(root,folder);if(!dir.startsWith(root+path.sep))throw new Error("Cartella non valida");await fs.mkdir(dir,{recursive:true});const base=`chat-${new Date().toISOString().replace(/[:.]/g,"-")}`;let target=path.join(dir,base+".md"),i=1;while(await fs.access(target).then(()=>true,()=>false))target=path.join(dir,`${base}-${i++}.md`);await fs.writeFile(target,markdown(data),"utf8");return path.relative(root,target).split(path.sep).join("/")}
