# Sougou Web

这是搜狗线索管理后台的 Next.js + MUI 前端项目，对接同级目录的 `api` Laravel 项目。

## 技术栈

- Next.js `^16`
- React `19`
- TypeScript
- MUI `7`
- NextAuth
- react-hook-form
- react-toastify
- Tabler icon class 图标

## 目录结构

- `src/app`：Next.js App Router 页面。
- `src/app/[lang]/(dashboard)/(private)`：登录后的后台页面。
- `src/views`：页面主体组件。列表、弹窗、筛选组件通常放这里。
- `src/actions`：调用 API 的前端 action。
- `src/types`：前端业务类型。
- `src/libs/http`：HTTP 客户端封装。
- `src/libs/auth`：NextAuth 配置。
- `src/data/navigation`：菜单配置。
- `src/data/dictionaries`：多语言字典。新增菜单 key 时，`zh.json` 和 `en.json` 都要补。
- `src/components/mui`：项目自定义 MUI 组件，如表格、枚举选择、自动完成等。
- `src/@core`、`src/@layouts`、`src/@menu`：模板基础组件和布局。

## 运行与验证

安装依赖：

```bash
npm install
```

开发：

```bash
npm run dev
```

类型检查：

```bash
npx tsc --noEmit
```

构建：

```bash
npm run build
```

注意：Codex 沙箱中运行 TypeScript 检查可能需要写入 `tsconfig.tsbuildinfo`，如果遇到权限问题，需要在真实项目目录或允许写入后执行。

## 环境变量

常用环境变量：

- `NEXT_PUBLIC_API_URL`：Laravel API 地址，例如 `http://localhost:8000/api`。
- `NEXT_PUBLIC_APP_URL`：前端应用地址，用于 NextAuth credentials 登录时调用本项目的 `/api/login`。

## HTTP 封装

浏览器端：

- `src/libs/http/react/index.ts`

服务端：

- `src/libs/http/next/index.ts`

底层：

- `src/libs/http/fetcher.ts`
- `src/libs/http/JsonResponse.ts`
- `src/libs/http/types.ts`

调用约定：

- 列表接口返回 `OutPutPort<T>`，结构是 `{ total, list }`。
- action 一般返回 `Promise<ResponseInterface<T>>`。
- 路径变量使用 `:id`，例如 `destroy('users/:id', { pathVariables: { id } })`。
- 服务端页面预取数据使用 `@/libs/http/next`。
- 客户端交互调用使用 `@/libs/http/react`。

## 认证与角色

认证配置：

- `src/libs/auth/index.ts`
- `src/app/api/login/route.ts`
- `src/app/api/auth/[...nextauth]/route.ts`

用户角色来自后端：

- `admin`
- `viewer`

菜单权限在 `src/data/navigation/verticalMenuData.tsx` 中通过 `permissions` 控制。

现有后台主要按菜单权限控制显示。例如：

```ts
permissions: ['admin']
```

新增后台菜单时，按现有方式补 `permissions`，不要额外发明一套权限结构。

## 菜单结构

文件：

- `src/data/navigation/verticalMenuData.tsx`
- `src/data/navigation/horizontalMenuData.tsx`

当前主要后台菜单：

- Dashboard：`admin`、`viewer`
- 运营：`admin`
  - 用户管理
  - 账户管理
- 数据：`admin`、`viewer`
  - 线索中心
- 系统设置：`admin`
  - 表单过滤

`verticalMenuData.tsx` 会根据当前用户 role 过滤菜单。新增菜单时要同时补：

- `src/data/dictionaries/zh.json`
- `src/data/dictionaries/en.json`

## 通用页面模式

后台列表页一般由三层组成：

1. `src/app/[lang]/(dashboard)/(private)/.../page.tsx`
   - 服务端预取第一页数据。
   - 请求失败时展示 `MuiAlert`。
2. `src/views/<module>/index.tsx`
   - 客户端列表页面。
   - 维护 `rows`、`total`、`query`。
   - 使用 `MuiTable`。
3. `src/actions/<module>Actions.ts`
   - 封装 API 请求。

常见配套文件：

- `Create...Dialog.tsx`
- `Delete...Dialog.tsx`
- `TableFilter.tsx`
- `src/types/<module>Types.ts`

## 表格组件

核心文件：

- `src/components/mui/table/index.tsx`
- `src/components/mui/table/types.ts`

使用方式：

- `rows`：列表数据。
- `total`：总数。
- `headCells`：表头配置。
- `sortBy`：默认排序字段。
- `onPageChange`：分页回调。
- `slotProps.slot`：表格工具栏左侧操作按钮。
- `slotProps.filter`：筛选区域。

