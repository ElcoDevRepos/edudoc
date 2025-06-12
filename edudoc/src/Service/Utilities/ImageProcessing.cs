using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;

namespace Service.Utilities
{
    [Obsolete("Used for older Breckenridge applications. Please use Service.Uitilities.IImagePricessingHelper")]
    public static class ImageProcessing
    {
        private static readonly HashSet<string> Extensions = new HashSet<string>
            { "jpg", "jpeg", "gif", "png", "tif", "tiff", "bmp" };

        /// <summary>
        ///     Writes the image bytes to disk.
        /// </summary>
        /// <param name="bytes"></param>
        /// <param name="path"></param>
        public static void WriteImageToFile(byte[] bytes, string path)
        {
            using (FileStream fs = File.Create(path))
            {
                fs.Write(bytes, 0, bytes.Length);
            }
        }

        public static void WriteImageToFile(Image img, string path)
        {
            img.Save(path);
        }

        public static string PrependImageFolder(string name)
        {
            return Path.Combine(AppSettingsBase.GetImageDirectory(), name);
        }

        /// <summary>
        ///     Resizes an image.
        ///     Make sure that if you're pulling the source image from a stream,
        ///     the stream remains open.
        /// </summary>
        /// <param name="img"></param>
        /// <param name="maxWidth"></param>
        /// <param name="maxHeight"></param>
        /// <returns></returns>
        public static byte[] ResizeImage(Image img, int maxWidth, int maxHeight = 0)
        {
            ScaleDimensionHelper s = GetScaleDimensions(img.Width, maxWidth, img.Height, maxHeight);
            Rectangle imgRect = CreateRectangleFromDimensions(s);
            Bitmap bmp = CreateBitmapFromDimensions(s.NewWidth, s.NewHeight);
            DrawResizeOntoBitmap(bmp, img, imgRect);
            byte[] imgBytes = GetImageBytes(bmp, img.RawFormat);
            return imgBytes;
        }

        public static byte[] ResizeImage(Stream img, int maxWidth, int maxHeight = 0)
        {
            using (Image i = Image.FromStream(img))
                return ResizeImage(i, maxWidth, maxHeight);
        }

        public static byte[] ResizeImage(byte[] img, int maxWidth, int maxHeight = 0)
        {
            using (MemoryStream ms = new MemoryStream(img))
                return ResizeImage(ms, maxWidth, maxHeight);
        }

        public static bool IsValidImageExt(string ext)
        {
            return Extensions.Contains(ext.ToLower());
        }

        /// <summary>
        ///     Rotates an image. Several overloads.
        /// </summary>
        /// <param name="img"></param>
        /// <param name="flipType"></param>
        /// <returns></returns>
        public static byte[] RotateImage(byte[] img, RotateFlipType flipType)
        {
            using (MemoryStream ms = new MemoryStream(img))
                return RotateImage(ms, flipType);
        }

        public static byte[] RotateImage(Stream img, RotateFlipType flipType)
        {
            using (Image i = Image.FromStream(img))
                return RotateImage(i, flipType);
        }

        public static byte[] RotateImage(string filePath, RotateFlipType flipType)
        {
            using (Image i = Image.FromFile(filePath))
                return RotateImage(i, flipType);
        }

        public static byte[] RotateImage(Image img, RotateFlipType flipType)
        {
            img.RotateFlip(flipType);
            return GetImageBytes(img, img.RawFormat);
        }

        /// <summary>
        ///     Crops the image to a centered square.
        ///     Make sure that if you're pulling the source image from a stream,
        ///     the stream remains open.
        /// </summary>
        /// <param name="img"></param>
        /// <returns></returns>
        public static byte[] CropImageToSquare(Image img)
        {
            CropDimensionHelper d = GetCropDimensions(img.Width, img.Height);
            Rectangle cropArea = CreateRectangleFromDimensions(d);
            Bitmap bmp = CreateBitmapFromDimensions(d.Smaller, d.Smaller);
            DrawSquareOntoBitmap(bmp, img, cropArea);
            byte[] squareBytes = GetImageBytes(bmp, img.RawFormat);
            return squareBytes;
        }

        public static byte[] CropImageToSquare(byte[] img)
        {
            using (MemoryStream s = new MemoryStream(img))
                return CropImageToSquare(s);
        }

        public static byte[] CropImageToSquare(MemoryStream s)
        {
            using (Image i = Image.FromStream(s))
                return CropImageToSquare(i);
        }

