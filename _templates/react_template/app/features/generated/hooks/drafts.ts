import { api } from "@application/api/rtk/instances/drafts";
const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    draftsList: build.query<DraftsListApiResponse, DraftsListApiArg>({
      query: () => ({ url: `/api/v2/drafts` }),
    }),
    draftsCreate: build.mutation<DraftsCreateApiResponse, DraftsCreateApiArg>({
      query: (queryArg) => ({
        url: `/api/v2/drafts`,
        method: "POST",
        body: queryArg.draftCreateRequestDto,
      }),
    }),
    draftsGet: build.query<DraftsGetApiResponse, DraftsGetApiArg>({
      query: (queryArg) => ({ url: `/api/v2/drafts/${queryArg.draftId}` }),
    }),
    draftsDelete: build.mutation<DraftsDeleteApiResponse, DraftsDeleteApiArg>({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}`,
        method: "DELETE",
        params: {
          purge: queryArg.purge,
        },
      }),
    }),
    draftsPatch: build.mutation<DraftsPatchApiResponse, DraftsPatchApiArg>({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}`,
        method: "PATCH",
        body: queryArg.draftPatchRequestDto,
      }),
    }),
    modulesCreate: build.mutation<
      ModulesCreateApiResponse,
      ModulesCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}/modules`,
        method: "POST",
        body: queryArg.moduleCreateRequestDto,
      }),
    }),
    modulesReorder: build.mutation<
      ModulesReorderApiResponse,
      ModulesReorderApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}/modules/reorder`,
        method: "POST",
        body: queryArg.moduleReorderRequestDto,
      }),
    }),
    modulesRestore: build.mutation<
      ModulesRestoreApiResponse,
      ModulesRestoreApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}/modules/restore`,
        method: "POST",
        body: queryArg.moduleRestoreRequestDto,
      }),
    }),
    modulesDelete: build.mutation<
      ModulesDeleteApiResponse,
      ModulesDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}/modules/${queryArg.moduleId}`,
        method: "DELETE",
        params: {
          purge: queryArg.purge,
        },
      }),
    }),
    modulesPatch: build.mutation<ModulesPatchApiResponse, ModulesPatchApiArg>({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}/modules/${queryArg.moduleId}`,
        method: "PATCH",
        body: queryArg.modulePatchRequestDto,
      }),
    }),
    socketsCreate: build.mutation<
      SocketsCreateApiResponse,
      SocketsCreateApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}/modules/${queryArg.moduleId}/sockets`,
        method: "POST",
        body: queryArg.socketCreateRequestDto,
      }),
    }),
    socketsReorder: build.mutation<
      SocketsReorderApiResponse,
      SocketsReorderApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}/modules/${queryArg.moduleId}/sockets/reorder`,
        method: "POST",
        body: queryArg.socketReorderRequestDto,
      }),
    }),
    socketsRestore: build.mutation<
      SocketsRestoreApiResponse,
      SocketsRestoreApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}/modules/${queryArg.moduleId}/sockets/restore`,
        method: "POST",
        body: queryArg.socketRestoreRequestDto,
      }),
    }),
    socketsDelete: build.mutation<
      SocketsDeleteApiResponse,
      SocketsDeleteApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}/modules/${queryArg.moduleId}/sockets/${queryArg.socketId}`,
        method: "DELETE",
      }),
    }),
    socketsPatch: build.mutation<SocketsPatchApiResponse, SocketsPatchApiArg>({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}/modules/${queryArg.moduleId}/sockets/${queryArg.socketId}`,
        method: "PATCH",
        body: queryArg.socketPatchRequestDto,
      }),
    }),
    draftsRestore: build.mutation<
      DraftsRestoreApiResponse,
      DraftsRestoreApiArg
    >({
      query: (queryArg) => ({
        url: `/api/v2/drafts/${queryArg.draftId}/restore`,
        method: "POST",
      }),
    }),
  }),
  overrideExisting: false,
});
export { injectedRtkApi as enhancedApi };
export type DraftsListApiResponse = /** status 200 OK */ DraftListResponseDto;
export type DraftsListApiArg = void;
export type DraftsCreateApiResponse =
  /** status 201 Created */ DraftCreateResponseDto;
export type DraftsCreateApiArg = {
  /** Параметры создания */
  draftCreateRequestDto: DraftCreateRequestDto;
};
export type DraftsGetApiResponse = /** status 200 OK */ DraftByIdResponseDto;
export type DraftsGetApiArg = {
  /** ID черновика */
  draftId: string;
};
export type DraftsDeleteApiResponse =
  /** status 200 OK */ DraftDeleteResponseDto;
