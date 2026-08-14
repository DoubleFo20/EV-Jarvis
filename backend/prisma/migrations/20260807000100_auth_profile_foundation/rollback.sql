-- Reviewed rollback for 20260807000100_auth_profile_foundation.
-- Execute manually only after explicit owner approval and after confirming that
-- dependent Auth/Profile data can be permanently removed.

BEGIN;

DROP TRIGGER IF EXISTS "on_auth_user_created" ON "auth"."users";
DROP FUNCTION IF EXISTS "public"."handle_new_auth_user"();

DROP POLICY IF EXISTS "user_profiles_update_owner_or_admin"
  ON "public"."user_profiles";
DROP POLICY IF EXISTS "user_profiles_select_owner_or_admin"
  ON "public"."user_profiles";
DROP POLICY IF EXISTS "users_select_owner_or_admin" ON "public"."users";

DROP TRIGGER IF EXISTS "user_profiles_set_updated_at"
  ON "public"."user_profiles";
DROP TRIGGER IF EXISTS "users_set_updated_at" ON "public"."users";
DROP FUNCTION IF EXISTS "public"."set_auth_updated_at"();

DROP TABLE IF EXISTS "public"."user_profiles";
DROP TABLE IF EXISTS "public"."users";
DROP TYPE IF EXISTS "public"."system_role";

COMMIT;