        /// <summary>
        ///     Writes an image to a memory stream and returns the bytes for convenience.
        /// </summary>
        /// <param name="img"></param>
        /// <param name="format"></param>
        /// <returns></returns>
        private static byte[] GetImageBytes(Image img, ImageFormat format)
        {
            using (MemoryStream s = new MemoryStream())
            {
                img.Save(s, format);
                return s.GetBuffer();
            }
        }

        /// <summary>
        ///     Writes an area of an image onto a bitmap.
        /// </summary>
        /// <param name="bmp"></param>
        /// <param name="img"></param>
        /// <param name="cropArea"></param>
        private static void DrawSquareOntoBitmap(Bitmap bmp, Image img, Rectangle cropArea)
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                SetGraphicsProps(g);
                g.DrawImage(img, 0, 0, cropArea, System.Drawing.GraphicsUnit.Pixel);
            }
        }

        /// <summary>
        ///     Writes an area of an image onto a bitmap.
        /// </summary>
        /// <param name="bmp"></param>
        /// <param name="img"></param>
        /// <param name="rec"></param>
        private static void DrawResizeOntoBitmap(Bitmap bmp, Image img, Rectangle rec)
        {
            using (Graphics g = Graphics.FromImage(bmp))
            {
                SetGraphicsProps(g);
                g.DrawImage(img, rec);
            }
        }

        /// <summary>
        ///     Sets graphics properties.
        /// </summary>
        /// <param name="g"></param>
        private static void SetGraphicsProps(Graphics g)
        {
            // image props
            g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.AntiAlias;
            g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
            g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
        }

        /// <summary>
        ///     Gets scaling dimensions.
        /// </summary>
        /// <param name="width"></param>
        /// <param name="maxWidth"></param>
        /// <param name="height"></param>
        /// <param name="maxHeight"></param>
        /// <returns></returns>
        private static ScaleDimensionHelper GetScaleDimensions(int width, int maxWidth, int height, int maxHeight)
        {
            ScaleDimensionHelper s = new ScaleDimensionHelper();

            // width
            if (width <= maxWidth)
            {
                s.NewWidth = width;
                s.NewHeight = height;
            }
            else
            {
                s.NewWidth = maxWidth;
                s.ScaleFactor = s.NewWidth / (double)width;
                s.NewHeight = (int)(height * s.ScaleFactor);
            }

            // height
            if (maxHeight <= 0 || s.NewHeight <= maxHeight) return s;
            s.ScaleFactor = maxHeight / (double)s.NewHeight;
            s.NewHeight = maxHeight;
            s.NewWidth = (int)(s.NewWidth * s.ScaleFactor);
            return s;
        }

        /// <summary>
        ///     Gets dimensions for our square.
        /// </summary>
        /// <param name="width"></param>
        /// <param name="height"></param>
        /// <returns></returns>
        private static CropDimensionHelper GetCropDimensions(int width, int height)
        {
            CropDimensionHelper d = new CropDimensionHelper();
            if (width < height)
            {
                d.WidthStart = 0;
                d.HeightStart = (height / 2) - (width / 2);
                d.Smaller = width;
            }
            else
            {
                d.HeightStart = 0;
                d.WidthStart = (width / 2) - (height / 2);
                d.Smaller = height;
            }

            return d;
        }

        /// <summary>
        ///     Creates a crop area from our dimensions.
        /// </summary>
        /// <param name="d"></param>
        /// <returns></returns>
        private static Rectangle CreateRectangleFromDimensions(CropDimensionHelper d)
        {
            Rectangle cropArea = new Rectangle(d.WidthStart, d.HeightStart, d.Smaller, d.Smaller);
            return cropArea;
        }

        private static Rectangle CreateRectangleFromDimensions(ScaleDimensionHelper s)
        {
            Rectangle area = new Rectangle(0, 0, s.NewWidth, s.NewHeight);
            return area;
        }

        /// <summary>
        ///     Creates a bitmap from dimensions.
        /// </summary>
        /// <param name="w"></param>
        /// <param name="h"></param>
        /// <returns></returns>
        private static Bitmap CreateBitmapFromDimensions(int w, int h)
        {
            Bitmap bmp = new Bitmap(w, h);
            return bmp;
        }

        /// <summary>
        ///     Helper class to hold square's dimensions.
        /// </summary>
        public class CropDimensionHelper
        {
            public int WidthStart { get; set; }
            public int HeightStart { get; set; }
            public int Smaller { get; set; }
        }

        /// <summary>
        ///     Helper class to hold scaling dimensions.
        /// </summary>
        public class ScaleDimensionHelper
        {
            public int NewWidth { get; set; }
            public int NewHeight { get; set; }
            public double ScaleFactor { get; set; }
        }
    }
}
