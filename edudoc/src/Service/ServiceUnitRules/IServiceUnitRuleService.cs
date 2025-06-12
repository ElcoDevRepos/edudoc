using Model;
using System.Collections.Generic;

namespace Service.ServiceUnitRules
{
    public interface IServiceUnitRuleService
    {
        IEnumerable<ServiceUnitTimeSegment> UpdateTimeSegments(IEnumerable<ServiceUnitTimeSegment> segments, int userId);
        void DeleteTimeSegment(int segmentId);
    }
}
