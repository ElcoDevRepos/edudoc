using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using Model;
using Model.DTOs;
using Service.Base;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace Service.ServiceUnitRules
{
    public class ServiceUnitRuleService : CRUDBaseService, IServiceUnitRuleService
    {
        private readonly IPrimaryContext _context;
        private readonly IConfigurationSettings _configurationSettings;
        public ServiceUnitRuleService(IPrimaryContext context, IEmailHelper emailHelper, IConfigurationSettings configurationSettings)
            : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
            _configurationSettings = configurationSettings;
        }

        public void DeleteTimeSegment(int segmentId)
        {
            var segment = _context.ServiceUnitTimeSegments.FirstOrDefault(s => s.Id == segmentId);
            _context.ServiceUnitTimeSegments.Remove(segment);
            _context.SaveChanges();
        }

        public IEnumerable<ServiceUnitTimeSegment> UpdateTimeSegments(IEnumerable<ServiceUnitTimeSegment> segments, int userId)
        {
            var cso = new CRUDServiceOptions { currentuserid = userId };
            foreach (var s in segments)
            {
                if (s.Id == 0)
                    Create(s, cso);
                else
                    Update(s, cso);

            }

            return segments;
        }

    }
}
