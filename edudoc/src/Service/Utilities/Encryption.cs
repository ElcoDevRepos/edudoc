using System.Linq;
using System.Security.Cryptography;
using System.Text;

namespace Service.Utilities
{
    public static class Encryption
    {
        public static byte[] GetSalt(int size = 64)
        {
            var rng = new RNGCryptoServiceProvider();
            var salt = new byte[size];
            rng.GetBytes(salt);
            return salt;
        }

        public static byte[] HashSha512(string str)
        {
            var bytes = Encoding.UTF8.GetBytes(str);
            return HashSha512(bytes);
        }

        public static byte[] HashSha512(byte[] bytes)
        {
            var sha = SHA512.Create();
            return sha.ComputeHash(bytes);
        }

        public static byte[] GetSaltedHash(byte[] hash, byte[] salt)
        {
            var totalBytes = salt.Concat(hash).ToArray();
            var saltedHash = HashSha512(totalBytes);
            return saltedHash;
        }
    }

    public class SaltedHashGenerator
    {
        public byte[] Hash;
        public string Key;
        public byte[] Salt;
        public byte[] SaltedHash;

        public SaltedHashGenerator(string keyToHash)
        {
            Key = keyToHash;
            Salt = Encryption.GetSalt();
            Hash = Encryption.HashSha512(Key);
            SaltedHash = Encryption.GetSaltedHash(Hash, Salt);
        }
    }

}