行操作通常使用 `headCells` 的 `action` 字段渲染按钮。

## 表单过滤页面

菜单：

- 系统设置 -> 表单过滤
- 仅 `role === admin` 显示。

相关文件：

- `src/app/[lang]/(dashboard)/(private)/system-settings/form-filters/page.tsx`
- `src/views/form-filters/index.tsx`
- `src/views/form-filters/CreateFormFilterDialog.tsx`
- `src/views/form-filters/DeleteFormFilterDialog.tsx`
- `src/views/form-filters/TableFilter.tsx`
- `src/actions/formFilterActions.ts`
- `src/types/formFilterTypes.ts`

API：

- `GET form-filters`
- `POST form-filters`
- `DELETE form-filters/:id`

设计说明：

- 表单过滤不是键值对。
- 姓名和手机号是两个独立、无序的过滤集合。
- 前端采用表格 + Dialog 添加/删除，方便展示类型、内容和添加时间。
- 没有使用 FreeSoloAutoComplete，因为后续维护、删除和审计都需要明确的行记录。

类型：

```ts
export const enum FormFilterType {
  NAME = 'name',
  PHONE = 'phone'
}
```

## 账户管理

相关文件：

- `src/app/[lang]/(dashboard)/(private)/accounts/page.tsx`
- `src/views/accounts/index.tsx`
- `src/views/accounts/CreateAccountDialog.tsx`
- `src/views/accounts/EditStatus.tsx`
- `src/views/accounts/TableFilter.tsx`
- `src/actions/accountActions.ts`
- `src/types/accountTypes.ts`

渠道枚举：

```ts
export const enum AccountChannel {
  QI_HU = 'qihu',
  BAIDU = 'baidu'
}
```

添加账户时：

- 选择 360：展示用户名、点睛 ID、UserId、secret、状态。
- 选择百度：只展示百度账户名和状态。

## 用户管理

相关文件：

- `src/app/[lang]/(dashboard)/(private)/users/page.tsx`
- `src/views/users/index.tsx`
- `src/views/users/CreateUserDialog.tsx`
- `src/views/users/ResetPasswordDialog.tsx`
- `src/views/users/AssignAccountsDialog.tsx`
- `src/views/users/DeleteUserDialog.tsx`
- `src/actions/userActions.ts`
- `src/types/userTypes.ts`

用户账户绑定不区分账户渠道，统一从后端拿可绑定账户。

## 线索中心

相关文件：

- `src/app/[lang]/(dashboard)/(private)/marketing-leads/page.tsx`
- `src/views/marketing-leads/index.tsx`
- `src/views/marketing-leads/TableFilter.tsx`
- `src/views/marketing-leads/ImportMarketingLeadsDialog.tsx`
- `src/views/marketing-leads/DeleteMarketingLeadDialog.tsx`
- `src/actions/marketingLeadActions.ts`
- `src/types/marketingLeadTypes.ts`

权限行为：

- admin 可导入、删除，并看到线索来源。
- viewer 只看线索数据。

线索导入使用 Excel 文件和账户 ID 列表。

## 新增功能清单

新增一个后台模块时，通常需要：

1. 在 api 项目新增迁移、模型、Request、Interactor、Controller、OutputData、路由。
2. 在 web 项目新增 `types`。
3. 新增 `actions`。
4. 新增 `src/views/<module>` 页面主体和弹窗。
5. 新增 `src/app/[lang]/(dashboard)/(private)/.../page.tsx` 服务端页面。
6. 修改 `src/data/navigation/verticalMenuData.tsx`。
7. 修改 `src/data/dictionaries/zh.json` 和 `src/data/dictionaries/en.json`。
8. 运行 `npx tsc --noEmit`。

## 代码风格约定

- 页面组件和弹窗沿用现有 MUI + react-hook-form 写法。
- 图标优先使用 Tabler icon class，例如 `tabler-plus`、`tabler-trash`。
- 接口字段在前端使用 camelCase。
- 后端枚举输出通常是 `{ label, value }`，前端类型使用 `Option<T>`。
- 不要把页面做成说明页，后台功能应直接展示可操作列表或表单。

## 注意事项

- `src/views/marketing-leads/ImportMarketingLeadsDialog.tsx` 当前可能存在未提交改动，修改前先看 diff，避免覆盖他人工作。
- 新增菜单权限时，优先参考 `verticalMenuData.tsx` 现有 `permissions` 过滤方式。
- 新增字典 key 时，必须同步 `zh.json` 和 `en.json`，否则 TypeScript 会报类型错误。
- 修改 API 返回结构时，要同步更新 `src/types`、列表表头和弹窗字段。
