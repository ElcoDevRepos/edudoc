using System.Data.SqlClient;
using System.Data.SqlClient;
namespace Model.DTOs
{
    public class StudentTherapyProviderStudentsDto
    {
        public int ProviderId { get; set; }
        public int StudentId { get; set; }
        public StudentTherapyProviderStudentsDto(int providerId, int studentId)
        {
            ProviderId = providerId;
            StudentId = studentId;
        }

        public StudentTherapyProviderStudentsDto()
        {
            ProviderId = 0;
            StudentId = 0;
        }
    }
}
