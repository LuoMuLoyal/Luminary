/**
 * 由 `pnpm --filter @luminary/lumine contract` 生成，**请勿手改**。
 *
 * 契约源：Lucent 的 docs/reference/generated/openapi.json
 * 生成器：openapi-typescript
 *
 * 改了后端契约时的流程：
 *   1. 在 Lucent 执行 `pnpm export:openapi`
 *   2. 在 apps/lumine 执行 `pnpm contract`
 *   3. 提交本文件与改动一起
 */

export type paths = {
    "/api/v1/account": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get authenticated account profile */
        get: operations["getAccount"];
        put?: never;
        post?: never;
        /** Delete authenticated account */
        delete: operations["deleteAccount"];
        options?: never;
        head?: never;
        /** Update authenticated account profile */
        patch: operations["updateAccount"];
        trace?: never;
    };
    "/api/v1/account/email": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Change authenticated account email */
        post: operations["changeEmail"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/account/identities/{identityId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Unlink authenticated account OAuth identity */
        delete: operations["unlinkIdentity"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/account/identities/wechat-mobile/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Link WeChat mobile identity to authenticated account */
        post: operations["linkWechatMobileIdentity"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/account/identities/wechat-web/authorize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create WeChat web OAuth authorize URL for linking */
        post: operations["createWechatWebIdentityLinkAuthorizeUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/account/identities/wechat-web/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Link WeChat web identity to authenticated account */
        post: operations["linkWechatWebIdentity"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/account/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Change authenticated account password */
        post: operations["changePassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/account/set-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Set initial password for OAuth-only account using email verification */
        post: operations["setPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/admins": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List administrator grants */
        get: operations["listAdminGrants"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/admins/{userId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Grant or change an administrator role */
        put: operations["setAdminRole"];
        post?: never;
        /** Revoke an administrator role */
        delete: operations["removeAdminGrant"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/audit-logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List security audit log entries */
        get: operations["listAdminAuditLogs"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content/legal-documents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List legal documents for administration */
        get: operations["listAdminLegalDocuments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content/legal-documents/{docType}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a legal document */
        put: operations["updateAdminLegalDocument"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content/qa-chunks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List the assistant's open medical Q&A corpus chunks */
        get: operations["listAdminQaChunks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content/qa-chunks/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a QA corpus chunk */
        put: operations["updateAdminQaChunk"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content/safety-tips": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List medication safety tips for administration */
        get: operations["listAdminSafetyTips"];
        put?: never;
        /** Create a medication safety tip */
        post: operations["createAdminSafetyTip"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/content/safety-tips/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Update a medication safety tip */
        put: operations["updateAdminSafetyTip"];
        post?: never;
        /** Delete a medication safety tip */
        delete: operations["deleteAdminSafetyTip"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/data/{resource}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List rows of a registered admin resource */
        get: operations["listAdminResourceRows"];
        put?: never;
        /** Create a row of a registered admin resource */
        post: operations["createAdminResourceRow"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/data/{resource}/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one row of a registered admin resource */
        get: operations["getAdminResourceRow"];
        /** Update a row of a registered admin resource */
        put: operations["updateAdminResourceRow"];
        post?: never;
        /** Delete (or soft-delete) a row of a registered resource */
        delete: operations["deleteAdminResourceRow"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/dependencies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get enablement of the optional assistant sidecars */
        get: operations["getAdminDependencies"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the current administrator identity and permissions */
        get: operations["getAdminIdentity"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/metrics/funnel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Admin-only daily product funnel aggregation
         * @description Aggregates the core product loop per UTC calendar day — event started → suggestion impression/actioned → event ended/outcome → review opened — plus optional visit-summary events separately. Counts only: the response carries no health content, rule codes, user ids or per-user detail. Per-day details are suppressed below the small-sample threshold.
         */
        get: operations["getAdminMetricsFunnel"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/metrics/overview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get aggregate admin dashboard metrics */
        get: operations["getAdminMetricsOverview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List user account summaries */
        get: operations["listAdminUsers"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one user account summary */
        get: operations["getAdminUser"];
        put?: never;
        post?: never;
        /** Soft-delete a user account */
        delete: operations["deleteAdminUser"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{id}/related": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List a user's related records grouped by domain */
        get: operations["getAdminUserRelated"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{id}/sessions/{sessionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Revoke one of a user's sessions */
        delete: operations["revokeAdminUserSession"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{id}/shares/{shareId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Revoke one of a user's clinic-summary share links */
        delete: operations["revokeAdminUserShare"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/admin/users/{id}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Activate or suspend a user account */
        patch: operations["updateAdminUserStatus"];
        trace?: never;
    };
    "/api/v1/auth/captcha": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Public human-verification widget configuration */
        get: operations["LocalController_getCaptcha"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/devices": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List signed-in devices for the current user */
        get: operations["listDevices"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/devices/{sessionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Revoke a signed-in device */
        delete: operations["revokeDevice"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/forgot-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Forgot password */
        post: operations["forgotPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** User login */
        post: operations["login"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** User logout */
        post: operations["logout"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/oauth/apple/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Apple Sign-In callback */
        post: operations["loginWithApple"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/oauth/google/authorize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create Google OAuth authorize URL */
        post: operations["createGoogleAuthorizeUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/oauth/google/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Google OAuth callback login */
        post: operations["loginWithGoogle"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/oauth/qq/authorize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create QQ OAuth authorize URL */
        post: operations["createQqAuthorizeUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/oauth/qq/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** QQ OAuth callback login */
        post: operations["loginWithQq"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/oauth/wechat-mobile/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** WeChat mobile OAuth callback login */
        post: operations["loginWithWechatMobile"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/oauth/wechat-web/authorize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create WeChat web OAuth authorize URL */
        post: operations["createWechatWebAuthorizeUrl"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/oauth/wechat-web/callback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** WeChat web OAuth browser redirect */
        get: operations["redirectWechatWebCallback"];
        put?: never;
        /** WeChat web OAuth callback login */
        post: operations["loginWithWechatWeb"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Refresh token */
        post: operations["refreshSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** User registration */
        post: operations["register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/reset-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Reset password */
        post: operations["resetPassword"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/send-verification-code": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send email verification code */
        post: operations["sendVerificationCode"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/sessions/login": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Login (httpOnly cookie session) */
        post: operations["loginWithCookie"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/sessions/logout": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Logout (clears the cookie session) */
        post: operations["logoutWithCookie"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/sessions/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Rotate the cookie session */
        post: operations["refreshWithCookie"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/sessions/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Register (httpOnly cookie session) */
        post: operations["registerWithCookie"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/auth/verify-email": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Verify email */
        post: operations["verifyEmail"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/environment/snapshot": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get static environment snapshot reference data */
        get: operations["getSnapshot"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/health": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Readiness probe alias used by existing scripts */
        get: operations["getHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/health/deep": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Detailed health probe with per-component diagnostics */
        get: operations["getDeepHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/health/live": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Liveness probe for process health */
        get: operations["getLiveHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/health/ready": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Readiness probe for critical runtime dependencies */
        get: operations["getReadyHealth"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/legal-documents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List all active legal documents */
        get: operations["listLegalDocuments"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/legal-documents/{docType}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a specific legal document by type */
        get: operations["getLegalDocument"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/medicines": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Search medicines from a selected knowledge source */
        get: operations["search"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/medicines/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get medicine detail from a selected knowledge source */
        get: operations["getDetail"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/medicines/{id}/sequences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get medicine sequences (drug chains and target sequences) */
        get: operations["getSequences"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/medicines/recognize": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** AI recognize medicine box image and extract medicine info */
        post: operations["recognize"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/medicines/recognize/async": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enqueue async medicine box image recognition */
        post: operations["enqueueMedicineRecognition"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/medicines/recognize/status/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Poll async medicine recognition status */
        get: operations["recognizeStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/medicines/risk-check": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get latest medicine risk check records */
        get: operations["getRiskCheck"];
        put?: never;
        /** Run medicine risk check (static or LLM) */
        post: operations["runRiskCheck"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/medicines/safety-tips": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get random medication safety tips */
        get: operations["getSafetyTips"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/public/app-info": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get application metadata */
        get: operations["getAppInfo"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/assistant/capabilities": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get authenticated user assistant capabilities and permissions */
        get: operations["getCapabilities"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/assistant/conversations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List recent persisted assistant conversations for the user */
        get: operations["listRecentConversations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/assistant/conversations/{conversationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Soft-delete one persisted assistant conversation */
        delete: operations["deleteConversation"];
        options?: never;
        head?: never;
        /** Rename one persisted assistant conversation (title only) */
        patch: operations["renameConversation"];
        trace?: never;
    };
    "/api/v1/user/assistant/conversations/{conversationId}/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Confirm or reject pending assistant write proposals and resume the graph thread */
        post: operations["confirmProposal"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/assistant/conversations/{conversationId}/open": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Activate one persisted assistant conversation and return its full history */
        post: operations["openConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/assistant/conversations/{conversationId}/regenerate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Regenerate the last assistant message of a persisted conversation (SSE) */
        post: operations["regenerateLastMessage"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/assistant/latest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the authenticated user latest persisted assistant conversation */
        get: operations["getLatestConversation"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/assistant/latest/clear": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Archive the authenticated user latest active assistant conversation */
        post: operations["clearLatestConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/assistant/memory": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Erase all persisted assistant memories for the user */
        delete: operations["clearMemory"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/assistant/messages/stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Stream authenticated user assistant response */
        post: operations["streamMessages"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/daily-records": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List daily records for a given date */
        get: operations["listDailyRecords"];
        put?: never;
        /** Create a daily record */
        post: operations["createDailyRecord"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/daily-records/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a daily record by id */
        get: operations["getDailyRecord"];
        put?: never;
        post?: never;
        /** Soft-delete a daily record */
        delete: operations["deleteDailyRecord"];
        options?: never;
        head?: never;
        /** Update a daily record */
        patch: operations["updateDailyRecord"];
        trace?: never;
    };
    "/api/v1/user/daily-records/attachments/images/presign-upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a signed URL for daily record image upload */
        post: operations["createImageUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/daily-records/candidate-records/generate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Generate AI candidate daily records from a natural-language note */
        post: operations["generateCandidates"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/daily-records/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get daily record summary (counts by kind) */
        get: operations["summary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/daily-records/symptom-catalog": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List the symptom catalog (codes + labels) */
        get: operations["getSymptomCatalog"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/data-export-requests": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a new data export request */
        post: operations["createRequest"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/data-export-requests/latest": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the latest data export request */
        get: operations["getLatestRequest"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/files/upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a presigned upload URL for a file */
        post: operations["createUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/health-context": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the current user health context aggregate */
        get: operations["getUserHealthContext"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/health-context/allergies": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create an allergy record */
        post: operations["createAllergy"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/health-context/allergies/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Deactivate an allergy record (soft delete) */
        delete: operations["deleteAllergy"];
        options?: never;
        head?: never;
        /** Update an allergy record */
        patch: operations["updateAllergy"];
        trace?: never;
    };
    "/api/v1/user/health-context/conditions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a condition record */
        post: operations["createCondition"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/health-context/conditions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Resolve a condition record (soft delete) */
        delete: operations["deleteCondition"];
        options?: never;
        head?: never;
        /** Update a condition record */
        patch: operations["updateCondition"];
        trace?: never;
    };
    "/api/v1/user/health-context/current-medicines": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Add a current medicine record */
        post: operations["createCurrentMedicine"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/health-context/current-medicines/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Deactivate a current medicine record (soft delete) */
        delete: operations["deleteCurrentMedicine"];
        options?: never;
        head?: never;
        /** Update a current medicine record */
        patch: operations["updateCurrentMedicine"];
        trace?: never;
    };
    "/api/v1/user/health-context/profile": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update the current user health-context profile */
        patch: operations["updateUserHealthContextProfile"];
        trace?: never;
    };
    "/api/v1/user/health-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List the user health event history */
        get: operations["listHealthEvents"];
        put?: never;
        /** Start a user-confirmed health event */
        post: operations["createHealthEvent"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/health-events/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one user health event */
        get: operations["getHealthEvent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/health-events/{id}/check-ins/{date}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Upsert a user-confirmed daily event check-in */
        put: operations["upsertCheckIn"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/health-events/{id}/end": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** End a health event with an explicit outcome */
        post: operations["end"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/health-events/active": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the current active health event */
        get: operations["active"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/medicine-dose-logs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List dose logs for a date */
        get: operations["listDoseLogs"];
        put?: never;
        /** Create a dose log */
        post: operations["createDoseLog"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/medicine-dose-logs/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Soft-delete a dose log */
        delete: operations["deleteDoseLog"];
        options?: never;
        head?: never;
        /** Update a dose log */
        patch: operations["updateDoseLog"];
        trace?: never;
    };
    "/api/v1/user/medicine-dose-logs/mark": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Mark a dose log idempotently for one reminder slot */
        post: operations["mark"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/medicine-reminders": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List medicine reminder schedules */
        get: operations["listMedicineReminders"];
        put?: never;
        /** Create a medicine reminder schedule */
        post: operations["createMedicineReminder"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/medicine-reminders/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Soft-delete a medicine reminder schedule */
        delete: operations["deleteMedicineReminder"];
        options?: never;
        head?: never;
        /** Update a medicine reminder schedule */
        patch: operations["updateMedicineReminder"];
        trace?: never;
    };
    "/api/v1/user/medicine-reminders/group": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Upsert a whole medicine reminder group */
        put: operations["upsertGroup"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/notification-preferences": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get authenticated user notification preferences */
        get: operations["getNotificationPreferences"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Patch authenticated user notification preferences */
        patch: operations["patch"];
        trace?: never;
    };
    "/api/v1/user/notifications": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List user notifications */
        get: operations["listNotifications"];
        put?: never;
        /** Create a notification (internal/test) */
        post: operations["createNotification"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/notifications/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a notification detail */
        get: operations["getNotification"];
        put?: never;
        post?: never;
        /** Delete a notification */
        delete: operations["remove"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/notifications/{id}/read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Mark a notification as read */
        patch: operations["markAsRead"];
        trace?: never;
    };
    "/api/v1/user/notifications/{id}/unread": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Mark a notification as unread */
        patch: operations["markAsUnread"];
        trace?: never;
    };
    "/api/v1/user/notifications/mark-all-read": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Mark all notifications as read */
        patch: operations["markAllAsRead"];
        trace?: never;
    };
    "/api/v1/user/notifications/unread-count": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get unread notification count */
        get: operations["getUnreadCount"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/product-events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Record a batch of privacy-minimal product events
         * @description Write-only ingestion for product measurement. userId always comes from the session — a client-supplied userId is rejected by the whitelist. Raw events are retained 90 days, then deleted.
         */
        post: operations["recordBatch"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/product-events/funnel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Admin-only daily product funnel aggregation
         * @description Internal admin surface: a valid JWT must belong to a user with an AdminUser role; regular users get 403. Aggregates the core product loop per UTC calendar day — event started → suggestion impression/actioned → event ended/outcome → review opened — plus optional visit-summary events separately. Counts only: the response carries no health content, rule codes, user ids or per-user detail. Per-day details are suppressed below the small-sample threshold.
         */
        get: operations["getFunnel"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reminder-deliveries": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List reminder delivery audit logs */
        get: operations["listReminderDeliveries"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reminder-deliveries/local-capability": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Report client local scheduling capability */
        put: operations["reportLocalCapability"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reminder-deliveries/receipts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Record a local notification delivery receipt (idempotent) */
        post: operations["recordReceipt"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/clinic-summary/export/async": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enqueue async clinic summary PDF export */
        post: operations["enqueueClinicSummaryPdfExport"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/clinic-summary/export/status/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Poll async clinic summary PDF export status */
        get: operations["exportClinicSummaryPdfStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/clinic-summary/preview": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Generate a de-identified clinic summary for sharing with a doctor */
        post: operations["previewClinicSummary"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/clinic-summary/preview/pdf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Download a de-identified clinic summary as PDF (auth required) — POST so the request scope (eventId/date range + selectedFields) can be carried in the body, like the preview and export endpoints. */
        post: operations["downloadClinicSummaryPdf"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/clinic-summary/share": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a revocable share link for the clinic summary (7-day expiry) */
        post: operations["shareClinicSummary"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/clinic-summary/shared/{token}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Access a shared clinic summary by token (no auth required) */
        get: operations["getSharedClinicSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/clinic-summary/shared/{token}/pdf": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Download a shared clinic summary as PDF (no auth required) */
        get: operations["downloadSharedClinicSummaryPdf"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/clinic-summary/shares": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List the clinic summary shares of the authenticated user */
        get: operations["listClinicSummaryShares"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/clinic-summary/shares/{shareId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Revoke a clinic summary share (current user owns the share) */
        delete: operations["revokeClinicSummaryShare"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/dashboard": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get authenticated user report dashboard */
        get: operations["getDashboard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/reviews": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Event review history */
        get: operations["listReviews"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/reviews/{eventId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Rebuild and persist the event review */
        get: operations["getEventReview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/reviews/current": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Build the current event review */
        get: operations["getCurrentReview"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/summary/generate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Generate authenticated user AI summary for report */
        post: operations["generateSummary"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/summary/generate/async": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enqueue AI report summary generation (async) */
        post: operations["enqueueSummaryGeneration"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/summary/generate/status/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Poll AI report summary generation status */
        get: operations["generateSummaryStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/reports/summary/generate/stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Stream AI report summary generation events (SSE)
         * @description Progress events (`progress`), LLM partials (`chunk`), a final `result` when ready, and an `error` event on failure.
         */
        post: operations["generateSummaryStream"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/settings": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get authenticated user settings */
        get: operations["getSettings"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update authenticated user settings */
        patch: operations["updateSettings"];
        trace?: never;
    };
    "/api/v1/user/today-analysis": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read the latest persisted Today AI analysis */
        get: operations["read"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today-analysis/generate": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Generate authenticated user today AI analysis */
        post: operations["generate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today-analysis/generate/async": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enqueue async today AI analysis generation */
        post: operations["enqueueAnalysisGeneration"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today-analysis/generate/status/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Poll async today analysis generation status */
        get: operations["generateStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today-analysis/generate/stream": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Stream authenticated user today AI analysis generation */
        post: operations["generateStream"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today-analysis/recommendations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get cold-start onboarding guide cards */
        get: operations["getRecommendations"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today-analysis/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Request a bounded Today AI analysis refresh */
        post: operations["refreshTodayAnalysis"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today/suggestions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Today page suggestion cards */
        get: operations["getSuggestions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today/suggestions/{id}/explain": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Get AI explanation for a suggestion card */
        post: operations["explainSuggestion"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today/suggestions/{id}/explain/async": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Enqueue async AI explanation for a suggestion card */
        post: operations["enqueueSuggestionExplanation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today/suggestions/{id}/feedback": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Submit feedback for a suggestion card */
        post: operations["submitFeedback"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today/suggestions/explain/status/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Poll async suggestion explanation status */
        get: operations["explainSuggestionStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/api/v1/user/today/suggestions/history": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get suggestion history for the Report page */
        get: operations["getHistory"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
};
export type webhooks = Record<string, never>;
export type components = {
    schemas: {
        AccountEmailResponse: {
            /** @description New email address. */
            email: string;
            /** @description Email verification time in ISO 8601. */
            emailVerifiedAt: string | null;
        };
        AccountResponse: {
            /** @description Avatar URL. */
            avatar: string | null;
            /** @description Created time in ISO 8601. */
            createdAt: string;
            /** @description Account email. OAuth-only accounts may not have one. */
            email: string | null;
            /** @description Account email verification time in ISO 8601. */
            emailVerifiedAt: string | null;
            /** @description Whether the account has a local password. */
            hasPassword: boolean;
            /** @description User ID. */
            id: string;
            /** @description Last login time in ISO 8601. */
            lastLoginAt: string | null;
            /** @description Linked third-party identities without provider user ids. */
            linkedIdentities: components["schemas"]["AccountResponseLinkedIdentities"][];
            /** @description Display nickname. */
            nickname: string | null;
            /** @description Updated time in ISO 8601. */
            updatedAt: string;
        };
        AccountResponseLinkedIdentities: {
            /** @description Provider email when the provider exposes one. */
            email: string | null;
            /** @description Provider email verification time in ISO 8601. */
            emailVerifiedAt: string | null;
            /** @description Account identity ID. */
            id: string;
            /** @description Identity linked time in ISO 8601. */
            linkedAt: string;
            /** @description OAuth provider name. */
            provider: string;
        };
        AdminAdminListResponse: {
            items: components["schemas"]["AdminAdminListResponseItems"][];
            total: number;
        };
        AdminAdminListResponseItems: {
            /** Format: date-time */
            createdAt: string;
            /** Format: email */
            email: string;
            nickname: string | null;
            /** @enum {string} */
            role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER";
            /** Format: date-time */
            updatedAt: string;
            userId: string;
            /** @enum {string} */
            userStatus: "active" | "suspended" | "deleted";
        };
        AdminAdminSummary: {
            /** Format: date-time */
            createdAt: string;
            /** Format: email */
            email: string;
            nickname: string | null;
            /** @enum {string} */
            role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER";
            /** Format: date-time */
            updatedAt: string;
            userId: string;
            /** @enum {string} */
            userStatus: "active" | "suspended" | "deleted";
        };
        AdminAuditLogListResponse: {
            items: components["schemas"]["AdminAuditLogListResponseItems"][];
            limit: number;
            page: number;
            total: number;
        };
        AdminAuditLogListResponseItems: {
            action: string;
            actorUserId: string;
            /** Format: date-time */
            createdAt: string;
            id: string;
            resourceId: string | null;
            resourceType: string | null;
        };
        /**
         * @example {
         *       "lightrag": {
         *         "enabled": true
         *       },
         *       "semantica": {
         *         "enabled": false
         *       },
         *       "generatedAt": "2026-01-16T08:30:00.000Z"
         *     }
         */
        AdminDependencies: {
            /** @description Response generation time (ISO 8601). */
            generatedAt: string;
            lightrag: components["schemas"]["AdminDependenciesLightrag"];
            semantica: components["schemas"]["AdminDependenciesSemantica"];
        };
        /** @description LightRAG retrieval sidecar. */
        AdminDependenciesLightrag: {
            /** @description Whether LIGHTRAG_ENABLED is on for this process. */
            enabled: boolean;
        };
        /** @description Semantica ontology sidecar. */
        AdminDependenciesSemantica: {
            /** @description Whether SEMANTICA_ENABLED is on for this process. */
            enabled: boolean;
        };
        AdminLegalDocument: {
            contentEn: string;
            contentZh: string;
            /** @example terms-of-service */
            docType: string;
            isActive: boolean;
            /** @example Terms of Service */
            titleEn: string;
            /** @example 用户服务协议 */
            titleZh: string;
            /** Format: date-time */
            updatedAt: string;
        };
        AdminLegalDocumentItem: {
            contentEn: string;
            contentZh: string;
            /** @example terms-of-service */
            docType: string;
            isActive: boolean;
            /** @example Terms of Service */
            titleEn: string;
            /** @example 用户服务协议 */
            titleZh: string;
            /** Format: date-time */
            updatedAt: string;
        };
        AdminLegalDocumentList: components["schemas"]["AdminLegalDocumentItem"][];
        AdminMetricsOverview: {
            /**
             * Format: date-time
             * @example 2026-01-15T08:30:00.000Z
             */
            generatedAt: string;
            /** @example 4820 */
            productEventsLast24Hours: number;
            users: components["schemas"]["AdminMetricsOverviewUsers"];
        };
        AdminMetricsOverviewUsers: {
            /** @example 1150 */
            active: number;
            newLast30Days: number;
            suspended: number;
            /** @example 1280 */
            total: number;
        };
        AdminQaChunk: {
            answer: string;
            /**
             * Format: uuid
             * @example 3fa85f64-5717-4562-b3fc-2c963f66afa6
             */
            id: string;
            /** @example Q-1 */
            qaId: string;
            question: string;
            /**
             * @example safe
             * @enum {string}
             */
            safetyLabel: "safe" | "caution" | "blocked";
            /** Format: date-time */
            updatedAt: string;
        };
        AdminQaChunkListResponse: {
            items: components["schemas"]["AdminQaChunkListResponseItems"][];
            limit: number;
            page: number;
            total: number;
        };
        AdminQaChunkListResponseItems: {
            answer: string;
            /**
             * Format: uuid
             * @example 3fa85f64-5717-4562-b3fc-2c963f66afa6
             */
            id: string;
            /** @example Q-1 */
            qaId: string;
            question: string;
            /**
             * @example safe
             * @enum {string}
             */
            safetyLabel: "safe" | "caution" | "blocked";
            /** Format: date-time */
            updatedAt: string;
        };
        AdminResourceListResponse: {
            items: {
                [key: string]: unknown;
            }[];
            /** @example 25 */
            limit: number;
            /** @example 1 */
            page: number;
            /** @example 1 */
            total: number;
        };
        /**
         * @example {
         *       "id": "usr_9f2c1e4a7b8d4c6e",
         *       "email": "a@example.com"
         *     }
         */
        AdminResourceRow: {
            [key: string]: unknown;
        };
        AdminSafetyTip: {
            /** @example dosage */
            category: string;
            contentEn: string;
            contentZh: string;
            /**
             * Format: uuid
             * @example 3fa85f64-5717-4562-b3fc-2c963f66afa6
             */
            id: string;
            isActive: boolean;
            sortOrder: number;
            /** Format: date-time */
            updatedAt: string;
        };
        AdminSafetyTipItem: {
            /** @example dosage */
            category: string;
            contentEn: string;
            contentZh: string;
            /**
             * Format: uuid
             * @example 3fa85f64-5717-4562-b3fc-2c963f66afa6
             */
            id: string;
            isActive: boolean;
            sortOrder: number;
            /** Format: date-time */
            updatedAt: string;
        };
        AdminSafetyTipList: components["schemas"]["AdminSafetyTipItem"][];
        AdminUserListResponse: {
            items: components["schemas"]["AdminUserListResponseItems"][];
            limit: number;
            page: number;
            total: number;
        };
        AdminUserListResponseItems: {
            /** @enum {string|null} */
            adminRole: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER" | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: email */
            email: string;
            emailVerified: boolean;
            id: string;
            /** Format: date-time */
            lastLoginAt: string | null;
            nickname: string | null;
            /** @enum {string} */
            status: "active" | "suspended" | "deleted";
        };
        AdminUserRelated: {
            groups: components["schemas"]["AdminUserRelatedGroups"][];
            /** @example usr_9f2c1e4a7b8d4c6e */
            userId: string;
        };
        AdminUserRelatedGroups: {
            key: string;
            sections: components["schemas"]["AdminUserRelatedGroupsSections"][];
        };
        AdminUserRelatedGroupsSections: {
            items: {
                [key: string]: unknown;
            }[];
            resource: string;
            total: number;
        };
        AdminUserSummary: {
            /** @enum {string|null} */
            adminRole: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER" | null;
            /** Format: date-time */
            createdAt: string;
            /** Format: email */
            email: string;
            emailVerified: boolean;
            id: string;
            /** Format: date-time */
            lastLoginAt: string | null;
            nickname: string | null;
            /** @enum {string} */
            status: "active" | "suspended" | "deleted";
        };
        AppInfoResponse: {
            downloadUrl: string | null;
            latestVersion: string | null;
            minClientVersion: string | null;
            supportEmail: string | null;
        };
        AssistantCapabilitiesResponse: {
            assistantContext: components["schemas"]["AssistantCapabilitiesResponseAssistantContext"];
            /** @description Whether the user has left the assistant enabled in settings. */
            assistantEnabled: boolean;
            /** @description Whether cross-conversation assistant memory reuse is enabled for this user. */
            assistantMemoryEnabled: boolean;
            /** @description Whether the configured chat model role exists server-side. */
            chatModelConfigured: boolean;
            /** @description Whether an actual end-user chat interaction route is ready to be exposed. */
            interactiveChatReady: boolean;
            /** @description Whether the LangGraph orchestration foundation is active. */
            langGraphReady: boolean;
            /** @description Whether the frontend should expect Markdown output and render it faithfully. */
            markdownRenderingRecommended: boolean;
            /**
             * @description Current backend rollout phase for the assistant.
             * @enum {string}
             */
            phase: "foundation";
            /** @description Whether medicine-leaflet retrieval augmentation is currently enabled. */
            ragEnabled: boolean;
            /** @description Whether the current backend intends to stream responses. */
            streamingSupported: boolean;
            /**
             * @description Recommended streaming transport for the current chat contract.
             * @enum {string}
             */
            streamingTransport: "sse";
            /** @description Tool-by-tool capability breakdown after combining system state and user permissions. */
            tools: components["schemas"]["AssistantCapabilitiesResponseTools"][];
            /** @description ISO-8601 timestamp of the latest related settings update. */
            updatedAt: string | null;
        };
        /** @description Fine-grained assistant context permissions from user settings. */
        AssistantCapabilitiesResponseAssistantContext: {
            /** @description Whether the assistant may read current medicines and medicine-box data. */
            currentMedicines: boolean;
            /** @description Whether the assistant may read recent daily records. */
            dailyRecords: boolean;
            /** @description Whether the assistant may read stored health profile, allergies, and conditions. */
            healthProfile: boolean;
            /** @description Whether the assistant may read sleep records and summaries. */
            sleepRecords: boolean;
        };
        AssistantCapabilitiesResponseTools: {
            /**
             * @description Why the tool is currently disabled, or null when enabled.
             * @enum {string|null}
             */
            disabledReason: "chat_disabled" | "context_disabled" | "model_not_configured" | "not_implemented" | "retrieval_unavailable" | null;
            /** @description Whether this tool is currently executable for this user. */
            enabled: boolean;
            /** @description Whether the server has already implemented this tool beyond planning/foundation wiring. */
            implemented: boolean;
            /**
             * @description Stable tool identifier exposed to the client.
             * @enum {string}
             */
            name: "get_today_records" | "get_records_by_date" | "get_records_by_range" | "get_today_summary_by_date" | "get_report_summary_by_range" | "get_recent_today_summaries" | "get_recent_report_summaries" | "get_user_profile" | "get_user_settings" | "get_current_medicines" | "get_sleep_summary_by_range" | "get_meal_analysis_digest" | "search_cn_medicine_products" | "get_cn_medicine_detail" | "search_cn_medicine_knowledge" | "resolve_drugbank_entity" | "get_drugbank_detail" | "search_drugbank_passages" | "reason_over_ontology" | "reason_over_rules" | "propose_create_daily_record" | "propose_update_daily_record" | "propose_delete_daily_record" | "propose_update_user_settings";
            /** @description Whether the current user settings permit this tool in principle. */
            permittedByUser: boolean;
            /** @description Context sources this tool requires before it may run. Allowed values: health_profile, daily_records, sleep_records, current_medicines. */
            requiredContextSources: ("health_profile" | "daily_records" | "sleep_records" | "current_medicines")[];
        };
        AssistantClearMemoryResponse: {
            /**
             * @description Number of persisted assistant memory rows deleted.
             * @example 3
             */
            cleared: number;
        };
        AssistantClearResultResponse: {
            /** @description The archived conversation id, or null when none existed. */
            archivedConversationId: string | null;
            /** @description Whether the latest conversation was cleared. */
            cleared: boolean;
        };
        AssistantConfirmResultResponse: {
            /** @description Conversation (LangGraph thread) id the proposals belong to. */
            conversationId: string;
            /** @enum {string} */
            decision: "approved" | "rejected";
            /** @description Final assistant content after the decision is applied. */
            finalContent: string | null;
            /** @enum {string} */
            status: "approved" | "rejected";
        };
        AssistantConversationData: {
            /** @description ISO-8601 creation timestamp. */
            createdAt: string;
            /** @description Stable persisted conversation identifier. */
            id: string;
            /** @description ISO-8601 timestamp of the latest conversation activity. */
            lastMessageAt: string | null;
            /** @description Persisted messages in chronological order. */
            messages: components["schemas"]["AssistantConversationDataMessages"][];
            /**
             * @description Current conversation status.
             * @enum {string}
             */
            status: "active" | "archived" | "deleted";
            /** @description Optional server-derived conversation title. */
            title: string | null;
            /** @description ISO-8601 update timestamp. */
            updatedAt: string;
        } | null;
        AssistantConversationDataMessages: {
            /** @description Persisted Markdown-ready message content. */
            content: string;
            /** @description ISO-8601 timestamp when the message was created. */
            createdAt: string;
            /**
             * @description Persisted conversation role visible to the client.
             * @enum {string}
             */
            role: "user" | "assistant";
            /** @description Tool names recorded for this message. Non-empty for assistant messages that used tools. */
            usedTools: string[];
        };
        AssistantConversationResponse: {
            /** @description ISO-8601 creation timestamp. */
            createdAt: string;
            /** @description Stable persisted conversation identifier. */
            id: string;
            /** @description ISO-8601 timestamp of the latest conversation activity. */
            lastMessageAt: string | null;
            /** @description Persisted messages in chronological order. */
            messages: components["schemas"]["AssistantConversationResponseMessages"][];
            /**
             * @description Current conversation status.
             * @enum {string}
             */
            status: "active" | "archived" | "deleted";
            /** @description Optional server-derived conversation title. */
            title: string | null;
            /** @description ISO-8601 update timestamp. */
            updatedAt: string;
        };
        AssistantConversationResponseMessages: {
            /** @description Persisted Markdown-ready message content. */
            content: string;
            /** @description ISO-8601 timestamp when the message was created. */
            createdAt: string;
            /**
             * @description Persisted conversation role visible to the client.
             * @enum {string}
             */
            role: "user" | "assistant";
            /** @description Tool names recorded for this message. Non-empty for assistant messages that used tools. */
            usedTools: string[];
        };
        /** @description Recent assistant conversation summaries. */
        AssistantConversationSummary: components["schemas"]["AssistantConversationSummaryItem"][];
        AssistantConversationSummaryItem: {
            /** @description ISO-8601 creation timestamp. */
            createdAt: string;
            /** @description Stable persisted conversation identifier. */
            id: string;
            /** @description ISO-8601 timestamp of the latest conversation activity. */
            lastMessageAt: string | null;
            /**
             * @description Current conversation status.
             * @enum {string}
             */
            status: "active" | "archived" | "deleted";
            /** @description Optional server-derived conversation title. */
            title: string | null;
            /** @description ISO-8601 update timestamp. */
            updatedAt: string;
        };
        CaptchaResponse: {
            /**
             * @description 是否启用
             * @example false
             */
            enabled: boolean;
            /**
             * @description 站点密钥
             * @example 0x4AAAAAAA_example_site_key
             */
            siteKey: string;
        };
        ChangeEmailRequest: {
            /** @description 验证码 */
            code: string;
            /** @description 新邮箱 */
            newEmail: string;
            /** @description 当前密码（敏感操作再认证用） */
            password: string;
        };
        ChangePasswordRequest: {
            /** @description 新密码（8-32位，需包含大小写字母和数字） */
            newPassword: string;
            /** @description 当前密码（敏感操作再认证用） */
            password: string;
        };
        ClinicSummaryExportJobResponse: {
            /**
             * @description Queued PDF export job identifier.
             * @example clinic-summary-export-job-2f1c9a
             */
            jobId?: string;
            /** @description Base64 PDF when the export is processed inline. */
            pdfBase64?: string;
        };
        ClinicSummaryResponse: {
            /** @description Active allergies. Optional: omitted when the section is deselected. */
            allergies?: components["schemas"]["ClinicSummaryResponseAllergies"][];
            /** @description Active conditions. Optional: omitted when the section is deselected. */
            conditions?: components["schemas"]["ClinicSummaryResponseConditions"][];
            coverage: components["schemas"]["ClinicSummaryResponseCoverage"];
            /** @description Current medicines. Optional: omitted when the section is deselected. */
            currentMedicines?: components["schemas"]["ClinicSummaryResponseCurrentMedicines"][];
            /** @description Legacy range label (last_7_days | last_30_days | custom | event); kept as a compatibility alias of scopeLabel. */
            dataRange: string;
            /** @description Disclaimer text */
            disclaimer: string;
            /** @description Real window end (ISO 8601). */
            end: string;
            /** @description Structured facts and change codes reused from the event review (e.g. health_event, observed_changes, no_completed_actions, active_check_in). `insufficient_coverage` is the fixed 资料不足 statement — no generic AI conclusions are ever added. Controlled by the `event_overview` field toggle (R-2): omitted when the field is deselected. */
            findings?: string[];
            /** @description Generated timestamp */
            generatedAt: string;
            /** @description Free-text note records (date, kind, original text). Controlled by the `notes` field toggle (R-2): omitted when the field is deselected. Defaults to off — the user must explicitly opt in. */
            noteEntries?: components["schemas"]["ClinicSummaryResponseNoteEntries"][];
            profile?: components["schemas"]["ClinicSummaryResponseProfile"];
            /** @description Scope label: last_7_days | last_30_days | custom for date-range scopes, or the event title for an event scope. */
            scopeLabel: string;
            /** @description Effective included sections after field selection (profile/allergies/conditions/currentMedicines). */
            selectedFields: string[];
            /** @description Daily sleep duration facts (only records with a positive duration). Controlled by the `sleep` field toggle (R-2): omitted when the field is deselected. */
            sleepEntries?: components["schemas"]["ClinicSummaryResponseSleepEntries"][];
            /** @description Real window start (ISO 8601). */
            start: string;
            /** @description Daily water intake facts (only records with a parsable ml value). Controlled by the `water` field toggle (R-2): omitted when the field is deselected. */
            waterEntries?: components["schemas"]["ClinicSummaryResponseWaterEntries"][];
        };
        ClinicSummaryResponseAllergies: {
            /** @description Allergy label (e.g. 青霉素) */
            label: string;
            /** @description Reaction description */
            reaction: string | null;
            /** @description Severity level */
            severity: string | null;
        };
        ClinicSummaryResponseConditions: {
            /** @description Year of diagnosis (YYYY) */
            diagnosedYear?: number | null;
            /** @description Condition label (e.g. 高血压) */
            label: string;
            /** @description Current status */
            status: string | null;
        };
        ClinicSummaryResponseCoverage: {
            checkIns: components["schemas"]["ClinicSummaryResponseCoverageCheckIns"];
            dose: components["schemas"]["ClinicSummaryResponseCoverageDose"];
            sleep?: components["schemas"]["ClinicSummaryResponseCoverageSleep"];
            water?: components["schemas"]["ClinicSummaryResponseCoverageWater"];
        };
        ClinicSummaryResponseCoverageCheckIns: {
            /**
             * @description 'none' when the source has no observations; 'partial' when observations exist but sufficiency is not assessed.
             * @enum {string}
             */
            coverage: "sufficient" | "partial" | "none";
            /** @description No fixed expectation is defined yet. */
            expectedCount: number | null;
            /** @description Number of observations in the window. */
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            /** @description Window end (ISO 8601), or null when nothing was observed. */
            windowEnd: string | null;
            /** @description Window start (ISO 8601), or null when nothing was observed. */
            windowStart: string | null;
        };
        ClinicSummaryResponseCoverageDose: {
            /**
             * @description 'none' when the source has no observations; 'partial' when observations exist but sufficiency is not assessed.
             * @enum {string}
             */
            coverage: "sufficient" | "partial" | "none";
            /** @description No fixed expectation is defined yet. */
            expectedCount: number | null;
            /** @description Number of observations in the window. */
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            /** @description Window end (ISO 8601), or null when nothing was observed. */
            windowEnd: string | null;
            /** @description Window start (ISO 8601), or null when nothing was observed. */
            windowStart: string | null;
        };
        /** @description Sleep coverage. Optional: omitted when the `sleep` field is deselected via selectedFields. */
        ClinicSummaryResponseCoverageSleep: {
            /**
             * @description 'none' when the source has no observations; 'partial' when observations exist but sufficiency is not assessed.
             * @enum {string}
             */
            coverage: "sufficient" | "partial" | "none";
            /** @description No fixed expectation is defined yet. */
            expectedCount: number | null;
            /** @description Number of observations in the window. */
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            /** @description Window end (ISO 8601), or null when nothing was observed. */
            windowEnd: string | null;
            /** @description Window start (ISO 8601), or null when nothing was observed. */
            windowStart: string | null;
        };
        /** @description Water coverage. Optional: omitted when the `water` field is deselected via selectedFields. */
        ClinicSummaryResponseCoverageWater: {
            /**
             * @description 'none' when the source has no observations; 'partial' when observations exist but sufficiency is not assessed.
             * @enum {string}
             */
            coverage: "sufficient" | "partial" | "none";
            /** @description No fixed expectation is defined yet. */
            expectedCount: number | null;
            /** @description Number of observations in the window. */
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            /** @description Window end (ISO 8601), or null when nothing was observed. */
            windowEnd: string | null;
            /** @description Window start (ISO 8601), or null when nothing was observed. */
            windowStart: string | null;
        };
        ClinicSummaryResponseCurrentMedicines: {
            /** @description Generic medicine name */
            displayName: string;
            /** @description Dose instruction */
            doseText?: string | null;
        };
        ClinicSummaryResponseNoteEntries: {
            /** @description Calendar date in YYYY-MM-DD format. */
            date: string;
            /** @description Daily record kind (water/meal/vital/mood/symptom/activity/note/sleep). */
            kind: string;
            /** @description Original note text. */
            text: string;
        };
        /** @description De-identified profile. Optional: omitted when the section is deselected via selectedFields. */
        ClinicSummaryResponseProfile: {
            /** @description Age in years (derived from birthDate, never raw date) */
            age?: number | null;
            /** @description Masked display name (e.g. 张**) */
            nickname: string;
            /** @description Sex at birth */
            sexAtBirth: string | null;
        };
        ClinicSummaryResponseSleepEntries: {
            /** @description Calendar date in YYYY-MM-DD format. */
            date: string;
            /** @description Sleep duration in minutes. */
            minutes: number;
        };
        ClinicSummaryResponseWaterEntries: {
            /** @description Calendar date in YYYY-MM-DD format. */
            date: string;
            /** @description Water intake in milliliters. */
            ml: number;
        };
        ClinicSummaryShareListResponse: {
            /** @description The caller shares, newest first (createdAt desc); revoked shares stay listed. */
            items: components["schemas"]["ClinicSummaryShareListResponseItems"][];
        };
        ClinicSummaryShareListResponseItems: {
            /** @description Number of successful public opens. */
            accessCount: number;
            /** @description Creation time in ISO 8601 format. */
            createdAt: string;
            /** @description Expiration time in ISO 8601 format. */
            expiresAt: string;
            /** @description First access time in ISO 8601 format, or null when never opened. */
            firstAccessedAt: string | null;
            /** @description Persisted share record id (used for revocation). Never a token. */
            id: string;
            /** @description Last access time in ISO 8601 format, or null when never opened. */
            lastAccessedAt: string | null;
            /** @description Revocation time in ISO 8601 format, or null while the share is active. */
            revokedAt: string | null;
            scope: components["schemas"]["ClinicSummaryShareListResponseItemsScope"];
            /** @description Share fields the link may expose. */
            selectedFields: string[];
        };
        ClinicSummaryShareListResponseItemsScope: {
            /** @description Date-range scope start (ISO 8601), or null for an event scope */
            dateFrom: string | null;
            /** @description Date-range scope end (ISO 8601), or null for an event scope */
            dateTo: string | null;
            /** @description Event scope id */
            eventId: string | null;
        };
        ClinicSummaryShareResponse: {
            /** @description Expiration time (ISO 8601) */
            expiresAt: string;
            scope?: components["schemas"]["ClinicSummaryShareResponseScope"];
            /** @description Share fields the link may expose */
            selectedFields?: string[];
            /** @description Persisted share record id (used for revocation). Always present on the create response; optional only because the legacy `createShareLink` service method (cache-only shares) does not emit it. */
            shareId?: string;
            /** @description Shareable URL */
            shareUrl: string;
            /** @description Plaintext token — returned exactly once at creation, never persisted or logged */
            token?: string;
        };
        ClinicSummaryShareResponseScope: {
            /** @description Date-range scope start (ISO 8601), or null for an event scope */
            dateFrom: string | null;
            /** @description Date-range scope end (ISO 8601), or null for an event scope */
            dateTo: string | null;
            /** @description Event scope id */
            eventId: string | null;
        };
        ConfirmProposalRequest: {
            /**
             * @example approved
             * @enum {string}
             */
            decision: "approved" | "rejected";
            /** @example 已与医生确认。 */
            note?: string;
            /**
             * @description Proposal ids awaiting confirmation.
             * @example [
             *       "prop_4f8a2c9e1d"
             *     ]
             */
            proposalIds: string[];
        };
        CreateAdminResourceRowRequest: {
            [key: string]: unknown;
        };
        CreateAdminSafetyTipRequest: {
            category: string;
            contentEn: string;
            contentZh: string;
            isActive: boolean;
            sortOrder: number;
        };
        CreateAllergyRequest: {
            /**
             * @description Allergy kind.
             * @example food
             * @enum {string}
             */
            kind: "drug" | "food" | "environment" | "other";
            /**
             * @description User-visible allergy label.
             * @example Peanut
             */
            label: string;
            /**
             * @description User note for the allergy.
             * @example Avoid peanuts and peanut oil.
             */
            note?: string;
            /**
             * @description Recorded reaction.
             * @example Hives and swelling
             */
            reaction?: string;
            /**
             * @description When this allergy was recorded in ISO 8601 format.
             * @example 2026-06-04T08:30:00.000Z
             */
            recordedAt?: string;
            /**
             * @description Severity level. Defaults to unknown.
             * @example moderate
             * @enum {string}
             */
            severity?: "mild" | "moderate" | "severe" | "unknown";
        };
        CreateConditionRequest: {
            /**
             * @description Diagnosis date in YYYY-MM-DD format.
             * @example 2024-03-15
             */
            diagnosedAt?: string | null;
            /**
             * @description Condition label.
             * @example Type 2 diabetes
             */
            label: string;
            /**
             * @description User note for the condition.
             * @example Managed with diet and metformin.
             */
            note?: string;
            /**
             * @description Condition status. Defaults to active.
             * @example active
             * @enum {string}
             */
            status?: "active" | "resolved" | "suspected";
        };
        CreateCurrentMedicineRequest: {
            /**
             * @description Display name shown to the user.
             * @example Metformin 500 mg tablet
             */
            displayName: string;
            /**
             * @description Dose text.
             * @example Take 1 tablet twice daily
             */
            doseText?: string;
            /**
             * @description End date in YYYY-MM-DD format.
             * @example 2024-10-01
             */
            endedAt?: string | null;
            /**
             * @description User note for the medicine.
             * @example Take with meals.
             */
            note?: string;
            /**
             * @description Administration route.
             * @example oral
             */
            route?: string;
            /**
             * @description Upstream source used to anchor this medicine.
             * @example cn
             * @enum {string}
             */
            source: "drugbank" | "cn" | "manual";
            /**
             * @description Source-specific reference id. Required for drugbank and cn sources.
             * @example NMPA-H20051234
             */
            sourceRefId?: string;
            /**
             * @description Start date in YYYY-MM-DD format.
             * @example 2024-04-01
             */
            startedAt?: string | null;
            /**
             * @description Strength text.
             * @example 500 mg
             */
            strengthText?: string;
        };
        CreateDailyRecordRequest: {
            /**
             * @description Attachment metadata. File upload itself is handled separately.
             * @example [
             *       {
             *         "kind": "image",
             *         "objectKey": "daily-records/user_1/2026-06-04/photo.jpg",
             *         "contentType": "image/jpeg"
             *       }
             *     ]
             */
            attachments?: components["schemas"]["CreateDailyRecordRequestAttachments"][];
            /**
             * Format: uuid
             * @description Optional active health event association.
             * @example 3fa85f64-5717-4562-b3fc-2c963f66afa6
             */
            healthEventId?: string | null;
            /**
             * @example vital
             * @enum {string}
             */
            kind: "water" | "meal" | "vital" | "mood" | "symptom" | "activity" | "note" | "sleep";
            /**
             * @description Free-text note.
             * @example After waking up.
             */
            note?: string;
            /**
             * @description Date in YYYY-MM-DD format. For sleep records this is the wake date (the morning the user wakes up from that sleep).
             * @example 2026-06-04
             */
            occurredAt: string;
            /**
             * @description Time in HH:mm 24-hour format. When omitted, UI flows may treat the record as date-only.
             * @example 08:30
             */
            occurredTime?: string;
            /**
             * @description Structured payload for kind-specific data. For sleep: { sleepType?: "nightSleep"|"nap", startedAt?: string, endedAt?: string, durationMinutes, quality? }. endedAt must be later than startedAt; cross-midnight intervals are valid. For symptom: { symptom?: string, severity?: "mild"|"moderate"|"severe"|"unknown", customLabel?: string } — symptom is a catalog code and severity is the only structured severity source (title/value are display text). For vital: { vitalType: "heartRate"|"bloodPressure"|"bloodOxygen"|"bloodGlucose"|"bodyTemperature"|"weight"|"respiratoryRate", value: number, unit: string, secondaryValue?: number, secondaryUnit?: string }. For activity: { activityType: "steps"|"flightsClimbed"|"distance"|"exerciseTime", value: number, unit: string }. For meal: the analysis is server-owned — the only accepted field is the dish list { mealAnalysis: { dishes: [{ name: string }] } }. Vital and activity payloads are optional for manual entry.
             * @example {
             *       "vitalType": "bloodPressure",
             *       "value": 120,
             *       "unit": "mmHg",
             *       "secondaryValue": 80,
             *       "secondaryUnit": "mmHg"
             *     }
             */
            payload?: {
                [key: string]: unknown;
            };
            /**
             * @description Record source. Defaults to "manual". Use "apple_health" or "health_connect" for auto-synced records.
             * @example manual
             */
            source?: string;
            /**
             * @description Short label.
             * @example Morning blood pressure
             */
            title?: string;
            /**
             * @description Unit label.
             * @example mmHg
             */
            unit?: string;
            /**
             * @description Measured value.
             * @example 120/80
             */
            value?: string;
        };
        CreateDailyRecordRequestAttachments: {
            /**
             * @description Object storage bucket.
             * @example lumos-daily-records
             */
            bucket?: string | null;
            /**
             * @description MIME content type.
             * @example image/jpeg
             */
            contentType?: string | null;
            /**
             * @description Original file name.
             * @example photo.jpg
             */
            fileName?: string | null;
            /**
             * @description Image height in pixels.
             * @example 1080
             */
            height?: number | null;
            /**
             * @description Attachment kind. Defaults to "image".
             * @example image
             * @enum {string}
             */
            kind?: "image";
            /**
             * @description Object storage key, stable across signed URL rotations.
             * @example daily-records/user_1/2026-06-04/photo.jpg
             */
            objectKey: string;
            /**
             * @description Storage provider (e.g. tencent-cos, s3, ali-oss).
             * @example tencent-cos
             */
            provider?: string | null;
            /**
             * @description Optional public or already-signed display URL.
             * @example https://cdn.example.com/daily-records/user_1/2026-06-04/photo.jpg
             */
            publicUrl?: string | null;
            /**
             * @description File size in bytes.
             * @example 245760
             */
            sizeBytes?: number | null;
            /**
             * @description Image width in pixels.
             * @example 1920
             */
            width?: number | null;
        };
        CreateDoseLogRequest: {
            /** @description Linked current medicine id. */
            currentMedicineId?: string;
            /** @description Dose text. */
            doseText?: string;
            /**
             * Format: uuid
             * @description Linked active health event id.
             */
            healthEventId?: string | null;
            /** @description Free-text note. */
            note?: string;
            /** @description Linked reminder id for slot-aware logs. */
            reminderId?: string;
            /** @description Scheduled date YYYY-MM-DD. */
            scheduledFor: string;
            /** @description Scheduled slot time in HH:mm. */
            scheduledTime?: string;
            /** @enum {string} */
            status: "taken" | "skipped" | "missed" | "planned";
        };
        CreateFileUploadResponse: {
            bucket: string;
            /** @description Signed URL expiry timestamp (ISO 8601). */
            expiresAt: string;
            /** @description Headers that must be sent with the PUT upload. */
            headers: {
                [key: string]: string;
            };
            /** @description Maximum accepted upload size in bytes. */
            maxSizeBytes: number;
            objectKey: string;
            provider: string;
            /** @description Optional public/CDN URL when a public base URL is configured. */
            publicUrl: string | null;
            /** @description Signed PUT URL for direct object storage upload. */
            uploadUrl: string;
        };
        CreateGoogleAuthorizeUrlRequest: {
            /** @description Google 授权完成后的客户端回跳地址 */
            callbackUri?: string;
        };
        CreateHealthEventRequest: {
            /** @description Optional current-medicine ids to associate with this event. */
            currentMedicineIds?: string[];
            /**
             * @description Persisted semantic kind used for check-in routing.
             * @enum {string}
             */
            kind?: "symptom" | "other";
            /** @description Optional daily-record id that prompted this event. */
            reasonRecordId?: string | null;
            /** @description Short user-defined event title. */
            title: string;
        };
        CreateImageUploadRequest: {
            /**
             * @description Image MIME content type.
             * @example image/jpeg
             */
            contentType: string;
            /**
             * @description Original file name.
             * @example photo.jpg
             */
            fileName?: string;
            /**
             * @description File size in bytes.
             * @example 245760
             */
            sizeBytes: number;
        };
        CreateMedicineReminderRequest: {
            /** @description Linked current medicine id. */
            currentMedicineId?: string;
            /** @description Weekday numbers 0-6, where null means every day. */
            daysOfWeek?: number[] | null;
            /** @description Date in YYYY-MM-DD format when the reminder ends. */
            endDate?: string | null;
            /** @description Whether this reminder is active. */
            isActive?: boolean;
            /** @description Reminder label. */
            label?: string | null;
            /** @description User note. */
            note?: string | null;
            /** @description Scheduled local hour, 0-23. */
            scheduledHour: number;
            /** @description Scheduled local minute, 0-59. */
            scheduledMinute: number;
            /** @description Date in YYYY-MM-DD format when the reminder starts. */
            startDate?: string | null;
        };
        CreateNotificationRequest: {
            /** @description Action route target for the frontend. */
            action?: string | null;
            /** @description Extra payload for the action. */
            actionPayload?: unknown;
            /** @description Notification content body. */
            content: string;
            /** @description Notification title. */
            title: string;
            /**
             * @description Notification type. System-level types (e.g. system_announcement) are not allowed for user-created notifications.
             * @enum {string}
             */
            type: "ai_today_summary" | "ai_weekly_insight" | "ai_proactive_suggestion" | "medicine_missed_dose" | "password_changed" | "report_generated" | "medicine_reminder";
        };
        CreateQqAuthorizeUrlRequest: {
            /** @description QQ 授权完成后的客户端回跳地址 */
            callbackUri?: string;
        };
        CreateRequestRequest: {
            /**
             * @description Requested export format.
             * @enum {string}
             */
            format?: "pdf";
            /**
             * @description Requested export kind.
             * @enum {string}
             */
            kind?: "hospital" | "monthly" | "print";
            /** @description 当前密码（敏感操作再认证用） */
            password: string;
            /**
             * @description Requested report range.
             * @enum {string}
             */
            range?: "last_7_days" | "last_30_days";
        };
        CreateUploadRequest: {
            /** @description MIME type */
            contentType: string;
            /** @description Original filename */
            fileName?: string;
            /** @description File size in bytes */
            sizeBytes: number;
        };
        CreateWechatWebAuthorizeUrlRequest: {
            /** @description 授权完成后的客户端回跳地址。桌面端支持 loopback 地址，Web 端支持可信 CORS origin 下的 /login/oauth/wechat。 */
            callbackUri?: string;
        };
        CreateWechatWebIdentityLinkAuthorizeUrlRequest: {
            /** @description 授权完成后的客户端回跳地址。桌面端支持 loopback 地址，Web 端支持可信 CORS origin 下的 /login/oauth/wechat。 */
            callbackUri?: string;
        };
        DailyRecordCandidateResponse: {
            /** @description Short UI hint telling the client that these are candidates, not saved records. */
            confirmationHint: string;
            /** @description ISO-8601 timestamp when candidates were generated. */
            generatedAt: string;
            items: components["schemas"]["DailyRecordCandidateResponseItems"][];
            /** @description Normalized parse locale. */
            locale: string;
        };
        DailyRecordCandidateResponseItems: {
            /** @enum {string} */
            kind: "water" | "meal" | "symptom" | "note" | "sleep" | "vital" | "activity";
            /** @description Candidate free-text note. */
            note: string | null;
            /** @description Candidate occurred date in YYYY-MM-DD format. */
            occurredAt: string;
            /** @description Structured candidate payload. For sleep, this may include durationMinutes and optional timing hints. */
            payload: {
                [key: string]: unknown;
            } | null;
            /** @description Human-readable reason showing which phrase or fact led to this candidate. */
            rationale: string;
            /** @description Short candidate title. */
            title: string | null;
            /** @description Candidate unit. */
            unit: string | null;
            /** @description Candidate measured value. */
            value: string | null;
        };
        DailyRecordImageUploadResponse: {
            bucket: string;
            /** @description Signed URL expiry timestamp (ISO 8601). */
            expiresAt: string;
            /** @description Headers that must be sent with the PUT upload. */
            headers: {
                [key: string]: string;
            };
            /** @description Maximum accepted upload size in bytes. */
            maxSizeBytes: number;
            objectKey: string;
            provider: string;
            /** @description Optional public/CDN URL when a public base URL is configured. */
            publicUrl: string | null;
            /** @description Signed PUT URL for direct object storage upload. */
            uploadUrl: string;
        };
        DailyRecordListResponse: {
            items: components["schemas"]["DailyRecordListResponseItems"][];
            /** @description Total records for the date (before pagination). */
            total: number;
        };
        DailyRecordListResponseItems: {
            attachments: components["schemas"]["DailyRecordListResponseItemsAttachments"][];
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Linked health event id. */
            healthEventId: string | null;
            /** @description Record id. */
            id: string;
            /** @enum {string} */
            kind: "water" | "meal" | "vital" | "mood" | "symptom" | "activity" | "note" | "sleep";
            /** @description Stable failure reason code (image_count_invalid, vision_unavailable, model_failed, model_timeout, job_lost, invalid_output). */
            mealAnalysisFailureReason: string | null;
            /** @description Meal analysis status: "analyzing", "analyzed", or "analysis_failed". */
            mealAnalysisStatus: string | null;
            /** @description Meal analysis updated timestamp (ISO 8601). */
            mealAnalysisUpdatedAt: string | null;
            /**
             * @description Coarse energy bucket derived from the interval.
             * @enum {string|null}
             */
            mealCalorieBucket: "low" | "medium" | "high" | null;
            /** @description Estimated energy interval upper bound (kcal). */
            mealCalorieMax: number | null;
            /** @description Estimated energy interval lower bound (kcal). */
            mealCalorieMin: number | null;
            /** @description Most important meal finding, for the list row. */
            mealHeadline: string | null;
            /** @description Free-text note. */
            note: string | null;
            /** @description Date in YYYY-MM-DD format. */
            occurredAt: string;
            /** @description Time in HH:mm 24-hour format when available. */
            occurredTime: string | null;
            /** @description Structured payload for kind-specific data. For sleep: { startedAt, endedAt, durationMinutes, sleepType?, quality?, deepMinutes?, lightMinutes?, remMinutes? }. For symptom: { symptom?: string, severity?: "mild"|"moderate"|"severe"|"unknown", customLabel?: string }. For vital: { vitalType, value, unit, secondaryValue?, secondaryUnit? }. For activity: { activityType, value, unit }. For meal (detail reads only): { mealAnalysis: { version, analysisStatus, analyzedAt, sourceRevision, model, promptVersion, locale, failureReason, calorieRange, dishes, items, facets } }. */
            payload: {
                [key: string]: unknown;
            } | null;
            /** @description Source. */
            source: string | null;
            /** @description Short label. */
            title: string | null;
            /** @description Unit label. */
            unit: string | null;
            /** @description Updated at (ISO 8601). */
            updatedAt: string;
            /** @description Measured value. */
            value: string | null;
        };
        DailyRecordListResponseItemsAttachments: {
            /** @description Object storage bucket. */
            bucket: string | null;
            /** @description MIME content type. */
            contentType: string | null;
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Original file name. */
            fileName: string | null;
            /** @description Image height in pixels. */
            height: number | null;
            /** @description Attachment id. */
            id: string;
            /** @enum {string} */
            kind: "image";
            /** @description Object storage key. */
            objectKey: string;
            /** @description Storage provider. */
            provider: string | null;
            /** @description Public or signed display URL. */
            publicUrl: string | null;
            /** @description File size in bytes. */
            sizeBytes: number | null;
            /** @description Image width in pixels. */
            width: number | null;
        };
        DailyRecordResponse: {
            attachments: components["schemas"]["DailyRecordResponseAttachments"][];
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Linked health event id. */
            healthEventId: string | null;
            /** @description Record id. */
            id: string;
            /** @enum {string} */
            kind: "water" | "meal" | "vital" | "mood" | "symptom" | "activity" | "note" | "sleep";
            /** @description Stable failure reason code (image_count_invalid, vision_unavailable, model_failed, model_timeout, job_lost, invalid_output). */
            mealAnalysisFailureReason: string | null;
            /** @description Meal analysis status: "analyzing", "analyzed", or "analysis_failed". */
            mealAnalysisStatus: string | null;
            /** @description Meal analysis updated timestamp (ISO 8601). */
            mealAnalysisUpdatedAt: string | null;
            /**
             * @description Coarse energy bucket derived from the interval.
             * @enum {string|null}
             */
            mealCalorieBucket: "low" | "medium" | "high" | null;
            /** @description Estimated energy interval upper bound (kcal). */
            mealCalorieMax: number | null;
            /** @description Estimated energy interval lower bound (kcal). */
            mealCalorieMin: number | null;
            /** @description Most important meal finding, for the list row. */
            mealHeadline: string | null;
            /** @description Free-text note. */
            note: string | null;
            /** @description Date in YYYY-MM-DD format. */
            occurredAt: string;
            /** @description Time in HH:mm 24-hour format when available. */
            occurredTime: string | null;
            /** @description Structured payload for kind-specific data. For sleep: { startedAt, endedAt, durationMinutes, sleepType?, quality?, deepMinutes?, lightMinutes?, remMinutes? }. For symptom: { symptom?: string, severity?: "mild"|"moderate"|"severe"|"unknown", customLabel?: string }. For vital: { vitalType, value, unit, secondaryValue?, secondaryUnit? }. For activity: { activityType, value, unit }. For meal (detail reads only): { mealAnalysis: { version, analysisStatus, analyzedAt, sourceRevision, model, promptVersion, locale, failureReason, calorieRange, dishes, items, facets } }. */
            payload: {
                [key: string]: unknown;
            } | null;
            /** @description Source. */
            source: string | null;
            /** @description Short label. */
            title: string | null;
            /** @description Unit label. */
            unit: string | null;
            /** @description Updated at (ISO 8601). */
            updatedAt: string;
            /** @description Measured value. */
            value: string | null;
        };
        DailyRecordResponseAttachments: {
            /** @description Object storage bucket. */
            bucket: string | null;
            /** @description MIME content type. */
            contentType: string | null;
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Original file name. */
            fileName: string | null;
            /** @description Image height in pixels. */
            height: number | null;
            /** @description Attachment id. */
            id: string;
            /** @enum {string} */
            kind: "image";
            /** @description Object storage key. */
            objectKey: string;
            /** @description Storage provider. */
            provider: string | null;
            /** @description Public or signed display URL. */
            publicUrl: string | null;
            /** @description File size in bytes. */
            sizeBytes: number | null;
            /** @description Image width in pixels. */
            width: number | null;
        };
        DailyRecordSummaryResponse: {
            summaries: components["schemas"]["DailyRecordSummaryResponseSummaries"][];
        };
        DailyRecordSummaryResponseSummaries: {
            /** @description Count of records for this kind on the given date. */
            count: number;
            /** @enum {string} */
            kind: "water" | "meal" | "vital" | "mood" | "symptom" | "activity" | "note" | "sleep";
            latest: components["schemas"]["DailyRecordSummaryResponseSummariesLatest"];
        };
        /** @description Most recent record of this kind. */
        DailyRecordSummaryResponseSummariesLatest: {
            attachments: components["schemas"]["DailyRecordSummaryResponseSummariesLatestAttachments"][];
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Linked health event id. */
            healthEventId: string | null;
            /** @description Record id. */
            id: string;
            /** @enum {string} */
            kind: "water" | "meal" | "vital" | "mood" | "symptom" | "activity" | "note" | "sleep";
            /** @description Stable failure reason code (image_count_invalid, vision_unavailable, model_failed, model_timeout, job_lost, invalid_output). */
            mealAnalysisFailureReason: string | null;
            /** @description Meal analysis status: "analyzing", "analyzed", or "analysis_failed". */
            mealAnalysisStatus: string | null;
            /** @description Meal analysis updated timestamp (ISO 8601). */
            mealAnalysisUpdatedAt: string | null;
            /**
             * @description Coarse energy bucket derived from the interval.
             * @enum {string|null}
             */
            mealCalorieBucket: "low" | "medium" | "high" | null;
            /** @description Estimated energy interval upper bound (kcal). */
            mealCalorieMax: number | null;
            /** @description Estimated energy interval lower bound (kcal). */
            mealCalorieMin: number | null;
            /** @description Most important meal finding, for the list row. */
            mealHeadline: string | null;
            /** @description Free-text note. */
            note: string | null;
            /** @description Date in YYYY-MM-DD format. */
            occurredAt: string;
            /** @description Time in HH:mm 24-hour format when available. */
            occurredTime: string | null;
            /** @description Structured payload for kind-specific data. For sleep: { startedAt, endedAt, durationMinutes, sleepType?, quality?, deepMinutes?, lightMinutes?, remMinutes? }. For symptom: { symptom?: string, severity?: "mild"|"moderate"|"severe"|"unknown", customLabel?: string }. For vital: { vitalType, value, unit, secondaryValue?, secondaryUnit? }. For activity: { activityType, value, unit }. For meal (detail reads only): { mealAnalysis: { version, analysisStatus, analyzedAt, sourceRevision, model, promptVersion, locale, failureReason, calorieRange, dishes, items, facets } }. */
            payload: {
                [key: string]: unknown;
            } | null;
            /** @description Source. */
            source: string | null;
            /** @description Short label. */
            title: string | null;
            /** @description Unit label. */
            unit: string | null;
            /** @description Updated at (ISO 8601). */
            updatedAt: string;
            /** @description Measured value. */
            value: string | null;
        } | null;
        DailyRecordSummaryResponseSummariesLatestAttachments: {
            /** @description Object storage bucket. */
            bucket: string | null;
            /** @description MIME content type. */
            contentType: string | null;
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Original file name. */
            fileName: string | null;
            /** @description Image height in pixels. */
            height: number | null;
            /** @description Attachment id. */
            id: string;
            /** @enum {string} */
            kind: "image";
            /** @description Object storage key. */
            objectKey: string;
            /** @description Storage provider. */
            provider: string | null;
            /** @description Public or signed display URL. */
            publicUrl: string | null;
            /** @description File size in bytes. */
            sizeBytes: number | null;
            /** @description Image width in pixels. */
            width: number | null;
        };
        DataExportRequestData: {
            completedAt: string | null;
            downloadUrl: string | null;
            errorMessage: string | null;
            fileName: string | null;
            fileSizeBytes: number | null;
            /** @enum {string} */
            format: "pdf";
            /** @description Unique request identifier. */
            id: string;
            /** @enum {string} */
            kind: "hospital" | "monthly" | "print";
            /** @enum {string} */
            range: "last_7_days" | "last_30_days";
            /** @description ISO-8601 timestamp when the request was created. */
            requestedAt: string;
            /** @enum {string} */
            status: "requested" | "processing" | "completed" | "failed" | "unavailable";
        } | null;
        DataExportRequestResponse: {
            completedAt: string | null;
            downloadUrl: string | null;
            errorMessage: string | null;
            fileName: string | null;
            fileSizeBytes: number | null;
            /** @enum {string} */
            format: "pdf";
            /** @description Unique request identifier. */
            id: string;
            /** @enum {string} */
            kind: "hospital" | "monthly" | "print";
            /** @enum {string} */
            range: "last_7_days" | "last_30_days";
            /** @description ISO-8601 timestamp when the request was created. */
            requestedAt: string;
            /** @enum {string} */
            status: "requested" | "processing" | "completed" | "failed" | "unavailable";
        };
        DeleteAccountRequest: {
            /** @description 邮箱验证码（OAuth-only 用户使用此方式确认注销） */
            code?: string;
            /** @description 当前密码（有密码的用户使用此方式确认注销） */
            password?: string;
        };
        DoseLogListResponse: {
            /** @description Dose logs for the date. */
            items: components["schemas"]["DoseLogListResponseItems"][];
            /** @description Total count of dose logs for the date. */
            total: number;
        };
        DoseLogListResponseItems: {
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Linked current medicine id. */
            currentMedicineId: string | null;
            /** @description Dose text. */
            doseText: string | null;
            /** @description Linked health event id. */
            healthEventId: string | null;
            /** @description Dose log id. */
            id: string;
            /** @description Free-text note. */
            note: string | null;
            /** @description Linked reminder id for slot-aware logs. */
            reminderId: string | null;
            /** @description Scheduled date in YYYY-MM-DD format. */
            scheduledFor: string;
            /** @description Scheduled slot time in HH:mm format. */
            scheduledTime: string | null;
            /** @description Source. */
            source: string | null;
            /**
             * @description Dose log status.
             * @enum {string}
             */
            status: "taken" | "skipped" | "missed" | "planned";
            /** @description Updated at (ISO 8601). */
            updatedAt: string;
        };
        DoseLogResponse: {
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Linked current medicine id. */
            currentMedicineId: string | null;
            /** @description Dose text. */
            doseText: string | null;
            /** @description Linked health event id. */
            healthEventId: string | null;
            /** @description Dose log id. */
            id: string;
            /** @description Free-text note. */
            note: string | null;
            /** @description Linked reminder id for slot-aware logs. */
            reminderId: string | null;
            /** @description Scheduled date in YYYY-MM-DD format. */
            scheduledFor: string;
            /** @description Scheduled slot time in HH:mm format. */
            scheduledTime: string | null;
            /** @description Source. */
            source: string | null;
            /**
             * @description Dose log status.
             * @enum {string}
             */
            status: "taken" | "skipped" | "missed" | "planned";
            /** @description Updated at (ISO 8601). */
            updatedAt: string;
        };
        /** @default {} */
        DownloadClinicSummaryPdfRequest: {
            /** @description Date-range scope start (ISO 8601 date, YYYY-MM-DD). Both dates are required whenever a date range is given (a partial pair is rejected); ignored when eventId is present. When neither eventId nor a date range is supplied, the summary falls back to the default last_30_days range (legacy semantics). */
            dateFrom?: string;
            /** @description Date-range scope end (ISO 8601 date, YYYY-MM-DD). Inclusive calendar day; both dates required whenever a date range is given; span must cover at most 30 inclusive calendar days. When neither eventId nor a date range is supplied, the summary falls back to the default last_30_days range (legacy semantics). */
            dateTo?: string;
            /** @description Event scope: build the summary from this event review. Wins over dateFrom/dateTo when both are supplied. */
            eventId?: string;
            /** @description Summary sections to include. Empty arrays and unknown values are rejected; when omitted every section is included. */
            selectedFields?: ("event_overview" | "symptom_changes" | "medication_slots" | "water" | "sleep" | "notes")[];
        };
        EndRequest: {
            /**
             * @description User-confirmed outcome when ending the event.
             * @enum {string}
             */
            outcome: "improved" | "unchanged" | "worsened";
        };
        EnqueueAnalysisGenerationRequest: {
            /** @description Target date in YYYY-MM-DD format. Defaults to backend current day when omitted. */
            date?: string;
        };
        /** @default {} */
        EnqueueClinicSummaryPdfExportRequest: {
            /** @description Date-range scope start (ISO 8601 date, YYYY-MM-DD). Both dates are required whenever a date range is given (a partial pair is rejected); ignored when eventId is present. When neither eventId nor a date range is supplied, the summary falls back to the default last_30_days range (legacy semantics). */
            dateFrom?: string;
            /** @description Date-range scope end (ISO 8601 date, YYYY-MM-DD). Inclusive calendar day; both dates required whenever a date range is given; span must cover at most 30 inclusive calendar days. When neither eventId nor a date range is supplied, the summary falls back to the default last_30_days range (legacy semantics). */
            dateTo?: string;
            /** @description Event scope: build the summary from this event review. Wins over dateFrom/dateTo when both are supplied. */
            eventId?: string;
            /** @description Summary sections to include. Empty arrays and unknown values are rejected; when omitted every section is included. */
            selectedFields?: ("event_overview" | "symptom_changes" | "medication_slots" | "water" | "sleep" | "notes")[];
        };
        EnqueueMedicineRecognitionRequest: {
            /**
             * Format: uri
             * @description Public URL of the medicine box image
             * @example https://cdn.lumos.example/medicines/amoxicillin-box.jpg
             */
            imageUrl: string;
        };
        /** @default {} */
        EnqueueSummaryGenerationRequest: {
            /** @description Required when range is "custom". ISO 8601 date string (YYYY-MM-DD). */
            endDate?: string;
            /**
             * @description Supported report summary aggregation range.
             * @enum {string}
             */
            range?: "last_7_days" | "last_30_days" | "custom";
            /** @description Required when range is "custom". ISO 8601 date string (YYYY-MM-DD). */
            startDate?: string;
        };
        EnvironmentSnapshotResponse: {
            airQuality: components["schemas"]["EnvironmentSnapshotResponseAirQuality"];
            /** @enum {string} */
            dataSource: "static" | "live";
            humidity: components["schemas"]["EnvironmentSnapshotResponseHumidity"];
            pollen: components["schemas"]["EnvironmentSnapshotResponsePollen"];
            regionHint: string | null;
            temperature: components["schemas"]["EnvironmentSnapshotResponseTemperature"];
            /** @description ISO-8601 timestamp for the static reference data refresh. */
            updatedAt: string;
            uv: components["schemas"]["EnvironmentSnapshotResponseUv"];
        };
        EnvironmentSnapshotResponseAirQuality: {
            aqi: number;
            /** @enum {string} */
            level: "good" | "moderate" | "unhealthy_sensitive" | "unhealthy" | "very_unhealthy" | "hazardous";
            primaryPollutant: string | null;
        };
        EnvironmentSnapshotResponseHumidity: {
            percent: number;
        };
        EnvironmentSnapshotResponsePollen: {
            /** @enum {string} */
            level: "low" | "medium" | "high";
            primaryType: string | null;
            unit: string | null;
            value: number | null;
        };
        EnvironmentSnapshotResponseTemperature: {
            celsius: number;
            feelsLike: number;
        };
        EnvironmentSnapshotResponseUv: {
            index: number;
            /** @enum {string} */
            level: "low" | "moderate" | "high" | "very_high" | "extreme";
        };
        EventReviewData: {
            /** @description Actions the user can take from this review, mapped by the client. */
            availableActions: ("check_in" | "end_event" | "clinic_summary" | "export")[];
            coverage: components["schemas"]["EventReviewDataCoverage"];
            event: components["schemas"]["EventReviewDataEvent"];
            /** @description Review assembly time in ISO 8601 format. */
            generatedAt: string;
            sections: components["schemas"]["EventReviewDataSections"];
            sourceTimestamps: components["schemas"]["EventReviewDataSourceTimestamps"];
        } | null;
        EventReviewDataCoverage: {
            checkIns: components["schemas"]["EventReviewDataCoverageCheckIns"];
            dailyRecords: components["schemas"]["EventReviewDataCoverageDailyRecords"];
            doseLogs: components["schemas"]["EventReviewDataCoverageDoseLogs"];
        };
        EventReviewDataCoverageCheckIns: {
            /**
             * @description 'none' when no check-ins exist; 'partial' when check-ins exist but sufficiency is not yet assessed by the section services.
             * @enum {string}
             */
            coverage: "sufficient" | "partial" | "none";
            /** @description No fixed expectation exists for check-ins. */
            expectedCount: number | null;
            /** @description First check-in calendar date, or null when none exists. */
            firstCheckInDate: string | null;
            /** @description Last check-in calendar date, or null when none exists. */
            lastCheckInDate: string | null;
            /** @description Number of user-confirmed check-ins. */
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            todayCheckIn: components["schemas"]["EventReviewDataCoverageCheckInsTodayCheckIn"];
            /** @description Event window end in ISO 8601 format. */
            windowEnd: string;
            /** @description Event window start in ISO 8601 format. */
            windowStart: string;
        };
        EventReviewDataCoverageCheckInsTodayCheckIn: {
            /** @description Calendar date in YYYY-MM-DD format. */
            date: string;
            /** @enum {string} */
            outcome: "improved" | "unchanged" | "worsened";
            /** @description Last update time in ISO 8601 format. */
            updatedAt: string;
        } | null;
        EventReviewDataCoverageDailyRecords: {
            /**
             * @description The skeleton emits 'none' or 'partial'; sufficiency assessment lands with the section services.
             * @enum {string}
             */
            coverage: "sufficient" | "partial" | "none";
            /** @description No fixed expectation is defined for this source yet. */
            expectedCount: number | null;
            /** @description Number of observations in the event window. */
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            /** @description Event window end in ISO 8601 format. */
            windowEnd: string;
            /** @description Event window start in ISO 8601 format. */
            windowStart: string;
        };
        EventReviewDataCoverageDoseLogs: {
            /**
             * @description The skeleton emits 'none' or 'partial'; sufficiency assessment lands with the section services.
             * @enum {string}
             */
            coverage: "sufficient" | "partial" | "none";
            /** @description No fixed expectation is defined for this source yet. */
            expectedCount: number | null;
            /** @description Number of observations in the event window. */
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            /** @description Event window end in ISO 8601 format. */
            windowEnd: string;
            /** @description Event window start in ISO 8601 format. */
            windowStart: string;
        };
        EventReviewDataEvent: {
            currentMedicineIds: string[];
            /** @description End time in ISO 8601 format, or null while active. */
            endedAt: string | null;
            id: string;
            /** @enum {string} */
            kind: "symptom" | "other";
            /** @enum {string|null} */
            outcome: "improved" | "unchanged" | "worsened" | null;
            /** @description Start time in ISO 8601 format. */
            startedAt: string;
            /** @enum {string} */
            status: "active" | "ended";
            title: string;
        };
        EventReviewDataSections: {
            completedActions: components["schemas"]["EventReviewDataSectionsCompletedActions"];
            keyChanges: components["schemas"]["EventReviewDataSectionsKeyChanges"];
            nextStep: components["schemas"]["EventReviewDataSectionsNextStep"];
            whatHappened: components["schemas"]["EventReviewDataSectionsWhatHappened"];
        };
        EventReviewDataSectionsCompletedActions: {
            facts?: components["schemas"]["EventReviewDataSectionsCompletedActionsFacts"];
            /**
             * @description Fixed reason code when state is unknown: no_observations (window has no observations), no_completed_actions (no confirmed doses or check-ins), insufficient_coverage (observations exist but no trend is computable).
             * @enum {string}
             */
            reasonCode?: "no_observations" | "no_completed_actions" | "insufficient_coverage";
            /** @enum {string} */
            state: "available" | "unknown";
        };
        /** @description Basic facts when state is available. */
        EventReviewDataSectionsCompletedActionsFacts: {
            /** @description Structured fact arguments for the client localizer. */
            arguments: {
                [key: string]: unknown;
            };
            /** @description Structured fact code; localized by the client. */
            code: string;
        };
        EventReviewDataSectionsKeyChanges: {
            facts?: components["schemas"]["EventReviewDataSectionsKeyChangesFacts"];
            /**
             * @description Fixed reason code when state is unknown: no_observations (window has no observations), no_completed_actions (no confirmed doses or check-ins), insufficient_coverage (observations exist but no trend is computable).
             * @enum {string}
             */
            reasonCode?: "no_observations" | "no_completed_actions" | "insufficient_coverage";
            /** @enum {string} */
            state: "available" | "unknown";
        };
        /** @description Basic facts when state is available. */
        EventReviewDataSectionsKeyChangesFacts: {
            /** @description Structured fact arguments for the client localizer. */
            arguments: {
                [key: string]: unknown;
            };
            /** @description Structured fact code; localized by the client. */
            code: string;
        };
        EventReviewDataSectionsNextStep: {
            facts?: components["schemas"]["EventReviewDataSectionsNextStepFacts"];
            /**
             * @description Fixed reason code when state is unknown: no_observations (window has no observations), no_completed_actions (no confirmed doses or check-ins), insufficient_coverage (observations exist but no trend is computable).
             * @enum {string}
             */
            reasonCode?: "no_observations" | "no_completed_actions" | "insufficient_coverage";
            /** @enum {string} */
            state: "available" | "unknown";
        };
        /** @description Basic facts when state is available. */
        EventReviewDataSectionsNextStepFacts: {
            /** @description Structured fact arguments for the client localizer. */
            arguments: {
                [key: string]: unknown;
            };
            /** @description Structured fact code; localized by the client. */
            code: string;
        };
        EventReviewDataSectionsWhatHappened: {
            facts?: components["schemas"]["EventReviewDataSectionsWhatHappenedFacts"];
            /**
             * @description Fixed reason code when state is unknown: no_observations (window has no observations), no_completed_actions (no confirmed doses or check-ins), insufficient_coverage (observations exist but no trend is computable).
             * @enum {string}
             */
            reasonCode?: "no_observations" | "no_completed_actions" | "insufficient_coverage";
            /** @enum {string} */
            state: "available" | "unknown";
        };
        /** @description Basic facts when state is available. */
        EventReviewDataSectionsWhatHappenedFacts: {
            /** @description Structured fact arguments for the client localizer. */
            arguments: {
                [key: string]: unknown;
            };
            /** @description Structured fact code; localized by the client. */
            code: string;
        };
        EventReviewDataSourceTimestamps: {
            /** @description Last check-in calendar date (YYYY-MM-DD), or null. */
            checkIns: string | null;
            /** @description Latest daily-record creation time in the event window (ISO 8601), or null. */
            dailyRecords: string | null;
            /** @description Latest dose-log scheduled time in the event window (ISO 8601), or null. */
            doseLogs: string | null;
        };
        EventReviewListResponse: {
            items: components["schemas"]["EventReviewListResponseItems"][];
            /** @description Cursor for the next page (last item startedAt in ISO 8601), or null on the last page. */
            nextCursor: string | null;
            /** @description Total matching events for the filter. */
            total: number;
        };
        EventReviewListResponseItems: {
            currentMedicineIds: string[];
            /** @description End time in ISO 8601 format, or null while active. */
            endedAt: string | null;
            id: string;
            /** @enum {string} */
            kind: "symptom" | "other";
            /** @enum {string|null} */
            outcome: "improved" | "unchanged" | "worsened" | null;
            /** @description Start time in ISO 8601 format. */
            startedAt: string;
            /** @enum {string} */
            status: "active" | "ended";
            title: string;
        };
        EventReviewResponse: {
            /** @description Actions the user can take from this review, mapped by the client. */
            availableActions: ("check_in" | "end_event" | "clinic_summary" | "export")[];
            coverage: components["schemas"]["EventReviewResponseCoverage"];
            event: components["schemas"]["EventReviewResponseEvent"];
            /** @description Review assembly time in ISO 8601 format. */
            generatedAt: string;
            sections: components["schemas"]["EventReviewResponseSections"];
            sourceTimestamps: components["schemas"]["EventReviewResponseSourceTimestamps"];
        };
        EventReviewResponseCoverage: {
            checkIns: components["schemas"]["EventReviewResponseCoverageCheckIns"];
            dailyRecords: components["schemas"]["EventReviewResponseCoverageDailyRecords"];
            doseLogs: components["schemas"]["EventReviewResponseCoverageDoseLogs"];
        };
        EventReviewResponseCoverageCheckIns: {
            /**
             * @description 'none' when no check-ins exist; 'partial' when check-ins exist but sufficiency is not yet assessed by the section services.
             * @enum {string}
             */
            coverage: "sufficient" | "partial" | "none";
            /** @description No fixed expectation exists for check-ins. */
            expectedCount: number | null;
            /** @description First check-in calendar date, or null when none exists. */
            firstCheckInDate: string | null;
            /** @description Last check-in calendar date, or null when none exists. */
            lastCheckInDate: string | null;
            /** @description Number of user-confirmed check-ins. */
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            todayCheckIn: components["schemas"]["EventReviewResponseCoverageCheckInsTodayCheckIn"];
            /** @description Event window end in ISO 8601 format. */
            windowEnd: string;
            /** @description Event window start in ISO 8601 format. */
            windowStart: string;
        };
        EventReviewResponseCoverageCheckInsTodayCheckIn: {
            /** @description Calendar date in YYYY-MM-DD format. */
            date: string;
            /** @enum {string} */
            outcome: "improved" | "unchanged" | "worsened";
            /** @description Last update time in ISO 8601 format. */
            updatedAt: string;
        } | null;
        EventReviewResponseCoverageDailyRecords: {
            /**
             * @description The skeleton emits 'none' or 'partial'; sufficiency assessment lands with the section services.
             * @enum {string}
             */
            coverage: "sufficient" | "partial" | "none";
            /** @description No fixed expectation is defined for this source yet. */
            expectedCount: number | null;
            /** @description Number of observations in the event window. */
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            /** @description Event window end in ISO 8601 format. */
            windowEnd: string;
            /** @description Event window start in ISO 8601 format. */
            windowStart: string;
        };
        EventReviewResponseCoverageDoseLogs: {
            /**
             * @description The skeleton emits 'none' or 'partial'; sufficiency assessment lands with the section services.
             * @enum {string}
             */
            coverage: "sufficient" | "partial" | "none";
            /** @description No fixed expectation is defined for this source yet. */
            expectedCount: number | null;
            /** @description Number of observations in the event window. */
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            /** @description Event window end in ISO 8601 format. */
            windowEnd: string;
            /** @description Event window start in ISO 8601 format. */
            windowStart: string;
        };
        EventReviewResponseEvent: {
            currentMedicineIds: string[];
            /** @description End time in ISO 8601 format, or null while active. */
            endedAt: string | null;
            id: string;
            /** @enum {string} */
            kind: "symptom" | "other";
            /** @enum {string|null} */
            outcome: "improved" | "unchanged" | "worsened" | null;
            /** @description Start time in ISO 8601 format. */
            startedAt: string;
            /** @enum {string} */
            status: "active" | "ended";
            title: string;
        };
        EventReviewResponseSections: {
            completedActions: components["schemas"]["EventReviewResponseSectionsCompletedActions"];
            keyChanges: components["schemas"]["EventReviewResponseSectionsKeyChanges"];
            nextStep: components["schemas"]["EventReviewResponseSectionsNextStep"];
            whatHappened: components["schemas"]["EventReviewResponseSectionsWhatHappened"];
        };
        EventReviewResponseSectionsCompletedActions: {
            facts?: components["schemas"]["EventReviewResponseSectionsCompletedActionsFacts"];
            /**
             * @description Fixed reason code when state is unknown: no_observations (window has no observations), no_completed_actions (no confirmed doses or check-ins), insufficient_coverage (observations exist but no trend is computable).
             * @enum {string}
             */
            reasonCode?: "no_observations" | "no_completed_actions" | "insufficient_coverage";
            /** @enum {string} */
            state: "available" | "unknown";
        };
        /** @description Basic facts when state is available. */
        EventReviewResponseSectionsCompletedActionsFacts: {
            /** @description Structured fact arguments for the client localizer. */
            arguments: {
                [key: string]: unknown;
            };
            /** @description Structured fact code; localized by the client. */
            code: string;
        };
        EventReviewResponseSectionsKeyChanges: {
            facts?: components["schemas"]["EventReviewResponseSectionsKeyChangesFacts"];
            /**
             * @description Fixed reason code when state is unknown: no_observations (window has no observations), no_completed_actions (no confirmed doses or check-ins), insufficient_coverage (observations exist but no trend is computable).
             * @enum {string}
             */
            reasonCode?: "no_observations" | "no_completed_actions" | "insufficient_coverage";
            /** @enum {string} */
            state: "available" | "unknown";
        };
        /** @description Basic facts when state is available. */
        EventReviewResponseSectionsKeyChangesFacts: {
            /** @description Structured fact arguments for the client localizer. */
            arguments: {
                [key: string]: unknown;
            };
            /** @description Structured fact code; localized by the client. */
            code: string;
        };
        EventReviewResponseSectionsNextStep: {
            facts?: components["schemas"]["EventReviewResponseSectionsNextStepFacts"];
            /**
             * @description Fixed reason code when state is unknown: no_observations (window has no observations), no_completed_actions (no confirmed doses or check-ins), insufficient_coverage (observations exist but no trend is computable).
             * @enum {string}
             */
            reasonCode?: "no_observations" | "no_completed_actions" | "insufficient_coverage";
            /** @enum {string} */
            state: "available" | "unknown";
        };
        /** @description Basic facts when state is available. */
        EventReviewResponseSectionsNextStepFacts: {
            /** @description Structured fact arguments for the client localizer. */
            arguments: {
                [key: string]: unknown;
            };
            /** @description Structured fact code; localized by the client. */
            code: string;
        };
        EventReviewResponseSectionsWhatHappened: {
            facts?: components["schemas"]["EventReviewResponseSectionsWhatHappenedFacts"];
            /**
             * @description Fixed reason code when state is unknown: no_observations (window has no observations), no_completed_actions (no confirmed doses or check-ins), insufficient_coverage (observations exist but no trend is computable).
             * @enum {string}
             */
            reasonCode?: "no_observations" | "no_completed_actions" | "insufficient_coverage";
            /** @enum {string} */
            state: "available" | "unknown";
        };
        /** @description Basic facts when state is available. */
        EventReviewResponseSectionsWhatHappenedFacts: {
            /** @description Structured fact arguments for the client localizer. */
            arguments: {
                [key: string]: unknown;
            };
            /** @description Structured fact code; localized by the client. */
            code: string;
        };
        EventReviewResponseSourceTimestamps: {
            /** @description Last check-in calendar date (YYYY-MM-DD), or null. */
            checkIns: string | null;
            /** @description Latest daily-record creation time in the event window (ISO 8601), or null. */
            dailyRecords: string | null;
            /** @description Latest dose-log scheduled time in the event window (ISO 8601), or null. */
            doseLogs: string | null;
        };
        ForgotPasswordRequest: {
            /** @description 邮箱地址 */
            email: string;
        };
        ForgotPasswordResponse: {
            /**
             * @description 冷却时间（秒）
             * @example 60
             */
            cooldown: number;
            /**
             * @description 提示消息
             * @example 验证码已发送，请注意查收
             */
            message: string;
        };
        /**
         * @example {
         *       "daily": [
         *         {
         *           "date": "2026-01-15",
         *           "eventStarted": 120,
         *           "suggestionImpression": 340,
         *           "suggestionActioned": 210,
         *           "eventEndedOrOutcome": 95,
         *           "reviewOpened": 60
         *         }
         *       ],
         *       "optional": {
         *         "visitSummaryPreviewed": 40,
         *         "visitSummaryExported": 12,
         *         "visitSummaryShareCreated": 8,
         *         "visitSummaryShareOpened": 5
         *       },
         *       "totals": {
         *         "eventStarted": 120,
         *         "suggestionImpression": 340,
         *         "suggestionActioned": 210,
         *         "eventEndedOrOutcome": 95,
         *         "reviewOpened": 60
         *       },
         *       "window": {
         *         "dateFrom": "2026-01-01",
         *         "dateTo": "2026-01-15",
         *         "generatedAt": "2026-01-16T08:30:00.000Z",
         *         "detailsSuppressed": false
         *       }
         *     }
         */
        FunnelResponse: {
            /** @description Per-UTC-day core funnel counts, ascending by date; empty when detailsSuppressed is true. */
            daily: components["schemas"]["FunnelResponseDaily"][];
            optional: components["schemas"]["FunnelResponseOptional"];
            totals: components["schemas"]["FunnelResponseTotals"];
            window: components["schemas"]["FunnelResponseWindow"];
        };
        FunnelResponseDaily: {
            /**
             * @description UTC calendar day (YYYY-MM-DD).
             * @example 2026-01-15
             */
            date: string;
            /** @description health_event_ended + health_event_outcome_confirmed count — the ended/outcome stage (both names are the same user-visible step). */
            eventEndedOrOutcome: number;
            /**
             * @description health_event_started count.
             * @example 120
             */
            eventStarted: number;
            /** @description review_opened count. */
            reviewOpened: number;
            /** @description suggestion_actioned count. */
            suggestionActioned: number;
            /** @description suggestion_impression count. */
            suggestionImpression: number;
        };
        /** @description Window totals of the optional visit-summary events. */
        FunnelResponseOptional: {
            /** @description visit_summary_exported count. */
            visitSummaryExported: number;
            /** @description visit_summary_previewed count. */
            visitSummaryPreviewed: number;
            /** @description visit_summary_share_created count. */
            visitSummaryShareCreated: number;
            /** @description visit_summary_share_opened count. */
            visitSummaryShareOpened: number;
        };
        /** @description Window totals of the core funnel (same breakdown as daily). */
        FunnelResponseTotals: {
            /** @description ended/outcome stage count. */
            eventEndedOrOutcome: number;
            /** @description health_event_started count. */
            eventStarted: number;
            /** @description review_opened count. */
            reviewOpened: number;
            /** @description suggestion_actioned count. */
            suggestionActioned: number;
            /** @description suggestion_impression count. */
            suggestionImpression: number;
        };
        FunnelResponseWindow: {
            /**
             * @description Window start (inclusive), UTC calendar day (YYYY-MM-DD).
             * @example 2026-01-01
             */
            dateFrom: string;
            /**
             * @description Window end (inclusive), UTC calendar day (YYYY-MM-DD).
             * @example 2026-01-15
             */
            dateTo: string;
            /** @description True when the window core-funnel total is below the fixed small-sample threshold — per-day group details are suppressed (daily is empty), window totals are still returned so the admin UI knows the sample is too small to break down. */
            detailsSuppressed: boolean;
            /** @description Response generation time (ISO 8601). */
            generatedAt: string;
        };
        GenerateCandidatesRequest: {
            /**
             * @description Wake date in YYYY-MM-DD format used as the candidate record date baseline.
             * @example 2026-06-04
             */
            occurredAt: string;
            /**
             * @description Natural-language note to be parsed into candidate daily records.
             * @example Slept about 7 hours and had a mild headache in the afternoon.
             */
            text: string;
            /**
             * @description Optional user timezone hint used only for interpretation wording. No server timezone conversion is persisted.
             * @example Asia/Shanghai
             */
            timezone?: string;
        };
        GenerateRequest: {
            /** @description Target date in YYYY-MM-DD format. Defaults to backend current day when omitted. */
            date?: string;
        };
        GenerateStreamRequest: {
            /** @description Target date in YYYY-MM-DD format. Defaults to backend current day when omitted. */
            date?: string;
        };
        /** @default {} */
        GenerateSummaryRequest: {
            /** @description Required when range is "custom". ISO 8601 date string (YYYY-MM-DD). */
            endDate?: string;
            /**
             * @description Supported report summary aggregation range.
             * @enum {string}
             */
            range?: "last_7_days" | "last_30_days" | "custom";
            /** @description Required when range is "custom". ISO 8601 date string (YYYY-MM-DD). */
            startDate?: string;
        };
        /** @default {} */
        GenerateSummaryStreamRequest: {
            /** @description Required when range is "custom". ISO 8601 date string (YYYY-MM-DD). */
            endDate?: string;
            /**
             * @description Supported report summary aggregation range.
             * @enum {string}
             */
            range?: "last_7_days" | "last_30_days" | "custom";
            /** @description Required when range is "custom". ISO 8601 date string (YYYY-MM-DD). */
            startDate?: string;
        };
        HealthContextResponse: {
            allergies: components["schemas"]["HealthContextResponseAllergies"][];
            conditions: components["schemas"]["HealthContextResponseConditions"][];
            currentMedicines: components["schemas"]["HealthContextResponseCurrentMedicines"][];
            profile: components["schemas"]["HealthContextResponseProfile"];
            summary: components["schemas"]["HealthContextResponseSummary"];
        };
        HealthContextResponseAllergies: {
            /** @description Created time in ISO 8601 format. */
            createdAt: string;
            /** @description Sparse allergy extensions stored in jsonb. */
            extras: unknown;
            /** @description Allergy id. */
            id: string;
            /** @description Whether the allergy is currently active. */
            isActive: boolean;
            /**
             * @description Allergy kind.
             * @enum {string}
             */
            kind: "drug" | "food" | "environment" | "other";
            /** @description User-visible allergy label. */
            label: string;
            /** @description User note for the allergy. */
            note: string | null;
            /** @description Recorded reaction. */
            reaction: string | null;
            /** @description When this allergy was recorded. */
            recordedAt: string | null;
            /**
             * @description Severity level.
             * @enum {string|null}
             */
            severity: "mild" | "moderate" | "severe" | "unknown" | null;
            /** @description Updated time in ISO 8601 format. */
            updatedAt: string;
        };
        HealthContextResponseConditions: {
            /** @description Created time in ISO 8601 format. */
            createdAt: string;
            /** @description Diagnosis date in YYYY-MM-DD format. */
            diagnosedAt: string | null;
            /** @description Sparse condition extensions stored in jsonb. */
            extras: unknown;
            /** @description Condition id. */
            id: string;
            /** @description Condition label. */
            label: string;
            /** @description User note for the condition. */
            note: string | null;
            /** @description Resolved date in YYYY-MM-DD format. */
            resolvedAt: string | null;
            /**
             * @description Condition status.
             * @enum {string}
             */
            status: "active" | "resolved" | "suspected";
            /** @description Updated time in ISO 8601 format. */
            updatedAt: string;
        };
        HealthContextResponseCurrentMedicines: {
            /** @description Created time in ISO 8601 format. */
            createdAt: string;
            /** @description Display name shown to the user. */
            displayName: string;
            /** @description Dose text. */
            doseText: string | null;
            /** @description End date in YYYY-MM-DD format. */
            endedAt: string | null;
            /** @description Current medicine id. */
            id: string;
            /** @description Whether the medicine is currently active. */
            isCurrent: boolean;
            /** @description User note for the medicine. */
            note: string | null;
            /** @description Administration route. */
            route: string | null;
            /**
             * @description Upstream source used to anchor this medicine.
             * @enum {string}
             */
            source: "drugbank" | "cn" | "manual";
            /** @description Original source payload stored in jsonb. */
            sourcePayload: unknown;
            /** @description Source-specific reference id. */
            sourceRefId: string | null;
            /** @description Start date in YYYY-MM-DD format. */
            startedAt: string | null;
            /** @description Strength text. */
            strengthText: string | null;
            /** @description Updated time in ISO 8601 format. */
            updatedAt: string;
        };
        HealthContextResponseProfile: {
            /**
             * @description Self-reported activity level. Absent/null on older payloads and caches.
             * @enum {string|null}
             */
            activityLevel?: "sedentary" | "lightlyActive" | "moderatelyActive" | "veryActive" | "extremelyActive" | null;
            /** @description Birth date in YYYY-MM-DD format. */
            birthDate: string | null;
            /** @description Dietary preferences extracted from extras JSONB. Absent/null on older payloads and caches. */
            dietaryPreferences?: string[] | null;
            /** @description Sparse profile extensions stored in jsonb. */
            extras: unknown;
            /** @description Height in centimeters. */
            heightCm: number | null;
            /** @description Preferred locale. */
            locale: string | null;
            /** @description When the onboarding flow was completed. */
            onboardingCompletedAt: string | null;
            /**
             * @description Sex assigned at birth.
             * @enum {string|null}
             */
            sexAtBirth: "female" | "male" | "intersex" | "unknown" | null;
            /** @description Preferred timezone. */
            timezone: string | null;
            /**
             * @description Preferred unit system.
             * @enum {string|null}
             */
            unitSystem: "metric" | "imperial" | null;
            /** @description Weight in kilograms. Extracted from extras JSONB. */
            weightKg: number | null;
        };
        HealthContextResponseSummary: {
            /** @description Number of active allergy records returned in this payload. */
            activeAllergyCount: number;
            /** @description Age derived from birth date. Null when birth date is missing. */
            age: number | null;
            /** @description Number of condition records returned in this payload. */
            conditionCount: number;
            /** @description Number of current medicine records returned in this payload. */
            currentMedicineCount: number;
            /** @description Missing core profile fields that the frontend can use for onboarding nudges. */
            missingCoreProfileFields: string[];
            /** @description Whether the onboarding flow has been completed. */
            onboardingCompleted: boolean;
        };
        HealthEventListResponse: {
            items: components["schemas"]["HealthEventListResponseItems"][];
            total: number;
        };
        HealthEventListResponseItems: {
            checkIn: components["schemas"]["HealthEventListResponseItemsCheckIn"];
            coverage: components["schemas"]["HealthEventListResponseItemsCoverage"];
            currentMedicineIds: string[];
            /** @description End time in ISO 8601 format, or null while active. */
            endedAt: string | null;
            id: string;
            /** @enum {string} */
            kind: "symptom" | "other";
            /** @enum {string|null} */
            outcome: "improved" | "unchanged" | "worsened" | null;
            reasonRecordId: string | null;
            /** @description Start time in ISO 8601 format. */
            startedAt: string;
            /** @enum {string} */
            status: "active" | "ended";
            title: string;
        };
        HealthEventListResponseItemsCheckIn: {
            /** @description Creation time in ISO 8601 format. */
            createdAt: string;
            /** @description Calendar date in YYYY-MM-DD format. */
            date: string;
            eventId: string;
            id: string;
            /** @enum {string} */
            outcome: "improved" | "unchanged" | "worsened";
            /** @description Last update time in ISO 8601 format. */
            updatedAt: string;
        } | null;
        HealthEventListResponseItemsCoverage: {
            /** @description Number of user-confirmed daily check-ins. */
            checkInCount: number;
            /** @description First check-in calendar date, or null when none exists. */
            firstCheckInDate: string | null;
            /** @description Last check-in calendar date, or null when none exists. */
            lastCheckInDate: string | null;
        };
        HealthEventNullableResponse: {
            checkIn: components["schemas"]["HealthEventNullableResponseCheckIn"];
            coverage: components["schemas"]["HealthEventNullableResponseCoverage"];
            currentMedicineIds: string[];
            /** @description End time in ISO 8601 format, or null while active. */
            endedAt: string | null;
            id: string;
            /** @enum {string} */
            kind: "symptom" | "other";
            /** @enum {string|null} */
            outcome: "improved" | "unchanged" | "worsened" | null;
            reasonRecordId: string | null;
            /** @description Start time in ISO 8601 format. */
            startedAt: string;
            /** @enum {string} */
            status: "active" | "ended";
            title: string;
        } | null;
        HealthEventNullableResponseCheckIn: {
            /** @description Creation time in ISO 8601 format. */
            createdAt: string;
            /** @description Calendar date in YYYY-MM-DD format. */
            date: string;
            eventId: string;
            id: string;
            /** @enum {string} */
            outcome: "improved" | "unchanged" | "worsened";
            /** @description Last update time in ISO 8601 format. */
            updatedAt: string;
        } | null;
        HealthEventNullableResponseCoverage: {
            /** @description Number of user-confirmed daily check-ins. */
            checkInCount: number;
            /** @description First check-in calendar date, or null when none exists. */
            firstCheckInDate: string | null;
            /** @description Last check-in calendar date, or null when none exists. */
            lastCheckInDate: string | null;
        };
        HealthEventResponse: {
            checkIn: components["schemas"]["HealthEventResponseCheckIn"];
            coverage: components["schemas"]["HealthEventResponseCoverage"];
            currentMedicineIds: string[];
            /** @description End time in ISO 8601 format, or null while active. */
            endedAt: string | null;
            id: string;
            /** @enum {string} */
            kind: "symptom" | "other";
            /** @enum {string|null} */
            outcome: "improved" | "unchanged" | "worsened" | null;
            reasonRecordId: string | null;
            /** @description Start time in ISO 8601 format. */
            startedAt: string;
            /** @enum {string} */
            status: "active" | "ended";
            title: string;
        };
        HealthEventResponseCheckIn: {
            /** @description Creation time in ISO 8601 format. */
            createdAt: string;
            /** @description Calendar date in YYYY-MM-DD format. */
            date: string;
            eventId: string;
            id: string;
            /** @enum {string} */
            outcome: "improved" | "unchanged" | "worsened";
            /** @description Last update time in ISO 8601 format. */
            updatedAt: string;
        } | null;
        HealthEventResponseCoverage: {
            /** @description Number of user-confirmed daily check-ins. */
            checkInCount: number;
            /** @description First check-in calendar date, or null when none exists. */
            firstCheckInDate: string | null;
            /** @description Last check-in calendar date, or null when none exists. */
            lastCheckInDate: string | null;
        };
        /**
         * @example {
         *       "status": "ok",
         *       "info": {
         *         "database": {
         *           "status": "up"
         *         },
         *         "cache": {
         *           "status": "up"
         *         },
         *         "app": {
         *           "status": "up"
         *         }
         *       },
         *       "error": {},
         *       "details": {
         *         "database": {
         *           "status": "up"
         *         },
         *         "cache": {
         *           "status": "up"
         *         },
         *         "app": {
         *           "status": "up"
         *         }
         *       }
         *     }
         */
        HealthResponse: {
            details: {
                [key: string]: {
                    backend?: string;
                    driver?: string;
                    durationMs?: number;
                    env?: string;
                    memoryHeapUsedBytes?: number;
                    memoryRssBytes?: number;
                    message?: string;
                    mode?: string;
                    name?: string;
                    pid?: number;
                    probe?: string;
                    /** @enum {string} */
                    status: "up" | "degraded" | "down";
                    uptimeSeconds?: number;
                } & {
                    [key: string]: unknown;
                };
            };
            error: {
                [key: string]: {
                    backend?: string;
                    driver?: string;
                    durationMs?: number;
                    env?: string;
                    memoryHeapUsedBytes?: number;
                    memoryRssBytes?: number;
                    message?: string;
                    mode?: string;
                    name?: string;
                    pid?: number;
                    probe?: string;
                    /** @enum {string} */
                    status: "up" | "degraded" | "down";
                    uptimeSeconds?: number;
                } & {
                    [key: string]: unknown;
                };
            };
            info: {
                [key: string]: {
                    backend?: string;
                    driver?: string;
                    durationMs?: number;
                    env?: string;
                    memoryHeapUsedBytes?: number;
                    memoryRssBytes?: number;
                    message?: string;
                    mode?: string;
                    name?: string;
                    pid?: number;
                    probe?: string;
                    /** @enum {string} */
                    status: "up" | "degraded" | "down";
                    uptimeSeconds?: number;
                } & {
                    [key: string]: unknown;
                };
            };
            /** @enum {string} */
            status: "ok" | "error" | "degraded" | "shutting_down";
        };
        LegalDocumentDetailResponse: {
            /** @description Markdown content of the document. */
            content: string;
            /**
             * @description Document type identifier used in URL paths.
             * @example terms-of-service
             */
            docType: string;
            title: string;
            /** @description ISO-8601 timestamp of last update. */
            updatedAt: string;
        };
        LegalDocumentListResponse: {
            items: components["schemas"]["LegalDocumentListResponseItems"][];
            /**
             * @description ISO-8601 timestamp of the most recent document update.
             * @example 2026-06-01T09:00:00.000Z
             */
            updatedAt: string;
        };
        LegalDocumentListResponseItems: {
            /** @description Document type identifier used in URL paths. */
            docType: string;
            title: string;
            /** @description ISO-8601 timestamp of last update. */
            updatedAt: string;
        };
        LinkWechatMobileIdentityRequest: {
            /** @description OAuth 授权码 */
            code: string;
        };
        LinkWechatWebIdentityRequest: {
            /** @description OAuth 授权码 */
            code: string;
            /** @description 授权时生成的 state */
            state: string;
        };
        LocalCapabilityResponse: {
            /**
             * @description Persisted local scheduling capability state.
             * @example active
             * @enum {string}
             */
            state: "active" | "unavailable" | "disabled";
        };
        LoginRequest: {
            /** @description 人机验证令牌 */
            captchaToken?: string;
            /** @description 邮箱验证码（与密码二选一） */
            code?: string;
            /** @description 邮箱地址 */
            email: string;
            /** @description 密码（与验证码二选一） */
            password?: string;
        };
        LoginResponse: {
            tokens: components["schemas"]["LoginResponseTokens"];
            user: components["schemas"]["LoginResponseUser"];
        };
        LoginResponseTokens: {
            /**
             * @description 访问令牌
             * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMSJ9
             */
            accessToken: string;
            /**
             * @description 访问令牌过期时间（秒）
             * @example 900
             */
            expiresIn: number;
            /**
             * @description 刷新令牌
             * @example rt_9f8c7b6a5d4e3f2a1b0c9d8e7f6a5b4c
             */
            refreshToken: string;
        };
        LoginResponseUser: {
            /** @description 头像 URL */
            avatar: string | null;
            /** @description 创建时间 (ISO 8601) */
            createdAt: string;
            /** @description 邮箱地址，第三方账号可能为空 */
            email: string | null;
            /** @description 邮箱是否已验证 */
            emailVerified: boolean;
            /** @description 邮箱验证时间 (ISO 8601) */
            emailVerifiedAt: string | null;
            /** @description 用户 ID */
            id: string;
            /** @description 昵称 */
            nickname: string | null;
            /** @description 更新时间 (ISO 8601) */
            updatedAt: string;
        };
        LoginWithAppleRequest: {
            /** @description Apple 登录返回的 authorizationCode（可选） */
            authorizationCode?: string;
            /** @description Apple 返回的 familyName（首次登录时返回） */
            familyName?: string;
            /** @description Apple 返回的 givenName（首次登录时返回） */
            givenName?: string;
            /** @description Apple 登录返回的 identityToken (JWT) */
            identityToken: string;
        };
        LoginWithCookieRequest: {
            /** @description 人机验证令牌 */
            captchaToken?: string;
            /** @description 邮箱验证码（与密码二选一） */
            code?: string;
            /** @description 邮箱地址 */
            email: string;
            /** @description 密码（与验证码二选一） */
            password?: string;
        };
        LoginWithGoogleRequest: {
            /** @description OAuth 授权码 */
            code: string;
            /** @description 授权时生成的 state */
            state: string;
        };
        LoginWithQqRequest: {
            /** @description OAuth 授权码 */
            code: string;
            /** @description 授权时生成的 state */
            state: string;
        };
        LoginWithWechatMobileRequest: {
            /** @description OAuth 授权码 */
            code: string;
        };
        LoginWithWechatWebRequest: {
            /** @description OAuth 授权码 */
            code: string;
            /** @description 授权时生成的 state */
            state: string;
        };
        LogoutRequest: {
            /** @description 刷新令牌 */
            refreshToken: string;
        };
        MarkRequest: {
            /** @description Linked current medicine id. */
            currentMedicineId?: string;
            /** @description Dose text. */
            doseText?: string | null;
            /**
             * Format: uuid
             * @description Linked active health event id.
             */
            healthEventId?: string | null;
            /** @description Free-text note. */
            note?: string | null;
            /** @description Linked reminder id for slot-aware marks. */
            reminderId?: string;
            /** @description Scheduled date YYYY-MM-DD. */
            scheduledFor: string;
            /** @description Scheduled slot time in HH:mm for slot-aware marks. */
            scheduledTime?: string;
            /** @enum {string} */
            status: "taken" | "skipped" | "missed" | "planned";
        };
        MedicineDetailResponse: {
            detail: {
                /** @enum {unknown} */
                kind: "drugbank" | "cnProduct";
            } & ({
                /** @description Absorption summary. */
                absorption: string | null;
                /** @description ATC codes. */
                atcCodes: string[] | null;
                /** @description ATC-like categories. */
                categories: string[] | null;
                /** @description Clearance. */
                clearance: string | null;
                /** @description Drug description. */
                description: string | null;
                /** @description DrugBank interaction entries used for interaction checking. */
                drugInteractions: components["schemas"]["MedicineDetailResponseDrugInteractions"][] | null;
                /** @description Drug type (e.g. small molecule). */
                drugType: string | null;
                /** @description External cross-reference identifiers from the source. */
                externalIdentifiers: components["schemas"]["MedicineDetailResponseExternalIdentifiers"][] | null;
                /** @description Outbound reference links from the source. */
                externalLinks: components["schemas"]["MedicineDetailResponseExternalLinks"][] | null;
                /** @description Food interactions. */
                foodInteractions: string[] | null;
                /** @description Approval groups (e.g. approved, small molecule). */
                groups: string[] | null;
                /** @description Half life. */
                halfLife: string | null;
                /** @description Approved indications. */
                indication: string | null;
                /** @enum {string} */
                kind: "drugbank";
                /** @description Mechanism of action. */
                mechanismOfAction: string | null;
                /** @description Metabolism summary. */
                metabolism: string | null;
                /** @description Pharmacodynamics. */
                pharmacodynamics: string | null;
                /** @description Protein binding. */
                proteinBinding: string | null;
                /** @description Route of elimination. */
                routeOfElimination: string | null;
                sequenceSummary: components["schemas"]["MedicineDetailResponseSequenceSummary"];
                /** @description Physical state (e.g. solid). */
                state: string | null;
                structure: components["schemas"]["MedicineDetailResponseStructure"];
                /** @description Synonyms. */
                synonyms: string[] | null;
                /** @description Proteins/genes this drug acts on, with action labels. */
                targets: components["schemas"]["MedicineDetailResponseTargets"][] | null;
                /** @description Toxicity summary. */
                toxicity: string | null;
                /** @description Volume of distribution. */
                volumeOfDistribution: string | null;
            } | {
                /** @description Adverse reactions. */
                adverseReactions: string | null;
                /** @description Approval number (国药准字). */
                approvalNumber: string | null;
                /** @description Barcode. */
                barcode: string | null;
                /** @description Brand name. */
                brandName: string | null;
                /** @description Contraindications. */
                contraindications: string | null;
                /** @description Dosage. */
                dosage: string | null;
                /** @description Image URL. */
                imageUrl: string | null;
                /** @description Indications. */
                indications: string | null;
                /** @description Ingredients. */
                ingredients: string | null;
                /** @enum {string} */
                kind: "cnProduct";
                /** @description Manufacturer. */
                manufacturer: string | null;
                /** @description National drug code. */
                nationalDrugCode: string | null;
                /** @description Overdose handling. */
                overdose: string | null;
                /** @description Package specification. */
                packageSpec: string | null;
                /** @description Pharmacokinetics. */
                pharmacokinetics: string | null;
                /** @description Pharmacology / toxicology. */
                pharmacologyToxicology: string | null;
                /** @description Precautions. */
                precautions: string | null;
                /** @description Properties. */
                properties: string | null;
                /** @description Source URL. */
                sourceUrl: string | null;
                /** @description Storage conditions. */
                storage: string | null;
                /** @description Validity period. */
                validityPeriod: string | null;
            });
            /** @description Medicine id in the selected source. */
            id: string;
            /** @description Display name. */
            name: string;
            /**
             * @description Knowledge source.
             * @enum {string}
             */
            source: "drugbank" | "cn";
            /** @description Short supporting subtitle. */
            subtitle: string | null;
        };
        MedicineDetailResponseDrugInteractions: {
            /** @description Interaction description. */
            description: string;
            /** @description Interacting DrugBank drug id. */
            drugbankId: string;
        };
        MedicineDetailResponseExternalIdentifiers: {
            /** @description Identifier within that resource. */
            identifier: string;
            /** @description Source resource label. */
            resource: string;
        };
        MedicineDetailResponseExternalLinks: {
            /** @description Source resource label. */
            resource: string;
            /** @description Outbound URL for that resource. */
            url: string;
        };
        /** @description Counts of available sequences; the sequences themselves are fetched from the sequence endpoint. */
        MedicineDetailResponseSequenceSummary: {
            /** @description Number of sequences belonging to the drug itself. */
            drugChainCount: number;
            /** @description Number of target sequences reachable from this drug. */
            targetSequenceCount: number;
        } | null;
        /** @description Computed structure descriptors, when the source has any. */
        MedicineDetailResponseStructure: {
            /** @description Hydrogen-bond acceptors. */
            acceptorCount: number | null;
            /** @description ALOGPS LogP. */
            alogpsLogP: number | null;
            /** @description ALOGPS water solubility (log). */
            alogpsLogS: number | null;
            /** @description ALOGPS water solubility with units, e.g. "4.64e-02 g/l". */
            alogpsSolubility: string | null;
            /** @description Heavy atom count. */
            atomCount: number | null;
            /** @description Average charge across neutral microspecies. */
            averageNeutralMicrospeciesCharge: number | null;
            /** @description Bioavailability score class (0/1). */
            bioavailability: number | null;
            /** @description Hydrogen-bond donors. */
            donorCount: number | null;
            /** @description Monoisotopic exact mass. */
            exactMass: number | null;
            /** @description Formal charge. */
            formalCharge: number | null;
            /** @description Molecular formula. */
            formula: string | null;
            /** @description Ghose filter pass (1/0). */
            ghoseFilter: number | null;
            /** @description Full InChI string. */
            inchiIdentifier: string | null;
            /** @description InChIKey hash. */
            inchiKey: string | null;
            /** @description IUPAC name. */
            iupacName: string | null;
            /** @description Wildman-Crippen LogP. */
            logP: number | null;
            /** @description MDDR-like rule pass (1/0). */
            mddrLikeRule: number | null;
            /** @description Average molecular weight. */
            molecularWeight: number | null;
            /** @description Charge of the neutral form. */
            neutralCharge: number | null;
            /** @description Charge at physiological pH. */
            physiologicalCharge: number | null;
            /** @description Strongest pKa. */
            pka: number | null;
            /** @description Strongest acidic pKa. */
            pkaStrongestAcidic: number | null;
            /** @description Strongest basic pKa. */
            pkaStrongestBasic: number | null;
            /** @description Average polarizability. */
            polarizability: number | null;
            /** @description Topological polar surface area (A^2). */
            polarSurfaceArea: number | null;
            /** @description Molar refractivity. */
            refractivity: number | null;
            /** @description Number of rings. */
            ringCount: number | null;
            /** @description Number of rotatable bonds. */
            rotatableBondCount: number | null;
            /** @description Lipinski rule-of-five pass (1/0). */
            ruleOfFive: number | null;
            /** @description Salt forms. */
            salts: string[] | null;
            /** @description Canonical SMILES. */
            smiles: string | null;
            /** @description Veber oral bioavailability rule (1/0). */
            veberRule: number | null;
        } | null;
        MedicineDetailResponseTargets: {
            /** @description Action labels (e.g. inhibitor, agonist). */
            actions: string[] | null;
            /** @description Target gene symbol. */
            geneName: string | null;
            /** @description Whether the action is characterised (yes/no). */
            knownAction: string | null;
            /** @description Target display name. */
            name: string;
            /** @description Known PDB structure identifiers. */
            pdbIds: string[] | null;
            /** @description Relationship kind (target, enzyme, carrier, transporter). */
            relationKind: string | null;
            /** @description Target species. */
            species: string | null;
            /** @description UniProt identifier. */
            uniprotId: string | null;
            /** @description UniProt title. */
            uniprotTitle: string | null;
        };
        MedicineRecognitionJob: {
            /** @description Queued recognition job identifier. */
            jobId?: string;
            result?: components["schemas"]["MedicineRecognitionJobResult"];
        };
        /** @description Inline recognition resource when queue processing is unavailable. */
        MedicineRecognitionJobResult: {
            /** @description Approval number. */
            approvalNumber: string | null;
            /** @description Manufacturer. */
            manufacturer: string | null;
            /** @description Recognized medicine name. */
            name: string | null;
            /** @description Package specification. */
            specification: string | null;
        };
        MedicineRecognitionResponse: {
            /** @description Approval number. */
            approvalNumber: string | null;
            /** @description Manufacturer. */
            manufacturer: string | null;
            /** @description Recognized medicine name. */
            name: string | null;
            /** @description Package specification. */
            specification: string | null;
        };
        MedicineReminderListResponse: {
            /** @description Medicine reminders. */
            items: components["schemas"]["MedicineReminderListResponseItems"][];
        };
        MedicineReminderListResponseItems: {
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Linked current medicine id. */
            currentMedicineId: string | null;
            /** @description Weekday numbers 0-6. Null means every day. */
            daysOfWeek: number[] | null;
            /** @description Date in YYYY-MM-DD format when the reminder ends. */
            endDate: string | null;
            /** @description Reminder id. */
            id: string;
            /** @description Whether this reminder is active. */
            isActive: boolean;
            /** @description Reminder label. */
            label: string | null;
            /** @description User note. */
            note: string | null;
            /** @description Scheduled local hour, 0-23. */
            scheduledHour: number;
            /** @description Scheduled local minute, 0-59. */
            scheduledMinute: number;
            /** @description Date in YYYY-MM-DD format when the reminder starts. */
            startDate: string | null;
            /** @description Updated at (ISO 8601). */
            updatedAt: string;
        };
        MedicineReminderResponse: {
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Linked current medicine id. */
            currentMedicineId: string | null;
            /** @description Weekday numbers 0-6. Null means every day. */
            daysOfWeek: number[] | null;
            /** @description Date in YYYY-MM-DD format when the reminder ends. */
            endDate: string | null;
            /** @description Reminder id. */
            id: string;
            /** @description Whether this reminder is active. */
            isActive: boolean;
            /** @description Reminder label. */
            label: string | null;
            /** @description User note. */
            note: string | null;
            /** @description Scheduled local hour, 0-23. */
            scheduledHour: number;
            /** @description Scheduled local minute, 0-59. */
            scheduledMinute: number;
            /** @description Date in YYYY-MM-DD format when the reminder starts. */
            startDate: string | null;
            /** @description Updated at (ISO 8601). */
            updatedAt: string;
        };
        MedicineRiskCheckRecordResponse: {
            /**
             * @description Type of risk check.
             * @example static
             * @enum {string}
             */
            checkType: "static" | "llm";
            /**
             * Format: date-time
             * @description Created at (ISO 8601).
             */
            createdAt: string;
            result: components["schemas"]["MedicineRiskCheckRecordResponseResult"];
            /**
             * @description Persisted risk level.
             * @enum {string}
             */
            riskLevel: "safe" | "caution" | "risk" | "danger";
            /**
             * @description Persisted risk score (0-100).
             * @example 42
             */
            riskScore: number;
            /** @description Whether the record is stale. */
            stale: boolean;
            /**
             * Format: date-time
             * @description Updated at (ISO 8601).
             */
            updatedAt: string;
        };
        /** @description Check result. */
        MedicineRiskCheckRecordResponseResult: {
            /** @description Count actually checked. */
            checkedMedicineCount: number;
            /** @description Medicines skipped due to missing detail. */
            coverageIssues: components["schemas"]["MedicineRiskCheckRecordResponseResultCoverageIssues"][];
            /** @description Current medicine count. */
            currentMedicineCount: number;
            /** @description Detected risk findings. */
            findings: components["schemas"]["MedicineRiskCheckRecordResponseResultFindings"][];
            /** @description LLM check only */
            overallRecommendation?: string;
            /**
             * @description Overall risk level.
             * @enum {string}
             */
            overallRiskLevel: "safe" | "caution" | "risk" | "danger";
            /** @description Overall risk score (0-100). */
            overallRiskScore: number;
            /** @description Raised red flags. */
            redFlags: components["schemas"]["MedicineRiskCheckRecordResponseResultRedFlags"][];
        };
        MedicineRiskCheckRecordResponseResultCoverageIssues: {
            /** @description Medicine name without source detail. */
            medicineName: string;
            /**
             * @description Why the medicine detail was not checked.
             * @enum {string}
             */
            reason: "manualEntry" | "missingSourceRef" | "detailUnavailable";
        };
        MedicineRiskCheckRecordResponseResultFindings: {
            /**
             * @description Finding context.
             * @enum {string}
             */
            context: "none" | "alcohol" | "caffeine";
            /** @description Supporting evidence. */
            evidence?: string;
            /** @description Medicine the finding is about. */
            primaryMedicineName: string;
            /** @description LLM check only */
            recommendation?: string;
            /** @description Related label (e.g. allergen). */
            relatedLabel?: string;
            /** @description Second medicine involved. */
            secondaryMedicineName?: string;
            /**
             * @description Finding severity.
             * @enum {string}
             */
            severity: "high" | "medium" | "info";
            /**
             * @description Finding kind.
             * @enum {string}
             */
            type: "interaction" | "duplicateIngredient" | "allergy" | "foodInteraction" | "longTermUse" | "schedulingConflict" | "specialGroup";
        };
        MedicineRiskCheckRecordResponseResultRedFlags: {
            /** @description Medicine the flag is about. */
            primaryMedicineName: string;
            /** @description Related label. */
            relatedLabel?: string;
            /**
             * @description Red flag rule.
             * @enum {string}
             */
            rule: "severeAllergy" | "informationGap";
        };
        MedicineRiskCheckRecordsResponse: {
            llm: components["schemas"]["MedicineRiskCheckRecordsResponseLlm"];
            static: components["schemas"]["MedicineRiskCheckRecordsResponseStatic"];
        };
        /** @description Latest LLM check record, null if never checked */
        MedicineRiskCheckRecordsResponseLlm: {
            /**
             * @description Type of risk check.
             * @example static
             * @enum {string}
             */
            checkType: "static" | "llm";
            /**
             * Format: date-time
             * @description Created at (ISO 8601).
             */
            createdAt: string;
            result: components["schemas"]["MedicineRiskCheckRecordsResponseLlmResult"];
            /**
             * @description Persisted risk level.
             * @enum {string}
             */
            riskLevel: "safe" | "caution" | "risk" | "danger";
            /**
             * @description Persisted risk score (0-100).
             * @example 42
             */
            riskScore: number;
            /** @description Whether the record is stale. */
            stale: boolean;
            /**
             * Format: date-time
             * @description Updated at (ISO 8601).
             */
            updatedAt: string;
        } | null;
        /** @description Check result. */
        MedicineRiskCheckRecordsResponseLlmResult: {
            /** @description Count actually checked. */
            checkedMedicineCount: number;
            /** @description Medicines skipped due to missing detail. */
            coverageIssues: components["schemas"]["MedicineRiskCheckRecordsResponseLlmResultCoverageIssues"][];
            /** @description Current medicine count. */
            currentMedicineCount: number;
            /** @description Detected risk findings. */
            findings: components["schemas"]["MedicineRiskCheckRecordsResponseLlmResultFindings"][];
            /** @description LLM check only */
            overallRecommendation?: string;
            /**
             * @description Overall risk level.
             * @enum {string}
             */
            overallRiskLevel: "safe" | "caution" | "risk" | "danger";
            /** @description Overall risk score (0-100). */
            overallRiskScore: number;
            /** @description Raised red flags. */
            redFlags: components["schemas"]["MedicineRiskCheckRecordsResponseLlmResultRedFlags"][];
        };
        MedicineRiskCheckRecordsResponseLlmResultCoverageIssues: {
            /** @description Medicine name without source detail. */
            medicineName: string;
            /**
             * @description Why the medicine detail was not checked.
             * @enum {string}
             */
            reason: "manualEntry" | "missingSourceRef" | "detailUnavailable";
        };
        MedicineRiskCheckRecordsResponseLlmResultFindings: {
            /**
             * @description Finding context.
             * @enum {string}
             */
            context: "none" | "alcohol" | "caffeine";
            /** @description Supporting evidence. */
            evidence?: string;
            /** @description Medicine the finding is about. */
            primaryMedicineName: string;
            /** @description LLM check only */
            recommendation?: string;
            /** @description Related label (e.g. allergen). */
            relatedLabel?: string;
            /** @description Second medicine involved. */
            secondaryMedicineName?: string;
            /**
             * @description Finding severity.
             * @enum {string}
             */
            severity: "high" | "medium" | "info";
            /**
             * @description Finding kind.
             * @enum {string}
             */
            type: "interaction" | "duplicateIngredient" | "allergy" | "foodInteraction" | "longTermUse" | "schedulingConflict" | "specialGroup";
        };
        MedicineRiskCheckRecordsResponseLlmResultRedFlags: {
            /** @description Medicine the flag is about. */
            primaryMedicineName: string;
            /** @description Related label. */
            relatedLabel?: string;
            /**
             * @description Red flag rule.
             * @enum {string}
             */
            rule: "severeAllergy" | "informationGap";
        };
        /** @description Latest static check record, null if never checked */
        MedicineRiskCheckRecordsResponseStatic: {
            /**
             * @description Type of risk check.
             * @example static
             * @enum {string}
             */
            checkType: "static" | "llm";
            /**
             * Format: date-time
             * @description Created at (ISO 8601).
             */
            createdAt: string;
            result: components["schemas"]["MedicineRiskCheckRecordsResponseStaticResult"];
            /**
             * @description Persisted risk level.
             * @enum {string}
             */
            riskLevel: "safe" | "caution" | "risk" | "danger";
            /**
             * @description Persisted risk score (0-100).
             * @example 42
             */
            riskScore: number;
            /** @description Whether the record is stale. */
            stale: boolean;
            /**
             * Format: date-time
             * @description Updated at (ISO 8601).
             */
            updatedAt: string;
        } | null;
        /** @description Check result. */
        MedicineRiskCheckRecordsResponseStaticResult: {
            /** @description Count actually checked. */
            checkedMedicineCount: number;
            /** @description Medicines skipped due to missing detail. */
            coverageIssues: components["schemas"]["MedicineRiskCheckRecordsResponseStaticResultCoverageIssues"][];
            /** @description Current medicine count. */
            currentMedicineCount: number;
            /** @description Detected risk findings. */
            findings: components["schemas"]["MedicineRiskCheckRecordsResponseStaticResultFindings"][];
            /** @description LLM check only */
            overallRecommendation?: string;
            /**
             * @description Overall risk level.
             * @enum {string}
             */
            overallRiskLevel: "safe" | "caution" | "risk" | "danger";
            /** @description Overall risk score (0-100). */
            overallRiskScore: number;
            /** @description Raised red flags. */
            redFlags: components["schemas"]["MedicineRiskCheckRecordsResponseStaticResultRedFlags"][];
        };
        MedicineRiskCheckRecordsResponseStaticResultCoverageIssues: {
            /** @description Medicine name without source detail. */
            medicineName: string;
            /**
             * @description Why the medicine detail was not checked.
             * @enum {string}
             */
            reason: "manualEntry" | "missingSourceRef" | "detailUnavailable";
        };
        MedicineRiskCheckRecordsResponseStaticResultFindings: {
            /**
             * @description Finding context.
             * @enum {string}
             */
            context: "none" | "alcohol" | "caffeine";
            /** @description Supporting evidence. */
            evidence?: string;
            /** @description Medicine the finding is about. */
            primaryMedicineName: string;
            /** @description LLM check only */
            recommendation?: string;
            /** @description Related label (e.g. allergen). */
            relatedLabel?: string;
            /** @description Second medicine involved. */
            secondaryMedicineName?: string;
            /**
             * @description Finding severity.
             * @enum {string}
             */
            severity: "high" | "medium" | "info";
            /**
             * @description Finding kind.
             * @enum {string}
             */
            type: "interaction" | "duplicateIngredient" | "allergy" | "foodInteraction" | "longTermUse" | "schedulingConflict" | "specialGroup";
        };
        MedicineRiskCheckRecordsResponseStaticResultRedFlags: {
            /** @description Medicine the flag is about. */
            primaryMedicineName: string;
            /** @description Related label. */
            relatedLabel?: string;
            /**
             * @description Red flag rule.
             * @enum {string}
             */
            rule: "severeAllergy" | "informationGap";
        };
        MedicineSafetyTipItem: {
            /** @description Tip category. */
            category: string;
            /**
             * @description Safety tip id.
             * @example tip-alcohol
             */
            id: string;
            /** @description Localized safety tip text. */
            text: string;
        };
        /** @description Random medication safety tips. */
        MedicineSafetyTipResponse: components["schemas"]["MedicineSafetyTipItem"][];
        MedicineSearchResponse: {
            /** @description Matched medicine items. */
            items: components["schemas"]["MedicineSearchResponseItems"][];
            pagination: components["schemas"]["MedicineSearchResponsePagination"];
        };
        MedicineSearchResponseItems: {
            /** @description Stable medicine id. */
            id: string;
            /** @description Optional image URL. */
            imageUrl: string | null;
            /** @description Which fields matched the current query. */
            matchedBy: string[];
            /** @description Display name. */
            name: string;
            /**
             * @description Knowledge source.
             * @enum {string}
             */
            source: "drugbank" | "cn";
            /** @description Short supporting subtitle. */
            subtitle: string | null;
            /** @description Short preview summary. */
            summary: string | null;
            /** @description Compact tags for search cards. */
            tags: string[];
        };
        /** @description Pagination metadata. */
        MedicineSearchResponsePagination: {
            /** @description Page number, 1-based. */
            page: number;
            /** @description Page size. */
            pageSize: number;
            /** @description Total result count. */
            total: number;
            /** @description Total page count. */
            totalPages: number;
        };
        MedicineSequenceResponse: {
            /** @description Sequences of the drug itself (biologics have one per chain). */
            drug: components["schemas"]["MedicineSequenceResponseDrug"][];
            /** @description Medicine id in the selected source. */
            id: string;
            /**
             * @description Knowledge source.
             * @enum {string}
             */
            source: "drugbank" | "cn";
            /** @description Sequences of the drug targets, protein and coding gene. */
            targets: components["schemas"]["MedicineSequenceResponseTargets"][];
        };
        MedicineSequenceResponseDrug: {
            /** @description Chain description exactly as the source header spells it, e.g. "heavy chain". */
            description: string;
            /** @description Residue count. */
            length: number;
            /** @description Amino-acid sequence. */
            sequence: string;
        };
        MedicineSequenceResponseTargets: {
            /** @description Which sequence this is: protein_fasta or gene_fasta. */
            dataset: string;
            /** @description Residue (protein) or base (gene) count. */
            length: number;
            /** @description Sequence content. */
            sequence: string;
            /** @description Target display name. */
            targetName: string | null;
            /** @description UniProt identifier of the target. */
            uniprotId: string;
        };
        NotificationDetailResponse: {
            /** @description Action route target for the frontend. */
            action: string | null;
            /** @description Extra payload for the action. */
            actionPayload: unknown;
            /** @description Notification content body. */
            content: string;
            /** @description ISO-8601 timestamp when the notification was created. */
            createdAt: string;
            /** @description Unique notification identifier. */
            id: string;
            /** @description Whether the notification has been read. */
            isRead: boolean;
            /** @description ISO-8601 timestamp when the notification was read. */
            readAt: string | null;
            /** @description Notification title. */
            title: string;
            /** @enum {string} */
            type: "ai_today_summary" | "ai_weekly_insight" | "ai_proactive_suggestion" | "medicine_missed_dose" | "password_changed" | "report_generated" | "medicine_reminder" | "system_announcement" | "oauth_login" | "identity_linked";
        };
        NotificationListResponse: {
            items: components["schemas"]["NotificationListResponseItems"][];
            /** @description Total count of notifications for the user. */
            total: number;
        };
        NotificationListResponseItems: {
            /** @description Action route target for the frontend. */
            action: string | null;
            /** @description Extra payload for the action. */
            actionPayload: unknown;
            /** @description Notification content body. */
            content: string;
            /** @description ISO-8601 timestamp when the notification was created. */
            createdAt: string;
            /** @description Unique notification identifier. */
            id: string;
            /** @description Whether the notification has been read. */
            isRead: boolean;
            /** @description Notification title. */
            title: string;
            /** @enum {string} */
            type: "ai_today_summary" | "ai_weekly_insight" | "ai_proactive_suggestion" | "medicine_missed_dose" | "password_changed" | "report_generated" | "medicine_reminder" | "system_announcement" | "oauth_login" | "identity_linked";
        };
        NotificationPreferencesResponse: {
            /** @description Whether the user has a persisted preference row. */
            configured: boolean;
            healthAlertsEnabled: boolean;
            sleepBedtimeMinutes: number | null;
            sleepReminderEnabled: boolean;
            sleepWakeTimeMinutes: number | null;
            updatedAt: string | null;
            waterRemindersEnabled: boolean;
            weeklyInsightEnabled: boolean;
        };
        OAuthAuthorizeResponse: {
            /**
             * @description 第三方授权地址
             * @example https://open.weixin.qq.com/connect/qrconnect?appid=wx1234567890abcdef&redirect_uri=https%3A%2F%2Flumos.app%2Fauth%2Fcallback&response_type=code&scope=snsapi_login&state=xyz
             */
            authorizeUrl: string;
            /** @description 客户端回跳地址。桌面端 loopback 或可信 Web 回调登录时返回。 */
            callbackUri?: string;
            /**
             * @description state 过期时间（秒）
             * @example 600
             */
            expiresIn: number;
            /**
             * @description 本次授权 state
             * @example st_5f2c9a1b7e4d4f8e9a0b
             */
            state: string;
        };
        PatchRequest: {
            /** @description Enable health-rule notifications. */
            healthAlertsEnabled?: boolean;
            /** @description Bedtime as minutes after local midnight. */
            sleepBedtimeMinutes?: number | null;
            /** @description Enable local bedtime sleep reminders. */
            sleepReminderEnabled?: boolean;
            /** @description Wake time as minutes after local midnight. */
            sleepWakeTimeMinutes?: number | null;
            /** @description Enable water shortfall notifications. */
            waterRemindersEnabled?: boolean;
            /** @description Enable weekly longitudinal insights. */
            weeklyInsightEnabled?: boolean;
        };
        /** @default {} */
        PreviewClinicSummaryRequest: {
            /** @description Date-range scope start (ISO 8601 date, YYYY-MM-DD). Both dates are required whenever a date range is given (a partial pair is rejected); ignored when eventId is present. When neither eventId nor a date range is supplied, the summary falls back to the default last_30_days range (legacy semantics). */
            dateFrom?: string;
            /** @description Date-range scope end (ISO 8601 date, YYYY-MM-DD). Inclusive calendar day; both dates required whenever a date range is given; span must cover at most 30 inclusive calendar days. When neither eventId nor a date range is supplied, the summary falls back to the default last_30_days range (legacy semantics). */
            dateTo?: string;
            /** @description Event scope: build the summary from this event review. Wins over dateFrom/dateTo when both are supplied. */
            eventId?: string;
            /** @description Summary sections to include. Empty arrays and unknown values are rejected; when omitted every section is included. */
            selectedFields?: ("event_overview" | "symptom_changes" | "medication_slots" | "water" | "sleep" | "notes")[];
        };
        ProblemDetailsDto: {
            /**
             * @description Stable machine-readable business code.
             * @example RESOURCE_NOT_FOUND
             */
            code: string;
            /**
             * @description Localized, actionable description for this request.
             * @example The requested resource could not be found.
             */
            detail: string;
            /** @description Safe structured validation errors keyed by field or general. */
            errors?: {
                [key: string]: unknown;
            };
            /**
             * @description Whether retrying may succeed, subject to client policy.
             * @example false
             */
            retryable?: boolean;
            /**
             * @description Minimum delay before retrying, in seconds.
             * @example 60
             */
            retryAfter?: number;
            /**
             * @description Localized short summary of the problem.
             * @example Resource not found
             */
            title: string;
            /**
             * @description Trace correlation identifier; never a business key.
             * @example 4bf92f3577b34da6a3ce929d0e0e4736
             */
            traceId?: string;
            /**
             * @description Stable URI identifying the problem type.
             * @example https://api.lumos.example/problems/resource-not-found
             */
            type: string;
        };
        RecognizeRequest: {
            /**
             * Format: uri
             * @description Public URL of the medicine box image
             * @example https://cdn.lumos.example/medicines/amoxicillin-box.jpg
             */
            imageUrl: string;
        };
        RecordBatchRequest: {
            /** @description 1..50 events per request. */
            events: components["schemas"]["RecordBatchRequestEvents"][];
        };
        RecordBatchRequestEvents: {
            /** @description Client app version, e.g. 1.2.0. */
            appVersion: string;
            /** @description Client-generated id enabling retry idempotency — unique per user, so retried batches never double-insert. */
            clientEventId: string;
            /**
             * @description Lifecycle status — only health_event_started (active) / health_event_ended (ended) report it; other events omit it.
             * @enum {string}
             */
            eventStatus?: "active" | "ended";
            /**
             * @description Fixed product event name — enums only, no free text.
             * @enum {string}
             */
            name: "health_event_started" | "health_event_ended" | "health_event_outcome_confirmed" | "suggestion_impression" | "suggestion_actioned" | "review_opened" | "visit_summary_previewed" | "visit_summary_exported" | "visit_summary_share_created" | "visit_summary_share_opened" | "visit_summary_share_revoked";
            /** @description Event time (ISO 8601). Retention scans this field (90 days). */
            occurredAt: string;
            /**
             * @description Client platform.
             * @enum {string}
             */
            platform: "ios" | "android" | "web" | "windows" | "macos" | "linux" | "watchos" | "other";
            /**
             * @description Health-event lifecycle events report the outcome semantics (improved/unchanged/worsened), all other events report success/failure.
             * @enum {string}
             */
            result: "success" | "failure" | "improved" | "unchanged" | "worsened";
            /** @description Known server-side suggestion rule code (allowlisted, no free strings); unknown codes are rejected with 400. */
            suggestionRuleCode?: string;
            /**
             * @description In-app surface where the event occurred; 'system' marks server-initiated events.
             * @enum {string}
             */
            surface: "today" | "record" | "review" | "more" | "notification" | "system";
        };
        RecordReceiptRequest: {
            /** @description Linked medicine reminder id. */
            reminderId: string;
            /** @description Local scheduled date in YYYY-MM-DD format. */
            scheduledDate: string;
            /** @description Local scheduled time in HH:mm format (24h). */
            scheduledTime: string;
        };
        RefreshResponse: {
            /**
             * @description 访问令牌
             * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMSJ9
             */
            accessToken: string;
            /**
             * @description 访问令牌过期时间（秒）
             * @example 900
             */
            expiresIn: number;
            /**
             * @description 刷新令牌
             * @example rt_9f8c7b6a5d4e3f2a1b0c9d8e7f6a5b4c
             */
            refreshToken: string;
        };
        RefreshSessionRequest: {
            /** @description 刷新令牌 */
            refreshToken: string;
        };
        RefreshTodayAnalysisRequest: {
            /** @description Target date in YYYY-MM-DD format. Defaults to backend current day when omitted. */
            date?: string;
        };
        RegisterRequest: {
            /** @description 人机验证令牌 */
            captchaToken?: string;
            /** @description 邮箱验证码 */
            code: string;
            /** @description 邮箱地址 */
            email: string;
            /** @description 昵称 */
            nickname?: string;
            /** @description 密码（至少8位，需通过强度校验） */
            password: string;
        };
        RegisterResponse: {
            tokens: components["schemas"]["RegisterResponseTokens"];
            user: components["schemas"]["RegisterResponseUser"];
        };
        RegisterResponseTokens: {
            /**
             * @description 访问令牌
             * @example eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfMSJ9
             */
            accessToken: string;
            /**
             * @description 访问令牌过期时间（秒）
             * @example 900
             */
            expiresIn: number;
            /**
             * @description 刷新令牌
             * @example rt_9f8c7b6a5d4e3f2a1b0c9d8e7f6a5b4c
             */
            refreshToken: string;
        };
        RegisterResponseUser: {
            /** @description 创建时间 (ISO 8601) */
            createdAt: string;
            /** @description 邮箱地址，第三方账号可能为空 */
            email: string | null;
            /** @description 邮箱是否已验证 */
            emailVerified: boolean;
            /** @description 邮箱验证时间 (ISO 8601) */
            emailVerifiedAt: string | null;
            /** @description 用户 ID */
            id: string;
            /** @description 昵称 */
            nickname: string | null;
        };
        RegisterWithCookieRequest: {
            /** @description 人机验证令牌 */
            captchaToken?: string;
            /** @description 邮箱验证码 */
            code: string;
            /** @description 邮箱地址 */
            email: string;
            /** @description 昵称 */
            nickname?: string;
            /** @description 密码（至少8位，需通过强度校验） */
            password: string;
        };
        ReminderDeliveryListResponse: {
            /** @description Delivery audit rows. */
            items: components["schemas"]["ReminderDeliveryListResponseItems"][];
        };
        ReminderDeliveryListResponseItems: {
            /** @description Delivery channel. */
            channel: string;
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Actual delivery time (ISO 8601). */
            deliveredAt: string | null;
            /** @description Target device id. */
            deviceId: string | null;
            /** @description Failure reason, if any. */
            errorMessage: string | null;
            /** @description Delivery log id. */
            id: string;
            /** @description Linked medicine reminder id. */
            reminderId: string | null;
            /** @description Scheduled delivery time (ISO 8601). */
            scheduledFor: string;
            /** @description Delivery status. */
            status: string;
        };
        ReminderDeliveryReceiptResponse: {
            item: components["schemas"]["ReminderDeliveryReceiptResponseItem"];
        };
        /** @description The recorded delivery row. */
        ReminderDeliveryReceiptResponseItem: {
            /** @description Delivery channel. */
            channel: string;
            /** @description Created at (ISO 8601). */
            createdAt: string;
            /** @description Actual delivery time (ISO 8601). */
            deliveredAt: string | null;
            /** @description Target device id. */
            deviceId: string | null;
            /** @description Failure reason, if any. */
            errorMessage: string | null;
            /** @description Delivery log id. */
            id: string;
            /** @description Linked medicine reminder id. */
            reminderId: string | null;
            /** @description Scheduled delivery time (ISO 8601). */
            scheduledFor: string;
            /** @description Delivery status. */
            status: string;
        };
        RenameConversationRequest: {
            /**
             * @description New conversation title (1-48 chars). Empty or whitespace-only titles are rejected; clients keep empty names local-only.
             * @example 用药咨询
             */
            title: string;
        };
        ReportDashboardResponse: {
            aiSummaryEnabled: boolean;
            endDate: string;
            findings: components["schemas"]["ReportDashboardResponseFindings"][];
            generatedAt: string;
            metrics: components["schemas"]["ReportDashboardResponseMetrics"][];
            patterns: components["schemas"]["ReportDashboardResponsePatterns"][];
            /** @enum {string} */
            range: "last_7_days" | "last_30_days" | "custom";
            startDate: string;
            trends: components["schemas"]["ReportDashboardResponseTrends"][];
        };
        ReportDashboardResponseFindings: {
            body: string;
            /** @enum {string} */
            kind: "medication" | "hydration" | "sleep" | "general";
            title: string;
        };
        ReportDashboardResponseMetrics: {
            delta: string;
            /** @enum {string} */
            direction: "up" | "down" | "flat";
            /** @enum {string} */
            kind: "medication" | "water" | "sleep";
            observedMetric?: components["schemas"]["ReportDashboardResponseMetricsObservedMetric"];
            sparkline: number[];
            /** @enum {string} */
            status: "good" | "stable" | "needs_attention" | "insufficient_data";
            unit: string;
            value: string;
        };
        ReportDashboardResponseMetricsObservedMetric: {
            /** @enum {string} */
            coverage: "sufficient" | "partial" | "none";
            expectedCount: number | null;
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /**
             * @description Whether at least one observation exists. See coverage for the proportion of observed vs expected days.
             * @enum {string}
             */
            state: "observed" | "unknown";
            value: number | null;
            windowEnd: string;
            windowStart: string;
        };
        ReportDashboardResponsePatterns: {
            body: string;
            /** @enum {string} */
            kind: "medication" | "hydration" | "sleep" | "general";
            sparkline: number[];
            /** @enum {string} */
            status: "good" | "stable" | "needs_attention" | "insufficient_data";
            title: string;
        };
        ReportDashboardResponseTrends: {
            currentValue: string;
            /** @enum {string} */
            kind: "medication" | "water" | "sleep";
            observedMetric?: components["schemas"]["ReportDashboardResponseTrendsObservedMetric"];
            unit: string;
            /** @description Observed values only — unknown days are omitted, not zero-filled. BREAKING (since 2026-08-29): values.length no longer matches the date window length; use observedMetric.observedCount/expectedCount to align dates. */
            values: number[];
        };
        ReportDashboardResponseTrendsObservedMetric: {
            /** @enum {string} */
            coverage: "sufficient" | "partial" | "none";
            expectedCount: number | null;
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /**
             * @description Whether at least one observation exists. See coverage for the proportion of observed vs expected days.
             * @enum {string}
             */
            state: "observed" | "unknown";
            value: number | null;
            windowEnd: string;
            windowStart: string;
        };
        ReportLocalCapabilityRequest: {
            /**
             * @description Local scheduling capability state.
             * @enum {string}
             */
            state: "active" | "unavailable" | "disabled";
        };
        ReportSummaryAsyncResponseData: {
            /** @description Queued report summary job identifier. */
            jobId?: string;
            result?: components["schemas"]["ReportSummaryAsyncResponseDataResult"];
        };
        /** @description Inline report summary resource when queue processing is unavailable. */
        ReportSummaryAsyncResponseDataResult: {
            coverage: components["schemas"]["ReportSummaryAsyncResponseDataResultCoverage"];
            disclaimer: string;
            endDate: string;
            generatedAt: string;
            lowRiskAction: components["schemas"]["ReportSummaryAsyncResponseDataResultLowRiskAction"];
            observedPattern: components["schemas"]["ReportSummaryAsyncResponseDataResultObservedPattern"];
            /** @enum {string} */
            range: "last_7_days" | "last_30_days" | "custom";
            startDate: string;
            summary: string;
        };
        ReportSummaryAsyncResponseDataResultCoverage: {
            medication: components["schemas"]["ReportSummaryAsyncResponseDataResultCoverageMedication"];
            sleep: components["schemas"]["ReportSummaryAsyncResponseDataResultCoverageSleep"];
            water: components["schemas"]["ReportSummaryAsyncResponseDataResultCoverageWater"];
        };
        ReportSummaryAsyncResponseDataResultCoverageMedication: {
            totalDays: number;
            trackedDays: number;
        };
        ReportSummaryAsyncResponseDataResultCoverageSleep: {
            totalDays: number;
            trackedDays: number;
        };
        ReportSummaryAsyncResponseDataResultCoverageWater: {
            totalDays: number;
            trackedDays: number;
        };
        /** @description At most one low-risk action. Null when no action is warranted. */
        ReportSummaryAsyncResponseDataResultLowRiskAction: {
            label: string;
            text: string;
        } | null;
        /** @description At most one source-backed observed pattern. Null when data is insufficient. */
        ReportSummaryAsyncResponseDataResultObservedPattern: {
            /** @enum {string} */
            kind: "medication" | "hydration" | "sleep";
            source: string;
            text: string;
        } | null;
        ReportSummaryResponse: {
            coverage: components["schemas"]["ReportSummaryResponseCoverage"];
            disclaimer: string;
            endDate: string;
            generatedAt: string;
            lowRiskAction: components["schemas"]["ReportSummaryResponseLowRiskAction"];
            observedPattern: components["schemas"]["ReportSummaryResponseObservedPattern"];
            /** @enum {string} */
            range: "last_7_days" | "last_30_days" | "custom";
            startDate: string;
            summary: string;
        };
        ReportSummaryResponseCoverage: {
            medication: components["schemas"]["ReportSummaryResponseCoverageMedication"];
            sleep: components["schemas"]["ReportSummaryResponseCoverageSleep"];
            water: components["schemas"]["ReportSummaryResponseCoverageWater"];
        };
        ReportSummaryResponseCoverageMedication: {
            totalDays: number;
            trackedDays: number;
        };
        ReportSummaryResponseCoverageSleep: {
            totalDays: number;
            trackedDays: number;
        };
        ReportSummaryResponseCoverageWater: {
            totalDays: number;
            trackedDays: number;
        };
        /** @description At most one low-risk action. Null when no action is warranted. */
        ReportSummaryResponseLowRiskAction: {
            label: string;
            text: string;
        } | null;
        /** @description At most one source-backed observed pattern. Null when data is insufficient. */
        ReportSummaryResponseObservedPattern: {
            /** @enum {string} */
            kind: "medication" | "hydration" | "sleep";
            source: string;
            text: string;
        } | null;
        ReportSummaryStreamResponse: {
            coverage: components["schemas"]["ReportSummaryStreamResponseCoverage"];
            disclaimer: string;
            endDate: string;
            generatedAt: string;
            lowRiskAction: components["schemas"]["ReportSummaryStreamResponseLowRiskAction"];
            observedPattern: components["schemas"]["ReportSummaryStreamResponseObservedPattern"];
            /** @enum {string} */
            range: "last_7_days" | "last_30_days" | "custom";
            startDate: string;
            summary: string;
        };
        ReportSummaryStreamResponseCoverage: {
            medication: components["schemas"]["ReportSummaryStreamResponseCoverageMedication"];
            sleep: components["schemas"]["ReportSummaryStreamResponseCoverageSleep"];
            water: components["schemas"]["ReportSummaryStreamResponseCoverageWater"];
        };
        ReportSummaryStreamResponseCoverageMedication: {
            totalDays: number;
            trackedDays: number;
        };
        ReportSummaryStreamResponseCoverageSleep: {
            totalDays: number;
            trackedDays: number;
        };
        ReportSummaryStreamResponseCoverageWater: {
            totalDays: number;
            trackedDays: number;
        };
        /** @description At most one low-risk action. Null when no action is warranted. */
        ReportSummaryStreamResponseLowRiskAction: {
            label: string;
            text: string;
        } | null;
        /** @description At most one source-backed observed pattern. Null when data is insufficient. */
        ReportSummaryStreamResponseObservedPattern: {
            /** @enum {string} */
            kind: "medication" | "hydration" | "sleep";
            source: string;
            text: string;
        } | null;
        ResetPasswordRequest: {
            /** @description 邮箱验证码（6 位） */
            code: string;
            /** @description 邮箱地址 */
            email: string;
            /** @description 新密码（8-32位，需包含大小写字母和数字） */
            password: string;
        };
        ResetPasswordResponse: {
            /**
             * @description 冷却时间（秒）
             * @example 60
             */
            cooldown: number;
            /**
             * @description 提示消息
             * @example 验证码已发送，请注意查收
             */
            message: string;
        };
        RunRiskCheckRequest: {
            /**
             * @example {
             *       "source": "drugbank",
             *       "id": "DB01050"
             *     }
             */
            candidate?: components["schemas"]["RunRiskCheckRequestCandidate"];
            /**
             * @description Type of risk check to run
             * @example static
             * @enum {string}
             */
            type: "static" | "llm";
        };
        /**
         * @description 加药前预检的可信药品库候选；仅 type=static 时允许；预检不落库
         * @example {
         *       "source": "drugbank",
         *       "id": "DB01050"
         *     }
         */
        RunRiskCheckRequestCandidate: {
            /**
             * @description 候选药品在可信药品库中的 id
             * @example DB01050
             */
            id: string;
            /**
             * @description 候选药品所在的可信药品库来源
             * @example drugbank
             * @enum {string}
             */
            source: "cn" | "drugbank";
        };
        SendVerificationCodeRequest: {
            /** @description 邮箱地址 */
            email: string;
            /** @enum {string} */
            scene: "register" | "login" | "change-email" | "set-password" | "delete-account" | "forgot-password";
        };
        SendVerificationCodeResponse: {
            /**
             * @description 冷却时间（秒）
             * @example 60
             */
            cooldown: number;
            /**
             * @description 提示消息
             * @example 验证码已发送，请注意查收
             */
            message: string;
        };
        /** @description The active sessions of the current user. */
        SessionListItem: components["schemas"]["SessionListItemEntry"][];
        SessionListItemEntry: {
            /** @description Created at (ISO-8601) */
            createdAt: string;
            /** @description Device name */
            deviceName: string | null;
            /** @description Device type */
            deviceType: string | null;
            /** @description Expires at (ISO-8601) */
            expiresAt: string;
            /** @description Session id */
            id: string;
            /** @description Whether this is the current session */
            isCurrent: boolean;
            /** @description Last used at (ISO-8601) */
            lastUsedAt: string | null;
            /** @description Platform */
            platform: string | null;
        };
        SessionResponse: {
            /**
             * @description 访问令牌过期时间（秒）
             * @example 900
             */
            expiresIn: number;
            user: components["schemas"]["SessionResponseUser"];
        };
        SessionResponseUser: {
            /** @description 头像 URL */
            avatar: string | null;
            /** @description 创建时间 (ISO 8601) */
            createdAt: string;
            /** @description 邮箱地址。OAuth-only 账号在补填邮箱前为 null */
            email: string | null;
            /** @description 邮箱是否已验证 */
            emailVerified: boolean;
            /** @description 邮箱验证时间 (ISO 8601) */
            emailVerifiedAt: string | null;
            /** @description 用户 ID */
            id: string;
            /** @description 昵称 */
            nickname: string | null;
            /** @description 更新时间 (ISO 8601) */
            updatedAt: string;
        };
        SetAdminRoleRequest: {
            /** @enum {string} */
            role: "SUPER_ADMIN" | "ADMIN" | "EDITOR" | "VIEWER";
        };
        SetPasswordRequest: {
            /** @description 发往邮箱的验证码 */
            code: string;
            /** @description 新密码（8-32位，需包含大小写字母和数字） */
            password: string;
        };
        /** @default {} */
        ShareClinicSummaryRequest: {
            /** @description Date-range scope start (ISO 8601 date, YYYY-MM-DD). Both dates are required whenever a date range is given (a partial pair is rejected); ignored when eventId is present. When neither eventId nor a date range is supplied, the summary falls back to the default last_30_days range (legacy semantics). */
            dateFrom?: string;
            /** @description Date-range scope end (ISO 8601 date, YYYY-MM-DD). Inclusive calendar day; both dates required whenever a date range is given; span must cover at most 30 inclusive calendar days. When neither eventId nor a date range is supplied, the summary falls back to the default last_30_days range (legacy semantics). */
            dateTo?: string;
            /** @description Event scope: build the summary from this event review. Wins over dateFrom/dateTo when both are supplied. */
            eventId?: string;
            /** @description Summary sections to include. Empty arrays and unknown values are rejected; when omitted every section is included. */
            selectedFields?: ("event_overview" | "symptom_changes" | "medication_slots" | "water" | "sleep" | "notes")[];
        };
        SseProblemDetailsDto: {
            /**
             * @description Stable machine-readable business code.
             * @example RESOURCE_NOT_FOUND
             */
            code: string;
            /**
             * @description Localized, actionable description for this request.
             * @example The requested resource could not be found.
             */
            detail: string;
            /** @description Safe structured validation errors keyed by field or general. */
            errors?: {
                [key: string]: unknown;
            };
            /**
             * @description Whether retrying may succeed, subject to client policy.
             * @example false
             */
            retryable?: boolean;
            /**
             * @description Minimum delay before retrying, in seconds.
             * @example 60
             */
            retryAfter?: number;
            /**
             * @description Why the stream ended; this is not an HTTP status code.
             * @enum {string}
             */
            status: "client_error" | "server_error" | "cancelled" | "server_shutdown" | "unknown";
            /**
             * @description Localized short summary of the problem.
             * @example Resource not found
             */
            title: string;
            /**
             * @description Trace correlation identifier; never a business key.
             * @example 4bf92f3577b34da6a3ce929d0e0e4736
             */
            traceId?: string;
            /**
             * @description Stable URI identifying the problem type.
             * @example https://api.lumos.example/problems/resource-not-found
             */
            type: string;
        };
        StreamMessagesRequest: {
            /**
             * @description Optional persisted conversation id used as the LangGraph thread id. When absent the conversation runs statelessly (no checkpoint / no in-graph review).
             * @example conv_9f2c1e4a7b8d4c6e
             */
            conversationId?: string;
            /**
             * @description Conversation window ending with the latest user message to answer.
             * @example [
             *       {
             *         "role": "user",
             *         "content": "我最近头痛，布洛芬一次应该吃多少？"
             *       }
             *     ]
             */
            messages: components["schemas"]["StreamMessagesRequestMessages"][];
        };
        StreamMessagesRequestMessages: {
            /**
             * @description Plain or Markdown-ready message content.
             * @example 我最近头痛，布洛芬一次应该吃多少？
             */
            content: string;
            /**
             * @description Client-visible conversation role. system is not accepted.
             * @example user
             * @enum {string}
             */
            role: "user" | "assistant";
        };
        SubmitFeedbackRequest: {
            /**
             * @description User feedback for the suggestion
             * @enum {string}
             */
            feedback: "accepted" | "later" | "not_applicable" | "suppress";
        };
        SuggestionExplanationJobResponse: {
            /**
             * @description Queued explanation job identifier.
             * @example explanation-job-7d3a5b
             */
            jobId?: string;
            result?: components["schemas"]["SuggestionExplanationJobResponseResult"];
        };
        /** @description Inline explanation resource when queue processing is unavailable. */
        SuggestionExplanationJobResponseResult: {
            /** @description Whether the AI model was used to generate the explanation */
            aiGenerated: boolean;
            /** @description AI-enhanced or original boundary / disclaimer text */
            boundary: string;
            /** @description Locale used for the explanation (e.g. "zh-CN", "en") */
            locale?: string;
            /** @description AI-enhanced or original reason text */
            reason: string;
            /**
             * @description The suggestion ID that was explained
             * @example sug_9f2c1e4a
             */
            suggestionId: string;
        };
        SuggestionExplanationResponse: {
            /** @description Whether the AI model was used to generate the explanation */
            aiGenerated: boolean;
            /** @description AI-enhanced or original boundary / disclaimer text */
            boundary: string;
            /** @description Locale used for the explanation (e.g. "zh-CN", "en") */
            locale?: string;
            /** @description AI-enhanced or original reason text */
            reason: string;
            /**
             * @description The suggestion ID that was explained
             * @example sug_9f2c1e4a
             */
            suggestionId: string;
        };
        SuggestionFeedbackResponse: {
            /**
             * @description Effect applied by the feedback engine
             * @example boosted_type
             * @enum {string}
             */
            appliedEffect: "boosted_type" | "delayed_until" | "suppressed_type" | "noted";
            /** @description When the suppression expires (if applicable) */
            expiresAt?: string;
            /** @enum {string} */
            feedback: "accepted" | "later" | "not_applicable" | "suppress";
            suggestionId: string;
        };
        SuggestionHistoryResponse: {
            /** @description End date used for the query */
            endDate: string;
            /** @description Suggestion history items */
            items: components["schemas"]["SuggestionHistoryResponseItems"][];
            /** @description Start date used for the query */
            startDate: string;
            /**
             * @description Total count of matching items
             * @example 42
             */
            total: number;
        };
        SuggestionHistoryResponseItems: {
            /**
             * @description Confidence level
             * @enum {string}
             */
            confidence: "high" | "medium" | "low";
            /** @description Date (YYYY-MM-DD) */
            date: string;
            /** @description When the suggestion was expired */
            expiredAt?: string;
            /** @description User feedback, if any */
            feedback?: string;
            /** @description When feedback was recorded */
            feedbackAt?: string;
            /** @description When the suggestion was generated */
            generatedAt: string;
            /** @description Unique suggestion id */
            id: string;
            /**
             * @description Lifecycle state
             * @enum {string}
             */
            lifecycleState: "generated" | "active" | "fading" | "expired" | "dismissed";
            /** @description Why this suggestion appeared */
            reason: string;
            /** @description Rule identifier */
            ruleId: string;
            /** @description Rule version */
            ruleVersion: string;
            /** @description Sub-type */
            subtype?: string;
            /** @description Localized short title */
            title: string;
            /**
             * @description Trigger type
             * @enum {string}
             */
            triggerType: "event" | "timer";
            /**
             * @description Suggestion type
             * @enum {string}
             */
            type: "confirmed_risk" | "compliance" | "trend" | "behavior_advice" | "coverage";
        };
        SymptomCatalogResponse: {
            items: components["schemas"]["SymptomCatalogResponseItems"][];
        };
        SymptomCatalogResponseItems: {
            /**
             * @description Stable symptom code; the value stored in payload `symptom`.
             * @example headache
             */
            code: string;
            /** @description Localized display label. */
            label: string;
        };
        TodayAnalysisAsyncJobData: {
            jobId: string;
        };
        TodayAnalysisAsyncResultData: {
            result: {
                action: string;
                actionLabel: string;
                aiGenerated: boolean;
                bullets: components["schemas"]["TodayAnalysisAsyncResultDataBullets"][];
                confidenceNote: string;
                date: string;
                generatedAt: string;
                metrics?: components["schemas"]["TodayAnalysisAsyncResultDataMetrics"][];
                sourceVersion?: number;
                summary: string;
            } | {
                analysis: components["schemas"]["TodayAnalysisAsyncResultDataAnalysis"];
                computedAt: string | null;
                computedVersion: number;
                retryAfterSeconds: number | null;
                sourceVersion: number;
                /** @enum {string} */
                status: "empty" | "pending" | "ready" | "stale" | "failed";
            };
        };
        TodayAnalysisAsyncResultDataAnalysis: {
            action: string;
            actionLabel: string;
            aiGenerated: boolean;
            bullets: components["schemas"]["TodayAnalysisAsyncResultDataAnalysisBullets"][];
            confidenceNote: string;
            date: string;
            generatedAt: string;
            metrics?: components["schemas"]["TodayAnalysisAsyncResultDataAnalysisMetrics"][];
            sourceVersion?: number;
            summary: string;
        } | null;
        TodayAnalysisAsyncResultDataAnalysisBullets: {
            /** @enum {string} */
            kind: "medication" | "hydration" | "sleep" | "general";
            text: string;
        };
        TodayAnalysisAsyncResultDataAnalysisMetrics: {
            /** @enum {string} */
            kind: "medication" | "water" | "sleep";
            observedMetric: components["schemas"]["TodayAnalysisAsyncResultDataAnalysisMetricsObservedMetric"];
        };
        TodayAnalysisAsyncResultDataAnalysisMetricsObservedMetric: {
            /** @enum {string} */
            coverage: "sufficient" | "partial" | "none";
            expectedCount: number | null;
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            value: number | null;
            windowEnd: string;
            windowStart: string;
        };
        TodayAnalysisAsyncResultDataBullets: {
            /** @enum {string} */
            kind: "medication" | "hydration" | "sleep" | "general";
            text: string;
        };
        TodayAnalysisAsyncResultDataMetrics: {
            /** @enum {string} */
            kind: "medication" | "water" | "sleep";
            observedMetric: components["schemas"]["TodayAnalysisAsyncResultDataMetricsObservedMetric"];
        };
        TodayAnalysisAsyncResultDataMetricsObservedMetric: {
            /** @enum {string} */
            coverage: "sufficient" | "partial" | "none";
            expectedCount: number | null;
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            value: number | null;
            windowEnd: string;
            windowStart: string;
        };
        TodayAnalysisAsyncStatusData: {
            /**
             * @example pending
             * @enum {string}
             */
            status: "empty" | "pending" | "ready" | "stale" | "failed";
        };
        TodayAnalysisData: {
            action: string;
            actionLabel: string;
            aiGenerated: boolean;
            bullets: components["schemas"]["TodayAnalysisDataBullets"][];
            confidenceNote: string;
            date: string;
            generatedAt: string;
            metrics?: components["schemas"]["TodayAnalysisDataMetrics"][];
            sourceVersion?: number;
            summary: string;
        };
        TodayAnalysisDataBullets: {
            /** @enum {string} */
            kind: "medication" | "hydration" | "sleep" | "general";
            text: string;
        };
        TodayAnalysisDataMetrics: {
            /** @enum {string} */
            kind: "medication" | "water" | "sleep";
            observedMetric: components["schemas"]["TodayAnalysisDataMetricsObservedMetric"];
        };
        TodayAnalysisDataMetricsObservedMetric: {
            /** @enum {string} */
            coverage: "sufficient" | "partial" | "none";
            expectedCount: number | null;
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            value: number | null;
            windowEnd: string;
            windowStart: string;
        };
        TodayAnalysisReadData: {
            analysis: components["schemas"]["TodayAnalysisReadDataAnalysis"];
            computedAt: string | null;
            computedVersion: number;
            retryAfterSeconds: number | null;
            sourceVersion: number;
            /** @enum {string} */
            status: "empty" | "pending" | "ready" | "stale" | "failed";
        };
        TodayAnalysisReadDataAnalysis: {
            action: string;
            actionLabel: string;
            aiGenerated: boolean;
            bullets: components["schemas"]["TodayAnalysisReadDataAnalysisBullets"][];
            confidenceNote: string;
            date: string;
            generatedAt: string;
            metrics?: components["schemas"]["TodayAnalysisReadDataAnalysisMetrics"][];
            sourceVersion?: number;
            summary: string;
        } | null;
        TodayAnalysisReadDataAnalysisBullets: {
            /** @enum {string} */
            kind: "medication" | "hydration" | "sleep" | "general";
            text: string;
        };
        TodayAnalysisReadDataAnalysisMetrics: {
            /** @enum {string} */
            kind: "medication" | "water" | "sleep";
            observedMetric: components["schemas"]["TodayAnalysisReadDataAnalysisMetricsObservedMetric"];
        };
        TodayAnalysisReadDataAnalysisMetricsObservedMetric: {
            /** @enum {string} */
            coverage: "sufficient" | "partial" | "none";
            expectedCount: number | null;
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            value: number | null;
            windowEnd: string;
            windowStart: string;
        };
        TodayAnalysisReadResponse: {
            analysis: components["schemas"]["TodayAnalysisReadResponseAnalysis"];
            computedAt: string | null;
            computedVersion: number;
            retryAfterSeconds: number | null;
            sourceVersion: number;
            /** @enum {string} */
            status: "empty" | "pending" | "ready" | "stale" | "failed";
        };
        TodayAnalysisReadResponseAnalysis: {
            action: string;
            actionLabel: string;
            aiGenerated: boolean;
            bullets: components["schemas"]["TodayAnalysisReadResponseAnalysisBullets"][];
            confidenceNote: string;
            date: string;
            generatedAt: string;
            metrics?: components["schemas"]["TodayAnalysisReadResponseAnalysisMetrics"][];
            sourceVersion?: number;
            summary: string;
        } | null;
        TodayAnalysisReadResponseAnalysisBullets: {
            /** @enum {string} */
            kind: "medication" | "hydration" | "sleep" | "general";
            text: string;
        };
        TodayAnalysisReadResponseAnalysisMetrics: {
            /** @enum {string} */
            kind: "medication" | "water" | "sleep";
            observedMetric: components["schemas"]["TodayAnalysisReadResponseAnalysisMetricsObservedMetric"];
        };
        TodayAnalysisReadResponseAnalysisMetricsObservedMetric: {
            /** @enum {string} */
            coverage: "sufficient" | "partial" | "none";
            expectedCount: number | null;
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            value: number | null;
            windowEnd: string;
            windowStart: string;
        };
        TodayAnalysisRefreshPendingData: {
            jobId: string;
            /** @enum {string} */
            status: "pending";
        };
        TodayAnalysisRefreshReadyData: {
            analysis: components["schemas"]["TodayAnalysisRefreshReadyDataAnalysis"];
            /** @enum {string} */
            status: "ready";
        };
        TodayAnalysisRefreshReadyDataAnalysis: {
            action: string;
            actionLabel: string;
            aiGenerated: boolean;
            bullets: components["schemas"]["TodayAnalysisRefreshReadyDataAnalysisBullets"][];
            confidenceNote: string;
            date: string;
            generatedAt: string;
            metrics?: components["schemas"]["TodayAnalysisRefreshReadyDataAnalysisMetrics"][];
            sourceVersion?: number;
            summary: string;
        };
        TodayAnalysisRefreshReadyDataAnalysisBullets: {
            /** @enum {string} */
            kind: "medication" | "hydration" | "sleep" | "general";
            text: string;
        };
        TodayAnalysisRefreshReadyDataAnalysisMetrics: {
            /** @enum {string} */
            kind: "medication" | "water" | "sleep";
            observedMetric: components["schemas"]["TodayAnalysisRefreshReadyDataAnalysisMetricsObservedMetric"];
        };
        TodayAnalysisRefreshReadyDataAnalysisMetricsObservedMetric: {
            /** @enum {string} */
            coverage: "sufficient" | "partial" | "none";
            expectedCount: number | null;
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            value: number | null;
            windowEnd: string;
            windowStart: string;
        };
        TodayRecommendationItem: {
            /** @description Recommendation category */
            category?: string;
            /**
             * @description Unique recommendation id
             * @example onboarding-hydration
             */
            id: string;
            /** @description Recommendation text */
            text: string;
        };
        /**
         * @description Cold-start onboarding guide cards.
         * @example [
         *       {
         *         "id": "onboarding-hydration",
         *         "text": "Keep a water bottle nearby to stay hydrated through the day.",
         *         "category": "onboarding"
         *       }
         *     ]
         */
        TodayRecommendationResponse: components["schemas"]["TodayRecommendationItem"][];
        TodaySuggestionsResponse: {
            /** @description When the last successful materialization completed */
            computedAt: string | null;
            /** @description When true, one or more suggestion rules threw an error during evaluation — the returned list may be incomplete. */
            degraded?: boolean;
            /** @description When the suggestions were generated */
            generatedAt: string;
            /**
             * @description Current background materialization state
             * @enum {string}
             */
            materializationStatus: "empty" | "pending" | "ready" | "stale" | "failed";
            /** @description Low-confidence observations */
            observations?: components["schemas"]["TodaySuggestionsResponseObservations"][];
            primary?: components["schemas"]["TodaySuggestionsResponsePrimary"];
            /** @description Suggested client polling delay in seconds */
            retryAfterSeconds: number | null;
            /** @description Secondary suggestion cards (max 2) */
            secondary?: components["schemas"]["TodaySuggestionsResponseSecondary"][];
            /** @description Latest source version observed for this date */
            sourceVersion: number;
        };
        TodaySuggestionsResponseObservations: {
            /** @description Medical disclaimer / boundary text */
            boundary: string;
            /**
             * @description Visual tone hint
             * @enum {string}
             */
            cardTone: "urgent" | "warning" | "emphasis" | "soft" | "neutral";
            /**
             * @description Confidence level
             * @enum {string}
             */
            confidence: "high" | "medium" | "low";
            /** @description Evidence items */
            evidence: components["schemas"]["TodaySuggestionsResponseObservationsEvidence"][];
            /** @description Available feedback options for this card */
            feedbackOptions?: ("accepted" | "later" | "not_applicable" | "suppress")[];
            /** @description Icon identifier for the frontend */
            icon: string;
            /** @description Unique suggestion id */
            id: string;
            /**
             * @description Lifecycle state
             * @enum {string}
             */
            lifecycleState: "generated" | "active" | "fading" | "expired" | "dismissed";
            /** @description Whether this card can trigger a notification */
            notificationEligible?: boolean;
            observedMetric?: components["schemas"]["TodaySuggestionsResponseObservationsObservedMetric"];
            primaryAction: components["schemas"]["TodaySuggestionsResponseObservationsPrimaryAction"];
            /** @description Why this suggestion appeared */
            reason: string;
            /** @description Rule identifier for auditability */
            ruleId: string;
            /** @description Rule version */
            ruleVersion: string;
            /** @description Secondary actions */
            secondaryActions?: components["schemas"]["TodaySuggestionsResponseObservationsSecondaryActions"][];
            /** @description Sub-type for rendering variety */
            subtype?: string;
            /** @description Localized short title */
            title: string;
            /**
             * @description Trigger type
             * @enum {string}
             */
            triggerType: "event" | "timer";
            /**
             * @description Suggestion type
             * @enum {string}
             */
            type: "confirmed_risk" | "compliance" | "trend" | "behavior_advice" | "coverage";
        };
        TodaySuggestionsResponseObservationsEvidence: {
            kind: string;
            /** @description Human-readable label */
            label: string;
            /** @description Related medicine id for navigation */
            medicineId?: string;
            /** @description Related record id for navigation */
            recordId?: string;
            /** @description Human-readable value */
            value: string;
        };
        TodaySuggestionsResponseObservationsObservedMetric: {
            /** @enum {string} */
            coverage: "sufficient" | "partial" | "none";
            expectedCount: number | null;
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            value: number | null;
            windowEnd: string;
            windowStart: string;
        };
        /** @description Primary action */
        TodaySuggestionsResponseObservationsPrimaryAction: {
            /** @description Unique action id */
            actionId: string;
            /** @description Whether authentication is required */
            authRequired: boolean;
            /** @description Localized action label */
            label: string;
            /** @description Deep-link route for navigation */
            route: string;
        };
        TodaySuggestionsResponseObservationsSecondaryActions: {
            /** @description Unique action id */
            actionId: string;
            /** @description Whether authentication is required */
            authRequired: boolean;
            /** @description Localized action label */
            label: string;
            /** @description Deep-link route for navigation */
            route: string;
        };
        /** @description Primary suggestion card (highest priority) */
        TodaySuggestionsResponsePrimary: {
            /** @description Medical disclaimer / boundary text */
            boundary: string;
            /**
             * @description Visual tone hint
             * @enum {string}
             */
            cardTone: "urgent" | "warning" | "emphasis" | "soft" | "neutral";
            /**
             * @description Confidence level
             * @enum {string}
             */
            confidence: "high" | "medium" | "low";
            /** @description Evidence items */
            evidence: components["schemas"]["TodaySuggestionsResponsePrimaryEvidence"][];
            /** @description Available feedback options for this card */
            feedbackOptions?: ("accepted" | "later" | "not_applicable" | "suppress")[];
            /** @description Icon identifier for the frontend */
            icon: string;
            /** @description Unique suggestion id */
            id: string;
            /**
             * @description Lifecycle state
             * @enum {string}
             */
            lifecycleState: "generated" | "active" | "fading" | "expired" | "dismissed";
            /** @description Whether this card can trigger a notification */
            notificationEligible?: boolean;
            observedMetric?: components["schemas"]["TodaySuggestionsResponsePrimaryObservedMetric"];
            primaryAction: components["schemas"]["TodaySuggestionsResponsePrimaryPrimaryAction"];
            /** @description Why this suggestion appeared */
            reason: string;
            /** @description Rule identifier for auditability */
            ruleId: string;
            /** @description Rule version */
            ruleVersion: string;
            /** @description Secondary actions */
            secondaryActions?: components["schemas"]["TodaySuggestionsResponsePrimarySecondaryActions"][];
            /** @description Sub-type for rendering variety */
            subtype?: string;
            /** @description Localized short title */
            title: string;
            /**
             * @description Trigger type
             * @enum {string}
             */
            triggerType: "event" | "timer";
            /**
             * @description Suggestion type
             * @enum {string}
             */
            type: "confirmed_risk" | "compliance" | "trend" | "behavior_advice" | "coverage";
        };
        TodaySuggestionsResponsePrimaryEvidence: {
            kind: string;
            /** @description Human-readable label */
            label: string;
            /** @description Related medicine id for navigation */
            medicineId?: string;
            /** @description Related record id for navigation */
            recordId?: string;
            /** @description Human-readable value */
            value: string;
        };
        TodaySuggestionsResponsePrimaryObservedMetric: {
            /** @enum {string} */
            coverage: "sufficient" | "partial" | "none";
            expectedCount: number | null;
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            value: number | null;
            windowEnd: string;
            windowStart: string;
        };
        /** @description Primary action */
        TodaySuggestionsResponsePrimaryPrimaryAction: {
            /** @description Unique action id */
            actionId: string;
            /** @description Whether authentication is required */
            authRequired: boolean;
            /** @description Localized action label */
            label: string;
            /** @description Deep-link route for navigation */
            route: string;
        };
        TodaySuggestionsResponsePrimarySecondaryActions: {
            /** @description Unique action id */
            actionId: string;
            /** @description Whether authentication is required */
            authRequired: boolean;
            /** @description Localized action label */
            label: string;
            /** @description Deep-link route for navigation */
            route: string;
        };
        TodaySuggestionsResponseSecondary: {
            /** @description Medical disclaimer / boundary text */
            boundary: string;
            /**
             * @description Visual tone hint
             * @enum {string}
             */
            cardTone: "urgent" | "warning" | "emphasis" | "soft" | "neutral";
            /**
             * @description Confidence level
             * @enum {string}
             */
            confidence: "high" | "medium" | "low";
            /** @description Evidence items */
            evidence: components["schemas"]["TodaySuggestionsResponseSecondaryEvidence"][];
            /** @description Available feedback options for this card */
            feedbackOptions?: ("accepted" | "later" | "not_applicable" | "suppress")[];
            /** @description Icon identifier for the frontend */
            icon: string;
            /** @description Unique suggestion id */
            id: string;
            /**
             * @description Lifecycle state
             * @enum {string}
             */
            lifecycleState: "generated" | "active" | "fading" | "expired" | "dismissed";
            /** @description Whether this card can trigger a notification */
            notificationEligible?: boolean;
            observedMetric?: components["schemas"]["TodaySuggestionsResponseSecondaryObservedMetric"];
            primaryAction: components["schemas"]["TodaySuggestionsResponseSecondaryPrimaryAction"];
            /** @description Why this suggestion appeared */
            reason: string;
            /** @description Rule identifier for auditability */
            ruleId: string;
            /** @description Rule version */
            ruleVersion: string;
            /** @description Secondary actions */
            secondaryActions?: components["schemas"]["TodaySuggestionsResponseSecondarySecondaryActions"][];
            /** @description Sub-type for rendering variety */
            subtype?: string;
            /** @description Localized short title */
            title: string;
            /**
             * @description Trigger type
             * @enum {string}
             */
            triggerType: "event" | "timer";
            /**
             * @description Suggestion type
             * @enum {string}
             */
            type: "confirmed_risk" | "compliance" | "trend" | "behavior_advice" | "coverage";
        };
        TodaySuggestionsResponseSecondaryEvidence: {
            kind: string;
            /** @description Human-readable label */
            label: string;
            /** @description Related medicine id for navigation */
            medicineId?: string;
            /** @description Related record id for navigation */
            recordId?: string;
            /** @description Human-readable value */
            value: string;
        };
        TodaySuggestionsResponseSecondaryObservedMetric: {
            /** @enum {string} */
            coverage: "sufficient" | "partial" | "none";
            expectedCount: number | null;
            observedCount: number;
            sources: ("manual" | "health_platform" | "reminder_plan" | "derived")[];
            /** @enum {string} */
            state: "observed" | "unknown";
            value: number | null;
            windowEnd: string;
            windowStart: string;
        };
        /** @description Primary action */
        TodaySuggestionsResponseSecondaryPrimaryAction: {
            /** @description Unique action id */
            actionId: string;
            /** @description Whether authentication is required */
            authRequired: boolean;
            /** @description Localized action label */
            label: string;
            /** @description Deep-link route for navigation */
            route: string;
        };
        TodaySuggestionsResponseSecondarySecondaryActions: {
            /** @description Unique action id */
            actionId: string;
            /** @description Whether authentication is required */
            authRequired: boolean;
            /** @description Localized action label */
            label: string;
            /** @description Deep-link route for navigation */
            route: string;
        };
        UnlinkIdentityRequest: {
            /** @description 当前密码(敏感操作再认证用) */
            password: string;
        };
        UnreadCountResponse: {
            /**
             * @description Number of unread notifications.
             * @example 3
             */
            count: number;
        };
        UpdateAccountRequest: {
            /** @description Avatar URL. Send an empty string to clear it. */
            avatar?: string;
            /** @description Display nickname. Send an empty string to clear it. */
            nickname?: string;
        };
        UpdateAdminLegalDocumentRequest: {
            contentEn?: string;
            contentZh?: string;
            isActive?: boolean;
            titleEn?: string;
            titleZh?: string;
        };
        UpdateAdminQaChunkRequest: {
            answer?: string;
            question?: string;
            /** @enum {string} */
            safetyLabel?: "safe" | "caution" | "blocked";
        };
        UpdateAdminResourceRowRequest: {
            [key: string]: unknown;
        };
        UpdateAdminSafetyTipRequest: {
            category?: string;
            contentEn?: string;
            contentZh?: string;
            isActive?: boolean;
            sortOrder?: number;
        };
        UpdateAdminUserStatusRequest: {
            /** @enum {string} */
            status: "active" | "suspended";
        };
        UpdateAllergyRequest: {
            /**
             * @description Whether the allergy is currently active.
             * @example true
             */
            isActive?: boolean;
            /**
             * @description Allergy kind.
             * @example food
             * @enum {string}
             */
            kind?: "drug" | "food" | "environment" | "other";
            /**
             * @description User-visible allergy label.
             * @example Peanut
             */
            label?: string;
            /**
             * @description User note for the allergy. Use null to clear.
             * @example Avoid peanuts and peanut oil.
             */
            note?: string | null;
            /**
             * @description Recorded reaction. Use null to clear.
             * @example Hives and swelling
             */
            reaction?: string | null;
            /**
             * @description When this allergy was recorded in ISO 8601 format.
             * @example 2026-06-04T08:30:00.000Z
             */
            recordedAt?: string | null;
            /**
             * @description Severity level.
             * @example moderate
             * @enum {string|null}
             */
            severity?: "mild" | "moderate" | "severe" | "unknown" | null;
        };
        UpdateConditionRequest: {
            /**
             * @description Diagnosis date in YYYY-MM-DD format. Use null to clear.
             * @example 2024-03-15
             */
            diagnosedAt?: string | null;
            /**
             * @description Condition label.
             * @example Type 2 diabetes
             */
            label?: string;
            /**
             * @description User note for the condition. Use null to clear.
             * @example Blood sugar now within range.
             */
            note?: string | null;
            /**
             * @description Condition status.
             * @example resolved
             * @enum {string}
             */
            status?: "active" | "resolved" | "suspected";
        };
        UpdateCurrentMedicineRequest: {
            /**
             * @description Display name shown to the user.
             * @example Metformin 500 mg tablet
             */
            displayName?: string;
            /**
             * @description Dose text. Use null to clear.
             * @example Take 1 tablet twice daily
             */
            doseText?: string | null;
            /**
             * @description End date in YYYY-MM-DD format. Use null to clear.
             * @example 2024-10-01
             */
            endedAt?: string | null;
            /**
             * @description Whether the medicine is currently active.
             * @example true
             */
            isCurrent?: boolean;
            /**
             * @description User note. Use null to clear.
             * @example Take with meals.
             */
            note?: string | null;
            /**
             * @description Administration route. Use null to clear.
             * @example oral
             */
            route?: string | null;
            /**
             * @description Upstream source.
             * @example cn
             * @enum {string}
             */
            source?: "drugbank" | "cn" | "manual";
            /**
             * @description Source-specific reference id.
             * @example NMPA-H20051234
             */
            sourceRefId?: string | null;
            /**
             * @description Start date in YYYY-MM-DD format. Use null to clear.
             * @example 2024-04-01
             */
            startedAt?: string | null;
            /**
             * @description Strength text. Use null to clear.
             * @example 500 mg
             */
            strengthText?: string | null;
        };
        UpdateDailyRecordRequest: {
            /**
             * @description Replacement attachment metadata list. Omit to keep existing attachments; send [] to clear.
             * @example [
             *       {
             *         "kind": "image",
             *         "objectKey": "daily-records/user_1/2026-06-04/photo.jpg",
             *         "contentType": "image/jpeg"
             *       }
             *     ]
             */
            attachments?: components["schemas"]["UpdateDailyRecordRequestAttachments"][];
            /**
             * Format: uuid
             * @description Active health event association. Use null to clear.
             * @example 3fa85f64-5717-4562-b3fc-2c963f66afa6
             */
            healthEventId?: string | null;
            /**
             * @example vital
             * @enum {string}
             */
            kind?: "water" | "meal" | "vital" | "mood" | "symptom" | "activity" | "note" | "sleep";
            /**
             * @description Free-text note. Use null to clear.
             * @example After waking up.
             */
            note?: string | null;
            /**
             * @description Date in YYYY-MM-DD format.
             * @example 2026-06-04
             */
            occurredAt?: string;
            /**
             * @description Time in HH:mm 24-hour format. Use null to clear.
             * @example 08:30
             */
            occurredTime?: string | null;
            /**
             * @description Structured payload for kind-specific data. Sleep accepts sleepType (nightSleep|nap), startedAt, endedAt, durationMinutes and optional quality. endedAt must be later than startedAt. Meal accepts only the dish list { mealAnalysis: { dishes: [{ name: string }] } }: the analysis itself is server-owned, and sending attachments with exactly one image re-runs the analysis.
             * @example {
             *       "sleepType": "nightSleep",
             *       "startedAt": "2026-06-03T23:15:00.000Z",
             *       "endedAt": "2026-06-04T06:45:00.000Z",
             *       "durationMinutes": 450
             *     }
             */
            payload?: {
                [key: string]: unknown;
            } | null;
            /**
             * @description Short label. Use null to clear.
             * @example Morning blood pressure
             */
            title?: string | null;
            /**
             * @description Unit label. Use null to clear.
             * @example mmHg
             */
            unit?: string | null;
            /**
             * @description Measured value. Use null to clear.
             * @example 120/80
             */
            value?: string | null;
        };
        UpdateDailyRecordRequestAttachments: {
            /**
             * @description Object storage bucket.
             * @example lumos-daily-records
             */
            bucket?: string | null;
            /**
             * @description MIME content type.
             * @example image/jpeg
             */
            contentType?: string | null;
            /**
             * @description Original file name.
             * @example photo.jpg
             */
            fileName?: string | null;
            /**
             * @description Image height in pixels.
             * @example 1080
             */
            height?: number | null;
            /**
             * @description Attachment kind. Defaults to "image".
             * @example image
             * @enum {string}
             */
            kind?: "image";
            /**
             * @description Object storage key, stable across signed URL rotations.
             * @example daily-records/user_1/2026-06-04/photo.jpg
             */
            objectKey: string;
            /**
             * @description Storage provider (e.g. tencent-cos, s3, ali-oss).
             * @example tencent-cos
             */
            provider?: string | null;
            /**
             * @description Optional public or already-signed display URL.
             * @example https://cdn.example.com/daily-records/user_1/2026-06-04/photo.jpg
             */
            publicUrl?: string | null;
            /**
             * @description File size in bytes.
             * @example 245760
             */
            sizeBytes?: number | null;
            /**
             * @description Image width in pixels.
             * @example 1920
             */
            width?: number | null;
        };
        UpdateDoseLogRequest: {
            doseText?: string | null;
            note?: string | null;
            /** @enum {string} */
            status?: "taken" | "skipped" | "missed" | "planned";
        };
        UpdateMedicineReminderRequest: {
            /** @description Linked current medicine id. */
            currentMedicineId?: string | null;
            /** @description Weekday numbers 0-6, where null means every day. */
            daysOfWeek?: number[] | null;
            /** @description Date in YYYY-MM-DD format when the reminder ends. Use null to clear. */
            endDate?: string | null;
            /** @description Whether this reminder is active. */
            isActive?: boolean;
            /** @description Reminder label. */
            label?: string | null;
            /** @description User note. */
            note?: string | null;
            /** @description Scheduled local hour, 0-23. */
            scheduledHour?: number;
            /** @description Scheduled local minute, 0-59. */
            scheduledMinute?: number;
            /** @description Date in YYYY-MM-DD format when the reminder starts. Use null to clear. */
            startDate?: string | null;
        };
        UpdateSettingsRequest: {
            /** @description Allow AI-generated summaries and advice. */
            aiSummariesEnabled?: boolean;
            assistantContext?: components["schemas"]["UpdateSettingsRequestAssistantContext"];
            /** @description Allow the authenticated user to use the assistant feature. */
            assistantEnabled?: boolean;
            /** @description Allow the assistant to reuse persisted conversation history as cross-conversation memory. */
            assistantMemoryEnabled?: boolean;
            /** @description Consent to share anonymized data for research. */
            dataSharingConsent?: boolean;
            /** @description Daily water intake target (number of glasses). */
            waterTargetCount?: number;
        };
        /** @description Fine-grained permissions for what the assistant may read. */
        UpdateSettingsRequestAssistantContext: {
            /** @description Allow the assistant to read current medicines and medicine-box data. */
            currentMedicines?: boolean;
            /** @description Allow the assistant to read recent daily records. */
            dailyRecords?: boolean;
            /** @description Allow the assistant to read stored health profile, allergies, and conditions. */
            healthProfile?: boolean;
            /** @description Allow the assistant to read sleep records and summaries. */
            sleepRecords?: boolean;
        };
        UpdateUserHealthContextProfileRequest: {
            /**
             * @description Self-reported activity level. Use null to clear.
             * @example moderatelyActive
             * @enum {string|null}
             */
            activityLevel?: "sedentary" | "lightlyActive" | "moderatelyActive" | "veryActive" | "extremelyActive" | null;
            /**
             * @description Birth date in YYYY-MM-DD format.
             * @example 1990-05-20
             */
            birthDate?: string | null;
            /**
             * @description Dietary preferences. Stored in extras JSONB. Use null to clear.
             * @example [
             *       "vegetarian",
             *       "lowSalt"
             *     ]
             */
            dietaryPreferences?: ("vegetarian" | "vegan" | "lowCarb" | "lowSalt" | "lowFat" | "highProtein" | "keto" | "halal" | "other")[] | null;
            /**
             * @description Height in centimeters. Use null to clear.
             * @example 165
             */
            heightCm?: number | null;
            /**
             * @description Preferred locale. Use null or empty string to clear and follow the client default.
             * @example zh-CN
             */
            locale?: string | null;
            /**
             * @description Set true to complete onboarding (sets completedAt when missing). Set false to clear onboarding completion.
             * @example true
             */
            onboardingCompleted?: boolean;
            /**
             * @description Sex assigned at birth. Use null to clear.
             * @example female
             * @enum {string|null}
             */
            sexAtBirth?: "female" | "male" | "intersex" | "unknown" | null;
            /**
             * @description Preferred timezone. Use null or empty string to clear.
             * @example Asia/Shanghai
             */
            timezone?: string | null;
            /**
             * @description Preferred unit system. Use null to clear.
             * @example metric
             * @enum {string|null}
             */
            unitSystem?: "metric" | "imperial" | null;
            /**
             * @description Weight in kilograms. Stored in extras JSONB. Use null to clear.
             * @example 60
             */
            weightKg?: number | null;
        };
        UpsertCheckInRequest: {
            /**
             * @description User-confirmed outcome for the requested calendar date.
             * @enum {string}
             */
            outcome: "improved" | "unchanged" | "worsened";
        };
        UpsertGroupRequest: {
            /** @description Linked current medicine id. */
            currentMedicineId: string;
            /** @description Weekday numbers 0-6, where null means every day. */
            daysOfWeek?: number[] | null;
            /** @description Date in YYYY-MM-DD format when the reminder ends. */
            endDate?: string | null;
            /** @description Whether this reminder is active. */
            isActive?: boolean;
            /** @description Reminder label. */
            label?: string | null;
            /** @description User note. */
            note?: string | null;
            /** @description Reminder slots for this medicine. Replaces the whole group. */
            slots: components["schemas"]["UpsertGroupRequestSlots"][];
            /** @description Date in YYYY-MM-DD format when the reminder starts. */
            startDate?: string | null;
        };
        UpsertGroupRequestSlots: {
            /** @description Existing reminder id to update. Omit to create a new slot. */
            id?: string;
            /** @description Scheduled local hour, 0-23. */
            scheduledHour: number;
            /** @description Scheduled local minute, 0-59. */
            scheduledMinute: number;
        };
        UserSettingsResponse: {
            /** @description Allow AI-generated summaries and advice. */
            aiSummariesEnabled: boolean;
            assistantContext: components["schemas"]["UserSettingsResponseAssistantContext"];
            /** @description Allow the authenticated user to use the assistant feature. */
            assistantEnabled: boolean;
            /** @description Allow the assistant to reuse persisted conversation history as cross-conversation memory. */
            assistantMemoryEnabled: boolean;
            /** @description Consent to share anonymized data for research. */
            dataSharingConsent: boolean;
            /** @description Whether sensitive operations require password re-authentication. */
            passwordReauthenticationRequired: boolean;
            /** @description ISO-8601 timestamp of last update. */
            updatedAt: string | null;
            /** @description Daily water intake target (number of glasses). */
            waterTargetCount: number;
        };
        /** @description Fine-grained assistant context permissions. */
        UserSettingsResponseAssistantContext: {
            /** @description Whether the assistant may read current medicines and medicine-box data. */
            currentMedicines: boolean;
            /** @description Whether the assistant may read recent daily records. */
            dailyRecords: boolean;
            /** @description Whether the assistant may read stored health profile, allergies, and conditions. */
            healthProfile: boolean;
            /** @description Whether the assistant may read sleep records and summaries. */
            sleepRecords: boolean;
        };
        VerifyEmailRequest: {
            /** @description Lucent 签发的邮件验证 token */
            token: string;
        };
        VerifyEmailResponse: {
            /**
             * @description 邮箱是否已验证
             * @example true
             */
            emailVerified: boolean;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
};
export type $defs = Record<string, never>;
export interface operations {
    getAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Authenticated account profile. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountResponse"];
                };
            };
            /** @description Account not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    deleteAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DeleteAccountRequest"];
            };
        };
        responses: {
            /** @description Account deleted. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Verification code expired or does not match, or neither password nor code provided */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Wrong password (AUTH_WRONG_PASSWORD), no password set (AUTH_PASSWORD_NOT_SET), or OAuth-only code mismatch */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Account not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Too many failed re-authentication attempts */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    updateAccount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAccountRequest"];
            };
        };
        responses: {
            /** @description Updated authenticated account profile. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountResponse"];
                };
            };
            /** @description Account not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    changeEmail: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangeEmailRequest"];
            };
        };
        responses: {
            /** @description Updated account email with verification time. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountEmailResponse"];
                };
            };
            /** @description Verification code expired or does not match */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Wrong password (AUTH_WRONG_PASSWORD) or no password set (AUTH_PASSWORD_NOT_SET) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Account not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Email already in use */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Too many failed re-authentication attempts */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    unlinkIdentity: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                identityId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UnlinkIdentityRequest"];
            };
        };
        responses: {
            /** @description Account profile with the identity unlinked. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountResponse"];
                };
            };
            /** @description Wrong password (AUTH_WRONG_PASSWORD) or no password set (AUTH_PASSWORD_NOT_SET) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Cannot unlink the last identity while the account has no password */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Account or identity not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Too many failed re-authentication attempts */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    linkWechatMobileIdentity: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LinkWechatMobileIdentityRequest"];
            };
        };
        responses: {
            /** @description Account profile with the linked identity. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountResponse"];
                };
            };
            /** @description Missing/malformed callback credential */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Account not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth identity is already linked to another account */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider rejected the exchange or returned an unusable profile */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider is unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider timed out */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    createWechatWebIdentityLinkAuthorizeUrl: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateWechatWebIdentityLinkAuthorizeUrlRequest"];
            };
        };
        responses: {
            /** @description OAuth authorize URL. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OAuthAuthorizeResponse"];
                };
            };
            /** @description Invalid callback URI */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    linkWechatWebIdentity: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LinkWechatWebIdentityRequest"];
            };
        };
        responses: {
            /** @description Account profile with the linked identity. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AccountResponse"];
                };
            };
            /** @description Invalid OAuth state or missing/malformed callback credential */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Account not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth identity is already linked to another account */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider rejected the exchange or returned an unusable profile */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider is unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider timed out */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    changePassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ChangePasswordRequest"];
            };
        };
        responses: {
            /** @description Password changed. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Wrong password (AUTH_WRONG_PASSWORD) or no password set (AUTH_PASSWORD_NOT_SET) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Account not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Too many failed re-authentication attempts */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    setPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetPasswordRequest"];
            };
        };
        responses: {
            /** @description Password set. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Verification code expired or does not match, or target email is missing */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Account not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Password already set or email already in use */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    listAdminGrants: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Administrator grants. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminAdminListResponse"];
                };
            };
        };
    };
    setAdminRole: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetAdminRoleRequest"];
            };
        };
        responses: {
            /** @description Updated administrator grant. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminAdminSummary"];
                };
            };
            /** @description Attempting to change the caller's own role. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description User not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Refusing to demote the last super administrator. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    removeAdminGrant: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                userId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Administrator grant removed. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Attempting to remove the caller's own role. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Grant not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Refusing to remove the last super administrator. */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    listAdminAuditLogs: {
        parameters: {
            query?: {
                action?: string;
                actorUserId?: string;
                limit?: number;
                page?: number;
                resourceType?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated security audit logs. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminAuditLogListResponse"];
                };
            };
        };
    };
    listAdminLegalDocuments: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminLegalDocumentList"];
                };
            };
        };
    };
    updateAdminLegalDocument: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                docType: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAdminLegalDocumentRequest"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminLegalDocument"];
                };
            };
        };
    };
    listAdminQaChunks: {
        parameters: {
            query?: {
                limit?: number;
                page?: number;
                q?: string;
                safetyLabel?: "safe" | "caution" | "blocked";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated QA corpus chunks. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminQaChunkListResponse"];
                };
            };
        };
    };
    updateAdminQaChunk: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAdminQaChunkRequest"];
            };
        };
        responses: {
            /** @description Updated QA corpus chunk. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminQaChunk"];
                };
            };
        };
    };
    listAdminSafetyTips: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminSafetyTipList"];
                };
            };
        };
    };
    createAdminSafetyTip: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAdminSafetyTipRequest"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminSafetyTip"];
                };
            };
        };
    };
    updateAdminSafetyTip: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAdminSafetyTipRequest"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminSafetyTip"];
                };
            };
        };
    };
    deleteAdminSafetyTip: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Safety tip deleted. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listAdminResourceRows: {
        parameters: {
            query?: {
                limit?: number;
                order?: "asc" | "desc";
                page?: number;
                q?: string;
                sort?: string;
                userId?: string;
            };
            header?: never;
            path: {
                resource: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated resource rows. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminResourceListResponse"];
                };
            };
            /** @description Unknown resource key. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    createAdminResourceRow: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                resource: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAdminResourceRowRequest"];
            };
        };
        responses: {
            /** @description Created resource row. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminResourceRow"];
                };
            };
            /** @description Resource is read-only or caller lacks data:write. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getAdminResourceRow: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                resource: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Resource row. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminResourceRow"];
                };
            };
            /** @description Unknown resource key or row not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    updateAdminResourceRow: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                resource: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAdminResourceRowRequest"];
            };
        };
        responses: {
            /** @description Updated resource row. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminResourceRow"];
                };
            };
            /** @description Unknown resource key or row not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    deleteAdminResourceRow: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                resource: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Row deleted. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unknown resource key or row not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getAdminDependencies: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Sidecar enablement flags (flags only, no endpoints or keys). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminDependencies"];
                };
            };
        };
    };
    getAdminIdentity: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Current administrator identity. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Missing or invalid access token. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authenticated user does not have an AdminUser role. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getAdminMetricsFunnel: {
        parameters: {
            query?: {
                /** @description Window start (inclusive), ISO 8601 date (YYYY-MM-DD) or datetime; the UTC calendar day is used. */
                dateFrom?: string;
                /** @description Window end (inclusive), ISO 8601 date (YYYY-MM-DD) or datetime; the UTC calendar day is used. */
                dateTo?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Aggregated funnel counts for the requested window. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FunnelResponse"];
                };
            };
            /** @description Invalid funnel query window (dates or range). */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Missing or invalid access token. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authenticated user without the metrics:read permission. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getAdminMetricsOverview: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Aggregate admin dashboard metrics. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminMetricsOverview"];
                };
            };
        };
    };
    listAdminUsers: {
        parameters: {
            query?: {
                limit?: number;
                page?: number;
                q?: string;
                status?: "active" | "suspended";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated user account summaries. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminUserListResponse"];
                };
            };
        };
    };
    getAdminUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User account summary. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminUserSummary"];
                };
            };
            /** @description User not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    deleteAdminUser: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description User soft-deleted. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Target is the caller or a super administrator. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description User not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getAdminUserRelated: {
        parameters: {
            query?: {
                limit?: number;
            };
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Related records grouped by domain. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminUserRelated"];
                };
            };
            /** @description User not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    revokeAdminUserSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Session revoked. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Session not found for this user. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    revokeAdminUserShare: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
                shareId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Share revoked. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Share not found for this user. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    updateAdminUserStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAdminUserStatusRequest"];
            };
        };
        responses: {
            /** @description Updated user account summary. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AdminUserSummary"];
                };
            };
            /** @description Target is the caller or a super administrator. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description User not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    LocalController_getCaptcha: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Whether the challenge is enforced and the public site key to render it with. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CaptchaResponse"];
                };
            };
        };
    };
    listDevices: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The signed-in devices of the current user. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionListItem"];
                };
            };
            /** @description Access token invalid or expired */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    revokeDevice: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Device revoked. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Access token invalid or expired */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Session belongs to another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Session not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    forgotPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ForgotPasswordRequest"];
            };
        };
        responses: {
            /** @description Cooldown seconds until the next reset code can be requested. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ForgotPasswordResponse"];
                };
            };
            /** @description Validation failed */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Too many verification code requests (cooldown or client rate limit) */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    login: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginRequest"];
            };
        };
        responses: {
            /** @description Authenticated user with token pair. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            /** @description Login verification code expired or does not match */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Wrong credentials (unified code; account state is not revealed) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Too many failed login attempts */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    logout: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LogoutRequest"];
            };
        };
        responses: {
            /** @description Logged out. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Access token invalid or expired */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    loginWithApple: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginWithAppleRequest"];
            };
        };
        responses: {
            /** @description Authenticated user with token pair. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            /** @description Missing or invalid identity token */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth sign-in failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth identity is already linked to another account */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider rejected the exchange or returned an unusable profile */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider timed out */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    createGoogleAuthorizeUrl: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateGoogleAuthorizeUrlRequest"];
            };
        };
        responses: {
            /** @description OAuth authorize URL with state and expiry. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OAuthAuthorizeResponse"];
                };
            };
            /** @description Invalid callback URI */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    loginWithGoogle: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginWithGoogleRequest"];
            };
        };
        responses: {
            /** @description Authenticated user with token pair. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            /** @description Invalid OAuth state or missing/malformed callback credential */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth sign-in failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth identity is already linked to another account */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider rejected the exchange or returned an unusable profile */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider timed out */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    createQqAuthorizeUrl: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateQqAuthorizeUrlRequest"];
            };
        };
        responses: {
            /** @description OAuth authorize URL with state and expiry. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OAuthAuthorizeResponse"];
                };
            };
            /** @description Invalid callback URI */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    loginWithQq: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginWithQqRequest"];
            };
        };
        responses: {
            /** @description Authenticated user with token pair. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            /** @description Invalid OAuth state or missing/malformed callback credential */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth sign-in failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth identity is already linked to another account */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider rejected the exchange or returned an unusable profile */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider timed out */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    loginWithWechatMobile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginWithWechatMobileRequest"];
            };
        };
        responses: {
            /** @description Authenticated user with token pair. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            /** @description Missing/malformed callback credential */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth sign-in failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth identity is already linked to another account */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider rejected the exchange or returned an unusable profile */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider timed out */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    createWechatWebAuthorizeUrl: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateWechatWebAuthorizeUrlRequest"];
            };
        };
        responses: {
            /** @description OAuth authorize URL with state and expiry. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["OAuthAuthorizeResponse"];
                };
            };
            /** @description Invalid callback URI */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    redirectWechatWebCallback: {
        parameters: {
            query: {
                /** @description OAuth 授权码 */
                code: string;
                /** @description 授权时生成的 state */
                state: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Redirect to desktop callback URI */
            302: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Invalid OAuth state */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    loginWithWechatWeb: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginWithWechatWebRequest"];
            };
        };
        responses: {
            /** @description Authenticated user with token pair. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LoginResponse"];
                };
            };
            /** @description Invalid OAuth state or missing/malformed callback credential */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth sign-in failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth identity is already linked to another account */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider rejected the exchange or returned an unusable profile */
            502: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description OAuth provider timed out */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    refreshSession: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefreshSessionRequest"];
            };
        };
        responses: {
            /** @description New token pair for the current session. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RefreshResponse"];
                };
            };
            /** @description Refresh token invalid, expired or already consumed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    register: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterRequest"];
            };
        };
        responses: {
            /** @description Registered user with token pair. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["RegisterResponse"];
                };
            };
            /** @description Verification code expired or does not match */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Anti-enumeration credential failure (email already registered is indistinguishable from a wrong verification code) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    resetPassword: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ResetPasswordRequest"];
            };
        };
        responses: {
            /** @description Password reset. Returns a confirmation message. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ResetPasswordResponse"];
                };
            };
            /** @description Verification code is invalid/expired, or the password is invalid */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    sendVerificationCode: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SendVerificationCodeRequest"];
            };
        };
        responses: {
            /** @description Cooldown seconds until the next code can be requested. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SendVerificationCodeResponse"];
                };
            };
            /** @description Too many verification code requests (cooldown or client rate limit) */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    loginWithCookie: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["LoginWithCookieRequest"];
            };
        };
        responses: {
            /** @description Authenticated user. Tokens are set as HttpOnly cookies. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionResponse"];
                };
            };
            /** @description Login verification code expired or does not match */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Wrong credentials (unified code; account state is not revealed) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Too many failed login attempts */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    logoutWithCookie: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Logged out; cookies cleared. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Access token invalid or expired (sent as a cookie) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    refreshWithCookie: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Rotated session; new tokens are set as HttpOnly cookies. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionResponse"];
                };
            };
            /** @description Refresh token missing, invalid, expired or already consumed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    registerWithCookie: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RegisterWithCookieRequest"];
            };
        };
        responses: {
            /** @description Registered user. Tokens are set as HttpOnly cookies. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SessionResponse"];
                };
            };
            /** @description Verification code expired or does not match */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Anti-enumeration credential failure (email already registered is indistinguishable from a wrong verification code) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    verifyEmail: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["VerifyEmailRequest"];
            };
        };
        responses: {
            /** @description Whether the email is now verified. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["VerifyEmailResponse"];
                };
            };
            /** @description Verification token is invalid or has expired */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication failed */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Authentication method unavailable */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getSnapshot: {
        parameters: {
            query?: {
                /** @description Approximate latitude. */
                lat?: number;
                /** @description Approximate longitude. */
                lon?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Static environment snapshot reference data. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EnvironmentSnapshotResponse"];
                };
            };
        };
    };
    getHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Service is ready; all critical dependencies are up. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
            /** @description At least one critical dependency is unavailable. */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
        };
    };
    getDeepHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All probed dependencies are up, with detailed diagnostics. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
            /** @description At least one probed dependency is unavailable. */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
        };
    };
    getLiveHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Process is alive; downstream dependencies are not checked. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
        };
    };
    getReadyHealth: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description All critical dependencies (database, cache) are up. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
            /** @description At least one critical dependency is unavailable. */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthResponse"];
                };
            };
        };
    };
    listLegalDocuments: {
        parameters: {
            query?: {
                /** @description Content language: 'zh' or 'en'. Default: 'zh'. */
                lang?: "zh" | "en";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Active legal documents with list-level update timestamp. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalDocumentListResponse"];
                };
            };
        };
    };
    getLegalDocument: {
        parameters: {
            query?: {
                /** @description Content language: 'zh' or 'en'. Default: 'zh'. */
                lang?: "zh" | "en";
            };
            header?: never;
            path: {
                docType: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Legal document detail with Markdown content. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LegalDocumentDetailResponse"];
                };
            };
            /** @description Document type not found or inactive. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    search: {
        parameters: {
            query?: {
                /** @description Page number, 1-based. */
                page?: number;
                /** @description Page size. */
                pageSize?: number;
                /** @description Search keyword. */
                q?: string;
                /** @description Knowledge source selector. */
                source?: string;
            };
            header?: {
                /** @description Set to true/1/no-cache to bypass medicines read cache for this request only. */
                "x-bypass-cache"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Search results from the selected knowledge source. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineSearchResponse"];
                };
            };
        };
    };
    getDetail: {
        parameters: {
            query?: {
                /** @description Knowledge source selector. */
                source?: string;
            };
            header?: {
                /** @description Set to true/1/no-cache to bypass medicines read cache for this request only. */
                "x-bypass-cache"?: string;
            };
            path: {
                /** @description Medicine id in the selected source */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Medicine detail from the selected knowledge source. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineDetailResponse"];
                };
            };
        };
    };
    getSequences: {
        parameters: {
            query?: {
                /** @description Knowledge source selector. */
                source?: string;
            };
            header?: {
                /** @description Set to true/1/no-cache to bypass medicines read cache for this request only. */
                "x-bypass-cache"?: string;
            };
            path: {
                /** @description Medicine id in the selected source */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Sequences of the drug itself and of its targets. Empty arrays when the source has none. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineSequenceResponse"];
                };
            };
        };
    };
    recognize: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecognizeRequest"];
            };
        };
        responses: {
            /** @description Recognized medicine fields, null when not extractable. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineRecognitionResponse"];
                };
            };
        };
    };
    enqueueMedicineRecognition: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EnqueueMedicineRecognitionRequest"];
            };
        };
        responses: {
            /** @description Returns either a queued jobId or the synchronous recognition resource when the queue is unavailable. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineRecognitionJob"];
                };
            };
        };
    };
    recognizeStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Job status (pending, completed, or failed) */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getRiskCheck: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Latest static and LLM medicine risk check records. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineRiskCheckRecordsResponse"];
                };
            };
        };
    };
    runRiskCheck: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RunRiskCheckRequest"];
            };
        };
        responses: {
            /** @description The created medicine risk check record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineRiskCheckRecordResponse"];
                };
            };
        };
    };
    getSafetyTips: {
        parameters: {
            query?: {
                /** @description Safety tip IDs from the last response, used for deduplication */
                exclude?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Random medication safety tips. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineSafetyTipResponse"];
                };
            };
        };
    };
    getAppInfo: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Application metadata. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AppInfoResponse"];
                };
            };
        };
    };
    getCapabilities: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Assistant capabilities payload. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistantCapabilitiesResponse"];
                };
            };
        };
    };
    listRecentConversations: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description List of recent assistant conversation summaries. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistantConversationSummary"];
                };
            };
        };
    };
    deleteConversation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The conversation after soft deletion (status archived/deleted). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistantConversationResponse"];
                };
            };
        };
    };
    renameConversation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RenameConversationRequest"];
            };
        };
        responses: {
            /** @description The renamed conversation with its full message history. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistantConversationResponse"];
                };
            };
        };
    };
    confirmProposal: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ConfirmProposalRequest"];
            };
        };
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistantConfirmResultResponse"];
                };
            };
        };
    };
    openConversation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The activated conversation with its full message history. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistantConversationResponse"];
                };
            };
        };
    };
    regenerateLastMessage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Server-Sent Events stream. Each event has an "event" field (chunk | result | error | done) and a JSON "data" field. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/event-stream": string;
                };
            };
        };
    };
    getLatestConversation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Latest persisted assistant conversation, or null when none exists. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistantConversationData"];
                };
            };
        };
    };
    clearLatestConversation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Whether the latest conversation was cleared and the archived conversation id. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistantClearResultResponse"];
                };
            };
        };
    };
    clearMemory: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Number of persisted assistant memory rows deleted. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["AssistantClearMemoryResponse"];
                };
            };
        };
    };
    streamMessages: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["StreamMessagesRequest"];
            };
        };
        responses: {
            /** @description Server-Sent Events stream. Each event has an "event" field (chunk | result | error | done) and a JSON "data" field. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/event-stream": string;
                };
            };
        };
    };
    listDailyRecords: {
        parameters: {
            query: {
                /** @description Date in YYYY-MM-DD format. */
                date: string;
                kind?: "water" | "meal" | "vital" | "mood" | "symptom" | "activity" | "note" | "sleep";
                /** @description Page number (1-based). */
                page?: number;
                /** @description Page size (1-100). */
                pageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Daily records for the date. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyRecordListResponse"];
                };
            };
        };
    };
    createDailyRecord: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateDailyRecordRequest"];
            };
        };
        responses: {
            /** @description The created daily record. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyRecordResponse"];
                };
            };
            /** @description Invalid record payload, or linked health event is not active */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Linked health event is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Linked health event not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getDailyRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The daily record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyRecordResponse"];
                };
            };
            /** @description Daily record is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Daily record not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    deleteDailyRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Daily record deleted. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Daily record is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Daily record not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    updateDailyRecord: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateDailyRecordRequest"];
            };
        };
        responses: {
            /** @description The updated daily record. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyRecordResponse"];
                };
            };
            /** @description Invalid record payload, or linked health event is not active */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Daily record or linked health event is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Daily record or linked health event not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    createImageUpload: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateImageUploadRequest"];
            };
        };
        responses: {
            /** @description Presigned upload metadata for direct object storage upload. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyRecordImageUploadResponse"];
                };
            };
        };
    };
    generateCandidates: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GenerateCandidatesRequest"];
            };
        };
        responses: {
            /** @description Generated candidate daily records (not saved yet). */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyRecordCandidateResponse"];
                };
            };
        };
    };
    summary: {
        parameters: {
            query: {
                date: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Daily record counts grouped by kind for the date. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DailyRecordSummaryResponse"];
                };
            };
        };
    };
    getSymptomCatalog: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Static symptom catalog: stable codes in display order, labels localized via Accept-Language. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SymptomCatalogResponse"];
                };
            };
        };
    };
    createRequest: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateRequestRequest"];
            };
        };
        responses: {
            /** @description Data export request created. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataExportRequestResponse"];
                };
            };
            /** @description Wrong password (AUTH_WRONG_PASSWORD) or no password set (AUTH_PASSWORD_NOT_SET) */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Duplicate data export request (unique constraint race). */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Too many failed re-authentication attempts. */
            429: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Object storage backend is not reachable. */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getLatestRequest: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Latest data export request, or null when none exists. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DataExportRequestData"];
                };
            };
            /** @description Object storage backend is not reachable. */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    createUpload: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateUploadRequest"];
            };
        };
        responses: {
            /** @description Presigned upload URL for the requested file. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["CreateFileUploadResponse"];
                };
            };
            /** @description Unsupported content type or file size above the limit. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Object storage backend is not reachable. */
            503: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Object storage backend timed out. */
            504: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getUserHealthContext: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The current user health-context aggregate. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthContextResponse"];
                };
            };
            /** @description User not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    createAllergy: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateAllergyRequest"];
            };
        };
        responses: {
            /** @description The updated user health-context aggregate. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthContextResponse"];
                };
            };
            /** @description User not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    deleteAllergy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Allergy id */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The updated user health-context aggregate. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthContextResponse"];
                };
            };
            /** @description Allergy is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Allergy not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    updateAllergy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Allergy id */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateAllergyRequest"];
            };
        };
        responses: {
            /** @description The updated user health-context aggregate. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthContextResponse"];
                };
            };
            /** @description Allergy is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Allergy not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    createCondition: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateConditionRequest"];
            };
        };
        responses: {
            /** @description The updated user health-context aggregate. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthContextResponse"];
                };
            };
            /** @description User not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    deleteCondition: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Condition id */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The updated user health-context aggregate. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthContextResponse"];
                };
            };
            /** @description Condition is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Condition not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    updateCondition: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Condition id */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateConditionRequest"];
            };
        };
        responses: {
            /** @description The updated user health-context aggregate. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthContextResponse"];
                };
            };
            /** @description Condition is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Condition not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    createCurrentMedicine: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateCurrentMedicineRequest"];
            };
        };
        responses: {
            /** @description The updated user health-context aggregate. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthContextResponse"];
                };
            };
            /** @description User not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    deleteCurrentMedicine: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Current medicine id */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The updated user health-context aggregate. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthContextResponse"];
                };
            };
            /** @description Current medicine is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Current medicine not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    updateCurrentMedicine: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Current medicine id */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateCurrentMedicineRequest"];
            };
        };
        responses: {
            /** @description The updated user health-context aggregate. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthContextResponse"];
                };
            };
            /** @description Current medicine is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Current medicine not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    updateUserHealthContextProfile: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateUserHealthContextProfileRequest"];
            };
        };
        responses: {
            /** @description The updated user health-context aggregate. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthContextResponse"];
                };
            };
            /** @description User not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    listHealthEvents: {
        parameters: {
            query?: {
                /** @description Calendar date in YYYY-MM-DD format. */
                date?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The user health event history page. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthEventListResponse"];
                };
            };
        };
    };
    createHealthEvent: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateHealthEventRequest"];
            };
        };
        responses: {
            /** @description The created health event. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthEventResponse"];
                };
            };
            /** @description Related medicine or reason record not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description An active health event already exists */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getHealthEvent: {
        parameters: {
            query?: {
                /** @description Calendar date in YYYY-MM-DD format. */
                date?: string;
            };
            header?: never;
            path: {
                /** @description Health event id. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The health event. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthEventResponse"];
                };
            };
            /** @description Health event is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Health event not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    upsertCheckIn: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Calendar date in YYYY-MM-DD format. */
                date: string;
                /** @description Health event id. */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpsertCheckInRequest"];
            };
        };
        responses: {
            /** @description The updated health event. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthEventResponse"];
                };
            };
            /** @description Invalid outcome or date, or event is not active */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Health event is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Health event not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Duplicate check-in for the same event and date (race) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    end: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Health event id. */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EndRequest"];
            };
        };
        responses: {
            /** @description The ended health event. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthEventResponse"];
                };
            };
            /** @description Invalid outcome or event already ended */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Health event is owned by another user */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Health event not found */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    active: {
        parameters: {
            query?: {
                /** @description Calendar date in YYYY-MM-DD format. */
                date?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The active health event, or null when none is active. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HealthEventNullableResponse"];
                };
            };
        };
    };
    listDoseLogs: {
        parameters: {
            query: {
                date: string;
                page?: number;
                pageSize?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Dose logs for the requested date. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DoseLogListResponse"];
                };
            };
        };
    };
    createDoseLog: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateDoseLogRequest"];
            };
        };
        responses: {
            /** @description The created dose log. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DoseLogResponse"];
                };
            };
            /** @description Invalid slot identity (VALIDATION_FAILED) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Reminder or current medicine not found (RESOURCE_NOT_FOUND) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Duplicate dose log for the same slot (RESOURCE_CONFLICT, race) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    deleteDoseLog: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Dose log deleted. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Dose log not found (RESOURCE_NOT_FOUND) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    updateDoseLog: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateDoseLogRequest"];
            };
        };
        responses: {
            /** @description The updated dose log. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DoseLogResponse"];
                };
            };
            /** @description Dose log not found (RESOURCE_NOT_FOUND) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    mark: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["MarkRequest"];
            };
        };
        responses: {
            /** @description The created or updated dose log for the slot. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["DoseLogResponse"];
                };
            };
            /** @description Missing slot identifier or invalid slot identity (VALIDATION_FAILED) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Reminder or current medicine not found (RESOURCE_NOT_FOUND) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Duplicate dose log for the same slot (RESOURCE_CONFLICT, race) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    listMedicineReminders: {
        parameters: {
            query?: {
                /** @description Set to true to return active reminders only. */
                activeOnly?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Medicine reminder schedules. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineReminderListResponse"];
                };
            };
        };
    };
    createMedicineReminder: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateMedicineReminderRequest"];
            };
        };
        responses: {
            /** @description The created medicine reminder. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineReminderResponse"];
                };
            };
            /** @description Invalid reminder payload (VALIDATION_FAILED) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Current medicine not found (RESOURCE_NOT_FOUND) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    deleteMedicineReminder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Medicine reminder deleted. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Reminder belongs to another user (FORBIDDEN) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Reminder not found (RESOURCE_NOT_FOUND) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    updateMedicineReminder: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateMedicineReminderRequest"];
            };
        };
        responses: {
            /** @description The updated medicine reminder. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineReminderResponse"];
                };
            };
            /** @description Invalid reminder payload (VALIDATION_FAILED) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Reminder belongs to another user (FORBIDDEN) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Reminder or current medicine not found (RESOURCE_NOT_FOUND) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    upsertGroup: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpsertGroupRequest"];
            };
        };
        responses: {
            /** @description The upserted reminder group. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["MedicineReminderListResponse"];
                };
            };
            /** @description Empty group, duplicate slot ids or invalid payload (VALIDATION_FAILED) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Current medicine or a slot not found (RESOURCE_NOT_FOUND) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getNotificationPreferences: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Authenticated user notification preferences. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationPreferencesResponse"];
                };
            };
        };
    };
    patch: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PatchRequest"];
            };
        };
        responses: {
            /** @description Updated notification preferences. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationPreferencesResponse"];
                };
            };
            /** @description Sleep time minutes out of range 0-1439 (VALIDATION_FAILED) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    listNotifications: {
        parameters: {
            query: {
                page: number;
                pageSize: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Paginated notification list. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationListResponse"];
                };
            };
        };
    };
    createNotification: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateNotificationRequest"];
            };
        };
        responses: {
            /** @description Created notification. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Notification already exists (RESOURCE_CONFLICT, P2002 race) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getNotification: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Notification detail. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationDetailResponse"];
                };
            };
            /** @description Notification not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    remove: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Notification deleted. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Notification not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    markAsRead: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Notification marked as read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationDetailResponse"];
                };
            };
            /** @description Notification not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    markAsUnread: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Notification marked as unread. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["NotificationDetailResponse"];
                };
            };
            /** @description Notification not found. */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    markAllAsRead: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Number of notifications marked as read. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnreadCountResponse"];
                };
            };
        };
    };
    getUnreadCount: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Unread notification count. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UnreadCountResponse"];
                };
            };
        };
    };
    recordBatch: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordBatchRequest"];
            };
        };
        responses: {
            /** @description Events accepted; `recorded` may be lower than `received` when duplicate clientEventIds were skipped. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Unknown suggestion rule code or occurredAt more than 24 hours in the future. */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    getFunnel: {
        parameters: {
            query?: {
                /** @description Window start (inclusive), ISO 8601 date (YYYY-MM-DD) or datetime; the UTC calendar day is used. */
                dateFrom?: string;
                /** @description Window end (inclusive), ISO 8601 date (YYYY-MM-DD) or datetime; the UTC calendar day is used. */
                dateTo?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Aggregated funnel counts for the requested window. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["FunnelResponse"];
                };
            };
            /** @description Invalid funnel query window (dates or range). */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Missing or invalid access token. */
            401: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
            /** @description Authenticated user without an AdminUser role. */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    listReminderDeliveries: {
        parameters: {
            query?: {
                /** @description Optional scheduled date filter in YYYY-MM-DD format. */
                date?: string;
                /** @description Maximum rows to return. Clamped to 1-100. */
                limit?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Reminder delivery audit rows. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReminderDeliveryListResponse"];
                };
            };
            /** @description Invalid date filter (VALIDATION_FAILED) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    reportLocalCapability: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReportLocalCapabilityRequest"];
            };
        };
        responses: {
            /** @description The persisted local scheduling capability state. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["LocalCapabilityResponse"];
                };
            };
        };
    };
    recordReceipt: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RecordReceiptRequest"];
            };
        };
        responses: {
            /** @description The recorded delivery row. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReminderDeliveryReceiptResponse"];
                };
            };
            /** @description Reminder belongs to another user (FORBIDDEN) */
            403: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Reminder not found (RESOURCE_NOT_FOUND) */
            404: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    enqueueClinicSummaryPdfExport: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EnqueueClinicSummaryPdfExportRequest"];
            };
        };
        responses: {
            /** @description Unscoped requests use the async queue job (jobId for polling); an explicit scope is exported synchronously with the requested scope honored (pdfBase64) because the queue job only carries the default scope. When no queue is configured, both paths return the base64 PDF synchronously. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClinicSummaryExportJobResponse"];
                };
            };
        };
    };
    exportClinicSummaryPdfStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Job status (pending, completed, or failed) */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    previewClinicSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["PreviewClinicSummaryRequest"];
            };
        };
        responses: {
            /** @description The de-identified clinic summary preview. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClinicSummaryResponse"];
                };
            };
        };
    };
    downloadClinicSummaryPdf: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["DownloadClinicSummaryPdfRequest"];
            };
        };
        responses: {
            /** @description PDF file */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/pdf": unknown;
                };
            };
        };
    };
    shareClinicSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ShareClinicSummaryRequest"];
            };
        };
        responses: {
            /** @description The created share record with its one-time token. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClinicSummaryShareResponse"];
                };
            };
        };
    };
    getSharedClinicSummary: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The shared clinic summary. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClinicSummaryResponse"];
                };
            };
        };
    };
    downloadSharedClinicSummaryPdf: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                token: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description PDF file */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/pdf": unknown;
                };
            };
        };
    };
    listClinicSummaryShares: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The caller clinic-summary shares, newest first. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ClinicSummaryShareListResponse"];
                };
            };
        };
    };
    revokeClinicSummaryShare: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                shareId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Share revoked; the shared URL now returns 404. */
            204: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getDashboard: {
        parameters: {
            query?: {
                /** @description Required when range is "custom". ISO 8601 date string (YYYY-MM-DD). */
                endDate?: string;
                /** @description Supported report aggregation range. */
                range?: "last_7_days" | "last_30_days" | "custom";
                /** @description Required when range is "custom". ISO 8601 date string (YYYY-MM-DD). */
                startDate?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Report dashboard with metric/trend/finding/pattern blocks. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportDashboardResponse"];
                };
            };
        };
    };
    listReviews: {
        parameters: {
            query?: {
                /** @description Opaque cursor for pagination: composite of the last item startedAt ISO 8601 value and id joined with "|", as returned by nextCursor. Must not be constructed by the client. */
                cursor?: string;
                /** @description Page size (1-100). */
                limit?: number;
                /** @description Filter events by status. No time range is required. */
                status?: "active" | "ended";
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventReviewListResponse"];
                };
            };
        };
    };
    getEventReview: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                eventId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventReviewResponse"];
                };
            };
        };
    };
    getCurrentReview: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["EventReviewData"];
                };
            };
        };
    };
    generateSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GenerateSummaryRequest"];
            };
        };
        responses: {
            /** @description AI report summary resource. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportSummaryResponse"];
                };
            };
        };
    };
    enqueueSummaryGeneration: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EnqueueSummaryGenerationRequest"];
            };
        };
        responses: {
            /** @description When a queue is configured, accepted with a `jobId` for polling; otherwise the summary is generated synchronously and returned. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportSummaryAsyncResponseData"];
                };
            };
        };
    };
    generateSummaryStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    generateSummaryStream: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GenerateSummaryStreamRequest"];
            };
        };
        responses: {
            /** @description SSE stream of summary events. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ReportSummaryStreamResponse"];
                };
            };
        };
    };
    getSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Authenticated user settings. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserSettingsResponse"];
                };
            };
        };
    };
    updateSettings: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateSettingsRequest"];
            };
        };
        responses: {
            /** @description Updated user settings. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["UserSettingsResponse"];
                };
            };
            /** @description Validation failed (VALIDATION_FAILED) */
            400: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
            /** @description Settings upsert conflict (RESOURCE_CONFLICT, race) */
            409: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ProblemDetailsDto"];
                };
            };
        };
    };
    read: {
        parameters: {
            query?: {
                date?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The latest persisted analysis with its read state. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TodayAnalysisReadResponse"];
                };
            };
        };
    };
    generate: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GenerateRequest"];
            };
        };
        responses: {
            /** @description The freshly generated analysis, or the current read state when a generation is already in flight. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TodayAnalysisData"] | components["schemas"]["TodayAnalysisReadData"];
                };
            };
        };
    };
    enqueueAnalysisGeneration: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["EnqueueAnalysisGenerationRequest"];
            };
        };
        responses: {
            /** @description Job enqueued. Returns jobId, or the synchronous result/status when the queue is unavailable. */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TodayAnalysisAsyncStatusData"];
                };
            };
        };
    };
    generateStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Job status (pending, completed, or failed) */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    generateStream: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["GenerateStreamRequest"];
            };
        };
        responses: {
            /** @description Server-Sent Events stream without the API envelope. Each event has an "event" field (summary | result | error | done) and a JSON "data" field. Parsed event data follows TodayAnalysisStreamResultDto. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "text/event-stream": string;
                };
            };
        };
    };
    getRecommendations: {
        parameters: {
            query?: {
                /** @description Guide IDs from the last response, used for deduplication */
                exclude?: string[];
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Cold-start onboarding guide cards. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TodayRecommendationResponse"];
                };
            };
        };
    };
    refreshTodayAnalysis: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["RefreshTodayAnalysisRequest"];
            };
        };
        responses: {
            /** @description Fresh analysis, current read state, or the queued/synchronous refresh outcome. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TodayAnalysisRefreshReadyData"];
                };
            };
        };
    };
    getSuggestions: {
        parameters: {
            query?: {
                /** @description Target date (YYYY-MM-DD). Defaults to today. */
                date?: string;
                /** @description Suggestion IDs the user has dismissed. */
                excludeIds?: string[];
            };
            header: {
                "accept-language": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Today page suggestion cards with materialization state. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["TodaySuggestionsResponse"];
                };
            };
        };
    };
    explainSuggestion: {
        parameters: {
            query?: never;
            header: {
                "accept-language": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The AI explanation for the suggestion card. */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuggestionExplanationResponse"];
                };
            };
        };
    };
    enqueueSuggestionExplanation: {
        parameters: {
            query?: never;
            header: {
                "accept-language": string;
            };
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Returns either a queued jobId or the synchronous explanation resource when the queue is unavailable. */
            202: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuggestionExplanationJobResponse"];
                };
            };
        };
    };
    submitFeedback: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SubmitFeedbackRequest"];
            };
        };
        responses: {
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuggestionFeedbackResponse"];
                };
            };
        };
    };
    explainSuggestionStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Job status (pending, completed, or failed) */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content?: never;
            };
        };
    };
    getHistory: {
        parameters: {
            query?: {
                /** @description End date (YYYY-MM-DD). Defaults to today. */
                endDate?: string;
                /** @description Filter by lifecycle state. */
                lifecycleState?: "generated" | "active" | "fading" | "expired" | "dismissed";
                /** @description Max items (default 100, max 500). */
                limit?: number;
                /** @description Start date (YYYY-MM-DD). Defaults to 30 days ago. */
                startDate?: string;
                /** @description Filter by suggestion type. */
                type?: "confirmed_risk" | "compliance" | "trend" | "behavior_advice" | "coverage";
            };
            header: {
                "accept-language": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Suggestion history items with the query window used. */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SuggestionHistoryResponse"];
                };
            };
        };
    };
}
