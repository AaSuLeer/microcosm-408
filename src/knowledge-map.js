import {knowledgeTree} from './knowledge-tree.js?v=2.8.3';
import {escape,text} from './textbook.js?v=2.8.3';
export const chapters=[
{title:'01 计算机系统概述',content:['硬件与软件层次；存储程序；程序执行','性能：主频、CPI、执行时间、吞吐量'],focus:'把一条程序从指令连接到数据通路',hard:'混合指令CPI与实际运行时间',error:'主频高不保证程序更快；MIPS不能跨ISA硬比',question:'性能计算、部件功能判断、程序执行链',status:'部分仿真：整机与教学CPU；性能暂为导图',links:[['cpu','运行一段程序'],['isa','从ISA开始']],chain:'CPU时间 = 指令数 × CPI ÷ 主频'},
{title:'02 数据的表示和运算',content:['进制、原反补移码、符号/零扩展、类型转换','移位、加减与标志、乘除、IEEE754、对阶舍入'],focus:'补码、CF/OF与浮点表示是练习核心',hard:'有符号边界、乘除中间值、规格化与舍入',error:'算术右移保留符号；CF与OF的解释不同',question:'编码转换、运算过程、溢出、浮点计算',status:'部分仿真：加/乘/除；浮点和类型转换待补',links:[['adder','加法与进位'],['multiplier','逐轮乘法'],['divider','试减与恢复']],chain:'数值语义 → 位串 → ALU → 标志 → 条件跳转'},
{title:'03 存储系统',content:['层次、SRAM/DRAM/Flash、多模块、CPU连接','扩展片选、磁盘/SSD、Cache、页/段/段页'],focus:'地址划分、片选、Cache映射和地址转换',hard:'多次访存、命中率、替换/写策略与性能',error:'TLB Miss不等于缺页；字数和位宽不能混',question:'芯片连线、地址范围、访存次数、容量延迟',status:'部分仿真：扩展/磁盘/页表；Cache等待补',links:[['memory','芯片扩展'],['disk','磁盘几何'],['paging','页表与TLB']],chain:'VA → TLB/页表 → PA → Cache → 主存'},
{title:'04 指令系统',content:['ISA、操作码与指令格式、寻址方式','机器级选择/循环/调用；CISC与RISC'],focus:'区分A、EA、操作数；看懂寄存器与PC变化',hard:'间接/基址/变址/相对寻址与调用栈',error:'ISA是软硬件接口；它不是CPU内部实现',question:'扩展操作码、寻址计算、汇编/栈帧分析',status:'新增仿真：8种寻址、条件分支、CALL/RET',links:[['isa','进入指令系统'],['cpu','执行教学汇编']],chain:'指令字段 → 译码 → EA → 取数 → 写回'},
{title:'05 中央处理器',content:['寄存器、指令周期、数据通路、控制器','异常中断、流水线冒险、多处理器基本概念'],focus:'按数据通路写微操作；逐周期分析流水线',hard:'单总线互斥、转发与LOAD-use、分支冲刷',error:'一个指令周期≠一个时钟；转发不消除所有暂停',question:'控制信号表、流水时空图、CPI、异常响应',status:'新增仿真：控制字/流水线；多处理器待补',links:[['cpu','数据通路'],['control','微操作与控制字'],['pipeline','流水线冒险']],chain:'ISA需求 → 数据通路 → 控制实现 → 性能'},
{title:'06 总线',content:['分类、结构、带宽；总线事务与定时','同步/异步握手、复用、仲裁与突发'],focus:'有效传输量与总线占用时间',hard:'地址阶段、等待拍与数据拍分开计时',error:'总线带宽≠有效吞吐；突发不等于每拍重发地址',question:'带宽/周期计算、握手时序、主控权判断',status:'部分仿真：DMA仲裁/突发；通用时序待补',links:[['io','总线与接口'],['memory','突发传输']],chain:'仲裁 → 地址 → 数据 → 应答 → 释放'},
{title:'07 输入/输出系统',content:['I/O接口功能、数据/状态/控制寄存器、编址','查询、中断、DMA；多重中断与屏蔽'],focus:'区分数据搬运者和控制发起者',hard:'中断响应/处理、现场保存、DMA与CPU并行',error:'IRQ不等于已响应；DMA也需要CPU初始化',question:'接口译码、屏蔽/优先级、CPU占用率、DMA',status:'新增仿真：响应/保存/返回；嵌套中断待补',links:[['io','查询/中断/DMA'],['interrupts','中断详细过程']],chain:'设备 → 接口 → 请求 → 服务 → 恢复'}
];

