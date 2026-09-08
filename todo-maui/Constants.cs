namespace ToDo;

public static class Constants
{
    public const string DatabaseFilename = "TodoSQLite.db3";
    public const SQLite.SQLiteOpenFlags Flags = SQLite.SQLiteOpenFlags.Create | SQLite.SQLiteOpenFlags.ReadWrite | SQLite.SQLiteOpenFlags.SharedCache;  // open the database in read/write mode, create it if it doesn't exist, and enable multi-threaded database access

    public static string DatabasePath =>
        Path.Combine(FileSystem.AppDataDirectory, DatabaseFilename);
}