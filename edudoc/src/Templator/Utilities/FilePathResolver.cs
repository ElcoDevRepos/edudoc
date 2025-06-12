using System;
using System.Collections.Generic;
using System.IO;

namespace Templator.Utilities
{
    public class FilePathResolver
    {
        private readonly IEnumerable<string> _layoutRoots;
        private readonly bool _recursive;

        public FilePathResolver(IEnumerable<string> layoutRoots, bool recursive = false)
        {
            _layoutRoots = layoutRoots;
            _recursive = recursive;
        }

        /// <summary>
        /// Attempts to resolve the full file path using the root folders.
        /// </summary>
        /// <param name="name">The name of the file to resolve.</param>
        /// <returns>The full file path.</returns>
        /// <exception cref="InvalidOperationException"></exception>
        public string Resolve(string name)
        {
            // check full file path first
            if (File.Exists(name))
            {
                return name;
            }

            // check the directories listed as roots
            foreach (var root in _layoutRoots)
            {
                string filePath = ResolveFileInDir(root, name);
                if (!string.IsNullOrWhiteSpace(filePath))
                {
                    return filePath;
                }
            }

            throw new InvalidOperationException($"Could not resolve file {name}");
        }

        /// <summary>
        /// Looks to resolve a file path in a specific directory 
        /// (and subdirectories if this instance is marked as recursive).
        /// </summary>
        /// <param name="dir">The folder to look in.</param>
        /// <param name="name">The name or file path.</param>
        /// <returns>The full file path that was resolved or null if it could not be resolved</returns>
        private string ResolveFileInDir(string dir, string name)
        {
            string filePath = Path.Combine(dir, name);

            if (File.Exists(filePath))
            {
                return filePath;
            }

            if (_recursive)
            {
                foreach (string subDir in Directory.GetDirectories(dir))
                {
                    filePath = ResolveFileInDir(subDir, name);
                    if (!string.IsNullOrWhiteSpace(filePath))
                    {
                        return filePath;
                    }
                }
            }

            return null;
        }
    }
}
