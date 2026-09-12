import {knowledgeTree} from './knowledge-tree.js?v=2.8.3';
export function createLearningIndex(tree=knowledgeTree){
 const entries=[];
 function visit(nodes,trail=[],inheritedPriority=false){for(const node of nodes){
  const path=[...trail,node.title],priority=inheritedPriority||node.tag==='重点';
  entries.push({key:node.key,title:node.title,path,chapter:path[0],priority,tag:node.tag,link:node.link,branch:node.children.length>0});
  visit(node.children,path,priority);
 }}visit(tree);return entries;
}
export function searchLearning(entries,{query='',chapter='',priorityOnly=false,completedOnly=false,completed=[]}={}){
 const words=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean),done=new Set(completed);
 return entries.filter(e=>(!chapter||e.chapter===chapter)&&(!priorityOnly||e.priority)&&(!completedOnly||done.has(e.key))&&words.every(w=>e.path.join(' ').toLocaleLowerCase().includes(w)));
}
export function ancestorKeys(key){const parts=key.split('-');return parts.slice(0,-1).map((_,i)=>parts.slice(0,i+1).join('-'));}
export function decodeProgress(raw,entries){try{const parsed=JSON.parse(raw);if(parsed?.version!==1||!Array.isArray(parsed.completed))return [];const known=new Set(entries.map(e=>e.key));return [...new Set(parsed.completed.filter(k=>typeof k==='string'&&known.has(k)))];}catch{return [];}}
export function learningResources(entries,key){
 const selected=entries.find(e=>e.key===key);if(!selected)return {notes:[],examples:[],experiments:[]};
 let scope=key,near=[];
 while(scope){near=entries.filter(e=>e.key===scope||e.key.startsWith(scope+'-'));if(near.some(e=>e.link||e.tag==='例题'))break;scope=scope.includes('-')?scope.slice(0,scope.lastIndexOf('-')):'';}
 const descendants=entries.filter(e=>e.key===key||e.key.startsWith(key+'-'));
 return {notes:descendants.filter(e=>!e.branch&&!e.link&&e.tag!=='例题'),examples:near.filter(e=>e.tag==='例题'),experiments:[...new Map(near.filter(e=>e.link).map(e=>[e.link,e])).values()]};
}
