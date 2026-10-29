-- =============================================================
-- ETVC 官网数据库结构（Supabase / PostgreSQL）
-- 用法：Supabase 控制台 → SQL Editor → 新建查询 → 粘贴全文 → Run
-- 可重复执行（全部 if not exists / drop policy if exists）
-- =============================================================

create extension if not exists "pgcrypto";

-- -------------------------------------------------------------
-- 1. 报名表 applications
--    对应「在线报名」：学生提交的原始资料
-- -------------------------------------------------------------
create table if not exists public.applications (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- 个人信息
  full_name     text not null,
  gender        text check (gender in ('male', 'female', 'other')),
  birth_date    date,
  phone         text not null,
  email         text,

  -- 住址（老挝行政区划：省 / 县 / 村）
  province      text,
  district      text,
  village       text,

  -- 学历
  high_school   text,
  grad_year     int,
  gpa           numeric(4, 2),

  -- 意向
  program_id    text not null default 'higher-diploma',
  intake        text not null default '2026-2027',
  scholarship   boolean not null default false,
  scholarship_type text check (scholarship_type in ('merit', 'need')),
  note          text,

  -- 元信息
  locale        text default 'lo',
  status        text not null default 'pending'
                check (status in ('pending', 'reviewing', 'accepted', 'rejected', 'enrolled')),
  status_note   text,
  reviewed_at   timestamptz,
  reviewed_by   uuid,
  ip_hash       text
);

create index if not exists applications_status_idx on public.applications (status, created_at desc);
create index if not exists applications_created_idx on public.applications (created_at desc);
create index if not exists applications_phone_idx on public.applications (phone);
-- 同一手机号 24 小时内只能提交一次（防刷），由接口层判断，这里建索引加速
create index if not exists applications_phone_time_idx on public.applications (phone, created_at desc);

comment on table public.applications is '在线报名表提交记录';

-- -------------------------------------------------------------
-- 2. 留言 / 线索 leads
--    学生留下的联系方式，招生老师跟进用
-- -------------------------------------------------------------
create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text,
  phone       text not null,
  email       text,
  message     text,
  source      text not null default 'contact-form'
              check (source in ('contact-form', 'chat', 'application')),
  locale      text default 'lo',
  handled     boolean not null default false,
  handled_at  timestamptz,
  note        text,
  ip_hash     text
);

create index if not exists leads_handled_idx on public.leads (handled, created_at desc);

comment on table public.leads is '留言与咨询线索';

-- -------------------------------------------------------------
-- 3. 客服对话 chat_messages
--    按 session_id 归组，用于回看和优化知识库
-- -------------------------------------------------------------
create table if not exists public.chat_messages (
  id          bigserial primary key,
  created_at  timestamptz not null default now(),
  session_id  text not null,
  locale      text,
  role        text not null check (role in ('user', 'assistant')),
  content     text not null,
  ip_hash     text
);

create index if not exists chat_messages_session_idx on public.chat_messages (session_id, id);
create index if not exists chat_messages_created_idx on public.chat_messages (created_at desc);

comment on table public.chat_messages is 'AI 客服对话记录';

-- -------------------------------------------------------------
-- 4. 文案覆盖 content_overrides
--    只存「被改过的」文案，没改的继续用 lib/content.ts 的默认值
--    key 形如 announcement.title / tuition.note
-- -------------------------------------------------------------
create table if not exists public.content_overrides (
  key         text not null,
  locale      text not null check (locale in ('zh', 'en', 'lo', 'ko')),
  value       text not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid,
  primary key (key, locale)
);

comment on table public.content_overrides is '后台可编辑文案的覆盖值';

-- -------------------------------------------------------------
-- 5. 站点设置 settings
--    名额、截止日期这类单个数值，用 jsonb 存便于扩展
-- -------------------------------------------------------------
create table if not exists public.settings (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now(),
  updated_by  uuid
);

comment on table public.settings is '站点级设置：招生名额、截止日期、公告开关等';

-- -------------------------------------------------------------
-- 6. 管理员 admins
--    与 Supabase Auth 的 auth.users 对应；只有在这张表里的人能进后台
-- -------------------------------------------------------------
create table if not exists public.admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  email       text,
  name        text,
  role        text not null default 'admin' check (role in ('admin', 'viewer')),
  created_at  timestamptz not null default now()
);

comment on table public.admins is '后台管理员白名单';

-- -------------------------------------------------------------
-- 7. 报名统计视图（后台首页用）
-- -------------------------------------------------------------
create or replace view public.application_stats as
select
  count(*)                                                    as total,
  count(*) filter (where status = 'pending')                   as pending,
  count(*) filter (where status = 'reviewing')                 as reviewing,
  count(*) filter (where status = 'accepted')                  as accepted,
  count(*) filter (where status = 'rejected')                  as rejected,
  count(*) filter (where status = 'enrolled')                  as enrolled,
  count(*) filter (where scholarship)                          as scholarship_applied,
  count(*) filter (where created_at > now() - interval '7 days') as last_7_days,
  count(*) filter (where created_at > now() - interval '30 days') as last_30_days
from public.applications;

-- -------------------------------------------------------------
-- 8. 行级安全（RLS）
--    开启后默认拒绝一切匿名访问。
--    本站所有读写都经过 Next.js 服务端（service_role 密钥），
--    浏览器永远拿不到密钥，也永远不直连数据库。
-- -------------------------------------------------------------
alter table public.applications       enable row level security;
alter table public.leads              enable row level security;
alter table public.chat_messages      enable row level security;
alter table public.content_overrides  enable row level security;
alter table public.settings           enable row level security;
alter table public.admins             enable row level security;

-- 显式撤销 anon / authenticated 的权限，只留 service_role
revoke all on public.applications      from anon, authenticated;
revoke all on public.leads             from anon, authenticated;
revoke all on public.chat_messages     from anon, authenticated;
revoke all on public.content_overrides from anon, authenticated;
revoke all on public.settings          from anon, authenticated;
revoke all on public.admins            from anon, authenticated;
revoke all on public.application_stats from anon, authenticated;

-- -------------------------------------------------------------
-- 9. 初始数据
-- -------------------------------------------------------------
insert into public.settings (key, value)
values
  ('admission.open', 'true'::jsonb),
  ('admission.quota', '120'::jsonb),
  ('admission.scholarship_quota', '50'::jsonb),
  ('admission.deadline', '"2026-09-21"'::jsonb),
  ('admission.intake', '"2026-2027"'::jsonb)
on conflict (key) do nothing;

-- 完成提示
select 'schema ready' as status,
       (select count(*) from public.applications) as applications,
       (select count(*) from public.settings) as settings;
