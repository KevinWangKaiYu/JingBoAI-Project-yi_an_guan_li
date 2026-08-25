/** @name 议案智能管理 */
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Building2,
  Bot,
  CalendarDays,
  CircleAlert,
  Check,
  ChevronRight,
  ClipboardList,
  FileCheck2,
  FileCog,
  FileText,
  Grid2X2,
  History,
  LayoutList,
  Lightbulb,
  LockKeyhole,
  MessageSquareMore,
  NotebookTabs,
  PenLine,
  Paperclip,
  Plus,
  RefreshCw,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Vote,
  X,
  UserRound,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Search,
} from "lucide-react";
import { defineHashPageRoute, useHashPage } from "../../common/useHashPage";
import "./proposal.css";
import "./execution-review.css";
import "./digital-flow.css";
import "./dingtalk-h5-scenes.css";
import "./dingtalk-scroll-lock.css";
import "./deliberation-info.css";
import "./deliberation-material.css";
import "./deliberation-voting.css";
import "./deliberation-voter-form.css";
import "./meeting-result.css";
import "./announcement-confirm.css";
import "./resolution-document.css";
import "./resolution-approval.css";
import "./resolution-approval-entry.css";
import "./resolution-routing.css";
import "./execution-status.css";
import "./instruction-confirm.css";
import "./instruction-assignees.css";
import "./proposal-template-editor.css";
import "./proposal-application-polish.css";
import "./proposal-review-drawers.css";
import "./dingtalk-scene-cards.css";
import "./proposal-review-actions.css";
import "./proposal-review-highlight.css";
import "./proposal-review-change-list.css";
import "./functional-review.css";
import "./executive-review.css";
import "./shell-compact.css";

const route = defineHashPageRoute(
  [
    { id: "lifecycle", title: "议案生命周期" },
    { id: "organize-submit", title: "议案整理与审核" },
    { id: "meeting-materials", title: "审议流程管理" },
    { id: "task-breakdown", title: "任务拆解与分配" },
    { id: "execution-tracking", title: "议案执行追踪" },
    { id: "digital-employee-flow", title: "议案数字员工流程监控" },
    { id: "dingtalk-h5-scenes", title: "钉钉 H5 交互场景" },
    { id: "skills", title: "技能定义" },
    { id: "permissions", title: "权限管理" },
  ],
  { defaultPageId: "lifecycle" },
);

type Stage =
  | "received"
  | "functional"
  | "prepassed"
  | "audit"
  | "auditpassed"
  | "voting"
  | "votepassed"
  | "votefailed"
  | "returned";
type Proposal = {
  id: string;
  title: string;
  source: string;
  applicant: string;
  department: string;
  time: string;
  stage: Stage;
  status: string;
  reason?: string;
  revised?: boolean;
  attachments: string[];
  templateName?: string;
  templateVersion?: string;
  lifecycleStatus?: string;
  changeTime?: string;
  rejectionHistory?: { person: string; role: string; time: string; opinion: string; changes: string }[];
  taskStatus?: string;
  taskNodes?: TaskNode[];
  executionStatus?: "执行中" | "待审核" | "驳回修改" | "已完成" | "已归档";
  executionRevision?: { reviewer: string; time: string; opinion: string; changes: string };
  organizeStatus?: OrganizeStatus;
  deliberationStatus?: DeliberationStatus;
  deliberationOutcome?: "通过" | "未通过";
  deliberationAdvice?: string;
  deliberationContent?: string;
  voteCompleted?: boolean;
};
type OrganizeStatus = "整理后待确认" | "驳回修改中" | "修改后待审核" | "预审中" | "预审通过" | "审核通过";
type DeliberationStatus = "审核通过" | "投票审议中" | "线上会议审议中" | "线下会议审议中" | "审议完成" | "公告已发送";
type TaskNode = {
  name: string;
  department: string;
  owner: string;
  proofRequired: boolean;
  deadline: string;
};
const original: Proposal[] = [
  {
    id: "PA-2026-0086",
    title: "2026年技改投资项目调整议案",
    source: "卓越流程",
    applicant: "王磊",
    department: "生产技术部",
    time: "今天 09:28",
    stage: "received",
    status: "待整理",
    templateName: "项目投资类议案模板",
    templateVersion: "V2.1",
    lifecycleStatus: "待整理",
    organizeStatus: "整理后待确认",
    changeTime: "今天 09:28",
    attachments: ["技改投资申请表.xlsx", "项目可研报告.pdf", "测算明细.xlsx"],
  },
  {
    id: "PA-2026-0081",
    title: "办公园区综合能源服务合作议案",
    source: "钉钉提交",
    applicant: "李晨",
    department: "行政管理部",
    time: "今天 08:42",
    stage: "functional",
    status: "待预审",
    templateName: "经营决策类议案模板",
    templateVersion: "V2.1",
    lifecycleStatus: "职能预审",
    organizeStatus: "驳回修改中",
    changeTime: "今天 10:06",
    rejectionHistory: [{ person: "陈颖", role: "战略执行委员会", time: "2026-08-12 10:06", opinion: "请补充合作收益测算的敏感性分析，并明确关键服务指标的验收与退出机制。", changes: "待申请人补充测算模型和服务保障方案。" }],
    reason: "请补充合作收益测算的敏感性分析，并明确关键服务指标的验收与退出机制。",
    attachments: ["议案申请表.docx", "合作方方案.pdf"],
  },
  {
    id: "PA-2026-0079",
    title: "闲置资产处置方案议案",
    source: "门户提交",
    applicant: "王楷煜",
    department: "资产管理部",
    time: "昨天 16:10",
    stage: "returned",
    status: "驳回修改",
    templateName: "经营决策类议案模板",
    templateVersion: "V2.0",
    lifecycleStatus: "驳回修改",
    organizeStatus: "修改后待审核",
    changeTime: "昨天 16:10",
    rejectionHistory: [{ person: "陈颖", role: "战略执行委员会", time: "2026-08-11 15:42", opinion: "请补充资产评估报告，并明确处置收益测算口径。", changes: "申请人已上传资产评估报告.pdf，处置方式由“公开挂牌”修改为“评估后协议转让”。" }, { person: "周敏", role: "议案整理专员", time: "2026-08-10 11:20", opinion: "议案依据未完整引用处置授权清单。", changes: "申请人补充《固定资产管理办法》及处置授权清单。" }],
    reason: "请补充资产评估报告，并明确处置收益测算口径。",
    attachments: ["处置申请表_v2.docx", "资产评估报告.pdf"],
  },
  {
    id: "PA-2026-0074",
    title: "HSE专项隐患治理资金使用议案",
    source: "卓越流程",
    applicant: "赵璇",
    department: "安全环保部",
    time: "昨天 14:23",
    stage: "audit",
    status: "待议案审核",
    templateName: "经营决策类议案模板",
    templateVersion: "V2.1",
    lifecycleStatus: "议案审核中",
    organizeStatus: "预审中",
    changeTime: "昨天 14:23",
    attachments: ["专项申请表.docx", "隐患治理清单.xlsx"],
  },
  {
    id: "PA-2026-0072",
    title: "供应链协同降本年度框架议案",
    source: "门户提交",
    applicant: "周敏",
    department: "供应链管理部",
    time: "昨天 11:06",
    stage: "audit",
    status: "待审核",
    templateName: "经营决策类议案模板",
    templateVersion: "V2.1",
    lifecycleStatus: "议案审核中",
    changeTime: "昨天 11:06",
    attachments: ["年度框架议案.docx", "降本测算.xlsx", "供应商分析.pdf"],
  },
  {
    id: "PA-2026-0067",
    title: "废水处理系统升级改造议案",
    source: "卓越流程",
    applicant: "孙浩",
    department: "安全环保部",
    time: "08-10 16:35",
    stage: "audit",
    status: "驳回修改",
    templateName: "项目投资类议案模板",
    templateVersion: "V1.8",
    lifecycleStatus: "驳回修改",
    organizeStatus: "预审通过",
    changeTime: "08-10 16:35",
    rejectionHistory: [{ person: "赵璇", role: "职能预审人", time: "2026-08-10 16:35", opinion: "请补充环保验收依据，并说明改造期间的连续生产保障方案。", changes: "待申请人回传修改内容。" }],
    reason: "请补充环保验收依据，并说明改造期间的连续生产保障方案。",
    attachments: ["升级改造申请表.docx", "环保评估报告.pdf"],
  },
  {
    id: "PA-2026-0064",
    title: "物流园仓储能力提升议案",
    source: "钉钉提交",
    applicant: "刘畅",
    department: "物流管理部",
    time: "08-10 09:18",
    stage: "audit",
    status: "驳回修改后待审核",
    templateName: "项目投资类议案模板",
    templateVersion: "V1.8",
    lifecycleStatus: "职能预审",
    organizeStatus: "审核通过",
    changeTime: "08-10 09:18",
    reason: "上一轮要求补充投资回收期测算，申请人已重新提交测算附件。",
    revised: true,
    attachments: [
      "仓储提升议案_v2.docx",
      "投资回收期测算.xlsx",
      "物流方案.pdf",
    ],
  },
  {
    id: "PA-2026-0060",
    title: "研发实验室设备购置议案",
    source: "门户提交",
    applicant: "许宁",
    department: "研发管理部",
    time: "08-09 14:40",
    stage: "audit",
    status: "审核中",
    templateName: "项目投资类议案模板",
    templateVersion: "V2.1",
    lifecycleStatus: "议案审核中",
    changeTime: "08-09 14:40",
    executionRevision: { reviewer: "周敏", time: "2026-08-12 16:10", opinion: "请补充设备验收签字页，并说明关键设备的投用测试结论。", changes: "已补传验收签字页、测试记录与设备运行照片。" },
    attachments: ["设备购置申请表.docx", "设备清单.xlsx", "询价对比表.pdf"],
  },
  {
    id: "PA-2026-0068",
    title: "高级管理人员聘任事项议案",
    source: "钉钉提交",
    applicant: "陈颖",
    department: "人力资源部",
    time: "08-10 15:40",
    stage: "auditpassed",
    status: "审核通过",
    templateName: "人事任免类议案模板",
    templateVersion: "V1.4",
    lifecycleStatus: "待投票",
    changeTime: "08-10 15:40",
    attachments: ["聘任议案.docx", "履历及考察材料.pdf"],
  },
  {
    id: "PA-2026-0061",
    title: "生产装置节能技改事项议案",
    source: "门户提交",
    applicant: "王楷煜",
    department: "生产技术部",
    time: "08-08 10:12",
    stage: "votefailed",
    status: "投票未通过",
    templateName: "项目投资类议案模板",
    templateVersion: "V2.1",
    lifecycleStatus: "审核通过",
    changeTime: "08-08 10:12",
    reason: "参会委员认为投资回收期说明不足，建议完善后重新申报。",
    attachments: ["技改事项申请表.docx", "节能评估.pdf"],
  },
  {
    id: "PA-2026-0056",
    title: "数字化平台建设二期议案",
    source: "卓越流程",
    applicant: "王楷煜",
    department: "信息管理部",
    time: "08-06 13:20",
    stage: "votepassed",
    status: "投票通过",
    templateName: "项目投资类议案模板",
    templateVersion: "V2.1",
    lifecycleStatus: "督办中",
    changeTime: "08-06 13:20",
    attachments: ["立项申请表.docx", "预算测算.xlsx"],
  },
];
const organizeDemoItems: Proposal[] = [
  { ...original[0], id: "PA-2026-0085", title: "装置能效提升改造议案", applicant: "张磊", time: "今天 09:12", status: "整理后待确认", lifecycleStatus: "整理后待确认", organizeStatus: "整理后待确认" },
  { ...original[0], id: "PA-2026-0084", title: "原料结构优化采购议案", applicant: "陈颖", time: "今天 08:56", status: "整理后待确认", lifecycleStatus: "整理后待确认", organizeStatus: "整理后待确认" },
  { ...original[1], id: "PA-2026-0080", title: "园区蒸汽管网改造议案", applicant: "刘畅", time: "今天 08:20", status: "驳回修改中", lifecycleStatus: "驳回修改", organizeStatus: "驳回修改中" },
  { ...original[1], id: "PA-2026-0078", title: "销售渠道激励优化议案", applicant: "许宁", time: "昨天 17:05", status: "驳回修改中", lifecycleStatus: "驳回修改", organizeStatus: "驳回修改中" },
  { ...original[2], id: "PA-2026-0077", title: "危化品仓储改造议案", applicant: "赵璇", time: "昨天 16:02", status: "修改后待审核", lifecycleStatus: "修改后待审核", organizeStatus: "修改后待审核" },
  { ...original[2], id: "PA-2026-0076", title: "研发试验线扩建议案", applicant: "王磊", time: "昨天 15:26", status: "修改后待审核", lifecycleStatus: "修改后待审核", organizeStatus: "修改后待审核" },
  { ...original[3], id: "PA-2026-0073", title: "安全生产数字化升级议案", applicant: "孙浩", time: "昨天 13:48", status: "预审中", lifecycleStatus: "预审中", organizeStatus: "预审中" },
  { ...original[3], id: "PA-2026-0071", title: "公用工程节水改造议案", applicant: "李晨", time: "昨天 11:42", status: "预审中", lifecycleStatus: "预审中", organizeStatus: "预审中" },
  { ...original[5], id: "PA-2026-0066", title: "供应链集中采购优化议案", applicant: "王楷煜", time: "08-10 18:10", status: "预审通过", lifecycleStatus: "预审通过", organizeStatus: "预审通过" },
  { ...original[5], id: "PA-2026-0065", title: "设备预防性维护提升议案", applicant: "陈颖", time: "08-10 17:34", status: "预审通过", lifecycleStatus: "预审通过", organizeStatus: "预审通过" },
  { ...original[6], id: "PA-2026-0063", title: "营销费用预算调整议案", applicant: "张磊", time: "08-10 08:36", status: "审核通过", lifecycleStatus: "审核通过", organizeStatus: "审核通过", voteCompleted: true, deliberationOutcome: "通过" },
  { ...original[6], id: "PA-2026-0062", title: "厂区智能安防建设议案", applicant: "许宁", time: "08-09 16:58", status: "审核通过", lifecycleStatus: "审核通过", organizeStatus: "审核通过", voteCompleted: true, deliberationOutcome: "未通过" },
];
const deliberationDemoItems: Proposal[] = [
  { ...original[8], id: "PA-2026-0055", title: "海外市场渠道拓展议案", applicant: "刘畅", department: "营销管理部", time: "08-11 09:10", deliberationStatus: "审核通过", lifecycleStatus: "审核通过" },
  { ...original[7], id: "PA-2026-0054", title: "智能制造数据平台升级议案", applicant: "周敏", department: "信息管理部", time: "08-10 17:25", deliberationStatus: "线上会议审议中", lifecycleStatus: "线上会议审议中" },
  { ...original[9], id: "PA-2026-0053", title: "消防系统综合改造议案", applicant: "孙浩", department: "安全环保部", time: "08-10 16:05", deliberationStatus: "线下会议审议中", lifecycleStatus: "线下会议审议中" },
  { ...original[1], id: "PA-2026-0052", title: "园区物流路线优化议案", applicant: "赵璇", department: "物流管理部", time: "08-10 14:40", deliberationStatus: "审议完成", deliberationOutcome: "通过", deliberationAdvice: "请在试运行阶段同步跟踪运输效率、成本节约及安全风险。", lifecycleStatus: "审议完成" },
  { ...original[2], id: "PA-2026-0051", title: "固定资产盘活处置议案", applicant: "王楷煜", department: "资产管理部", time: "08-09 18:20", deliberationStatus: "公告已发送", deliberationOutcome: "未通过", deliberationAdvice: "请补齐评估依据及退出安排后重新提请审议。", deliberationContent: "经审议，建议补充评估依据、退出安排与收益测算后重新提交。", lifecycleStatus: "公告已发送" },
];
const menu = [
  ["lifecycle", "议案生命周期", LayoutList],
  ["organize-submit", "议案整理与审核", FileCheck2],
  ["meeting-materials", "审议流程管理", Vote],
  ["task-breakdown", "任务拆解与分配", ClipboardList],
  ["execution-tracking", "议案执行追踪", ClipboardList],
  ["digital-employee-flow", "议案数字员工流程监控", LayoutList],
  ["skills", "技能定义", Sparkles],
  ["permissions", "权限管理", LockKeyhole],
] as const;
const userMenu = menu.filter(([id]) => id !== "digital-employee-flow");
const userPages = new Set(userMenu.map(([id]) => id));
const monitorPages = new Set(["digital-employee-flow"]);
const dingtalkScenePages = new Set(["dingtalk-h5-scenes"]);
const skillsSeed = [
  {
    id: "organize",
    name: "议案智能整理 Skill",
    desc: "仅在“议案整理与审核”的整理环节自动调用，用于字段抽取、附件归集和整理结果生成。",
    scene: "议案整理与审核 · 整理后待确认",
    trigger: "点击“审核”进入原件与整理结果比对页时",
    output: "结构化议案、附件归集、字段匹配提示",
    enabled: true,
    prompt: "请按《战执委议案模板》整理议案，核验材料完整性并生成议案依据。",
  },
  {
    id: "functional",
    name: "职能预审 Skill",
    desc: "仅在预审节点自动调用，按职能审核口径提示制度、预算、专业风险和材料完整性。",
    scene: "议案整理与审核 · 预审中 / 预审通过",
    trigger: "提交预审后与预审复核时",
    output: "预审建议、待补充项、风险提示",
    enabled: true,
    prompt:
      "按职责边界校验制度依据、专业风险、预算口径和附件完整性，输出可编辑意见。",
  },
  {
    id: "audit",
    name: "战执委审核 Skill",
    desc: "仅在战略执行委员会审核节点自动调用，核验决策条件、授权边界与关键风险。",
    scene: "议案整理与审核 · 预审通过",
    trigger: "审核人执行“审核通过 / 驳回修改”前",
    output: "审核结论、驳回建议、合规核验提示",
    enabled: false,
    prompt: "",
  },
  {
    id: "voting",
    name: "群投票审议信息生成 Skill",
    desc: "仅在审议流程的群投票类型自动调用，生成投票范围、催票规则与审议话术。",
    scene: "审议流程管理 · 群投票",
    trigger: "生成审议信息并选择“群投票”时",
    output: "投票人建议、催票设置、审议内容",
    enabled: true,
    prompt: "根据已审核议案生成钉钉投票卡字段及投票说明。",
  },
  {
    id: "speech",
    name: "审议结果公告生成 Skill",
    desc: "仅在审议完成后自动调用，根据通过或未通过生成对应的结果公告。",
    scene: "审议流程管理 · 审议完成",
    trigger: "点击“生成公告”时",
    output: "审议结果通知、领导建议摘要、后续行动提示",
    enabled: true,
    prompt: "依据投票通过的议案生成正式、简明的决议通知与执行提醒。",
  },
  { id: "online-meeting", name: "线上会议审议信息生成 Skill", desc: "仅服务线上会议审议，生成会议链接场景下的审议内容与参会信息。", scene: "审议流程管理 · 线上会议", trigger: "生成审议信息并选择“线上会议”时", output: "线上会议审议内容、参会信息、会议通知", enabled: true, prompt: "基于已审核通过议案生成线上会议审议内容，明确决策问题、风险和参会要求。" },
  { id: "offline-meeting", name: "线下会议审议信息生成 Skill", desc: "仅服务线下会议审议，生成会议室场景下的审议内容与参会信息。", scene: "审议流程管理 · 线下会议", trigger: "生成审议信息并选择“线下会议”时", output: "线下会议审议内容、参会信息、会议通知", enabled: true, prompt: "基于已审核通过议案生成线下会议审议内容，明确决策问题、风险和参会要求。" },
];
type TemplateField = {
  key: string;
  label: string;
  description: string;
  aliases: string;
  type: string;
  required: boolean;
  priority: string;
  conflict: string;
};
type ProposalTemplate = {
  id: string;
  name: string;
  types: string[];
  version: string;
  status: "已发布" | "草稿" | "已停用";
  updatedAt: string;
  owner: string;
  usedCount: number;
  fields: TemplateField[];
  history: { version: string; date: string; owner: string; note: string; used: number }[];
};
type TaskBreakdownTemplate = {
  id: string;
  name: string;
  types: string[];
  version: string;
  status: ProposalTemplate["status"];
  updatedAt: string;
  owner: string;
  nodes: TaskNode[];
};
const templateFieldsSeed: TemplateField[] = [
  { key: "proposal_title", label: "议案名称", description: "可供决策与归档识别的完整议案标题。", aliases: "议题名称、项目名称", type: "文本", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "proposal_no", label: "议案编号", description: "议案在系统中的唯一编号。", aliases: "申请编号、编号", type: "文本", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "proposal_type", label: "议案类型", description: "用于自动匹配议案模板和审核路径。", aliases: "类型、事项类别", type: "枚举", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "applicant_name", label: "申请人", description: "提出本次议案并对申请内容负责的自然人姓名。", aliases: "姓名、名字、提案人、联系人姓名", type: "人员", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "owning_department", label: "所属部门", description: "对议案申请和后续执行负责的归口部门。", aliases: "申报部门、责任部门", type: "组织", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "proposal_basis", label: "议案依据", description: "支撑本次议案的制度、授权或经营依据。", aliases: "政策依据、制度依据、立项依据", type: "长文本", required: true, priority: "附件补充", conflict: "标记人工确认" },
  { key: "decision_item", label: "决策事项", description: "需委员会审议、决策或授权的具体事项。", aliases: "审议事项、决策内容", type: "长文本", required: true, priority: "原申请表优先", conflict: "标记人工确认" },
  { key: "benefit_amount", label: "预计处置收益", description: "预期收益或损益金额，需保留金额与计量单位。", aliases: "预计收益、收益测算、处置收益", type: "金额", required: false, priority: "附件补充", conflict: "标记人工确认" },
  { key: "risk_notice", label: "风险提示", description: "需在审核时关注的风险、限制或前置条件。", aliases: "风险、风险说明、注意事项", type: "长文本", required: true, priority: "附件补充", conflict: "标记人工确认" },
  { key: "completion_date", label: "计划完成时间", description: "议案获批后计划达成的日期或时间节点。", aliases: "完成日期、完成时间、计划节点", type: "日期", required: false, priority: "附件补充", conflict: "标记人工确认" },
];
const templatesSeed: ProposalTemplate[] = [
  {
    id: "tpl-business", name: "经营决策类议案模板", types: ["经营决策类"], version: "V2.1", status: "已发布", updatedAt: "2026-08-12 10:20", owner: "王楷煜", usedCount: 18, fields: templateFieldsSeed,
    history: [
      { version: "V2.1", date: "2026-08-12 10:20", owner: "王楷煜", note: "补充字段别名、来源优先级和冲突提示规则", used: 18 },
      { version: "V2.0", date: "2026-07-28 16:40", owner: "李晨", note: "新增风险提示与计划完成时间", used: 6 },
      { version: "V1.0", date: "2026-06-20 09:10", owner: "李晨", note: "首次发布", used: 0 },
    ],
  },
  {
    id: "tpl-invest", name: "项目投资类议案模板", types: ["项目投资类", "技改投资类"], version: "V2.1", status: "已发布", updatedAt: "2026-08-10 15:40", owner: "李晨", usedCount: 26, fields: templateFieldsSeed.map((f) => ({ ...f, required: f.key !== "benefit_amount" })),
    history: [{ version: "V2.1", date: "2026-08-10 15:40", owner: "李晨", note: "完善投资测算字段和附件匹配规则", used: 26 }, { version: "V1.8", date: "2026-07-08 11:30", owner: "王楷煜", note: "新增计划完成时间", used: 9 }],
  },
  {
    id: "tpl-hr", name: "人事任免类议案模板", types: ["人事任免类"], version: "V1.4", status: "已发布", updatedAt: "2026-08-06 14:05", owner: "陈颖", usedCount: 4, fields: templateFieldsSeed.slice(0, 7),
    history: [{ version: "V1.4", date: "2026-08-06 14:05", owner: "陈颖", note: "增加任职资格与回避事项别名", used: 4 }],
  },
  {
    id: "tpl-major", name: "重大事项议案模板", types: ["重大事项类"], version: "V1.0", status: "草稿", updatedAt: "2026-08-12 09:45", owner: "王楷煜", usedCount: 0, fields: templateFieldsSeed.slice(0, 8),
    history: [{ version: "V1.0", date: "2026-08-12 09:45", owner: "王楷煜", note: "等待字段校验后发布", used: 0 }],
  },
];
const taskTemplatesSeed: TaskBreakdownTemplate[] = [
  { id: "task-hr", name: "人事任免类任务拆解模板", types: ["人事任免类"], version: "V1.0", status: "已发布", updatedAt: "2026-08-13 09:10", owner: "陈颖", nodes: [
    { name: "任命通知与组织备案", department: "人力资源部", owner: "陈颖", proofRequired: true, deadline: "2026-08-20" },
    { name: "岗位交接与履职跟踪", department: "人力资源部", owner: "王楷煜", proofRequired: false, deadline: "2026-09-15" },
  ] },
  { id: "task-invest", name: "项目投资类任务拆解模板", types: ["项目投资类", "技改投资类"], version: "V1.0", status: "已发布", updatedAt: "2026-08-12 14:20", owner: "王楷煜", nodes: [
    { name: "项目立项与预算确认", department: "生产技术部", owner: "王磊", proofRequired: true, deadline: "2026-09-05" },
    { name: "采购实施与合同签署", department: "供应链管理部", owner: "李晨", proofRequired: true, deadline: "2026-09-20" },
    { name: "验收与效益评估", department: "财务管理部", owner: "周敏", proofRequired: false, deadline: "2026-10-31" },
  ] },
  { id: "task-business", name: "经营决策类任务拆解模板", types: ["经营决策类"], version: "V1.2", status: "已发布", updatedAt: "2026-08-10 16:40", owner: "李晨", nodes: [
    { name: "方案落地与责任确认", department: "行政管理部", owner: "李晨", proofRequired: true, deadline: "2026-09-10" },
    { name: "执行跟踪与阶段反馈", department: "经营管理部", owner: "周敏", proofRequired: true, deadline: "2026-10-15" },
  ] },
];
const personalCss = `.pam-drawer.personal-drawer{width:min(900px,72vw);background:#f7f8fc}.personal-drawer>header{background:#fff}.personal-section{margin:14px 20px;background:#fff;border:1px solid #e2e7f1;border-radius:8px;overflow:hidden}.personal-section>header{padding:14px 16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #edf0f5}.personal-section h3{margin:0;color:#344562;font-size:16px}.personal-section p{margin:4px 0 0;color:#8996ab;font-size:12px}.personal-section header .plain{padding:6px 10px}.application-form{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));padding:7px 16px 16px;gap:0 16px}.application-form label{min-height:63px;padding:11px 0 8px;border-bottom:1px solid #eef1f5;display:flex;flex-direction:column;gap:7px}.application-form label span{font-size:12px;color:#8290a8}.application-form label b{font-weight:500;color:#41516d;line-height:1.5}.application-form label.wide{grid-column:span 3}.application-form input,.application-form select{height:32px;border:1px solid #dfe5ef;border-radius:5px;padding:0 8px;color:#41516d;background:#fff;outline-color:#6a5fe4;font:12px Microsoft YaHei}.attachment-section{margin-bottom:74px}.editable-files{padding:8px 16px 15px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 12px}.editable-files>div{border:1px solid #e4e8f0;border-radius:6px;min-height:38px;padding:8px 10px;display:flex;align-items:center;justify-content:space-between;background:#fbfcff}.editable-files .file{font-size:12px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.editable-files button{border:0;background:transparent;color:#dc5964;font-size:12px;cursor:pointer}.personal-footer{position:sticky;bottom:0;z-index:2;background:#fff;border-top:1px solid #e3e8f2;box-shadow:0 -4px 14px #30406010;padding:13px 20px;display:flex;align-items:center;justify-content:flex-end;gap:9px}.personal-footer>span{margin-right:auto;color:#74829b;font-size:12px}.personal-drawer .return-box{margin:14px 20px 0}`;

function Status({ children }: { children: string }) {
  const c =
    children.includes("驳回") || children.includes("未通过")
      ? "bad"
      : children.includes("通过")
        ? "good"
        : children.includes("待")
          ? "wait"
          : "doing";
  return <span className={`pam-status ${c}`}>{children}</span>;
}
function Shell({
  page,
  setPage,
  workspace,
  setWorkspace,
  children,
}: {
  page: string;
  setPage: (id: string) => void;
  workspace: "user" | "monitor" | "h5-scenes";
  setWorkspace: (workspace: "user" | "monitor" | "h5-scenes") => void;
  children: React.ReactNode;
}) {
  const rail = [
    ["Chat", MessageSquareMore],
    ["旺财", Bot],
    ["页面", NotebookTabs],
    ["工具", Grid2X2],
    ["个人知识", Lightbulb],
    ["设置", Settings],
  ] as const;
  return (
    <div className="pam-app">
      <header className="pam-head">
        <div className="pam-logo">
          <i>≈</i>京博
        </div>
        <strong>京博AI</strong>
        <div>
          <span className="avatar">陈</span>
          <small>⌄</small>
        </div>
      </header>
      <div className="pam-body">
        <aside className="pam-rail">
          {rail.map(([n, I], i) => (
            <button className={i === 2 ? "active" : ""} key={n}>
              <I size={21} />
              <span>{n}</span>
            </button>
          ))}
        </aside>
        <main className="pam-work">
          <div className="pam-top-tabs">
            <button
              className={`workspace-tab ${workspace === "user" ? "active" : ""}`}
              onClick={() => setWorkspace("user")}
            >
              议案智能管理用户端
            </button>
            <button
              className={`workspace-tab ${workspace === "monitor" ? "active" : ""}`}
              onClick={() => setWorkspace("monitor")}
            >
              议案数字员工流程监控
            </button>
            <button
              className={`workspace-tab ${workspace === "h5-scenes" ? "active" : ""}`}
              onClick={() => setWorkspace("h5-scenes")}
            >
              钉钉 H5 交互场景
            </button>
          </div>
          <section className={`pam-frame ${workspace === "monitor" ? "monitor-frame" : ""} ${workspace === "h5-scenes" ? "h5-scenes-frame" : ""}`}>
            {workspace === "user" && <aside className="pam-menu">
              {userMenu.map(([id, n, I]) => (
                <button
                  className={page === id ? "selected" : ""}
                  onClick={() => setPage(id)}
                  key={id}
                >
                  <I size={18} />
                  {n}
                </button>
              ))}
            </aside>}
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}
function PageTitle({
  eyebrow,
  title,
  desc,
  children,
}: {
  eyebrow: string;
  title: string;
  desc: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="pam-title">
      <div>
        <small>{eyebrow}</small>
        <h1>{title}</h1>
        <p>{desc}</p>
      </div>
      {children}
    </header>
  );
}

function ContextSkillBar({
  skill,
  description,
  onClick,
}: {
  skill: { name: string; enabled: boolean };
  description: string;
  onClick: () => void;
}) {
  return (
    <section className="context-skill-bar">
      <Sparkles size={20} />
      <div>
        <b>
          {skill.enabled ? `已启用 ${skill.name}` : `尚未配置 ${skill.name}`}
        </b>
        <span>{description}</span>
      </div>
      <button onClick={onClick}>
        {skill.enabled ? "查看 / 修改技能" : "配置技能"}
      </button>
    </section>
  );
}
function TemplatePin(_: { p: Proposal }) {
  return null;
}
function ProposalTable({
  items,
  onDetail,
  action,
  showRevisionTag = true,
}: {
  items: Proposal[];
  onDetail: (p: Proposal) => void;
  action?: (p: Proposal) => React.ReactNode;
  showRevisionTag?: boolean;
}) {
  return (
    <div className="pam-table-wrap">
      <table className="pam-table">
        <thead>
          <tr>
            <th>议案编号 / 名称</th>
            <th>来源</th>
            <th>申请人</th>
            <th>所属部门</th>
            <th>当前状态</th>
            <th>提交时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id}>
              <td>
                <b>{p.title}</b>
                <small>
                  {p.id}
                  {showRevisionTag && p.revised && (
                    <em className="revised">驳回修改后</em>
                  )}
                </small>
              </td>
              <td>{p.source}</td>
              <td>{p.applicant}</td>
              <td>{p.department}</td>
              <td>
                <Status>{p.status}</Status>
              </td>
              <td>{p.time}</td>
              <td>
                <button className="link" onClick={() => onDetail(p)}>
                  查看
                </button>
                {action?.(p)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!items.length && <div className="pam-empty">暂无待处理事项</div>}
    </div>
  );
}
function Stat({
  label,
  num,
  note,
  tone = "purple",
}: {
  label: string;
  num: string;
  note: string;
  tone?: string;
}) {
  return (
    <article className={`pam-stat ${tone}`}>
      <span>{label}</span>
      <b>{num}</b>
      <small>{note}</small>
    </article>
  );
}

function MyProposals({
  items,
  onDetail,
  onEdit,
  onSubmit,
  drafts,
}: {
  items: Proposal[];
  onDetail: (p: Proposal) => void;
  onEdit: (p: Proposal) => void;
  onSubmit: (p: Proposal) => void;
  drafts: Set<string>;
}) {
  const mine = items.filter((p) => p.applicant === "王楷煜");
  return (
    <main className="pam-content">
      <PageTitle
        eyebrow="申请人工作台"
        title="我的议案"
        desc="集中查看本人申请议案的流转状态、驳回意见和待修改事项。"
      />
      <section className="pam-card">
        <header>
          <div>
            <h2>我的申请记录</h2>
            <p>被驳回的议案会附带具体流程节点和处理意见。</p>
          </div>
          <button className="plain">
            筛选 <ChevronRight size={15} />
          </button>
        </header>
        <ProposalTable
          items={mine}
          onDetail={onDetail}
          showRevisionTag={false}
          action={(p) =>
            p.stage === "returned" || p.stage === "votefailed" ? (
              <button
                className="link strong"
                onClick={() => (drafts.has(p.id) ? onSubmit(p) : onEdit(p))}
              >
                {drafts.has(p.id) ? "提交" : "修改"}
              </button>
            ) : null
          }
        />
      </section>
    </main>
  );
}
function AdminProposalTable({
  items,
  onDetail,
  statusOf,
  action,
  showDetail = () => true,
  empty = "暂无议案",
}: {
  items: Proposal[];
  onDetail: (p: Proposal) => void;
  statusOf: (p: Proposal) => string;
  action?: (p: Proposal) => React.ReactNode;
  showDetail?: (p: Proposal) => boolean;
  empty?: string;
}) {
  return (
    <div className="pam-table-wrap">
      <table className="pam-table admin-proposal-table"><thead><tr><th>议案编号 / 名称</th><th>来源</th><th>申请人</th><th>所属部门</th><th>当前状态</th><th>变更时间</th><th>操作</th></tr></thead>
      <tbody>{items.map((p) => <tr key={p.id}><td><b>{p.title}</b><small>{p.id}</small></td><td>{p.source}</td><td>{p.applicant}</td><td>{p.department}</td><td><Status>{statusOf(p)}</Status></td><td>{p.changeTime || p.time}</td><td>{showDetail(p) && <button className="link" onClick={() => onDetail(p)}>查看</button>}{action?.(p)}</td></tr>)}</tbody></table>
      {!items.length && <div className="pam-empty">{empty}</div>}
    </div>
  );
}
function Lifecycle({ items, onDetail }: { items: Proposal[]; onDetail: (p: Proposal) => void }) {
  return <main className="pam-content"><PageTitle eyebrow="战略执行委员会 · 全流程总览" title="议案生命周期" desc="集中查看议案在整理、审核、投票、拆解、督办与归档环节的最新状态。"><button className="plain"><RefreshCw size={14}/>刷新</button></PageTitle>
    <section className="pam-card"><header><div><h2>全部议案</h2><p>显示当前状态、最近变更时间与完整进度记录。</p></div><label className="pam-search">⌕ <input placeholder="搜索议案名称、编号或申请人" /></label></header><AdminProposalTable items={items} onDetail={onDetail} statusOf={(p) => p.lifecycleStatus || p.status} empty="暂无议案" /></section>
  </main>;
}const digitalEmployeeStages = [
  { title: "议案收集", agentTitle: "议案收集智能体", desc: "", x: 25, agentX: 235, lane: "议案数字员工" },
  { title: "议案审核", agentTitle: "议案审核智能体", desc: "", x: 470, agentX: 680, lane: "议案数字员工" },
  { title: "审议", agentTitle: "审议智能体", desc: "", x: 915, agentX: 1125, lane: "议案数字员工" },
  { title: "决议传递", agentTitle: "决议传递智能体", desc: "", x: 1360, agentX: 1570, lane: "议案数字员工" },
  { title: "议案执行监督", agentTitle: "议案执行监督智能体", desc: "", x: 1805, agentX: 2015, lane: "议案数字员工" },
] as const;

const digitalEmployeeNodes = [
  { id: "01", title: "卓越议案收集", x: 235, y: 260, tone: "cyan", lane: 0, steps: ["卓越议案收集"] },
  { id: "02", title: "门户议案收集", x: 235, y: 340, tone: "cyan", lane: 0, steps: ["门户议案收集"] },
  { id: "03", title: "钉钉议案机器人收集", x: 235, y: 620, tone: "cyan", lane: 0, steps: ["钉钉议案机器人收集"] },
  { id: "04", title: "议案类型判断", x: 680, y: 220, tone: "indigo", lane: 1, steps: ["议案类型判断"] },
  { id: "05", title: "修改信息识别", x: 680, y: 300, tone: "indigo", lane: 1, steps: ["修改信息识别"] },
  { id: "06", title: "基础审核", x: 680, y: 380, tone: "indigo", lane: 1, steps: ["基础审核"] },
  { id: "07", title: "职能审核", x: 680, y: 610, tone: "indigo", lane: 1, steps: ["职能审核"] },
  { id: "08", title: "战执委审核", x: 680, y: 690, tone: "indigo", lane: 1, steps: ["战执委审核"] },
  { id: "12", title: "基础信息收集", x: 1125, y: 260, tone: "violet", lane: 2, steps: ["基础信息收集"] },
  { id: "13", title: "审议确认与发起", x: 1125, y: 340, tone: "violet", lane: 2, steps: ["审议确认与发起"] },
  { id: "14", title: "审议监控", x: 1125, y: 420, tone: "violet", lane: 2, steps: ["审议监控"] },
  { id: "15", title: "生成审议公告", x: 1125, y: 590, tone: "violet", lane: 2, steps: ["生成审议公告"] },
  { id: "16", title: "生成决议文件", x: 1125, y: 670, tone: "violet", lane: 2, steps: ["生成决议文件"] },
  { id: "17", title: "生成指令", x: 1125, y: 750, tone: "violet", lane: 2, steps: ["生成指令"] },
  { id: "18", title: "分发流程判断", x: 1570, y: 220, tone: "amber", lane: 3, steps: ["分发流程判断"] },
  { id: "19", title: "向上审批", x: 1570, y: 300, tone: "amber", lane: 3, steps: ["向上审批"] },
  { id: "20", title: "横向备案", x: 1570, y: 610, tone: "amber", lane: 3, steps: ["横向备案"] },

  { id: "22", title: "向下分发", x: 1570, y: 690, tone: "amber", lane: 3, steps: ["向下分发"] },
  { id: "23", title: "执行监听", x: 2015, y: 300, tone: "green", lane: 4, steps: ["执行监听"] },
  { id: "24", title: "执行结果分析", x: 2015, y: 380, tone: "green", lane: 4, steps: ["执行结果分析"] },
  { id: "25", title: "整理归档材料", x: 2015, y: 620, tone: "green", lane: 4, steps: ["整理归档材料"] },
  { id: "26", title: "执行归档", x: 2015, y: 700, tone: "rose", lane: 4, steps: ["执行归档"] },
] as const;

const digitalEmployeeLanes = ["议案数字员工", "议案数字员工", "议案数字员工", "议案数字员工", "议案数字员工"] as const;
type DigitalEmployeeNode = typeof digitalEmployeeNodes[number];
type DigitalEmployeeSubtask = { title: string; role: "议案数字员工" | "各环节负责人" | "申请人"; detail: string; h5Operation?: string };
const digitalEmployeeSubtasks: Record<DigitalEmployeeNode["id"], DigitalEmployeeSubtask[]> = {
  "01": [
    { title: "调用工具收集议案", role: "议案数字员工", detail: "跟卓越进行接口对接，收集卓越新提交的议案申请。" },
    { title: "自动编码", role: "议案数字员工", detail: "调用系统的编码接口，对新的议案进行编码。" },
    { title: "议案存储", role: "议案数字员工", detail: "议案存储在智能体文件系统中。" },
  ],
  "02": [
    { title: "调用工具收集议案", role: "议案数字员工", detail: "跟门户进行接口对接，收集门户新提交的议案申请。" },
    { title: "自动编码", role: "议案数字员工", detail: "调用系统的编码接口，对新的议案进行编码。" },
    { title: "议案存储", role: "议案数字员工", detail: "议案存储在智能体文件系统中。" },
  ],
  "03": [
    { title: "议案申请", role: "申请人", detail: "在钉钉的议案机器人发送议案申请，根据定义好的模板，填写议案申请材料。", h5Operation: "application" },
    { title: "调用工具收集议案", role: "议案数字员工", detail: "跟钉钉议案机器人进行接口对接，收集新提交的议案申请。" },
    { title: "自动编码", role: "议案数字员工", detail: "调用系统的编码接口，对新的议案进行编码。" },
    { title: "议案存储", role: "议案数字员工", detail: "议案存储在智能体文件系统中。" },
  ],  "04": [
    { title: "议案类型判断", role: "议案数字员工", detail: "判断当前提交的是新议案，还是经过修改后重新提交的议案。" },
    { title: "议案分发", role: "议案数字员工", detail: "新议案进入基础审核；修改后的议案进入修改信息识别。" },
  ],  "05": [
    { title: "申请文件内容比对", role: "议案数字员工", detail: "比对当前提交的申请表与修改前申请表的差异。" },
    { title: "申请模板内容比对", role: "议案数字员工", detail: "比对当前提交的申请模板与修改前申请模板的差异。" },
    { title: "附件内容比对", role: "议案数字员工", detail: "比对当前提交的附件文件及内容与修改前版本的差异。" },
    { title: "修改总结", role: "议案数字员工", detail: "依据 Skill 定义的总结方式和输出格式，生成修改内容说明。" },
    { title: "议案分发", role: "议案数字员工", detail: "识别议案被驳回时所在的审核流程，并回到对应审核流程继续处理。" },
  ],  "06": [
    { title: "基础检查", role: "议案数字员工", detail: "根据基础检查规则，对议案材料进行完整性、规范性与必填项检查。" },
    { title: "技能调取与检测", role: "议案数字员工", detail: "如配置相关 Skill，则按 Skill 规则进行基础内容检查。" },
    { title: "生成基础检查审核建议", role: "议案数字员工", detail: "根据检查结果生成可供负责人查看和修改的基础审核建议。" },
    { title: "基础审核内容推送", role: "议案数字员工", detail: "通过议案机器人将审核建议推送给基础审核负责人。" },
    { title: "基础审核核验", role: "各环节负责人", detail: "负责人在钉钉内查看并可修改审核意见，选择驳回或通过；通过后自动进入职能审核。", h5Operation: "basic-review" },
    { title: "整理驳回信息", role: "议案数字员工", detail: "被驳回时，整理原议案文件、审核意见和审核人信息。" },
    { title: "驳回材料推送", role: "议案数字员工", detail: "将整理后的材料和审核意见发送给申请人进行修改。" },
    { title: "基础审核驳回修改", role: "申请人", detail: "申请人依据审核意见在钉钉内修改并重新提交；提交后重新进入修改信息识别。", h5Operation: "basic-revision" },
  ],  "07": [
    { title: "职能检查", role: "议案数字员工", detail: "根据职能审核规则，对议案材料进行专业内容检查。" },
    { title: "技能调取与检测", role: "议案数字员工", detail: "如配置相关 Skill，则按 Skill 规则进行职能内容检查。" },
    { title: "生成职能审核建议", role: "议案数字员工", detail: "根据检查结果生成可供负责人查看和修改的职能审核建议。" },
    { title: "职能审核内容推送", role: "议案数字员工", detail: "通过议案机器人将审核建议推送给职能审核负责人。" },
    { title: "职能审核核验", role: "各环节负责人", detail: "负责人在钉钉内查看并可修改审核意见，选择驳回或通过；通过后自动进入战执委审核。", h5Operation: "functional-review" },
    { title: "整理驳回信息", role: "议案数字员工", detail: "被驳回时，整理原议案文件、审核意见和审核人信息。" },
    { title: "驳回材料推送", role: "议案数字员工", detail: "将整理后的材料和审核意见发送给申请人进行修改。" },
    { title: "职能审核驳回修改", role: "申请人", detail: "申请人依据审核意见在钉钉内修改并重新提交；提交后重新进入修改信息识别。", h5Operation: "functional-revision" },
  ],  "08": [
    { title: "战执委检查", role: "议案数字员工", detail: "根据战执委审核规则，对议案材料进行决策边界与关键风险检查。" },
    { title: "技能调取与检测", role: "议案数字员工", detail: "如配置相关 Skill，则按 Skill 规则进行战执委审核检查。" },
    { title: "生成战执委审核建议", role: "议案数字员工", detail: "根据检查结果生成可供负责人查看和修改的战执委审核建议。" },
    { title: "战执委审核内容推送", role: "议案数字员工", detail: "通过议案机器人将审核建议推送给战执委审核负责人。" },
    { title: "战执委审核核验", role: "各环节负责人", detail: "负责人在钉钉内查看并可修改审核意见，选择驳回或通过；通过后自动进入审议流程。", h5Operation: "executive-review" },
    { title: "整理驳回信息", role: "议案数字员工", detail: "被驳回时，整理原议案文件、审核意见和审核人信息。" },
    { title: "驳回材料推送", role: "议案数字员工", detail: "将整理后的材料和审核意见发送给申请人进行修改。" },
    { title: "战执委审核驳回修改", role: "申请人", detail: "申请人依据审核意见在钉钉内修改并重新提交；提交后重新进入修改信息识别。", h5Operation: "executive-revision" },
  ],  "12": [
    { title: "确认审议信息", role: "议案数字员工", detail: "明确当前议案的审议形式、通知群；如为群投票，明确投票群及投票人名单。" },
    { title: "填写审议基础信息", role: "各环节负责人", detail: "在钉钉内根据已明确的审议信息填写相关内容。", h5Operation: "deliberation-info" },
    { title: "同步审议信息", role: "议案数字员工", detail: "将填写的审议信息同步到智能体的数据结构中。" },
  ],  "13": [
    { title: "加载表决话术 Skill", role: "议案数字员工", detail: "如配置表决话术相关 Skill，则进行调用加载。" },
    { title: "生成表决话术", role: "议案数字员工", detail: "根据已加载的 Skill 生成表决话术。" },
    { title: "整理审议材料", role: "议案数字员工", detail: "整理表决话术以外、审议所需的全部材料。" },
    { title: "发送负责人审查", role: "议案数字员工", detail: "将审议材料发送给负责人进行审查。" },
    { title: "确认审议材料", role: "各环节负责人", detail: "负责人在钉钉内对审议材料进行修改和确认。", h5Operation: "deliberation-material" },
    { title: "同步审议材料信息", role: "议案数字员工", detail: "将确认后的审议材料内容同步到智能体的数据结构中。" },
    { title: "发送审议通知群", role: "议案数字员工", detail: "将审议材料发送到指定的审议通知群中。" },
  ],  "14": [
    { title: "审议结果监控", role: "议案数字员工", detail: "群投票结束后自动收集结果；线上或线下审议则按设定间隔向负责人发送钉钉消息确认。" },
    { title: "填写审议结果", role: "各环节负责人", detail: "确认审议结束后，在钉钉内手动填写相关结果信息。", h5Operation: "meeting-result" },
    { title: "同步审议结果", role: "议案数字员工", detail: "将审议结果回填到智能体的数据结构中。" },
  ],  "15": [
    { title: "加载公告 Skill", role: "议案数字员工", detail: "如配置公告相关 Skill，则进行调用加载。" },
    { title: "生成公告", role: "议案数字员工", detail: "根据 Skill 生成审议公告。" },
    { title: "公告推送确认", role: "议案数字员工", detail: "将生成的公告发送给负责人进行确认。" },
    { title: "审议公告确认", role: "各环节负责人", detail: "负责人在钉钉内对公告进行修改和确认。", h5Operation: "announcement" },
    { title: "同步公告信息", role: "议案数字员工", detail: "将确认后的公告信息回填到智能体的数据结构中。" },
    { title: "公告发送", role: "议案数字员工", detail: "将公告发送到审议通知群中。" },
  ],  "16": [
    { title: "技能调用", role: "议案数字员工", detail: "调用决议文件生成技能。" },
    { title: "生成决议文件", role: "议案数字员工", detail: "生成对应的决议文件。" },
    { title: "决议文件推送确认", role: "各环节负责人", detail: "接收并确认决议文件。" },
    { title: "决议文件确认", role: "各环节负责人", detail: "钉钉内确认决议文件。", h5Operation: "resolution-document" },
    { title: "信息回填", role: "各环节负责人", detail: "回填决议文件确认信息。" },
    { title: "传送到传递环节", role: "议案数字员工", detail: "将确认后的决议文件传送至决议传递智能体。" },
  ],  "17": [
    { title: "技能调用", role: "议案数字员工", detail: "调用指令生成技能。" },
    { title: "生成指令", role: "议案数字员工", detail: "生成结构化执行指令。" },
    { title: "指令推送确认", role: "各环节负责人", detail: "接收并确认执行指令。" },
    { title: "指令确认", role: "各环节负责人", detail: "钉钉内确认执行指令。", h5Operation: "instruction" },
    { title: "信息回填", role: "各环节负责人", detail: "回填指令确认与责任信息。" },
    { title: "传送到执行监听", role: "议案数字员工", detail: "将确认后的指令传送至执行监听环节。" },
  ],  "18": [
    { title: "读取向上审批配置", role: "议案数字员工", detail: "读取决议文件确认环节中已明确的“是否需要向上审批”配置。" },
    { title: "决议分发", role: "议案数字员工", detail: "需要向上审批则进入向上审批；不需要则直接并行进入横向备案和向下分发。" },
  ],  "19": [
    { title: "发送决议文件审批", role: "议案数字员工", detail: "将决议文件发送给指定审批人进行审批。" },
    { title: "决议文件审批", role: "各环节负责人", detail: "审批人在钉钉内进行审批确认并填写审批意见。", h5Operation: "resolution-approval" },
    { title: "同步审批结果", role: "议案数字员工", detail: "将审批结果和审批意见同步到智能体的数据结构中。" },
  ],  "20": [
    { title: "生成决议备案确认推送", role: "议案数字员工", detail: "生成并推送决议备案确认内容。" },
    { title: "决议横向审批", role: "各环节负责人", detail: "钉钉内确认横向备案。", h5Operation: "resolution-filing" },
    { title: "信息回填", role: "各环节负责人", detail: "回填备案确认信息。" },
    { title: "执行备案", role: "议案数字员工", detail: "完成决议备案执行并记录结果。" },
  ],  "22": [
    { title: "发送决议通知", role: "议案数字员工", detail: "将决议文件发送给申请人，完成结果通知与决议内容同步。" },
    { title: "确认决议文件", role: "申请人", detail: "申请人在钉钉内确认决议文件及通知结果。", h5Operation: "resolution-downward" },
    { title: "同步确认结果", role: "议案数字员工", detail: "将申请人的确认结果同步到智能体的数据结构中。" },
    { title: "进入执行监听", role: "议案数字员工", detail: "确认后认定决议开始执行，并进入执行监听节点。" },
  ],  "23": [
    { title: "定时发送执行情况填写通知", role: "议案数字员工", detail: "定时向指定负责人发送决议和指令执行情况的填写通知；两项执行均结束后，统一进入下一步分析。" },
    { title: "填写决议执行情况", role: "各环节负责人", detail: "决议执行结束后，在钉钉内填写决议执行情况。", h5Operation: "resolution-execution" },
    { title: "填写指令执行情况", role: "各环节负责人", detail: "指令执行结束后，在钉钉内填写指令执行情况。", h5Operation: "instruction-execution" },
  ],  "24": [
    { title: "技能调用", role: "议案数字员工", detail: "调用执行结果分析相关技能。" },
    { title: "决议执行情况分析", role: "议案数字员工", detail: "分析决议执行进度、结果及异常情况。" },
    { title: "指令执行情况分析", role: "议案数字员工", detail: "分析指令执行进度、结果及异常情况。" },
    { title: "议案执行结果推送确认", role: "各环节负责人", detail: "接收并确认议案执行结果。" },
    { title: "议案执行确认", role: "各环节负责人", detail: "钉钉内确认议案执行结果。", h5Operation: "execution-confirm" },
    { title: "信息回填", role: "各环节负责人", detail: "回填执行结果确认及补充信息。" },
  ],  "25": [
    { title: "归档材料整理", role: "议案数字员工", detail: "汇总整理议案、决议与执行过程中的归档材料。" },
    { title: "归档材料确认推送", role: "议案数字员工", detail: "将归档材料推送至相关负责人确认。" },
    { title: "议案归档确认", role: "各环节负责人", detail: "钉钉内确认议案归档材料。", h5Operation: "archive-confirm" },
  ],  "26": [
    { title: "执行归档", role: "议案数字员工", detail: "完成执行材料归档并记录归档结果。" },
  ],
};

function DigitalEmployeeFlow({ notice }: { notice: (s: string) => void }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(0.74);
  const [fitZoom, setFitZoom] = useState(0.74);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number; originX: number; originY: number } | null>(null);
  const [selectedNode, setSelectedNode] = useState<DigitalEmployeeNode | null>(null);
  const [selectedSubtask, setSelectedSubtask] = useState<string | null>(null);
  const [h5Operation, setH5Operation] = useState<string | null>(null);
  const [jumpCue, setJumpCue] = useState<{ fromId: string | null; toId: string; subtaskKey?: string; token: number } | null>(null);
  const [drawerView, setDrawerView] = useState<"tasks" | "trace">("tasks");
  const [selectedTraceNode, setSelectedTraceNode] = useState<string | null>(null);
  const wheelVelocityRef = useRef({ x: 0, y: 0 });
  const wheelFrameRef = useRef<number | null>(null);
  const nodesByLane = digitalEmployeeStages.map((_, lane) => digitalEmployeeNodes.filter((node) => node.lane === lane));
  const detailLinks: string[] = [];
  // 跨一级阶段仅保留图中真实的流转入口，使用弧线避开本阶段的审核/分支节点。
  const crossLinks: string[] = [];
  // 一级智能体之间仅保留参考图中的阶段串联；二级模块不增加额外跳线。
  const secondaryBypassLinks: string[] = [];
  useEffect(() => { if (!jumpCue) return; const timer = window.setTimeout(() => setJumpCue(null), 2500); return () => window.clearTimeout(timer); }, [jumpCue]);
  useEffect(() => {
    const fit = () => {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;
      const value = Math.min(1, Math.max(0.42, Math.min((rect.width - 28) / 2230, (rect.height - 28) / 1000)));
      setFitZoom(value);
      setZoom(value);
      setPan({ x: 0, y: 0 });
    };
    fit();
    const observer = new ResizeObserver(fit);
    if (viewportRef.current) observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const releaseMomentum = () => {
      const velocity = wheelVelocityRef.current;
      if (Math.abs(velocity.x) < 0.08 && Math.abs(velocity.y) < 0.08) {
        wheelFrameRef.current = null;
        return;
      }
      setPan((value) => ({ x: value.x + velocity.x, y: value.y + velocity.y }));
      velocity.x *= 0.84;
      velocity.y *= 0.84;
      wheelFrameRef.current = requestAnimationFrame(releaseMomentum);
    };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) {
        const factor = Math.exp(-event.deltaY * 0.0032);
        setZoom((value) => Math.max(0.42, Math.min(1.18, Number((value * factor).toFixed(2)))));
        return;
      }
      wheelVelocityRef.current.x += -event.deltaX * 0.16;
      wheelVelocityRef.current.y += -event.deltaY * 0.16;
      if (wheelFrameRef.current === null) wheelFrameRef.current = requestAnimationFrame(releaseMomentum);
    };
    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      viewport.removeEventListener("wheel", onWheel);
      if (wheelFrameRef.current !== null) cancelAnimationFrame(wheelFrameRef.current);
    };
  }, []);
  const cueJump = (toId: string, subtaskKey?: string) => setJumpCue({ fromId: selectedNode?.id ?? null, toId, subtaskKey, token: Date.now() });
  const moveToNode = (nodeId: string, message: string) => { cueJump(nodeId); setSelectedNode(digitalEmployeeNodes.find((node) => node.id === nodeId) ?? null); setSelectedSubtask(null); notice(message); };
  const advanceH5Operation = (operation: string | null) => {
    if (!selectedNode || !operation) { notice("钉钉内操作已提交，流程将继续处理"); return; }
    const tasks = digitalEmployeeSubtasks[selectedNode.id];
    const taskIndex = tasks.findIndex((task) => task.h5Operation === operation);
    if (taskIndex >= 0 && taskIndex < tasks.length - 1) { const nextTaskKey = `${selectedNode.id}-${taskIndex + 1}`; cueJump(selectedNode.id, nextTaskKey); setSelectedSubtask(nextTaskKey); notice("钉钉内操作已提交，已进入下一子任务"); return; }
    const nodeIndex = digitalEmployeeNodes.findIndex((node) => node.id === selectedNode.id);
    const nextNode = digitalEmployeeNodes[nodeIndex + 1];
    if (nextNode) { moveToNode(nextNode.id, "钉钉内操作已提交，已进入下一二级节点"); return; }
    notice("钉钉内操作已提交，流程已完成");
  };
  const completeH5Operation = () => {
    const operation = h5Operation;
    setH5Operation(null);
    if (operation === "application") { cueJump("03", "03-1"); setSelectedSubtask("03-1"); notice("议案申请已提交，已进入子任务 02：调用工具收集议案"); return; }
    if (operation === "basic-review") { moveToNode("07", "基础审核已通过，已进入职能审核"); return; }
    if (operation === "functional-review") { moveToNode("08", "职能审核已通过，已进入战执委审核"); return; }
    if (operation === "executive-review") { moveToNode("12", "战执委审核已通过，已进入基础信息收集"); return; }
    if (["basic-revision", "functional-revision", "executive-revision"].includes(operation ?? "")) { moveToNode("04", "修改材料已提交，已进入议案类型判断"); return; }
    advanceH5Operation(operation);
  };
  const rejectH5Operation = () => {
    const operation = h5Operation;
    setH5Operation(null);
    if (operation === "basic-review") { cueJump("06", "06-5"); setSelectedSubtask("06-5"); notice("基础审核已驳回，已进入整理驳回信息"); return; }
    if (operation === "functional-review") { cueJump("07", "07-5"); setSelectedSubtask("07-5"); notice("职能审核已驳回，已进入整理驳回信息"); return; }
    if (operation === "executive-review") { cueJump("08", "08-5"); setSelectedSubtask("08-5"); notice("战执委审核已驳回，已进入整理驳回信息"); return; }
    notice("钉钉内操作已驳回，流程将继续处理");
  };
  const resetView = () => { setZoom(fitZoom); setPan({ x: 0, y: 0 }); };
  const zoomBy = (delta: number) => setZoom((value) => Math.max(0.42, Math.min(1.18, Number((value + delta).toFixed(2)))));
  const startDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("button,input")) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ x: event.clientX, y: event.clientY, originX: pan.x, originY: pan.y });
  };
  const nodeData = selectedTraceNode ? (() => {
    const has = (...words: string[]) => words.some((word) => selectedTraceNode.includes(word));
    const normal = [
      { key: "议案申请表", type: "file", value: "技术改造项目议案申请表.docx · 64 KB" },
      { key: "议案申请附件", type: "file", value: "技术改造项目支撑材料.zip · 2.4 MB" },
      { key: "议案状态", type: "text", value: "审议流程中" },
      { key: "议案编号", type: "text", value: "2026-001" },
      { key: "来源信息", type: "text", value: "战略执行委员会提报" },
      { key: "议案申请部门", type: "text", value: "战略发展部" },
      { key: "议案申请人", type: "text", value: "陈颖" },
      { key: "议案负责人", type: "text", value: "赵璇" },
    ];
    const changed = [
      ...(has("开始") ? [{ key: "议案状态", type: "text", value: "已启动议案收集流程" }] : []),
      ...(has("卓越议案收集") ? [{ key: "来源信息", type: "text", value: "卓越议案平台提报，材料已接收" }, { key: "议案状态", type: "text", value: "待材料汇集" }] : []),
      ...(has("门户议案收集") ? [{ key: "来源信息", type: "text", value: "企业门户提报，申请信息已同步" }, { key: "议案状态", type: "text", value: "待材料汇集" }] : []),
      ...(has("钉钉议案收集") ? [{ key: "来源信息", type: "text", value: "钉钉工作台提报，附件已归集" }, { key: "议案状态", type: "text", value: "待材料汇集" }] : []),
      ...(has("钉钉修改回传") ? [{ key: "议案申请附件", type: "file", value: "技术改造项目补充材料_v2.zip · 1.8 MB" }, { key: "议案状态", type: "text", value: "修改材料已回传" }] : []),
      ...(has("议案类型判定") ? [{ key: "审议基础信息", type: "text", value: "已判定为经营决策类议案，匹配对应审议模板与审核路径。" }] : []),
      ...(has("修改信息") ? [
        { key: "审议基础信息", type: "text", value: "审议方式更新为“线上投票”；已补充审议时间：2026-08-20 14:30。" },
        { key: "领导建议", type: "text", value: "已补充关键指标测算与执行风险闭环方案，按修改范围路由至对应审核环节。" },
      ] : []),
      ...(has("基础性规则匹配") ? [{ key: "审议基础信息", type: "text", value: "基础规则匹配完成，材料完整性与必填项校验通过。" }, { key: "领导建议", type: "text", value: "建议进入职能预审，重点关注实施计划的可执行性。" }] : []),
      ...(has("基础性驳回") ? [{ key: "领导建议", type: "text", value: "退回补充预算测算依据及实施边界说明。" }, { key: "议案状态", type: "text", value: "基础审核驳回修改" }] : []),
      ...(has("基础审核负责人判断") ? [{ key: "审议负责人", type: "text", value: "基础审核负责人：周敏，审核意见已确认。" }] : []),
      ...(has("职能相关规则") ? [{ key: "审议基础信息", type: "text", value: "职能规则校验完成，已匹配预算、制度及专业风险口径。" }, { key: "领导建议", type: "text", value: "建议进入战执委审核，补充跨部门协同计划。" }] : []),
      ...(has("职能驳回") ? [{ key: "领导建议", type: "text", value: "需补充专业评估结论与责任分工后重新提交。" }, { key: "议案状态", type: "text", value: "职能预审驳回修改" }] : []),
      ...(has("职能预审负责人判断") ? [{ key: "审议负责人", type: "text", value: "职能预审负责人：李晨，预审结论已确认。" }] : []),
      ...(has("战执委相关规则") ? [{ key: "审议基础信息", type: "text", value: "战执委审核规则匹配完成，决策边界与关键风险已核验。" }, { key: "领导建议", type: "text", value: "建议形成审议材料并进入正式审议流程。" }] : []),
      ...(has("战执委驳回") ? [{ key: "领导建议", type: "text", value: "请补充关键指标敏感性分析与风险闭环措施。" }, { key: "议案状态", type: "text", value: "战执委审核驳回修改" }] : []),
      ...(has("战执委负责人判断") ? [{ key: "审议负责人", type: "text", value: "战执委审核负责人：陈颖，审核结论已确认。" }] : []),
      ...(has("审议负责人") ? [{ key: "审议负责人", type: "text", value: "赵璇（已确认）" }] : []),
      ...(has("审议材料", "生成审议材料") ? [{ key: "审议基础信息", type: "text", value: "审议时间：2026-08-20 14:30；审议方式：线上投票" }, { key: "审议表决话术", type: "text", value: "请各委员依据议案材料、风险说明及补充意见进行表决。" }] : []),
      ...(has("审议监控", "投票") ? [{ key: "投票信息", type: "text", value: "已投 5 / 8 人；当前意见：同意 4 票、待确认 3 人" }] : []),
      ...(has("生成审议公告") ? [{ key: "审议公告", type: "text", value: "《技术改造项目议案审议结果公告》" }, { key: "公告状态", type: "text", value: "待议案负责人确认" }] : []),
      ...(has("生成决议文件") ? [{ key: "决议文件", type: "file", value: "2026-001_审议决议文件.docx · 128 KB" }, { key: "决议状态", type: "text", value: "待审议负责人确认" }, { key: "决议审批意见", type: "text", value: "同意按审议结论形成正式决议。" }] : []),
      ...(has("生成指令") ? [{ key: "指令", type: "file", value: "2026-001_执行指令.pdf · 86 KB" }, { key: "指令状态", type: "text", value: "待审议负责人确认" }] : []),
      ...(has("负责人判断") ? [{ key: "领导建议", type: "text", value: "补充投资回收期测算依据后进入下一环节。" }] : []),
      ...(has("决议文件接收") ? [{ key: "决议文件", type: "file", value: "2026-001_审议决议文件.docx · 128 KB" }, { key: "决议状态", type: "text", value: "已接收，待审批" }] : []),
      ...(has("向上审批") ? [{ key: "决议审批意见", type: "text", value: "已提交上级审批，待审批意见回写。" }, { key: "决议状态", type: "text", value: "审批中" }] : []),
      ...(has("横向路由") ? [{ key: "决议执行负责人", type: "text", value: "已通知相关协同部门，并同步指定执行负责人。" }] : []),
      ...(has("向下路由") ? [{ key: "指令状态", type: "text", value: "执行指令已下发至责任部门。" }] : []),
      ...(has("决议文件备案") ? [{ key: "决议文件", type: "file", value: "2026-001_审议决议文件_已备案.docx · 128 KB" }, { key: "决议状态", type: "text", value: "已完成备案" }] : []),
      ...(has("通知发起部门") ? [{ key: "决议执行负责人", type: "text", value: "李晨 · 战略发展部，已确认接收执行任务。" }] : []),
      ...(has("执行结果分析") ? [{ key: "议案执行结果分析", type: "text", value: "计划节点完成率 68%，关键风险已闭环，建议持续跟踪验证材料。" }] : []),
      ...(has("执行监听") ? [{ key: "决议执行负责人", type: "text", value: "李晨 · 战略发展部" }, { key: "议案状态", type: "text", value: "执行中，已建立节点监听" }] : []),
      ...(has("议案负责人确认") ? [{ key: "议案执行结果分析", type: "text", value: "议案负责人已确认执行结果及后续跟踪事项。" }] : []),
      ...(has("归档负责人确认") ? [{ key: "议案归档材料", type: "file", value: "2026-001_待归档材料清单.xlsx · 42 KB" }] : []),
      ...(has("执行归档") ? [{ key: "议案归档材料", type: "file", value: "2026-001_议案归档材料.zip · 5.6 MB" }, { key: "议案状态", type: "text", value: "已归档" }] : []),
      ...(has("结束") ? [{ key: "议案状态", type: "text", value: "流程已结束，记录已归档" }] : []),
    ];
    const skills = [
      ...(has("基础审核") ? ["基础规则审核skill"] : []),
      ...(has("职能预审") ? ["职能预审skill"] : []),
      ...(has("战执委审核") ? ["战执委审核skill"] : []),
      ...(has("审议公告") ? ["审议公告skill"] : []),
      ...(has("审议材料", "决议文件") ? ["审议文件skill"] : []),
      ...(has("指令") ? ["指令skill"] : []),
      ...(has("执行结果分析") ? ["执行结果分析skill"] : []),
    ];
    const mcps = [
      ...(has("议案收集", "议案信息整理", "议案类型") ? ["议案编号插件"] : []),
      ...(has("决议", "路由通知") ? ["决议文件备案插件"] : []),
      ...(has("归档") ? ["议案归档插件"] : []),
    ];
    return { normal, changed, skills, mcps };
  })() : null;
  const renderNodeRecord = (record: { key: string; type: string; value: string }, changed = false) => <div className={`bp-data-record ${record.type} ${changed ? "changed" : ""}`} key={record.key}><code>{record.key}</code>{record.type === "file" ? <div className="bp-data-file"><FileText size={16}/><div><b>{record.value.split(" · ")[0]}</b><small>{record.value.split(" · ")[1]}</small></div><i>↗</i></div> : <p>{record.value}</p>}</div>;
  const nodeDataModal = selectedTraceNode && nodeData && <div className="bp-node-data-modal-backdrop" onClick={() => setSelectedTraceNode(null)}><section className="bp-node-data-modal" role="dialog" aria-modal="true" aria-label={`${selectedTraceNode} 节点详情`} onClick={(event) => event.stopPropagation()}><header><div><small>NODE BUSINESS DETAIL</small><h3>{selectedTraceNode}</h3><p>本节点仅展示发生变更的业务字段。</p></div><button type="button" onClick={() => setSelectedTraceNode(null)} aria-label="关闭详情"><X size={17}/></button></header><section><h4>议案基础信息</h4>{nodeData.normal.map((record) => renderNodeRecord(record))}</section>{nodeData.changed.length > 0 && <section className="bp-changed-data"><h4>本环节更新字段</h4>{nodeData.changed.map((record) => renderNodeRecord(record, true))}</section>}<footer><div><span>调用 Skill</span>{nodeData.skills.length ? nodeData.skills.map((skill) => <b key={skill}>{skill}</b>) : <b>本节点未调用 Skill</b>}</div><div><span>调用 MCP</span>{nodeData.mcps.length ? nodeData.mcps.map((mcp) => <b key={mcp}>{mcp}</b>) : <b>本节点未调用 MCP</b>}</div></footer></section></div>;
  return <main className="blueprint-flow-page">
    <div className="blueprint-viewport" ref={viewportRef} onPointerDown={startDrag} onPointerMove={(event) => { if (drag) setPan({ x: drag.originX + event.clientX - drag.x, y: drag.originY + event.clientY - drag.y }); }} onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}>
      <div className="blueprint-canvas" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
        <svg className="blueprint-lines" viewBox="0 0 2230 1000" aria-hidden="true">
          <defs>
            <marker id="bp-stage-arrow" markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto"><path d="M0 0 L8 4.5 L0 9z" fill="#69e8ff" /></marker>
            <marker id="bp-main-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8z" fill="#72efff" /></marker>
            <marker id="bp-down-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8z" fill="#54d9ec" /></marker>
            <filter id="bp-glow"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <g className="bp-stage-links">
            {digitalEmployeeStages.slice(0, -1).map((stage, index) => {
              const next = digitalEmployeeStages[index + 1];
              const path = `M${stage.x + 182} 530 H${next.x}`;
              return <g key={stage.title}><path d={path} markerEnd="url(#bp-stage-arrow)" /><circle className="bp-moving-dot" r="2.3"><animateMotion dur="1.8s" repeatCount="indefinite" path={path} /></circle></g>;
            })}
          </g>
          <g className="bp-stage-maps">
            {digitalEmployeeStages.map((stage, index) => {
              const laneNodes = nodesByLane[index];
              const first = laneNodes[0]; const last = laneNodes[laneNodes.length - 1];
              const leftRail = `M${stage.agentX - 15} ${first.y + 35} V${last.y + 35}`;
              const rightRail = `M${stage.agentX + 153} ${first.y + 35} V${last.y + 35}`;
              const moduleLinks = laneNodes.flatMap((node) => [{ path: `M${stage.agentX - 15} ${node.y + 35} H${stage.agentX}`, inbound: true }, { path: `M${stage.agentX + 138} ${node.y + 35} H${stage.agentX + 153}`, inbound: false }]);
              return <g key={stage.title}><path d={leftRail}/><path d={rightRail}/>{moduleLinks.map(({ path, inbound }) => <path d={path} markerEnd={inbound ? "url(#bp-down-arrow)" : undefined} key={path}/>)}</g>;
            })}
          </g>
          {jumpCue?.fromId && jumpCue.fromId !== jumpCue.toId && (() => {
            const from = digitalEmployeeNodes.find((node) => node.id === jumpCue.fromId); const to = digitalEmployeeNodes.find((node) => node.id === jumpCue.toId);
            if (!from || !to) return null;
            const path = `M${from.x + 70} ${from.y + 35} C${from.x + 185} ${from.y + 35},${to.x - 115} ${to.y + 35},${to.x + 70} ${to.y + 35}`;
            return <g className="bp-jump-route" key={`jump-${jumpCue.token}`}><path d={path} markerEnd="url(#bp-main-arrow)"/><circle r="4"><animateMotion dur="1.35s" repeatCount="1" path={path}/></circle></g>;
          })()}          <g className="bp-detail-flow" filter="url(#bp-glow)">
            {detailLinks.map((path) => <g key={path}><path d={path} markerEnd="url(#bp-down-arrow)"/><circle className="bp-moving-dot" r="2.1"><animateMotion dur="2.3s" repeatCount="indefinite" path={path} /></circle></g>)}
          </g>
          <g className="bp-cross-flow" filter="url(#bp-glow)">
            {crossLinks.map((path) => <g key={path}><path d={path} markerEnd="url(#bp-main-arrow)"/><circle className="bp-moving-dot" r="2.1"><animateMotion dur="2.7s" repeatCount="indefinite" path={path} /></circle></g>)}
            {secondaryBypassLinks.map((path) => <g key={path}><path d={path} markerEnd="url(#bp-main-arrow)"/><circle className="bp-moving-dot" r="2.1"><animateMotion dur="2.7s" repeatCount="indefinite" path={path} /></circle></g>)}
          </g>

        </svg>
        {digitalEmployeeStages.map((stage, index) => <section className="bp-stage" style={{ left: stage.x }} key={stage.title}>
          <span className="bp-stage-index">{String(index + 1).padStart(2, "0")}</span><b>{stage.title}</b><i />
        </section>)}
        {digitalEmployeeStages.map((stage) => <section className="bp-agent-title" style={{ left: stage.agentX - 22 }} key={`${stage.title}-agent`}><i />{stage.agentTitle}</section>)}
        {digitalEmployeeStages.map((stage, index) => {
  const laneNodes = nodesByLane[index];
  const top = 14;
  const left = stage.x - 20;
  const right = stage.x + 415;
  const bottom = Math.max(...laneNodes.map((node) => node.y + 70)) + 30;
  return <div className="bp-lane" style={{ left, top, width: right - left, height: bottom - top }} key={`${stage.lane}-${index}`} aria-label={`${stage.agentTitle}流程分区`} />;
})}
        
        {digitalEmployeeNodes.map((node, index) => <button type="button" className={`bp-node ${node.tone} ${selectedNode?.id === node.id ? "active" : ""} ${jumpCue?.toId === node.id ? "jump-target" : ""}`} style={{ left: node.x, top: node.y }} key={`${node.id}-${jumpCue?.toId === node.id ? jumpCue.token : "idle"}`} onClick={() => { setSelectedNode(node); setSelectedSubtask(null); setSelectedTraceNode(null); setDrawerView("tasks"); }}><em>二级节点 · {String(index + 1).padStart(2, "0")}</em><b>{node.title}</b></button>)}
      </div>
      <aside className="bp-tools" aria-label="画布视图控制"><button type="button" onClick={() => zoomBy(0.08)} aria-label="放大"><ZoomIn size={16}/></button><strong>{Math.round(zoom * 100)}%</strong><button type="button" onClick={() => zoomBy(-0.08)} aria-label="缩小"><ZoomOut size={16}/></button><i/><button type="button" onClick={resetView} aria-label="复位视图"><RotateCcw size={15}/></button></aside>
    </div>
    {selectedNode && <aside className="bp-task-drawer" aria-label={`${selectedNode.title}模块子任务`}>
      <header><div><small>AGENT SUBTASKS</small><h2>{selectedNode.title}</h2><p>当前二级模块包含 {digitalEmployeeSubtasks[selectedNode.id].length} 项协同子任务</p></div><button type="button" onClick={() => setSelectedNode(null)} aria-label="关闭"><X size={23}/></button></header>
      <div className="bp-drawer-progress"><span>模块子任务</span><b>{digitalEmployeeSubtasks[selectedNode.id].length} 项</b><i><em style={{ width: "100%" }} /></i></div>
      <section className="bp-subtask-list">
        {digitalEmployeeSubtasks[selectedNode.id].map((task, index) => { const taskKey = `${selectedNode.id}-${index}`; return <button type="button" className={`bp-subtask ${selectedSubtask === taskKey ? "active" : ""} ${jumpCue?.subtaskKey === taskKey ? "jump-target" : ""}`} key={`${taskKey}-${jumpCue?.subtaskKey === taskKey ? jumpCue.token : "idle"}`} onClick={() => { setSelectedSubtask(taskKey); if (task.h5Operation) setH5Operation(task.h5Operation); }}>
          <header><span>子任务 {String(index + 1).padStart(2, "0")}</span><em className={task.h5Operation ? "h5-action" : ""}>{task.h5Operation ? "钉钉内操作" : task.role}</em></header><b>{task.title}</b><p>{task.detail}</p>
        </button>; })}
      </section>
    </aside>}
    <div className="bp-h5-operation">
      {h5Operation === "application" && <ProposalApplicationDrawer onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "basic-review" && <ProposalReviewDrawer mode="basic" onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} onReject={rejectH5Operation} />}
      {h5Operation === "basic-revision" && <ProposalReviewDrawer mode="revision" onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "functional-review" && <ProposalReviewDrawer mode="functional" onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} onReject={rejectH5Operation} />}
      {h5Operation === "functional-revision" && <ProposalReviewDrawer mode="functional-revision" onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "executive-review" && <ProposalReviewDrawer mode="executive" onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} onReject={rejectH5Operation} />}
      {h5Operation === "executive-revision" && <ProposalReviewDrawer mode="executive-revision" onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "deliberation-info" && <DeliberationInfoDrawer onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "deliberation-material" && <DeliberationMaterialDrawer onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "meeting-result" && <MeetingResultDrawer onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "announcement" && <H5AnnouncementConfirmDrawer onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "resolution-document" && <ResolutionDocumentDrawer onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "instruction" && <InstructionConfirmDrawer onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "resolution-approval" && <ResolutionApprovalDrawer onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "resolution-filing" && <ResolutionFilingDrawer onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "resolution-downward" && <ResolutionDownwardRouteDrawer onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "resolution-execution" && <ExecutionStatusDrawer kind="resolution" onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "instruction-execution" && <ExecutionStatusDrawer kind="instruction" onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "execution-confirm" && <ProposalExecutionConfirmDrawer mode="execution" onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
      {h5Operation === "archive-confirm" && <ProposalExecutionConfirmDrawer mode="archive" onClose={() => setH5Operation(null)} onSubmit={completeH5Operation} />}
    </div>    {nodeDataModal}
  </main>;
}
const dingtalkScenes = [
  {
    id: "01",
    title: "议案申请",
    desc: "申请人发起议案、录入基础信息并提交申请材料。",
    trigger: "议案收集与整理 · 发起申请",
    role: "申请人",
    state: "待设计",
    Icon: PenLine,
    eyebrow: "议案服务，从发起开始",
    lead: "手机填写议案，材料一次提交",
    action: "发起申请",
    tone: "purple",
    proposal: null,
  },
  {
    id: "02",
    title: "基础审核驳回修改",
    desc: "申请人接收驳回意见，补充材料并再次提交审核。",
    trigger: "议案数据审核 · 驳回修改",
    role: "申请人",
    state: "待设计",
    Icon: FileCog,
    eyebrow: "议案修改，及时处理",
    lead: "查看意见，补齐材料再提交",
    action: "处理修改",
    tone: "orange",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "03",
    title: "基础审核核验",
    desc: "审核负责人核对议案要素与附件材料，输出核验结论。",
    trigger: "议案数据审核 · 基础审核",
    role: "审核负责人",
    state: "待设计",
    Icon: ShieldCheck,
    eyebrow: "基础审核，快速核验",
    lead: "核对要素与附件，完成审核意见",
    action: "开始核验",
    tone: "green",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "04",
    title: "职能审核驳回修改",
    desc: "申请人根据职能审核建议补充并重新提交议案材料。",
    trigger: "职能审核 · 驳回修改",
    role: "申请人",
    state: "待处理",
    Icon: FileCog,
    eyebrow: "职能审核，及时处理",
    lead: "查看审核建议，补齐材料再提交",
    action: "处理修改",
    tone: "orange",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "05",
    title: "职能审核核验",
    desc: "职能审核负责人核验议案材料并形成审核结论。",
    trigger: "职能审核 · 材料核验",
    role: "职能审核负责人",
    state: "待处理",
    Icon: ShieldCheck,
    eyebrow: "职能审核，快速核验",
    lead: "核对专业材料，完成职能审核意见",
    action: "开始核验",
    tone: "green",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "06",
    title: "战执委驳回修改",
    desc: "申请人根据战执委审核建议补充并重新提交议案材料。",
    trigger: "战执委审核 · 驳回修改",
    role: "申请人",
    state: "待处理",
    Icon: FileCog,
    eyebrow: "战执委审核，及时处理",
    lead: "查看审核建议，补齐材料再提交",
    action: "处理修改",
    tone: "orange",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "07",
    title: "战执委审核核验",
    desc: "战执委审核负责人核验议案材料并形成审核结论。",
    trigger: "战执委审核 · 材料核验",
    role: "战执委审核负责人",
    state: "待处理",
    Icon: ShieldCheck,
    eyebrow: "战执委审核，快速核验",
    lead: "核对决策材料，完成战执委审核意见",
    action: "开始核验",
    tone: "green",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "08",
    title: "审议基础信息收集",
    desc: "确认审议形式并收集投票或会议信息，为后续审议做好准备。",
    trigger: "战执委审核 · 审议准备",
    role: "审议组织人",
    state: "待处理",
    Icon: Vote,
    eyebrow: "审议准备，集中收集",
    lead: "选择审议形式，补全会议信息",
    action: "填写信息",
    tone: "purple",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "09",
    title: "确认审议材料",
    desc: "核对议案基础材料，并确认可用于审议的表决话术。",
    trigger: "审议准备 · 材料确认",
    role: "审议组织人",
    state: "待处理",
    Icon: FileCheck2,
    eyebrow: "审议材料，确认发布",
    lead: "完善表决话术，确认审议材料",
    action: "确认材料",
    tone: "green",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "10",
    title: "线上/线下审议结果收集",
    desc: "审议结束后汇总投票结果、执行意见与后续指令。",
    trigger: "审议执行 · 结果收集",
    role: "审议负责人",
    state: "待处理",
    Icon: ClipboardList,
    eyebrow: "审议结束，汇总结果",
    lead: "收集票数、执行意见与额外指令",
    action: "收集结果",
    tone: "green",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "11",
    title: "审议公告确认",
    desc: "确认审议结果通知内容，并在发送前完成必要调整。",
    trigger: "审议执行 · 公告确认",
    role: "审议负责人",
    state: "待处理",
    Icon: Bell,
    eyebrow: "审议公告，确认发布",
    lead: "核对审议结论，确认公告内容",
    action: "确认公告",
    tone: "purple",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "12",
    title: "决议文件确认",
    desc: "核对已汇编的决议文件，并确认会议纪要、审议通知与投票记录。",
    trigger: "审议执行 · 决议确认",
    role: "审议负责人",
    state: "待处理",
    Icon: FileCheck2,
    eyebrow: "决议文件，确认归档",
    lead: "查看 Word 决议文件，确认归档内容",
    action: "确认文件",
    tone: "green",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "13",
    title: "指令确认",
    desc: "汇总委员额外指令，形成可执行的后续待办事项。",
    trigger: "审议执行 · 指令确认",
    role: "审议负责人",
    state: "待处理",
    Icon: ClipboardList,
    eyebrow: "审议指令，确认待办",
    lead: "汇总原指令，确认执行待办",
    action: "确认指令",
    tone: "orange",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "14",
    title: "决议文件审批",
    desc: "审批负责人核对决议文件，并提交最终审批结果与意见。",
    trigger: "决议文件 · 向上审批",
    role: "决议文件审批负责人",
    state: "待处理",
    Icon: ShieldCheck,
    eyebrow: "决议文件，审批确认",
    lead: "核对决议文件，提交审批结论",
    action: "开始审批",
    tone: "green",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "15",
    title: "决议横向审批",
    desc: "相关部门核对决议审批文件后，完成横向备案。",
    trigger: "决议文件 · 横向审批",
    role: "备案负责人",
    state: "待处理",
    Icon: FileCheck2,
    eyebrow: "决议文件，横向备案",
    lead: "核对决议文件，完成横向备案",
    action: "办理备案",
    tone: "green",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "16",
    title: "决议文件向下路由",
    desc: "指定议案执行负责人，将已确认决议文件路由至执行环节。",
    trigger: "决议文件 · 向下路由",
    role: "路由负责人",
    state: "待处理",
    Icon: Send,
    eyebrow: "决议文件，向下执行",
    lead: "指定执行负责人，发送执行指令",
    action: "路由执行",
    tone: "purple",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "17",
    title: "决议执行情况",
    desc: "确认决议执行完成后，填写执行情况并上传证明材料。",
    trigger: "决议执行 · 执行反馈",
    role: "议案执行负责人",
    state: "待处理",
    Icon: ClipboardList,
    eyebrow: "决议执行，反馈进展",
    lead: "填写决议执行情况，上传证明材料",
    action: "填写情况",
    tone: "green",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "18",
    title: "指令执行情况",
    desc: "确认指令执行完成后，填写执行情况并上传证明材料。",
    trigger: "指令执行 · 执行反馈",
    role: "指令执行负责人",
    state: "待处理",
    Icon: ClipboardList,
    eyebrow: "指令执行，反馈进展",
    lead: "填写指令执行情况，上传证明材料",
    action: "填写情况",
    tone: "orange",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "19",
    title: "议案执行确认",
    desc: "汇总核对决议与指令执行情况及证明材料。",
    trigger: "执行反馈 · 汇总确认",
    role: "流程负责人",
    state: "待确认",
    Icon: ClipboardList,
    eyebrow: "执行汇总，确认结果",
    lead: "核对决议及指令执行情况",
    action: "执行确认",
    tone: "green",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
  {
    id: "20",
    title: "议案归档确认",
    desc: "确认完整议案资料后，完成归档。",
    trigger: "流程归档 · 材料确认",
    role: "归档负责人",
    state: "待确认",
    Icon: ClipboardList,
    eyebrow: "资料齐套，确认归档",
    lead: "核对议案材料与执行证明",
    action: "确认归档",
    tone: "purple",
    proposal: { no: "ZWB-014-20260819-0003", name: "关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案", department: "BWA平台与应用研发部", applicant: "宋照晨" },
  },
] as const;

function DingtalkH5Scenes({ notice }: { notice: (s: string) => void }) {
  const [openScene, setOpenScene] = useState<string | null>(null);
  const [meetingEndConfirm, setMeetingEndConfirm] = useState(false);
  const [executionCompleteScene, setExecutionCompleteScene] = useState<"17" | "18" | null>(null);
  const openSceneEntry = (id: string) => id === "10" ? setMeetingEndConfirm(true) : id === "17" || id === "18" ? setExecutionCompleteScene(id) : setOpenScene(id);
  return <main className="h5-scenes-page">
    <header className="h5-scenes-title">
      <div>
        <small>钉钉移动端交互入口</small>
        <h1>钉钉 H5 交互场景</h1>
        <p>承接议案数字员工运行过程中的人员交互。</p>
      </div>
    </header>
    <section className="h5-scene-library">
      <div className="h5-scene-grid">
        {dingtalkScenes.map((scene) => {
          const Icon = scene.Icon;
          return <article className={`h5-scene-card ${scene.tone}`} key={scene.id}>
            <div className="h5-scene-card-banner"><b>{scene.eyebrow}</b><span>场景 {scene.id} · {scene.state}</span></div>
            <div className="h5-scene-card-body">{scene.proposal ? <p className="h5-scene-task">待处理议案</p> : <p>{scene.lead}</p>}<div className="h5-scene-visual"><i><Icon size={39}/></i><div><strong>{scene.title}</strong><span>{scene.role}专属入口</span></div></div>{scene.proposal ? <dl className="h5-scene-proposal"><div><dt>议案编号</dt><dd>{scene.proposal.no}</dd></div><div><dt>议案名称</dt><dd>{scene.proposal.name}</dd></div><div><dt>申请部门</dt><dd>{scene.proposal.department}</dd></div><div><dt>申请人</dt><dd>{scene.proposal.applicant}</dd></div></dl> : <dl><div><dt>触发节点</dt><dd>{scene.trigger}</dd></div></dl>}<button type="button" onClick={() => openSceneEntry(scene.id)}>{scene.action} <ChevronRight size={16}/></button></div>
          </article>;
        })}
      </div>
    </section>
    {openScene === "01" && <ProposalApplicationDrawer onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("议案申请已提交，等待后续流转处理"); }} />}
    {openScene === "02" && <ProposalReviewDrawer mode="revision" onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("修改材料已提交，等待基础审核复核"); }} />}
    {openScene === "03" && <ProposalReviewDrawer mode="basic" onClose={() => setOpenScene(null)} onReject={() => { setOpenScene(null); notice("基础审核已驳回，申请人将收到修改建议"); }} onSubmit={() => { setOpenScene(null); notice("基础审核已通过"); }} />}
    {openScene === "04" && <ProposalReviewDrawer mode="functional-revision" onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("职能审核修改材料已提交"); }} />}
    {openScene === "05" && <ProposalReviewDrawer mode="functional" onClose={() => setOpenScene(null)} onReject={() => { setOpenScene(null); notice("职能审核已驳回，申请人将收到修改建议"); }} onSubmit={() => { setOpenScene(null); notice("职能审核已通过"); }} />}
    {openScene === "06" && <ProposalReviewDrawer mode="executive-revision" onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("战执委审核修改材料已提交"); }} />}
    {openScene === "07" && <ProposalReviewDrawer mode="executive" onClose={() => setOpenScene(null)} onReject={() => { setOpenScene(null); notice("战执委审核已驳回，申请人将收到修改建议"); }} onSubmit={() => { setOpenScene(null); notice("战执委审核已通过"); }} />}
    {openScene === "08" && <DeliberationInfoDrawer onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("审议基础信息已提交，可进入后续审议安排"); }} />}
    {openScene === "09" && <DeliberationMaterialDrawer onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("审议材料已确认，可发送表决话术"); }} />}
    {openScene === "10" && <MeetingResultDrawer onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("审议结果已收集并提交"); }} />}
    {openScene === "11" && <H5AnnouncementConfirmDrawer onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("审议公告已确认，可进入发送流程"); }} />}
    {openScene === "12" && <ResolutionDocumentDrawer onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("决议文件已确认，可进入归档流程"); }} />}
    {openScene === "13" && <InstructionConfirmDrawer onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("指令信息已确认，可进入任务拆解流程"); }} />}
    {openScene === "14" && <ResolutionApprovalDrawer onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("决议文件审批结果已提交"); }} />}
    {openScene === "15" && <ResolutionFilingDrawer onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("决议文件已完成横向备案"); }} />}
    {openScene === "16" && <ResolutionDownwardRouteDrawer onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("决议文件已路由至执行负责人"); }} />}
    {openScene === "17" && <ExecutionStatusDrawer kind="resolution" onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("决议执行情况已提交"); }} />}
    {openScene === "18" && <ExecutionStatusDrawer kind="instruction" onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("指令执行情况已提交"); }} />}
    {openScene === "19" && <ProposalExecutionConfirmDrawer mode="execution" onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("议案执行情况已确认"); }} />}
    {openScene === "20" && <ProposalExecutionConfirmDrawer mode="archive" onClose={() => setOpenScene(null)} onSubmit={() => { setOpenScene(null); notice("议案已确认归档"); }} />}
    {meetingEndConfirm && <H5MeetingEndConfirm onEnded={() => { setMeetingEndConfirm(false); setOpenScene("10"); }} onNotEnded={() => setMeetingEndConfirm(false)} />}
    {executionCompleteScene && <H5ExecutionCompleteConfirm kind={executionCompleteScene === "17" ? "resolution" : "instruction"} onCompleted={() => { setOpenScene(executionCompleteScene); setExecutionCompleteScene(null); }} onNotCompleted={() => setExecutionCompleteScene(null)} />}
  </main>;
}

const deliberationFiles = [
  { id: "application", label: "议案申请表", name: "议案申请表_ZWB-014-20260819-0003.pdf" },
  { id: "template", label: "议案申请模板", name: "高管任职调整议案.docx" },
  { id: "attachments", label: "议案申请附件", name: "议案申请附件（3项）.zip" },
  { id: "advice", label: "战执委审核意见", name: "战执委审核意见.pdf" },
  { id: "owner", label: "战执委审核负责人", name: "审核负责人信息_李晨.pdf" },
] as const;

function DeliberationInfoDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [method, setMethod] = useState<"group" | "online" | "offline">("group");
  const [activeFile, setActiveFile] = useState<(typeof deliberationFiles)[number] | null>(null);
  const methodLabel = method === "group" ? "群内投票" : method === "online" ? "线上会议" : "线下会议";
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer h5-deliberation-drawer" role="dialog" aria-modal="true" aria-label="审议基础信息收集" onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 审议准备</small><h2>审议基础信息收集</h2><p>确认审议方式，并补全后续审议所需信息。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-deliberation-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section h5-deliberation-summary"><label>议案基本信息</label><div><span><i>议案编号</i><b>ZWB-014-20260819-0003</b></span><span className="wide"><i>议案名称</i><b>关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案</b></span><span><i>申请部门</i><b>BWA平台与应用研发部</b></span><span><i>议案负责人</i><b>宋照晨</b></span><span><i>议案类型</i><b>人力资源类（高管类）</b></span></div></section>
        <section className="h5-form-section"><label>审议材料</label><div className="h5-reference-files">{deliberationFiles.map((file) => <button key={file.id} type="button" onClick={() => setActiveFile(file)}><FileText size={17}/><span><b>{file.label}</b><small>{file.name}</small></span><ChevronRight size={15}/></button>)}</div></section>
        <section className="h5-form-section h5-method-section"><label>审议形式 <b>*</b></label><div className="h5-method-picker" role="radiogroup" aria-label="审议形式"><button type="button" className={method === "group" ? "active" : ""} onClick={() => setMethod("group")}>群内投票</button><button type="button" className={method === "online" ? "active" : ""} onClick={() => setMethod("online")}>线上会议</button><button type="button" className={method === "offline" ? "active" : ""} onClick={() => setMethod("offline")}>线下会议</button></div></section>
        <section className="h5-deliberation-fields"><header><b>{methodLabel}信息</b><span>请补全本次审议安排</span></header>{method === "group" && <div className="h5-form-grid"><FormField label="审议信息发送群" required placeholder="请选择或填写发送群" /><FormField label="投票群" required placeholder="请选择或填写投票群" /><FormField label="投票人" required placeholder="请选择投票人" /><FormField label="投票截止时间" required icon={<CalendarDays size={15}/>} placeholder="请选择截止时间" /></div>}{method === "online" && <div className="h5-form-grid"><FormField label="审议信息发送群" required placeholder="请选择或填写发送群" /><FormField label="会议链接" required placeholder="请输入会议链接" /><FormField label="会议时间" required icon={<CalendarDays size={15}/>} placeholder="请选择会议时间" /><FormField label="参与人" required placeholder="请选择参与人" /><FormField label="投票人" required placeholder="请选择投票人" /></div>}{method === "offline" && <div className="h5-form-grid"><FormField label="审议信息发送群" required placeholder="请选择或填写发送群" /><FormField label="会议时间" required icon={<CalendarDays size={15}/>} placeholder="请选择会议时间" /><FormField label="会议地点" required placeholder="请输入会议地点" /><FormField label="参会人" required placeholder="请选择参会人" /><FormField label="投票人" required placeholder="请选择投票人" /></div>}</section>
        <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">提交基础信息</button></footer>
      </form>
    </aside>
    {activeFile && <ProposalReferenceViewer file={activeFile} onClose={() => setActiveFile(null)} />}
  </div>;
}

function ProposalReferenceViewer({ file, onClose }: { file: (typeof deliberationFiles)[number]; onClose: () => void }) {
  const contents: Record<(typeof deliberationFiles)[number]["id"], string> = {
    application: "本文件汇总议案申请表字段，包括议案编号、申请部门、负责人、议案类型及申请内容。",
    template: "本文件为人力资源类（高管类）议案模板，已包含本次高级管理人员任职调整的议案正文。",
    attachments: "本压缩包包含任职调整说明、干部履历及考察材料、任职调整依据说明等三项附件。",
    advice: "战执委审核意见：建议确认任职调整的决策依据、授权边界与组织影响后，进入审议安排。",
    owner: "战执委审核负责人：李晨。审核结论已确认，可联系负责人了解审核意见详情。",
  };
  return <aside className="h5-template-editor h5-reference-viewer" role="dialog" aria-modal="true" aria-label={`${file.label}查看`} onMouseDown={(event) => event.stopPropagation()}><header><div><small>审议材料 · 文件查看</small><h2>{file.label}</h2><p>{file.name}</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header><main className="h5-template-paper"><h3>{file.label}</h3><p>{contents[file.id]}</p><section className="h5-template-note"><b>文件状态</b><span>已完成战执委审核，可作为审议基础信息收集的参考材料。</span></section></main><footer><button type="button" className="pam-primary" onClick={onClose}>关闭查看</button></footer></aside>;
}

function DeliberationMaterialDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [activeFile, setActiveFile] = useState<(typeof deliberationFiles)[number] | null>(null);
  const [votersOpen, setVotersOpen] = useState(false);
  const [voteResult, setVoteResult] = useState<"pass" | "reject" | "abstain" | null>(null);
  const voters = ["王海峰", "李晨", "陈颖", "周敏", "刘伟", "张琳", "孙明", "赵静"];
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer h5-deliberation-drawer" role="dialog" aria-modal="true" aria-label="确认审议材料" onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 审议准备</small><h2>确认审议材料</h2><p>确认表决话术与议案基础材料后，可发送审议信息。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-deliberation-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section"><label>表决话术</label><div className="h5-speech-editor" contentEditable suppressContentEditableWarning><p>各位委员/总裁：</p><p className="h5-indent">为<span className="h5-agent-generated">优化公司组织管理与经营决策效率</span>，依据<span className="h5-agent-generated">ESG战略执行委员会职权及《公司章程》</span>，现提请审核/审批关于《<span className="h5-agent-generated">山东邦维信息科技有限公司部分高级管理人员任职调整</span>》的议案。详情如下：</p><h4>一、需决策问题：<span className="h5-agent-generated">审议张磊同志拟任公司副总经理及相关高级管理人员任职调整方案。</span></h4><h4>二、核心依据：</h4><ol><li><span className="h5-agent-generated">《公司章程》及公司高级管理人员任免管理相关规定。</span></li><li><span className="h5-agent-generated">ESG战略执行委员会职权第 9 条关于高级管理人员任免方案的审议要求。</span></li><li><span className="h5-agent-generated">干部履历、考察材料及任职资格核验结果。</span></li></ol><h4>三、关键风险及应对：</h4><ol><li><span className="h5-agent-generated">任职资格与岗位职责匹配风险：已完成资格核验，并在任职文件中明确职责边界。</span></li><li><span className="h5-agent-generated">组织调整衔接风险：已制定岗位交接与生效安排，确保经营管理平稳过渡。</span></li></ol><h4>四、所需资源：<span className="h5-agent-generated">无需新增专项资金及人力资源。</span></h4><p className="h5-speech-sign">以上议案表决时间截止<span className="h5-agent-generated">2026 年 08 月 28 日 18:00</span>，请各位委员/总裁予以审议、表决。</p></div><small className="h5-speech-note">浅色标记内容由智能体生成，可直接修改。</small></section>
        <section className="h5-form-section h5-deliberation-info-card"><label>审议信息</label><div><span><i>审议形式</i><b>群内投票</b></span><span><i>审议信息发送群</i><b>战执委审议通知群</b></span><span><i>投票群</i><b>战执委表决群</b></span><span className="h5-voters-cell"><i>投票人</i><button type="button" onClick={() => setVotersOpen((value) => !value)}>战执委委员（8人）<ChevronRight size={13}/></button></span><span><i>投票截止时间</i><b>2026-08-28 18:00</b></span>{votersOpen && <section className="h5-voter-list"><b>投票人名单</b><div>{voters.map((name) => <span key={name}>{name}</span>)}</div></section>}</div></section>
        <section className="h5-form-section h5-deliberation-summary"><label>议案基本信息</label><div><span><i>议案编号</i><b>ZWB-014-20260819-0003</b></span><span className="wide"><i>议案名称</i><b>关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案</b></span><span><i>申请部门</i><b>BWA平台与应用研发部</b></span><span><i>议案负责人</i><b>宋照晨</b></span><span><i>议案类型</i><b>人力资源类（高管类）</b></span></div></section>
        <section className="h5-form-section"><label>议案信息</label><div className="h5-reference-files">{deliberationFiles.slice(0, 3).map((file) => <button key={file.id} type="button" onClick={() => setActiveFile(file)}><FileText size={17}/><span><b>{file.label}</b><small>{file.name}</small></span><ChevronRight size={15}/></button>)}</div></section>
        <section className="h5-form-section h5-vote-action h5-personal-vote"><label>我的投票</label><div><header><span>当前投票人：李晨</span><small>仅展示和提交本人的投票信息</small></header><section role="group" aria-label="我的投票结果"><button type="button" className={voteResult === "pass" ? "selected pass" : "pass"} onClick={() => setVoteResult("pass")}><Check size={17}/>通过</button><button type="button" className={voteResult === "reject" ? "selected reject" : "reject"} onClick={() => setVoteResult("reject")}><X size={17}/>不通过</button><button type="button" className={voteResult === "abstain" ? "selected abstain" : "abstain"} onClick={() => setVoteResult("abstain")}><Vote size={17}/>弃权</button></section><div className="h5-vote-inputs"><label>执行意见<textarea placeholder="请填写对议案执行的意见或建议" /></label><label>额外指令<textarea placeholder="如有需同步的后续事项，请填写额外指令" /></label></div></div></section>
        <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">确认审议材料</button></footer>
      </form>
    </aside>
    {activeFile && <ProposalReferenceViewer file={activeFile} onClose={() => setActiveFile(null)} />}
  </div>;
}

function H5MeetingEndConfirm({ onEnded, onNotEnded }: { onEnded: () => void; onNotEnded: () => void }) {
  return <div className="h5-form-overlay h5-meeting-confirm-overlay"><section className="h5-meeting-confirm" role="dialog" aria-modal="true" aria-label="确认审议状态"><header><ClipboardList size={22}/><div><b>审议是否已结束？</b><span>请确认线上或线下审议已完成后，再收集结果。</span></div></header><footer><button type="button" className="plain" onClick={onNotEnded}>未结束</button><button type="button" className="pam-primary" onClick={onEnded}>已结束</button></footer></section></div>;
}

function MeetingResultDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [agree, setAgree] = useState(6);
  const [oppose, setOppose] = useState(1);
  const [abstain, setAbstain] = useState(1);
  const voters = ["王海峰", "李晨", "陈颖", "周敏", "刘伟", "张琳", "孙明", "赵静"];
  const total = agree + oppose + abstain;
  const result = agree > oppose ? "通过" : "不通过";
  const changeCount = (setter: React.Dispatch<React.SetStateAction<number>>) => (event: React.ChangeEvent<HTMLInputElement>) => setter(Math.max(0, Number(event.target.value) || 0));
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer h5-deliberation-drawer" role="dialog" aria-modal="true" aria-label="线上/线下审议结果收集" onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 审议执行</small><h2>线上/线下审议结果收集</h2><p>请汇总投票结果，并记录各投票人的执行意见与额外指令。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-deliberation-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section h5-deliberation-summary"><label>议案基本信息</label><div><span><i>议案编号</i><b>ZWB-014-20260819-0003</b></span><span className="wide"><i>议案名称</i><b>关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案</b></span><span><i>申请部门</i><b>BWA平台与应用研发部</b></span><span><i>议案负责人</i><b>宋照晨</b></span><span><i>议案类型</i><b>人力资源类（高管类）</b></span></div></section>
        <section className="h5-form-section h5-meeting-results"><label>审议信息收集</label><div className="h5-result-counts"><label>通过票<input type="number" min="0" value={agree} onChange={changeCount(setAgree)} /></label><label>反对票<input type="number" min="0" value={oppose} onChange={changeCount(setOppose)} /></label><label>弃权票<input type="number" min="0" value={abstain} onChange={changeCount(setAbstain)} /></label><section className={result === "通过" ? "pass" : "reject"}><span>自动计算结果</span><b>{result}</b><small>共 {total} 票</small></section></div><section className="h5-member-result-list"><header><b>各投票人执行意见</b><span>请逐项补充</span></header>{voters.map((name) => <label key={name}><b>{name}</b><textarea placeholder={`请填写${name}的执行意见`} /></label>)}</section><section className="h5-member-result-list"><header><b>各投票人额外指令</b><span>请逐项补充</span></header>{voters.map((name) => <label key={name}><b>{name}</b><textarea placeholder={`请填写${name}的额外指令`} /></label>)}</section></section>
        <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">提交审议结果</button></footer>
      </form>
    </aside>
  </div>;
}

function H5AnnouncementConfirmDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer h5-deliberation-drawer" role="dialog" aria-modal="true" aria-label="审议公告确认" onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 审议执行</small><h2>审议公告确认</h2><p>请核对审议结果通知，并在发送前完成必要调整。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-deliberation-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section h5-deliberation-summary"><label>议案基本信息</label><div><span><i>议案编号</i><b>ZWB-014-20260819-0003</b></span><span className="wide"><i>议案名称</i><b>关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案</b></span><span><i>申请部门</i><b>BWA平台与应用研发部</b></span><span><i>议案负责人</i><b>宋照晨</b></span><span><i>议案类型</i><b>人力资源类（高管类）</b></span></div></section>
        <section className="h5-form-section"><label>审议公告内容</label><article className="h5-announcement-editor" contentEditable suppressContentEditableWarning><h3>【战执委议案审议结果通知】</h3><p><b>审议议案【共 8 票】</b></p><p><b>议案内容：</b>会议审议了《关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案》。</p><p><b>审议时间：</b>2026 年 08 月 28 日</p><p><b>审议结果：</b>同意 6 票、反对 1 票、弃权 1 票</p><p><b>审议结论：</b>通过</p><p className="h5-announcement-note">注：全体委员全票同意为“一致通过”；经全体委员三分之二及以上表决同意为“通过”；未达上述标准为“不通过”。</p><p><b>审议意见：</b>同意本次高级管理人员任职调整方案；请按议案明确的生效时间完成任职手续办理、岗位交接与组织通知，确保经营管理工作平稳衔接。</p><p className="h5-announcement-sign">ESG战略执行委员会办公室<br/>2026 年 08 月 28 日</p></article><small className="h5-announcement-tip">公告正文可直接修改。</small></section>
        <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">确认公告</button></footer>
      </form>
    </aside>
  </div>;
}

function ResolutionDocumentDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer h5-deliberation-drawer" role="dialog" aria-modal="true" aria-label="决议文件确认" onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 审议执行</small><h2>决议文件确认</h2><p>请核对已生成的 Word 决议文件并确认归档内容。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-deliberation-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section h5-deliberation-summary"><label>议案基本信息</label><div><span><i>议案编号</i><b>ZWB-014-20260819-0003</b></span><span className="wide"><i>议案名称</i><b>关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案</b></span><span><i>申请部门</i><b>BWA平台与应用研发部</b></span><span><i>议案负责人</i><b>宋照晨</b></span><span><i>议案类型</i><b>人力资源类（高管类）</b></span></div></section>
        <section className="h5-form-section h5-resolution-file"><label>决议文件</label><button type="button" onClick={() => setViewerOpen(true)}><FileText size={25}/><span><b>2026年ESG战略执行委员会审议决议文件.docx</b><small>已汇编会议纪要、审议通知、投票情况及委员意见</small></span><i><span>查看文件</span><ChevronRight size={16}/></i></button></section>
        <section className="h5-form-section h5-resolution-approval"><label>审批设置</label><div><label className="h5-form-field"><span>是否需要向上审批 <b>*</b></span><div className="h5-input-shell"><select defaultValue="否"><option>是</option><option>否</option></select></div></label><label className="h5-form-field"><span>决议文件审批负责人 <b>*</b></span><div className="h5-input-shell"><select defaultValue="李晨"><option>李晨</option><option>陈颖</option><option>周敏</option><option>王海峰</option></select></div></label></div></section>
        <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">确认决议文件</button></footer>
      </form>
    </aside>
    {viewerOpen && <ResolutionDocumentViewer onClose={() => setViewerOpen(false)} />}
  </div>;
}

function ResolutionDocumentViewer({ onClose }: { onClose: () => void }) {
  const voterRecords = [["王海峰", "通过", "同意按计划完成任职手续与交接安排。", "无"], ["李晨", "通过", "请同步关注岗位职责衔接。", "于生效后 30 日内反馈交接情况。"], ["陈颖", "通过", "建议做好组织调整沟通。", "无"], ["周敏", "通过", "材料核验无异议。", "无"], ["刘伟", "通过", "同意议案内容。", "无"], ["张琳", "通过", "建议及时完成任职公告。", "无"], ["孙明", "反对", "建议补充岗位交接风险说明。", "补充说明后归档。"], ["赵静", "弃权", "无补充意见。", "无"]];
  return <aside className="h5-template-editor h5-resolution-viewer" role="dialog" aria-modal="true" aria-label="决议文件查看" onMouseDown={(event) => event.stopPropagation()}><header><div><small>Word 文档 · 文件预览</small><h2>2026年ESG战略执行委员会审议决议文件.docx</h2><p>会议纪要、审议通知与投票记录已汇编。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header><main className="h5-resolution-scroll"><article className="h5-resolution-page"><header><span>议案编号：ZWB-014-20260819-0003</span><span>ESG战略执行委员会2026年第10次会议</span></header><h1>2026 年 ESG 战略执行委员会审议会议纪要</h1><h2>——线上会议</h2><p><b>审议时间：</b>2026 年 08 月 28 日</p><p><b>审议人员：</b>王海峰、李晨、陈颖、周敏、刘伟、张琳、孙明、赵静</p><h3>审议内容</h3><p className="indent"><b>审议议案【共 8 票】</b></p><p className="indent"><b>议案内容：</b>会议审议了《关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案》。</p><p className="indent"><b>审议结果：</b>同意【6】票、反对【1】票、弃权【1】票</p><p className="indent"><b>审议结论：</b>通过</p><p className="indent"><b>审议意见：</b>同意本次高级管理人员任职调整方案；请按明确的生效时间完成任职手续办理、岗位交接与组织通知。</p><footer>ESG战略执行委员会办公室<br/>2026 年 08 月 28 日</footer></article><article className="h5-resolution-page"><header><span>议案编号：ZWB-014-20260819-0003</span><span>ESG战略执行委员会2026年第10次会议</span></header><h1>关于《山东邦维信息科技有限公司部分高级管理人员任职调整》的议案</h1><p>各位委员：</p><p className="indent">根据工作需要，依据 ESG 战略执行委员会职权及《公司章程》，现提请审议关于《山东邦维信息科技有限公司部分高级管理人员任职调整》的议案，详情如下：</p><h3>一、审议事项</h3><p className="indent">同意聘任张磊同志为公司副总经理；同步完成相关高级管理人员岗位调整及工作交接。</p><h3>二、审议依据</h3><p className="indent">《公司章程》、高级管理人员任免管理相关规定、干部履历与考察材料、战执委审核意见。</p><h3>三、审议安排</h3><p className="indent">本议案采用线上会议审议方式，请各位委员审议、表决。</p><footer>ESG战略执行委员会办公室<br/>2026 年 08 月 28 日</footer></article><article className="h5-resolution-page"><header><span>议案编号：ZWB-014-20260819-0003</span><span>ESG战略执行委员会2026年第10次会议</span></header><h1>投票情况及委员意见</h1><table><thead><tr><th>投票人</th><th>投票结果</th><th>执行意见</th><th>额外指令</th></tr></thead><tbody>{voterRecords.map(([name, vote, advice, instruction]) => <tr key={name}><td>{name}</td><td>{vote}</td><td>{advice}</td><td>{instruction}</td></tr>)}</tbody></table><section className="h5-resolution-summary"><b>表决汇总：</b>同意 6 票、反对 1 票、弃权 1 票，审议结论为“通过”。</section><footer>ESG战略执行委员会办公室<br/>2026 年 08 月 28 日</footer></article></main><footer><button type="button" className="pam-primary" onClick={onClose}>关闭查看</button></footer></aside>;
}

function InstructionConfirmDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const originalInstructions = [{ owner: "李晨", text: "于任职生效后 30 日内反馈岗位交接及履职衔接情况。" }, { owner: "孙明", text: "补充岗位交接风险说明后归档。" }, { owner: "张琳", text: "请及时完成任职公告发布，并同步相关组织与人员。" }, { owner: "陈颖", text: "关注组织调整实施效果，必要时形成复盘建议。" }];
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer h5-deliberation-drawer" role="dialog" aria-modal="true" aria-label="指令确认" onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 审议执行</small><h2>指令确认</h2><p>请核对委员原始指令，并确认汇总后的待办事项。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-deliberation-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section h5-deliberation-summary h5-readonly-summary"><label>议案基本信息</label><div><span><i>议案编号</i><b>ZWB-014-20260819-0003</b></span><span className="wide"><i>议案名称</i><b>关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案</b></span><span><i>申请部门</i><b>BWA平台与应用研发部</b></span><span><i>议案负责人</i><b>宋照晨</b></span><span><i>议案类型</i><b>人力资源类（高管类）</b></span></div></section>
        <section className="h5-form-section h5-original-instructions"><label>原指令</label><div>{originalInstructions.map((instruction, index) => <article key={instruction.owner}><header><span>投票人</span><b>{instruction.owner}</b><i>原指令 {index + 1}</i></header><p>{instruction.text}</p></article>)}</div></section>
        <section className="h5-form-section"><label>指令信息</label><article className="h5-instruction-editor h5-instruction-summary" contentEditable suppressContentEditableWarning><p>经审议，各委员围绕本次高级管理人员任职调整提出了任职手续办理、岗位交接、风险说明、公告发布和组织调整跟踪等执行要求。现汇总形成以下待办：请于 2026 年 09 月 01 日前完成张磊同志任职手续、任职公告发布及相关组织、人员同步；制定岗位交接清单，并于任职生效后 30 日内反馈岗位交接及履职衔接情况；补充岗位交接风险说明，完成材料复核后纳入议案归档资料；持续关注组织调整实施效果，必要时形成复盘建议并提交审议负责人。</p></article><small className="h5-instruction-tip">指令总结与待办可直接编辑。</small><div className="h5-instruction-assignees"><label className="h5-form-field"><span>指令执行负责人 <b>*</b></span><div className="h5-input-shell"><select defaultValue="宋照晨"><option>宋照晨</option><option>李晨</option><option>陈颖</option><option>周敏</option></select></div></label><label className="h5-form-field"><span>指令监督负责人 <b>*</b></span><div className="h5-input-shell"><select defaultValue="周敏"><option>周敏</option><option>李晨</option><option>陈颖</option><option>宋照晨</option></select></div></label></div></section>
        <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">确认指令信息</button></footer>
      </form>
    </aside>
  </div>;
}

function ResolutionApprovalDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [approvalResult, setApprovalResult] = useState<"pass" | "reject" | null>(null);
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer h5-deliberation-drawer" role="dialog" aria-modal="true" aria-label="决议文件审批" onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 决议审批</small><h2>决议文件审批</h2><p>请核对决议审批文件，并填写审批结论与审核意见。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-deliberation-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section h5-deliberation-summary h5-readonly-summary"><label>议案基本信息</label><div><span><i>议案编号</i><b>ZWB-014-20260819-0003</b></span><span className="wide"><i>议案名称</i><b>关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案</b></span><span><i>申请部门</i><b>BWA平台与应用研发部</b></span><span><i>议案负责人</i><b>宋照晨</b></span><span><i>议案类型</i><b>人力资源类（高管类）</b></span></div></section>
        <section className="h5-form-section h5-resolution-file"><label>决议审批文件</label><button type="button" onClick={() => setViewerOpen(true)}><FileText size={25}/><span><b>2026年ESG战略执行委员会审议决议文件.docx</b><small>包含会议纪要、审议通知、投票情况及委员意见</small></span><i><span>查看文件</span><ChevronRight size={16}/></i></button></section>
        <section className="h5-form-section h5-resolution-result"><label>决议是否通过 <b>*</b></label><div role="group" aria-label="决议是否通过"><button type="button" className={approvalResult === "pass" ? "pass selected" : "pass"} onClick={() => setApprovalResult("pass")}><Check size={17}/>通过</button><button type="button" className={approvalResult === "reject" ? "reject selected" : "reject"} onClick={() => setApprovalResult("reject")}><X size={17}/>不通过</button></div></section>
        <section className="h5-form-section h5-approval-opinion"><label>审核意见</label><textarea placeholder="请填写审核意见（选填）" /></section>
        <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">提交审批结果</button></footer>
      </form>
    </aside>
    {viewerOpen && <ResolutionDocumentViewer onClose={() => setViewerOpen(false)} />}
  </div>;
}

function ResolutionFilingDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer h5-deliberation-drawer" role="dialog" aria-modal="true" aria-label="决议横向审批" onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 决议流转</small><h2>决议横向审批</h2><p>请核对决议审批文件，并完成横向备案。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-deliberation-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section h5-deliberation-summary h5-readonly-summary"><label>议案基本信息</label><div><span><i>议案编号</i><b>ZWB-014-20260819-0003</b></span><span className="wide"><i>议案名称</i><b>关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案</b></span><span><i>申请部门</i><b>BWA平台与应用研发部</b></span><span><i>议案负责人</i><b>宋照晨</b></span><span><i>议案类型</i><b>人力资源类（高管类）</b></span></div></section>
        <section className="h5-form-section h5-resolution-file"><label>决议审批文件</label><button type="button" onClick={() => setViewerOpen(true)}><FileText size={25}/><span><b>2026年ESG战略执行委员会审议决议文件.docx</b><small>包含会议纪要、审议通知、投票情况及委员意见</small></span><i><span>查看文件</span><ChevronRight size={16}/></i></button></section>
        <section className="h5-form-section h5-horizontal-approval"><label>决议审批信息</label><div><span><i>决议审批人</i><b>李晨</b></span><span><i>决议审批意见</i><b>决议文件内容完整，审议程序及表决结果符合要求，同意完成备案。</b></span></div></section>
        <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">备案</button></footer>
      </form>
    </aside>
    {viewerOpen && <ResolutionDocumentViewer onClose={() => setViewerOpen(false)} />}
  </div>;
}

function ResolutionDownwardRouteDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer h5-deliberation-drawer" role="dialog" aria-modal="true" aria-label="决议文件向下路由" onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 决议流转</small><h2>决议文件向下路由</h2><p>请指定议案执行负责人，确认后将决议文件发送至执行环节。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-deliberation-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section h5-deliberation-summary h5-readonly-summary"><label>议案基本信息</label><div><span><i>议案编号</i><b>ZWB-014-20260819-0003</b></span><span className="wide"><i>议案名称</i><b>关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案</b></span><span><i>申请部门</i><b>BWA平台与应用研发部</b></span><span><i>议案负责人</i><b>宋照晨</b></span><span><i>议案类型</i><b>人力资源类（高管类）</b></span></div></section>
        <section className="h5-form-section h5-resolution-file"><label>决议审批文件</label><button type="button" onClick={() => setViewerOpen(true)}><FileText size={25}/><span><b>2026年ESG战略执行委员会审议决议文件.docx</b><small>包含会议纪要、审议通知、投票情况及委员意见</small></span><i><span>查看文件</span><ChevronRight size={16}/></i></button></section>
        <section className="h5-form-section h5-route-owner"><label>指定议案执行负责人 <b>*</b></label><div className="h5-input-shell"><select defaultValue="宋照晨"><option>宋照晨</option><option>李晨</option><option>陈颖</option><option>周敏</option></select></div></section>
        <footer><button type="submit" className="pam-primary">确定并执行</button></footer>
      </form>
    </aside>
    {viewerOpen && <ResolutionDocumentViewer onClose={() => setViewerOpen(false)} />}
  </div>;
}

function H5ExecutionCompleteConfirm({ kind, onCompleted, onNotCompleted }: { kind: "resolution" | "instruction"; onCompleted: () => void; onNotCompleted: () => void }) {
  const label = kind === "resolution" ? "决议执行" : "指令执行";
  return <div className="h5-form-overlay h5-meeting-confirm-overlay"><section className="h5-meeting-confirm" role="dialog" aria-modal="true" aria-label={`确认${label}状态`}><header><ClipboardList size={22}/><div><b>{label}是否已完成？</b><span>请确认相关执行工作已完成后，再填写执行情况。</span></div></header><footer><button type="button" className="plain" onClick={onNotCompleted}>未完成</button><button type="button" className="pam-primary" onClick={onCompleted}>已完成</button></footer></section></div>;
}

function ExecutionStatusDrawer({ kind, onClose, onSubmit }: { kind: "resolution" | "instruction"; onClose: () => void; onSubmit: () => void }) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const isResolution = kind === "resolution";
  const title = isResolution ? "决议执行情况" : "指令执行情况";
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer h5-deliberation-drawer" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 审议执行</small><h2>{title}</h2><p>{isResolution ? "请如实填写决议事项的执行进展，并上传证明材料。" : "请如实填写已确认指令的执行进展，并上传证明材料。"}</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-deliberation-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section h5-deliberation-summary h5-readonly-summary"><label>议案基本信息</label><div><span><i>议案编号</i><b>ZWB-014-20260819-0003</b></span><span className="wide"><i>议案名称</i><b>关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案</b></span><span><i>申请部门</i><b>BWA平台与应用研发部</b></span><span><i>议案负责人</i><b>宋照晨</b></span><span><i>议案类型</i><b>人力资源类（高管类）</b></span></div></section>
        {isResolution ? <section className="h5-form-section h5-resolution-file"><label>决议文件</label><button type="button" onClick={() => setViewerOpen(true)}><FileText size={25}/><span><b>2026年ESG战略执行委员会审议决议文件.docx</b><small>包含会议纪要、审议通知、投票情况及委员意见</small></span><i><span>查看文件</span><ChevronRight size={16}/></i></button></section> : <section className="h5-form-section h5-execution-instruction"><label>指令信息</label><p>请于 2026 年 09 月 01 日前完成张磊同志任职手续、任职公告发布及相关组织、人员同步；制定岗位交接清单，并于任职生效后 30 日内反馈岗位交接及履职衔接情况；补充岗位交接风险说明，完成材料复核后纳入议案归档资料。</p><div><span>指令执行负责人：宋照晨</span><span>指令监督负责人：周敏</span></div></section>}
        <section className="h5-form-section h5-execution-description"><label>执行情况 <b>*</b></label><textarea placeholder="请填写本次执行情况、已完成事项及当前结果" required /></section>
        <section className="h5-form-section h5-execution-proof"><label>上传证明材料 <b>*</b></label><label className="h5-upload h5-proof-upload"><input type="file" multiple required /><Paperclip size={18}/><div><strong>上传证明材料</strong><span>支持上传执行证明、通知截图及相关材料</span></div></label></section>
        <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">提交执行情况</button></footer>
      </form>
    </aside>
    {viewerOpen && <ResolutionDocumentViewer onClose={() => setViewerOpen(false)} />}
  </div>;
}

function ProposalExecutionConfirmDrawer({ mode, onClose, onSubmit }: { mode: "execution" | "archive"; onClose: () => void; onSubmit: () => void }) {
  const isArchive = mode === "archive";
  const title = isArchive ? "议案归档确认" : "议案执行确认";
  const files = isArchive ? [{ name: "议案申请表_ZWB-014-20260819-0003.pdf", meta: "议案申请表" }, { name: "人力资源类（高管类）议案模板.docx", meta: "议案申请模板" }, { name: "议案申请附件（3项）.zip", meta: "议案申请附件" }] : [];
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer h5-deliberation-drawer" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 审议执行</small><h2>{title}</h2><p>{isArchive ? "请核对议案申请、审议与执行材料是否齐备后确认归档。" : "请核对决议和指令的执行反馈及证明材料。"}</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-deliberation-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section h5-deliberation-summary h5-readonly-summary"><label>议案基本信息</label><div><span><i>议案编号</i><b>ZWB-014-20260819-0003</b></span><span className="wide"><i>议案名称</i><b>关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案</b></span><span><i>申请部门</i><b>BWA平台与应用研发部</b></span><span><i>议案负责人</i><b>宋照晨</b></span><span><i>议案类型</i><b>人力资源类（高管类）</b></span></div></section>
        <section className="h5-form-section h5-execution-confirm"><label>决议执行情况</label><p>已完成张磊同志副总经理任职手续办理、任职公告发布及相关组织、人员同步；相关任职信息已于 2026 年 09 月 01 日生效。</p><ExecutionProofFiles files={[{ name: "任职文件及公告截图.pdf", meta: "决议执行证明 · 1.2 MB" }, { name: "组织与人员同步记录.xlsx", meta: "决议执行证明 · 0.6 MB" }]} /></section>
        <section className="h5-form-section h5-execution-confirm instruction"><label>指令执行情况</label><p>已制定岗位交接清单并完成工作交接；补充岗位交接风险说明并纳入归档材料，组织调整实施情况已反馈至监督负责人。</p><ExecutionProofFiles files={[{ name: "岗位交接清单.docx", meta: "指令执行证明 · 0.4 MB" }, { name: "岗位交接风险说明.pdf", meta: "指令执行证明 · 0.8 MB" }]} /></section>
        {isArchive && <section className="h5-form-section h5-archive-files"><label>议案申请材料</label><ExecutionProofFiles files={files} /></section>}
        <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">{isArchive ? "确认归档" : "确认执行情况"}</button></footer>
      </form>
    </aside>
  </div>;
}

function ExecutionProofFiles({ files }: { files: { name: string; meta: string }[] }) {
  return <div className="h5-execution-proof-files">{files.map((file) => <div key={file.name}><FileText size={16}/><span><b>{file.name}</b><small>{file.meta}</small></span><ChevronRight size={15}/></div>)}</div>;
}

function ProposalReviewDrawer({ mode, onClose, onSubmit, onReject }: { mode: "revision" | "basic" | "functional-revision" | "functional" | "executive-revision" | "executive"; onClose: () => void; onSubmit: () => void; onReject?: () => void }) {
  const isBasic = mode === "basic";
  const isRevision = mode === "revision" || mode === "functional-revision" || mode === "executive-revision";
  const title = mode === "basic" ? "基础审核核验" : mode === "revision" ? "基础审核驳回修改" : mode === "functional" ? "职能审核核验" : mode === "functional-revision" ? "职能审核驳回修改" : mode === "executive" ? "战执委审核核验" : "战执委驳回修改";
  const [templateOpen, setTemplateOpen] = useState(false);
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer" role="dialog" aria-modal="true" aria-label={title} onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · {title}</small><h2>{title}</h2><p>{isRevision ? "根据当前审核建议补充或修改议案材料。" : "核验议案材料，并形成当前审核结论。"}</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form h5-review-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        {mode === "revision" && <section className="h5-review-advice return"><header><CircleAlert size={18}/><div><b>基础审核建议</b><span>基础审核负责人：周敏。如有问题请联系周敏。</span></div></header><p>请补充任职调整依据、考察材料及生效时间说明，并核对公司名称、人员姓名及拟任职务与附件保持一致。</p></section>}
        {mode === "functional-revision" && <section className="h5-review-advice functional-return"><header><CircleAlert size={18}/><div><b>职能审核建议</b><span>职能审核负责人：陈颖。如有问题请联系陈颖。</span></div></header><p>请补充岗位职责边界、任职资格匹配说明和组织调整影响分析，并同步更新申请模板与相关附件。</p></section>}
        {mode === "executive-revision" && <section className="h5-review-advice executive-return"><header><CircleAlert size={18}/><div><b>战执委审核建议</b><span>战执委审核负责人：李晨。如有问题请联系李晨。</span></div></header><p>请补充任职调整的决策依据、授权边界及组织影响说明，并确保申请表、模板与附件中的任职信息保持一致。</p></section>}
        {isBasic && <section className="h5-review-advice basic h5-review-editable"><header><ShieldCheck size={18}/><div><b>基础审核建议</b><span>基础审核负责人：周敏</span></div><i className="h5-edit-hint" aria-hidden="true"><PenLine size={13}/></i></header><p className="h5-editable-content" contentEditable suppressContentEditableWarning>经核验，申请信息、任职调整依据、干部履历及考察材料齐备。建议确认张磊同志拟任副总经理的任职资格及 2026 年 09 月 01 日生效安排后，进入下一审核环节。</p></section>}
        {isBasic && <section className="h5-review-change featured"><b>议案驳回修改内容</b><div className="h5-review-change-list"><section><span>申请表修改</span><p>议案名称由“高级管理人员任职调整议案”调整为“关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案”；补充议案负责人“宋照晨”及执委会所属权限“战执委审议”。</p></section><section><span>申请模板补充与修订</span><p>补充张磊同志拟任副总经理、原任总经理及 2026 年 09 月 01 日生效安排；同步完善任职调整依据和考察情况说明。</p></section><section><span>附件材料补充</span><p>新增《任职调整依据说明.pdf》；更新《任职调整说明_v2.docx》；补充《干部履历及考察材料.pdf》。</p></section></div></section>}
        {(mode === "functional" || mode === "executive") && <section className="h5-review-advice base-source"><header><ShieldCheck size={18}/><div><b>基础审核建议</b><span>基础审核负责人：周敏</span></div></header><p>基础审核已核验任职调整依据、干部履历及考察材料，建议在职能审核中进一步确认岗位职责边界与组织影响。</p></section>}
        {mode === "functional" && <section className="h5-review-advice functional h5-review-editable"><header><ShieldCheck size={18}/><div><b>职能审核建议</b><span>职能审核负责人：陈颖</span></div><i className="h5-edit-hint" aria-hidden="true"><PenLine size={13}/></i></header><p className="h5-editable-content" contentEditable suppressContentEditableWarning>请核验岗位职责边界、任职资格与组织调整影响是否符合人力资源管理要求；确认无误后提交职能审核结论。</p></section>}
        {mode === "functional" && <section className="h5-review-change featured functional"><b>职能审核驳回修改内容</b><div className="h5-review-change-list"><section><span>申请表修改</span><p>补充议案负责人职责说明，并明确本次调整涉及的岗位范围与生效时间。</p></section><section><span>申请模板补充</span><p>完善张磊同志的任职资格、岗位职责边界及与现任岗位的交接安排。</p></section><section><span>附件材料补充</span><p>新增《岗位职责对照表.xlsx》与《组织调整影响分析.docx》。</p></section></div></section>}
        {mode === "executive" && <section className="h5-review-advice functional-source"><header><ShieldCheck size={18}/><div><b>职能审核建议</b><span>职能审核负责人：陈颖</span></div></header><p>职能审核已确认岗位职责边界与任职资格匹配关系，建议战执委进一步核验决策依据、授权边界及组织调整影响。</p></section>}
        {mode === "executive" && <section className="h5-review-advice executive h5-review-editable"><header><ShieldCheck size={18}/><div><b>战执委审核建议</b><span>战执委审核负责人：李晨</span></div><i className="h5-edit-hint" aria-hidden="true"><PenLine size={13}/></i></header><p className="h5-editable-content" contentEditable suppressContentEditableWarning>请核验本次任职调整的决策依据、授权边界与组织影响；确认无误后提交战执委审核结论。</p></section>}
        {mode === "executive" && <section className="h5-review-change featured executive"><b>战执委审核驳回修改内容</b><div className="h5-review-change-list"><section><span>申请表修改</span><p>补充本次高级管理人员任职调整的决策事项、授权依据及生效安排。</p></section><section><span>申请模板补充</span><p>完善任职调整背景、管理职责交接及对公司经营管理的影响说明。</p></section><section><span>附件材料补充</span><p>新增《授权依据说明.pdf》与《组织影响评估报告.docx》。</p></section></div></section>}
        <section className="h5-form-section h5-form-number"><label>流程编号 <b>*</b></label><div className="h5-input-shell h5-readonly"><input defaultValue="ZWB-014-20260819-0003" readOnly /></div></section>
        <section className="h5-form-grid"><ReviewField label="申请人" value="宋照晨" icon={<UserRound size={15}/>} /><ReviewField label="申请日期" value="2026-08-19" icon={<CalendarDays size={15}/>} /><ReviewField label="议案所属公司" value="山东邦维信息科技有限公司" icon={<Building2 size={15}/>} /><ReviewField label="主管部门" value="BWA平台与应用研发部" icon={<Building2 size={15}/>} /><ReviewField label="议案名称" value="关于山东邦维信息科技有限公司部分高级管理人员任职调整的议案" /><ReviewField label="议案负责人" value="宋照晨" icon={<UserRound size={15}/>} /><ReviewField label="所属类型" value="人力资源类(高管类)" select /><ReviewField label="议案优先级" value="普通" select /><ReviewField label="执委会所属权限" value="战执委审议" select /></section>
        <section className="h5-form-section"><label>议案主要内容 <b>*</b></label><textarea defaultValue="根据公司经营管理需要，拟对部分高级管理人员任职进行调整，提请战略执行委员会审议。" /></section>
        <section className="h5-form-section"><label>所需战执委表决/备案要素 <b>*</b></label><textarea defaultValue="审议高级管理人员任职调整方案及任职生效时间。" /></section>
        <section className="h5-form-section h5-template-file"><label>议案申请模板</label><div className="h5-template-entry" role="button" tabIndex={0} onClick={() => setTemplateOpen(true)}><FileText size={21}/><section><b>人力资源类（高管类）议案模板</b><small>已补齐本轮修改所需的示例内容</small></section><button type="button" className="h5-template-fill" onClick={(event) => { event.stopPropagation(); setTemplateOpen(true); }}><PenLine size={14}/>查看模板</button></div></section>
        <section className="h5-form-section"><label>议案申请附件</label><div className="h5-upload h5-review-upload"><Paperclip size={18}/><div><strong>议案申请材料</strong><span>已上传 3 个附件，可继续补充或替换材料</span></div><b>3 个附件</b></div><div className="h5-attachment-list"><div><FileText size={15}/><span>任职调整说明_v2.docx</span><small>1.8 MB · 本轮已更新</small></div><div><FileText size={15}/><span>干部履历及考察材料.pdf</span><small>4.6 MB · 已核验</small></div><div><FileText size={15}/><span>任职调整依据说明.pdf</span><small>0.9 MB · 本轮新增</small></div></div></section>
        {!isRevision ? <footer><button type="button" className="h5-review-reject" onClick={onReject}>驳回修改</button><button type="submit" className="pam-primary">审核通过</button></footer> : <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">提交修改</button></footer>}
      </form>
    </aside>
    {templateOpen && <ProposalTemplateEditor prefilled={isRevision} onClose={() => setTemplateOpen(false)} />}
  </div>;
}

function ReviewField({ label, value, icon, select = false }: { label: string; value: string; icon?: React.ReactNode; select?: boolean }) {
  return <label className="h5-form-field"><span>{label} <b>*</b></span><div className="h5-input-shell">{select ? <select defaultValue={value}><option>{value}</option></select> : <input defaultValue={value} />}{select ? <ChevronRight className="h5-select-icon" size={16}/> : icon}</div></label>;
}

function ProposalApplicationDrawer({ onClose, onSubmit }: { onClose: () => void; onSubmit: () => void }) {
  const [templateOpen, setTemplateOpen] = useState(false);
  const [proposalType, setProposalType] = useState("人力资源类(高管类)");
  return <div className="h5-form-overlay" onMouseDown={onClose}>
    <aside className="h5-form-drawer" role="dialog" aria-modal="true" aria-label="议案申请" onMouseDown={(event) => event.stopPropagation()}>
      <header className="h5-form-head"><div><small>钉钉 H5 · 议案申请</small><h2>议案申请</h2><p>请补全议案信息并上传相关材料。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
      <form className="h5-proposal-form" onSubmit={(event) => { event.preventDefault(); onSubmit(); }}>
        <section className="h5-form-section h5-form-number"><label>流程编号 <b>*</b></label><div className="h5-input-shell h5-readonly"><input defaultValue="ZWB-014-20260819-0003" readOnly /></div></section>
        <section className="h5-form-grid">
          <FormField label="申请人" required icon={<UserRound size={15}/>} value="宋照晨" />
          <FormField label="申请日期" required icon={<CalendarDays size={15}/>} value="2026-08-19" />
          <FormField label="议案所属公司" required icon={<Building2 size={15}/>} value="山东邦维信息科技有限公司" />
          <FormField label="主管部门" required icon={<Building2 size={15}/>} value="BWA平台与应用研发部" />
          <FormField label="议案名称" required />
          <FormField label="议案负责人" required icon={<UserRound size={15}/>} />
          <label className="h5-form-field"><span>所属类型 <b>*</b></span><div className="h5-input-shell"><select value={proposalType} onChange={(event) => setProposalType(event.target.value)}>{["人力资源类(M类)", "人力资源类(高管类)", "人力资源类(组织调整类)", "投资类", "制度类资产类", "其他类型"].map((item) => <option key={item}>{item}</option>)}</select></div></label>
          <label className="h5-form-field"><span>议案优先级 <b>*</b></span><div className="h5-input-shell"><select defaultValue="普通"><option>紧急</option><option>高</option><option>普通</option></select></div></label>
          <FormField label="执委会所属权限" required select />
        </section>
        <section className="h5-form-section"><label>议案主要内容 <b>*</b></label><textarea placeholder="请简要说明议案背景、目标及主要内容" /></section>
        <section className="h5-form-section"><label>所需战执委表决/备案要素 <b>*</b></label><textarea placeholder="请填写需表决或备案的关键事项" /></section>
        <section className="h5-form-section h5-template-file"><label>附件模板</label><div className={proposalType === "人力资源类(高管类)" ? "h5-template-entry" : "h5-template-entry unavailable"} role="button" tabIndex={0} onClick={() => proposalType === "人力资源类(高管类)" && setTemplateOpen(true)} onKeyDown={(event) => { if (event.key === "Enter" && proposalType === "人力资源类(高管类)") setTemplateOpen(true); }}><FileText size={21}/><section><b>{proposalType === "人力资源类(高管类)" ? "人力资源类（高管类）议案模板" : "该类型的议案模板待配置"}</b><small>{proposalType === "人力资源类(高管类)" ? "已按所属类型自动匹配，正文可直接修改" : "当前仅展示人力资源类（高管类）模板"}</small></section><button type="button" className="h5-template-fill" disabled={proposalType !== "人力资源类(高管类)"} onClick={(event) => { event.stopPropagation(); setTemplateOpen(true); }}><PenLine size={14}/>填写模板</button></div></section>
        <section className="h5-form-section"><label>议案材料 <b>*</b></label><div className="h5-upload"><Paperclip size={18}/><div><strong>上传附件</strong><span>支持上传议案正文、附件及相关证明材料</span></div></div></section>
        <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="submit" className="pam-primary">提交</button></footer>
      </form>
    </aside>
    {templateOpen && <ProposalTemplateEditor onClose={() => setTemplateOpen(false)} />}
  </div>;
}

function ProposalTemplateEditor({ onClose, prefilled = false }: { onClose: () => void; prefilled?: boolean }) {
  return <aside className="h5-template-editor" role="dialog" aria-modal="true" aria-label="议案模板填写" onMouseDown={(event) => event.stopPropagation()}>
    <header><div><small>附件模板 · 在线填写</small><h2>人力资源类（高管类）议案模板</h2><p>正文与重点内容均可直接修改。</p></div><button type="button" onClick={onClose} aria-label="关闭"><X size={19}/></button></header>
    <main className="h5-template-paper" contentEditable suppressContentEditableWarning>
      <h3>关于《<TemplateInput value="XXX 公司" label="公司名称" prefilled={prefilled} />部分高级管理人员任职调整》的议案</h3>
      <p>各位委员：</p>
      <p className="h5-indent">根据工作需要，依据 ESG 战略执行委员会职权第 9 条“向董事局提出产业公司董事长 /（执行）董事、总经理的任免方案并报董事局审批”，现提请审议关于《<TemplateInput value="XX 公司" label="公司名称" prefilled={prefilled} />部分高级管理人员任职调整》的议案，详情如下：</p>
      <h4>（一）<TemplateInput value="山东邦维信息科技有限公司" label="公司名称" prefilled={prefilled} /></h4>
      <ol><li>聘任 <TemplateInput value="***" label="人员姓名" prefilled={prefilled} /> 同志为 <TemplateInput value="***" label="拟任职务" prefilled={prefilled} />；</li><li>解聘 <TemplateInput value="***" label="人员姓名" prefilled={prefilled} /> 同志的 <TemplateInput value="***" label="原任职务" prefilled={prefilled} /> 职务（或“同意 <TemplateInput value="***" label="人员姓名" prefilled={prefilled} /> 同志不再担任 <TemplateInput value="***" label="原任职务" prefilled={prefilled} /> 职务”）。</li></ol>
      <h4>（二）<TemplateInput value="*** 公司" label="公司名称" prefilled={prefilled} />（集团直接或间接控制的非全资子公司）</h4>
      <ol><li>推荐选举 <TemplateInput value="***" label="人员姓名" prefilled={prefilled} /> 同志为公司董事 / 执行董事（法定代表人），<TemplateInput value="***" label="人员姓名" prefilled={prefilled} /> 同志不再担任董事 / 执行董事（法定代表人）职务；</li><li>推荐聘任 <TemplateInput value="***" label="人员姓名" prefilled={prefilled} /> 同志为公司总经理，<TemplateInput value="***" label="人员姓名" prefilled={prefilled} /> 同志不再担任公司总经理职务。</li></ol>
      <h4>（三）<TemplateInput value="*** 公司" label="公司名称" prefilled={prefilled} />（集团直接或间接全资子公司）</h4>
      <ol><li>委派 <TemplateInput value="***" label="人员姓名" prefilled={prefilled} /> 同志为公司董事 / 执行董事（法定代表人），<TemplateInput value="***" label="人员姓名" prefilled={prefilled} /> 同志不再担任董事 / 执行董事（法定代表人）职务；</li><li>推荐聘任 <TemplateInput value="***" label="人员姓名" prefilled={prefilled} /> 同志为公司总经理，<TemplateInput value="***" label="人员姓名" prefilled={prefilled} /> 同志不再担任公司总经理职务。</li></ol>
      <section className="h5-template-note"><b>需注意正确用词：</b><span>公司的董事、监事一般经“选举”或“委派”产生；公司的经营层一般经“聘任”产生。以上人员调整时间为 <TemplateInput value="20** 年 ** 月 ** 日" label="生效日期" prefilled={prefilled} />。</span></section>
      <p className="h5-template-sign">ESG 战略执行委员会办公室<br/>2026 年 X 月 X 日</p>
    </main>
    <footer><button type="button" className="plain" onClick={onClose}>取消</button><button type="button" className="pam-primary" onClick={onClose}>保存填写</button></footer>
  </aside>;
}

function TemplateInput({ value, label, prefilled = false }: { value: string; label: string; prefilled?: boolean }) {
  const filled = prefilled ? ({ "公司名称": "山东邦维信息科技有限公司", "人员姓名": "张磊", "拟任职务": "副总经理", "原任职务": "总经理", "生效日期": "2026 年 09 月 01 日" }[label] || value) : value;
  return <span className="h5-template-placeholder" title={`待填写：${label}`}>{filled}</span>;
}

function FormField({ label, required = false, icon, value = "", select = false, placeholder }: { label: string; required?: boolean; icon?: React.ReactNode; value?: string; select?: boolean; placeholder?: string }) {
  return <label className="h5-form-field"><span>{label} {required && <b>*</b>}</span><div className="h5-input-shell"><input defaultValue={value} placeholder={placeholder || (select ? "请选择" : "请输入")} readOnly={Boolean(value)} />{select ? <ChevronRight className="h5-select-icon" size={16}/> : icon}</div></label>;
}
function organizeQueueStatus(p: Proposal) {
  return p.organizeStatus || "整理后待确认";
}
function SheetSkillOverview({ title, skills }: { title: string; skills: { name: string; desc: string }[] }) {
  const [current, setCurrent] = useState<{ name: string; desc: string } | null>(null);
  const visibleSkills = title === "议案整理与审核" ? [{ name: "议案智能整理 Skill", desc: "仅在“整理后待确认”的审核页自动调用：从原始申请与附件匹配字段、识别缺失项，并生成可编辑的整理结果与预审建议。" }, { name: "战执委审核 Skill", desc: "仅在“预审通过 → 审核”时自动调用：基于整理结果、附件和预审建议输出审核分析、风险提示与建议结论。" }] : skills;
  return <><section className="sheet-skill-overview"><div><span>关联 AI 技能</span><b>{title}</b><small>点击查看技能作用与处理口径</small></div><section>{visibleSkills.map((skill) => <button key={skill.name} onClick={() => setCurrent(skill)}><Sparkles size={14}/>{skill.name}<ChevronRight size={14}/></button>)}</section></section>{current && <div className="pam-overlay"><section className="pam-modal sheet-skill-preview"><header><div><small>当前 Sheet 关联技能</small><h2>{current.name}</h2><p>只读查看；具体配置可在“技能定义”中维护。</p></div><button onClick={() => setCurrent(null)}><X /></button></header><section><Sparkles size={18}/><div><b>技能说明</b><p>{current.desc}</p></div></section><footer><button className="pam-primary" onClick={() => setCurrent(null)}>我知道了</button></footer></section></div>}</>;
}
function OrganizeSubmit({ items, onDetail, onOpen, onAudit, notice }: { items: Proposal[]; onDetail: (p: Proposal) => void; onOpen: (kind: string, p: Proposal) => void; onAudit: (p: Proposal) => void; notice: (s: string) => void }) {
  const queue = items.filter((p) => Boolean(p.organizeStatus));
  const [statusFilter, setStatusFilter] = useState<OrganizeStatus | "">("");
  const statuses: OrganizeStatus[] = ["整理后待确认", "驳回修改中", "修改后待审核", "预审中", "预审通过", "审核通过"];
  const filteredQueue = statusFilter ? queue.filter((p) => organizeQueueStatus(p) === statusFilter) : queue;
  const action = (p: Proposal) => {
    const state = organizeQueueStatus(p);
    if (state === "驳回修改中") return <button className="link" onClick={() => onAudit(p)}>查看</button>;
    if (state === "整理后待确认") return <button className="pam-action" onClick={() => onOpen("organize-confirm", p)}>审核</button>;
    if (["修改后待审核", "预审通过"].includes(state)) return <button className="pam-action" onClick={() => onAudit(p)}>审核</button>;
    if (state === "审核通过") return <button className="link" onClick={() => onAudit(p)}>查看</button>;
    return null;
  };
  return <main className="pam-content"><PageTitle eyebrow="战略执行委员会 · 整理工作台" title="议案整理与审核" desc="按整理确认、预审及审核节点集中处理议案；状态与操作权限实时联动。"/><SheetSkillOverview title="议案整理与审核" skills={[{ name: "议案整理与预审 Skill", desc: "从原始申请与附件中提取结构化字段，生成整理结果、材料完整性提示与预审建议。" }, { name: "职能预审 Skill", desc: "按职能审核口径识别议案依据、风险与待补充项，辅助形成预审意见。" }, { name: "议案审核与合规核验 Skill", desc: "基于战执委审核口径核验决策事项、合规边界与关键风险，并辅助输出审核结论。" }]} /><section className="pam-card organize-queue-card"><header><div><h2>议案审核清单</h2><p>选择状态快速筛选；进入审核后可按当前节点完成驳回修改、提交预审或审核通过。</p></div><span className="count">{filteredQueue.length}{statusFilter ? ` / ${queue.length}` : ""} 项</span></header><div className="organize-status-filter" aria-label="按状态筛选议案"><span>状态筛选</span><div>{statuses.map((status) => <button key={status} className={statusFilter === status ? "active" : ""} onClick={() => setStatusFilter((current) => current === status ? "" : status)}><i>{queue.filter((p) => organizeQueueStatus(p) === status).length}</i>{status}</button>)}{statusFilter && <button className="clear-filter" onClick={() => setStatusFilter("")}>清除筛选</button>}</div></div><AdminProposalTable items={filteredQueue} onDetail={onDetail} statusOf={organizeQueueStatus} showDetail={(p) => organizeQueueStatus(p) === "预审中"} action={action} empty="当前状态暂无议案" /></section></main>;
}
function taskFlowStatus(p: Proposal) {
  if (p.taskStatus) return p.taskStatus;
  if (p.id === "PA-2026-0068") return "任务待拆解";
  if (p.id === "PA-2026-0056") return "任务待分发";
  if (p.id === "PA-2026-0060") return "任务审批中";
  return "任务已下发";
}
function Modal({ className, onClose, children }: { className?: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="pam-overlay" role="dialog" aria-modal="true" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className={`pam-modal ${className || ""}`}>{children}</section></div>;
}
function taskTypeOf(p: Proposal) {
  if ((p.templateName || "").includes("人事")) return "人事任免类";
  if ((p.templateName || "").includes("项目")) return "项目投资类";
  return "经营决策类";
}
function defaultTaskNodes(p: Proposal, templates: TaskBreakdownTemplate[]) {
  return p.taskNodes || templates.find((item) => item.types.includes(taskTypeOf(p)))?.nodes || templates[0].nodes;
}
function TaskBreakdownPage({ items, onDetail, onFlow, onProgress }: { items: Proposal[]; onDetail: (p: Proposal) => void; onFlow: (kind: "breakdown" | "dispatch", p: Proposal) => void; onProgress: (p: Proposal) => void }) {
  const list = items.filter((p) => ["PA-2026-0068", "PA-2026-0056", "PA-2026-0060", "PA-2026-0072"].includes(p.id));
  const action = (p: Proposal) => {
    const status = taskFlowStatus(p);
    if (status === "任务待拆解") return <button className="pam-action" onClick={() => onFlow("breakdown", p)}>智能拆解</button>;
    if (status === "任务待分发") return <button className="pam-action" onClick={() => onFlow("dispatch", p)}>智能分发</button>;
    return null;
  };
  return <main className="pam-content"><PageTitle eyebrow="战略执行委员会 · 任务协同" title="任务拆解与分配" desc="承接已审核通过的议案，将决议转化为可执行的任务节点，并完成备案、审批与任务下发。" /><section className="pam-card task-flow-card"><header><div><h2>已审核通过议案</h2><p>按当前任务流转状态展示；任务审批中仅可查看审批进度，任务已下发为最终状态。</p></div><span className="count">{list.length} 项</span></header><AdminProposalTable items={list} statusOf={taskFlowStatus} onDetail={(p) => taskFlowStatus(p) === "任务审批中" ? onProgress(p) : onDetail(p)} action={action} empty="暂无已审核通过的议案" /></section></main>;
}
function TaskBreakdownModal({ p, templates, onClose, onConfirm }: { p: Proposal; templates: TaskBreakdownTemplate[]; onClose: () => void; onConfirm: (nodes: TaskNode[]) => void }) {
  const [type, setType] = useState(taskTypeOf(p));
  const initial = templates.find((item) => item.types.includes(type)) || templates[0];
  const [templateId, setTemplateId] = useState(initial.id);
  const [nodes, setNodes] = useState<TaskNode[]>(defaultTaskNodes(p, templates));
  const applyTemplate = (id: string) => {
    const template = templates.find((item) => item.id === id)!;
    setTemplateId(id);
    setNodes(template.nodes.map((node) => ({ ...node })));
  };
  const patch = (index: number, values: Partial<TaskNode>) => setNodes((list) => list.map((node, i) => i === index ? { ...node, ...values } : node));
  return <Modal className="task-modal" onClose={onClose}><header><div><small>{p.id} · 任务智能拆解</small><h2>任务拆解与分配</h2><p>{p.title}</p></div><button className="icon-button" onClick={onClose}><X /></button></header><div className="task-modal-scroll"><section className="task-form-section"><header><div><h3>拆解规则</h3><p>可调整议案类型与任务拆解模板；选择模板后会自动带入节点信息，仍可人工编辑。</p></div></header><div className="task-rule-grid"><label>议案类型<select value={type} onChange={(e) => setType(e.target.value)}><option>项目投资类</option><option>经营决策类</option><option>人事任免类</option></select></label><label>任务拆解模板<select value={templateId} onChange={(e) => applyTemplate(e.target.value)}>{templates.map((item) => <option value={item.id} key={item.id}>{item.name}（{item.version}）</option>)}</select></label></div></section><section className="task-form-section"><header><div><h3>任务节点</h3><p>节点可多条维护；完成时证明材料可根据任务实际调整为必要或非必要。</p></div><button className="plain task-add-node-button" onClick={() => setNodes((list) => [...list, { name: "新任务节点", department: "待指定", owner: "待指定", proofRequired: true, deadline: "2026-10-31" }])}><Plus size={14} />添加节点</button></header><div className="task-form-table"><div className="task-form-row task-form-label"><span>项目节点</span><span>负责部门</span><span>负责人</span><span>证明材料</span><span>时间节点</span><span /></div>{nodes.map((node, index) => <div className="task-form-row" key={`${node.name}-${index}`}><input value={node.name} onChange={(e) => patch(index, { name: e.target.value })} /><input value={node.department} onChange={(e) => patch(index, { department: e.target.value })} /><input value={node.owner} onChange={(e) => patch(index, { owner: e.target.value })} /><select value={node.proofRequired ? "必要" : "非必要"} onChange={(e) => patch(index, { proofRequired: e.target.value === "必要" })}><option>必要</option><option>非必要</option></select><input type="date" value={node.deadline} onChange={(e) => patch(index, { deadline: e.target.value })} /><button className="remove-field" onClick={() => setNodes((list) => list.filter((_, i) => i !== index))}>删除</button></div>)}</div></section><section className="task-archive"><FileText size={18}/><div><b>议案内容压缩包</b><span>已汇集议案正文及 {p.attachments.length} 份附件，拆解人员可下载后核对执行依据。</span></div><button className="plain">{p.id}_议案材料.zip</button></section></div><footer><button className="plain" onClick={onClose}>取消</button><button className="pam-primary" onClick={() => onConfirm(nodes)}><Check size={15} />确认拆解</button></footer></Modal>;
}
function TaskDispatchModal({ p, templates, onClose, onConfirm }: { p: Proposal; templates: TaskBreakdownTemplate[]; onClose: () => void; onConfirm: () => void }) {
  const type = taskTypeOf(p);
  const [record, setRecord] = useState(type === "人事任免类" ? "组薪委" : type === "项目投资类" ? "金资财委" : "审监控委");
  const [upward, setUpward] = useState(type === "项目投资类");
  const [minutes, setMinutes] = useState("");
  const [generated, setGenerated] = useState(false);
  const nodes = defaultTaskNodes(p, templates);
  const generate = () => { setMinutes(`《${p.title}》已完成议案审核，现按${type}执行口径形成决议纪要：同意按议案提出的方案推进落实，请相关责任部门依据已拆解的任务节点、时间计划和证明材料要求组织实施，并按期反馈执行进展。`); setGenerated(true); };
  return <Modal className="task-modal dispatch-modal" onClose={onClose}><header><div><small>{p.id} · 任务智能分发</small><h2>确认任务分发</h2><p>{p.title}</p></div><button className="icon-button" onClick={onClose}><X /></button></header><div className="task-modal-scroll"><section className="task-form-section"><header><div><h3>横向备案</h3><p>系统已依据议案类型自动推荐备案委员会，可按实际情况调整。</p></div></header><div className="task-choice-row">{["组薪委", "审监控委", "金资财委"].map((item) => <button key={item} className={record === item ? "selected" : ""} onClick={() => setRecord(item)}>{record === item && <Check size={14}/>} {item}</button>)}</div></section><section className="task-form-section approval-choice"><header><div><h3>向上审批</h3><p>项目投资类议案默认勾选董事局审批，其他类型可根据事项调整。</p></div></header><label><input type="checkbox" checked={upward} onChange={(e) => setUpward(e.target.checked)} />提交董事局审批</label></section><section className="task-form-section"><header><div><h3>决议纪要</h3><p>可手工录入，也可结合议案类型、标题和附件生成初稿。</p></div><button className="plain task-generate-button" onClick={generate}><Sparkles size={14} />智能生成</button></header><textarea className="task-minutes" value={minutes} onChange={(e) => setMinutes(e.target.value)} placeholder="请输入决议纪要，或点击“智能生成”形成摘要。" />{generated && <span className="generated-mark">已按议案材料生成，可继续修改</span>}</section><section className="task-form-section"><header><div><h3>任务分配</h3><p>以下内容由任务拆解结果自动带入，将随本次分发一并下发。</p></div></header><div className="task-assignment-flow">{nodes.map((node, index) => <React.Fragment key={`${node.name}-${index}`}><article><span className="task-flow-number">{index + 1}</span><div><b>{node.name}</b><span className="task-flow-owner">{node.department} · {node.owner}</span><small>证明材料：{node.proofRequired ? "必要" : "非必要"} <i /> 时间节点：{node.deadline}</small></div></article>{index < nodes.length - 1 && <span className="task-flow-arrow">→</span>}</React.Fragment>)}</div></section></div><footer><button className="plain" onClick={onClose}>取消</button><button className="pam-primary" onClick={onConfirm}><Send size={15} />确认分发</button></footer></Modal>;
}
function TaskApprovalProgress({ p, onClose }: { p: Proposal; onClose: () => void }) {
  return <Modal className="approval-progress-modal" onClose={onClose}><header><div><small>{p.id} · 任务审批进度</small><h2>操作进度</h2><p>{p.title}</p></div><button className="icon-button" onClick={onClose}><X /></button></header><section className="approval-progress"><article className="done"><i><Check size={15}/></i><div><b>董事局审批通过</b><span>2026-08-13 10:20 · 已完成</span></div></article><article className="active"><i>2</i><div><b>审监控委备案中</b><span>已于今天 10:22 发起备案，等待确认</span></div></article><article><i>3</i><div><b>任务正式下发</b><span>待审监控委备案完成后自动执行</span></div></article></section><footer><button className="pam-primary" onClick={onClose}>我知道了</button></footer></Modal>;
}

function executionStatus(p: Proposal) {
  if (p.executionStatus) return p.executionStatus;
  if (p.id === "PA-2026-0056") return "执行中";
  if (p.id === "PA-2026-0060") return "待审核";
  if (p.id === "PA-2026-0068") return "驳回修改";
  return "已完成";
}
function ExecutionTracking({ items, onOpen, onReview, onArchive }: { items: Proposal[]; onOpen: (p: Proposal) => void; onReview: (p: Proposal) => void; onArchive: (p: Proposal) => void }) {
  const list = items.filter((p) => ["PA-2026-0056", "PA-2026-0060", "PA-2026-0068", "PA-2026-0072"].includes(p.id));
  const action = (p: Proposal) => executionStatus(p) === "待审核" ? <button className="pam-action" onClick={() => onReview(p)}><Sparkles size={13} />智能审核</button> : executionStatus(p) === "已完成" ? <button className="pam-action" onClick={() => onArchive(p)}><FileCheck2 size={13} />提交归档</button> : null;
  return <main className="pam-content"><PageTitle eyebrow="战略执行委员会 · 执行闭环" title="议案执行追踪" desc="跟踪已下发议案的节点执行、验证资料、智能审核与归档闭环；每次处理均保留节点与资料记录。" /><section className="pam-card execution-card"><header><div><h2>执行中的议案</h2><p>执行中可催办；待审核节点可基于验证资料问答并形成审核总结；已完成议案可生成总结报告后归档。</p></div><span className="count">{list.length} 项</span></header><AdminProposalTable items={list} onDetail={onOpen} statusOf={executionStatus} action={action} empty="暂无已下发的执行议案" /></section></main>;
}
function ExecutionProgressModal({ p, templates, onClose, onRemind }: { p: Proposal; templates: TaskBreakdownTemplate[]; onClose: () => void; onRemind: () => void }) {
  const nodes = defaultTaskNodes(p, templates);
  const status = executionStatus(p);
  const activeIndex = status === "待审核" ? Math.min(1, nodes.length - 1) : status === "执行中" ? Math.min(1, nodes.length - 1) : nodes.length - 1;
  return <Modal className="execution-modal" onClose={onClose}><header><div><small>{p.id} · 执行进度</small><h2>议案执行详情</h2><p>{p.title}</p></div><button className="icon-button" onClick={onClose}><X /></button></header><div className="execution-scroll"><section className="execution-summary"><div><b>当前状态</b><Status>{status}</Status></div><span>任务已下发至责任部门，节点完成信息与验证资料将作为后续审核及归档依据。</span></section><section className="execution-nodes"><header><div><h3>执行节点</h3><p>按任务拆解结果跟踪执行；已完成节点展示其上传的证明材料。</p></div></header>{nodes.map((node, index) => <article className={index < activeIndex ? "done" : index === activeIndex && status !== "已完成" && status !== "已归档" ? "active" : ""} key={`${node.name}-${index}`}><i>{index < activeIndex || status === "已完成" || status === "已归档" ? <Check size={13}/> : index + 1}</i><div><b>{node.name}</b><span>{node.department} · {node.owner} · 计划完成：{node.deadline}</span>{index < activeIndex || status === "已完成" || status === "已归档" ? <div className="node-evidence"><FileText size={13}/><span>{node.name}_完成说明.pdf</span><span>{node.name}_验证照片.zip</span></div> : index === activeIndex ? <small>当前执行节点，等待责任人提交验证资料</small> : <small>待上一节点审核通过后自动进入</small>}</div></article>)}</section>{status === "驳回修改" && <section className="execution-revision"><header><h3>驳回修改记录</h3><Status>驳回修改</Status></header><div><b>{p.executionRevision?.reviewer || "周敏"} · {p.executionRevision?.time || "2026-08-13 14:20"}</b><label>修改建议</label><p>{p.executionRevision?.opinion || "请补充设备验收证明及整改前后对比材料，明确效益评估的测算依据。"}</p><label>已修改内容</label><p className="change">{p.executionRevision?.changes || "责任部门已补传设备验收报告、现场照片及效益测算说明，等待重新审核。"}</p></div></section>}</div><footer>{status === "执行中" && <button className="plain" onClick={onRemind}><Bell size={15}/>催办当前节点</button>}<button className="pam-primary" onClick={onClose}>关闭</button></footer></Modal>;
}
/* Legacy execution review draft retained only for reference.
function ExecutionReviewModal({ p, templates, onClose, onReject, onPass }: { p: Proposal; templates: TaskBreakdownTemplate[]; onClose: () => void; onReject: (summary: string) => void; onPass: () => void }) {
  const node = defaultTaskNodes(p, templates)[1] || defaultTaskNodes(p, templates)[0];
  const files = [`${node.name}_验收报告.pdf`, "现场执行照片.zip", "阶段效益测算.xlsx"];
  const [dropped, setDropped] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([{ role: "bot", text: "已读取当前节点资料。你可以拖入一个或多个验证资料，询问材料完整性、完成情况或风险点。" }]);
  const [summary, setSummary] = useState("");
  const ask = () => { if (!question.trim()) return; const text = question.trim(); setMessages((list) => [...list, { role: "user", text }, { role: "bot", text: `基于${dropped.length ? dropped.join("、") : "当前已上传资料"}分析：节点完成证据基本齐全，但建议核验实际完成时间与验收报告中的签字信息。` }]); setQuestion(""); };
  const makeSummary = () => setSummary(`已围绕“${node.name}”对 ${dropped.length ? dropped.join("、") : "已上传验证资料"} 完成核验。资料能够证明任务按计划推进，建议补充验收签字页后进入下一节点；未发现影响执行闭环的重大风险。`);
  return <Modal className="execution-review-modal" onClose={onClose}><header><div><small>{p.id} · 节点智能审核</small><h2>验证资料审核</h2><p>{p.title}</p></div><button className="icon-button" onClick={onClose}><X /></button></header><div className="execution-review-scroll"><section className="execution-node-info"><header><div><h3>当前审核节点</h3><p>请先核对节点信息与验证资料，再通过资料问答形成审核结论。</p></div><Status>待审核</Status></header><div><label><span>节点名称</span><b>{node.name}</b></label><label><span>负责部门</span><b>{node.department}</b></label><label><span>负责人</span><b>{node.owner}</b></label><label><span>计划完成时间</span><b>{node.deadline}</b></label><label><span>实际完成时间</span><b>2026-08-13</b></label></div></section><section className="execution-chat-layout"><article className="evidence-panel"><header><h3>上传的验证资料</h3><span>可拖拽到右侧问答区</span></header><div>{files.map((file) => <button draggable key={file} onDragStart={(event) => event.dataTransfer.setData("text/plain", file)} onClick={() => setDropped((list) => list.includes(file) ? list : [...list, file])}><FileText size={15}/>{file}</button>)}</div></article><article className="review-chatbot" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.getData("text/plain"); if (file) setDropped((list) => list.includes(file) ? list : [...list, file]); }}><header><div><Bot size={17}/><div><h3>资料问答助手</h3><span>仅基于拖入的验证资料进行问答</span></div></header>{dropped.length === 0 ? <div className="chat-drop"><FileText size={20}/><b>拖拽验证资料到这里</b><span>支持一次选择多个文件作为本轮问答依据</span></div> : <div className="chat-files">{dropped.map((file) => <span key={file}>{file}<button onClick={() => setDropped((list) => list.filter((item) => item !== file))}>×</button></span>)}</div>}<div className="chat-messages">{messages.map((message, index) => <p className={message.role} key={index}>{message.text}</p>)}</div><div className="chat-input"><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="例如：验收报告是否能证明该节点已按期完成？" /><button className="pam-primary" onClick={ask}>发送</button></div></article></section><section className="conversation-summary"><header><div><h3>审核总结</h3><p>根据资料问答内容生成，可继续人工修改。</p></div><button className="plain" onClick={makeSummary}><Sparkles size={14}/>总结对话</button></header><textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="点击“总结对话”生成本轮审核结论。" /></section>{p.executionRevision && <section className="execution-revision inline"><header><h3>上轮驳回修改记录</h3><Status>驳回修改</Status></header><div><b>{p.executionRevision.reviewer} · {p.executionRevision.time}</b><label>修改建议</label><p>{p.executionRevision.opinion}</p><label>本次修改内容</label><p className="change">{p.executionRevision.changes}</p></div></section>}</div><footer><button className="danger" onClick={() => onReject(summary || "当前验证资料无法充分证明节点完成，请补充完整验收证明及签字材料后重新提交。")}>驳回</button><button className="pam-primary" onClick={onPass}><Check size={15}/>进入下一节点</button></footer></Modal>;
}
*/
function ExecutionReviewModal({ p, templates, onClose, onReject, onPass }: { p: Proposal; templates: TaskBreakdownTemplate[]; onClose: () => void; onReject: (summary: string) => void; onPass: () => void }) {
  const node = defaultTaskNodes(p, templates)[1] || defaultTaskNodes(p, templates)[0];
  const files = [`${node.name}_验收报告.pdf`, "现场执行照片.zip", "阶段效益测算.xlsx"];
  const [dropped, setDropped] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: "bot" | "user"; text: string }[]>([]);
  const [summary, setSummary] = useState("");
  const ask = () => {
    if (!question.trim()) return;
    const text = question.trim();
    setMessages((list) => [...list, { role: "user", text }, { role: "bot", text: `基于${dropped.length ? dropped.join("、") : "当前已上传资料"}分析：节点完成证据基本齐全，建议核验实际完成时间与验收报告中的签字信息。` }]);
    setQuestion("");
  };
  const makeSummary = () => setSummary(`已围绕“${node.name}”完成验证资料核验。资料能够证明任务按计划推进，建议补充验收签字页后进入下一节点；未发现影响执行闭环的重大风险。`);
  return <Modal className="execution-review-modal" onClose={onClose}>
    <header><div><small>{p.id} · 节点智能审核</small><h2>验证资料审核</h2><p>{p.title}</p></div><button className="icon-button" onClick={onClose}><X /></button></header>
    <div className="execution-review-scroll">
      {p.executionRevision && <section className="execution-revision inline revision-top"><header><h3>上轮驳回修改记录</h3><Status>驳回修改</Status></header><div><b>{p.executionRevision.reviewer} · {p.executionRevision.time}</b><label>修改建议</label><p>{p.executionRevision.opinion}</p><label>本次修改内容</label><p className="change">{p.executionRevision.changes}</p></div></section>}
      <section className="execution-meta-grid">
        <article className="execution-node-info"><header><div><h3>当前审核节点</h3><p>核对节点与完成时间。</p></div><Status>待审核</Status></header><div>{[['节点名称', node.name], ['负责部门', node.department], ['负责人', node.owner], ['计划完成时间', node.deadline], ['实际完成时间', '2026-08-13']].map(([label, value]) => <label key={label}><span>{label}</span><b>{value}</b></label>)}</div></article>
      </section>
      <section className="execution-workspace">
        <article className="evidence-panel evidence-dock"><header><div><h3>验证资料</h3><span>拖拽至问答区</span></div><b>{files.length} 份</b></header><div className="evidence-file-list">{files.map((file) => <button draggable key={file} onDragStart={(event) => event.dataTransfer.setData("text/plain", file)} onClick={() => setDropped((list) => list.includes(file) ? list : [...list, file])}><FileText size={14}/><span>{file}</span></button>)}</div><div className="evidence-drop"><FileText size={18}/><span>选择资料后开始问答</span></div></article>
        <article className="review-chatbot" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); const file = event.dataTransfer.getData("text/plain"); if (file) setDropped((list) => list.includes(file) ? list : [...list, file]); }}>
          <header className="chat-assistant-head"><i><Sparkles size={16}/></i><div><h3>资料问答</h3><span>{dropped.length ? `已选 ${dropped.length} 份资料` : "从左侧选择或拖拽资料"}</span></div></header>
          {dropped.length > 0 && <div className="chat-files">{dropped.map((file) => <span key={file}>{file}<button onClick={() => setDropped((list) => list.filter((item) => item !== file))}>×</button></span>)}</div>}
          <div className={messages.length ? "chat-messages" : "chat-messages chat-empty"}>{messages.length ? messages.map((message, index) => <p className={message.role} key={index}>{message.text}</p>) : <div><Bot size={21}/><b>资料已就绪</b><span>选择验证资料后，输入问题开始核验</span></div>}</div>
          <div className="chat-input"><textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="输入关于资料的核验问题…" /><button className="pam-primary" onClick={ask}>发送</button></div>
        </article>
        <article className="conversation-summary light-summary"><header><div><h3>审核总结</h3><p>基于当前问答生成。</p></div><button className="plain" onClick={makeSummary}><Sparkles size={14}/>生成</button></header><textarea value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="暂未生成审核结论" /></article>
      </section>
    </div>
    <footer><button className="danger" onClick={() => onReject(summary || "当前验证资料无法充分证明节点完成，请补充完整验收证明及签字材料后重新提交。")}>驳回</button><button className="pam-primary" onClick={onPass}><Check size={15}/>进入下一节点</button></footer>
  </Modal>;
}
function ExecutionArchiveModal({ p, onClose, onConfirm }: { p: Proposal; onClose: () => void; onConfirm: () => void }) {
  return <Modal className="archive-modal" onClose={onClose}><header><div><small>{p.id} · 归档确认</small><h2>生成总结报告并提交归档</h2><p>{p.title}</p></div><button className="icon-button" onClick={onClose}><X /></button></header><section className="archive-banner"><FileCheck2 size={20}/><div><b>执行总结报告模板 · V1.0</b><span>系统将按固定模板汇总议案决议、任务节点、审核结论与完成材料。</span></div></section><section className="archive-content"><header><h3>智能生成的执行总结</h3><span>可归档预览</span></header><p>《{p.title}》已完成全部任务节点执行。各责任部门已按计划提交验证资料并完成节点审核，执行过程中形成的任务分发、审批记录、验证文件及审核总结将一并归档，供后续复盘与审计追溯。</p></section><section className="archive-files"><header><h3>归档资料包</h3><span>自动汇总</span></header><div><span><FileText size={15}/>执行总结报告_{p.id}.docx</span><span><FileText size={15}/>{p.id}_全流程资料包.zip</span><span><FileText size={15}/>节点验证资料_共6份.zip</span></div></section><footer><button className="plain" onClick={onClose}>取消</button><button className="pam-primary" onClick={onConfirm}><Check size={15}/>确认提交</button></footer></Modal>;
}
function MeetingMaterials({ items, onSetup, onVote, onMeetingEnd, onAnnouncement, onAnnouncementView }: { items: Proposal[]; onSetup: (p: Proposal) => void; onVote: (p: Proposal) => void; onMeetingEnd: (p: Proposal) => void; onAnnouncement: (p: Proposal) => void; onAnnouncementView: (p: Proposal) => void }) {
  const deliberationStatus = (p: Proposal): DeliberationStatus => p.deliberationStatus || (({ "PA-2026-0068": "审核通过", "PA-2026-0060": "投票审议中", "PA-2026-0063": "投票审议中", "PA-2026-0062": "投票审议中", "PA-2026-0056": "线上会议审议中", "PA-2026-0061": "线下会议审议中", "PA-2026-0081": "审议完成", "PA-2026-0079": "公告已发送" } as Record<string, DeliberationStatus>)[p.id] || "审核通过");
  const [statusFilter, setStatusFilter] = useState<DeliberationStatus | "">("");
  const statuses: DeliberationStatus[] = ["审核通过", "投票审议中", "线上会议审议中", "线下会议审议中", "审议完成", "公告已发送"];
  const rows = items.filter((p) => Boolean(p.deliberationStatus) || ["PA-2026-0068", "PA-2026-0060", "PA-2026-0056", "PA-2026-0061", "PA-2026-0081", "PA-2026-0079", "PA-2026-0063", "PA-2026-0062"].includes(p.id));
  const filteredRows = statusFilter ? rows.filter((p) => deliberationStatus(p) === statusFilter) : rows;
  const action = (p: Proposal) => { const status = deliberationStatus(p); if (status === "审核通过") return <button className="pam-action" onClick={() => onSetup(p)}>生成审议信息</button>; if (status === "投票审议中") return <button className="link" onClick={() => onVote(p)}>查看</button>; if (["线上会议审议中", "线下会议审议中"].includes(status)) return <button className="pam-action" onClick={() => onMeetingEnd(p)}>信息录入</button>; if (status === "审议完成") return <button className="pam-action" onClick={() => onAnnouncement(p)}>生成公告</button>; return <button className="link" onClick={() => onAnnouncementView(p)}>查看</button>; };
  return <main className="pam-content"><PageTitle eyebrow="战略执行委员会 · 审议协同" title="审议流程管理" desc="覆盖群投票、线上会议和线下会议的审议组织、表决状态与结果处理。"/><SheetSkillOverview title="审议流程管理" skills={[{ name: "群投票审议 Skill", desc: "生成群投票审议信息、投票范围、催票规则与可编辑的审议话术。" }, { name: "线上会议审议 Skill", desc: "生成线上会议审议要点，并匹配会议链接、参会人员与审议内容。" }, { name: "线下会议审议 Skill", desc: "生成线下会议审议要点，并匹配会议室、参会人员与审议内容。" }, { name: "审议结果通知 Skill", desc: "根据审议通过或未通过的结果，生成差异化的公告内容与后续行动提示。" }]} /><section className="pam-card"><header><div><h2>审议流程清单</h2><p>审核通过后可生成审议信息；审议完成后可生成结果公告并留存全过程记录。</p></div><span className="count">{filteredRows.length}{statusFilter ? ` / ${rows.length}` : ""} 项</span></header><div className="deliberation-status-filter" aria-label="按状态筛选审议议案"><span>状态筛选</span><div>{statuses.map((status) => <button key={status} className={statusFilter === status ? "active" : ""} onClick={() => setStatusFilter((current) => current === status ? "" : status)}><i>{rows.filter((p) => deliberationStatus(p) === status).length}</i>{status}</button>)}{statusFilter && <button className="clear-filter" onClick={() => setStatusFilter("")}>清除筛选</button>}</div></div><AdminProposalTable items={filteredRows} onDetail={() => {}} statusOf={deliberationStatus} showDetail={() => false} action={action} empty="当前状态暂无审议议案" /></section></main>;
}
function ReviewList({
  title,
  desc,
  items,
  kind,
  skills,
  onDetail,
  onOpen,
}: {
  title: string;
  desc: string;
  items: Proposal[];
  kind: "functional" | "audit";
  skills: any[];
  onDetail: (p: Proposal) => void;
  onOpen: (kind: string, p: Proposal) => void;
}) {
  const allowed = skills.find((s) => s.id === kind)?.enabled;
  const target =
    kind === "functional"
      ? items.filter((p) => p.stage === "functional" || p.stage === "returned")
      : items.filter((p) => p.stage === "audit");
  const canRunSmartReview = (p: Proposal) => {
    if (!allowed) return false;
    if (kind === "functional") {
      return ["待职能预审", "驳回修改后 · 待职能预审"].includes(p.status);
    }
    return ["待议案审核", "待审核", "驳回修改后待审核"].includes(p.status);
  };
  return (
    <main className="pam-content">
      <PageTitle
        eyebrow={kind === "functional" ? "职能部门工作台" : "议案审核工作台"}
        title={title}
        desc={desc}
      />
      <section className="pam-skill-tip">
        <Sparkles size={18} />
        <div>
          <b>{allowed ? "已启用智能预审技能" : "尚未配置审核技能"}</b>
          <span>
            {allowed
              ? "点击“智能审核”或在详情中点击“智能预审”，即可生成可编辑的预审建议。"
              : "智能审核已禁用；你仍可查看完整材料、手工填写意见并作出结论。"}
          </span>
        </div>
        <button onClick={() => (location.hash = "#page=skills")}>
          {allowed ? "查看技能" : "去配置技能"}
        </button>
      </section>
      <section className="pam-card">
        <header>
          <div>
            <h2>{kind === "functional" ? "预审核清单" : "待议案审核"}</h2>
            <p>
              {kind === "functional"
                ? "包含待预审、驳回修改和驳回修改后待预审的议案。"
                : "审核通过后可由委员会进入投票智能设置。"}
            </p>
          </div>
          <span className="count">{target.length} 项待办</span>
        </header>
        <ProposalTable
          items={target}
          onDetail={onDetail}
          showRevisionTag={false}
          action={(p) =>
            canRunSmartReview(p) ? (
              <button className="pam-action" onClick={() => onOpen(kind, p)}>
                智能审核
              </button>
            ) : null
          }
        />
      </section>
    </main>
  );
}
function Skills({
  skills,
  setSkills,
  notice,
}: {
  skills: any[];
  setSkills: any;
  notice: (s: string) => void;
}) {
  const [pick, setPick] = useState(skills[0].id);
  const current = skills.find((s) => s.id === pick)!;
  const inputMap: Record<string, string[]> = { organize: ["原始申请表字段", "原始附件", "锁定议案模板"], functional: ["整理后的议案", "整理后附件", "职能审核口径"], audit: ["整理结果", "预审建议", "整理后附件与合规依据"], voting: ["审核通过议案", "投票群与投票人", "截止与催票规则"], "online-meeting": ["审核通过议案", "会议时间与链接", "参会人员"], "offline-meeting": ["审核通过议案", "会议时间与会议室", "参会人员"], speech: ["审议结果", "领导建议", "已生成审议信息"] };
  const writingTips: Record<string, string> = { organize: "写清楚需要提取哪些字段、哪些材料必须齐全，以及缺失时如何提示。", functional: "写清楚需要关注哪些专业口径、风险点和需补充的材料。", audit: "写清楚审核通过的条件、需重点关注的风险，以及什么情况下建议驳回修改。", voting: "写清楚审议内容需包含哪些决策问题、依据、风险和资源，并保持正式、简明。", "online-meeting": "写清楚线上会议需要输出哪些审议要点、参会提示和会议说明。", "offline-meeting": "写清楚线下会议需要输出哪些审议要点、参会提示和会议信息。", speech: "分别写清楚通过和未通过时应如何总结结果、表达领导建议与后续要求。" };
  const groups = [{ title: "议案整理与审核", ids: ["organize", "functional", "audit"] }, { title: "审议流程管理", ids: ["voting", "online-meeting", "offline-meeting", "speech"] }];
  const [draft, setDraft] = useState(current.prompt);
  const choose = (id: string) => {
    setPick(id);
    setDraft(skills.find((s) => s.id === id)!.prompt);
  };
  const save = () => {
    setSkills((v: any[]) =>
      v.map((s) =>
        s.id === pick ? { ...s, prompt: draft, enabled: !!draft.trim() } : s,
      ),
    );
    notice(
      draft.trim()
        ? `“${current.name}”已保存并启用`
        : `“${current.name}”尚未保存，相关一键操作已禁用`,
    );
  };
  return (
    <main className="pam-content">
      <PageTitle
        eyebrow="AI能力配置"
        title="技能定义"
        desc="从具体业务场景开始编写：先了解该技能要解决什么问题、会参考哪些信息，再用清晰的规则告诉 AI 如何生成结果。"
      />
      <section className="pam-skill-layout">
        <aside>
          {groups.map((group) => <section className="skill-group" key={group.title}><b>{group.title}</b><small>选择一个场景开始编写</small>{skills.filter((s) => group.ids.includes(s.id)).map((s) => <button className={pick === s.id ? "selected" : ""} onClick={() => choose(s.id)} key={s.id}><Sparkles size={17}/><span><b>{s.name}</b><small>{s.enabled ? "已编写" : "待编写"}</small></span></button>)}</section>)}
        </aside>
        <section className="pam-card skill-editor">
          <header>
            <div>
              <h2>{current.name}</h2>
              <p>{current.desc}</p>
            </div>
            <Status>{current.enabled ? "已启用" : "未配置"}</Status>
          </header>
          <section className="skill-writing-guide"><header><Sparkles size={18}/><div><b>Skill 编写说明</b><p>{current.desc}</p></div></header><div className="skill-writing-guide-body"><article><span>使用场景</span><b>{current.scene || "对应业务页面"}</b></article><article><span>可参考的数据</span><p>{(inputMap[current.id] || ["当前页面已填写信息"]).map((item) => <i key={item}>{item}</i>)}</p></article><article><span>怎么写更有效</span><p>{writingTips[current.id] || "写清楚处理目标、判断标准、关注信息和希望生成的结果。"}</p></article></div></section>
          <label>
            写给 AI 的处理要求
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="可按“要做什么 → 重点看什么 → 结果怎么写”描述。例如：请核验材料完整性，重点关注制度依据和风险提示，并按条目输出需补充项与修改建议。"
            />
          </label>
          <div className="skill-note">
            <Bell size={16} />
            保存空白技能
            会使相关“一键”按钮禁用，但人工审核、人工填写意见不会受影响。
          </div>
          <footer>
            <button className="plain" onClick={() => setDraft(current.prompt)}>
              恢复已保存内容
            </button>
            <button className="pam-primary" onClick={save}>
              <Check size={15} />
              保存技能
            </button>
          </footer>
        </section>
      </section>
    </main>
  );
}
function Templates({
  templates,
  setTemplates,
  taskTemplates,
  setTaskTemplates,
  notice,
}: {
  templates: ProposalTemplate[];
  setTemplates: React.Dispatch<React.SetStateAction<ProposalTemplate[]>>;
  taskTemplates: TaskBreakdownTemplate[];
  setTaskTemplates: React.Dispatch<React.SetStateAction<TaskBreakdownTemplate[]>>;
  notice: (s: string) => void;
}) {
  const [pick, setPick] = useState(templates[0].id);
  const [scope, setScope] = useState<"proposal" | "task">("proposal");
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<"fields" | "history">("fields");
  const current = templates.find((t) => t.id === pick)!;
  const [name, setName] = useState(current.name);
  const [types, setTypes] = useState(current.types.join("、"));
  const [fields, setFields] = useState<TemplateField[]>(current.fields);
  const [taskPick, setTaskPick] = useState(taskTemplates[0].id);
  const [taskEditing, setTaskEditing] = useState(false);
  const taskCurrent = taskTemplates.find((item) => item.id === taskPick)!;
  const [taskNodes, setTaskNodes] = useState<TaskNode[]>(taskCurrent.nodes);
  useEffect(() => {
    setName(current.name);
    setTypes(current.types.join("、"));
    setFields(current.fields);
    setEditing(false);
    setTab("fields");
  }, [current]);
  useEffect(() => {
    setTaskNodes(taskCurrent.nodes);
    setTaskEditing(false);
  }, [taskCurrent]);
  const select = (id: string) => setPick(id);
  const addField = () =>
    setFields((v) => [
      ...v,
      { key: `custom_field_${v.length + 1}`, label: "新字段", description: "请说明字段业务含义。", aliases: "", type: "文本", required: false, priority: "原申请表优先", conflict: "标记人工确认" },
    ]);
  const patchField = (index: number, patch: Partial<TemplateField>) =>
    setFields((v) => v.map((field, i) => (i === index ? { ...field, ...patch } : field)));
  const publish = () => {
    if (!name.trim() || !types.trim() || !fields.length || fields.some((f) => !f.key.trim() || !f.label.trim() || !f.description.trim())) {
      notice("请完善模板名称、适用类型以及每个字段的标识、名称和说明后再发布");
      return;
    }
    const nextVersion = current.status === "已发布" ? `V${(Number(current.version.slice(1).split(".")[0]) || 1) + 1}.0` : "V1.0";
    const now = "2026-08-12 11:10";
    setTemplates((list) => list.map((t) => t.id === current.id ? {
      ...t,
      name: name.trim(),
      types: types.split(/[、,，]/).map((x) => x.trim()).filter(Boolean),
      fields,
      version: nextVersion,
      status: "已发布",
      updatedAt: now,
      owner: "王楷煜",
      history: [{ version: nextVersion, date: now, owner: "王楷煜", note: "从草稿发布新版本；新申请自动使用，流转中议案保留锁定版本", used: 0 }, ...t.history],
    } : t));
    setEditing(false);
    notice(`已发布 ${nextVersion}；新申请将自动匹配新版本，流转中议案继续锁定原版本`);
  };
  const createDraft = () => {
    const id = `tpl-draft-${templates.length + 1}`;
    const draft: ProposalTemplate = { id, name: "未命名议案模板", types: ["未指定"], version: "V1.0", status: "草稿", updatedAt: "刚刚", owner: "王楷煜", usedCount: 0, fields: templateFieldsSeed.slice(0, 5), history: [] };
    setTemplates((v) => [draft, ...v]);
    setPick(id);
    setEditing(true);
    notice("已新建模板草稿，请完善字段后发布");
  };
  const patchTaskNode = (index: number, patch: Partial<TaskNode>) => setTaskNodes((nodes) => nodes.map((node, i) => i === index ? { ...node, ...patch } : node));
  const saveTaskTemplate = () => {
    if (!taskNodes.length || taskNodes.some((node) => !node.name.trim() || !node.department.trim() || !node.owner.trim())) {
      notice("请完善每个任务节点的名称、负责部门和负责人后再保存");
      return;
    }
    setTaskTemplates((list) => list.map((item) => item.id === taskCurrent.id ? { ...item, nodes: taskNodes, updatedAt: "刚刚", version: item.status === "已发布" ? `V${Number(item.version.slice(1).split(".")[0]) + 1}.0` : item.version } : item));
    setTaskEditing(false);
    notice("任务拆解模板已保存并形成新版本，后续智能拆解将自动引用最新模板");
  };
  return (
    <main className="pam-content template-page">
      <PageTitle eyebrow="系统管理 · 模板管理员" title="模板管理" desc="模板按业务用途分为议案模板与任务拆解模板；议案流转中始终锁定其发起时使用的版本。">
        {scope === "proposal" && <button className="pam-primary" onClick={createDraft}><Plus size={15} />新建议案模板</button>}
      </PageTitle>
      <section className="template-rule-banner">
        <FileCog size={21} />
        <div><b>模板与技能分工</b><span>模板定义“收集什么、字段是什么意思、数据从哪里来”；技能定义“如何按业务规则判断、预审与生成”。</span></div>
        <span className="template-role">仅模板管理员可编辑</span>
      </section>
      <section className="template-scope-tabs" aria-label="模板类型切换">
        <button className={scope === "proposal" ? "active" : ""} onClick={() => setScope("proposal")}><FileText size={16}/><span>议案模板</span><small>4个</small></button>
        <button className={scope === "task" ? "active" : ""} onClick={() => setScope("task")}><FileCheck2 size={16}/><span>任务拆解模板</span><small>3个</small></button>
      </section>
      {scope === "proposal" && <>
      <section className="template-layout">
        <aside className="template-list pam-card">
          <header><div><h2>议案模板</h2><p>按议案类型自动匹配。</p></div><span className="count">{templates.length} 个</span></header>
          {templates.map((t) => <button className={pick === t.id ? "selected" : ""} onClick={() => select(t.id)} key={t.id}>
            <FileText size={17} /><span><b>{t.name}</b><small>{t.types.join("、")} · {t.version}</small></span><Status>{t.status}</Status>
          </button>)}
        </aside>
        <section className="pam-card template-editor">
          <header>
            <div><h2>{editing ? "编辑模板草稿" : current.name}</h2><p>{editing ? "发布后自动生成新版本；不会覆盖流转中议案已锁定的版本。" : `${current.types.join("、")} · 最近更新 ${current.updatedAt} · 管理员 ${current.owner}`}</p></div>
            <div className="template-head-actions">{!editing && <Status>{current.status}</Status>}{!editing && <button className="plain" onClick={() => setEditing(true)}><PenLine size={14} />编辑新版本</button>}</div>
          </header>
          <div className="template-tabs"><button className={tab === "fields" ? "active" : ""} onClick={() => setTab("fields")}>字段配置</button><button className={tab === "history" ? "active" : ""} onClick={() => setTab("history")}><History size={14} />发布记录</button></div>
          {tab === "fields" ? <>
            <section className="template-basics">
              <label>模板名称{editing ? <input value={name} onChange={(e) => setName(e.target.value)} /> : <b>{current.name}</b>}</label>
              <label>适用议案类型{editing ? <input value={types} onChange={(e) => setTypes(e.target.value)} placeholder="多个类型以顿号分隔" /> : <b>{current.types.join("、")}</b>}</label>
              <label>当前版本<b>{current.version}{current.status === "已发布" ? " · 已发布" : " · 草稿"}</b></label>
              <label>默认冲突处理<b>标记人工确认</b></label>
            </section>
            <section className="field-rule-note"><CircleAlert size={16} /><span>每个字段的“系统标识”固定用于匹配与留痕；显示名称、说明与识别别名帮助模型理解“名字”等不同表述。来源不一致时一律提示人工确认。</span></section>
            <div className="template-field-head"><b>字段清单</b><span>{fields.length} 个字段</span>{editing && <button className="plain" onClick={addField}><Plus size={14} />添加字段</button>}</div>
            <div className="template-fields">
              {fields.map((field, i) => <article key={`${field.key}-${i}`}>
                <div className="field-top"><b>{i + 1}. {editing ? <input value={field.label} onChange={(e) => patchField(i, { label: e.target.value })} /> : field.label}</b>{editing ? <button className="remove-field" onClick={() => setFields((v) => v.filter((_, n) => n !== i))}>删除</button> : <>{field.required && <em>必填</em>}<span>{field.type}</span></>}</div>
                <div className="field-grid">
                  <label>系统标识{editing ? <input value={field.key} onChange={(e) => patchField(i, { key: e.target.value })} /> : <b>{field.key}</b>}</label>
                  <label>字段说明{editing ? <input value={field.description} onChange={(e) => patchField(i, { description: e.target.value })} /> : <b>{field.description}</b>}</label>
                  <label>识别别名{editing ? <input value={field.aliases} onChange={(e) => patchField(i, { aliases: e.target.value })} /> : <b>{field.aliases || "—"}</b>}</label>
                  <label>数据类型{editing ? <select value={field.type} onChange={(e) => patchField(i, { type: e.target.value })}><option>文本</option><option>长文本</option><option>人员</option><option>组织</option><option>金额</option><option>日期</option><option>枚举</option></select> : <b>{field.type}</b>}</label>
                  <label>来源优先级{editing ? <select value={field.priority} onChange={(e) => patchField(i, { priority: e.target.value })}><option>原申请表优先</option><option>附件补充</option><option>人工确认优先</option></select> : <b>{field.priority}</b>}</label>
                  <label>冲突规则{editing ? <select value={field.conflict} onChange={(e) => patchField(i, { conflict: e.target.value })}><option>标记人工确认</option><option>优先级自动采用</option><option>阻断流转</option></select> : <b>{field.conflict}</b>}</label>
                </div>
                {editing && <label className="required-toggle"><input type="checkbox" checked={field.required} onChange={(e) => patchField(i, { required: e.target.checked })} />必填字段</label>}
              </article>)}
            </div>
          </> : <section className="template-history">{current.history.map((h) => <article key={`${h.version}-${h.date}`}><span className="history-dot" /><div><b>{h.version} · {h.note}</b><p>{h.date} · {h.owner}</p></div><small>{h.used} 条议案使用</small></article>)}{!current.history.length && <div className="pam-empty">尚未发布版本</div>}</section>}
          {editing && <footer><button className="plain" onClick={() => { setEditing(false); setName(current.name); setTypes(current.types.join("、")); setFields(current.fields); }}>取消</button><button className="pam-primary" onClick={publish}><Check size={15} />校验并发布新版本</button></footer>}
        </section>
      </section>
      </>}
      {scope === "task" && <>
      <section className="pam-card task-template-admin">
        <header>
          <div><h2>任务拆解模板</h2><p>用于已审核通过议案的智能拆解；模板预设项目节点、负责部门、负责人、证明材料要求和时间节点。</p></div>
          <span className="template-role">仅模板管理员可维护</span>
        </header>
        <div className="task-template-layout">
          <aside>
            {taskTemplates.map((item) => <button key={item.id} className={taskPick === item.id ? "selected" : ""} onClick={() => setTaskPick(item.id)}><FileCheck2 size={17} /><span><b>{item.name}</b><small>{item.types.join("、")} · {item.version}</small></span><Status>{item.status}</Status></button>)}
          </aside>
          <section className="task-template-editor">
            <header><div><h3>{taskCurrent.name}</h3><p>适用类型：{taskCurrent.types.join("、")} · 最近更新：{taskCurrent.updatedAt} · 管理员：{taskCurrent.owner}</p></div>{!taskEditing && <button className="plain" onClick={() => setTaskEditing(true)}><PenLine size={14} />编辑模板</button>}</header>
            <div className="task-node-head"><b>节点配置</b><span>{taskNodes.length} 个节点</span>{taskEditing && <button className="plain task-add-node-button" onClick={() => setTaskNodes((nodes) => [...nodes, { name: "新任务节点", department: "待指定", owner: "待指定", proofRequired: true, deadline: "2026-10-31" }])}><Plus size={14} />添加节点</button>}</div>
            <div className="task-node-table">
              <div className="task-node-row task-node-label"><span>节点名称</span><span>负责部门</span><span>负责人</span><span>证明材料</span><span>时间节点</span>{taskEditing && <span />}</div>
              {taskNodes.map((node, index) => <div className="task-node-row" key={`${node.name}-${index}`}>
                {taskEditing ? <input value={node.name} onChange={(e) => patchTaskNode(index, { name: e.target.value })} /> : <b>{node.name}</b>}
                {taskEditing ? <input value={node.department} onChange={(e) => patchTaskNode(index, { department: e.target.value })} /> : <span>{node.department}</span>}
                {taskEditing ? <input value={node.owner} onChange={(e) => patchTaskNode(index, { owner: e.target.value })} /> : <span>{node.owner}</span>}
                {taskEditing ? <select value={node.proofRequired ? "必要" : "非必要"} onChange={(e) => patchTaskNode(index, { proofRequired: e.target.value === "必要" })}><option>必要</option><option>非必要</option></select> : <Status>{node.proofRequired ? "必要" : "非必要"}</Status>}
                {taskEditing ? <input type="date" value={node.deadline} onChange={(e) => patchTaskNode(index, { deadline: e.target.value })} /> : <span>{node.deadline}</span>}
                {taskEditing && <button className="remove-field" onClick={() => setTaskNodes((nodes) => nodes.filter((_, i) => i !== index))}>删除</button>}
              </div>)}
            </div>
            {taskEditing && <footer><button className="plain" onClick={() => { setTaskNodes(taskCurrent.nodes); setTaskEditing(false); }}>取消</button><button className="pam-primary" onClick={saveTaskTemplate}><Check size={15} />保存任务拆解模板</button></footer>}
          </section>
        </div>
      </section>
      </>}
    </main>
  );
}
function Permissions() {
  const [groups, setGroups] = useState([true, true, true, true, true, false, true]);
  const pages = [
    "我的议案",
    "议案列表",
    "预审核列表",
    "审核列表",
    "技能定义",
    "模板管理",
    "权限管理",
  ];
  return (
    <main className="pam-content">
      <PageTitle
        eyebrow="系统管理"
        title="权限管理"
        desc="管理员按组织与角色配置业务页面的可见范围和操作权限。"
      />
      <section className="pam-permissions">
        <article className="pam-card">
          <header>
            <div>
              <h2>角色组</h2>
              <p>点击角色查看对应权限。</p>
            </div>
            <button className="pam-primary">新建角色组</button>
          </header>
          {[
            ["议案申请人", "仅查看本人议案，可修改被驳回议案"],
            ["战略执行委员会", "整理预审、提交议案、投票协同"],
            ["职能部门审核人", "预审核列表、转办与审核结论"],
            ["议案审核人", "审核列表与审核结论"],
            ["模板管理员", "模板管理、模板版本发布与字段规则维护"],
            ["系统管理员", "技能定义、模板管理、权限管理"],
          ].map(([a, b]) => (
            <button className="role" key={a}>
              <span>◉</span>
              <div>
                <b>{a}</b>
                <small>{b}</small>
              </div>
              <ChevronRight size={16} />
            </button>
          ))}
        </article>
        <article className="pam-card">
          <header>
            <div>
              <h2>战略执行委员会 · 页面可见范围</h2>
              <p>勾选后该角色组成员可在左侧导航中看到相应页面。</p>
            </div>
          </header>
          <div className="page-checks">
            {pages.map((p, i) => (
              <label key={p}>
                <input
                  type="checkbox"
                  checked={groups[i]}
                  onChange={() =>
                    setGroups((v) => v.map((x, n) => (n === i ? !x : x)))
                  }
                />
                <span>{p}</span>
              <small>{i < 2 || i === 5 ? "可编辑" : "仅查看 / 按流程处理"}</small>
              </label>
            ))}
          </div>
          <footer>
            <button className="pam-primary">保存权限配置</button>
          </footer>
        </article>
      </section>
    </main>
  );
}

const applicationFields = [
  ["议案名称", "闲置资产处置方案议案"],
  ["议案编号", "PA-2026-0079"],
  ["议案类型", "经营决策类"],
  ["议案来源", "门户提交"],
  ["申请人", "王楷煜"],
  ["所属部门", "资产管理部"],
  ["申请日期", "2026-08-11"],
  ["联系人", "王楷煜"],
  ["联系电话", "186 5312 6288"],
  ["是否紧急", "否"],
  ["关联年度", "2026年度"],
  ["涉及组织", "资产管理部、财务管理部"],
  ["议案依据", "《固定资产管理办法》及处置授权清单"],
  ["议案背景", "部分闲置设备已超过经济使用年限，需要统一评估并处置。"],
  ["决策事项", "审议并明确闲置资产处置方式及授权范围。"],
  ["处置方式", "评估后协议转让"],
  ["预计处置收益", "286.50 万元"],
  ["预算影响", "不新增预算"],
  ["风险提示", "须完成评估备案并核验受让方资质。"],
  ["合规依据", "固定资产处置审批流程、招采与合同管理规范"],
  ["预期效益", "盘活存量资产，降低维护成本。"],
  ["计划完成时间", "2026-10-31"],
];
const organizeCss = `.pam-modal.organize-modal{width:min(1520px,calc(100vw - 36px))}.organize-body{display:grid;grid-template-columns:1fr 1fr;min-height:440px;max-height:62vh;overflow:hidden}.organize-pane{padding:18px;overflow:auto}.organize-pane+.organize-pane{border-left:1px solid #e7ebf2;background:#fcfcff}.organize-pane h3{font-size:15px;margin:0;color:#344562}.organize-pane>p{margin:5px 0 13px;color:#8390a6;font-size:12px}.organize-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 13px}.organize-form label{min-height:58px;padding:8px 0;border-bottom:1px solid #edf0f5;display:flex;flex-direction:column;gap:5px}.organize-form label.wide{grid-column:span 2}.organize-form span{font-size:12px;color:#8290a8}.organize-form b{font-weight:500;color:#465671;font-size:12px;line-height:1.5}.organize-form input{height:29px;border:1px solid #dfe4ee;border-radius:5px;padding:0 8px;color:#41516d;font:12px Microsoft YaHei;background:#fff;outline-color:#655ae3}.organize-form label.missing span{color:#df5963;font-weight:700}.organize-form label.missing input{border-color:#f2a9af;background:#fff8f8}.missing-mark,.ai-mark{margin-left:4px;border-radius:9px;padding:2px 5px;font-size:10px;font-style:normal}.missing-mark{background:#fff0f1;color:#dd5661}.ai-mark{background:#efedff;color:#6557df}.empty-value{font-style:normal;color:#a7afbd}.organize-files{margin-top:15px;border:1px solid #e5e9f1;border-radius:7px;background:#fafbfe;padding:11px}.organize-files b{font-size:12px;color:#52617b}.organize-files div{margin-top:7px;display:flex;gap:7px;align-items:center;color:#5862be;font-size:12px}.organize-files .missing-file{color:#d65d65}.organize-summary{padding:12px 18px 16px;border-top:1px solid #e8ebf2;background:#fff}.organize-summary label{display:block;font-size:13px;font-weight:700;color:#41516b}.organize-summary textarea{width:100%;height:62px;border:1px solid #dfe4ef;border-radius:6px;margin-top:7px;padding:9px;resize:vertical;color:#465570;font:12px/1.55 Microsoft YaHei;outline-color:#655ae3}.pane-title{display:flex;align-items:flex-start;justify-content:space-between;gap:14px;margin:0 0 12px}.pane-title>div{min-width:0}.pane-title b{color:#344562;font-size:15px}.pane-title p{margin:5px 0 0;color:#8390a6;font-size:12px;line-height:1.5}.pane-title .plain{flex:0 0 auto;white-space:nowrap;padding:6px 10px;font-size:12px}.inline-skill{position:relative;margin:14px 18px 0;border:1px solid #d9d5ff;border-radius:8px;background:#f7f6ff;padding:14px;box-shadow:0 5px 14px #5250b214}.inline-skill header{display:flex;align-items:flex-start;justify-content:space-between;gap:15px}.inline-skill b{display:block;color:#514bc5}.inline-skill small{display:block;margin-top:4px;color:#7783a0;font-size:12px}.inline-skill textarea{width:100%;height:88px;margin-top:10px;border:1px solid #d9d6f7;border-radius:6px;padding:9px;font:12px/1.55 Microsoft YaHei;color:#44536e;resize:vertical}.inline-skill footer{display:flex;justify-content:flex-end;gap:8px;margin-top:10px}.vote-attachments{background:#f8f9fd;border:1px solid #edf0f5;border-radius:7px;padding:12px}.vote-attachments header{display:flex;justify-content:space-between;align-items:center;margin-bottom:6px}.vote-attachments header .plain{padding:5px 9px;font-size:12px}.vote-attachments>div{display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-top:1px solid #e9edf4;font-size:12px}.vote-attachments span{display:flex;align-items:center;gap:6px;color:#5862be}.vote-attachments>div button{border:0;background:transparent;color:#dc5964;font-size:12px;cursor:pointer}.prereview-advice{margin:14px 20px 75px;background:#f2f1ff;border:1px solid #dad6ff;border-radius:8px;padding:14px}.prereview-advice header{display:flex;align-items:flex-start;justify-content:space-between}.prereview-advice h3{margin:0;color:#4c47c6;font-size:16px}.prereview-advice p{margin:4px 0 0;color:#7984a0;font-size:12px}.prereview-advice header>span{background:#e5e1ff;color:#5d55d8;border-radius:10px;padding:3px 7px;font-size:11px}.prereview-advice textarea{width:100%;height:92px;margin-top:11px;border:1px solid #d9d6f7;border-radius:6px;padding:9px;background:#fff;color:#44536e;font:13px/1.55 Microsoft YaHei;resize:vertical;outline-color:#655ae3}`;
const skillPopupCss = `.inline-skill{position:fixed!important;z-index:90;top:50%;left:50%;width:min(620px,calc(100vw - 48px));margin:0!important;transform:translate(-50%,-50%);padding:20px!important;background:#fff!important;box-shadow:0 18px 48px #1d244966!important}.inline-skill:before{content:"";position:fixed;z-index:-1;inset:-100vmax;background:#1e274f66}.inline-skill header{padding:0!important;border:0!important}.inline-skill textarea{height:180px!important}.inline-skill footer{padding:0!important;border:0!important}.inline-skill .plain{background:#fff}`;
const layoutRepairCss = `.pam-modal .vote-form{overflow:hidden!important}.pam-modal .pane-title{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:start!important;width:100%!important;max-width:100%!important;gap:12px!important}.pam-modal .pane-title>div{min-width:0!important}.pam-modal .pane-title .plain{width:auto!important;min-width:112px!important;height:32px!important;white-space:nowrap!important;writing-mode:horizontal-tb!important;justify-content:center!important;align-self:flex-start!important}.pam-modal .vote-form>label{display:block!important;width:100%!important}.pam-modal .vote-form>label input,.pam-modal .vote-form>label textarea{display:block!important;width:100%!important;box-sizing:border-box!important}.pam-modal .vote-attachments header{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:12px!important}.pam-modal .vote-attachments header .plain{width:auto!important;min-width:96px!important;white-space:nowrap!important;writing-mode:horizontal-tb!important}.pam-modal .vote-attachments>div{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;align-items:center!important;gap:10px!important}.pam-modal .vote-attachments>div span{min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}.pam-modal .vote-attachments>div>button{width:auto!important;min-width:44px!important;padding:4px 8px!important;white-space:nowrap!important;writing-mode:horizontal-tb!important}.pam-modal .inline-skill{box-sizing:border-box!important}`;
const contextSkillCss = `.context-skill-bar{margin:14px 20px 16px;padding:13px 15px;display:flex;align-items:center;gap:11px;background:#f2f0ff;border:1px solid #ded9ff;border-radius:8px;color:#6255de}.context-skill-bar>div{min-width:0;display:flex;flex-direction:column;gap:3px}.context-skill-bar b{font-size:14px;color:#5d50db}.context-skill-bar span{color:#7984a1;font-size:12px;line-height:1.45}.context-skill-bar button{margin-left:auto;flex:0 0 auto;border:0;background:transparent;color:#5e51dc;font:700 13px Microsoft YaHei;cursor:pointer;padding:5px}.vote-form>.context-skill-bar,.speech>.context-skill-bar{margin:0 0 16px}.inline-skill{width:min(680px,calc(100vw - 48px))!important;padding:0!important;border:0!important;border-radius:10px!important;overflow:hidden!important}.inline-skill header{display:block!important;padding:18px 20px 14px!important;border-bottom:1px solid #e7ebf2!important}.inline-skill b{font-size:17px!important;color:#344562!important}.inline-skill small{font-size:12px!important;line-height:1.55!important}.inline-skill textarea{display:block;width:calc(100% - 40px)!important;height:178px!important;margin:16px 20px!important;padding:11px!important;border:1px solid #dfe4ee!important;border-radius:7px!important;resize:vertical!important;font:13px/1.65 Microsoft YaHei!important;box-sizing:border-box!important}.inline-skill footer{display:flex!important;align-items:center!important;justify-content:flex-end!important;gap:8px!important;padding:12px 20px!important;border-top:1px solid #e7ebf2!important;background:#fbfcff!important}.inline-skill footer .plain{height:34px!important}.inline-skill footer .pam-primary{height:34px!important;white-space:nowrap!important}`;
const organizeScrollCss = `.pam-modal.organize-modal{height:min(92vh,1040px)!important;max-height:92vh!important;display:grid!important;grid-template-rows:auto auto auto minmax(0,1fr) auto auto!important;overflow:hidden!important}.pam-modal.organize-modal>.context-skill-bar{box-sizing:border-box;margin:12px 20px!important}.pam-modal.organize-modal>.template-pin{box-sizing:border-box;margin:0 20px 12px!important;min-height:42px}.pam-modal.organize-modal>.organize-body{min-height:0!important;height:auto!important;max-height:none!important;overflow:hidden!important}.pam-modal.organize-modal .organize-pane{min-height:0!important;overflow-y:auto!important;overscroll-behavior:contain}.pam-modal.organize-modal>.organize-summary{max-height:150px;overflow-y:auto;overscroll-behavior:contain;box-sizing:border-box}.pam-modal.organize-modal>.organize-summary textarea{box-sizing:border-box;max-height:74px}.pam-modal.organize-modal>footer{margin:0!important;position:relative!important;z-index:2!important;box-shadow:0 -4px 12px #2e3d5b0c!important;flex:0 0 auto!important}`;
const templateCss = `.template-pin{margin:12px 20px;padding:10px 13px;display:flex;align-items:center;gap:9px;background:#f7f6ff;border:1px solid #ded9ff;border-radius:7px;color:#6155dc}.template-pin>div{display:flex;flex-direction:column;gap:2px;min-width:0}.template-pin b{font-size:12px;color:#4e49ba}.template-pin span{font-size:11px;color:#7f89a1;line-height:1.45}.template-pin button{margin-left:auto;flex:0 0 auto;border:0;background:transparent;color:#5e51dc;font:700 12px Microsoft YaHei;cursor:pointer;padding:4px}.template-page{padding-bottom:25px}.template-rule-banner{display:flex;align-items:center;gap:12px;padding:13px 15px;margin-bottom:15px;border:1px solid #ded9ff;border-radius:8px;background:#f4f2ff;color:#6155dc}.template-rule-banner>div{display:flex;flex-direction:column;gap:3px}.template-rule-banner b{font-size:14px}.template-rule-banner span{font-size:12px;color:#7783a1}.template-role{margin-left:auto;white-space:nowrap;color:#5d50db!important;font-weight:700}.template-layout{display:grid;grid-template-columns:265px minmax(0,1fr);gap:15px;align-items:start}.template-list{overflow:hidden}.template-list>header{min-height:64px}.template-list>button{width:100%;min-height:67px;border:0;border-top:1px solid #edf0f5;background:#fff;padding:11px 13px;display:flex;align-items:center;gap:9px;text-align:left;color:#61708a;cursor:pointer}.template-list>button:hover,.template-list>button.selected{background:#f4f2ff;color:#5a50d7}.template-list>button>span:nth-child(2){min-width:0;flex:1}.template-list b,.template-list small{display:block}.template-list b{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#40516c;font-size:13px}.template-list small{margin-top:4px;color:#8995a8;font-size:11px}.template-list .pam-status{font-size:10px;padding:3px 6px}.template-editor{min-width:0}.template-editor>header{gap:13px}.template-head-actions{display:flex;align-items:center;gap:8px}.template-tabs{height:45px;padding:0 16px;border-bottom:1px solid #edf0f5;display:flex;gap:22px}.template-tabs button{height:45px;padding:0 2px;border:0;border-bottom:2px solid transparent;background:transparent;color:#7886a0;font:13px Microsoft YaHei;display:flex;gap:5px;align-items:center;cursor:pointer}.template-tabs button.active{color:#5e54df;border-bottom-color:#6257e5;font-weight:700}.template-basics{display:grid;grid-template-columns:1.3fr 1.3fr .8fr .9fr;gap:0 16px;padding:6px 16px 15px}.template-basics label{padding:10px 0;border-bottom:1px solid #edf0f5;display:flex;flex-direction:column;gap:6px;color:#8290a7;font-size:12px}.template-basics b{font-weight:500;color:#40516d}.template-basics input{height:31px;border:1px solid #dfe4ee;border-radius:5px;padding:0 8px;color:#44536e;font:12px Microsoft YaHei;outline-color:#6257e5}.field-rule-note{margin:0 16px 13px;padding:10px 12px;display:flex;gap:8px;border-radius:6px;background:#fff9e9;color:#9f792e;font-size:12px;line-height:1.55}.template-field-head{padding:0 16px 10px;display:flex;align-items:center;gap:8px}.template-field-head>b{font-size:14px;color:#40516c}.template-field-head>span{font-size:11px;color:#93a0b3}.template-field-head button{margin-left:auto;padding:6px 10px;font-size:12px}.template-fields{padding:0 16px 16px;max-height:405px;overflow:auto}.template-fields article{border:1px solid #e2e7f1;border-radius:7px;margin-bottom:9px;padding:11px 12px;background:#fff}.field-top{display:flex;align-items:center;gap:7px;margin-bottom:10px;color:#41516c}.field-top>b{font-size:13px;display:flex;align-items:center;gap:3px}.field-top>em{font-style:normal;background:#fff0eb;color:#df7955;border-radius:9px;padding:2px 6px;font-size:10px}.field-top>span{font-size:11px;color:#7886a0;background:#f4f6fa;border-radius:9px;padding:2px 6px}.field-top .remove-field{margin-left:auto;border:0;background:transparent;color:#d45d67;font:12px Microsoft YaHei;cursor:pointer}.field-top input{width:150px;height:28px;border:1px solid #dfe4ee;border-radius:5px;padding:0 6px;font:600 13px Microsoft YaHei;color:#40516c}.field-grid{display:grid;grid-template-columns:1fr 1.6fr 1.25fr 100px 125px 125px;gap:8px}.field-grid label{display:flex;flex-direction:column;gap:5px;color:#8793a8;font-size:11px;min-width:0}.field-grid b{font-weight:500;color:#4b5a73;font-size:12px;line-height:1.45;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.field-grid input,.field-grid select{width:100%;height:29px;border:1px solid #dfe4ee;border-radius:5px;padding:0 6px;color:#465570;background:#fff;font:11px Microsoft YaHei;outline-color:#6257e5}.required-toggle{display:flex;align-items:center;gap:5px;margin-top:10px;color:#63718a;font-size:11px}.required-toggle input{accent-color:#6257e5}.template-history{padding:8px 16px 16px}.template-history article{display:flex;align-items:center;gap:10px;min-height:66px;padding:10px 0;border-bottom:1px solid #edf0f5}.history-dot{width:10px;height:10px;border:2px solid #6358df;border-radius:50%;background:#fff}.template-history article>div{flex:1}.template-history b{font-size:13px;color:#42516b}.template-history p{margin:4px 0 0;color:#8c98aa;font-size:11px}.template-history small{color:#6072a1;font-size:11px}.template-editor>footer{margin-top:0}.template-editor>footer .pam-primary{white-space:nowrap}`;
const organizeAuditCss = `.organize-audit-drawer{width:min(1040px,78vw)!important;background:#f7f8fc}.organize-audit-drawer>.template-pin{margin:12px 20px}.organize-audit-section{margin:14px 20px;background:#fff;border:1px solid #e2e7f1;border-radius:8px;overflow:hidden}.organize-audit-section>header{padding:14px 16px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;border-bottom:1px solid #edf0f5}.organize-audit-section h3{margin:0;color:#344562;font-size:16px}.organize-audit-section header p{margin:4px 0 0;color:#8996ab;font-size:12px;line-height:1.5}.organized-mark,.returned-mark{flex:0 0 auto;padding:4px 8px;border-radius:10px;background:#eef0ff;color:#5e54df;font-size:11px}.returned-mark{background:#eaf9f1;color:#198f68}.organize-audit-drawer .application-form{padding:0 16px 8px}.expectation-section{border-color:#f1d2d5}.expectation-card{margin:12px 16px;padding:12px 14px;background:#fff5f5;border:1px solid #f3cccc;border-radius:7px}.expectation-meta{display:flex;align-items:center;gap:7px}.expectation-meta b{color:#b9505c;font-size:13px}.expectation-meta span{font-size:11px;color:#a76d77;background:#ffe5e6;border-radius:10px;padding:3px 7px}.expectation-meta small{margin-left:auto;color:#8993a5;font-size:11px}.expectation-card p{margin:9px 0 0;color:#78545d;font-size:13px;line-height:1.65}.change-list{padding:0 16px}.change-list article{padding:12px 0;border-bottom:1px dashed #e5e9f0}.change-list article:last-child{border-bottom:0}.change-list b{color:#4a5972;font-size:13px}.change-list p{display:flex;flex-wrap:wrap;gap:9px;margin:7px 0 0;font-size:12px}.change-list del{color:#d76a70;text-decoration-color:#eba4a8}.change-list ins{color:#24926d;text-decoration:none;background:#edfaf4;padding:1px 5px;border-radius:4px}.organize-audit-drawer .attachment-section{margin-bottom:78px}.organize-audit-drawer .editable-files{padding:10px 16px 14px}`;
const organizeExpandCss = `.pam-modal.organize-modal{width:min(1540px,calc(100vw - 32px))!important;height:calc(100vh - 28px)!important;max-height:calc(100vh - 28px)!important;grid-template-rows:auto auto auto minmax(250px,1fr) auto auto!important}.pam-modal.organize-modal>header{padding:15px 20px!important}.pam-modal.organize-modal>header h2{margin:2px 0 4px!important}.pam-modal.organize-modal>.context-skill-bar{margin:10px 20px!important}.pam-modal.organize-modal>.template-pin{margin:0 20px 10px!important}.pam-modal.organize-modal>.organize-body{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important}.pam-modal.organize-modal .organize-pane{padding:18px 20px!important}.pam-modal.organize-modal .organize-form{grid-template-columns:repeat(2,minmax(0,1fr))!important}.pam-modal.organize-modal .organize-form .wide{grid-column:span 2!important}.pam-modal.organize-modal>.organize-summary{max-height:138px!important;padding:10px 20px!important}.pam-modal.organize-modal>.organize-summary textarea{min-height:62px!important}.pam-modal.organize-modal>footer{padding:12px 20px!important}`;
const submissionCss = `.submission-modal{width:min(980px,calc(100vw - 56px));max-height:92vh;background:#f7f8fc;display:flex;flex-direction:column;overflow:hidden}.submission-modal>.template-pin{margin:12px 20px}.submission-note{margin:0 20px 13px;padding:11px 13px;border:1px solid #d9e6ff;border-radius:7px;background:#f1f6ff;color:#4d63b8;display:flex;align-items:center;gap:9px}.submission-note>div{display:flex;flex-direction:column;gap:3px}.submission-note b{font-size:13px}.submission-note span{font-size:11px;color:#7988a4}.submission-section{margin:0 20px 13px;background:#fff;border:1px solid #e2e7f1;border-radius:8px;overflow:hidden}.submission-section>header{padding:12px 15px;border-bottom:1px solid #edf0f5}.submission-section h3{margin:0;color:#344562;font-size:15px}.submission-section p{margin:4px 0 0;color:#8996ab;font-size:12px}.submission-section .application-form{padding:0 16px 8px}.submission-files{margin-bottom:0}.submission-files .editable-files{padding:10px 16px 13px}.submission-modal>footer{margin-top:auto;padding:13px 20px;background:#fff;border-top:1px solid #e4e8f1;display:flex;justify-content:flex-end;gap:8px}`;
const submissionScrollCss = `.pam-modal.submission-modal{height:min(92vh,920px)!important;max-height:92vh!important;display:block!important;overflow-y:auto!important;overscroll-behavior:contain;scroll-behavior:smooth}.submission-modal>header,.submission-modal>.template-pin,.submission-modal>.submission-note{flex:0 0 auto}.submission-modal>.submission-files{margin-bottom:76px}.submission-modal>footer{position:sticky!important;bottom:0!important;z-index:3;margin:0!important;box-shadow:0 -4px 14px #2f3e5c12}.submission-modal::-webkit-scrollbar{width:8px}.submission-modal::-webkit-scrollbar-thumb{background:#b9c0cd;border-radius:8px}`;
const disabledActionCss = `.pam-action.disabled-action{background:#c8c5dc!important;color:#fff!important;cursor:not-allowed!important;opacity:1}.pam-action.disabled-action:hover{background:#c8c5dc!important}`;
const organizeStatusFilterCss = `.organize-status-filter{display:flex;align-items:flex-start;gap:14px;padding:14px 16px;background:linear-gradient(90deg,#fafaff,#f6f7ff);border-bottom:1px solid #edf0f5}.organize-status-filter>span{flex:0 0 auto;color:#65738d;font-size:12px;font-weight:700;line-height:29px}.organize-status-filter>div{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.organize-status-filter button{height:29px;border:1px solid #e1e5f1;border-radius:15px;background:#fff;color:#68758c;padding:0 10px 0 7px;display:inline-flex;align-items:center;gap:5px;font:12px "Microsoft YaHei";cursor:pointer;transition:.18s ease}.organize-status-filter button i{min-width:16px;height:16px;border-radius:8px;background:#f0f2f8;color:#78869c;font-size:10px;font-style:normal;display:grid;place-items:center}.organize-status-filter button:hover{border-color:#afa7f5;color:#5d54dc}.organize-status-filter button.active{background:#6259df;border-color:#6259df;color:#fff;box-shadow:0 3px 8px #6259df2e}.organize-status-filter button.active i{background:#ffffff2e;color:#fff}.organize-status-filter button.clear-filter{border-color:transparent;background:transparent;color:#7469df;padding:0 5px}.organize-status-filter button.clear-filter:hover{text-decoration:underline}@media(max-width:1250px){.organize-status-filter{gap:10px}.organize-status-filter>span{display:none}}`;
const deliberationStatusFilterCss = `.deliberation-status-filter{display:flex;align-items:flex-start;gap:14px;padding:14px 16px;background:linear-gradient(90deg,#fbfbff,#f7f8ff);border-bottom:1px solid #edf0f5}.deliberation-status-filter>span{flex:0 0 auto;color:#65738d;font-size:13px;font-weight:700;line-height:30px}.deliberation-status-filter>div{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.deliberation-status-filter button{height:30px;border:1px solid #e0e4f0;border-radius:16px;background:#fff;color:#64738d;padding:0 11px 0 7px;display:inline-flex;align-items:center;gap:6px;font:13px "Microsoft YaHei";cursor:pointer;transition:.18s ease}.deliberation-status-filter button i{min-width:18px;height:18px;border-radius:9px;background:#f1f3f9;color:#78869d;font-size:11px;font-style:normal;display:grid;place-items:center}.deliberation-status-filter button:hover{border-color:#aaa3ef;color:#5e55d3;background:#faf9ff}.deliberation-status-filter button.active{border-color:#655be0;background:#6257df;color:#fff;box-shadow:0 3px 9px #6257df30}.deliberation-status-filter button.active i{background:#ffffff2b;color:#fff}.deliberation-status-filter button.clear-filter{border-color:transparent;background:transparent;color:#7469df;padding:0 5px;font-size:12px}.deliberation-status-filter button.clear-filter:hover{text-decoration:underline}@media(max-width:1180px){.deliberation-status-filter{gap:10px}.deliberation-status-filter>span{display:none}}`;
const drawerModalCss = `.pam-overlay{overflow:hidden!important;overscroll-behavior:contain}.pam-modal,.pam-drawer{align-self:stretch!important;height:100%!important;max-height:100%!important;margin:0 0 0 auto!important;border-radius:0!important;overflow-x:hidden!important;overflow-y:auto!important;overscroll-behavior:contain!important;scrollbar-gutter:stable;background:#fff;box-shadow:-10px 0 30px #1d24572b!important}.pam-modal{width:min(900px,78vw)!important}.pam-drawer{width:min(720px,68vw)!important}.pam-modal>header,.pam-drawer>header{position:sticky!important;top:0!important;z-index:8!important;background:#fff;box-shadow:0 1px 0 #e7ebf2}.pam-modal>footer,.pam-drawer>footer{position:sticky!important;bottom:0!important;z-index:8!important;margin:0!important;background:#fff;box-shadow:0 -5px 16px #25355610}.pam-modal.organize-modal{width:min(1480px,calc(100vw - 44px))!important;height:100%!important;max-height:100%!important;border-radius:0!important}.pam-modal.organize-modal>footer{position:relative!important;bottom:auto!important}.pam-modal.organize-modal .organize-pane,.pam-modal.organize-modal>.organize-summary{overscroll-behavior:contain!important}.organize-audit-drawer{width:min(1080px,78vw)!important}.personal-drawer,.prereview-drawer{width:min(720px,68vw)!important}.execution-review-modal,.execution-modal{width:min(1180px,86vw)!important}.pam-modal::-webkit-scrollbar,.pam-drawer::-webkit-scrollbar{width:9px}.pam-modal::-webkit-scrollbar-thumb,.pam-drawer::-webkit-scrollbar-thumb{border:2px solid transparent;background:#b9c0cd;background-clip:padding-box;border-radius:10px}`;
const organizeFlowCss = `.pam-modal.organize-modal{grid-template-rows:auto auto auto minmax(0,1fr) auto!important}.pam-modal.organize-modal>.organize-scroll-content{min-height:0!important;overflow-y:auto!important;overscroll-behavior:contain!important}.pam-modal.organize-modal>.organize-scroll-content>.organize-body{min-height:auto!important;height:auto!important;max-height:none!important;overflow:visible!important}.pam-modal.organize-modal>.organize-scroll-content .organize-pane{min-height:0!important;overflow:visible!important;overscroll-behavior:auto!important}.pam-modal.organize-modal>.organize-scroll-content>.organize-summary{max-height:none!important;overflow:visible!important;padding:14px 20px 18px!important}.pam-modal.organize-modal>.organize-scroll-content>.organize-summary textarea{max-height:none!important}.prereview-suggestion-section{border-color:#d9d5ff!important}.prereview-suggestion-grid{display:grid;grid-template-columns:210px minmax(0,1fr);gap:0;padding:0 16px}.prereview-suggestion-grid label{padding:13px 0;display:flex;flex-direction:column;gap:6px}.prereview-suggestion-grid label+label{padding-left:18px;border-left:1px solid #edf0f5}.prereview-suggestion-grid span{color:#8895a9;font-size:12px}.prereview-suggestion-grid b{color:#485873;font-size:13px}.prereview-suggestion-grid p{margin:0;color:#596a84;font-size:13px;line-height:1.65}.audit-process-section{border-color:#d9e7dd!important}.audit-process-list{padding:6px 16px 14px}.audit-process-list article{position:relative;display:grid;grid-template-columns:28px minmax(0,1fr);gap:10px;padding:10px 0 12px}.audit-process-list article:not(:last-child):before{content:"";position:absolute;left:13px;top:36px;bottom:-1px;width:1px;background:#dbe5df}.audit-process-list i{width:27px;height:27px;border-radius:50%;display:grid;place-items:center;background:#eef6f0;color:#379269;font-style:normal;font-size:12px;font-weight:700;z-index:1}.audit-process-list article.revision i{background:#fff0f1;color:#d45d67}.audit-process-list article.current i{background:#21a36f;color:#fff;box-shadow:0 0 0 4px #e6f6ed}.audit-process-list b{display:block;color:#43536d;font-size:13px}.audit-process-list span{display:block;margin-top:3px;color:#8996a9;font-size:11px}.audit-process-list p{margin:6px 0 0;color:#61718a;font-size:12px;line-height:1.55}.process-revision-card,.process-change-card{margin-top:9px;border-radius:7px;overflow:hidden}.process-revision-card{border:1px solid #f1cdd0;background:#fff8f8}.process-change-card{border:1px solid #d7ebe0;background:#f8fcfa}.process-revision-card header,.process-change-card header{padding:8px 10px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #efdfe1}.process-change-card header{border-color:#dfeee5}.process-revision-card header b{color:#bd525d;font-size:12px}.process-change-card header b{color:#278d66;font-size:12px}.process-revision-card header span{margin:0;padding:2px 6px;border-radius:9px;background:#ffe7e9;color:#bf6470;font-size:10px}.process-change-card header span{margin:0;padding:2px 6px;border-radius:9px;background:#e5f8ed;color:#249369;font-size:10px}.process-revision-card>p{margin:0!important;padding:9px 10px;color:#77575d!important}.process-change-card>div{padding:2px 10px 6px}.process-change-card label{display:grid;grid-template-columns:82px minmax(0,1fr) minmax(0,1fr);gap:7px;padding:8px 0;border-bottom:1px dashed #dbece2;align-items:center}.process-change-card label:last-child{border-bottom:0}.process-change-card small{color:#74849a;font-size:11px}.process-change-card del{color:#d76b73;font-size:11px;text-decoration-color:#e9a6aa}.process-change-card ins{color:#1f976b;background:#eaf9f0;padding:2px 4px;border-radius:3px;font-size:11px;text-decoration:none}`;
const templatePreviewCss = `.template-preview-modal{width:min(1100px,calc(100vw - 56px));max-height:92vh;background:#f7f8fc;display:flex;flex-direction:column;overflow:hidden}.template-preview-intro{margin:14px 20px 12px;padding:12px 14px;display:flex;align-items:center;gap:10px;border:1px solid #ded9ff;border-radius:8px;background:#f5f3ff;color:#5d55d2}.template-preview-intro>div{display:flex;min-width:0;flex-direction:column;gap:3px}.template-preview-intro b{font-size:13px}.template-preview-intro span{color:#7c88a4;font-size:11px}.template-preview-intro .pam-status{margin-left:auto}.template-preview-fields{min-height:0;flex:1;margin:0 20px 14px;border:1px solid #e2e7f1;border-radius:8px;background:#fff;overflow:hidden;display:flex;flex-direction:column}.template-preview-fields>header{padding:13px 15px;display:flex;justify-content:space-between;border-bottom:1px solid #edf0f5}.template-preview-fields h3{margin:0;font-size:15px;color:#344562}.template-preview-fields p{margin:4px 0 0;color:#8996ab;font-size:12px}.template-preview-fields>header>span{color:#5e54df;font-size:12px;background:#f0efff;border-radius:12px;padding:5px 9px;height:max-content}.template-preview-table{overflow:auto}.template-preview-table table{width:100%;min-width:920px;border-collapse:collapse}.template-preview-table th{padding:10px 13px;background:#fafbfe;color:#7886a0;font-weight:500;font-size:12px;text-align:left;white-space:nowrap}.template-preview-table td{padding:11px 13px;border-top:1px solid #eef1f5;color:#53627a;font-size:12px;vertical-align:top;line-height:1.55}.template-preview-table td:nth-child(1){width:130px}.template-preview-table td:nth-child(2){width:155px}.template-preview-table td:nth-child(4){width:190px}.template-preview-table b,.template-preview-table small{display:block}.template-preview-table b{color:#41516c}.template-preview-table small{margin-top:3px;color:#8997aa;font-size:11px}.template-preview-table code{color:#5d55d1;background:#f1f0ff;padding:3px 5px;border-radius:4px;font:11px Consolas,monospace}.template-preview-table td:last-child span{display:block;color:#54637d}.template-preview-modal>footer{padding:13px 20px;border-top:1px solid #e4e8f1;background:#fff;display:flex;justify-content:flex-end}`;
const meetingFlowCss = `.meeting-modal{width:min(930px,calc(100vw - 56px));max-height:92vh;background:#f7f8fc;display:flex;flex-direction:column;overflow:auto}.meeting-banner{margin:14px 20px 12px;padding:12px 14px;display:flex;align-items:center;gap:10px;border:1px solid #ded9ff;border-radius:8px;background:#f5f3ff;color:#5d55d2}.meeting-banner>div{display:flex;flex-direction:column;gap:3px}.meeting-banner b{font-size:13px}.meeting-banner span{font-size:11px;color:#7e89a1}.meeting-banner .pam-status{margin-left:auto}.meeting-section{margin:0 20px 12px;background:#fff;border:1px solid #e2e7f1;border-radius:8px;overflow:hidden}.meeting-section>header{padding:12px 15px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #edf0f5}.meeting-section h3{margin:0;color:#344562;font-size:15px}.meeting-section>header>span{font-size:11px;color:#8390a5}.meeting-description p{margin:0;padding:13px 15px;color:#57677f;font-size:13px;line-height:1.75}.meeting-key-table{width:100%;border-collapse:collapse}.meeting-key-table th,.meeting-key-table td{padding:10px 15px;border-top:1px solid #edf0f5;text-align:left;font-size:12px}.meeting-key-table tr:first-child th,.meeting-key-table tr:first-child td{border-top:0}.meeting-key-table th{width:140px;background:#fafbfe;color:#7e8ca5;font-weight:500}.meeting-key-table td{color:#40516c}.meeting-files>div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;padding:11px 15px}.meeting-files .file{min-width:0;border:1px solid #e4e8f0;border-radius:6px;padding:9px 10px;background:#fbfcff;font-size:12px;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.meeting-modal>footer,.reminder-modal>footer{padding:13px 20px;background:#fff;border-top:1px solid #e4e8f1;display:flex;justify-content:flex-end;gap:8px}.attendee-form{display:grid;grid-template-columns:1fr 1.45fr;gap:18px;padding:15px}.attendee-form>label,.attendee-form>div{display:flex;flex-direction:column;gap:7px;color:#53627a;font-size:12px}.attendee-form input,.meeting-text textarea,.reminder-message textarea{width:100%;border:1px solid #dfe4ee;border-radius:6px;padding:9px;color:#465570;font:13px Microsoft YaHei;outline-color:#6257e5}.attendee-form>div>span{font-size:11px;color:#8c98ab}.voter-picks{display:flex;flex-wrap:wrap;gap:8px}.voter-picks button{border:1px solid #e0e5ef;border-radius:18px;background:#fff;color:#64728b;padding:5px 9px;display:flex;align-items:center;gap:5px;cursor:pointer}.voter-picks button:before{content:"";width:7px;height:7px;border-radius:50%;border:1px solid #aab4c5}.voter-picks button.selected{border-color:#9c93f4;background:#f1f0ff;color:#5d53d9}.voter-picks button.selected:before{background:#6157df;border-color:#6157df}.voter-picks small{font:12px Microsoft YaHei}.meeting-text textarea{display:block;margin:12px 15px;width:calc(100% - 30px);height:112px;resize:vertical;line-height:1.7}.reminder-modal{width:min(760px,calc(100vw - 56px));max-height:90vh;background:#f7f8fc;display:flex;flex-direction:column;overflow:hidden}.reminder-list{margin:16px 20px 12px;padding:14px;background:#fff;border:1px solid #e2e7f1;border-radius:8px}.reminder-list>b,.reminder-list>span{display:block}.reminder-list>b{color:#40516c}.reminder-list>span{margin-top:4px;color:#8995a8;font-size:12px}.reminder-list>div{display:flex;gap:10px;margin-top:13px}.reminder-list button{width:96px;border:1px solid #e2e6ef;border-radius:8px;background:#fbfcff;padding:10px 7px;display:flex;flex-direction:column;align-items:center;gap:4px;color:#4f5f78;cursor:pointer}.reminder-list button i{width:30px;height:30px;border-radius:50%;background:#eeeaff;color:#6258df;font-style:normal;display:grid;place-items:center}.reminder-list button b{font-size:12px}.reminder-list button small{font-size:10px;color:#bd801b}.reminder-list button.skip{opacity:.45;background:#f2f4f7;color:#929dad}.reminder-list button.skip i{background:#e4e7ed;color:#a0a8b4}.reminder-list button.skip small{color:#98a1af}.reminder-message{margin:0 20px 16px;background:#fff;border:1px solid #e2e7f1;border-radius:8px;overflow:hidden}.reminder-message>header{padding:12px 14px;display:flex;justify-content:space-between;border-bottom:1px solid #edf0f5}.reminder-message h3{margin:0;color:#40516c;font-size:14px}.reminder-message span{font-size:11px;color:#7e88a1}.reminder-message textarea{display:block;margin:12px 14px;width:calc(100% - 28px);height:100px;line-height:1.7;resize:vertical}`;
const deliberationSetupCss = `.deliberation-setup-modal{width:min(980px,78vw)!important;background:#f7f8fc}.deliberation-template,.deliberation-skill{margin:14px 20px 0;padding:12px 14px;border:1px solid #ded9ff;border-radius:8px;background:#f5f3ff;color:#5d55d2;display:flex;align-items:center;gap:10px}.deliberation-template>div,.deliberation-skill>div>div{min-width:0;display:flex;flex:1;flex-direction:column;gap:3px}.deliberation-template b,.deliberation-skill b{font-size:13px}.deliberation-template span,.deliberation-skill span{font-size:11px;color:#7b87a1}.deliberation-template .link{border:0;background:transparent;color:#5d55d2;cursor:pointer}.deliberation-skill{display:block;background:#fff}.deliberation-skill>div{display:flex;align-items:center;gap:9px}.deliberation-skill .plain{position:absolute;right:34px;margin-top:-35px;padding:6px 10px;font-size:12px}.deliberation-skill textarea{width:100%;height:72px;margin-top:10px;border:1px solid #d8d5f5;border-radius:6px;padding:8px;color:#465570;font:12px/1.55 Microsoft YaHei;resize:vertical}.deliberation-section{margin:14px 20px 0;border:1px solid #e1e6ef;border-radius:8px;background:#fff;overflow:hidden}.deliberation-section>header{padding:12px 14px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #edf0f5}.deliberation-section h3{margin:0;color:#35455f;font-size:15px}.deliberation-section header p{margin:4px 0 0;color:#8996a9;font-size:12px}.deliberation-type-picks{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding:12px 14px}.deliberation-type-picks button{min-height:67px;border:1px solid #e1e6ef;border-radius:7px;background:#fff;color:#4f6079;padding:10px 12px;text-align:left;cursor:pointer}.deliberation-type-picks button.active{border-color:#857be9;background:#f3f1ff;color:#584fd1;box-shadow:0 2px 7px #6257e51a}.deliberation-type-picks b,.deliberation-type-picks small{display:block}.deliberation-type-picks b{font-size:13px}.deliberation-type-picks small{margin-top:5px;font-size:11px;line-height:1.45;color:#8491a6}.deliberation-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;padding:14px}.deliberation-form-grid label{display:flex;min-width:0;flex-direction:column;gap:6px;color:#687790;font-size:12px}.deliberation-form-grid label.wide{grid-column:span 2}.deliberation-form-grid input,.deliberation-form-grid select{height:34px;border:1px solid #dfe5ee;border-radius:6px;padding:0 9px;background:#fff;color:#465570;font:12px Microsoft YaHei;outline-color:#6257e5}.deliberation-form-grid .voter-picks{gap:6px}.deliberation-form-grid .voter-picks button{border:1px solid #e0e5ef;border-radius:14px;background:#fff;color:#66758d;padding:5px 9px;cursor:pointer;font:11px Microsoft YaHei}.deliberation-form-grid .voter-picks button.selected{border-color:#a097ef;background:#f1f0ff;color:#5d53d9}.generated-deliberation{margin-bottom:78px}.generated-deliberation header .plain{padding:6px 10px;font-size:12px}.generated-fields{display:grid;grid-template-columns:1fr 1fr;gap:0 14px;padding:4px 14px 12px}.generated-fields article{padding:10px 0;border-bottom:1px solid #edf0f5;display:flex;flex-direction:column;gap:5px}.generated-fields article:last-child{grid-column:span 2}.generated-fields span{color:#8794a9;font-size:11px}.generated-fields b{color:#4b5a73;font-size:12px;line-height:1.55}.deliberation-preview{margin:0 14px 14px;border:1px solid #f0d5be;border-radius:7px;overflow:hidden;background:#fffdf9}.deliberation-preview header{padding:9px 11px;display:flex;justify-content:space-between;background:#fff6ed;color:#a45928;font-size:12px}.deliberation-preview header span{font-size:11px;color:#c17b4e}.deliberation-preview textarea{display:block;width:100%;min-height:210px;border:0;padding:12px;color:#4d596f;font:13px/1.8 Microsoft YaHei;outline:0;resize:vertical}.deliberation-setup-modal>footer{position:sticky!important;bottom:0;background:#fff}`;
const deliberationSetupOverridesCss = `.deliberation-setup-modal>.deliberation-skill{width:calc(100% - 40px);display:flex;box-sizing:border-box;text-align:left;cursor:pointer;appearance:none}.deliberation-setup-modal>.deliberation-skill>div{min-width:0;display:flex;flex:1;flex-direction:column;gap:3px}.deliberation-setup-modal>.deliberation-skill>svg:last-child{color:#9a91e9}.deliberation-generate{display:inline-flex;align-items:center;gap:5px;padding:7px 11px;font-size:12px;white-space:nowrap}.deliberation-content-input{display:block;box-sizing:border-box;width:calc(100% - 28px);min-height:230px;margin:14px;border:1px solid #dfe5ee;border-radius:7px;padding:12px;color:#465570;font:13px/1.75 Microsoft YaHei;outline-color:#6257e5;resize:vertical}.deliberation-content-input::placeholder{color:#a3adbd}.deliberation-skill-overlay{position:absolute;inset:0;z-index:10;display:flex;align-items:center;justify-content:center;background:#17233d66}.deliberation-skill-dialog{width:min(580px,calc(100% - 48px));border-radius:10px;background:#fff;box-shadow:0 20px 55px #17233d55;overflow:hidden}.deliberation-skill-dialog>header{padding:18px 20px;border-bottom:1px solid #edf0f5;display:flex;justify-content:space-between}.deliberation-skill-dialog h3{margin:4px 0;color:#35455f;font-size:17px}.deliberation-skill-dialog p,.deliberation-skill-dialog small{margin:0;color:#8794a9;font-size:12px}.deliberation-skill-dialog>header>button{height:30px;border:0;background:transparent;color:#8591a5;cursor:pointer}.deliberation-skill-dialog>textarea{box-sizing:border-box;display:block;width:calc(100% - 40px);min-height:160px;margin:16px 20px;border:1px solid #dfe5ee;border-radius:7px;padding:11px;color:#465570;font:13px/1.65 Microsoft YaHei;outline-color:#6257e5;resize:vertical}.deliberation-skill-dialog>footer{display:flex;justify-content:flex-end;gap:10px;padding:12px 20px;border-top:1px solid #edf0f5;background:#fbfcfe}`;
const deliberationSetupPolishCss = `.deliberation-setup-modal{overscroll-behavior:contain!important}.generated-deliberation{background:#fff;border-color:#e3e8f1!important}.generated-deliberation>header{padding:15px 16px 11px!important;border-bottom:0!important}.generated-deliberation h3{font-size:16px!important;letter-spacing:.1px}.generated-deliberation header p{margin-top:5px!important}.deliberation-content-toolbar{margin:0 14px;padding:10px 12px;border:1px solid #e3e4fb;border-radius:7px;background:linear-gradient(90deg,#f8f7ff,#fcfcff);display:flex;align-items:center;justify-content:space-between;gap:12px}.deliberation-content-toolbar>span{display:flex;align-items:center;gap:6px;color:#7772bd;font-size:12px}.deliberation-content-toolbar>span svg{color:#746ae0}.deliberation-generate{flex:0 0 auto;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:6px!important;min-width:98px!important;height:32px!important;padding:0 12px!important;border:1px solid #6257df!important;border-radius:6px!important;background:#6257df!important;color:#fff!important;font:600 12px Microsoft YaHei!important;box-shadow:0 3px 8px #6257df2e!important;cursor:pointer!important;transition:background .18s ease,transform .18s ease,box-shadow .18s ease}.deliberation-generate:hover{background:#5147cf!important;box-shadow:0 5px 12px #6257df3d!important;transform:translateY(-1px)}.deliberation-generate:active{transform:translateY(0)}.deliberation-content-input{width:calc(100% - 28px)!important;min-height:250px!important;max-height:380px!important;margin:12px 14px 14px!important;border-color:#dfe5ef!important;background:#fbfcff!important;box-shadow:inset 0 1px 2px #36486908!important;overscroll-behavior:contain!important;scrollbar-gutter:stable;line-height:1.8!important}.deliberation-content-input:focus{border-color:#8f86ea!important;background:#fff!important;box-shadow:0 0 0 3px #6257df12!important}.deliberation-content-input::-webkit-scrollbar{width:8px}.deliberation-content-input::-webkit-scrollbar-thumb{border:2px solid transparent;border-radius:8px;background:#b6becb;background-clip:padding-box}`;
const deliberationResultCss = `.deliberation-result-modal,.announcement-modal{width:min(820px,72vw)!important;background:#f7f8fc}.deliberation-info-card{margin:16px 20px 0;padding:13px 14px;border:1px solid #dfe3f2;border-radius:8px;background:#fff}.deliberation-info-card>b{display:block;color:#42516c;font-size:14px}.deliberation-info-card>div{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px 16px;margin-top:10px}.deliberation-info-card span{color:#6d7b91;font-size:12px}.vote-progress header>b{border-radius:12px;background:#fff3d9;color:#bc841e;padding:4px 8px;font-size:11px}.vote-progress-track{height:8px;margin:15px 14px 8px;border-radius:8px;background:#e9edf4;overflow:hidden}.vote-progress-track i{display:block;height:100%;border-radius:8px;background:linear-gradient(90deg,#6d63df,#8b80eb)}.vote-voters{padding:0 14px 14px;display:flex;justify-content:space-between;gap:10px;color:#7e8b9d;font-size:11px}.deliberation-waiting{margin:14px 20px 78px;padding:13px 14px;border:1px solid #e1ddfb;border-radius:8px;background:#f5f4ff;display:flex;gap:9px;color:#6056d4}.deliberation-waiting div{display:flex;flex-direction:column;gap:4px}.deliberation-waiting b{font-size:13px}.deliberation-waiting span{color:#7f8aa1;font-size:12px;line-height:1.5}.deliberation-outcome{margin:14px 20px 0;padding:13px 14px;border-radius:8px;display:flex;flex-direction:column;gap:5px}.deliberation-outcome.pass{border:1px solid #bfe5d0;background:#f1fbf5;color:#22875f}.deliberation-outcome.reject{border:1px solid #f0c9cd;background:#fff6f6;color:#c35d66}.deliberation-outcome b{font-size:15px}.deliberation-outcome span{color:#65768b;font-size:12px}.leader-advice{margin-bottom:78px}.leader-advice>p{margin:0;padding:13px 14px;color:#53637b;font-size:13px;line-height:1.7}.meeting-end-confirm{width:min(500px,calc(100vw - 44px))!important;align-self:center!important;height:auto!important;max-height:460px!important;margin:auto!important;border-radius:10px!important}.meeting-end-confirm>section{padding:18px 20px;display:flex;gap:11px;color:#655bdd}.meeting-end-confirm>section p{margin:0;color:#697890;font-size:13px;line-height:1.7}.outcome-choices{display:flex;gap:10px;padding:14px}.outcome-choices button{display:flex;align-items:center;gap:6px;padding:9px 15px;border:1px solid #dfe5ee;border-radius:7px;background:#fff;color:#65758c;font:13px Microsoft YaHei;cursor:pointer}.outcome-choices button.pass.selected{border-color:#5fba88;background:#f1fbf5;color:#21895e}.outcome-choices button.reject.selected{border-color:#e5949c;background:#fff4f5;color:#c45b65}.advice-entry{display:flex;flex-direction:column;gap:7px;padding:0 14px 14px;color:#687790;font-size:12px}.advice-entry textarea{min-height:120px;border:1px solid #dfe5ee;border-radius:7px;padding:10px;color:#465570;font:13px/1.65 Microsoft YaHei;resize:vertical;outline-color:#6257e5;overscroll-behavior:contain}.announcement-skill{margin:16px 20px 0;padding:12px 14px;border:1px solid #dedaff;border-radius:8px;background:#f5f4ff;color:#5f55d3;display:flex;gap:9px;align-items:flex-start}.announcement-skill div{display:flex;flex-direction:column;gap:4px}.announcement-skill b{font-size:13px}.announcement-skill span{color:#7f89a3;font-size:11px}.announcement-body{margin:14px 20px 78px;border:1px solid #e1e6ef;border-radius:8px;background:#fff;overflow:hidden}.announcement-body article,.announcement-body label{display:flex;flex-direction:column;gap:6px;padding:13px 14px;border-top:1px solid #edf0f5}.announcement-body article:first-child{border-top:0}.announcement-body span,.announcement-body label{color:#8794a8;font-size:11px}.announcement-body p{margin:0;color:#50607a;font-size:13px;line-height:1.65}.announcement-body select{height:34px;border:1px solid #dfe5ee;border-radius:6px;background:#fff;color:#485872;padding:0 9px;font:12px Microsoft YaHei;outline-color:#6257e5}.announcement-preview{background:#fbfcff}.announcement-preview textarea{min-height:150px;border:1px solid #dfe5ee;border-radius:7px;padding:10px;color:#4a5a73;background:#fff;font:12px/1.7 Microsoft YaHei;resize:vertical;outline-color:#6257e5;overscroll-behavior:contain}`;
const announcementNoticeCss = `.announcement-body>header{padding:13px 14px;border-bottom:1px solid #edf0f5}.announcement-body>header h3{margin:0;color:#42516c;font-size:14px}.announcement-body>header p{margin:4px 0 0;color:#8794a8;font-size:11px}.announcement-fields{display:grid;grid-template-columns:1fr 1fr}.announcement-fields article{min-height:54px;border-top:1px solid #edf0f5!important}.announcement-fields article:nth-child(even){border-left:1px solid #edf0f5}.announcement-fields article:nth-child(5),.announcement-fields article:nth-child(6){grid-column:span 2;border-left:0}.announcement-fields b{color:#4c5c75;font-size:12px;line-height:1.55}.announcement-group{border-top:1px solid #edf0f5}.announcement-group select{margin-top:2px}`;
const announcementNoticePolishCss = `.announcement-body{border-color:#e5e9f0!important;background:#fbfcfe!important}.announcement-body>header{padding:11px 14px!important;background:#fff!important}.announcement-body>header h3{color:#627087!important;font-size:13px!important;font-weight:600}.announcement-body>header p{display:none}.announcement-fields{background:#fff}.announcement-fields article{min-height:44px!important;padding:9px 13px!important;gap:3px!important}.announcement-fields span{color:#98a3b3!important;font-size:11px!important}.announcement-fields b{color:#60708a!important;font-size:12px!important;font-weight:400!important}.announcement-fields article:nth-child(6){background:#fafbfe}.announcement-preview{margin:14px!important;border:1px solid #d8d5fa!important;border-radius:8px!important;background:#fff!important;box-shadow:0 3px 12px #4941a70d}.announcement-preview>span{display:flex;align-items:center;gap:7px;color:#4f48b9!important;font-size:14px!important;font-weight:700}.announcement-preview>span:before{content:"";display:block;width:3px;height:15px;border-radius:2px;background:#665bdd}.announcement-preview textarea{min-height:270px!important;border-color:#e2e5ef!important;background:#fff!important;color:#3f506a!important;font:13px/1.85 Microsoft YaHei!important}.announcement-group{margin:0 14px 14px!important;padding:11px 0 0!important;border-top:1px solid #edf0f5!important;color:#687792!important;font-size:12px!important}.announcement-group select{margin-top:6px!important}`;
const deliberationVoterSelectCss = `.deliberation-form-grid .voter-selected-list{grid-column:span 2;display:flex;align-items:flex-start;gap:12px;margin-top:-3px;padding:9px 10px;border:1px dashed #d9d7f6;border-radius:7px;background:#fbfbff}.voter-selected-list>span{flex:0 0 auto;color:#77839a;font-size:12px;line-height:29px}.voter-selected-list>div{display:flex;flex-wrap:wrap;gap:8px}.voter-selected-list button{height:29px;border:1px solid #a59eff;border-radius:15px;background:#f7f6ff;color:#6259df;padding:0 10px;display:inline-flex;align-items:center;gap:6px;font:12px Microsoft YaHei;cursor:pointer;transition:.18s ease}.voter-selected-list button:hover{border-color:#8076eb;background:#efeeff}.voter-selected-list button i{width:9px;height:9px;border-radius:50%;background:#655ae1;box-shadow:0 0 0 2px #e5e2ff;font-style:normal}`;
const deliberationOutcomePolishCss = `.deliberation-info-card.compact{margin-bottom:0}.outcome-tip{margin:14px 20px 78px;padding:12px 14px;border:1px solid #e4e1fb;border-radius:8px;background:#f7f6ff;display:flex;align-items:center;gap:8px;color:#665bdd;font-size:12px}.outcome-tip span{color:#77859b;line-height:1.55}.vote-progress header>b.done{background:#e9f8ef;color:#238960}`;
const sheetSkillOverviewCss = `.sheet-skill-overview{margin:0 0 14px;border:1px solid #dde3ef;border-radius:9px;background:#fff;display:flex;align-items:center;justify-content:space-between;gap:20px;padding:13px 16px;box-shadow:0 2px 8px #31456508}.sheet-skill-overview>div{display:flex;align-items:baseline;gap:9px;min-width:210px}.sheet-skill-overview>div span{color:#5e55d4;font-size:12px;font-weight:700}.sheet-skill-overview>div b{color:#40516b;font-size:15px}.sheet-skill-overview>div small{color:#8a96a8;font-size:11px}.sheet-skill-overview>section{display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap}.sheet-skill-overview button{height:30px;border:1px solid #dedbfa;border-radius:15px;background:#f8f7ff;color:#6259d8;padding:0 9px;display:inline-flex;align-items:center;gap:5px;font:12px Microsoft YaHei;cursor:pointer;transition:.18s}.sheet-skill-overview button:hover{border-color:#9289ea;background:#f0efff;transform:translateY(-1px)}.sheet-skill-preview{width:min(570px,calc(100vw - 44px))!important;align-self:center!important;height:auto!important;max-height:470px!important;margin:auto!important;border-radius:10px!important}.sheet-skill-preview>section{margin:16px 20px 22px;padding:14px;border:1px solid #dedaff;border-radius:8px;background:#f6f5ff;display:flex;gap:10px;color:#6158d7}.sheet-skill-preview section div{display:flex;flex-direction:column;gap:5px}.sheet-skill-preview section b{font-size:13px}.sheet-skill-preview section p{margin:0;color:#687791;font-size:13px;line-height:1.65}.sheet-skill-preview>footer{padding:12px 20px;display:flex;justify-content:flex-end}@media(max-width:1300px){.sheet-skill-overview{align-items:flex-start;flex-direction:column}.sheet-skill-overview>section{justify-content:flex-start}}`;
const organizeAuditSkillCss = `.audit-skill-analysis{margin-bottom:78px!important;border-color:#ded9ff!important}.audit-skill-analysis h3{display:flex;align-items:center;gap:6px;color:#5c53d5!important}.audit-skill-analysis>div{padding:2px 14px 10px}.audit-skill-analysis article{padding:10px 0;border-bottom:1px solid #edf0f5}.audit-skill-analysis article:last-child{border-bottom:0}.audit-skill-analysis article b{color:#4a5972;font-size:12px}.audit-skill-analysis article p{margin:5px 0 0;color:#66768e;font-size:12px;line-height:1.65}`;
const organizeAuditSkillEditableCss = `.audit-skill-analysis textarea{display:block;box-sizing:border-box;width:100%;min-height:178px;border:1px solid #dfe3ef;border-radius:7px;padding:11px;background:#fbfcff;color:#4f5f78;font:13px/1.72 Microsoft YaHei;resize:vertical;outline-color:#6257df;overscroll-behavior:contain}`;
const skillContextGuideCss = `.skill-context-guide{margin:14px 16px 0;border:1px solid #dfdef7;border-radius:8px;background:#fafaff;display:grid;grid-template-columns:1fr 1.35fr 1fr;overflow:hidden}.skill-context-guide>div{min-width:0;padding:12px 14px;border-left:1px solid #e7e6f7;display:flex;flex-direction:column;gap:6px}.skill-context-guide>div:first-child{border-left:0}.skill-context-guide span{color:#8a96a9;font-size:11px}.skill-context-guide b{color:#4c5b75;font-size:12px;line-height:1.55}.skill-context-guide small{color:#77859c;font-size:11px;line-height:1.5}.skill-context-guide p{display:flex;flex-wrap:wrap;gap:5px;margin:0}.skill-context-guide i{border-radius:10px;background:#efeeff;color:#6359d7;padding:3px 7px;font-size:10px;font-style:normal}@media(max-width:1100px){.skill-context-guide{grid-template-columns:1fr}.skill-context-guide>div{border-left:0;border-top:1px solid #e7e6f7}.skill-context-guide>div:first-child{border-top:0}}`;
const skillWritingGuideCss = `.pam-skill-layout aside .skill-group{padding:12px 10px 7px;border-bottom:1px solid #edf0f5}.pam-skill-layout aside .skill-group:last-child{border-bottom:0}.skill-group>b{display:block;color:#5964a8;font-size:12px}.skill-group>small{display:block;margin:4px 0 7px;color:#9aa4b3;font-size:10px}.skill-writing-guide{margin:14px 16px 0;border:1px solid #e1e5f0;border-radius:8px;background:#fbfcff;display:grid;grid-template-columns:1fr 1fr;overflow:hidden}.skill-writing-guide>div{min-width:0;padding:12px 14px;border-left:1px solid #edf0f5;border-top:1px solid #edf0f5;display:flex;flex-direction:column;gap:6px}.skill-writing-guide>div:nth-child(-n+2){border-top:0}.skill-writing-guide>div:nth-child(odd){border-left:0}.skill-writing-guide span{color:#8a96a9;font-size:11px}.skill-writing-guide b,.skill-writing-guide p{margin:0;color:#52627b;font-size:12px;line-height:1.62}.skill-writing-guide p{display:flex;flex-wrap:wrap;gap:5px}.skill-writing-guide i{border-radius:10px;background:#f0efff;color:#6259d7;padding:3px 7px;font-size:10px;font-style:normal}@media(max-width:1000px){.skill-writing-guide{grid-template-columns:1fr}.skill-writing-guide>div{border-left:0!important}.skill-writing-guide>div:nth-child(2){border-top:1px solid #edf0f5}}`;
const skillWritingGuideRefinedCss = `.skill-writing-guide{display:block!important;background:#fff!important}.skill-writing-guide>header{padding:13px 15px;display:flex;align-items:flex-start;gap:9px;border-bottom:1px solid #edf0f5;background:linear-gradient(90deg,#f7f6ff,#fcfcff);color:#6259d7}.skill-writing-guide>header div{display:flex;flex-direction:column;gap:4px}.skill-writing-guide>header b{color:#4d55a0;font-size:14px}.skill-writing-guide>header p{margin:0;color:#6d7c93;font-size:12px;line-height:1.55}.skill-writing-guide-body{display:grid;grid-template-columns:1fr 1.2fr 1.5fr}.skill-writing-guide-body article{min-width:0;padding:13px 14px;border-left:1px solid #edf0f5;display:flex;flex-direction:column;gap:7px}.skill-writing-guide-body article:first-child{border-left:0}.skill-writing-guide-body span{color:#8a96a9;font-size:11px}.skill-writing-guide-body b,.skill-writing-guide-body p{margin:0;color:#52627b;font-size:12px;line-height:1.62}.skill-writing-guide-body p{display:flex;flex-wrap:wrap;gap:5px}.skill-writing-guide-body i{border-radius:10px;background:#f0efff;color:#6259d7;padding:3px 7px;font-size:10px;font-style:normal}@media(max-width:1000px){.skill-writing-guide-body{grid-template-columns:1fr}.skill-writing-guide-body article{border-left:0;border-top:1px solid #edf0f5}.skill-writing-guide-body article:first-child{border-top:0}}`;
const skillWritingGuidePlainCss = `.skill-writing-guide{margin:14px 16px 0!important;border:0!important;border-top:1px solid #edf0f5!important;border-radius:0!important;background:transparent!important}.skill-writing-guide>header{padding:13px 0 7px!important;border:0!important;background:transparent!important;color:inherit!important}.skill-writing-guide>header>svg{display:none}.skill-writing-guide>header b{color:#52627b!important;font-size:13px!important}.skill-writing-guide>header p{color:#78879b!important;font-size:12px!important}.skill-writing-guide-body{display:block!important}.skill-writing-guide-body article{padding:9px 0!important;border:0!important;display:grid!important;grid-template-columns:112px minmax(0,1fr)!important;gap:10px!important}.skill-writing-guide-body span{color:#8995a8!important;font-size:12px!important}.skill-writing-guide-body b,.skill-writing-guide-body p{color:#52627b!important;font-size:12px!important;line-height:1.6!important}.skill-writing-guide-body p{display:flex!important;align-items:flex-start;gap:5px!important}.skill-writing-guide-body i{border-radius:3px!important;background:#f4f5f8!important;color:#66758c!important;padding:2px 5px!important;font-size:11px!important}`;
const taskFlowCss = `.task-flow-card{min-height:410px}.task-template-admin{margin-top:15px;overflow:hidden}.task-template-admin>header{padding:14px 16px}.task-template-admin>header h2{margin:0;color:#344562;font-size:17px}.task-template-admin>header p{margin:5px 0 0;color:#8996ab;font-size:12px}.task-template-layout{display:grid;grid-template-columns:290px minmax(0,1fr);border-top:1px solid #edf0f5}.task-template-layout>aside{background:#fafbfe;border-right:1px solid #e8ebf2}.task-template-layout>aside button{width:100%;min-height:75px;padding:12px 14px;display:flex;gap:9px;align-items:center;border:0;border-bottom:1px solid #e9edf3;background:transparent;color:#65738b;text-align:left;cursor:pointer}.task-template-layout>aside button.selected{background:#f1efff;color:#5e53d9}.task-template-layout>aside span:nth-child(2){flex:1;min-width:0}.task-template-layout>aside b,.task-template-layout>aside small{display:block}.task-template-layout>aside b{font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#40516c}.task-template-layout>aside small{margin-top:5px;color:#8996aa;font-size:11px}.task-template-editor{min-width:0}.task-template-editor>header{padding:14px 16px;display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.task-template-editor h3{margin:0;color:#40516c;font-size:16px}.task-template-editor p{margin:5px 0 0;color:#8995a8;font-size:12px}.task-node-head{padding:0 16px 10px;display:flex;align-items:center;gap:7px}.task-node-head b{font-size:14px;color:#42516b}.task-node-head span{font-size:11px;color:#8d99ab}.task-node-head button{margin-left:auto;padding:6px 10px;font-size:12px}.task-node-table{margin:0 16px 16px;border:1px solid #e2e7f1;border-radius:7px;overflow:auto}.task-node-row{min-width:720px;display:grid;grid-template-columns:1.45fr 1.1fr .8fr .7fr .92fr 44px;gap:8px;align-items:center;padding:9px 11px;border-top:1px solid #edf0f5;color:#4d5d76;font-size:12px}.task-node-row:first-child{border-top:0}.task-node-label{background:#fafbfe;color:#7d89a1;font-size:11px}.task-node-row b{font-size:12px;color:#40516c}.task-node-row input,.task-node-row select{min-width:0;height:30px;box-sizing:border-box;border:1px solid #dfe4ee;border-radius:5px;padding:0 7px;color:#465570;background:#fff;font:12px Microsoft YaHei;outline-color:#6257e5}.task-node-row .remove-field{border:0;background:transparent;color:#d15d68;font:12px Microsoft YaHei;cursor:pointer}.task-template-editor>footer{padding:12px 16px;border-top:1px solid #edf0f5;display:flex;justify-content:flex-end;gap:8px}.task-modal{width:min(1120px,calc(100vw - 48px));height:min(91vh,900px);max-height:91vh;background:#f7f8fc;display:flex;flex-direction:column;overflow:hidden}.task-modal-scroll{min-height:0;overflow:auto;padding:14px 20px 78px;overscroll-behavior:contain}.task-modal>footer,.approval-progress-modal>footer{padding:13px 20px;background:#fff;border-top:1px solid #e4e8f1;display:flex;justify-content:flex-end;gap:8px}.task-form-section{margin-bottom:13px;border:1px solid #e2e7f1;border-radius:8px;background:#fff;overflow:hidden}.task-form-section>header{padding:12px 14px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;border-bottom:1px solid #edf0f5}.task-form-section h3{margin:0;color:#3f4f6a;font-size:15px}.task-form-section p{margin:4px 0 0;color:#8996a8;font-size:12px;line-height:1.5}.task-rule-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:14px;padding:14px}.task-rule-grid label{display:flex;flex-direction:column;gap:7px;color:#687792;font-size:12px}.task-rule-grid select{height:34px;border:1px solid #dfe4ee;border-radius:6px;padding:0 9px;background:#fff;color:#465570;font:13px Microsoft YaHei;outline-color:#6257e5}.task-form-table{overflow:auto}.task-form-row{display:grid;grid-template-columns:1.5fr 1.1fr .82fr .72fr .9fr 42px;gap:8px;min-width:820px;padding:9px 13px;border-top:1px solid #edf0f5;align-items:center}.task-form-label{border-top:0;background:#fafbfe;color:#7c89a0;font-size:11px}.task-form-row input,.task-form-row select{min-width:0;height:32px;box-sizing:border-box;border:1px solid #dfe4ee;border-radius:5px;padding:0 8px;color:#465570;background:#fff;font:12px Microsoft YaHei;outline-color:#6257e5}.task-form-row .remove-field{border:0;background:transparent;color:#d45d67;font:12px Microsoft YaHei;cursor:pointer}.task-archive{display:flex;align-items:center;gap:10px;padding:13px 14px;border:1px solid #dcd8ff;border-radius:8px;background:#f5f4ff;color:#5c54d6}.task-archive>div{display:flex;min-width:0;flex:1;flex-direction:column;gap:4px}.task-archive b{font-size:13px}.task-archive span{color:#7c88a1;font-size:11px;line-height:1.45}.task-archive .plain{white-space:nowrap;font-size:12px}.task-choice-row{display:flex;gap:10px;padding:14px}.task-choice-row button{padding:9px 13px;border:1px solid #dfe4ed;border-radius:7px;background:#fff;color:#5d6b84;font:13px Microsoft YaHei;cursor:pointer}.task-choice-row button.selected{border-color:#8f86ef;background:#f1efff;color:#5a50d4;font-weight:700}.approval-choice>label{display:block;padding:14px;color:#506079;font-size:13px}.approval-choice input{margin-right:7px;accent-color:#6257e5}.task-minutes{display:block;width:calc(100% - 28px);height:112px;box-sizing:border-box;margin:13px 14px 7px;padding:10px;border:1px solid #dfe4ee;border-radius:6px;color:#465570;font:13px/1.65 Microsoft YaHei;outline-color:#6257e5;resize:vertical}.generated-mark{display:block;margin:0 14px 13px;color:#5e54d6;font-size:11px}.task-assignment-list{padding:0 14px 8px}.task-assignment-list article{display:grid;grid-template-columns:minmax(160px,1.3fr) minmax(130px,1fr) minmax(180px,1.25fr);gap:12px;align-items:center;padding:11px 0;border-top:1px solid #edf0f5;color:#52617a;font-size:12px}.task-assignment-list article:first-child{border-top:0}.task-assignment-list b{color:#41516b;font-size:13px}.task-assignment-list small{color:#8490a4}.approval-progress-modal{width:min(650px,calc(100vw - 48px));background:#f7f8fc}.approval-progress{margin:16px 20px 22px;padding:5px 0 5px 18px;border-left:2px solid #ded9ff}.approval-progress article{position:relative;display:flex;align-items:flex-start;gap:11px;padding:12px 0 18px}.approval-progress article:last-child{padding-bottom:4px}.approval-progress i{position:absolute;left:-29px;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;background:#edf0f5;color:#8b97a9;font-style:normal;font-size:11px}.approval-progress article.done i{background:#5f55dd;color:#fff}.approval-progress article.active i{background:#fff2d7;color:#cc8b1e;border:2px solid #f3c268;box-sizing:border-box}.approval-progress b,.approval-progress span{display:block}.approval-progress b{font-size:14px;color:#40516c}.approval-progress span{margin-top:5px;color:#8996a9;font-size:12px}`;
const executionCss = `.execution-card{min-height:410px}.execution-modal,.execution-review-modal,.archive-modal{background:#f7f8fc;display:flex;flex-direction:column;overflow:hidden}.execution-modal{width:min(940px,calc(100vw - 48px));height:min(88vh,820px)}.execution-review-modal{width:min(1160px,calc(100vw - 48px));height:min(91vh,900px)}.archive-modal{width:min(820px,calc(100vw - 48px));max-height:88vh}.execution-scroll,.execution-review-scroll{min-height:0;flex:1;overflow:auto;padding:15px 20px 24px;overscroll-behavior:contain}.execution-modal>footer,.execution-review-modal>footer,.archive-modal>footer{flex:0 0 auto;padding:13px 20px;border-top:1px solid #e4e8f1;background:#fff;display:flex;justify-content:flex-end;gap:8px}.execution-summary{display:flex;align-items:center;gap:12px;padding:12px 14px;border:1px solid #dcd8ff;border-radius:8px;background:#f3f1ff;color:#5862b6}.execution-summary>div{display:flex;align-items:center;gap:8px}.execution-summary b{font-size:13px;color:#4b5192}.execution-summary>span{font-size:12px;color:#7e89a5}.execution-nodes,.execution-revision,.execution-node-info,.conversation-summary,.archive-content,.archive-files{margin-top:13px;border:1px solid #e2e7f1;border-radius:8px;background:#fff;overflow:hidden}.execution-nodes>header,.execution-node-info>header,.conversation-summary>header,.execution-revision>header,.archive-content>header,.archive-files>header{padding:12px 14px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;border-bottom:1px solid #edf0f5}.execution-nodes h3,.execution-node-info h3,.conversation-summary h3,.execution-revision h3,.archive-content h3,.archive-files h3{margin:0;color:#40516c;font-size:15px}.execution-nodes header p,.execution-node-info header p,.conversation-summary header p{margin:4px 0 0;color:#8996a8;font-size:12px}.execution-nodes article{position:relative;display:flex;gap:12px;padding:13px 15px 14px 35px;border-top:1px solid #edf0f5}.execution-nodes article:first-of-type{border-top:0}.execution-nodes article:before{content:"";position:absolute;left:25px;top:34px;bottom:-14px;width:2px;background:#e1e5ef}.execution-nodes article:last-child:before{display:none}.execution-nodes article>i{position:absolute;z-index:1;left:15px;top:14px;width:21px;height:21px;border-radius:50%;display:grid;place-items:center;background:#e9edf4;color:#8491a5;font-style:normal;font-size:11px}.execution-nodes article.done>i{background:#6157df;color:#fff}.execution-nodes article.active>i{background:#fff3d8;color:#cc8d1e;border:2px solid #efc56d}.execution-nodes article>div{display:flex;min-width:0;flex:1;flex-direction:column;gap:5px}.execution-nodes b{color:#41516c;font-size:13px}.execution-nodes span{color:#71809a;font-size:12px}.execution-nodes small{color:#9aa5b6;font-size:11px}.node-evidence{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-top:3px;color:#5e54d6}.node-evidence span{padding:4px 7px;border:1px solid #dfdcff;border-radius:5px;background:#f5f3ff;color:#5d54d2;font-size:11px}.execution-revision>div{padding:13px 15px}.execution-revision b{display:block;color:#4b5b74;font-size:12px}.execution-revision label{display:block;margin-top:10px;color:#8996a9;font-size:11px}.execution-revision p{margin:4px 0 0;color:#53627b;font-size:12px;line-height:1.65}.execution-revision p.change{color:#168b68}.execution-node-info>div{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));padding:0 14px}.execution-node-info label{display:flex;min-height:58px;flex-direction:column;justify-content:center;gap:6px;border-left:1px solid #eef1f6;padding:0 12px}.execution-node-info label:first-child{border-left:0;padding-left:0}.execution-node-info span{font-size:11px;color:#8d99aa}.execution-node-info b{font-size:12px;color:#465671}.execution-chat-layout{display:grid;grid-template-columns:280px minmax(0,1fr);gap:13px;margin-top:13px}.evidence-panel,.review-chatbot{min-height:410px;border:1px solid #e2e7f1;border-radius:8px;background:#fff;overflow:hidden}.evidence-panel>header,.review-chatbot>header{padding:12px 14px;border-bottom:1px solid #edf0f5}.evidence-panel h3,.review-chatbot h3{margin:0;color:#40516c;font-size:14px}.evidence-panel header span,.review-chatbot header span{display:block;margin-top:4px;color:#8c98ab;font-size:11px}.evidence-panel>div{padding:11px;display:flex;flex-direction:column;gap:8px}.evidence-panel button{border:1px solid #e0e5ef;border-radius:6px;background:#fbfcff;color:#5764ba;padding:10px;display:flex;align-items:center;gap:7px;text-align:left;font:12px Microsoft YaHei;cursor:grab}.review-chatbot{display:flex;flex-direction:column}.review-chatbot>header{display:flex;align-items:center;gap:9px;color:#5f55da}.review-chatbot>header>div{display:flex;flex-direction:column;gap:2px}.chat-drop{margin:14px;border:1px dashed #bab4f3;border-radius:7px;background:#f8f7ff;color:#6258dc;padding:14px;display:flex;align-items:center;gap:8px}.chat-drop b,.chat-drop span{display:block}.chat-drop span{color:#8995aa;font-size:11px}.chat-files{padding:9px 14px 0;display:flex;flex-wrap:wrap;gap:6px}.chat-files span{border:1px solid #dcd8ff;border-radius:12px;background:#f2f0ff;color:#5d54d4;padding:4px 7px;font-size:11px}.chat-files button{border:0;background:transparent;color:#7e75df;margin-left:4px;cursor:pointer}.chat-messages{min-height:140px;flex:1;padding:14px;display:flex;flex-direction:column;gap:8px}.chat-messages p{max-width:82%;margin:0;padding:8px 10px;border-radius:7px;font-size:12px;line-height:1.65}.chat-messages p.bot{align-self:flex-start;background:#f2f3ff;color:#5663a2}.chat-messages p.user{align-self:flex-end;background:#6257df;color:#fff}.chat-input{display:flex;gap:8px;padding:11px 14px;border-top:1px solid #edf0f5}.chat-input textarea{height:58px;min-width:0;flex:1;resize:none;border:1px solid #dfe4ee;border-radius:6px;padding:8px;color:#465570;font:12px/1.5 Microsoft YaHei;outline-color:#6257e5}.chat-input .pam-primary{height:max-content;align-self:flex-end}.conversation-summary textarea{display:block;width:calc(100% - 28px);height:100px;margin:12px 14px;padding:9px;border:1px solid #dfe4ee;border-radius:6px;resize:vertical;color:#465570;font:12px/1.65 Microsoft YaHei;outline-color:#6257e5}.conversation-summary header .plain{padding:6px 10px;font-size:12px}.archive-banner{margin:16px 20px 0;padding:13px 15px;display:flex;gap:10px;align-items:center;border:1px solid #dcd8ff;border-radius:8px;background:#f3f1ff;color:#5e54d6}.archive-banner div{display:flex;flex-direction:column;gap:4px}.archive-banner b{font-size:14px}.archive-banner span{font-size:12px;color:#7f8ba4}.archive-content,.archive-files{margin:13px 20px 0}.archive-content p{margin:0;padding:13px 15px;color:#53627b;font-size:13px;line-height:1.75}.archive-content header span,.archive-files header span{color:#5e54d6;font-size:11px}.archive-files>div{padding:12px 14px;display:flex;gap:8px;flex-wrap:wrap}.archive-files>div>span{padding:7px 9px;border:1px solid #e0e5ef;border-radius:6px;background:#fbfcff;color:#5c62be;font-size:12px;display:flex;align-items:center;gap:6px}`;
function OrganizeReview({
  p,
  onClose,
  onUpdate,
  notice,
  skills,
  setSkills,
}: {
  p: Proposal;
  onClose: () => void;
  onUpdate: (stage: Stage, status: string, reason?: string) => void;
  notice: (s: string) => void;
  skills: any[];
  setSkills: any;
}) {
  const sourceBlank = [
    "议案依据",
    "处置方式",
    "预计处置收益",
    "风险提示",
    "合规依据",
    "预期效益",
    "计划完成时间",
  ];
  const smartFilled: { [key: string]: string } = {
    议案依据: "《固定资产管理办法》及处置授权清单",
    处置方式: "评估后协议转让",
    预计处置收益: "286.50 万元",
    合规依据: "固定资产处置审批流程、招采与合同管理规范",
    预期效益: "盘活存量资产，降低维护成本。",
    计划完成时间: "2026-10-31",
  };
  const mapValue = (label: string, value: string, smart = false) =>
    label === "议案名称"
      ? p.title
      : label === "议案来源"
        ? p.source
        : label === "申请人"
          ? p.applicant
          : label === "所属部门"
            ? p.department
            : smart && smartFilled[label]
              ? smartFilled[label]
              : sourceBlank.includes(label)
                ? ""
                : value;
  const originalFields = applicationFields.map(([label, value]) => ({
    label,
    value: mapValue(label, value),
  }));
  const makeMatched = () =>
    applicationFields.map(([label, value]) => ({
      label,
      value: mapValue(label, value, true),
      ai: !!smartFilled[label],
    }));
  const [matched, setMatched] = useState(makeMatched);
  const [summary, setSummary] = useState(
    "已从附件中智能补齐议案依据、处置方式、预计处置收益、合规依据、预期效益和计划完成时间；仍缺少风险提示，请人工补充后再提交预审。",
  );
  const [editingSkill, setEditingSkill] = useState(false);
  const [regenerated, setRegenerated] = useState(false);
  const currentSkill = skills.find((s) => s.id === "organize")!;
  const [skillDraft, setSkillDraft] = useState(currentSkill.prompt);
  const change = (index: number, value: string) =>
    setMatched((v) =>
      v.map((f, i) => (i === index ? { ...f, value, ai: false } : f)),
    );
  const missing = matched.filter((f) => !f.value.trim()).map((f) => f.label);
  const saveSkill = () => {
    setSkills((v: any[]) =>
      v.map((s) =>
        s.id === "organize"
          ? { ...s, prompt: skillDraft, enabled: !!skillDraft.trim() }
          : s,
      ),
    );
    notice("已保存“议案整理与预审技能”，可按新规则重新智能生成当前议案");
  };
  const regenerate = () => {
    setMatched(makeMatched());
    setSummary(
      "已按最新议案整理与预审技能重新匹配附件内容：议案依据、处置方式、预计处置收益、合规依据、预期效益和计划完成时间已智能补齐；风险提示仍待人工补充。",
    );
    setRegenerated(true);
    notice("已按最新技能重新智能生成当前议案的匹配结果与审核建议");
  };
  const reject = () => {
    onUpdate("returned", "驳回修改", summary);
    notice("已驳回修改，并向申请人发送钉钉卡片通知");
    onClose();
  };
  const approve = () => {
    onUpdate("functional", "预审中");
    notice("已提交预审，完整议案及附件已进入预审流程");
    onClose();
  };
  return (
    <>
      {editingSkill && (
        <section className="inline-skill">
          <header>
            <div>
              <b>技能配置</b>
              <small>
                {currentSkill.name} · 用于字段匹配、缺失提示和审核建议。
              </small>
            </div>
          </header>
          <textarea
            value={skillDraft}
            onChange={(e) => setSkillDraft(e.target.value)}
          />
          <footer>
            <button className="plain" onClick={() => setEditingSkill(false)}>
              取消
            </button>
            <button
              className="pam-primary"
              disabled={!skillDraft.trim()}
              onClick={() => {
                saveSkill();
                regenerate();
                setEditingSkill(false);
              }}
            >
              <RefreshCw size={14} />
              保存并重新智能生成
            </button>
          </footer>
        </section>
      )}
      <ContextSkillBar
        skill={currentSkill}
        description="用于从申请信息和附件中匹配字段、识别缺失项，并生成可编辑的预审建议。"
        onClick={() => setEditingSkill(true)}
      />
      <TemplatePin p={p} />
      <div className="organize-scroll-content">
      <div className="organize-body">
        <section className="organize-pane">
          <h3>原始申请信息</h3>
          <p>
            申请人实际填写的申请表；未填写字段保持为空，附件作为智能匹配依据。
          </p>
          <div className="organize-form">
            {originalFields.map((field, i) => (
              <label className={i >= 13 ? "wide" : ""} key={field.label}>
                <span>{field.label}</span>
                <b>{field.value || <i className="empty-value">未填写</i>}</b>
              </label>
            ))}
          </div>
          <div className="organize-files">
            <b>原始附件材料</b>
            {p.attachments.map((a) => (
              <div key={a}>
                <FileText size={15} />
                {a}
              </div>
            ))}
          </div>
        </section>
        <section className="organize-pane">
          <header className="pane-title">
            <div>
              <h3>智能匹配申请信息</h3>
              <p>
                {regenerated
                  ? "已按最新技能重新生成；请复核后继续处理。"
                  : "以原始申请表为底稿，已从附件中提取并补齐的字段以紫色“智能填充”标识。"}
              </p>
            </div>
          </header>
          <div className="organize-form">
            {matched.map((field, i) => {
              const isMissing = !field.value.trim();
              return (
                <label
                  className={`${i >= 13 ? "wide " : ""}${isMissing ? "missing" : ""}`}
                  key={field.label}
                >
                  <span>
                    {field.label}
                    {field.ai && <em className="ai-mark">智能填充</em>}
                    {isMissing && <em className="missing-mark">未匹配</em>}
                  </span>
                  <input
                    value={field.value}
                    placeholder={isMissing ? `请补充${field.label}` : ""}
                    onChange={(e) => change(i, e.target.value)}
                  />
                </label>
              );
            })}
          </div>
          <div className="organize-files">
            <b>匹配后保留的附件材料</b>
            {p.attachments.map((a) => (
              <div key={a}>
                <FileText size={15} />
                {a}
              </div>
            ))}
            <div className="missing-file">
              <FileText size={15} />
              待补充：风险提示说明
            </div>
          </div>
        </section>
      </div>
      <section className="organize-summary">
        <label>
          审核建议总结{" "}
          <small>
            {missing.length
              ? `当前仍有 ${missing.length} 个未匹配字段：${missing.join("、")}`
              : "字段完整，可进行提交预审。"}
          </small>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </label>
      </section>
      </div>
      <footer>
        <button className="danger" onClick={reject}>
          驳回修改
        </button>
        <button className="pam-primary" onClick={approve}>
          <Check size={15} />
          提交预审
        </button>
      </footer>
    </>
  );
}
function OrganizeAuditDetail({
  p,
  status,
  onClose,
  onPass,
  onReturn,
}: {
  p: Proposal;
  status: OrganizeStatus;
  onClose: () => void;
  onPass: () => void;
  onReturn: () => void;
}) {
  const organized = applicationFields.map(([label, value]) => [
    label,
    label === "议案名称" ? p.title : label === "议案来源" ? p.source : label === "申请人" ? p.applicant : label === "所属部门" ? p.department : label === "议案依据" ? "《固定资产管理办法》及处置授权清单" : label === "处置方式" ? "评估后协议转让" : label === "预计处置收益" ? "286.50 万元" : label === "合规依据" ? "固定资产处置审批流程、招采与合同管理规范" : label === "预期效益" ? "盘活存量资产，降低维护成本。" : label === "计划完成时间" ? "2026-10-31" : value,
  ]);
  const returned = p.rejectionHistory?.[0];
  const rejectionRole = returned?.role || "职能预审人";
  const isCommitteeReturn = rejectionRole.includes("战略执行委员会");
  const rejectionLabel = isCommitteeReturn ? "战执委驳回" : "职能预审驳回";
  const isRejected = status === "驳回修改中";
  const hasReturned = isRejected || status === "修改后待审核" || Boolean(p.revised);
  const showChanges = status === "修改后待审核" || Boolean(p.revised);
  const isPreApproval = status === "预审通过";
  const isAuditPassed = status === "审核通过";
  const reviewTitle = isRejected ? "驳回修改详情" : isAuditPassed ? "审核通过详情" : isPreApproval ? "预审通过后审核" : status === "修改后待审核" ? "修改后审核" : "整理后确认审核";
  const passLabel = isPreApproval ? "审核通过" : "提交预审";
  return <div className="pam-overlay"><aside className="pam-drawer personal-drawer organize-audit-drawer"><header><div><small>{p.id} · {reviewTitle}</small><h2>{p.title}</h2><Status>{status}</Status></div><button onClick={onClose}><X /></button></header><TemplatePin p={p} />
    <section className="organize-audit-section"><header><div><h3>整理后议案内容</h3><p>以下为智能整理并经人工确认后的结构化议案内容，不展示原始申请表。</p></div><span className="organized-mark">已整理</span></header><div className="application-form readonly-form">{organized.map(([label,value],i)=><label className={i>=13?"wide":""} key={label}><span>{label}{["议案依据","处置方式","预计处置收益","合规依据","预期效益","计划完成时间"].includes(label) && <em className="ai-mark">智能填充</em>}</span><b>{value}</b></label>)}</div></section>
    <section className="organize-audit-section attachment-section"><header><div><h3>整理后附件</h3><p>已纳入本次送审材料。</p></div></header><div className="editable-files">{p.attachments.map((a,i)=><div key={`${a}-${i}`}><span className="file"><FileText size={16}/>{a}</span></div>)}</div></section>
    {!isAuditPassed && hasReturned && <section className="organize-audit-section expectation-section"><header><div><h3>{isRejected ? `${rejectionLabel}建议` : `当期${rejectionLabel}建议`}</h3><p>{isRejected ? `当前议案正等待申请人按${rejectionRole}的建议补充和修改。` : `上次${rejectionRole}退回时提出的修改要求，供本次复核使用。`}</p></div></header><div className="expectation-card"><div className="expectation-meta"><b>{returned?.person || "赵璇"}</b><span>{rejectionRole}</span><small>{returned?.time || "2026-08-10 16:35"}</small></div><p>{returned?.opinion || p.reason || "请补充环保验收依据，并说明改造期间的连续生产保障方案。"}</p></div></section>}
    {!isAuditPassed && showChanges && <section className="organize-audit-section change-section"><header><div><h3>申请人修改处</h3><p>已回传修改内容；以下变更与当期{rejectionLabel}建议一一对应。</p></div><span className="returned-mark">已回传</span></header><div className="change-list"><article><b>处置方式</b><p><del>公开挂牌</del><ins>评估后协议转让</ins></p></article><article><b>附件材料</b><p><del>未提供资产评估报告</del><ins>新增：资产评估报告.pdf</ins></p></article><article><b>议案依据</b><p><del>固定资产处置说明</del><ins>补充：《固定资产管理办法》及处置授权清单</ins></p></article></div></section>}
    {isPreApproval && <section className="organize-audit-section prereview-suggestion-section"><header><div><h3>预审建议</h3><p>预审结论与建议已随整理材料一并提交，供本次审核参考。</p></div><Status>预审通过</Status></header><div className="prereview-suggestion-grid"><label><span>预审人员</span><b>李晨 · 职能预审人</b></label><label><span>预审建议</span><p>材料完整性、制度依据和预算测算已核验通过；建议在后续审核中重点关注实施计划与执行风险的闭环安排。</p></label></div></section>}
    {isPreApproval && <section className="organize-audit-section audit-skill-analysis"><header><div><h3><Sparkles size={16}/>战执委审核 Skill · 智能审核分析与结果</h3><p>基于预审结论、整理后的议案内容和附件自动生成，支持人工修改后再作出审核决定。</p></div><Status>智能分析</Status></header><div><textarea defaultValue={"【审核结论建议】\n议案具备进入后续审议流程的基本条件，建议审核通过；实施前需固化责任分工与关键节点验证要求。\n\n【重点关注事项】\n收益测算假设、执行计划及跨部门协同安排需在实施过程中按节点留痕，并在异常情况下及时反馈。\n\n【合规核验结果】\n已匹配议案依据、处置方式与附件材料；当前未发现阻断性合规缺项。"} /></div></section>}
    {isAuditPassed && <section className="organize-audit-section audit-process-section"><header><div><h3>全流程操作记录</h3><p>保留申请人提交以来每个状态的处理人、操作结果与修改内容。</p></div><Status>已完成</Status></header><div className="audit-process-list"><article className="done"><i>1</i><div><b>申请人提交议案</b><span>王磊 · 今天 09:28</span><p>提交《{p.title}》及申请表、可研报告和测算明细等原始材料。</p></div></article><article className="done"><i>2</i><div><b>智能整理完成 · 整理后待确认</b><span>周敏 · 今天 09:42</span><p>完成字段匹配与附件整理，补齐议案依据、处置方式、收益测算及合规依据。</p></div></article><article className="revision"><i>3</i><div><b>整理审核退回 · 驳回修改中</b><span>赵璇 · 2026-08-10 16:35</span><p>已退回申请人补充投资回收期测算并明确测算口径。</p></div></article><article className="done"><i>4</i><div><b>申请人修改后回传 · 修改后待审核</b><span>王磊 · 今天 09:58</span><p>申请人已提交修改版本及补充附件，进入整理后复核。</p></div></article><article className="done"><i>5</i><div><b>提交预审 · 预审中</b><span>李晨 · 今天 10:06</span><p>整理结果确认后提交职能预审，审核建议与附件一并流转。</p></div></article><article className="done"><i>6</i><div><b>预审通过</b><span>李晨 · 今天 10:28</span><p>预审建议：材料完整、依据充分；请在正式审核中继续关注执行风险闭环。</p></div></article><article className="done current"><i><Check size={13}/></i><div><b>审核通过</b><span>陈颖 · 今天 10:46</span><p>审核结论：议案可进入后续执行流程，相关修改内容与附件版本已完整留痕。</p></div></article></div></section>}
    <footer className="personal-footer">{isRejected || isAuditPassed ? <button className="pam-primary" onClick={onClose}>关闭</button> : <><button className="danger" onClick={onReturn}>驳回修改</button><button className="pam-primary" onClick={onPass}><Check size={15}/>{passLabel}</button></>}</footer>
  </aside></div>;
}
function SubmissionPreview({ p, onClose, onConfirm, mode = "pre" }: { p: Proposal; onClose: () => void; onConfirm: () => void; mode?: "pre" | "send" }) {
  const isSend = mode === "send";
  const organized = applicationFields.map(([label, value]) => [
    label,
    label === "议案名称" ? p.title : label === "议案来源" ? p.source : label === "申请人" ? p.applicant : label === "所属部门" ? p.department : label === "议案依据" ? "《固定资产管理办法》及处置授权清单" : label === "处置方式" ? "评估后协议转让" : label === "预计处置收益" ? "286.50 万元" : label === "合规依据" ? "固定资产处置审批流程、招采与合同管理规范" : label === "预期效益" ? "盘活存量资产，降低维护成本。" : label === "计划完成时间" ? "2026-10-31" : value,
  ]);
  return <div className="pam-overlay"><section className="pam-modal submission-modal"><header><div><small>{p.id} · {isSend ? "送审确认" : "预审提交确认"}</small><h2>{isSend ? "确认送审" : "确认提交预审"}</h2><p>{p.title}</p></div><button onClick={onClose}><X /></button></header><TemplatePin p={p} />
    <section className="submission-note"><Check size={17}/><div><b>{isSend ? "预审已通过，可送审" : "已整理完成，可提交预审"}</b><span>{isSend ? "以下内容将作为本次正式送审材料，确认后进入议案审核。" : "以下内容将作为本次预审材料，提交后进入预审流程。"}</span></div></section>
    <section className="submission-section"><header><div><h3>整理后的议案内容</h3><p>仅展示已确认的结构化整理结果。</p></div></header><div className="application-form readonly-form">{organized.map(([label, value], i) => <label className={i >= 13 ? "wide" : ""} key={label}><span>{label}{["议案依据", "处置方式", "预计处置收益", "合规依据", "预期效益", "计划完成时间"].includes(label) && <em className="ai-mark">智能填充</em>}</span><b>{value}</b></label>)}</div></section>
    <section className="submission-section submission-files"><header><div><h3>整理后附件</h3><p>随本次职能预审一并发送。</p></div></header><div className="editable-files">{p.attachments.map((a, i) => <div key={`${a}-${i}`}><span className="file"><FileText size={16}/>{a}</span></div>)}</div></section>
    <footer><button className="plain" onClick={onClose}>取消</button><button className="pam-primary" onClick={onConfirm}><Check size={15}/>{isSend ? "确认送审" : "提交预审"}</button></footer>
  </section></div>;
}
function TemplatePreview({ p, templates, onClose }: { p: Proposal; templates: ProposalTemplate[]; onClose: () => void }) {
  const template = templates.find((item) => item.name === p.templateName) || templates[0];
  return <div className="pam-overlay"><section className="pam-modal template-preview-modal"><header><div><small>当前议案锁定模板 · {template.version}</small><h2>{template.name}</h2><p>仅供查看；流转中的议案继续使用发起时锁定的版本。</p></div><button onClick={onClose}><X /></button></header>
    <section className="template-preview-intro"><FileCog size={20}/><div><b>适用议案类型：{template.types.join("、")}</b><span>模板管理员：{template.owner} · 最近更新：{template.updatedAt} · 当前议案已锁定此版本</span></div><Status>{template.status}</Status></section>
    <section className="template-preview-fields"><header><div><h3>字段定义</h3><p>字段说明、识别别名与取值规则将作为智能整理的固定依据。</p></div><span>{template.fields.length} 个字段</span></header><div className="template-preview-table"><table><thead><tr><th>字段</th><th>系统标识</th><th>字段说明</th><th>识别别名</th><th>规则</th></tr></thead><tbody>{template.fields.map((field) => <tr key={field.key}><td><b>{field.label}</b><small>{field.type}{field.required ? " · 必填" : ""}</small></td><td><code>{field.key}</code></td><td>{field.description}</td><td>{field.aliases || "—"}</td><td><span>{field.priority}</span><small>{field.conflict}</small></td></tr>)}</tbody></table></div></section>
    <footer><button className="plain" onClick={onClose}>关闭</button></footer>
  </section></div>;
}
const meetingKeyFields = (p: Proposal) => [
  ["议案名称", p.title], ["议案编号", p.id], ["申请部门", p.department], ["申请人", p.applicant],
  ["决策事项", "审议并明确项目实施方案及授权范围"], ["预计收益", "286.50 万元"],
];
function MeetingMaterialsDraft({ p, onClose, onNext }: { p: Proposal; onClose: () => void; onNext: () => void }) {
  return <div className="pam-overlay"><section className="pam-modal meeting-modal"><header><div><small>{p.id} · 议会材料智能整理</small><h2>议会材料整理结果</h2><p>{p.title}</p></div><button onClick={onClose}><X /></button></header>
    <section className="meeting-banner"><Sparkles size={20}/><div><b>已根据送审材料完成议会材料整理</b><span>提炼会议阅读要点、关键决策信息，并打包本次参会附件。</span></div><Status>材料已整理</Status></section>
    <section className="meeting-section meeting-description"><header><h3>议案说明</h3><span>智能生成</span></header><p>本议案拟对现有项目实施方案进行调整，申请战略执行委员会审议相关处置方案与授权范围。送审材料已完成结构化整理，请参会领导重点关注实施依据、收益测算、合规要求及计划节点，并结合附件进行线上审议。</p></section>
    <section className="meeting-section"><header><h3>议案关键信息</h3><span>仅展示议会阅读重点</span></header><table className="meeting-key-table"><tbody>{meetingKeyFields(p).map(([label,value]) => <tr key={label}><th>{label}</th><td>{value}</td></tr>)}</tbody></table></section>
    <section className="meeting-section meeting-files"><header><h3>参会材料附件</h3><span>将随会议通知一并附送</span></header><div>{[...p.attachments, "议会审议要点摘要.pdf", "议案关键信息表.xlsx"].map((file, index) => <span className="file" key={`${file}-${index}`}><FileText size={16}/>{file}</span>)}</div></section>
    <footer><button className="plain" onClick={onClose}>取消</button><button className="pam-primary" onClick={onNext}><Check size={15}/>确认材料并进入参会信息整理</button></footer>
  </section></div>;
}
function AttendeeInfoDraft({ p, onClose, onConfirm }: { p: Proposal; onClose: () => void; onConfirm: () => void }) {
  const people = ["陈颖", "王岳", "李晨", "周敏", "赵璇"];
  const [attendee, setAttendee] = useState("陈颖、王岳、李晨、周敏、赵璇");
  const [voters, setVoters] = useState(["陈颖", "王岳", "李晨"]);
  const toggle = (name: string) => setVoters((v) => v.includes(name) ? v.filter((item) => item !== name) : [...v, name]);
  const noticeText = `各位领导：现有《${p.title}》议案需进行线上审议。请您查阅随附的议会材料，并于会议期间对“审议并明确项目实施方案及授权范围”进行投票表决。会议拟采用线上投票方式，请各位领导结合议案依据、收益测算与合规要求审阅后投票。`;
  return <div className="pam-overlay"><section className="pam-modal meeting-modal attendee-modal"><header><div><small>{p.id} · 参会信息智能整理</small><h2>参会与投票信息确认</h2><p>{p.title}</p></div><button onClick={onClose}><X /></button></header>
    <section className="meeting-section attendee-form"><label>参会人<input value={attendee} onChange={(e) => setAttendee(e.target.value)} placeholder="请输入参会人，多个姓名用顿号分隔"/></label><div><b>指定投票人</b><span>可多选；仅所选人员收到线上投票卡片。</span><section className="voter-picks">{people.map((person) => <button className={voters.includes(person) ? "selected" : ""} onClick={() => toggle(person)} key={person}>{person.slice(0,1)}<small>{person}</small></button>)}</section></div></section>
    <section className="meeting-section meeting-files"><header><h3>已整理的参会材料</h3><span>来源：议会材料智能整理</span></header><div>{[...p.attachments, "议会审议要点摘要.pdf", "议案关键信息表.xlsx"].map((file, index) => <span className="file" key={`${file}-${index}`}><FileText size={16}/>{file}</span>)}</div></section>
    <section className="meeting-section meeting-text"><header><h3>拟会通知与投票说明</h3><span>智能生成，可编辑</span></header><textarea defaultValue={noticeText}/></section>
    <footer><button className="plain" onClick={onClose}>取消</button><button className="pam-primary" disabled={!attendee.trim() || !voters.length} onClick={onConfirm}><Check size={15}/>确认参会信息</button></footer>
  </section></div>;
}
function VoteReminder({ p, onClose, onSend }: { p: Proposal; onClose: () => void; onSend: (names: string[]) => void }) {
  const pending = ["陈颖", "周敏", "张磊", "刘畅"];
  const [skip, setSkip] = useState<string[]>([]);
  const targets = pending.filter((name) => !skip.includes(name));
  const message = `各位委员您好：《${p.title}》正在进行线上投票，目前尚未完成表决。请您查阅已发送的议会材料，并在方便时完成投票。`;
  return <div className="pam-overlay"><section className="pam-modal reminder-modal"><header><div><small>{p.id} · 智能催票</small><h2>待投票人员提醒</h2><p>当前已投票 5 人，尚有 {pending.length} 人未投票。</p></div><button onClick={onClose}><X /></button></header>
    <section className="reminder-list"><b>请选择无需催办的人员</b><span>点击头像或姓名后，该人员将置灰且不再接收本次提醒。</span><div>{pending.map((name, index) => <button key={name} className={skip.includes(name) ? "skip" : ""} onClick={() => setSkip((v) => v.includes(name) ? v.filter((item) => item !== name) : [...v, name])}><i>{name.slice(0,1)}</i><b>{name}</b><small>{skip.includes(name) ? "不发送" : "待投票"}</small></button>)}</div></section>
    <section className="reminder-message"><header><h3>催票话术</h3><span>将发送给 {targets.length} 位待投票人员</span></header><textarea defaultValue={message}/></section>
    <footer><button className="plain" onClick={onClose}>取消</button><button className="pam-primary" disabled={!targets.length} onClick={() => onSend(targets)}><Send size={15}/>发送催票提醒</button></footer>
  </section></div>;
}
function DeliberationSetupModal({ p, onClose, onSend, notice }: { p: Proposal; onClose: () => void; onSend: (type: "group" | "online" | "offline", content: string) => void; notice: (s: string) => void }) {
  const [type, setType] = useState<"group" | "online" | "offline">("group");
  const [editingSkill, setEditingSkill] = useState(false);
  const [voters, setVoters] = useState(["陈颖", "王岳", "李晨"]);
  const [voterCandidate, setVoterCandidate] = useState("");
  const people = ["陈颖", "王岳", "李晨", "周敏", "赵璇"];
  const meetingLabel = type === "group" ? "群投票" : type === "online" ? "线上会议" : "线下会议";
  const skillName = type === "group" ? "群投票审议 Skill" : type === "online" ? "线上会议审议 Skill" : "线下会议审议 Skill";
  const [skillDraft, setSkillDraft] = useState("请基于已审核通过的议案，生成面向战略执行委员会的审议内容：提取需决策问题、核心依据、关键风险及应对、所需资源；语言正式、结构清晰，适配群投票与会议场景。");
  const [deliberationContent, setDeliberationContent] = useState("");
  const addVoter = (person: string) => { if (person && !voters.includes(person)) setVoters((current) => [...current, person]); setVoterCandidate(""); };
  const removeVoter = (person: string) => setVoters((current) => current.filter((item) => item !== person));
  const generateContent = () => setDeliberationContent(`各位委员/总裁：\n\n为推动《${p.title}》的${meetingLabel}审议，现提请审议以下事项：\n\n一、需决策问题\n审议并明确项目实施方案及授权范围。\n\n二、核心依据\n依据战略执行委员会职责、《资产管理办法》及已审核通过的议案材料。\n\n三、关键风险及应对\n重点关注实施节奏、收益测算与合规边界，责任部门将按节点提交验证资料。\n\n四、所需资源\n按议案测算配置预算、人力及跨部门协同资源。\n\n请各位委员/总裁按安排参与并完成审议。`);
  return <div className="pam-overlay"><section className="pam-modal deliberation-setup-modal"><header><div><small>{p.id} · 审议信息生成</small><h2>生成审议信息</h2><p>{p.title}</p></div><button onClick={onClose}><X /></button></header>
    <button className="deliberation-skill" onClick={() => setEditingSkill(true)}><Sparkles size={18}/><div><b>{skillName}</b><span>点击查看并修改用于生成审议内容的 Skill。</span></div><ChevronRight size={16}/></button>
    <section className="deliberation-section"><header><div><h3>选择审议类型</h3><p>不同类型将自动切换对应的审议 Skill 与信息配置。</p></div></header><div className="deliberation-type-picks">{[["group", "群投票", "在指定群内发起表决，支持催票与投票人"], ["online", "线上会议", "配置会议时间与线上会议链接"], ["offline", "线下会议", "配置参会时间与会议室信息"]].map(([value, label, desc]) => <button className={type === value ? "active" : ""} onClick={() => setType(value as "group" | "online" | "offline")} key={value}><b>{label}</b><small>{desc}</small></button>)}</div></section>
    {type === "group" ? <section className="deliberation-section group-settings"><header><div><h3>群投票设置</h3><p>设置投票范围、截止时间与催票规则。</p></div></header><div className="deliberation-form-grid"><label>选择群<select defaultValue="战略执行委员会群"><option>战略执行委员会群</option><option>经营决策协同群</option></select></label><label>截止时间<input type="datetime-local" defaultValue="2026-08-18T18:00" /></label><label>催票间隔<select defaultValue="30分钟"><option>30分钟</option><option>60分钟</option><option>90分钟</option><option>120分钟</option></select></label><label>输入投票人<input list="deliberation-voters" value={voterCandidate} placeholder="输入姓名后按回车添加" onChange={(event) => setVoterCandidate(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addVoter(voterCandidate); } }} /><datalist id="deliberation-voters">{people.filter((person) => !voters.includes(person)).map((person) => <option key={person} value={person} />)}</datalist></label><div className="voter-selected-list"><span>已选投票人</span><div>{voters.map((person) => <button onClick={() => removeVoter(person)} key={person}><i />{person}</button>)}</div></div></div></section> : <section className="deliberation-section meeting-settings"><header><div><h3>{meetingLabel}信息</h3><p>{type === "online" ? "填写会议时间与线上会议链接。" : "填写会议时间与线下会议室信息。"}</p></div></header><div className="deliberation-form-grid"><label>参会时间<input type="datetime-local" defaultValue="2026-08-18T15:00" /></label><label>{type === "online" ? "线上会议链接" : "线下会议室"}<input defaultValue={type === "online" ? "https://meeting.jingbo.com/strategy-2026" : "总部 A 座 1608 战略会议室"} /></label><label className="wide">参会人员<input defaultValue="陈颖、王岳、李晨、周敏、赵璇" /></label></div></section>}
    <section className="deliberation-section generated-deliberation"><header><div><h3>智能生成审议内容</h3><p>基于当前审议类型和 {skillName} 生成，支持继续人工编辑。</p></div></header><div className="deliberation-content-toolbar"><span><Sparkles size={14}/>AI 将按当前配置生成完整审议话术</span><button className="deliberation-generate" onClick={generateContent}><Sparkles size={15}/>智能生成</button></div><textarea className="deliberation-content-input" value={deliberationContent} onWheel={(event) => { const target = event.currentTarget; const atTop = target.scrollTop <= 0 && event.deltaY < 0; const atBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 1 && event.deltaY > 0; if (atTop || atBottom) event.preventDefault(); event.stopPropagation(); }} onChange={(event) => setDeliberationContent(event.target.value)} placeholder="点击“智能生成”后将在此生成可编辑的审议内容。" /></section>
    <footer><button className="plain" onClick={onClose}>取消</button><button className="pam-primary" disabled={type === "group" && !voters.length} onClick={() => onSend(type, deliberationContent)}><Send size={15}/>发送</button></footer>
  </section>{editingSkill && <div className="deliberation-skill-overlay"><section className="deliberation-skill-dialog"><header><div><small>审议 Skill 配置</small><h3>{skillName}</h3><p>调整后将用于本次智能生成审议内容。</p></div><button onClick={() => setEditingSkill(false)}><X size={17}/></button></header><textarea value={skillDraft} onChange={(event) => setSkillDraft(event.target.value)} /><footer><button className="plain" onClick={() => setEditingSkill(false)}>取消</button><button className="pam-primary" onClick={() => { notice(`${skillName} 已保存`); setEditingSkill(false); }}>保存</button></footer></section></div>}</div>;
}
function VoteDeliberationModal({ p, onClose, onAnnouncement }: { p: Proposal; onClose: () => void; onAnnouncement: () => void }) {
  const completed = Boolean(p.voteCompleted);
  return <div className="pam-overlay"><section className="pam-modal deliberation-result-modal"><header><div><small>{p.id} · 群投票审议</small><h2>投票审议详情</h2><p>{p.title}</p></div><button onClick={onClose}><X /></button></header><section className="deliberation-info-card"><b>会议信息</b><div><span>审议类型：群投票</span><span>投票群：战略执行委员会群</span><span>截止时间：2026-08-18 18:00</span><span>催票间隔：30 分钟</span></div></section>{!completed ? <><section className="deliberation-section vote-progress"><header><div><h3>当前投票情况</h3><p>已投票 5 / 8 人，仍有 3 人待表决。</p></div><b>进行中</b></header><div className="vote-progress-track"><i style={{ width: "62.5%" }} /></div><div className="vote-voters"><span>已投：陈颖、王岳、李晨、周敏、赵璇</span><span>待投：孙敏、郭帆、赵璇</span></div></section><section className="deliberation-waiting"><CircleAlert size={17}/><div><b>等待投票完成</b><span>投票完成后将自动汇总表决结果与委员建议，不在当前阶段展示审议结果。</span></div></section></> : <><section className="deliberation-section vote-progress"><header><div><h3>当前投票情况</h3><p>已投票 8 / 8 人，投票已完成。</p></div><b className="done">已完成</b></header><div className="vote-progress-track"><i style={{ width: "100%" }} /></div></section><DeliberationOutcomeContent p={p} outcome={p.deliberationOutcome || "通过"} /></>}{!completed ? <footer><button className="pam-primary" onClick={onClose}>确定</button></footer> : <footer><button className="plain" onClick={onClose}>确定</button><button className="pam-primary" onClick={onAnnouncement}><Send size={15}/>生成公告</button></footer>}</section></div>;
}
function MeetingEndConfirm({ p, onClose, onConfirm }: { p: Proposal; onClose: () => void; onConfirm: () => void }) {
  return <div className="pam-overlay"><section className="pam-modal meeting-end-confirm"><header><div><small>{p.id} · {p.deliberationStatus === "线下会议审议中" ? "线下会议" : "线上会议"}</small><h2>会议是否已结束？</h2><p>确认后将进入表决结果与委员建议录入。</p></div><button onClick={onClose}><X /></button></header><section><CircleAlert size={20}/><p>请在会议结束并完成表决确认后继续，录入结果将进入审议完成状态。</p></section><footer><button className="plain" onClick={onClose}>取消</button><button className="pam-primary" onClick={onConfirm}>确认</button></footer></section></div>;
}
function MeetingOutcomeEntry({ p, onClose, onConfirm }: { p: Proposal; onClose: () => void; onConfirm: (outcome: "通过" | "未通过", advice: string) => void }) {
  const [outcome, setOutcome] = useState<"通过" | "未通过">("通过");
  const [advice, setAdvice] = useState("请项目牵头部门按审议意见完善实施计划，并在关键节点同步执行进展。");
  return <div className="pam-overlay"><section className="pam-modal deliberation-result-modal"><header><div><small>{p.id} · 审议结果录入</small><h2>{p.deliberationStatus === "线下会议审议中" ? "线下会议" : "线上会议"}审议结果</h2><p>{p.title}</p></div><button onClick={onClose}><X /></button></header><section className="deliberation-info-card compact"><b>本次会议信息</b><div><span>参会时间：2026-08-18 15:00</span><span>{p.deliberationStatus === "线下会议审议中" ? "会议室：总部 A 座 1608" : "会议链接：meeting.jingbo.com/strategy-2026"}</span><span>参会人员：5 人</span><span>议案材料：已确认</span></div></section><section className="deliberation-section outcome-entry"><header><div><h3>录入审议结果</h3><p>结果确认后，议案状态将更新为“审议完成”。</p></div></header><div className="outcome-choices"><button className={outcome === "通过" ? "selected pass" : ""} onClick={() => setOutcome("通过")}><Check size={16}/>通过</button><button className={outcome === "未通过" ? "selected reject" : ""} onClick={() => setOutcome("未通过")}><X size={16}/>未通过</button></div><label className="advice-entry"><span>投票人建议和指示</span><textarea value={advice} onChange={(event) => setAdvice(event.target.value)} placeholder="请录入会议审议中的领导建议、后续指示或需补充事项。" /></label></section><section className="outcome-tip"><Lightbulb size={16}/><span>确认提交后，系统将保留本次会议结论、领导建议及后续公告记录。</span></section><footer><button className="plain" onClick={onClose}>取消</button><button className="pam-primary" onClick={() => onConfirm(outcome, advice)}>确定</button></footer></section></div>;
}
function DeliberationOutcomeContent({ p, outcome }: { p: Proposal; outcome: "通过" | "未通过" }) {
  const advice = p.deliberationAdvice || "请项目牵头部门按审议意见完善实施计划，并在关键节点同步执行进展。";
  return <><section className={`deliberation-outcome ${outcome === "通过" ? "pass" : "reject"}`}><b>{outcome === "通过" ? "审议通过" : "审议未通过"}</b><span>{outcome === "通过" ? "已完成表决，议案可进入结果通知环节。" : "已完成表决，请结合审议意见完善后续安排。"}</span></section><section className="deliberation-section leader-advice"><header><div><h3>投票人建议和指示</h3><p>审议过程中形成的领导建议与执行要求。</p></div></header><p>{advice}</p></section></>;
}
function AnnouncementModal({ p, onClose, onSend, readonly = false }: { p: Proposal; onClose: () => void; onSend?: () => void; readonly?: boolean }) {
  const outcome = p.deliberationOutcome || (p.id === "PA-2026-0081" ? "未通过" : "通过");
  const skillName = outcome === "通过" ? "审议通过结果通知 Skill" : "审议未通过结果通知 Skill";
  const content = p.deliberationContent || `《${p.title}》已完成审议。经战略执行委员会表决，审议结果为：${outcome}。`;
  const advice = p.deliberationAdvice || "请项目牵头部门按审议意见完善实施计划，并在关键节点同步执行进展。";
  const [group, setGroup] = useState("战略执行委员会群");
  const votes = outcome === "未通过" ? { agree: 3, oppose: 4, abstain: 1, conclusion: "不通过" } : p.voteCompleted ? { agree: 8, oppose: 0, abstain: 0, conclusion: "一致通过" } : { agree: 6, oppose: 1, abstain: 1, conclusion: "通过" };
  const notice = `【战执委议案审议结果通知】\n\n审议议案【共8票】\n议案内容：会议审议了《${p.title}》\n审议时间：2026年8月18日\n审议结果：同意 ${votes.agree} 票、反对 ${votes.oppose} 票、弃权 ${votes.abstain} 票\n审议结论：${votes.conclusion}\n审议意见：${advice}\n\nESG战略执行委员会办公室\n2026年8月18日`;
  const fields = [["审议议案", "共 8 票"], ["议案内容", `会议审议了《${p.title}》`], ["审议时间", "2026年8月18日"], ["审议结果", `同意 ${votes.agree} 票、反对 ${votes.oppose} 票、弃权 ${votes.abstain} 票`], ["审议结论", votes.conclusion], ["审议意见", advice]];
  return <div className="pam-overlay"><section className="pam-modal announcement-modal"><header><div><small>{p.id} · 审议结果通知</small><h2>{readonly ? "查看审议结果公告" : "生成审议结果公告"}</h2><p>{p.title}</p></div><button onClick={onClose}><X /></button></header><section className="announcement-skill"><Sparkles size={17}/><div><b>{skillName}</b><span>根据“{outcome}”结果整理通知字段和最终审议意见。</span></div></section><section className="announcement-body"><header><div><h3>公告通知字段</h3><p>由审议结果与领导建议自动归集，发送前可核对。</p></div></header><div className="announcement-fields">{fields.map(([label, value]) => <article key={label}><span>{label}</span><b>{value}</b></article>)}</div><article className="announcement-preview"><span>公告完整内容</span><textarea defaultValue={notice} readOnly={readonly} /></article>{!readonly && <label className="announcement-group">选择群<select value={group} onChange={(event) => setGroup(event.target.value)}><option>战略执行委员会群</option><option>经营决策协同群</option><option>议案申请人通知群</option></select></label>}</section><footer><button className="plain" onClick={onClose}>{readonly ? "关闭" : "取消"}</button>{!readonly && <button className="pam-primary" onClick={onSend}><Send size={15}/>发送</button>}</footer></section></div>;
}
function PersonalDetail({
  p,
  onClose,
  onSave,
  onSubmit,
  draft,
}: {
  p: Proposal;
  onClose: () => void;
  onSave: (p: Proposal, attachments: string[]) => void;
  onSubmit: (p: Proposal) => void;
  draft: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [attachments, setAttachments] = useState(p.attachments);
  const [fields, setFields] = useState(
    applicationFields.map(([label, value]) => ({
      label,
      value: label === "议案名称" ? p.title : value,
    })),
  );
  const canEdit =
    p.applicant === "王楷煜" &&
    (p.stage === "returned" || p.stage === "votefailed" || draft);
  const change = (i: number, value: string) =>
    setFields((v) => v.map((x, n) => (n === i ? { ...x, value } : x)));
  const save = () => {
    onSave({ ...p, title: fields[0].value }, attachments);
    setEditing(false);
  };
  return (
    <div className="pam-overlay">
      <aside className="pam-drawer personal-drawer">
        <header>
          <div>
            <small>{p.id} · 个人申请详情</small>
            <h2>{p.title}</h2>
            <Status>{p.status}</Status>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        <TemplatePin p={p} />
        {p.reason && (
          <section className="return-box">
            <b>处理意见</b>
            <p>{p.reason}</p>
            <small>请按意见修改申请表并补充材料后提交。</small>
          </section>
        )}
        <section className="personal-section">
          <header>
            <div>
              <h3>申请信息</h3>
              <p>请完整维护议案基础信息、决策事项和影响评估。</p>
            </div>
            {canEdit && !editing && (
              <button className="plain" onClick={() => setEditing(true)}>
                <PenLine size={14} />
                修改
              </button>
            )}
          </header>
          <div className="application-form">
            {fields.map((f, i) => (
              <label className={i >= 13 ? "wide" : ""} key={f.label}>
                <span>{f.label}</span>
                {editing ? (
                  <>
                    {["议案类型", "议案来源", "所属部门", "是否紧急"].includes(
                      f.label,
                    ) ? (
                      <select
                        value={f.value}
                        onChange={(e) => change(i, e.target.value)}
                      >
                        <option>{f.value}</option>
                        <option>经营决策类</option>
                        <option>项目投资类</option>
                        <option>是</option>
                        <option>否</option>
                      </select>
                    ) : (
                      <input
                        value={f.value}
                        onChange={(e) => change(i, e.target.value)}
                      />
                    )}
                  </>
                ) : (
                  <b>{f.value}</b>
                )}
              </label>
            ))}
          </div>
        </section>
        <section className="personal-section attachment-section">
          <header>
            <div>
              <h3>附件材料</h3>
              <p>可上传补充材料，或删除不再适用的附件。</p>
            </div>
            {editing && (
              <button
                className="plain"
                onClick={() =>
                  setAttachments((v) => [...v, `补充材料_${v.length + 1}.pdf`])
                }
              >
                + 上传附件
              </button>
            )}
          </header>
          <div className="editable-files">
            {attachments.map((a, i) => (
              <div key={`${a}-${i}`}>
                <span className="file">
                  <FileText size={16} />
                  {a}
                </span>
                {editing && (
                  <button
                    onClick={() =>
                      setAttachments((v) => v.filter((_, n) => n !== i))
                    }
                  >
                    删除
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
        {draft && !editing && (
          <section className="diff personal-diff">
            <header>
              <b>版本比对 · 本次修改</b>
              <span>与上一版本对比</span>
            </header>
            <p>
              <del>处置方式：公开挂牌</del>
              <ins>
                处置方式：{fields.find((f) => f.label === "处置方式")?.value}
              </ins>
            </p>
            <p>
              <del>附件：资产清单.xlsx</del>
              <ins>新增 / 更新附件：{attachments.map((a) => a).join("、")}</ins>
            </p>
            <small>上一轮意见：{p.reason || "请核对议案内容后再提交。"}</small>
          </section>
        )}
        {editing && (
          <footer className="personal-footer">
            <button
              className="plain"
              onClick={() => {
                setEditing(false);
                setAttachments(p.attachments);
              }}
            >
              取消
            </button>
            <button className="pam-primary" onClick={save}>
              <Check size={15} />
              保存
            </button>
          </footer>
        )}
        {draft && !editing && (
          <footer className="personal-footer">
            <span>内容已保存，可重新提交至预审核列表。</span>
            <button
              className="pam-primary"
              onClick={() => {
                onSubmit(p);
                onClose();
              }}
            >
              <Send size={15} />
              提交
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
function Detail({ p, onClose }: { p: Proposal; onClose: () => void }) {
  const fields = applicationFields.map(([label, value]) => [
    label,
    label === "议案名称"
      ? p.title
      : label === "议案来源"
        ? p.source
        : label === "申请人"
          ? p.applicant
          : label === "所属部门"
            ? p.department
            : label === "提交时间"
              ? p.time
              : value,
  ]);
  const showDiff = p.revised || p.stage === "returned";
  return (
    <div className="pam-overlay">
      <aside className="pam-drawer personal-drawer committee-drawer">
        <header>
          <div>
            <small>{p.id} · 议案详情</small>
            <h2>{p.title}</h2>
            <Status>{p.status}</Status>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        <TemplatePin p={p} />
        <section className="life">
          <b>全生命周期</b>
          <div>
            {[
              "收集",
              "智能预审",
              "职能审核",
              "议案审核",
              "投票",
              "决议 / 执行",
            ].map((x, i) => (
              <span
                className={
                  i <=
                  (p.stage === "received"
                    ? 0
                    : p.stage === "functional" || p.stage === "returned"
                      ? 2
                      : p.stage === "prepassed"
                        ? 2
                        : p.stage === "audit"
                          ? 3
                          : p.stage === "auditpassed"
                            ? 3
                            : p.stage === "voting"
                              ? 4
                              : 5)
                    ? "done"
                    : ""
                }
                key={x}
              >
                {i + 1}
                <small>{x}</small>
              </span>
            ))}
          </div>
        </section>
        {p.reason && (
          <section className="return-box">
            <b>处理意见</b>
            <p>{p.reason}</p>
            <small>该意见会随驳回记录与版本比对一同保留。</small>
          </section>
        )}
        <section className="personal-section">
          <header>
            <div>
              <h3>申请信息</h3>
              <p>议案完整申请表信息，供委员会查看和流程处理。</p>
            </div>
          </header>
          <div className="application-form readonly-form">
            {fields.map(([label, value], i) => (
              <label className={i >= 13 ? "wide" : ""} key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </label>
            ))}
          </div>
        </section>
        <section className="personal-section attachment-section">
          <header>
            <div>
              <h3>附件材料</h3>
              <p>以下材料与议案申请表一并归档。</p>
            </div>
          </header>
          <div className="editable-files">
            {p.attachments.map((a, i) => (
              <div key={`${a}-${i}`}>
                <span className="file">
                  <FileText size={16} />
                  {a}
                </span>
              </div>
            ))}
          </div>
        </section>
        {showDiff && (
          <section className="diff committee-diff">
            <header>
              <b>版本比对 · 本次修改</b>
              <span>与 V1.0 对比</span>
            </header>
            <p>
              <del>处置方式：公开挂牌</del>
              <ins>处置方式：评估后协议转让</ins>
            </p>
            <p>
              <del>附件：资产清单.xlsx</del>
              <ins>新增：资产评估报告.pdf</ins>
            </p>
            <small>
              保留上一轮意见：请补充资产评估报告，并明确收益测算口径。
            </small>
          </section>
        )}
        {p.rejectionHistory?.length ? (
          <section className="rejection-history">
            <header><div><h3>驳回修改记录</h3><p>按处理时间保留驳回人、处理意见与本次修改内容。</p></div><span>{p.rejectionHistory.length} 次</span></header>
            {p.rejectionHistory.map((record, i) => <article key={`${record.time}-${i}`}>
              <div className="reject-index">{p.rejectionHistory!.length - i}</div>
              <div><b>{record.person} · {record.role}</b><small>{record.time}</small><label>驳回意见</label><p>{record.opinion}</p><label>修改内容</label><p className="change-note">{record.changes}</p></div>
            </article>)}
          </section>
        ) : null}
      </aside>
    </div>
  );
}
function ReviewDetail({
  p,
  onClose,
  onUpdate,
  notice,
  auto = false,
  mode,
}: {
  p: Proposal;
  onClose: () => void;
  onUpdate: (stage: Stage, status: string, reason?: string) => void;
  notice: (s: string) => void;
  auto?: boolean;
  mode: "pre" | "audit";
}) {
  const isPre = mode === "pre";
  const [reviewed, setReviewed] = useState(auto);
  const [advice, setAdvice] = useState(
    p.status.includes("驳回修改")
      ? "已核对驳回修改内容：补充材料与修改事项已基本满足要求；请重点复核风险提示和审批依据后再作出结论。"
      : isPre
        ? "材料完整性基本符合要求；请重点核验制度依据、预算影响和附件是否齐全。"
        : "审核要点基本合理；请重点复核决策权限、制度合规性、预算影响及执行风险。",
  );
  const fields = applicationFields.map(([label, value]) => [
    label,
    label === "议案名称"
      ? p.title
      : label === "议案来源"
        ? p.source
        : label === "申请人"
          ? p.applicant
          : label === "所属部门"
            ? p.department
            : value,
  ]);
  const start = () => {
    setReviewed(true);
    notice(`已完成智能${isPre ? "预审" : "审核"}，建议内容可继续人工修改`);
  };
  const reject = () => {
    onUpdate("returned", "驳回修改", advice);
    notice(`${isPre ? "预审" : "审核"}已驳回，申请人将收到钉钉卡片通知`);
    onClose();
  };
  const pass = () => {
    onUpdate(
      isPre ? "prepassed" : "auditpassed",
      isPre ? "预审通过" : "审核通过",
    );
    notice(`${isPre ? "预审" : "审核"}已通过，议案已进入下一处理环节`);
    onClose();
  };
  const actionLabel = isPre ? "智能预审" : "智能审核";
  return (
    <div className="pam-overlay">
      <aside className="pam-drawer personal-drawer prereview-drawer">
        <header>
          <div>
            <small>
              {p.id} · {isPre ? "职能预审详情" : "议案审核详情"}
            </small>
            <h2>{p.title}</h2>
            <Status>{p.status}</Status>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        <TemplatePin p={p} />
        {p.reason && (
          <section className="return-box">
            <b>上一轮驳回意见</b>
            <p>{p.reason}</p>
            <small>如为驳回修改后议案，请结合该意见重点复核。</small>
          </section>
        )}
        <section className="personal-section">
          <header>
            <div>
              <h3>申请信息</h3>
              <p>
                完整申请表信息，供{isPre ? "职能部门预审" : "审核人审核"}使用。
              </p>
            </div>
          </header>
          <div className="application-form readonly-form">
            {fields.map(([label, value], i) => (
              <label className={i >= 13 ? "wide" : ""} key={label}>
                <span>{label}</span>
                <b>{value}</b>
              </label>
            ))}
          </div>
        </section>
        <section className="personal-section attachment-section">
          <header>
            <div>
              <h3>附件材料</h3>
              <p>以下材料与申请表一并归档。</p>
            </div>
          </header>
          <div className="editable-files">
            {p.attachments.map((a, i) => (
              <div key={`${a}-${i}`}>
                <span className="file">
                  <FileText size={16} />
                  {a}
                </span>
              </div>
            ))}
          </div>
        </section>
        {!reviewed ? (
          <footer className="personal-footer">
            <span>
              点击{actionLabel}后，系统会结合已保存的技能生成审核建议。
            </span>
            <button className="pam-primary" onClick={start}>
              <Sparkles size={15} />
              {actionLabel}
            </button>
          </footer>
        ) : (
          <>
            <section className="prereview-advice">
              <header>
                <div>
                  <h3>{isPre ? "预审建议" : "审核建议"}</h3>
                  <p>系统生成的建议可由审核人修改后，再作出处理结论。</p>
                </div>
                <span>智能生成</span>
              </header>
              <textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
              />
            </section>
            <footer className="personal-footer">
              <button className="danger" onClick={reject}>
                驳回
              </button>
              <button className="pam-primary" onClick={pass}>
                <Check size={15} />
                通过
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
function ProcessSkills({
  skills,
  setSkills,
  onClose,
  notice,
}: {
  skills: any[];
  setSkills: any;
  onClose: () => void;
  notice: (s: string) => void;
}) {
  const choices = ["organize", "voting", "speech"];
  const [pick, setPick] = useState("organize");
  const current = skills.find((s) => s.id === pick)!;
  const [draft, setDraft] = useState(current.prompt);
  const choose = (id: string) => {
    setPick(id);
    setDraft(skills.find((s) => s.id === id)!.prompt);
  };
  const save = () => {
    setSkills((v: any[]) =>
      v.map((s) =>
        s.id === pick ? { ...s, prompt: draft, enabled: !!draft.trim() } : s,
      ),
    );
    notice(
      draft.trim()
        ? `“${current.name}”已保存，议案列表将立即使用该技能`
        : `“${current.name}”未保存，相关一键操作已禁用`,
    );
  };
  return (
    <div className="pam-overlay">
      <aside className="pam-drawer process-skills">
        <header>
          <div>
            <small>议案列表 · 流程配置</small>
            <h2>流程技能</h2>
            <p>仅展示本页面实际调用的预审、投票与话术技能。</p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        <section className="process-skill-nav">
          {skills
            .filter((s) => choices.includes(s.id))
            .map((s) => (
              <button
                className={pick === s.id ? "selected" : ""}
                onClick={() => choose(s.id)}
                key={s.id}
              >
                <Sparkles size={17} />
                <span>
                  <b>{s.name}</b>
                  <small>
                    {s.enabled ? "已保存 · 已启用" : "未保存 · 已禁用"}
                  </small>
                </span>
                <ChevronRight size={16} />
              </button>
            ))}
        </section>
        <section className="process-editor">
          <header>
            <div>
              <h3>{current.name}</h3>
              <p>{current.desc}</p>
            </div>
            <Status>{current.enabled ? "已启用" : "未配置"}</Status>
          </header>
          <label>
            技能指令
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="描述字段提取、判断标准、输出格式或话术风格…"
            />
          </label>
          <div className="process-help">
            <Sparkles size={16} />
            {pick === "organize"
              ? "影响“整理并预审”中的字段匹配、缺失提示与预审建议。"
              : pick === "voting"
                ? "影响“投票智能设置”中的标题、说明和附件建议。"
                : "影响投票通过后的“话术生成”内容。"}
          </div>
        </section>
        <footer className="personal-footer">
          <button className="plain" onClick={onClose}>
            关闭
          </button>
          <button className="pam-primary" onClick={save}>
            <Check size={15} />
            保存技能
          </button>
        </footer>
      </aside>
    </div>
  );
}
function WorkModal({
  kind,
  p,
  onClose,
  onUpdate,
  notice,
  skill,
  skills,
  setSkills,
}: {
  kind: string;
  p: Proposal;
  onClose: () => void;
  onUpdate: (stage: Stage, status: string, reason?: string) => void;
  notice: (s: string) => void;
  skill?: boolean;
  skills: any[];
  setSkills: any;
}) {
  const [opinion, setOpinion] = useState(
    "经核验，议案符合当前审核要点，可进入下一环节。",
  );
  const [voteAttachments, setVoteAttachments] = useState(p.attachments);
  const isVote = kind === "vote";
  const isOrganize = kind === "organize" || kind === "organize-confirm";
  const speech = kind === "speech";
  const skillId = isVote ? "voting" : "speech";
  const targetSkill = skills.find((s) => s.id === skillId)!;
  const [editSkill, setEditSkill] = useState(false);
  const [skillDraft, setSkillDraft] = useState(targetSkill?.prompt || "");
  const [generated, setGenerated] = useState(false);
  const [voteTitle, setVoteTitle] = useState(`审议：${p.title}`);
  const [voteDescription, setVoteDescription] = useState(
    "本议案已完成职能预审与议案审核，请各委员阅览附件后在钉钉卡片中投票。",
  );
  const [speechDraft, setSpeechDraft] = useState(
    `【议案审议结果】《${p.title}》已获战略执行委员会投票通过。请相关责任部门依据决议要求推进任务分解与执行，并按节点反馈进展。`,
  );
  const saveAndRegenerate = () => {
    setSkills((v: any[]) =>
      v.map((s) =>
        s.id === skillId
          ? { ...s, prompt: skillDraft, enabled: !!skillDraft.trim() }
          : s,
      ),
    );
    if (isVote) {
      setVoteTitle(`审议：${p.title}（按最新投票技能生成）`);
      setVoteDescription(
        "已按最新投票智能设置技能重新生成投票说明，请确认附件和投票内容。",
      );
    } else
      setSpeechDraft(
        `【最新决议话术】《${p.title}》投票通过。请相关责任部门依据最新话术要求推进任务分解、执行与进度反馈。`,
      );
    setGenerated(true);
    setEditSkill(false);
    notice(`已按最新“${targetSkill.name}”重新智能生成当前内容`);
  };
  const reject = () => {
    onUpdate(
      "returned",
      kind.includes("functional") ? "职能预审驳回" : "审核驳回",
      opinion,
    );
    notice("已驳回议案，并向申请人发送钉钉卡片通知");
    onClose();
  };
  const approve = () => {
    const functional = kind.includes("functional");
    onUpdate(
      functional ? "prepassed" : "auditpassed",
      functional ? "预审通过" : "审核通过",
    );
    notice(
      functional
        ? "职能预审通过，议案已可提交审核"
        : "审核通过，已可进入投票智能设置",
    );
    onClose();
  };
  const launchVote = () => {
    onUpdate("voting", "投票进行中");
    notice("已确认发起钉钉投票，议案进入投票进行中");
    onClose();
  };
  return (
    <div className="pam-overlay">
      <section className={`pam-modal ${isOrganize ? "organize-modal" : ""}`}>
        <header>
          <div>
            <small>
              {p.id} ·{" "}
              {isVote
                ? "钉钉投票协同"
                : speech
                  ? "决议话术"
                  : isOrganize
                    ? "智能整理与预审"
                    : "审核处理"}
            </small>
            <h2>
              {speech
                ? "投票通过话术草稿"
                : isOrganize
                  ? "整理结果与预审确认"
                  : isVote
                    ? "投票智能设置"
                    : kind.includes("functional")
                      ? "职能部门审核"
                      : "议案审核"}
            </h2>
            <p>{p.title}</p>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </header>
        {isOrganize ? (
          <OrganizeReview
            p={p}
            onClose={onClose}
            onUpdate={onUpdate}
            notice={notice}
            skills={skills}
            setSkills={setSkills}
          />
        ) : isVote || speech ? (
          <>
            {editSkill && (
              <section className="inline-skill">
                <header>
                  <div>
                    <b>技能配置</b>
                    <small>
                      {targetSkill.name} · 修改后将按新规则重新智能生成当前
                      {isVote ? "投票内容" : "话术"}。
                    </small>
                  </div>
                </header>
                <textarea
                  value={skillDraft}
                  onChange={(e) => setSkillDraft(e.target.value)}
                />
                <footer>
                  <button className="plain" onClick={() => setEditSkill(false)}>
                    取消
                  </button>
                  <button
                    className="pam-primary"
                    disabled={!skillDraft.trim()}
                    onClick={saveAndRegenerate}
                  >
                    <RefreshCw size={14} />
                    保存并重新智能生成
                  </button>
                </footer>
              </section>
            )}
            <div className={isVote ? "vote-form" : "speech"}>
              {isVote ? (
                <>
                  <ContextSkillBar
                    skill={targetSkill}
                    description="用于自动生成钉钉投票标题、说明与随卡发送的附件建议；修改后可立即重新生成。"
                    onClick={() => setEditSkill(true)}
                  />
                  <header className="pane-title">
                    <div>
                      <b>投票内容</b>
                      <p>
                        {generated
                          ? "已按最新投票智能设置技能重新生成，可继续人工调整。"
                          : "确认投票标题、说明和附件后发起。"}
                      </p>
                    </div>
                  </header>
                  <label>
                    投票标题
                    <input
                      value={voteTitle}
                      onChange={(e) => setVoteTitle(e.target.value)}
                    />
                  </label>
                  <label>
                    投票说明
                    <textarea
                      value={voteDescription}
                      onChange={(e) => setVoteDescription(e.target.value)}
                    />
                  </label>
                  <div className="vote-attachments">
                    <header>
                      <b>随卡片发送的附件</b>
                      <button
                        className="plain"
                        onClick={() =>
                          setVoteAttachments((v) => [
                            ...v,
                            `投票补充材料_${v.length + 1}.pdf`,
                          ])
                        }
                      >
                        + 上传附件
                      </button>
                    </header>
                    {voteAttachments.map((a, i) => (
                      <div key={`${a}-${i}`}>
                        <span>
                          <FileText size={15} />
                          {a}
                        </span>
                        <button
                          onClick={() =>
                            setVoteAttachments((v) =>
                              v.filter((_, n) => n !== i),
                            )
                          }
                        >
                          删除
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <ContextSkillBar
                    skill={targetSkill}
                    description="用于按投票结果生成钉钉决议通知与后续执行提醒；修改后可立即重新生成。"
                    onClick={() => setEditSkill(true)}
                  />
                  <header className="pane-title">
                    <div>
                      <b>建议发送话术</b>
                      <p>
                        {generated
                          ? "已按最新决议话术生成技能重新生成，可继续人工调整。"
                          : "确认话术后生成钉钉决议通知。"}
                      </p>
                    </div>
                  </header>
                  <textarea
                    value={speechDraft}
                    onChange={(e) => setSpeechDraft(e.target.value)}
                  />
                </>
              )}
            </div>
            <footer>
              {isVote ? (
                <button className="pam-primary" onClick={launchVote}>
                  <Vote size={15} />
                  确认并发起投票
                </button>
              ) : (
                <>
                  <button className="plain" onClick={onClose}>
                    仅保存草稿
                  </button>
                  <button
                    className="pam-primary"
                    onClick={() => {
                      notice("已生成并模拟发送钉钉决议通知");
                      onClose();
                    }}
                  >
                    <Send size={15} />
                    确认生成通知
                  </button>
                </>
              )}
            </footer>
          </>
        ) : (
          <>
            <div className="review-modal">
              <section>
                <b>
                  {kind.includes("functional")
                    ? "职能审核依据"
                    : "审核分析结果"}
                </b>
                <p>
                  {skill
                    ? "系统已基于已保存技能生成建议；请在确认前人工复核。"
                    : "当前为人工审核，请结合申请表及附件填写意见。"}
                </p>
                <div className="review-chips">
                  <span>材料完整性</span>
                  <span>制度依据</span>
                  <span>预算口径</span>
                  <span>专业风险</span>
                </div>
              </section>
              <label>
                审核意见（可人工修改）
                <textarea
                  value={opinion}
                  onChange={(e) => setOpinion(e.target.value)}
                />
              </label>
            </div>
            <footer>
              <button className="danger" onClick={reject}>
                驳回
              </button>
              <button className="pam-primary" onClick={approve}>
                <Check size={15} />
                通过
              </button>
            </footer>
          </>
        )}
      </section>
    </div>
  );
}
function RejectReasonModal({ p, onClose, onConfirm }: { p: Proposal; onClose: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("投票未通过，委员认为关键论证与投资回收期测算仍不充分，请补充后重新提交。");
  return <div className="pam-overlay"><section className="pam-modal reject-reason-modal"><header><div><small>{p.id} · 投票结果处理</small><h2>驳回议案</h2><p>{p.title}</p></div><button onClick={onClose}><X /></button></header><section><label>驳回理由<textarea value={reason} onChange={(e) => setReason(e.target.value)} placeholder="请填写驳回理由，申请人将收到钉钉卡片通知。" /></label><p className="reject-hint">提交后将记录本次驳回人、意见和状态变更，并回传至申请人的“我的议案”。</p></section><footer><button className="plain" onClick={onClose}>取消</button><button className="danger" onClick={() => onConfirm(reason)}>确认驳回</button></footer></section></div>;
}
function App() {
  const { page, setPage } = useHashPage(route);
  const activePage = ["my-proposals", "pre-review", "audit-list"].includes(page) ? "lifecycle" : page;
  const [workspace, setWorkspace] = useState<"user" | "monitor" | "h5-scenes">(
    monitorPages.has(activePage as never) ? "monitor" : dingtalkScenePages.has(activePage as never) ? "h5-scenes" : "user",
  );
  useEffect(() => {
    const nextWorkspace = monitorPages.has(activePage as never) ? "monitor" : dingtalkScenePages.has(activePage as never) ? "h5-scenes" : "user";
    setWorkspace((current) => current === nextWorkspace ? current : nextWorkspace);
  }, [activePage]);
  const [items, setItems] = useState([...original, ...organizeDemoItems, ...deliberationDemoItems]);
  const [skills, setSkills] = useState(skillsSeed);
  const [templates, setTemplates] = useState(templatesSeed);
  const [taskTemplates, setTaskTemplates] = useState(taskTemplatesSeed);
  const [detail, setDetail] = useState<Proposal | null>(null);
  const [reviewDetail, setReviewDetail] = useState<{
    p: Proposal;
    mode: "pre" | "audit";
    auto: boolean;
  } | null>(null);
  const [personal, setPersonal] = useState<Proposal | null>(null);
  const [drafts, setDrafts] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<{ kind: string; p: Proposal } | null>(
    null,
  );
  const [rejectTarget, setRejectTarget] = useState<Proposal | null>(null);
  const [organizeAudit, setOrganizeAudit] = useState<Proposal | null>(null);
  const [submitPreview, setSubmitPreview] = useState<Proposal | null>(null);
  const [sendPreview, setSendPreview] = useState<Proposal | null>(null);
  const [templatePreview, setTemplatePreview] = useState<Proposal | null>(null);
  const [meetingFlow, setMeetingFlow] = useState<{ kind: "materials" | "attendees" | "remind"; p: Proposal } | null>(null);
  const [deliberationSetup, setDeliberationSetup] = useState<Proposal | null>(null);
  const [voteDeliberation, setVoteDeliberation] = useState<Proposal | null>(null);
  const [meetingEndTarget, setMeetingEndTarget] = useState<Proposal | null>(null);
  const [meetingOutcomeTarget, setMeetingOutcomeTarget] = useState<Proposal | null>(null);
  const [announcementTarget, setAnnouncementTarget] = useState<{ p: Proposal; readonly: boolean } | null>(null);
  const [taskFlow, setTaskFlow] = useState<{ kind: "breakdown" | "dispatch"; p: Proposal } | null>(null);
  const [taskProgress, setTaskProgress] = useState<Proposal | null>(null);
  const [executionDetail, setExecutionDetail] = useState<Proposal | null>(null);
  const [executionReview, setExecutionReview] = useState<Proposal | null>(null);
  const [executionArchive, setExecutionArchive] = useState<Proposal | null>(null);
  const [toast, setToast] = useState("");
  useEffect(() => {
    const showTemplate = (event: Event) => setTemplatePreview((event as CustomEvent<Proposal>).detail);
    window.addEventListener("proposal-template-preview", showTemplate);
    return () => window.removeEventListener("proposal-template-preview", showTemplate);
  }, []);
  const notice = (s: string) => {
    setToast(s);
    setTimeout(() => setToast(""), 3200);
  };
  const switchWorkspace = (next: "user" | "monitor" | "h5-scenes") => {
    setWorkspace(next);
    const pages = next === "user" ? userPages : next === "monitor" ? monitorPages : dingtalkScenePages;
    if (!pages.has(page as never)) {
      if (next === "user") setPage("lifecycle");
      else if (next === "monitor") setPage("digital-employee-flow");
      else setPage("dingtalk-h5-scenes");
    }
  };
  const update = (id: string, stage: Stage, status: string, reason?: string) =>
    setItems((v) =>
      v.map((p) =>
        p.id === id
          ? {
              ...p,
              stage,
              status,
              reason: reason ?? p.reason,
              revised:
                stage === "functional" && p.stage === "returned"
                  ? true
                  : p.revised,
            }
          : p,
      ),
    );
  const savePersonal = (p: Proposal, attachments: string[]) => {
    setItems((v) =>
      v.map((x) => (x.id === p.id ? { ...x, title: p.title, attachments } : x)),
    );
    setDrafts((v) => new Set([...v, p.id]));
    notice("修改已保存，请确认后点击“提交”重新发起审核");
  };
  const submitPersonal = (p: Proposal) => {
    update(p.id, "functional", "驳回修改后 · 待职能预审");
    setDrafts((v) => {
      const n = new Set(v);
      n.delete(p.id);
      return n;
    });
    notice("已提交修改后的议案，系统已保留版本记录并重新发送职能预审");
  };
  const open = (kind: string, p: Proposal) => {
    if (kind === "reject") {
      setDetail(p);
      return;
    }
    if (kind === "functional" || kind === "audit") {
      setReviewDetail({
        p,
        mode: kind === "functional" ? "pre" : "audit",
        auto: true,
      });
      return;
    }
    setModal({ kind, p });
  };
  const openReview = (mode: "pre" | "audit") => (p: Proposal) =>
    setReviewDetail({ p, mode, auto: false });
  const common = {
    items,
    skills,
    onDetail: setDetail,
    onOpen: open,
    setItems,
    notice,
  };
  let content: React.ReactNode;
  if (activePage === "lifecycle") content = <Lifecycle items={items} onDetail={setDetail} />;
  else if (activePage === "organize-submit") content = <OrganizeSubmit items={items} onDetail={setDetail} onOpen={open} onAudit={setOrganizeAudit} notice={notice} />;
  else if (activePage === "meeting-materials") content = <MeetingMaterials items={items} onSetup={setDeliberationSetup} onVote={setVoteDeliberation} onMeetingEnd={setMeetingEndTarget} onAnnouncement={(p) => setAnnouncementTarget({ p, readonly: false })} onAnnouncementView={(p) => setAnnouncementTarget({ p, readonly: true })} />;
  else if (activePage === "task-breakdown") content = <TaskBreakdownPage items={items} onDetail={setDetail} onFlow={(kind, p) => setTaskFlow({ kind, p })} onProgress={setTaskProgress} />;
  else if (activePage === "execution-tracking") content = <ExecutionTracking items={items} onOpen={setExecutionDetail} onReview={setExecutionReview} onArchive={setExecutionArchive} />;
  else if (activePage === "digital-employee-flow") content = <DigitalEmployeeFlow notice={notice} />;
  else if (activePage === "dingtalk-h5-scenes") content = <DingtalkH5Scenes notice={notice} />;
  else if (activePage === "skills")
    content = <Skills skills={skills} setSkills={setSkills} notice={notice} />;
  else if (activePage === "templates")
    content = <Templates templates={templates} setTemplates={setTemplates} taskTemplates={taskTemplates} setTaskTemplates={setTaskTemplates} notice={notice} />;
  else content = <Permissions />;
  return (
    <>
      <style>
        {personalCss +
          organizeCss +
          skillPopupCss +
          layoutRepairCss +
          contextSkillCss +
          organizeScrollCss +
          organizeAuditCss +
          organizeExpandCss +
          submissionCss +
          submissionScrollCss +
          disabledActionCss +
          organizeStatusFilterCss +
          deliberationStatusFilterCss +
          templatePreviewCss +
  meetingFlowCss +
  deliberationSetupCss +
  deliberationSetupOverridesCss +
  deliberationSetupPolishCss +
  deliberationResultCss +
  announcementNoticeCss +
  announcementNoticePolishCss +
  deliberationVoterSelectCss +
  deliberationOutcomePolishCss +
  sheetSkillOverviewCss +
  organizeAuditSkillCss +
  organizeAuditSkillEditableCss +
  skillContextGuideCss +
  skillWritingGuideCss +
  skillWritingGuideRefinedCss +
  skillWritingGuidePlainCss +
  templateCss +
          taskFlowCss +
          executionCss +
          drawerModalCss +
          organizeFlowCss}
      </style>
      <Shell page={activePage} setPage={setPage} workspace={workspace} setWorkspace={switchWorkspace}>
        {content}
        {personal && (
          <PersonalDetail
            p={personal}
            onClose={() => setPersonal(null)}
            onSave={savePersonal}
            onSubmit={submitPersonal}
            draft={drafts.has(personal.id)}
          />
        )}{" "}
        {reviewDetail && (
          <ReviewDetail
            p={reviewDetail.p}
            mode={reviewDetail.mode}
            auto={reviewDetail.auto}
            onClose={() => setReviewDetail(null)}
            onUpdate={(stage, status, reason) =>
              update(reviewDetail.p.id, stage, status, reason)
            }
            notice={notice}
          />
        )}{" "}
        {detail && <Detail p={detail} onClose={() => setDetail(null)} />}{" "}
        {organizeAudit && (
          <OrganizeAuditDetail
            p={organizeAudit}
            status={organizeQueueStatus(organizeAudit)}
            onClose={() => setOrganizeAudit(null)}
            onPass={() => {
              const isApproval = organizeQueueStatus(organizeAudit) === "预审通过";
              setItems((v) => v.map((p) => p.id === organizeAudit.id ? { ...p, stage: isApproval ? "auditpassed" : "functional", status: isApproval ? "审核通过" : "预审中", lifecycleStatus: isApproval ? "审核通过" : "预审中", organizeStatus: isApproval ? "审核通过" : "预审中", changeTime: "刚刚" } : p));
              notice(isApproval ? "审核已通过，议案状态已更新" : "已提交预审，议案进入预审中");
              setOrganizeAudit(null);
            }}
            onReturn={() => {
              setItems((v) => v.map((p) => p.id === organizeAudit.id ? { ...p, stage: "returned", status: "驳回修改", lifecycleStatus: "驳回修改", organizeStatus: "驳回修改中", changeTime: "刚刚" } : p));
              notice("已驳回修改，申请人将收到修改通知");
              setOrganizeAudit(null);
            }}
          />
        )}{" "}
        {submitPreview && (
          <SubmissionPreview
            p={submitPreview}
            onClose={() => setSubmitPreview(null)}
            onConfirm={() => {
              setItems((v) => v.map((p) => p.id === submitPreview.id ? { ...p, lifecycleStatus: "预审中", changeTime: "刚刚" } : p));
              notice("已提交预审，议案已进入预审中");
              setSubmitPreview(null);
            }}
          />
        )}{" "}
        {sendPreview && (
          <SubmissionPreview
            p={sendPreview}
            mode="send"
            onClose={() => setSendPreview(null)}
            onConfirm={() => {
              setItems((v) => v.map((p) => p.id === sendPreview.id ? { ...p, lifecycleStatus: "议案审核中", changeTime: "刚刚" } : p));
              notice("已确认送审，议案进入后续审核流程");
              setSendPreview(null);
            }}
          />
        )}{" "}
        {templatePreview && <TemplatePreview p={templatePreview} templates={templates} onClose={() => setTemplatePreview(null)} />}{" "}
        {meetingFlow?.kind === "materials" && <MeetingMaterialsDraft p={meetingFlow.p} onClose={() => setMeetingFlow(null)} onNext={() => { setMeetingFlow({ kind: "attendees", p: meetingFlow.p }); notice("议会材料已确认，正在整理参会与投票信息"); }} />}{" "}
        {meetingFlow?.kind === "attendees" && <AttendeeInfoDraft p={meetingFlow.p} onClose={() => setMeetingFlow(null)} onConfirm={() => { setItems((v) => v.map((p) => p.id === meetingFlow.p.id ? { ...p, lifecycleStatus: "待投票", changeTime: "刚刚" } : p)); notice("参会人与投票人已确认，已生成线上会议投票通知"); setMeetingFlow(null); }} />}{" "}
        {meetingFlow?.kind === "remind" && <VoteReminder p={meetingFlow.p} onClose={() => setMeetingFlow(null)} onSend={(names) => { notice(`已向 ${names.join("、")} 发送催票提醒`); setMeetingFlow(null); }} />}{" "}
        {deliberationSetup && <DeliberationSetupModal p={deliberationSetup} notice={notice} onClose={() => setDeliberationSetup(null)} onSend={(type, deliberationContent) => { const deliberationStatus: DeliberationStatus = type === "group" ? "投票审议中" : type === "online" ? "线上会议审议中" : "线下会议审议中"; setItems((list) => list.map((p) => p.id === deliberationSetup.id ? { ...p, lifecycleStatus: deliberationStatus, deliberationStatus, deliberationContent, changeTime: "刚刚" } : p)); notice(`${type === "group" ? "群投票" : type === "online" ? "线上会议" : "线下会议"}审议信息已生成，等待发送与后续处理`); setDeliberationSetup(null); }} />}{" "}
        {voteDeliberation && <VoteDeliberationModal p={voteDeliberation} onClose={() => setVoteDeliberation(null)} onAnnouncement={() => { setVoteDeliberation(null); setAnnouncementTarget({ p: { ...voteDeliberation, deliberationStatus: "审议完成", deliberationOutcome: voteDeliberation.deliberationOutcome || "通过" }, readonly: false }); }} />}{" "}
        {meetingEndTarget && <MeetingEndConfirm p={meetingEndTarget} onClose={() => setMeetingEndTarget(null)} onConfirm={() => { setMeetingOutcomeTarget(meetingEndTarget); setMeetingEndTarget(null); }} />}{" "}
        {meetingOutcomeTarget && <MeetingOutcomeEntry p={meetingOutcomeTarget} onClose={() => setMeetingOutcomeTarget(null)} onConfirm={(outcome, advice) => { setItems((list) => list.map((p) => p.id === meetingOutcomeTarget.id ? { ...p, deliberationStatus: "审议完成", deliberationOutcome: outcome, deliberationAdvice: advice, changeTime: "刚刚" } : p)); notice("审议结果已录入，议案进入审议完成状态"); setMeetingOutcomeTarget(null); }} />}{" "}
        {announcementTarget && <AnnouncementModal p={announcementTarget.p} readonly={announcementTarget.readonly} onClose={() => setAnnouncementTarget(null)} onSend={() => { setItems((list) => list.map((p) => p.id === announcementTarget.p.id ? { ...p, deliberationStatus: "公告已发送", changeTime: "刚刚" } : p)); notice("审议结果公告已发送"); setAnnouncementTarget(null); }} />}{" "}
        {taskFlow?.kind === "breakdown" && <TaskBreakdownModal p={taskFlow.p} templates={taskTemplates} onClose={() => setTaskFlow(null)} onConfirm={(nodes) => { setItems((list) => list.map((p) => p.id === taskFlow.p.id ? { ...p, taskStatus: "任务待分发", taskNodes: nodes, changeTime: "刚刚" } : p)); notice("任务已完成拆解，进入智能分发环节"); setTaskFlow(null); }} />}{" "}
        {taskFlow?.kind === "dispatch" && <TaskDispatchModal p={taskFlow.p} templates={taskTemplates} onClose={() => setTaskFlow(null)} onConfirm={() => { setItems((list) => list.map((p) => p.id === taskFlow.p.id ? { ...p, taskStatus: "任务审批中", changeTime: "刚刚" } : p)); notice("任务已确认分发，正在进入董事局审批与委员会备案流程"); setTaskFlow(null); }} />}{" "}
        {taskProgress && <TaskApprovalProgress p={taskProgress} onClose={() => setTaskProgress(null)} />}{" "}
        {executionDetail && <ExecutionProgressModal p={executionDetail} templates={taskTemplates} onClose={() => setExecutionDetail(null)} onRemind={() => notice(`已向 ${defaultTaskNodes(executionDetail, taskTemplates)[1]?.owner || defaultTaskNodes(executionDetail, taskTemplates)[0].owner} 发送节点催办提醒`)} />}{" "}
        {executionReview && <ExecutionReviewModal p={executionReview} templates={taskTemplates} onClose={() => setExecutionReview(null)} onReject={(summary) => { setItems((list) => list.map((p) => p.id === executionReview.id ? { ...p, executionStatus: "驳回修改", changeTime: "刚刚", executionRevision: { reviewer: "周敏", time: "刚刚", opinion: summary, changes: "待责任部门回传本轮修改内容。" } } : p)); notice("节点审核已驳回，责任部门将收到修改建议"); setExecutionReview(null); }} onPass={() => { setItems((list) => list.map((p) => p.id === executionReview.id ? { ...p, executionStatus: "执行中", changeTime: "刚刚" } : p)); notice("当前节点审核通过，已进入下一执行节点"); setExecutionReview(null); }} />}{" "}
        {executionArchive && <ExecutionArchiveModal p={executionArchive} onClose={() => setExecutionArchive(null)} onConfirm={() => { setItems((list) => list.map((p) => p.id === executionArchive.id ? { ...p, executionStatus: "已归档", lifecycleStatus: "已归档", changeTime: "刚刚" } : p)); notice("执行总结报告与全流程资料已打包提交归档"); setExecutionArchive(null); }} />}{" "}
        {modal && (
          <WorkModal
            kind={modal.kind}
            p={modal.p}
            skills={skills}
            setSkills={setSkills}
            skill={
              modal.kind === "functional"
                ? skills.find((s) => s.id === "functional")?.enabled
                : modal.kind === "audit"
                  ? skills.find((s) => s.id === "audit")?.enabled
                  : undefined
            }
            onClose={() => setModal(null)}
            onUpdate={(stage, status, reason) => {
              if (modal.kind === "organize-confirm") {
                const isReturned = stage === "returned";
                setItems((list) => list.map((item) => item.id === modal.p.id ? { ...item, stage, status, reason: reason ?? item.reason, lifecycleStatus: isReturned ? "驳回修改" : "预审中", organizeStatus: isReturned ? "驳回修改中" : "预审中", changeTime: "刚刚" } : item));
              } else update(modal.p.id, stage, status, reason);
            }}
            notice={notice}
          />
        )}{" "}
        {rejectTarget && <RejectReasonModal p={rejectTarget} onClose={() => setRejectTarget(null)} onConfirm={(reason) => { update(rejectTarget.id, "votefailed", "投票未通过", reason); setItems((v) => v.map((p) => p.id === rejectTarget.id ? { ...p, lifecycleStatus: "未通过", changeTime: "刚刚", rejectionHistory: [{ person: "chenyi", role: "战略执行委员会", time: "2026-08-12 11:35", opinion: reason, changes: "投票未通过，议案流程已结束。" }, ...(p.rejectionHistory || [])] } : p)); notice("已确认投票未通过并通知申请人，议案流程已结束"); setRejectTarget(null); }} />}
        {toast && (
          <div className="pam-toast">
            <Check size={16} />
            {toast}
          </div>
        )}
      </Shell>
    </>
  );
}
export default App;
