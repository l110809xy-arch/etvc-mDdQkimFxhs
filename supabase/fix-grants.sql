-- =============================================================
-- 修复 service_role 的表权限
-- 症状：接口返回 42501 "Grant the required privileges to the
--       current role with: GRANT SELECT ON public.xxx TO service_role"
-- 原因：schema.sql 里 revoke 了 anon/authenticated，但新项目没有
--       给 service_role 预置表权限，需要显式授权。
-- 用法：SQL Editor 粘贴执行一次即可（可重复执行）
-- =============================================================

grant usage on schema public to service_role;

grant all privileges on all tables    in schema public to service_role;
grant all privileges on all sequences in schema public to service_role;
grant all privileges on all functions in schema public to service_role;

-- 以后新建的表也自动带上权限，省得再修一次
alter default privileges in schema public
  grant all privileges on tables to service_role;
alter default privileges in schema public
  grant all privileges on sequences to service_role;

select 'grants fixed' as status;
