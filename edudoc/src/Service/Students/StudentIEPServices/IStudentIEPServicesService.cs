using System.Collections.Generic;
using Model;
using Model.DTOs;

namespace Service.Students.StudentIEPServices
{
    public interface IStudentIEPServicesService
    {
        public (IEnumerable<IEPServiceDTO> items, int count) GetList(Model.Core.CRUDSearchParams csp, int userId);
    }
}