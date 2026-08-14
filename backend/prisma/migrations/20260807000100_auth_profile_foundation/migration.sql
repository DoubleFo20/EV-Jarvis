-- EV-JARVIS-DEV Auth/Profile foundation.
-- This migration is intentionally atomic and limited to users/user_profiles.

BEGIN;

CREATE TYPE "public"."system_role" AS ENUM ('user', 'admin');

CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "role" "public"."system_role" NOT NULL DEFAULT 'user',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "terms_accepted_at" TIMESTAMPTZ(6) NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "users_auth_user_fkey" FOREIGN KEY ("id")
      REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

CREATE TABLE "public"."user_profiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "full_name" VARCHAR(100),
    "phone_number" VARCHAR(20),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "user_profiles_user_id_fkey" FOREIGN KEY ("user_id")
      REFERENCES "public"."users"("id") ON DELETE CASCADE
);

CREATE UNIQUE INDEX "user_profiles_user_id_key"
  ON "public"."user_profiles"("user_id");
CREATE UNIQUE INDEX "user_profiles_phone_number_key"
  ON "public"."user_profiles"("phone_number");

CREATE FUNCTION "public"."set_auth_updated_at"()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER "users_set_updated_at"
BEFORE UPDATE ON "public"."users"
FOR EACH ROW EXECUTE FUNCTION "public"."set_auth_updated_at"();

CREATE TRIGGER "user_profiles_set_updated_at"
BEFORE UPDATE ON "public"."user_profiles"
FOR EACH ROW EXECUTE FUNCTION "public"."set_auth_updated_at"();

REVOKE ALL ON FUNCTION "public"."set_auth_updated_at"() FROM PUBLIC;

CREATE FUNCTION "public"."handle_new_auth_user"()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF COALESCE(NEW.raw_user_meta_data ->> 'terms_consent', 'false') <> 'true' THEN
    RAISE EXCEPTION USING
      ERRCODE = '23514',
      MESSAGE = 'terms consent is required';
  END IF;

  INSERT INTO "public"."users" ("id", "email", "role", "terms_accepted_at")
  VALUES (
    NEW.id,
    NEW.email,
    'user'::"public"."system_role",
    CURRENT_TIMESTAMP
  );

  INSERT INTO "public"."user_profiles" ("user_id", "full_name")
  VALUES (NEW.id, NULLIF(NEW.raw_user_meta_data ->> 'full_name', ''));

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION "public"."handle_new_auth_user"() FROM PUBLIC;

CREATE TRIGGER "on_auth_user_created"
AFTER INSERT ON "auth"."users"
FOR EACH ROW EXECUTE FUNCTION "public"."handle_new_auth_user"();

ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "public"."users" FROM anon, authenticated;
REVOKE ALL ON TABLE "public"."user_profiles" FROM anon, authenticated;
GRANT SELECT ON TABLE "public"."users" TO authenticated;
GRANT SELECT ON TABLE "public"."user_profiles" TO authenticated;
GRANT UPDATE ("full_name", "phone_number")
  ON TABLE "public"."user_profiles" TO authenticated;

CREATE POLICY "users_select_owner_or_admin"
ON "public"."users"
FOR SELECT
TO authenticated
USING (
  (SELECT auth.uid()) = "id"
  OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "user_profiles_select_owner_or_admin"
ON "public"."user_profiles"
FOR SELECT
TO authenticated
USING (
  (SELECT auth.uid()) = "user_id"
  OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "user_profiles_update_owner_or_admin"
ON "public"."user_profiles"
FOR UPDATE
TO authenticated
USING (
  (SELECT auth.uid()) = "user_id"
  OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (SELECT auth.uid()) = "user_id"
  OR (SELECT auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

COMMIT;
