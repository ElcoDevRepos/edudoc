

using Model;

namespace Service.Admin.Impersonation
{
    public interface IImpersonationLogService
    {
        ImpersonationLog GetByAuthTokenId(int AuthTokenId);
    }
}
