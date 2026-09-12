export const chapters=[
['01','计算机系统概述','从程序到整机','overview',['系统层次与存储程序','性能指标：主频、CPI、执行时间']],
['02','数据的表示和运算','从一个比特开始','adder',['数制、原码、反码与补码','加减法、标志位与 ALU','乘除法运算电路','IEEE 754 与浮点加减']],
['03','存储器层次结构','让数据各就其位','memory',['SRAM / DRAM / Flash','主存扩展、多模块交叉存储','磁盘与 SSD','Cache 映射、替换、写策略','虚拟存储、页表与 TLB']],
['04','指令系统','软件与硬件的约定','instruction',['指令格式与寻址方式','大小端与数据对齐','CISC / RISC','分支、循环与函数调用']],
['05','中央处理器','一条指令的旅程','control',['数据通路与控制器','指令周期与微操作','异常和中断','流水线与三类冒险','多处理器与硬件多线程']],
['06','总线和输入输出','连接计算机的世界','bus',['总线组成、事务与定时','I/O 接口与端口编址','查询、中断与 DMA']]];
export const components={
pc:{name:'程序计数器',en:'PROGRAM COUNTER',chapter:0,summary:'保存下一条指令的地址。取指完成后递增；分支指令可改写它。',formula:'PC → MAR  ·  PC + 2 → PC',points:['本机按字节编址，指令长度 16 位，所以 PC 每次增加 2。','PC 的位数决定可表示的地址范围；机器字长不等于指令字长。']},
control:{name:'控制器',en:'CONTROL UNIT',chapter:4,summary:'把指令译成有序的控制信号，让运算器、寄存器和存储器在正确时刻协同。',formula:'取指 → 译码 → 执行 → 写回',points:['采用教学用多周期硬布线控制，每条指令固定 6 个微步骤。','微程序控制使用控制存储器保存微指令；两者不要混淆。']},
registers:{name:'寄存器组',en:'REGISTER FILE',chapter:4,summary:'4 个 8 位通用寄存器保存正在运算的数据，是 CPU 内部最快的工作区。',formula:'R0 … R3  ·  4 × 8 bit',points:['寄存器由触发器构成，只有写使能有效的时钟沿才更新。','通用寄存器与 PC、IR、MAR、MDR 等专用寄存器用途不同。']},
alu:{name:'算术逻辑单元',en:'ARITHMETIC LOGIC UNIT',chapter:1,summary:'根据控制信号选择算术运算，同时产生反映结果的状态标志。',formula:'F = A op B  →  ZF / SF / CF / OF',points:['CF 描述无符号进位/借位，OF 描述有符号溢出。','本机 ADD/SUB 为 8 位补码运算；MUL 为无符号乘法低 8 位写回。']},
adder:{name:'加法器',en:'RIPPLE-CARRY ADDER',chapter:1,summary:'8 个全加器逐级传递进位。切换加减法，观察补码运算与标志位。',formula:'Sᵢ = Aᵢ ⊕ Bᵢ ⊕ Cᵢ',points:['减法 A − B 转换为 A + ~B + 1。','有符号数同号相加得到异号结果，发生溢出。']},
multiplier:{name:'乘法器',en:'SHIFT-AND-ADD',chapter:1,summary:'逐位检查乘数，每轮将相应移位后的被乘数加入部分积。',formula:'P = Σ bᵢ · (A << i)',points:['两个 8 位无符号数的完整乘积需要 16 位。','此实验采用无符号移位加法，不是补码 Booth 算法。']},
divider:{name:'除法器',en:'RESTORING DIVISION',chapter:1,summary:'从被除数最高位开始，移入一位并试减除数。够减商 1，不够商 0。',formula:'余数左移 → 试减 → 写入商位',points:['无符号除法须满足 被除数 = 商 × 除数 + 余数。','余数应小于除数；除数不能为零。']},
flipflop:{name:'D 触发器',en:'EDGE-TRIGGERED D FLIP-FLOP',chapter:1,summary:'在时钟上升沿把输入 D 锁存到 Q，其余时间保持原状态。',formula:'CLK ↑ 且 EN = 1 时，Q⁺ = D',points:['触发器具有记忆功能，与无状态的组合逻辑不同。','实验是理想数字模型，不模拟建立时间、保持时间与亚稳态。']},
memory:{name:'主存储器',en:'MAIN MEMORY',chapter:2,summary:'按地址存放程序和数据。地址送入 MAR，读写数据通过 MDR 传递。',formula:'256 B  ·  字节编址  ·  统一存储',points:['教学主存使用统一存储空间：程序从 0 开始，示例数据放在地址 128。','DRAM 需要刷新，SRAM 不需要刷新。实验抽象为理想存储单元。']},
cache:{name:'高速缓存',en:'DIRECT-MAPPED CACHE',chapter:2,summary:'4 行 Cache，每行 4 字节。根据块号定位行并比较标记，判断是否命中。',formula:'行号 = 主存块号 mod 4',points:['地址拆分为标记、行号、块内偏移。','实验采用直接映射，只模拟读访问与替换，不接入整机访存延迟。']},
paging:{name:'页式虚拟存储器',en:'PAGE TABLE & TLB',chapter:2,summary:'将虚拟页号映射为物理页框号，页内偏移保持不变。TLB 缓存最近的映射。',formula:'物理地址 = 页框号 × 页大小 + 页内偏移',points:['TLB 未命中不等于缺页：还需要查询页表有效位。','实验页大小为 256 B；这是独立地址转换实验，不启用整机虚存。']},
bus:{name:'系统总线',en:'SYSTEM BUS',chapter:5,summary:'地址线指明访问位置，数据线传输内容，控制线协调读写和完成应答。',formula:'请求 → 地址 → 数据 → 应答',points:['教学机数据通路为 8 位，取一条 16 位指令需要两个字节。','界面的一个“读指令”微步骤合并两次字节读取，非物理总线时钟。']},
io:{name:'输入输出接口',en:'I/O CONTROLLER',chapter:5,summary:'OUT 指令把寄存器内容写到输出接口；控制方式实验对比查询、中断与 DMA。',formula:'CPU / DMA ↔ I/O 接口 ↔ 外设',points:['DMA 传送数据时不需要 CPU 逐字节搬运，但启动和结束需要 CPU 参与。','中断响应在指令边界发生；异常一般由当前指令执行引起。']},
instruction:{name:'指令系统',en:'INSTRUCTION SET',chapter:3,summary:'自定义 16 位教学指令格式，面向数据通路讲解，不等同于 x86 或完整 RISC-V。',formula:'操作码 4 | 目标寄存器 2 | 保留 2 | 操作数 8',points:['支持 LDI、LOAD、STORE、ADD、SUB、MUL、JNZ、OUT、HALT。','LOAD/STORE 使用直接寻址；算术运算使用寄存器寻址；LDI 使用立即寻址。']},
pipeline:{name:'指令流水线',en:'FIVE-STAGE PIPELINE',chapter:4,summary:'观察五级流水线中的指令重叠，以及 RAW 依赖导致的停顿。',formula:'IF → ID → EX → MEM → WB',points:['示例不启用转发，寄存器允许同周期先写后读；相关 ADD 在 ID 等待两周期。','整机默认多周期执行，此实验单独展示流水线，不混用周期统计。']},
float:{name:'IEEE 754 浮点数',en:'BINARY32',chapter:1,summary:'把十进制数转换为单精度浮点数，查看符号、阶码和尾数字段。',formula:'(−1)ˢ × (1.f) × 2^(E−127)',points:['正规数指数偏置为 127，隐含最高位 1。','E=0 是零或非正规数；E=255 是无穷或 NaN。']},
overview:{name:'整机与性能',en:'COMPUTER SYSTEM',chapter:0,summary:'从主存中取出指令，经译码和执行改变机器状态，形成存储程序计算机的工作循环。',formula:'CPU 时间 = 指令数 × CPI / 主频',points:['本机固定每条指令 6 个微步骤，微步骤为教学粒度，非真实硬件时钟。','3D 视图使用 CSS 空间变换与实体厚度，2D 与 3D 共享同一仿真状态。']}
};