export {knowledgeTree};
const wrap=(s,size=23)=>s.match(new RegExp(`.{1,${size}}`,'gu'))??[''];
export function knowledgeTreeLayout(expanded){
 expanded??=new Set(knowledgeTree.map(n=>n.key));
 const nodes=[],chapterNodes=[],edges=[];const sideHeights=[0,0];
 function measure(source,depth){const lines=wrap(source.title,source.children.length?16:21);const own=Math.max(52,lines.length*38+22+(source.tag?36:0));const open=source.children.length>0&&expanded.has(source.key);const children=open?source.children.map(c=>measure(c,depth+1)):[];return {source,key:source.key,depth,lines,own,open,children,height:Math.max(own,children.reduce((s,c)=>s+c.height,0)+Math.max(0,children.length-1)*20)};}
 const trees=knowledgeTree.map((n,ci)=>{const t=measure(n,1);t.ci=ci;t.side=ci<3?-1:1;sideHeights[t.side===-1?0:1]+=t.height+100;return t;});
 let maxDepth=1;function depth(t){maxDepth=Math.max(maxDepth,t.depth);t.children.forEach(depth);}trees.forEach(depth);
 const width=2*(maxDepth*540+260),height=Math.max(...sideHeights)+240,cx=width/2;const cursors=sideHeights.map(h=>120+(Math.max(...sideHeights)-h)/2);
 function place(t,top,side,ci,parent){const y=top+t.height/2,x=cx+side*(260+(t.depth-1)*540);const node={...t,x,y,side,ci,top,bottom:top+t.height};nodes.push(node);if(parent)edges.push({from:parent,to:node});let cy=top+(t.height-t.children.reduce((s,c)=>s+c.height,0)-Math.max(0,t.children.length-1)*20)/2;for(const c of t.children){place(c,cy,side,ci,node);cy+=c.height+20;}return node;}
 for(const t of trees){const slot=t.side===-1?0:1;chapterNodes.push(place(t,cursors[slot],t.side,t.ci));cursors[slot]+=t.height+100;}
 return {width,height,cx,nodes,chapterNodes,edges};
}
function bounds(n){const width=460;return {left:n.side===1?n.x:n.x-width,right:n.side===1?n.x+width:n.x};}
export function knowledgeMapMarkup(expanded){
 const l=knowledgeTreeLayout(expanded);let paths='',labels='';
 function edge(x1,y1,x2,y2,cls){const middle=(x1+x2)/2;return `<path d="M${x1} ${y1} C${middle} ${y1} ${middle} ${y2} ${x2} ${y2}" class="${cls}"/>`;}
 for(const n of l.chapterNodes)paths+=edge(l.cx+n.side*170,l.height/2,n.x,n.y+n.own/2,'tree-trunk');
 for(const {from,to} of l.edges){const b=bounds(from);paths+=edge(from.side===1?b.right:b.left,from.y+from.own/2,to.x,to.y+to.own/2,'tree-branch');}
 for(const n of l.nodes){const b=bounds(n),branch=n.source.children.length>0,action=n.source.link?`data-link="${escape(n.source.link)}"`:branch?`data-expand="${n.key}"`:`data-inspect="${n.key}"`;const tag=n.source.tag;const start=n.y-(n.lines.length*38+(tag?36:0))/2+23;const anchor=n.side===1?'start':'end',tx=n.x+n.side*22;
 labels+=`<g ${action} ${action?`role="button" tabindex="0" aria-label="${branch?(n.open?'收起':'展开'):''}${escape(n.source.title)}"`:''} ${branch?`aria-expanded="${n.open}"`:''} class="knowledge-node ${tag?'tagged':''}" data-node="${n.key}"><rect x="${b.left}" y="${n.y-n.own/2}" width="460" height="${n.own}" rx="6" fill="#fafbf6"/>`;
 // A continuous underline joins the incoming anchor and the outgoing anchor.
 labels+=`<path d="M${b.left} ${n.y+n.own/2}H${b.right}" class="tree-node-line"/>`;
 if(branch)labels+=`<circle cx="${n.x}" cy="${n.y+n.own/2}" r="10" class="tree-toggle"/>${text(n.x,n.y+n.own/2+6,n.open?'−':'+','tree-toggle-text','middle')}`;
 if(tag)labels+=text(tx,start,`${({重点:'★ 重点',易错:'⚑ 易错',公式:'ƒ 公式',例题:'例',题型:'解题',实验:'↗ 实验',边界:'未实现 / 模型边界'})[tag]??tag}`,'tree-leaf-tag',anchor);
 labels+=n.lines.map((line,i)=>{const y=start+(tag?36:0)+i*38,kind=tag==='重点'?'priority':tag==='公式'?'formula':tag==='易错'?'pitfall':null;const units=[...line].reduce((sum,c)=>sum+(/[^\x00-\x7F]/.test(c)?1:.58),0);const w=Math.min(432,units*(branch?24:20)+12),x=n.side===1?tx-5:tx-w+5;return (kind?`<path class="marker marker-${kind}" d="M${x} ${y-7}L${x+w} ${y-9}"/>`:'')+text(tx,y,line,n.depth===1?'tree-chapter':branch?'tree-section':'tree-leaf',anchor);}).join('')+'</g>';
 }
 return `<rect width="${l.width}" height="${l.height}" fill="#fafbf6"/>${text(l.cx,48,'知识回顾 · 逐层展开与重点辨析','tree-heading','middle')}${text(l.cx,86,'章 → 专题 → 分类与结构 → 规则 → 例题 / 易错；点击任意分支的＋继续展开','tree-caption','middle')}${paths}<rect x="${l.cx-170}" y="${l.height/2-48}" width="340" height="96" rx="12" fill="#225e50"/>${text(l.cx,l.height/2+10,'计算机组成原理','map-root','middle')}${labels}`;
}
