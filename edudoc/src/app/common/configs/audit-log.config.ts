import { ClaimTypes } from '@model/ClaimTypes';
import { AuditLogUserService } from '../services/audit-log-user.service';
import { IAuditLogModuleConfig } from '@mt-ng2/audit-logging-module';

export const auditLogModuleConfig: IAuditLogModuleConfig = {
    auditLogClaimTypeId: ClaimTypes.AppSettings,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    auditLogUserService: <any>AuditLogUserService,
    enabled: false,
    itemsPerPage: 10,
    minCharactersToSearchUsers: 2,
};
