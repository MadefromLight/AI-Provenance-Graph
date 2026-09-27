import {createHash} from "node:crypto";
export type NodeKind="data"|"model"|"prompt"|"agent"|"tool"|"decision"|"action"|"result";
export interface Node {id:string;kind:NodeKind;label:string;metadata?:Record<string,unknown>;}
export interface Edge {from:string;to:string;relation:string;}
export class ProvenanceGraph {
 nodes=new Map<string,Node>(); edges:Edge[]=[];
 addNode(node:Node){this.nodes.set(node.id,node);return node;}
 addEdge(edge:Edge){if(!this.nodes.has(edge.from)||!this.nodes.has(edge.to)) throw new Error("Both nodes must exist");this.edges.push(edge);}
 trace(start:string){const out:Node[]=[];const seen=new Set<string>();const visit=(id:string)=>{if(seen.has(id))return;seen.add(id);const n=this.nodes.get(id);if(n)out.push(n);for(const e of this.edges.filter(e=>e.from===id))visit(e.to);};visit(start);return out;}
 toJSON(){return {nodes:[...this.nodes.values()],edges:this.edges};}
}
export function nodeId(kind:string,label:string){return createHash("sha256").update(kind+":"+label).digest("hex").slice(0,16);}
