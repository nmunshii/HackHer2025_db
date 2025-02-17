declare module 'exiftool-kit' {
    class ExifTool {
      constructor(pathToExifTool?: string);
      setBin(pathToExifTool: string): void;
      getTags(options: { source: string | string[] | Buffer }): Promise<any>;
      setTags(options: { source: string | Buffer, tags: Array<{ tag: string, value: string }> }): Promise<any>;
    }
    export = ExifTool;
  }
  