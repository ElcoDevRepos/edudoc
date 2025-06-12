

using BreckServiceBase.Utilities.Interfaces;
using Model;
using Service.Base;
using System.Linq;
namespace Service.Admin.Impersonation
{
    public class ImpersonationLogService : CRUDBaseService, IImpersonationLogService
    {
        internal readonly IPrimaryContext _context;
        public ImpersonationLogService(IPrimaryContext context, IEmailHelper emailHelper)
            : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
        }

        public ImpersonationLog GetByAuthTokenId(int AuthTokenId)
        {
            return _context.ImpersonationLogs.SingleOrDefault(x => x.AuthTokenId == AuthTokenId);
        }
    }
}
