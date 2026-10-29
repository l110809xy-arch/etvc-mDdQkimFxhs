/**
 * 后台可编辑的文案字段清单
 *
 * 只放「经常需要改、且是纯文本」的字段。结构化内容（地址数组、学费表、
 * 课程列表）留在代码里，避免后台表单把数据改坏。
 *
 * key 与页面里 t(value, key) 的第二个参数一一对应。
 */

import { announcement, apply, faq, hero } from "./content";
import type { Localized } from "./i18n";

export type EditableField = {
  key: string;
  group: string;
  label: string;
  hint?: string;
  value: Localized;
  multiline?: boolean;
};

export const editableFields: EditableField[] = [
  {
    group: "招生公告",
    key: "announcement.text",
    label: "公告主文案",
    hint: "首页顶部横条与招生区块右侧显示",
    value: announcement.text,
    multiline: true,
  },
  {
    group: "招生公告",
    key: "announcement.deadline",
    label: "报名时间说明",
    value: announcement.deadline,
  },
  {
    group: "首屏",
    key: "hero.lead",
    label: "副标题",
    hint: "主标题下方那一段",
    value: hero.lead,
    multiline: true,
  },
  {
    group: "在线报名",
    key: "apply.intro",
    label: "报名区说明",
    hint: "表单左侧的说明文字",
    value: apply.intro,
    multiline: true,
  },
  {
    group: "常见问题",
    key: "faq.intro",
    label: "FAQ 前言",
    value: faq.intro,
    multiline: true,
  },
];

export const editableGroups = [...new Set(editableFields.map((f) => f.group))];
