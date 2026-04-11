export type OpfsEntryType = {
  name: string
  kind: 'file' | 'directory'
}

type DirectoryEntriesIterableType = FileSystemDirectoryHandle & {
  entries: () => AsyncIterable<[string, FileSystemHandle]>
}

export class OpfsStorage {
  private rootPromise: Promise<FileSystemDirectoryHandle> | null = null
  private readonly baseDir: string

  constructor(baseDir = '') {
    this.baseDir = this.normalizePath(baseDir)
  }

  public static isSupported(): boolean {
    return (
      typeof navigator !== 'undefined' &&
      !!navigator.storage &&
      typeof navigator.storage.getDirectory === 'function'
    )
  }

  public async init(): Promise<void> {
    await this.getRoot()
  }

  public async exists(path = ''): Promise<boolean> {
    try {
      await this.getHandle(path, false)

      return true
    } catch {
      return false
    }
  }

  public async mkdir(path: string): Promise<FileSystemDirectoryHandle> {
    return this.getDirectoryHandle(path, true)
  }

  public async list(path = ''): Promise<OpfsEntryType[]> {
    const dir = await this.getDirectoryHandle(path, false)
    const iterableDirectory = dir as DirectoryEntriesIterableType
    const items: OpfsEntryType[] = []

    for await (const [name, handle] of iterableDirectory.entries()) {
      items.push({
        name,
        kind: handle.kind,
      })
    }

    items.sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind === 'directory' ? -1 : 1
      }

      return a.name.localeCompare(b.name)
    })

    return items
  }

  public async readFile(path: string): Promise<File> {
    const handle = await this.getFileHandle(path, false)

    return handle.getFile()
  }

  public async readBlob(path: string): Promise<Blob> {
    return this.readFile(path)
  }

  public async readText(path: string): Promise<string> {
    const file = await this.readFile(path)

    return file.text()
  }

  public async readJSON<T>(path: string): Promise<T> {
    const text = await this.readText(path)

    return JSON.parse(text) as T
  }

  public async write(
    path: string,
    data: Blob | BufferSource | string,
    options?: { shouldCreateDirectories?: boolean },
  ): Promise<void> {
    const shouldCreateDirectories = options?.shouldCreateDirectories ?? true
    const handle = await this.getFileHandle(path, shouldCreateDirectories)
    const writable = await handle.createWritable()

    try {
      await writable.write(data)
    } finally {
      await writable.close()
    }
  }

  public async writeText(
    path: string,
    text: string,
    options?: { shouldCreateDirectories?: boolean },
  ): Promise<void> {
    await this.write(path, text, options)
  }

  public async writeJSON(
    path: string,
    value: unknown,
    options?: { shouldCreateDirectories?: boolean; space?: number },
  ): Promise<void> {
    const space = options?.space ?? 0
    const json = JSON.stringify(value, null, space)
    await this.write(path, json, {
      shouldCreateDirectories: options?.shouldCreateDirectories,
    })
  }

  public async delete(path: string, recursive = false): Promise<void> {
    const fullPath = this.resolvePath(path)
    const parts = this.splitPath(fullPath)

    if (parts.length === 0) {
      throw new Error('Cannot delete OPFS root')
    }

    const name = parts[parts.length - 1]
    const parentPath = parts.slice(0, -1).join('/')
    const parent = await this.getDirectoryHandleAbsolute(parentPath, false)

    await parent.removeEntry(name, { recursive })
  }

  public async getObjectURL(path: string): Promise<{
    url: string
    revoke: () => void
  }> {
    const file = await this.readFile(path)
    const url = URL.createObjectURL(file)

    return {
      url,
      revoke: () => URL.revokeObjectURL(url),
    }
  }

  public async getSize(path: string): Promise<number> {
    const file = await this.readFile(path)

    return file.size
  }

  public async rename(fromPath: string, toPath: string): Promise<void> {
    const file = await this.readFile(fromPath)
    await this.write(toPath, file, { shouldCreateDirectories: true })
    await this.delete(fromPath)
  }

  public async copy(fromPath: string, toPath: string): Promise<void> {
    const file = await this.readFile(fromPath)
    await this.write(toPath, file, { shouldCreateDirectories: true })
  }

  private async getRoot(): Promise<FileSystemDirectoryHandle> {
    if (!OpfsStorage.isSupported()) {
      throw new Error('OPFS is not supported in this browser')
    }

    if (!this.rootPromise) {
      this.rootPromise = navigator.storage.getDirectory()
    }

    return this.rootPromise
  }

  private async getHandle(
    path: string,
    create: boolean,
  ): Promise<FileSystemHandle> {
    const fullPath = this.resolvePath(path)
    const parts = this.splitPath(fullPath)

    if (parts.length === 0) {
      return this.getRoot()
    }

    let current = await this.getRoot()

    for (let index = 0; index < parts.length; index += 1) {
      const part = parts[index]
      const isLast = index === parts.length - 1

      if (isLast) {
        try {
          return await current.getFileHandle(part, { create })
        } catch (error) {
          if (this.isTypeMismatchError(error)) {
            return current.getDirectoryHandle(part, { create })
          }

          throw error
        }
      }

      current = await current.getDirectoryHandle(part, { create })
    }

    return current
  }

  private async getFileHandle(
    path: string,
    create: boolean,
  ): Promise<FileSystemFileHandle> {
    const fullPath = this.resolvePath(path)
    const parts = this.splitPath(fullPath)

    if (parts.length === 0) {
      throw new Error('File path is empty')
    }

    const fileName = parts[parts.length - 1]
    const directoryPath = parts.slice(0, -1).join('/')
    const directoryHandle = await this.getDirectoryHandleAbsolute(
      directoryPath,
      create,
    )

    return directoryHandle.getFileHandle(fileName, { create })
  }

  private async getDirectoryHandle(
    path: string,
    create: boolean,
  ): Promise<FileSystemDirectoryHandle> {
    const fullPath = this.resolvePath(path)

    return this.getDirectoryHandleAbsolute(fullPath, create)
  }

  private async getDirectoryHandleAbsolute(
    fullPath: string,
    create: boolean,
  ): Promise<FileSystemDirectoryHandle> {
    const parts = this.splitPath(fullPath)
    let current = await this.getRoot()

    for (const part of parts) {
      current = await current.getDirectoryHandle(part, { create })
    }

    return current
  }

  private resolvePath(path: string): string {
    const normalized = this.normalizePath(path)

    if (!this.baseDir) {
      return normalized
    }

    if (!normalized) {
      return this.baseDir
    }

    return `${this.baseDir}/${normalized}`
  }

  private normalizePath(path: string): string {
    return path
      .replace(/\\/g, '/')
      .split('/')
      .map(part => part.trim())
      .filter(part => part.length > 0 && part !== '.')
      .reduce<string[]>((accumulator, part) => {
        if (part === '..') {
          accumulator.pop()

          return accumulator
        }

        accumulator.push(part)

        return accumulator
      }, [])
      .join('/')
  }

  private splitPath(path: string): string[] {
    if (!path) {
      return []
    }

    return path.split('/').filter(Boolean)
  }

  private isTypeMismatchError(error: unknown): boolean {
    return error instanceof DOMException && error.name === 'TypeMismatchError'
  }
}
