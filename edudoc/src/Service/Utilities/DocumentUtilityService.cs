using Service.Core.Utilities;
using Service.Core.Utilities;
using FluentValidation;
using Model.Partials.Interfaces;
using System;
using System.IO;
using System.Linq;

namespace Service.Utilities
{
    public class DocumentUtilityService : IDocumentUtilityService
    {
        private readonly IDocumentHelper _documentHelper;
        public DocumentUtilityService(IDocumentHelper documentHelper)
        {
            _documentHelper = documentHelper;
        }

        public T GenerateDocumentRecord<T>(string fileName, int uploadedBy) where T : class, IBaseDocument, new()
        {
            var ext = fileName.Split('.').Last();
            ext = _documentHelper.CheckExtensionDot(ext);
            T document = new T
            {
                Name = fileName,
                FilePath = _documentHelper.CreateDocFileBaseName() + ext,
                UploadedBy = uploadedBy,
                DateUpload = DateTime.UtcNow
            };
            return document;
        }
        public byte[] GetDocumentBytes(string filePath)
        {
            var absolutePath = _documentHelper.PrependDocsPath(filePath);
            return File.ReadAllBytes(absolutePath);
        }
        public byte[] GetDocumentBytes<T>(T document) where T : class, IBaseDocument
        {
            if (document == null)
            {
                Console.WriteLine("No document passed");
                return null;
            }
            try
            {
                var absolutePath = _documentHelper.PrependDocsPath(document.FilePath);
                return File.ReadAllBytes(absolutePath);
            }
            catch(Exception ex)
            {
                Console.WriteLine(ex.Message);
                return null;
            }
        }

    }

    internal class DocumentHelperValidator : AbstractValidator<IBaseDocument>
    {
        public DocumentHelperValidator(IDocumentHelper documentHelper)
        {
            RuleFor(d => d.Name).NotEmpty().Length(0, 200).Must(documentHelper.HaveAValidDocExtension);
            RuleFor(d => d.FilePath).NotEmpty().Length(0, 200);
            RuleFor(d => d.UploadedBy).NotEmpty().GreaterThan(0);
            RuleFor(d => d.DateUpload).NotEmpty();
        }
    }
}
