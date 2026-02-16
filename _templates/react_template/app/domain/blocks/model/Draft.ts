import type {
  BeforeAfter,
  BeforeAfterSide,
  ClassName,
  DraftByIdResponseDto,
  DraftData,
  DraftSummaryDto,
  FileAsset,
  ImageAsset,
  Module,
  ModuleMeta,
  Socket,
  SocketProps,
  SocketTable,
  SocketText,
  SocketValue,
  TableCell,
  TableColumn,
  TableRow,
  Tag,
  TextHighlight,
} from '@generated/hooks/drafts'

export type DraftDomainModelType = DraftByIdResponseDto
export type DraftContentType = DraftData

export type DraftIdType = NonNullable<DraftDomainModelType['id']>
export type DraftModuleIdType = NonNullable<Module['id']>
export type DraftModuleSocketIdType = NonNullable<Socket['id']>

export type DraftStatusType =
  | DraftDomainModelType['status']
  | DraftSummaryDto['status']

export type DraftTagType = Tag
export type DraftClassNameEntryType = ClassName

export type DraftModulePatternMarkType = Nullable<DraftModuleSocketIdType>
export type DraftModulePatternRowType = DraftModulePatternMarkType[]
export type DraftModulePatternMatrixType = DraftModulePatternRowType[]
export type DraftModuleSocketPatternMatrixType = DraftModulePatternMatrixType

export type DraftModuleSocketTypeType = Socket['type']

export type DraftModuleMetaType = ModuleMeta
export type DraftModuleSocketHighlightType = TextHighlight
export type DraftModuleSocketTextType = SocketText
export type DraftModuleSocketImageType = ImageAsset
export type DraftModuleSocketFileType = FileAsset
export type DraftModuleSocketTableCellType = TableCell
export type DraftModuleSocketTableColumnType = TableColumn
export type DraftModuleSocketTableRowType = TableRow
export type DraftModuleSocketTableType = SocketTable
export type DraftModuleSocketBeforeAfterSideType = BeforeAfterSide
export type DraftModuleSocketBeforeAfterType = BeforeAfter
export type DraftModuleSocketValueType = SocketValue
export type DraftModuleSocketPropsType = SocketProps

export type DraftModuleSocketType = Omit<Socket, 'pattern'> & {
  pattern?: DraftModuleSocketPatternMatrixType
}

export type DraftModuleType = Omit<Module, 'pattern' | 'sockets'> & {
  pattern?: DraftModulePatternMatrixType
  sockets?: DraftModuleSocketType[]
}
