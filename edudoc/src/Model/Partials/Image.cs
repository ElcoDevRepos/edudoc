using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model
{
    public partial class Image
    {
        /// <summary>
        ///     Creates a shallow copy of the image.
        /// </summary>
        /// <returns></returns>
        public Image ShallowCopy()
        {
            return (Image)this.MemberwiseClone();
        }
    }
}