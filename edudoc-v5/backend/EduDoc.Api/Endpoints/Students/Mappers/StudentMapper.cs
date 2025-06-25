using EduDoc.Api.Endpoints.Students.Models;
using EduDoc.Api.EF.Models;

namespace EduDoc.Api.Endpoints.Students.Mappers
{
    public interface IStudentMapper
    {
        StudentResponseModel Map(Student entity);
        List<StudentResponseModel> Map(List<Student> entities);
    }

    public class StudentMapper : IStudentMapper
    {
        public StudentResponseModel Map(Student entity)
        {
            return new StudentResponseModel
            {
                Id = entity.Id,
                FirstName = entity.FirstName,
                MiddleName = entity.MiddleName,
                LastName = entity.LastName,
                StudentCode = entity.StudentCode,
                MedicaidNo = entity.MedicaidNo,
                Grade = entity.Grade,
                DateOfBirth = entity.DateOfBirth,
                SchoolId = entity.SchoolId,
                DistrictId = entity.DistrictId,
                SchoolName = entity.School?.Name,
                DistrictName = entity.District?.Name
            };
        }

        public List<StudentResponseModel> Map(List<Student> entities)
        {
            return entities.Select(Map).ToList();
        }
    }
} 