export type DraftsDeleteApiArg = {
  /** ID черновика */
  draftId: string;
  /** True — удалить без возможности восстановления */
  purge?: boolean;
};
export type DraftsPatchApiResponse = /** status 200 OK */ DraftPatchResponseDto;
export type DraftsPatchApiArg = {
  /** ID черновика */
  draftId: string;
  /** Изменяемые поля */
  draftPatchRequestDto: DraftPatchRequestDto;
};
export type ModulesCreateApiResponse =
  /** status 201 Created */ ModuleCreateResponseDto;
export type ModulesCreateApiArg = {
  /** ID черновика */
  draftId: string;
  /** Описание модуля */
  moduleCreateRequestDto: ModuleCreateRequestDto;
};
export type ModulesReorderApiResponse =
  /** status 200 OK */ ModuleReorderResponseDto;
export type ModulesReorderApiArg = {
  /** ID черновика */
  draftId: string;
  /** Порядок модулей */
  moduleReorderRequestDto: ModuleReorderRequestDto;
};
export type ModulesRestoreApiResponse =
  /** status 201 Created */ ModuleRestoreResponseDto;
export type ModulesRestoreApiArg = {
  /** ID черновика */
  draftId: string;
  /** Модуль для восстановления */
  moduleRestoreRequestDto: ModuleRestoreRequestDto;
};
export type ModulesDeleteApiResponse =
  /** status 200 OK */ ModuleDeleteResponseDto;
export type ModulesDeleteApiArg = {
  /** ID черновика */
  draftId: string;
  /** ID модуля */
  moduleId: string;
  /** True — удалить без возможности восстановления */
  purge?: boolean;
};
export type ModulesPatchApiResponse =
  /** status 200 OK */ ModulePatchResponseDto;
export type ModulesPatchApiArg = {
  /** ID черновика */
  draftId: string;
  /** ID модуля */
  moduleId: string;
  /** Изменяемые поля */
  modulePatchRequestDto: ModulePatchRequestDto;
};
export type SocketsCreateApiResponse =
  /** status 201 Created */ SocketCreateResponseDto;
export type SocketsCreateApiArg = {
  /** ID черновика */
  draftId: string;
  /** ID модуля */
  moduleId: string;
  /** Описание сокета */
  socketCreateRequestDto: SocketCreateRequestDto;
};
export type SocketsReorderApiResponse =
  /** status 200 OK */ SocketReorderResponseDto;
export type SocketsReorderApiArg = {
  /** ID черновика */
  draftId: string;
  /** ID модуля */
  moduleId: string;
  /** Порядок сокетов */
  socketReorderRequestDto: SocketReorderRequestDto;
};
export type SocketsRestoreApiResponse =
  /** status 201 Created */ SocketRestoreResponseDto;
export type SocketsRestoreApiArg = {
  /** ID черновика */
  draftId: string;
  /** ID модуля */
  moduleId: string;
  /** Сокет */
  socketRestoreRequestDto: SocketRestoreRequestDto;
};
export type SocketsDeleteApiResponse =
  /** status 200 OK */ SocketDeleteResponseDto;
export type SocketsDeleteApiArg = {
  /** ID черновика */
  draftId: string;
  /** ID модуля */
  moduleId: string;
  /** ID сокета */
  socketId: string;
};
export type SocketsPatchApiResponse =
  /** status 200 OK */ SocketPatchResponseDto;
export type SocketsPatchApiArg = {
  /** ID черновика */
  draftId: string;
  /** ID модуля */
  moduleId: string;
  /** ID сокета */
  socketId: string;
  /** Изменяемые поля */
  socketPatchRequestDto: SocketPatchRequestDto;
};
export type DraftsRestoreApiResponse =
  /** status 200 OK */ DraftByIdResponseDto;
