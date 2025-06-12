using Model.Partials.Interfaces;


namespace Service.Utilities
{
    public interface IDocumentUtilityService
    {
        T GenerateDocumentRecord<T>(string fileName, int uploadedBy) where T : class, IBaseDocument, new();
        byte[] GetDocumentBytes(string filePath);
        byte[] GetDocumentBytes<T>(T document) where T : class, IBaseDocument;
    }
}
