using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.Students.StudentParentalConsentTypes
{
    [Route("api/v1/studentparentalconsenttypes")]
    [Restrict(ClaimTypes.Students, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class StudentParentalConsentTypesController : CrudBaseController<StudentParentalConsentType>
    {
        public StudentParentalConsentTypesController(ICRUDService crudService) : base(crudService)
        {

        }
    }
}