export type DraftsRestoreApiArg = {
  /** ID черновика */
  draftId: string;
};
export type DraftSummaryDto = {
  id?: string;
  lastUpdated?: string;
  status?: string;
  title?: string;
};
export type DraftListResponseDto = {
  active?: DraftSummaryDto[];
  deleted?: DraftSummaryDto[];
  published?: DraftSummaryDto[];
};
export type ErrorResponse = {
  error?: string;
};
export type ClassName = {
  id?: string;
  value?: string;
};
export type ModuleMeta = {
  accentColor?: string;
  backgroundColor?: string;
  fontColor?: string;
};
export type BeforeAfterSide = {
  className?: ClassName[];
  lineNumber?: number;
  text?: string;
};
export type BeforeAfter = {
  after?: BeforeAfterSide;
  before?: BeforeAfterSide;
  className?: ClassName[];
};
export type FileAsset = {
  className?: ClassName[];
  id?: string;
  key?: string;
  mime?: string;
  name?: string;
  order?: number;
  size?: number;
};
export type ImageAsset = {
  alt?: string;
  className?: ClassName[];
  id?: string;
  order?: number;
  src?: string;
};
export type TableColumn = {
  className?: ClassName[];
  id?: string;
  order?: number;
  title?: string;
};
export type TableCell = {
  columnId?: string;
  order?: number;
  text?: string;
};
export type TableRow = {
  cells?: TableCell[];
  className?: ClassName[];
  id?: string;
  order?: number;
};
export type SocketTable = {
  className?: ClassName[];
  columns?: TableColumn[];
  rows?: TableRow[];
};
export type TextHighlight = {
  socket?: Socket;
  value?: string;
};
export type SocketText = {
  className?: ClassName[];
  content?: string;
  highlight?: TextHighlight;
  id?: string;
  order?: number;
};
export type SocketValue = {
  beforeAfter?: BeforeAfter;
  files?: FileAsset[];
  images?: ImageAsset[];
  table?: SocketTable;
  text?: SocketText[];
};
export type SocketProps = {
  className?: ClassName[];
  value?: SocketValue;
};
export type Socket = {
  className?: ClassName[];
  component?: string;
  id?: string;
  order?: number;
  pattern?: string[][];
  props?: SocketProps;
  type?: string;
};
export type Tag = {
  id?: string;
  variantId?: string;
};
export type Module = {
  className?: ClassName[];
  deletedAt?: string;
  id?: string;
  meta?: ModuleMeta;
  order?: number;
  pattern?: string[][];
  restoreBefore?: string;
  sockets?: Socket[];
  status?: string;
  tags?: Tag[];
};
export type DraftData = {
  author_id?: string;
  className?: ClassName[];
  draft_id?: string;
  modules?: Module[];
  tags?: Tag[];
  title?: string;
};
export type DraftCreateResponseDto = {
  createdAt?: string;
  data?: DraftData;
  id?: string;
  lastUpdated?: string;
  status?: string;
  version?: number;
};
export type ClassNameDto = {
  id?: string;
  value?: string;
};
export type TagDto = {
  id?: string;
  variantId?: string;
};
export type DraftCreateRequestDto = {
  className?: ClassNameDto[];
  tags?: TagDto[];
  title?: string;
};
export type DraftByIdResponseDto = {
  createdAt?: string;
  data?: DraftData;
  id?: string;
  lastUpdated?: string;
  status?: string;
  version?: number;
};
export type DraftDeleteResponseDto = {
  id?: string;
  status?: string;
};
export type DraftPatchResponseDto = {
  createdAt?: string;
  data?: DraftData;
  id?: string;
  lastUpdated?: string;
  status?: string;
  version?: number;
};
export type DraftPatchRequestDto = {
  className?: ClassNameDto[];
  tags?: TagDto[];
  title?: string;
};
export type ModuleMetaDto = {
  accentColor?: string;
  backgroundColor?: string;
  fontColor?: string;
};
export type BeforeAfterSideDto = {
  className?: ClassNameDto[];
  lineNumber?: number;
  text?: string;
};
export type BeforeAfterDto = {
  after?: BeforeAfterSideDto;
  before?: BeforeAfterSideDto;
  className?: ClassNameDto[];
};
export type FileDto = {
  className?: ClassNameDto[];
  id?: string;
  key?: string;
  mime?: string;
  name?: string;
  order?: number;
  size?: number;
};
export type ImageDto = {
  alt?: string;
  className?: ClassNameDto[];
  id?: string;
  order?: number;
  src?: string;
};
export type TableColumnDto = {
  className?: ClassNameDto[];
  id?: string;
  order?: number;
  title?: string;
};
export type TableCellDto = {
  columnId?: string;
  order?: number;
  text?: string;
};
export type TableRowDto = {
  cells?: TableCellDto[];
  className?: ClassNameDto[];
  id?: string;
  order?: number;
};
export type TableDto = {
  className?: ClassNameDto[];
  columns?: TableColumnDto[];
  rows?: TableRowDto[];
};
export type SocketRequestDto = {
  className?: ClassNameDto[];
  component?: string;
  id?: string;
  pattern?: string[][];
  props?: SocketPropsDto;
  type?: string;
};
export type TextHighlightDto = {
  socket?: SocketRequestDto;
  value?: string;
};
export type SocketTextDto = {
  className?: ClassNameDto[];
  content?: string;
  highlight?: TextHighlightDto;
  id?: string;
  order?: number;
};
export type SocketValueDto = {
  beforeAfter?: BeforeAfterDto;
  files?: FileDto[];
  images?: ImageDto[];
  table?: TableDto;
  text?: SocketTextDto[];
};
export type SocketPropsDto = {
  className?: ClassNameDto[];
  value?: SocketValueDto;
};
export type SocketResponseDto = {
  className?: ClassNameDto[];
  component?: string;
  id?: string;
  moduleId?: string;
  order?: number;
  pattern?: string[][];
  props?: SocketPropsDto;
  type?: string;
};
export type ModuleCreateResponseDto = {
  className?: ClassNameDto[];
  deletedAt?: string;
  id?: string;
  meta?: ModuleMetaDto;
  order?: number;
  pattern?: string[][];
  restoreBefore?: string;
  sockets?: SocketResponseDto[];
  status?: string;
  tags?: TagDto[];
};
export type ModuleCreateRequestDto = {
  className?: ClassNameDto[];
  id?: string;
  meta?: ModuleMetaDto;
  pattern?: string[][];
  sockets?: SocketRequestDto[];
  tags?: TagDto[];
};
export type ModuleResponseDto = {
  className?: ClassNameDto[];
  deletedAt?: string;
  id?: string;
  meta?: ModuleMetaDto;
  order?: number;
  pattern?: string[][];
  restoreBefore?: string;
  sockets?: SocketResponseDto[];
  status?: string;
  tags?: TagDto[];
};
export type ModuleReorderResponseDto = {
  modules?: ModuleResponseDto[];
};
export type ModuleReorderRequestDto = {
  moduleIds?: string[];
};
export type ModuleRestoreResponseDto = {
  className?: ClassNameDto[];
  deletedAt?: string;
  id?: string;
  meta?: ModuleMetaDto;
  order?: number;
  pattern?: string[][];
  restoreBefore?: string;
  sockets?: SocketResponseDto[];
  status?: string;
  tags?: TagDto[];
};
export type ModuleRestoreRequestDto = {
  className?: ClassNameDto[];
  id?: string;
  meta?: ModuleMetaDto;
  pattern?: string[][];
  sockets?: SocketRequestDto[];
  tags?: TagDto[];
};
export type ModuleDeleteResponseDto = {
  module?: ModuleResponseDto;
};
export type ModulePatchResponseDto = {
  className?: ClassNameDto[];
  deletedAt?: string;
  id?: string;
  meta?: ModuleMetaDto;
  order?: number;
  pattern?: string[][];
  restoreBefore?: string;
  sockets?: SocketResponseDto[];
  status?: string;
  tags?: TagDto[];
};
export type ModulePatchRequestDto = {
  className?: ClassNameDto[];
  meta?: ModuleMetaDto;
  pattern?: string[][];
  sockets?: SocketRequestDto[];
  tags?: TagDto[];
};
export type SocketCreateResponseDto = {
  className?: ClassNameDto[];
  component?: string;
  id?: string;
  moduleId?: string;
  order?: number;
  pattern?: string[][];
  props?: SocketPropsDto;
  type?: string;
};
export type SocketCreateRequestDto = {
  className?: ClassNameDto[];
  component?: string;
  id?: string;
  pattern?: string[][];
  props?: SocketPropsDto;
  type?: string;
};
export type SocketReorderResponseDto = {
  sockets?: SocketResponseDto[];
};
export type SocketReorderRequestDto = {
  socketIds?: string[];
};
export type SocketRestoreResponseDto = {
  className?: ClassNameDto[];
  component?: string;
  id?: string;
  moduleId?: string;
  order?: number;
  pattern?: string[][];
  props?: SocketPropsDto;
  type?: string;
};
export type SocketRestoreRequestDto = {
  className?: ClassNameDto[];
  component?: string;
  id?: string;
  pattern?: string[][];
  props?: SocketPropsDto;
  type?: string;
};
export type SocketDeleteResponseDto = {
  socket?: SocketResponseDto;
};
export type SocketPatchResponseDto = {
  className?: ClassNameDto[];
  component?: string;
  id?: string;
  moduleId?: string;
  order?: number;
  pattern?: string[][];
  props?: SocketPropsDto;
  type?: string;
};
export type SocketPatchRequestDto = {
  className?: ClassNameDto[];
  component?: string;
  pattern?: string[][];
  props?: SocketPropsDto;
  type?: string;
};
export const {
  useDraftsListQuery,
  useLazyDraftsListQuery,
  useDraftsCreateMutation,
  useDraftsGetQuery,
  useLazyDraftsGetQuery,
  useDraftsDeleteMutation,
  useDraftsPatchMutation,
  useModulesCreateMutation,
  useModulesReorderMutation,
  useModulesRestoreMutation,
  useModulesDeleteMutation,
  useModulesPatchMutation,
  useSocketsCreateMutation,
  useSocketsReorderMutation,
  useSocketsRestoreMutation,
  useSocketsDeleteMutation,
  useSocketsPatchMutation,
  useDraftsRestoreMutation,
} = injectedRtkApi;
