namespace Service.Utilities
{
    /// <summary>
    ///     This is a fake class that we can instantiate.
    ///     It's sole purpose in life is to trick Owin into loading
    ///     the Service assembly before attempting to resolve dependencies.
    ///     This really only matters for self-hosting.
    /// </summary>
    public class Loader
    {
    }
}