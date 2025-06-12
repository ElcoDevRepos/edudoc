using Model;

namespace Service.Base
{
    public class CRUDService : CRUDBaseService, ICRUDService
    {
        public CRUDService(IPrimaryContext context, IValidationService validationService)
    : base(context, validationService)
        { }


    }
}
